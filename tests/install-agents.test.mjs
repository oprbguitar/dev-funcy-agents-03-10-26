// Pruebas del instalador del sistema de agentes EOS.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, stat, symlink, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { installAgents, rewriteLinks, parseArgs } from '../scripts/install-agents.mjs';

const signature = 'Pierre R. Boss (oprbguitar)';
const exists = async file => stat(file).then(() => true, () => false);

const directoryLink = (destination, link) => symlink(destination, link, process.platform === 'win32' ? 'junction' : 'dir');

test('rejects manifest traversal before creating any destination files', () => withDirs(async (source, target) => {
  const manifestFile = path.join(source, 'library.json');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  await writeFile(manifestFile, JSON.stringify({ ...manifest, documents: [...manifest.documents, '../outside.txt'] }));
  await assert.rejects(installAgents({ source, target }), /ruta|path/i);
  assert.deepEqual(await readdir(target), []);
}));

test('rejects a destination junction before any snapshot or outside write', () => withDirs(async (source, target) => {
  const outside = await mkdtemp(path.join(tmpdir(), 'eos-outside-'));
  try {
    await directoryLink(outside, path.join(target, '.agents'));
    await assert.rejects(installAgents({ source, target, host: 'codex' }), /enlace|ruta/i);
    assert.equal(await exists(path.join(target, '.eos')), false);
    assert.deepEqual(await readdir(outside), []);
  } finally { await rm(outside, { recursive: true, force: true }); }
}));

test('rejects backup junctions without deleting their external contents', () => withDirs(async (source, target) => {
  await installAgents({ source, target });
  const outside = await mkdtemp(path.join(tmpdir(), 'eos-outside-'));
  try {
    await writeFile(path.join(outside, 'sentinel.txt'), 'keep');
    await directoryLink(outside, path.join(target, '.eos/.update-backup'));
    await bumpLibrary(source, '4.0.0', 'new');
    const before = await readFile(path.join(target, '.eos/library.json'), 'utf8');
    await assert.rejects(installAgents({ source, target, update: true }), /enlace|ruta/i);
    assert.equal(await readFile(path.join(target, '.eos/library.json'), 'utf8'), before);
    assert.equal(await readFile(path.join(outside, 'sentinel.txt'), 'utf8'), 'keep');
  } finally { await rm(outside, { recursive: true, force: true }); }
}));

test('accepts an explicitly selected canonical target junction and a not-yet-created target', () => withDirs(async (source, target) => {
  const links = await mkdtemp(path.join(tmpdir(), 'eos-links-'));
  try {
    const alias = path.join(links, 'target');
    await directoryLink(target, alias);
    await installAgents({ source, target: alias, host: 'codex' });
    assert.ok(await exists(path.join(target, '.eos/install-manifest.json')));
    await installAgents({ source, target: path.join(links, 'new/nested'), host: 'codex' });
    assert.ok(await exists(path.join(links, 'new/nested/.eos/install-manifest.json')));
    const sourceAlias = path.join(links, 'source');
    await directoryLink(source, sourceAlias);
    await assert.rejects(installAgents({ source, target: sourceAlias }), /origen/);
  } finally { await rm(links, { recursive: true, force: true }); }
}));

test('validates all manifest surfaces and portable unsafe path forms', () => withDirs(async (source, target) => {
  const file = path.join(source, 'library.json');
  const original = JSON.parse(await readFile(file, 'utf8'));
  for (const invalid of ['../outside', '/absolute', 'C:/outside', 'dir\\outside', 'dir/../outside', 'dir//file', 'dir/.. /outside', 'CON.txt', '.update-backup/file', 'install-manifest.json']) {
    for (const key of ['documents', 'agents', 'sources']) {
      const item = key === 'sources' ? { path: invalid } : invalid;
      await writeFile(file, JSON.stringify({ ...original, [key]: [...original[key], item] }));
      await assert.rejects(installAgents({ source, target, dryRun: true }), /ruta/i, `${key}: ${invalid}`);
    }
  }
  assert.deepEqual(await readdir(target), []);
}));

