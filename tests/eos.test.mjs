// Pruebas del CLI de contexto y verificación de EOS.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  stem, terms, estimateTokens, splitSections, rank, selectWithinBudget, renderPack,
  summarizeFailure, runGate, renderGate, parseOptions, main,
  riskyReason, defaultTrustStore, extractUsage, summarizeRuns, evaluateContext,
} from '../scripts/eos.mjs';

const signature = 'Pierre R. Boss (oprbguitar)';
const script = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'eos.mjs');

const fixture = async fn => {
  const root = await mkdtemp(path.join(tmpdir(), 'eos-cli-'));
  await mkdir(path.join(root, 'docs/manuals'), { recursive: true });
  await writeFile(path.join(root, 'EOS_MASTER_SYSTEM_INSTRUCTION.md'),
    `# EOS\n${signature}\n\n# 20. Login Defense\nRate limit per account and per source.\n`);
  await writeFile(path.join(root, 'docs/manuals/SECURITY-FABRIC.md'),
    `# Seguridad\n\n## 8. Login: dos límites\nLímites de login por cuenta y por origen; sesiones rotadas.\n\n## 9. Bots\nClasificación de bots.\n`);
  await writeFile(path.join(root, 'docs/manuals/PAYMENTS.md'),
    `# Pagos\n\n## 3. Webhooks\nWebhook firmado con idempotencia y conciliación.\n`);
  await writeFile(path.join(root, 'README.md'), '# Fuera del corpus\nlogin login login\n');
  await writeFile(path.join(root, 'library.json'), JSON.stringify({
    version: '9.9.9', owner: signature,
    documents: ['README.md', 'EOS_MASTER_SYSTEM_INSTRUCTION.md', 'docs/manuals/SECURITY-FABRIC.md', 'docs/manuals/PAYMENTS.md'],
  }));
  try { return await fn(root); }
  finally { await rm(root, { recursive: true, force: true }); }
};

const capture = () => {
  const io = { stdout: '', stderr: '' };
  io.out = text => { io.stdout += text; };
  io.err = text => { io.stderr += text; };
  return io;
};

test('stems Spanish and English variants to a shared root and drops stop words', () => {
  assert.equal(stem('idempotencia'), stem('idempotente'));
  assert.equal(stem('sesiones'), stem('sesion'));
  assert.equal(stem('webhooks'), 'webhook');
  assert.equal(stem('bots'), 'bots');
  assert.deepEqual(terms('Las sesiones y el Login para OAuth'), ['sesion', 'login', 'oauth']);
  assert.equal(estimateTokens('x'.repeat(37)), 10);
});

