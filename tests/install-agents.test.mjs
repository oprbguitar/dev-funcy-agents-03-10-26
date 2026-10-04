// Pruebas del instalador del sistema de agentes EOS.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { installAgents, rewriteLinks, parseArgs } from '../scripts/install-agents.mjs';

const signature = 'Pierre R. Boss (oprbguitar)';
const exists = async file => stat(file).then(() => true, () => false);

const library = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'eos-src-'));
  await mkdir(path.join(root, 'agents'), { recursive: true });
  await mkdir(path.join(root, 'skills/eos-audit'), { recursive: true });
  await mkdir(path.join(root, 'docs/manuals'), { recursive: true });
  await mkdir(path.join(root, 'docs/sources'), { recursive: true });
  await writeFile(path.join(root, 'AGENTS.md'), `# AGENTS\n${signature}\n`);
  await writeFile(path.join(root, 'docs/manuals/PRIME.md'), `# Prime\n${signature}\n`);
  await writeFile(path.join(root, 'docs/sources/SRC.txt'), 'fuente\n');
  await writeFile(path.join(root, 'docs/sources/source-index.json'), '{}\n');
  await mkdir(path.join(root, 'scripts'), { recursive: true });
  await writeFile(path.join(root, 'scripts/eos.mjs'), `// ${signature}\n`);
  await writeFile(path.join(root, 'agents/README.md'), `# Agentes\n${signature}\n`);
  await writeFile(path.join(root, 'agents/eos-demo.md'),
    `---\nname: eos-demo\ndescription: demo\n---\n${signature}\n[Prime](../docs/manuals/PRIME.md) [Web](https://example.com) [Top](#a)\n`);
  await writeFile(path.join(root, 'skills/eos-audit/SKILL.md'),
    `---\nname: eos-audit\ndescription: audit\n---\n${signature}\n[Prime](../../docs/manuals/PRIME.md)\n`);
  await writeFile(path.join(root, 'library.json'), JSON.stringify({
    version: '3.0.0', owner: signature,
    documents: ['AGENTS.md', 'docs/manuals/PRIME.md', 'agents/README.md', 'agents/eos-demo.md', 'skills/eos-audit/SKILL.md'],
    sources: [{ id: 'SRC', path: 'docs/sources/SRC.txt', sha256: '0'.repeat(64) }],
    agents: ['agents/eos-demo.md'],
  }));
  return root;
};

const withDirs = async fn => {
  const source = await library();
  const target = await mkdtemp(path.join(tmpdir(), 'eos-dst-'));
  try { return await fn(source, target); }
  finally {
    await rm(source, { recursive: true, force: true });
    await rm(target, { recursive: true, force: true });
  }
};