test('rejects source junctions before copying external content', () => withDirs(async (source, target) => {
  const outside = await mkdtemp(path.join(tmpdir(), 'eos-outside-'));
  try {
    await writeFile(path.join(outside, 'PRIME.md'), 'private');
    await rm(path.join(source, 'docs/manuals'), { recursive: true });
    await directoryLink(outside, path.join(source, 'docs/manuals'));
    await assert.rejects(installAgents({ source, target }), /enlace/i);
    assert.deepEqual(await readdir(target), []);
  } finally { await rm(outside, { recursive: true, force: true }); }
}));

test('rejects nested backup junctions and conflict proposals before the first write', () => withDirs(async (source, target) => {
  await installAgents({ source, target });
  const outside = await mkdtemp(path.join(tmpdir(), 'eos-outside-'));
  try {
    await mkdir(path.join(target, '.eos/.update-backup'), { recursive: true });
    await directoryLink(outside, path.join(target, '.eos/.update-backup/nested'));
    await assert.rejects(installAgents({ source, target, update: true }), /enlace/i);
    await rm(path.join(target, '.eos/.update-backup/nested'));
    await writeFile(path.join(target, '.agents/eos-agents/eos-demo.md'), 'local');
    await directoryLink(outside, path.join(target, '.agents/eos-agents/eos-demo.md.eos-new'));
    await assert.rejects(installAgents({ source, target, update: true }), /enlace/i);
    assert.deepEqual(await readdir(outside), []);
  } finally { await rm(outside, { recursive: true, force: true }); }
}));

test('rolls back contents when the final installation record write fails', () => withDirs(async (source, target) => {
  await installAgents({ source, target });
  const record = path.join(target, '.eos/install-manifest.json');
  const before = await readFile(record, 'utf8');
  const agent = path.join(target, '.agents/eos-agents/eos-demo.md');
  const agentBefore = await readFile(agent, 'utf8');
  await bumpLibrary(source, '4.0.0', 'new version');
  const hooks = { beforeWrite: relative => { if (relative === '.eos/install-manifest.json') throw new Error('record failure'); } };
  await assert.rejects(installAgents({ source, target, update: true, hooks }), /revertida.*record failure/);
  assert.equal(await readFile(record, 'utf8'), before);
  assert.equal(await readFile(agent, 'utf8'), agentBefore);
}));

test('deduplicates document/source/extra destinations and restores the original baseline on rollback', () => withDirs(async (source, target) => {
  const manifestPath = path.join(source, 'library.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  await writeFile(path.join(source, 'LICENSE'), 'original license');
  await writeFile(manifestPath, JSON.stringify({ ...manifest,
    documents: [...manifest.documents, 'LICENSE', 'LICENSE'],
    sources: [...manifest.sources, { path: 'LICENSE' }] }));
  const initial = await installAgents({ source, target });
  assert.equal(initial.created.filter(file => file === '.eos/LICENSE').length, 1);
  await writeFile(path.join(source, 'LICENSE'), 'updated license');
  const plan = await installAgents({ source, target, update: true, dryRun: true });
  assert.equal(plan.updated.filter(file => file === '.eos/LICENSE').length, 1);
  const hooks = { beforeWrite: relative => { if (relative === '.eos/install-manifest.json') throw new Error('record failure'); } };
  await assert.rejects(installAgents({ source, target, update: true, hooks }), /record failure/);
  assert.equal(await readFile(path.join(target, '.eos/LICENSE'), 'utf8'), 'original license');
  assert.equal(await readFile(path.join(target, '.eos/.update-backup/.eos/LICENSE'), 'utf8'), 'original license');
}));

test('rejects different agents mapped to the same host filename before creating files', () => withDirs(async (source, target) => {
  await mkdir(path.join(source, 'other'));
  await writeFile(path.join(source, 'other/eos-demo.md'), 'different agent');
  const file = path.join(source, 'library.json');
  const manifest = JSON.parse(await readFile(file, 'utf8'));
  await writeFile(file, JSON.stringify({ ...manifest, agents: [...manifest.agents, 'other/eos-demo.md'] }));
  await assert.rejects(installAgents({ source, target }), /colisión/i);
  assert.deepEqual(await readdir(target), []);
}));

test('rejects Windows case aliases of the same planned destination', { skip: process.platform !== 'win32' }, () => withDirs(async (source, target) => {
  const file = path.join(source, 'library.json');
  const manifest = JSON.parse(await readFile(file, 'utf8'));
  await writeFile(file, JSON.stringify({ ...manifest, documents: [...manifest.documents, 'agents/EOS-DEMO.md'] }));
  await assert.rejects(installAgents({ source, target }), /colisión/i);
  assert.deepEqual(await readdir(target), []);
}));

test('CLI rejects a physical escape and leaves the project untouched', () => withDirs(async (source, target) => {
  const outside = await mkdtemp(path.join(tmpdir(), 'eos-outside-'));
  try {
    await directoryLink(outside, path.join(target, '.eos'));
    const run = spawnSync(process.execPath, [path.resolve('scripts/install-agents.mjs'), '--source', source, '--target', target], { encoding: 'utf8' });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /ERROR:.*Enlace/);
    assert.deepEqual(await readdir(outside), []);
    assert.equal(await exists(path.join(target, 'AGENTS.md')), false);
  } finally { await rm(outside, { recursive: true, force: true }); }
}));

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

