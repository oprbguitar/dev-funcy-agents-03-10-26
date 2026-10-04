// CLI de contexto y verificación de EOS.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
// Reduce tokens con código determinista: `context` elige secciones de la constitución y los
// manuales por relevancia (BM25) dentro de un presupuesto, `gate` ejecuta verificaciones y
// devuelve solo fallos resumidos, e `index` publica la tabla de secciones. Sin dependencias,
// sin red y sin llamadas a modelos.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CHARS_PER_TOKEN = 3.7;
export const estimateTokens = text => Math.ceil(text.length / CHARS_PER_TOKEN);

// Manuales que cada modo prioriza; multiplican la puntuación, no excluyen otros resultados.
export const MODE_MANUALS = {
  INIT: ['PRIME-DIRECTIVE', 'CAPABILITY-PROFILER', 'ENGINEERING-QUALITY'],
  ADOPT: ['MIGRATION-HANDOFF', 'CAPABILITY-PROFILER', 'ENGINEERING-QUALITY'],
  AUDIT: ['ENGINEERING-QUALITY', 'SECURITY-FABRIC', 'COMPLIANCE-IP-PRODUCT'],
  MIGRATE: ['MIGRATION-HANDOFF', 'UPDATES-RELIABILITY', 'STORAGE-DATA'],
  RELEASE: ['UPDATES-RELIABILITY', 'ENGINEERING-QUALITY'],
  INCIDENT: ['INCIDENT-RESPONSE', 'SECURITY-FABRIC'],
};
const MODE_BOOST = 1.5;
const HEADING_WEIGHT = 3;

const STOP = new Set(`para por con sin una uno unos unas los las del que como cuando donde este esta estos estas
ese esa eso sus son ser hay mas pero tras segun bajo dentro cada debe deben puede pueden entre sobre tambien solo antes despues desde hasta
the and for with that this from are not was were have has into when what which their than then also only must
should can any all its our your out use usa uso`.split(/\s+/));

export const normalize = text => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// Stemming ligero para español e inglés: quita plural y trunca a 7 caracteres, de modo que
// idempotencia/idempotente, sesión/sesiones o conciliar/conciliación comparten raíz.
export const stem = term => (term.length > 4 ? term.replace(/(es|s)$/, '') : term).slice(0, 7);
export const terms = text => (normalize(text).match(/[a-z0-9][a-z0-9-]{2,}/g) ?? [])
  .filter(term => !STOP.has(term)).map(stem);

// Divide un Markdown en secciones #, ## y ###, ignora encabezados dentro de fences y parte
// secciones mayores que maxChars en fragmentos por párrafo para no cargar bloques enormes.
export function splitSections(text, file, maxChars = 6000) {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let fence = null;
  let current = { file, heading: '(preámbulo)', start: 1, lines: [] };
  const flush = end => {
    if (current.lines.some(line => line.trim())) sections.push({ ...current, end });
  };
  lines.forEach((line, index) => {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) fence = fence === null ? marker[1] : (marker[1][0] === fence[0] ? null : fence);
    const heading = fence === null && !marker ? line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/) : null;
    if (heading) {
      flush(index);
      current = { file, heading: heading[2], start: index + 1, lines: [] };
    }
    current.lines.push(line);
  });
  flush(lines.length);
  return sections.flatMap(section => chunk(section, maxChars));
}

