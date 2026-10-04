// Pruebas del validador de la biblioteca EOS.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { validateLibrary } from '../scripts/validate-library.mjs';

const signature = 'Pierre R. Boss (oprbguitar)';
const sha256 = data => createHash('sha256').update(data).digest('hex');
const fixture = async fn => {
  const root = await mkdtemp(path.join(tmpdir(), 'eos-library-'));
  const source = 'Conversación fuente.\n';
  await mkdir(path.join(root, 'docs/sources'), { recursive: true });
  await writeFile(path.join(root, 'README.md'), `# EOS\n\n${signature}\n\n[Guía](guide.md)\n`);
  await writeFile(path.join(root, 'guide.md'), `# Guía\n\n${signature}\n\n\`\`\`text\n[Ejemplo](does-not-exist.md)\n\`\`\`\n`);
  await writeFile(path.join(root, 'docs/sources/SRC-01.txt'), source);
  await writeFile(path.join(root, 'library.json'), JSON.stringify({
    version: '2.0.0', owner: signature,
    documents: ['README.md', 'guide.md'],
    sources: [{ id: 'SRC-01', path: 'docs/sources/SRC-01.txt', sha256: sha256(source) }],
  }));
  try { return await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
};

test('accepts a signed library and ignores illustrative links in fenced code', () =>
  fixture(async root => assert.deepEqual((await validateLibrary(root)).errors, [])));

test('rejects broken local links including URI-encoded paths', () => fixture(async root => {
  await writeFile(path.join(root, 'guide.md'), `# Guía\n${signature}\n[Missing](missing%20file.md)\n`);
  assert.match((await validateLibrary(root)).errors.join('\n'), /missing file.md/);
}));

test('accepts external links, fragments, angle paths and existing directory links', () => fixture(async root => {
  await writeFile(path.join(root, 'space file.md'), '# Referencia\n');
  await writeFile(path.join(root, 'guide.md'), `# Guía\n${signature}\n[URL](https://example.com) [mail](mailto:a@example.com) [A](#section) [P](<space file.md>) [D](docs/)\n`);
  assert.deepEqual((await validateLibrary(root)).errors, []);
}));

test('rejects missing documented file and absent owner signature', () => fixture(async root => {
  await rm(path.join(root, 'guide.md'));
  await writeFile(path.join(root, 'README.md'), '# Unsigned\n');
  const errors = (await validateLibrary(root)).errors.join('\n');
  assert.match(errors, /guide.md/);
  assert.match(errors, /firma/);
}));

test('rejects modified or missing source archives', () => fixture(async root => {
  await writeFile(path.join(root, 'docs/sources/SRC-01.txt'), 'changed');
  assert.match((await validateLibrary(root)).errors.join('\n'), /SHA-256/);
  await rm(path.join(root, 'docs/sources/SRC-01.txt'));
  assert.match((await validateLibrary(root)).errors.join('\n'), /SRC-01/);
}));

test('rejects unbalanced backtick and tilde fences', () => fixture(async root => {
  await writeFile(path.join(root, 'guide.md'), `# Guía\n${signature}\n~~~json\n{}\n`);
  assert.match((await validateLibrary(root)).errors.join('\n'), /fence/);
}));

test('rejects unsafe manifest paths and duplicated source ids', () => fixture(async root => {
  await writeFile(path.join(root, 'library.json'), JSON.stringify({
    version: '2', owner: signature, documents: ['../outside.md', '/absolute.md'],
    sources: [{ id: 'SRC-01', path: '../secret', sha256: 'bad' }, { id: 'SRC-01', path: 'guide.md', sha256: 'bad' }],
  }));
  const errors = (await validateLibrary(root)).errors.join('\n');
  assert.match(errors, /fuera/);
  assert.match(errors, /duplicado/);
  assert.match(errors, /hash inválido/);
}));

test('reports malformed or missing manifest rather than crashing', () => fixture(async root => {
  await writeFile(path.join(root, 'library.json'), '{bad');
  assert.match((await validateLibrary(root)).errors.join('\n'), /library.json/);
  await rm(path.join(root, 'library.json'));
  assert.match((await validateLibrary(root)).errors.join('\n'), /library.json/);
}));

test('validates manifest shape and document duplicates', () => fixture(async root => {
  for (const value of [null, {}, {version: '2', owner: signature, documents: [], sources: []},
    {version: '2', owner: signature, documents: ['README.md', 'README.md'], sources: []}]) {
    await writeFile(path.join(root, 'library.json'), JSON.stringify(value));
    assert.ok((await validateLibrary(root)).errors.length > 0);
  }
}));

test('rejects repository-escaping local links and invalid encoding', () => fixture(async root => {
  await writeFile(path.join(root, 'guide.md'), `# Guía\n${signature}\n[Out](../other.md) [Bad](%ZZ.md)\n`);
  const errors = (await validateLibrary(root)).errors.join('\n');
  assert.match(errors, /fuera/);
  assert.match(errors, /codificación/);
}));

test('CLI verifies fixture end to end and returns nonzero for corrupt source', () => fixture(async root => {
  const script = path.resolve('scripts/validate-library.mjs');
  const valid = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /PASS/);
  await writeFile(path.join(root, 'docs/sources/SRC-01.txt'), 'tampered');
  const invalid = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /SHA-256/);
}));