test('update is transactional: a failure mid-way restores every file and leaves the manifest untouched', () => withDirs(async (source, target) => {
  await installAgents({ source, target, host: 'claude' });
  const record = path.join(target, '.eos/install-manifest.json');
  const before = await readFile(record, 'utf8');
  const agent = path.join(target, '.claude/agents/eos-demo.md');
  const originalAgent = await readFile(agent, 'utf8');
  await bumpLibrary(source, '4.0.0', 'versión nueva');
  await writeFile(path.join(source, 'docs/manuals/PRIME.md'), `# Prime v2\n${signature}\n`);
  await writeFile(path.join(source, 'docs/manuals/NUEVO.md'), `# Nuevo\n${signature}\n`);
  const manifest = JSON.parse(await readFile(path.join(source, 'library.json'), 'utf8'));
  await writeFile(path.join(source, 'library.json'), JSON.stringify({ ...manifest, documents: [...manifest.documents, 'docs/manuals/NUEVO.md'] }));

  let writes = 0;
  const hooks = { beforeWrite: async relative => { writes += 1; if (relative === '.claude/agents/eos-demo.md') throw new Error('disco lleno simulado'); } };
  await assert.rejects(installAgents({ source, target, host: 'claude', update: true, hooks }), /Actualización revertida sin cambios: disco lleno simulado/);
  assert.ok(writes > 2);
  assert.equal(await readFile(agent, 'utf8'), originalAgent);
  assert.match(await readFile(path.join(target, '.eos/docs/manuals/PRIME.md'), 'utf8'), /^# Prime\n/);
  assert.equal(await exists(path.join(target, '.eos/docs/manuals/NUEVO.md')), false);
  assert.equal(await readFile(record, 'utf8'), before);

  const ok = await installAgents({ source, target, host: 'claude', update: true });
  assert.ok(ok.created.includes('.eos/docs/manuals/NUEVO.md'));
  assert.match(await readFile(agent, 'utf8'), /versión nueva/);
  assert.match(await readFile(path.join(target, '.eos/.update-backup/.claude/agents/eos-demo.md'), 'utf8'), /Prime/);
}));

test('adds an EOS block to .gitignore for local artifacts and renews it on update without duplicating', () => withDirs(async (source, target) => {
  await writeFile(path.join(target, '.gitignore'), 'node_modules/\n');
  await installAgents({ source, target, host: 'codex' });
  const ignore = await readFile(path.join(target, '.gitignore'), 'utf8');
  assert.ok(ignore.startsWith('node_modules/\n'));
  for (const rule of ['.eos/context*.md', '.eos/runs*.jsonl', '.eos/.update-backup/', '*.eos-new']) assert.ok(ignore.includes(`\n${rule}\n`), rule);
  await installAgents({ source, target, host: 'codex', update: true });
  const again = await readFile(path.join(target, '.gitignore'), 'utf8');
  assert.equal(again.match(/EOS:BEGIN/g).length, 1);
  assert.equal(again, ignore);
}));

test('legacy updates report files assumed to belong to EOS and keep their previous version as backup', () => withDirs(async (source, target) => {
  await installAgents({ source, target, host: 'claude' });
  const record = path.join(target, '.eos/install-manifest.json');
  const legacy = JSON.parse(await readFile(record, 'utf8'));
  delete legacy.files;
  await writeFile(record, JSON.stringify(legacy));
  await writeFile(path.join(target, '.eos/docs/manuals/PRIME.md'), '# Prime personalizado\n');
  await writeFile(path.join(source, 'docs/manuals/PRIME.md'), `# Prime v2\n${signature}\n`);
  const result = await installAgents({ source, target, host: 'claude', update: true });
  assert.deepEqual(result.legacy, ['.eos/docs/manuals/PRIME.md']);
  assert.equal(await readFile(path.join(target, '.eos/.update-backup/.eos/docs/manuals/PRIME.md'), 'utf8'), '# Prime personalizado\n');
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'install-agents.mjs');
  delete legacy.files;
  await writeFile(record, JSON.stringify(legacy));
  await writeFile(path.join(source, 'docs/manuals/PRIME.md'), `# Prime v3\n${signature}\n`);
  const run = spawnSync(process.execPath, [script, '--source', source, '--target', target, '--host', 'claude', '--update', '--dry-run'], { encoding: 'utf8' });
  assert.match(run.stdout, /Aviso: 1 archivos de \.eos\/ sin hash previo/);
}));

