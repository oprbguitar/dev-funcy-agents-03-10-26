// Validador de la biblioteca EOS.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
// Comprueba manifiesto, documentos, firma, enlaces, fences, fuentes, profundidad de módulos,
// definiciones de agentes y coherencia de versión del plugin. No certifica contenido semántico.
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

function moduleDepth(content) {
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line =>
    line && !/^#{1,6}\s/.test(line) && !/^(?:`{3,}|~{3,})/.test(line)
    && !/^[{}\[\],\s]+$/.test(line) && !/^(?:[-*_]\s*){3,}$/.test(line)
    && !/^\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(line));
  return { content_lines: lines.length, words: lines.join(' ').match(/\S+/g)?.length ?? 0 };
}

// Frontmatter mínimo de subagente: bloque inicial entre líneas ---, name igual al archivo y description no vacía.
async function checkAgent(root, relative, documents) {
  if (!documents.includes(relative)) return [`Agente no registrado como documento: ${relative}`];
  let content;
  try { content = await readFile(inside(root, relative), 'utf8'); }
  catch { return [`Agente ausente o ilegible: ${relative}`]; }
  const block = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!block) return [`${relative}: frontmatter ausente o sin cierre`];
  const field = key => block[1].split(/\r?\n/).find(line => line.startsWith(`${key}:`))
    ?.slice(key.length + 1).trim() ?? '';
  const errors = [];
  if (field('name') !== path.basename(relative, '.md')) errors.push(`${relative}: name no coincide con el archivo`);
  if (!field('description')) errors.push(`${relative}: description vacía`);
  return errors;
}

// El manifiesto del plugin, si existe, debe declarar la misma versión que library.json.
async function checkPlugin(root, version) {
  let raw;
  try { raw = await readFile(path.join(root, '.claude-plugin', 'plugin.json'), 'utf8'); }
  catch { return []; }
  let plugin;
  try { plugin = JSON.parse(raw); } catch { return ['.claude-plugin/plugin.json inválido']; }
  return plugin?.version === version ? []
    : [`.claude-plugin/plugin.json: versión ${plugin?.version} distinta de ${version}`];
}

// El marketplace, si existe, declara la versión en metadata y en cada plugin.
async function checkMarketplace(root, version) {
  let raw;
  try { raw = await readFile(path.join(root, '.claude-plugin', 'marketplace.json'), 'utf8'); }
  catch { return []; }
  let market;
  try { market = JSON.parse(raw); } catch { return ['.claude-plugin/marketplace.json inválido']; }
  const found = [market?.metadata?.version, ...(market?.plugins ?? []).map(plugin => plugin?.version)];
  return found.filter(value => value !== version)
    .map(value => `.claude-plugin/marketplace.json: versión ${value} distinta de ${version}`);
}

// Cada referencia registrada debe citar la versión vigente; evita deriva entre manifiesto y prosa.
async function checkVersionRefs(root, refs, version, documents) {
  const errors = [];
  if (documents.includes('CHANGELOG.md')) {
    const changelog = await readFile(path.join(root, 'CHANGELOG.md'), 'utf8').catch(() => '');
    const latest = changelog.match(/^## (\S+)/m)?.[1] ?? 'ninguna';
    if (latest !== version) errors.push(`CHANGELOG.md: la entrada más reciente es ${latest}, no ${version}`);
  }
  if (refs === undefined) return errors;
  if (!Array.isArray(refs)) return [...errors, 'version_refs debe ser una lista'];
  for (const ref of refs) {
    if (!ref || typeof ref.path !== 'string' || typeof ref.pattern !== 'string' || !ref.pattern.includes('{version}')) {
      errors.push(`version_refs inválido: ${JSON.stringify(ref)}`);
      continue;
    }
    const expected = ref.pattern.replace('{version}', version);
    const target = inside(root, ref.path);
    const content = target ? await readFile(target, 'utf8').catch(() => null) : null;
    if (content === null) errors.push(`${ref.path}: referencia de versión ilegible`);
    else if (!content.includes(expected)) errors.push(`${ref.path}: falta "${expected}"`);
  }
  return errors;
}

async function checkModule(root, relative, requirement, documents) {
  if (!documents.includes(relative) || !requirement || typeof requirement !== 'object'
    || !Number.isSafeInteger(requirement.min_content_lines) || requirement.min_content_lines < 1
    || !Number.isSafeInteger(requirement.min_words) || requirement.min_words < 1) {
    return { errors: [`Perfil de módulo inválido o no registrado: ${relative}`], stats: null };
  }
  const target = inside(root, relative);
  if (!target) return { errors: [`Ruta de módulo fuera del repositorio: ${relative}`], stats: null };
  let content;
  try { content = await readFile(target, 'utf8'); }
  catch { return { errors: [`Módulo ausente o ilegible: ${relative}`], stats: null }; }
  const stats = { path: relative, ...moduleDepth(content) };
  const errors = [
    ...(stats.content_lines < requirement.min_content_lines
      ? [`${relative}: ${stats.content_lines} líneas de contenido; mínimo ${requirement.min_content_lines}`] : []),
    ...(stats.words < requirement.min_words
      ? [`${relative}: ${stats.words} palabras; mínimo ${requirement.min_words}`] : []),
  ];
  return { errors, stats };
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
  let agents = 0;
  if (Object.hasOwn(manifest, 'agents')) {
    if (!Array.isArray(manifest.agents)) errors.push('agents debe ser una lista de rutas');
    else {
      agents = manifest.agents.length;
      for (const agent of manifest.agents) errors.push(...await checkAgent(root, agent, manifest.documents));
    }
  }
  errors.push(...await checkPlugin(root, manifest.version));
  errors.push(...await checkMarketplace(root, manifest.version));
  errors.push(...await checkVersionRefs(root, manifest.version_refs, manifest.version, manifest.documents));
  const modules = [];
  if (Object.hasOwn(manifest, 'module_requirements')) {
    const requirements = manifest.module_requirements;
    if (!requirements || typeof requirements !== 'object' || Array.isArray(requirements)) {
      errors.push('module_requirements debe ser un objeto de perfiles');
    } else {
      for (const [relative, requirement] of Object.entries(requirements)) {
        const result = await checkModule(root, relative, requirement, manifest.documents);
        errors.push(...result.errors);
        if (result.stats) modules.push(result.stats);
      }
    }
  }
  return { errors, documents: manifest.documents.length, sources: manifest.sources.length, agents, modules };
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
  } else {
    process.stdout.write(`PASS: ${result.documents} documentos, ${result.sources} fuentes, ${result.agents} agentes verificados\n`);
    for (const module of result.modules) {
      process.stdout.write(`${module.path}: ${module.content_lines} líneas de contenido, ${module.words} palabras\n`);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