test('CLI rejects unknown options', () => {
  const run = spawnSync(process.execPath, ['scripts/validate-library.mjs', '--bogus'], {encoding: 'utf8'});
  assert.equal(run.status, 1);
});

const requireDepth = async (root, requirements) => {
  const manifest = JSON.parse(await readFile(path.join(root, 'library.json'), 'utf8'));
  await writeFile(path.join(root, 'library.json'), JSON.stringify({ ...manifest, module_requirements: requirements }));
};

test('module depth excludes blank lines, headings, fences and structural punctuation', () => fixture(async root => {
  await writeFile(path.join(root, 'guide.md'), `# Guía\n${signature}\n## Heading\n\n\`\`\`json\n{\n}\n\`\`\`\n---\n|---|---|\nOne concrete requirement with evidence and a verified acceptance boundary.\n`);
  await requireDepth(root, { 'guide.md': { min_content_lines: 3, min_words: 10 } });
  const result = await validateLibrary(root);
  assert.match(result.errors.join('\n'), /líneas de contenido/);
  assert.equal(result.modules[0].content_lines, 2);
}));

test('module depth rejects many short lines that fail the word threshold', () => fixture(async root => {
  await writeFile(path.join(root, 'guide.md'), `${signature}\nline one\nline two\nline three\n`);
  await requireDepth(root, { 'guide.md': { min_content_lines: 4, min_words: 30 } });
  assert.match((await validateLibrary(root)).errors.join('\n'), /palabras/);
}));

test('module depth passes a sufficiently detailed module and reports counts', () => fixture(async root => {
  await writeFile(path.join(root, 'guide.md'), `# Guía\n${signature}\nRequire a bounded operation with recorded identity and explicit target environment.\nReject private data transfer when the approved destination set is empty.\n`);
  await requireDepth(root, { 'guide.md': { min_content_lines: 3, min_words: 25 } });
  const result = await validateLibrary(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.modules.length, 1);
  assert.equal(result.modules[0].content_lines, 3);
  assert.ok(result.modules[0].words >= 25);
  const run = spawnSync(process.execPath, ['scripts/validate-library.mjs', '--root', root], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /guide.md: 3 líneas de contenido, \d+ palabras/);
}));

test('module requirements reject malformed profiles and unregistered module paths', () => fixture(async root => {
  for (const requirements of [null, [], { 'guide.md': null },
    { 'guide.md': { min_content_lines: -1, min_words: 1 } },
    { 'guide.md': { min_content_lines: 1, min_words: 0.5 } },
    { 'not-registered.md': { min_content_lines: 1, min_words: 1 } }]) {
    await requireDepth(root, requirements);
    assert.match((await validateLibrary(root)).errors.join('\n'), /módulo|module_requirements/);
  }
}));