test('splits by heading levels 1-3, ignores headings inside fences and keeps line ranges', () => {
  const text = '# Título\nintro\n\n## A\nuno\n```\n## no es encabezado\n```\n### B\ndos\n#### C\ntres\n';
  const sections = splitSections(text, 'f.md');
  assert.deepEqual(sections.map(item => item.heading), ['Título', 'A', 'B']);
  assert.equal(sections[1].start, 4);
  assert.equal(sections[1].end, 8);
  assert.match(sections[2].text, /#### C/);
  assert.deepEqual(splitSections('\n\n', 'vacío.md'), []);
});

test('chunks oversized sections at paragraphs, at lines without blanks, and hard-splits long fences', () => {
  const paragraphs = `## Grande\n${Array.from({ length: 6 }, (_, i) => `${'p'.repeat(40)}${i}\n`).join('\n')}`;
  const byParagraph = splitSections(paragraphs, 'p.md', 100);
  assert.ok(byParagraph.length > 1);
  assert.match(byParagraph[0].heading, /^Grande \(parte 1\/\d+\)$/);
  assert.ok(byParagraph.every(part => part.text.length <= 200));

  const dense = `## Denso\n${Array.from({ length: 10 }, () => 'x'.repeat(30)).join('\n')}`;
  assert.ok(splitSections(dense, 'd.md', 100).length >= 3);

  const fenced = `## Código\n\`\`\`\n${Array.from({ length: 20 }, () => 'y'.repeat(30)).join('\n')}\n\`\`\``;
  const parts = splitSections(fenced, 'c.md', 100);
  assert.ok(parts.length > 1);
  assert.equal(parts.at(-1).end, 23);
});

test('ranks by BM25 with heading weight and boosts the manuals preferred by the mode', () => fixture(async root => {
  const sections = [
    { file: 'docs/manuals/SECURITY-FABRIC.md', heading: 'Login', start: 1, end: 2, text: 'login cuenta' },
    { file: 'docs/manuals/PAYMENTS.md', heading: 'Pagos', start: 1, end: 2, text: 'login pago' },
    { file: 'x.md', heading: 'Nada', start: 1, end: 2, text: 'irrelevante' },
  ];
  const plain = rank(sections, 'login', undefined);
  assert.equal(plain.length, 2);
  assert.equal(plain[0].heading, 'Login');
  const boosted = rank(sections, 'login', 'AUDIT');
  assert.equal(boosted.find(item => item.heading === 'Login').score, plain[0].score * 1.5);
  assert.equal(boosted.find(item => item.heading === 'Pagos').score, plain.find(item => item.heading === 'Pagos').score);
  assert.deepEqual(rank(sections, 'para con', 'AUDIT'), []);
  assert.ok(root);
}));

test('selects within budget and limit, skipping sections that do not fit, in reading order', () => {
  const ranked = [
    { file: 'b.md', start: 5, tokens: 50, score: 3 },
    { file: 'a.md', start: 9, tokens: 500, score: 2 },
    { file: 'a.md', start: 1, tokens: 40, score: 1 },
    { file: 'c.md', start: 1, tokens: 10, score: 0.5 },
  ];
  const { chosen, used } = selectWithinBudget(ranked, 100, 3);
  assert.deepEqual(chosen.map(item => `${item.file}:${item.start}`), ['a.md:1', 'b.md:5', 'c.md:1']);
  assert.equal(used, 100);
  assert.equal(selectWithinBudget(ranked, 1000, 1).chosen.length, 1);
});

test('renders list-only, full and empty packs with source markers', () => {
  const chosen = [{ file: 'a.md', start: 1, end: 3, heading: 'A', tokens: 5, score: 1.234, text: '## A\ntexto\n' }];
  const list = renderPack({ task: 't', mode: 'AUDIT', budget: 100, chosen, used: 5, listOnly: true });
  assert.match(list, /a\.md:1-3 — A \(~5 tokens, 1\.23\)/);
  assert.doesNotMatch(list, /\ntexto/);
  const full = renderPack({ task: 't', budget: 100, chosen, used: 5 });
  assert.match(full, /Modo: sin modo/);
  assert.match(full, /<!-- a\.md:1-3 -->\n## A\ntexto/);
  assert.match(renderPack({ task: 't', budget: 1, chosen: [], used: 0 }), /Sin coincidencias/);
});

test('summarizes failures with relevant lines, falls back to the tail and truncates long lines', () => {
  assert.deepEqual(summarizeFailure('ok\nnot ok 1 - falla\nfin\n'), ['not ok 1 - falla']);
  assert.deepEqual(summarizeFailure('✔ summarizes failures (1ms)\nok 2 - error path\n✖ real (2ms)\n'), ['✖ real (2ms)']);
  assert.deepEqual(summarizeFailure(Array.from({ length: 12 }, (_, i) => `l${i}`).join('\n')).length, 10);
  const [line] = summarizeFailure(`error ${'z'.repeat(300)}`);
  assert.equal(line.length, 200);
  assert.ok(line.endsWith('...'));
});

test('runs gate commands and renders text and eos-result JSON', () => {
  const results = runGate([
    { name: 'bien', run: 'node -e "process.exit(0)"' },
    { name: 'mal', run: 'node -e "console.error(\'Error: roto\'); process.exit(3)"' },
  ], process.cwd());
  assert.deepEqual(results.map(item => item.result), ['PASS', 'FAIL']);
  assert.equal(results[1].exit, 3);
  assert.deepEqual(results[1].detail, ['Error: roto']);
  const text = renderGate(results, false);
  assert.match(text, /PASS bien/);
  assert.match(text, /FAIL mal \([\d.]+s, salida 3\)\n {4}Error: roto/);
  assert.match(text, /FAIL: 1\/2 verificaciones/);
  const json = JSON.parse(renderGate(results, true).replace(/^```eos-result\n|```\n$/g, ''));
  assert.equal(json.status, 'FAILED');
  assert.equal(json.checks[1].note, 'Error: roto');
  assert.deepEqual(json.next, [{ item: 'Corregir mal', owner: 'eos-implementer' }]);
  const ok = JSON.parse(renderGate([results[0]], true).replace(/^```eos-result\n|```\n$/g, ''));
  assert.equal(ok.status, 'COMPLETED');
  assert.match(renderGate([results[0]], false), /PASS: 1\/1/);
});

test('parses flags and rejects unknown or incomplete options', () => {
  assert.deepEqual(parseOptions(['a', '--list', '--mode', 'AUDIT', 'b']),
    { positional: ['a', 'b'], list: true, mode: 'AUDIT' });
  assert.equal(parseOptions(['--budget']), null);
  assert.equal(parseOptions(['--desconocida']), null);
});

test('context command builds packs only from the constitution and manuals', () => fixture(async root => {
  const io = capture();
  assert.equal(await main(['context', 'login', 'sesiones', '--root', root, '--mode', 'audit', '--list'], { cwd: root, ...io }), 0);
  assert.match(io.stdout, /SECURITY-FABRIC\.md:\d+-\d+ — 8\. Login/);
  assert.match(io.stdout, /Modo: AUDIT/);
  assert.doesNotMatch(io.stdout, /README/);

  const written = capture();
  assert.equal(await main(['context', 'webhook idempotente', '--root', root, '--out', 'pack/ctx.md'], { cwd: root, ...written }), 0);
  assert.match(written.stdout, /Escrito .*ctx\.md \(~\d+ tokens\)/);
  assert.match(await readFile(path.join(root, 'pack/ctx.md'), 'utf8'), /Webhook firmado/);

  for (const args of [['context', '--root', root], ['context', 'x', '--mode', 'OTRO', '--root', root],
    ['context', 'x', '--budget', '0', '--root', root], ['context', 'x', '--limit', 'no', '--root', root], ['otro'], ['context', '--bad']]) {
    const bad = capture();
    assert.equal(await main(args, { cwd: root, ...bad }), 1);
    assert.match(bad.stderr, /Uso:/);
  }
}));

test('index command reports sections and estimated tokens', () => fixture(async root => {
  const io = capture();
  assert.equal(await main(['index', '--root', root], { cwd: root, ...io }), 0);
  const index = JSON.parse(io.stdout);
  assert.equal(index.version, '9.9.9');
  assert.equal(index.sections, index.index.length);
  assert.ok(index.index.some(item => item.heading === '20. Login Defense'));
  assert.ok(index.total_tokens > 0);
}));

test('gate command requires reviewed trust stored outside the repository before executing', () => fixture(async root => {
  const store = path.join(root, '..', `${path.basename(root)}-trust.json`);
  const io = () => Object.assign(capture(), { cwd: root, store });
  try {
    const missing = io();
    assert.equal(await main(['gate'], missing), 1);
    assert.match(missing.stderr, /Sin configuración de gate válida/);

    await writeFile(path.join(root, 'eos.gate.json'), JSON.stringify({ commands: [{ name: 'sin run' }] }));
    const empty = io();
    assert.equal(await main(['gate'], empty), 1);
    assert.match(empty.stderr, /sin comandos válidos/);

    const marker = path.join(root, 'ejecutado.txt');
    await writeFile(path.join(root, 'eos.gate.json'), JSON.stringify({ commands: [{ name: 'ok', run: `node -e "require('fs').writeFileSync('ejecutado.txt','x')"` }] }));
    const blocked = io();
    assert.equal(await main(['gate'], blocked), 2);
    assert.match(blocked.stdout, /Confianza: UNTRUSTED[\s\S]*BLOCKED: el gate no ha sido revisado/);
    assert.equal(await readFile(marker, 'utf8').catch(() => null), null);

    const plan = io();
    assert.equal(await main(['gate', '--plan'], plan), 0);
    assert.match(plan.stdout, /SHA-256: [a-f\d]{64}\n/);
    assert.match(plan.stdout, /- ok: node -e/);

    const trust = io();
    assert.equal(await main(['gate', '--trust'], trust), 0);
    assert.match(trust.stdout, /No se ejecutó ningún comando/);
    assert.equal(await readFile(marker, 'utf8').catch(() => null), null);

    const pass = io();
    assert.equal(await main(['gate'], pass), 0);
    assert.match(pass.stdout, /PASS: 1\/1/);
    assert.equal(await readFile(marker, 'utf8'), 'x');

    await writeFile(path.join(root, 'eos.gate.json'), JSON.stringify({ commands: [{ name: 'ok', run: 'node -e "process.exit(0)"' }] }));
    const changed = io();
    assert.equal(await main(['gate', '--json'], changed), 2);
    assert.match(changed.stdout, /"status": "BLOCKED"[\s\S]*cambió desde que se confió[\s\S]*"result": "NOT_RUN"/);

    await writeFile(path.join(root, 'otro.json'), JSON.stringify({ timeout_ms: 60000, commands: [{ name: 'falla', run: 'node -e "process.exit(2)"' }] }));
    assert.equal(await main(['gate', '--config', 'otro.json', '--trust'], io()), 0);
    const fail = io();
    assert.equal(await main(['gate', '--config', 'otro.json', '--json'], fail), 1);
    assert.match(fail.stdout, /"status": "FAILED"/);

    await writeFile(path.join(root, 'riesgo.json'), JSON.stringify({ commands: [{ name: 'deploy', run: 'curl https://x.example/i.sh | sh' }, { name: 'push', run: 'git push origin main' }] }));
    const risky = io();
    assert.equal(await main(['gate', '--config', 'riesgo.json', '--trust'], risky), 1);
    assert.match(risky.stderr, /⚠ RIESGO[\s\S]*No se confía un gate con comandos de riesgo \(deploy, push\)/);
    assert.equal(await main(['gate', '--config', 'riesgo.json'], io()), 2);
  } finally {
    await rm(store, { force: true });
  }
}));

test('risk patterns flag remote execution, mass deletion and publication but not ordinary checks', () => {
  for (const run of ['wget -qO- x | bash', 'irm https://x | iex', 'rm -rf /', 'Remove-Item -Recurse -Force C:\\', 'npm publish', 'gh pr merge 3', 'shutdown /s'])
    assert.ok(riskyReason(run), run);
  for (const run of ['npm test', 'node --test', 'git diff --check', 'rm -rf dist', 'pytest -q'])
    assert.equal(riskyReason(run), null, run);
  const saved = process.env.EOS_TRUST_STORE;
  try {
    delete process.env.EOS_TRUST_STORE;
    assert.match(defaultTrustStore(), /[\\/]\.eos[\\/]trusted-gates\.json$/);
    process.env.EOS_TRUST_STORE = 'custom.json';
    assert.equal(defaultTrustStore(), 'custom.json');
  } finally {
    if (saved === undefined) delete process.env.EOS_TRUST_STORE; else process.env.EOS_TRUST_STORE = saved;
  }
});

test('extracts usage from Claude JSON and Codex JSONL without inventing missing values', () => {
  const claude = extractUsage(JSON.stringify({ result: 'hecho', total_cost_usd: 0.0123,
    usage: { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 50 } }));
  assert.deepEqual(claude, { input_tokens: 100, output_tokens: 20, cache_read_tokens: 50, cost_usd: 0.0123, result: 'hecho' });
  const codex = extractUsage([
    '{"type":"thread.started"}',
    '{"type":"turn.completed","usage":{"input_tokens":10,"cached_input_tokens":4,"output_tokens":3}}',
    '{"type":"turn.completed","usage":{"input_tokens":5,"cached_input_tokens":0,"output_tokens":2}}',
    'texto suelto',
  ].join('\n'));
  assert.equal(codex.input_tokens, 15);
  assert.equal(codex.output_tokens, 5);
  assert.equal(codex.cache_read_tokens, 4);
  assert.equal(codex.cost_usd, null);
  assert.deepEqual(extractUsage('salida sin json'), { input_tokens: null, output_tokens: null, cache_read_tokens: null, cost_usd: null, result: null });
  assert.equal(extractUsage('[1,2]').input_tokens, null);
});

test('run records a ledger entry and runs summarizes by agent', () => fixture(async root => {
  const json = JSON.stringify({ result: 'respuesta', total_cost_usd: 0.5, usage: { input_tokens: 7, output_tokens: 3 } });
  const ok = capture();
  assert.equal(await main(['run', '--agent', 'eos-planner', '--task', 'plan', '--',
    'node', '-e', `"process.stdout.write(JSON.stringify(${JSON.stringify(JSON.parse(json)).replace(/"/g, '\\"')}))"`], { cwd: root, ...ok }), 0);
  assert.equal(ok.stdout, 'respuesta\n');
  assert.match(ok.stderr, /\[eos run\] run-\S+ eos-planner PASS [\d.]+s tokens 7→3 costo 0\.5/);

  const plain = capture();
  assert.equal(await main(['run', '--agent', 'eos-qa-verifier', '--ledger', 'otro/runs.jsonl', '--', 'node -e "console.log(1)"'], { cwd: root, ...plain }), 0);
  assert.match(plain.stderr, /tokens n\/d→n\/d costo n\/d/);

  const fail = capture();
  assert.equal(await main(['run', '--agent', 'eos-planner', '--', 'node -e "console.error(\'Error: x\'); process.exit(4)"'], { cwd: root, ...fail }), 1);
  assert.match(fail.stderr, /Error: x[\s\S]*FAIL/);

  const silent = capture();
  assert.equal(await main(['run', '--agent', 'eos-planner', '--', 'node -e "process.exit(5)"'], { cwd: root, ...silent }), 1);

  const lines = (await readFile(path.join(root, '.eos/runs.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
  assert.equal(lines.length, 3);
  assert.equal(lines[0].input_tokens, 7);
  assert.equal(lines[1].status, 'FAIL');

  const summary = capture();
  assert.equal(await main(['runs'], { cwd: root, ...summary }), 0);
  assert.match(summary.stdout, /eos-planner \| 3 \| 1\/3 \| 7 \| 3 \| 0\.5000 \| [\d.]+s/);
  const other = capture();
  await main(['runs', '--ledger', 'otro/runs.jsonl'], { cwd: root, ...other });
  assert.match(other.stdout, /eos-qa-verifier \| 1 \| 1\/1 \| n\/d \| n\/d \| 0\.0000/);
  const none = capture();
  await main(['runs', '--ledger', 'nada.jsonl'], { cwd: root, ...none });
  assert.match(none.stdout, /\(sin corridas\)/);
  assert.match(summarizeRuns('no json\n'), /\(sin corridas\)/);

  for (const args of [['run', '--', 'node -v'], ['run', '--agent', 'x']]) {
    const bad = capture();
    assert.equal(await main(args, { cwd: root, ...bad }), 1);
    assert.match(bad.stderr, /Uso:/);
  }
}));

test('evaluates context retrieval with recall, reciprocal rank and thresholds', () => fixture(async root => {
  const { sections } = await import('../scripts/eos.mjs').then(module => module.loadCorpus(root));
  const report = evaluateContext(sections, [
    { id: 'login', query: 'login por cuenta', mode: 'audit', expected: [{ file: 'docs/manuals/SECURITY-FABRIC.md', heading: 'Login: dos' }] },
    { id: 'nada', query: 'zzz inexistente', expected: [{ file: 'docs/manuals/PAYMENTS.md', heading: 'Webhooks' }] },
  ]);
  assert.equal(report.results[0].rr, 1);
  assert.equal(report.results[1].recall10, 0);
  assert.equal(report.recall_at_10, 0.5);

  await mkdir(path.join(root, 'evals/context'), { recursive: true });
  const cases = { thresholds: { recall_at_10: 0.4 }, cases: [
    { id: 'login', query: 'login por cuenta', mode: 'AUDIT', expected: [{ file: 'docs/manuals/SECURITY-FABRIC.md', heading: 'Login' }] },
    { id: 'parcial', query: 'webhook idempotencia', expected: [{ file: 'docs/manuals/PAYMENTS.md', heading: 'Webhooks' }, { file: 'docs/manuals/PAYMENTS.md', heading: 'no existe' }] },
    { id: 'nada', query: 'zzz', expected: [{ file: 'x.md', heading: 'y' }] },
  ] };
  await writeFile(path.join(root, 'evals/context/cases.json'), JSON.stringify(cases));
  const pass = capture();
  assert.equal(await main(['eval-context', '--root', root], { cwd: root, ...pass }), 0);
  assert.match(pass.stdout, /OK {3}login[\s\S]*PARC parcial[\s\S]*FALLO nada[\s\S]*PASS: umbrales cumplidos/);
  await writeFile(path.join(root, 'strict.json'), JSON.stringify({ ...cases, thresholds: { recall_at_10: 0.9, mrr: 0.9 } }));
  const fail = capture();
  assert.equal(await main(['eval-context', '--root', root, '--cases', 'strict.json'], { cwd: root, ...fail }), 1);
  assert.match(fail.stdout, /FAIL: bajo umbral en recall_at_10, mrr/);
  await writeFile(path.join(root, 'loose.json'), JSON.stringify({ cases: cases.cases }));
  assert.equal(await main(['eval-context', '--root', root, '--cases', 'loose.json'], { cwd: root, ...capture() }), 0);
}));

test('reports runtime errors such as a missing library manifest', () => fixture(async root => {
  const io = capture();
  assert.equal(await main(['index', '--root', path.join(root, 'docs')], { cwd: root, ...io }), 1);
  assert.match(io.stderr, /^ERROR: /);
}));

test('CLI entrypoint sets the process exit code', () => fixture(async root => {
  const ok = spawnSync(process.execPath, [script, 'context', 'login', '--root', root, '--list'], { encoding: 'utf8' });
  assert.equal(ok.status, 0);
  assert.match(ok.stdout, /Paquete de contexto EOS/);
  const bad = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(bad.status, 1);
}));