test('installs snapshot, Claude agents and skills with rewritten links and a manifest', () => withDirs(async (source, target) => {
  const result = await installAgents({ source, target, host: 'claude' });
  assert.ok(await exists(path.join(target, '.eos/docs/manuals/PRIME.md')));
  assert.ok(await exists(path.join(target, '.eos/docs/sources/SRC.txt')));
  assert.ok(await exists(path.join(target, '.eos/docs/sources/source-index.json')));
  assert.equal(await exists(path.join(target, '.eos/.claude-plugin/plugin.json')), false);
  const agent = await readFile(path.join(target, '.claude/agents/eos-demo.md'), 'utf8');
  assert.match(agent, /\(\.\.\/\.\.\/\.eos\/docs\/manuals\/PRIME\.md\)/);
  assert.match(agent, /\(https:\/\/example\.com\)/);
  assert.match(agent, /\(#a\)/);
  const skill = await readFile(path.join(target, '.claude/skills/eos-audit/SKILL.md'), 'utf8');
  assert.match(skill, /\(\.\.\/\.\.\/\.\.\/\.eos\/docs\/manuals\/PRIME\.md\)/);
  assert.match(await readFile(path.join(target, 'AGENTS.md'), 'utf8'), /EOS:BEGIN[\s\S]*oprbguitar[\s\S]*EOS:END/);
  // El bloque instalado apunta al núcleo ligero y deja la constitución completa para carga por secciones.
  assert.match(await readFile(path.join(target, 'AGENTS.md'), 'utf8'),
    /Núcleo obligatorio: `\.eos\/EOS-CORE\.md`[\s\S]*solo por secciones/);
  // El CLI de contexto y verificación viaja con la instantánea y el bloque explica cómo usarlo.
  assert.ok(await exists(path.join(target, '.eos/scripts/eos.mjs')));
  assert.match(await readFile(path.join(target, 'AGENTS.md'), 'utf8'),
    /node \.eos\/scripts\/eos\.mjs context[\s\S]*node \.eos\/scripts\/eos\.mjs gate/);
  assert.match(await readFile(path.join(target, 'CLAUDE.md'), 'utf8'), /@AGENTS\.md/);
  const manifest = JSON.parse(await readFile(path.join(target, '.eos/install-manifest.json'), 'utf8'));
  assert.equal(manifest.version, '3.0.0');
  assert.ok(manifest.created.includes('.claude/agents/eos-demo.md'));
  assert.equal(result.skipped.length, 0);
}));

test('installs Codex skills under .agents and roles under .agents/eos-agents', () => withDirs(async (source, target) => {
  await installAgents({ source, target, host: 'codex' });
  assert.ok(await exists(path.join(target, '.agents/skills/eos-audit/SKILL.md')));
  assert.ok(await exists(path.join(target, '.agents/eos-agents/eos-demo.md')));
  assert.equal(await exists(path.join(target, '.claude')), false);
  assert.equal(await exists(path.join(target, 'CLAUDE.md')), false);
}));

test('never overwrites existing files and keeps existing instructions intact', () => withDirs(async (source, target) => {
  await mkdir(path.join(target, '.claude/agents'), { recursive: true });
  await writeFile(path.join(target, '.claude/agents/eos-demo.md'), 'personalizado\n');
  await writeFile(path.join(target, 'AGENTS.md'), '# Reglas locales\n');
  await writeFile(path.join(target, 'CLAUDE.md'), '# Claude local\n');
  const result = await installAgents({ source, target, host: 'all' });
  assert.equal(await readFile(path.join(target, '.claude/agents/eos-demo.md'), 'utf8'), 'personalizado\n');
  assert.ok(result.skipped.includes('.claude/agents/eos-demo.md'));
  const agents = await readFile(path.join(target, 'AGENTS.md'), 'utf8');
  assert.ok(agents.startsWith('# Reglas locales\n'));
  assert.match(agents, /EOS:BEGIN/);
  assert.match(await readFile(path.join(target, 'CLAUDE.md'), 'utf8'), /^# Claude local\n[\s\S]*@AGENTS\.md/);
  const again = await installAgents({ source, target, host: 'all' });
  assert.equal(again.created.length, 0);
  assert.equal((await readFile(path.join(target, 'AGENTS.md'), 'utf8')).match(/EOS:BEGIN/g).length, 1);
}));

test('dry run reports planned files without writing anything', () => withDirs(async (source, target) => {
  const result = await installAgents({ source, target, host: 'all', dryRun: true });
  assert.ok(result.created.length > 0);
  assert.equal(await exists(path.join(target, '.eos')), false);
  assert.equal(await exists(path.join(target, 'AGENTS.md')), false);
}));

test('refuses to install into the source library or inside it', () => withDirs(async source => {
  await assert.rejects(installAgents({ source, target: source, host: 'all' }), /origen/);
  await assert.rejects(installAgents({ source, target: path.join(source, 'sub'), host: 'all' }), /origen/);
}));

test('rejects unknown hosts and missing manifests', () => withDirs(async (source, target) => {
  await assert.rejects(installAgents({ source, target, host: 'other' }), /host/);
  await rm(path.join(source, 'library.json'));
  await assert.rejects(installAgents({ source, target, host: 'all' }), /library.json/);
}));

test('rewriteLinks keeps external, anchor, unresolved and outside links unchanged', () => {
  const src = path.join('/lib', 'agents', 'a.md');
  const dst = path.join('/dst', '.claude', 'agents', 'a.md');
  const text = '[a](../x.md) [b](http://e.com) [c](#h) [d](../../outside.md) [e](<../y z.md>)';
  const out = rewriteLinks(text, src, dst, '/lib', path.join('/dst', '.eos'));
  assert.match(out, /\[a\]\(\.\.\/\.\.\/\.eos\/x\.md\)/);
  assert.match(out, /\[b\]\(http:\/\/e\.com\)/);
  assert.match(out, /\[c\]\(#h\)/);
  assert.match(out, /\[d\]\(\.\.\/\.\.\/outside\.md\)/);
  assert.match(out, /\[e\]\(<\.\.\/\.\.\/\.eos\/y z\.md>\)/);
});

test('parseArgs validates options', () => {
  assert.deepEqual(parseArgs(['--target', 'x']), { target: 'x', host: 'all', dryRun: false });
  assert.deepEqual(parseArgs(['--target', 'x', '--host', 'codex', '--dry-run']), { target: 'x', host: 'codex', dryRun: true });
  assert.equal(parseArgs([]), null);
  assert.equal(parseArgs(['--target']), null);
  assert.equal(parseArgs(['--bogus']), null);
  assert.equal(parseArgs(['--target', 'x', '--host']), null);
});

test('CLI installs end to end and rejects bad usage', () => withDirs(async (source, target) => {
  const script = path.resolve('scripts/install-agents.mjs');
  const bad = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /Uso/);
  const dry = spawnSync(process.execPath, [script, '--target', target, '--dry-run', '--source', source], { encoding: 'utf8' });
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /Simulación: se crearían \d+ archivos; \d+ existentes no se modificarían/);
  const run = spawnSync(process.execPath, [script, '--target', target, '--host', 'codex', '--source', source], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /creados/);
  const refused = spawnSync(process.execPath, [script, '--target', source, '--source', source], { encoding: 'utf8' });
  assert.equal(refused.status, 1);
}));

const bumpLibrary = async (source, version, agentText) => {
  const manifest = JSON.parse(await readFile(path.join(source, 'library.json'), 'utf8'));
  await writeFile(path.join(source, 'library.json'), JSON.stringify({ ...manifest, version }));
  await writeFile(path.join(source, 'agents/eos-demo.md'), `---\nname: eos-demo\ndescription: demo\n---\n${signature}\n${agentText}\n`);
};

test('records file hashes so a later update can tell untouched files from local edits', () => withDirs(async (source, target) => {
  await installAgents({ source, target, host: 'claude' });
  const manifest = JSON.parse(await readFile(path.join(target, '.eos/install-manifest.json'), 'utf8'));
  assert.match(manifest.files['.claude/agents/eos-demo.md'], /^[a-f\d]{64}$/);
  assert.match(manifest.files['.eos/AGENTS.md'], /^[a-f\d]{64}$/);
}));

test('update replaces untouched files, keeps local edits as conflicts and refreshes the EOS block', () => withDirs(async (source, target) => {
  await writeFile(path.join(target, 'AGENTS.md'), '# Reglas locales\n');
  await installAgents({ source, target, host: 'claude' });
  await writeFile(path.join(target, '.claude/skills/eos-audit/SKILL.md'), 'editado por el equipo\n');
  await bumpLibrary(source, '4.0.0', 'versión nueva');
  await writeFile(path.join(source, 'skills/eos-audit/SKILL.md'), `---\nname: eos-audit\ndescription: audit\n---\n${signature}\nnueva skill\n`);

  const plan = await installAgents({ source, target, host: 'claude', update: true, dryRun: true });
  assert.ok(plan.updated.includes('.claude/agents/eos-demo.md'));
  assert.ok(plan.conflicts.includes('.claude/skills/eos-audit/SKILL.md'));
  assert.match(await readFile(path.join(target, '.claude/agents/eos-demo.md'), 'utf8'), /Prime/);

  const result = await installAgents({ source, target, host: 'claude', update: true });
  assert.match(await readFile(path.join(target, '.claude/agents/eos-demo.md'), 'utf8'), /versión nueva/);
  assert.equal(await readFile(path.join(target, '.claude/skills/eos-audit/SKILL.md'), 'utf8'), 'editado por el equipo\n');
  assert.match(await readFile(path.join(target, '.claude/skills/eos-audit/SKILL.md.eos-new'), 'utf8'), /nueva skill/);
  assert.ok(result.unchanged.includes('.eos/docs/manuals/PRIME.md'));
  const agents = await readFile(path.join(target, 'AGENTS.md'), 'utf8');
  assert.ok(agents.startsWith('# Reglas locales\n'));
  assert.match(agents, /## EOS 4\.0\.0/);
  assert.doesNotMatch(agents, /## EOS 3\.0\.0/);
  assert.equal(agents.match(/EOS:BEGIN/g).length, 1);
  const manifest = JSON.parse(await readFile(path.join(target, '.eos/install-manifest.json'), 'utf8'));
  assert.equal(manifest.version, '4.0.0');

  const again = await installAgents({ source, target, host: 'claude', update: true });
  assert.equal(again.updated.length, 0);
  assert.ok(again.conflicts.includes('.claude/skills/eos-audit/SKILL.md'));
}));

test('update treats legacy installs without hashes as EOS-owned only inside .eos and reports removals', () => withDirs(async (source, target) => {
  await installAgents({ source, target, host: 'claude' });
  const record = path.join(target, '.eos/install-manifest.json');
  const legacy = JSON.parse(await readFile(record, 'utf8'));
  delete legacy.files;
  legacy.created.push('.claude/agents/eos-retirado.md');
  await writeFile(record, JSON.stringify(legacy));
  await writeFile(path.join(source, 'docs/manuals/PRIME.md'), `# Prime v2\n${signature}\n`);
  await bumpLibrary(source, '4.0.0', 'versión nueva');
  const result = await installAgents({ source, target, host: 'claude', update: true });
  assert.ok(result.updated.includes('.eos/docs/manuals/PRIME.md'));
  assert.ok(result.conflicts.includes('.claude/agents/eos-demo.md'));
  assert.ok(result.removed.includes('.claude/agents/eos-retirado.md'));
  assert.match(await readFile(path.join(target, '.eos/docs/manuals/PRIME.md'), 'utf8'), /Prime v2/);
}));

test('update creates missing files and appends the block when absent', () => withDirs(async (source, target) => {
  const result = await installAgents({ source, target, host: 'codex', update: true });
  assert.ok(result.created.includes('.agents/eos-agents/eos-demo.md'));
  assert.match(await readFile(path.join(target, 'AGENTS.md'), 'utf8'), /EOS:BEGIN/);
  assert.deepEqual(parseArgs(['--target', 'x', '--update']), { target: 'x', host: 'all', dryRun: false, update: true });
}));

test('CLI prints the update plan by category', () => withDirs(async (source, target) => {
  await installAgents({ source, target, host: 'claude' });
  await bumpLibrary(source, '4.0.0', 'versión nueva');
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'install-agents.mjs');
  const run = spawnSync(process.execPath, [script, '--source', source, '--target', target, '--host', 'claude', '--update', '--dry-run'], { encoding: 'utf8' });
  assert.equal(run.status, 0);
  assert.match(run.stdout, /Simulación de actualización/);
  assert.match(run.stdout, /~ \.claude\/agents\/eos-demo\.md \(actualizado\)/);
}));
