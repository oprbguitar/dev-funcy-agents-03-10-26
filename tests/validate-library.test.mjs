import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
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
