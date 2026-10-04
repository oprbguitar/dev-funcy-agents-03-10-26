import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const inside = (root, value) => {
  if (typeof value !== 'string' || !value || path.isAbsolute(value)) return null;
  const target = path.resolve(root, value);
  const relative = path.relative(root, target);
  return relative === '..' || relative.startsWith(`..${path.sep}`) ? null : target;
};

const prose = text => {
  let fence = null;
  const lines = [];
  for (const line of text.split(/\r?\n/)) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && marker) fence = marker[1];
    else if (fence && marker && marker[1][0] === fence[0]
      && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
    else if (!fence) lines.push(line);
  }
  return { text: lines.join('\n'), unclosed: fence !== null };
};

const localLinks = text => [...text.matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g)]
  .map(match => match[1].replace(/^<|>$/g, ''))
  .filter(target => !/^[a-z][a-z\d+.-]*:/i.test(target) && !target.startsWith('#'));

async function checkDocument(root, relative, owner) {
  const target = inside(root, relative);
  if (!target) return [`Documento fuera del repositorio: ${String(relative)}`];
  let content;
  try { content = await readFile(target, 'utf8'); }
  catch { return [`Documento ausente o ilegible: ${relative}`]; }
  const errors = content.includes(owner) ? [] : [`Falta firma ${owner}: ${relative}`];
  const visible = prose(content);
  if (visible.unclosed) errors.push(`Code fence sin cierre: ${relative}`);
  for (const link of localLinks(visible.text)) {
    let decoded;
    try { decoded = decodeURIComponent(link.split(/[?#]/)[0]); }
    catch { errors.push(`Enlace con codificación inválida: ${relative}: ${link}`); continue; }
    const linkTarget = inside(root, path.relative(root, path.resolve(path.dirname(target), decoded)));
    if (!linkTarget) { errors.push(`Enlace fuera del repositorio: ${relative}: ${link}`); continue; }
    try { await stat(linkTarget); }
    catch { errors.push(`Enlace local roto: ${relative}: ${decoded}`); }
  }
  return errors;
}

async function checkSource(root, source) {
  if (!source || typeof source.id !== 'string' || !source.id) return ['Fuente sin id válido'];
  const target = inside(root, source.path);
  if (!target) return [`Fuente fuera del repositorio: ${source.id}`];
  if (!/^[a-f\d]{64}$/.test(source.sha256 ?? '')) return [`Fuente con hash inválido: ${source.id}`];
  try {
    const hash = createHash('sha256').update(await readFile(target)).digest('hex');
    return hash === source.sha256 ? [] : [`SHA-256 no coincide: ${source.id}`];
  } catch { return [`Fuente ausente o ilegible: ${source.id}`]; }
}

export async function validateLibrary(root) {
  let manifest;
  try { manifest = JSON.parse(await readFile(path.join(root, 'library.json'), 'utf8')); }
  catch { return { errors: ['library.json ausente, ilegible o JSON inválido'], documents: 0, sources: 0 }; }
  if (!manifest || typeof manifest.version !== 'string' || !manifest.version
    || typeof manifest.owner !== 'string' || !manifest.owner
    || !Array.isArray(manifest.documents) || !manifest.documents.length
    || !Array.isArray(manifest.sources) || !manifest.sources.length) {
    return { errors: ['library.json requiere version, owner, documents y sources no vacíos'], documents: 0, sources: 0 };
  }
  const duplicateDocs = manifest.documents.filter((value, index, all) => all.indexOf(value) !== index);
  const ids = manifest.sources.map(source => source?.id);
  const duplicateIds = ids.filter((value, index, all) => all.indexOf(value) !== index);
  const errors = [
    ...duplicateDocs.map(value => `Documento duplicado: ${value}`),
    ...duplicateIds.map(value => `Id de fuente duplicado: ${value}`),
  ];
  for (const document of manifest.documents) errors.push(...await checkDocument(root, document, manifest.owner));
  for (const source of manifest.sources) errors.push(...await checkSource(root, source));
  return { errors, documents: manifest.documents.length, sources: manifest.sources.length };
}

async function main(args) {
  if (args.length && !(args.length === 2 && args[0] === '--root' && args[1])) {
    process.stderr.write('Uso: node scripts/validate-library.mjs [--root directorio]\n');
    process.exitCode = 1;
    return;
  }
  const root = path.resolve(args[1] ?? path.dirname(path.dirname(fileURLToPath(import.meta.url))));
  const result = await validateLibrary(root);
  if (result.errors.length) {
    process.stderr.write(`FAIL: ${result.errors.length} errores\n${result.errors.join('\n')}\n`);
    process.exitCode = 1;
  } else process.stdout.write(`PASS: ${result.documents} documentos, ${result.sources} fuentes verificadas\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