test('discovers new lifecycle skills and installs licensed animation assets with safe updates', () => withDirs(async (source, target) => {
  const manifestPath = path.join(source, 'library.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const name of ['eos-privacy-review', 'eos-landing-brand', 'eos-desktop-release']) {
    await mkdir(path.join(source, 'skills', name), { recursive: true });
    const file = `skills/${name}/SKILL.md`;
    await writeFile(path.join(source, file), `---\nname: ${name}\ndescription: lifecycle\n---\n${signature}\n`);
    manifest.documents.push(file);
  }
  await writeFile(manifestPath, JSON.stringify(manifest));
  await mkdir(path.join(source, 'docs/assets'), { recursive: true });
  await writeFile(path.join(source, 'LICENSE'), 'MIT v1');
  await writeFile(path.join(source, 'docs/assets/eos-strategy-flow.gif'), '<svg>v1</svg>');
  await installAgents({ source, target });
  for (const name of ['eos-privacy-review', 'eos-landing-brand', 'eos-desktop-release']) {
    assert.ok(await exists(path.join(target, '.agents/skills', name, 'SKILL.md')));
    assert.ok(await exists(path.join(target, '.claude/skills', name, 'SKILL.md')));
  }
  assert.equal(await readFile(path.join(target, '.eos/LICENSE'), 'utf8'), 'MIT v1');
  assert.equal(await readFile(path.join(target, '.eos/docs/assets/eos-strategy-flow.gif'), 'utf8'), '<svg>v1</svg>');
  await writeFile(path.join(source, 'LICENSE'), 'MIT v2');
  await writeFile(path.join(target, '.eos/docs/assets/eos-strategy-flow.gif'), '<svg>local</svg>');
  await writeFile(path.join(source, 'docs/assets/eos-strategy-flow.gif'), '<svg>v2</svg>');
  const updated = await installAgents({ source, target, update: true });
  assert.ok(updated.updated.includes('.eos/LICENSE'));
  assert.ok(updated.conflicts.includes('.eos/docs/assets/eos-strategy-flow.gif'));
  assert.equal(await readFile(path.join(target, '.eos/docs/assets/eos-strategy-flow.gif'), 'utf8'), '<svg>local</svg>');
  assert.equal(await readFile(path.join(target, '.eos/docs/assets/eos-strategy-flow.gif.eos-new'), 'utf8'), '<svg>v2</svg>');
}));

test('copies an optional library gate only inside the snapshot without activating a product gate', () => withDirs(async (source, target) => {
  const gate = JSON.stringify({ checks: [{ name: 'library-reference', command: 'node library-only.mjs' }] });
  await writeFile(path.join(source, 'eos.gate.json'), gate);
  await installAgents({ source, target });
  assert.equal(await readFile(path.join(target, '.eos/eos.gate.json'), 'utf8'), gate);
  assert.equal(await exists(path.join(target, 'eos.gate.json')), false);
  assert.match(await readFile(path.join(target, 'AGENTS.md'), 'utf8'), /referencia de la biblioteca/);
}));