function chunk(section, maxChars) {
  const body = section.lines.join('\n');
  if (body.length <= maxChars) return [{ ...strip(section), text: body }];
  const parts = [];
  let buffer = [];
  let start = section.start;
  let fence = false;
  let size = 0;
  const push = end => {
    if (!buffer.length) return;
    parts.push({ file: section.file, heading: section.heading, start, end, text: buffer.join('\n') });
    buffer = [];
    size = 0;
    start = end + 1;
  };
  section.lines.forEach((line, offset) => {
    if (/^\s{0,3}(`{3,}|~{3,})/.test(line)) fence = !fence;
    buffer.push(line);
    size += line.length + 1;
    // Corta en párrafo desde el 60%, en cualquier línea al llegar al máximo y siempre al doble (fences largos).
    const soft = !fence && (line.trim() ? size >= maxChars : size >= maxChars * 0.6);
    if (soft || size >= maxChars * 2) push(section.start + offset);
  });
  push(section.start + section.lines.length - 1);
  return parts.map((part, index) => ({ ...part, heading: `${part.heading} (parte ${index + 1}/${parts.length})` }));
}

const strip = ({ lines, ...rest }) => rest;

export async function loadCorpus(root) {
  const manifest = JSON.parse(await readFile(path.join(root, 'library.json'), 'utf8'));
  const files = manifest.documents.filter(file =>
    file === 'EOS_MASTER_SYSTEM_INSTRUCTION.md' || /^docs\/manuals\/[^/]+\.md$/.test(file));
  const sections = [];
  for (const file of files) sections.push(...splitSections(await readFile(path.join(root, file), 'utf8'), file));
  return { version: manifest.version, sections };
}

// BM25 sobre el texto de cada sección; los términos del encabezado cuentan HEADING_WEIGHT veces.
export function rank(sections, query, mode) {
  const queryTerms = [...new Set(terms(query))];
  if (!queryTerms.length) return [];
  const docs = sections.map(section => {
    const bag = [...terms(section.text)];
    for (let repeat = 1; repeat < HEADING_WEIGHT; repeat += 1) bag.push(...terms(section.heading));
    const tf = new Map();
    for (const term of bag) tf.set(term, (tf.get(term) ?? 0) + 1);
    return { tf, length: bag.length };
  });
  const avg = docs.reduce((sum, doc) => sum + doc.length, 0) / docs.length || 1;
  const df = new Map(queryTerms.map(term => [term, docs.filter(doc => doc.tf.has(term)).length]));
  const preferred = MODE_MANUALS[mode] ?? [];
  return sections.map((section, index) => {
    const doc = docs[index];
    let score = 0;
    for (const term of queryTerms) {
      const freq = doc.tf.get(term) ?? 0;
      if (!freq) continue;
      const idf = Math.log(1 + (docs.length - df.get(term) + 0.5) / (df.get(term) + 0.5));
      score += idf * (freq * 2.2) / (freq + 1.2 * (0.25 + 0.75 * doc.length / avg));
    }
    if (score && preferred.some(name => section.file.endsWith(`/${name}.md`))) score *= MODE_BOOST;
    return { ...section, score, tokens: estimateTokens(section.text) };
  }).filter(section => section.score > 0).sort((a, b) => b.score - a.score);
}

export function selectWithinBudget(ranked, budget, limit = 12) {
  const chosen = [];
  let used = 0;
  for (const section of ranked) {
    if (chosen.length >= limit) break;
    if (used + section.tokens > budget) continue;
    chosen.push(section);
    used += section.tokens;
  }
  chosen.sort((a, b) => a.file.localeCompare(b.file) || a.start - b.start);
  return { chosen, used };
}

export function renderPack({ task, mode, budget, chosen, used, listOnly }) {
  const head = [
    '# Paquete de contexto EOS',
    `Tarea: ${task} | Modo: ${mode ?? 'sin modo'} | Presupuesto: ${budget} tokens | Usado: ~${used} | Secciones: ${chosen.length}`,
    '',
    ...chosen.map(section =>
      `- ${section.file}:${section.start}-${section.end} — ${section.heading} (~${section.tokens} tokens, ${section.score.toFixed(2)})`),
  ];
  if (!chosen.length) head.push('Sin coincidencias: usa términos del dominio (p. ej. "rollback", "webhook", "sesión").');
  if (listOnly) return `${head.join('\n')}\n`;
  const body = chosen.map(section => `\n---\n<!-- ${section.file}:${section.start}-${section.end} -->\n${section.text.trim()}\n`);
  return `${head.join('\n')}\n${body.join('')}`;
}

// Extrae las líneas útiles de una salida fallida: primero las que nombran el fallo, si no las últimas.
export function summarizeFailure(output, maxLines = 15) {
  const lines = output.split(/\r?\n/).map(line => line.trimEnd()).filter(Boolean);
  const relevant = lines.filter(line => /fail|error|not ok|assert|expected|actual|✖|missing|roto|falta/i.test(line));
  return (relevant.length ? relevant : lines.slice(-10)).slice(0, maxLines)
    .map(line => (line.length > 200 ? `${line.slice(0, 197)}...` : line));
}

export function runGate(commands, cwd, timeoutMs = 600000) {
  return commands.map(({ name, run }) => {
    const began = Date.now();
    const result = spawnSync(run, { cwd, shell: true, encoding: 'utf8', timeout: timeoutMs });
    const seconds = ((Date.now() - began) / 1000).toFixed(1);
    const passed = result.status === 0 && !result.error;
    return {
      name, run, seconds, result: passed ? 'PASS' : 'FAIL', exit: result.status,
      detail: passed ? [] : summarizeFailure(`${result.stdout ?? ''}\n${result.stderr ?? ''}\n${result.error?.message ?? ''}`),
    };
  });
}

export function renderGate(results, asJson) {
  const failed = results.filter(item => item.result === 'FAIL');
  if (asJson) {
    return `\`\`\`eos-result\n${JSON.stringify({
      agent: 'eos-gate',
      status: failed.length ? 'FAILED' : 'COMPLETED',
      summary: `${results.length - failed.length}/${results.length} verificaciones PASS`,
      files: [],
      checks: results.map(item => ({ cmd: item.run, result: item.result, note: (item.detail[0] ?? `${item.seconds}s`).slice(0, 80) })),
      findings: [],
      next: failed.map(item => ({ item: `Corregir ${item.name}`, owner: 'eos-implementer' })),
      approval_needed: [],
    }, null, 2)}\n\`\`\`\n`;
  }
  const lines = results.map(item => `${item.result} ${item.name} (${item.seconds}s${item.result === 'FAIL' ? `, salida ${item.exit}` : ''})`
    + item.detail.map(line => `\n    ${line}`).join(''));
  lines.push(`${failed.length ? 'FAIL' : 'PASS'}: ${results.length - failed.length}/${results.length} verificaciones`);
  return `${lines.join('\n')}\n`;
}

export function parseOptions(args) {
  const options = { positional: [] };
  const flags = new Set(['--list', '--json']);
  const valued = new Set(['--mode', '--budget', '--out', '--root', '--config', '--limit']);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (flags.has(arg)) options[arg.slice(2)] = true;
    else if (valued.has(arg)) {
      if (args[index + 1] === undefined) return null;
      options[arg.slice(2)] = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--')) return null;
    else options.positional.push(arg);
  }
  return options;
}

const USAGE = `Uso:
  node scripts/eos.mjs context "<tarea>" [--mode INIT|ADOPT|AUDIT|MIGRATE|RELEASE|INCIDENT] [--budget 8000] [--limit 12] [--list] [--out archivo]
  node scripts/eos.mjs gate [--config eos.gate.json] [--json]
  node scripts/eos.mjs index [--out .eos-index.json]
  Opción común: --root <biblioteca EOS> (por defecto, la carpeta que contiene este script)
`;

export async function main(args, { cwd = process.cwd(), out = text => process.stdout.write(text), err = text => process.stderr.write(text) } = {}) {
  const [command, ...rest] = args;
  const options = parseOptions(rest);
  if (!options || !['context', 'gate', 'index'].includes(command)) { err(USAGE); return 1; }
  const root = path.resolve(cwd, options.root ?? path.dirname(path.dirname(fileURLToPath(import.meta.url))));
  const emit = async text => {
    if (!options.out) { out(text); return; }
    const target = path.resolve(cwd, options.out);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, text);
    out(`Escrito ${path.relative(cwd, target) || target} (~${estimateTokens(text)} tokens)\n`);
  };
  try {
    if (command === 'context') {
      const task = options.positional.join(' ').trim();
      const mode = options.mode?.toUpperCase();
      const budget = Number(options.budget ?? 8000);
      const limit = Number(options.limit ?? 12);
      if (!task || (mode && !MODE_MANUALS[mode]) || !(budget > 0) || !(limit > 0)) { err(USAGE); return 1; }
      const { sections } = await loadCorpus(root);
      const { chosen, used } = selectWithinBudget(rank(sections, task, mode), budget, limit);
      await emit(renderPack({ task, mode, budget, chosen, used, listOnly: options.list }));
      return 0;
    }
    if (command === 'index') {
      const { version, sections } = await loadCorpus(root);
      const index = sections.map(({ file, heading, start, end, text }) => ({
        file, heading, start, end, tokens: estimateTokens(text),
      }));
      const total = index.reduce((sum, item) => sum + item.tokens, 0);
      await emit(`${JSON.stringify({ version, chars_per_token: CHARS_PER_TOKEN, sections: index.length, total_tokens: total, index }, null, 2)}\n`);
      return 0;
    }
    const configPath = path.resolve(cwd, options.config ?? 'eos.gate.json');
    let config;
    try { config = JSON.parse(await readFile(configPath, 'utf8')); }
    catch { err(`Sin configuración de gate válida: ${configPath}\nCrea eos.gate.json con {"commands":[{"name":"tests","run":"npm test"}]}\n`); return 1; }
    const commands = Array.isArray(config?.commands)
      ? config.commands.filter(item => typeof item?.name === 'string' && typeof item?.run === 'string' && item.run) : [];
    if (!commands.length) { err(`eos.gate.json sin comandos válidos: ${configPath}\n`); return 1; }
    const results = runGate(commands, path.dirname(configPath), Number(config.timeout_ms ?? 600000));
    await emit(renderGate(results, options.json));
    return results.some(item => item.result === 'FAIL') ? 1 : 0;
  } catch (error) {
    err(`ERROR: ${error.message}\n`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