test('module requirements handle a missing module as an error', () => fixture(async root => {
  await requireDepth(root, { 'guide.md': { min_content_lines: 3, min_words: 25 } });
  await rm(path.join(root, 'guide.md'));
  assert.match((await validateLibrary(root)).errors.join('\n'), /Módulo ausente/);
}));

const agentFile = (name, extra = '') =>
  `---\nname: ${name}\ndescription: Usa este agente para revisar evidencia.${extra}\nmodel: inherit\ntools: ["Read"]\n---\n\n# Agente\n\n${signature}\n`;
const registerAgents = async (root, agents, documents = agents) => {
  const manifest = JSON.parse(await readFile(path.join(root, 'library.json'), 'utf8'));
  await writeFile(path.join(root, 'library.json'), JSON.stringify({
    ...manifest, documents: [...manifest.documents, ...documents], agents,
  }));
};

test('accepts registered agents with valid frontmatter and matching names', () => fixture(async root => {
  await mkdir(path.join(root, 'agents'));
  await writeFile(path.join(root, 'agents/eos-demo.md'), agentFile('eos-demo'));
  await registerAgents(root, ['agents/eos-demo.md']);
  const result = await validateLibrary(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.agents, 1);
}));

test('rejects agents without frontmatter, with mismatched name or empty description', () => fixture(async root => {
  await mkdir(path.join(root, 'agents'));
  await writeFile(path.join(root, 'agents/no-front.md'), `# Sin frontmatter\n${signature}\n`);
  await writeFile(path.join(root, 'agents/wrong.md'), agentFile('other-name'));
  await writeFile(path.join(root, 'agents/empty.md'), `---\nname: empty\ndescription:\n---\n${signature}\n`);
  await writeFile(path.join(root, 'agents/open.md'), `---\nname: open\n${signature}\n`);
  await registerAgents(root, ['agents/no-front.md', 'agents/wrong.md', 'agents/empty.md', 'agents/open.md']);
  const errors = (await validateLibrary(root)).errors.join('\n');
  assert.match(errors, /no-front.md: frontmatter/);
  assert.match(errors, /wrong.md: name/);
  assert.match(errors, /empty.md: description/);
  assert.match(errors, /open.md: frontmatter/);
}));

test('rejects agents that are unregistered documents, missing or malformed lists', () => fixture(async root => {
  await mkdir(path.join(root, 'agents'));
  await writeFile(path.join(root, 'agents/eos-demo.md'), agentFile('eos-demo'));
  await registerAgents(root, ['agents/eos-demo.md', 'agents/missing.md'], []);
  const errors = (await validateLibrary(root)).errors.join('\n');
  assert.match(errors, /Agente no registrado como documento: agents\/eos-demo.md/);
  assert.match(errors, /Agente no registrado como documento: agents\/missing.md/);
  const manifest = JSON.parse(await readFile(path.join(root, 'library.json'), 'utf8'));
  await writeFile(path.join(root, 'library.json'), JSON.stringify({ ...manifest, agents: 'agents/eos-demo.md' }));
  assert.match((await validateLibrary(root)).errors.join('\n'), /agents debe ser una lista/);
}));

test('reports an unreadable registered agent file', () => fixture(async root => {
  await registerAgents(root, ['agents/ghost.md']);
  assert.match((await validateLibrary(root)).errors.join('\n'), /Agente ausente o ilegible: agents\/ghost.md/);
}));

test('plugin manifest version must match the library version', () => fixture(async root => {
  await mkdir(path.join(root, '.claude-plugin'));
  await writeFile(path.join(root, '.claude-plugin/plugin.json'), JSON.stringify({ name: 'eos', version: '2.0.0' }));
  assert.deepEqual((await validateLibrary(root)).errors, []);
  await writeFile(path.join(root, '.claude-plugin/plugin.json'), JSON.stringify({ name: 'eos', version: '9.9.9' }));
  assert.match((await validateLibrary(root)).errors.join('\n'), /plugin.json: versión 9.9.9/);
  await writeFile(path.join(root, '.claude-plugin/plugin.json'), '{bad');
  assert.match((await validateLibrary(root)).errors.join('\n'), /plugin.json inválido/);
}));
