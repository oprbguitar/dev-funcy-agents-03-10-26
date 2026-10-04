// Instalador del sistema de agentes EOS en otro proyecto.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
// Copia una instantánea de la biblioteca a <destino>/.eos y, según el host, agentes y skills
// a .claude/ (Claude Code) o .agents/ (Codex). Nunca sobrescribe archivos existentes,
// no descarga código, no ejecuta comandos externos y no toca permisos del host.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HOSTS = new Set(['claude', 'codex', 'all']);
const BEGIN = '<!-- EOS:BEGIN -->';
// Archivos auxiliares enlazados por la documentación que no figuran en library.json.
const SNAPSHOT_EXTRAS = ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'docs/sources/source-index.json', 'scripts/eos.mjs'];
const END = '<!-- EOS:END -->';

const toPosix = value => value.split(path.sep).join('/');
const sha256 = data => createHash('sha256').update(data).digest('hex');
const exists = file => stat(file).then(() => true, () => false);
const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

// Reescribe enlaces Markdown relativos que apuntan dentro de la biblioteca para que,
// desde la nueva ubicación del archivo, apunten a la copia instalada en .eos/.
export function rewriteLinks(text, sourceFile, destFile, libraryRoot, snapshotRoot) {
  return text.replace(/(!?\[[^\]\n]*\]\()(<[^>]+>|[^\s)]+)(\))/g, (whole, open, rawTarget, close) => {
    const angle = rawTarget.startsWith('<');
    const target = angle ? rawTarget.slice(1, -1) : rawTarget;
    if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('#')) return whole;
    const [file, suffix = ''] = target.split(/(?=[?#])/);
    const resolved = path.resolve(path.dirname(sourceFile), file);
    if (!isInside(libraryRoot, resolved)) return whole;
    const installed = path.join(snapshotRoot, path.relative(libraryRoot, resolved));
    const next = toPosix(path.relative(path.dirname(destFile), installed)) + suffix;
    return `${open}${angle ? `<${next}>` : next}${close}`;
  });
}

const eosBlock = version => [
  BEGIN,
  `## EOS ${version} — Pierre R. Boss (oprbguitar)`,
  '',
  'Este proyecto adopta el Engineering Operating System de Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.',
  'Las instrucciones locales anteriores a este bloque y las del host prevalecen; EOS no eleva permisos.',
  '',
  '- Núcleo obligatorio: `.eos/EOS-CORE.md`. Su tabla de carga bajo demanda indica qué secciones abrir.',
  '- Constitución `.eos/EOS_MASTER_SYSTEM_INSTRUCTION.md` y manuales `.eos/docs/manuals/`: solo por secciones, nunca completos por rutina.',
  '- Roles: `.eos/agents/README.md`; cada entrega cierra con el bloque `eos-result` de `.eos/templates/AGENT-RESULT.md`.',
  '- Procedimientos por modo (INIT, ADOPT, AUDIT, MIGRATE, RELEASE, INCIDENT): `.eos/skills/`.',
  '- Plantillas de registro: `.eos/templates/`, incluida `EXEC-PLAN.md` para trabajo largo.',
  '',
  'Ahorro de contexto (sin modelo, sin red):',
  '- `node .eos/scripts/eos.mjs context "<tarea>" --mode <MODO> --list` muestra qué secciones cargar; sin `--list` entrega el paquete dentro del presupuesto (`--budget`, 8000 tokens por defecto).',
  '- `node .eos/scripts/eos.mjs gate --json` ejecuta los comandos de `eos.gate.json` y devuelve solo fallos resumidos; exige revisión previa (`gate --plan`, luego `gate --trust` por el responsable).',
  '- `node .eos/scripts/eos.mjs run --agent <rol> -- <comando del host>` registra tokens y costo reales en `.eos/runs.jsonl`; `runs` los resume.',
  '',
  'Antes de cambiar código: inspecciona el repositorio, detecta el modo, respeta cambios ajenos y entrega evidencia verificable.',
  END,
  '',
].join('\n');

const claudeBlock = [BEGIN, '<!-- Reglas EOS de Pierre R. Boss (oprbguitar) vía AGENTS.md -->', '@AGENTS.md', END, ''].join('\n');

export async function installAgents({ source, target, host = 'all', dryRun = false, update = false }) {
  if (!HOSTS.has(host)) throw new Error(`host inválido: ${host}; usa claude, codex o all`);
  const libraryRoot = path.resolve(source);
  const destRoot = path.resolve(target);
  if (isInside(libraryRoot, destRoot)) throw new Error('El destino no puede ser el repositorio de origen ni estar dentro de él');
  let manifest;
  try { manifest = JSON.parse(await readFile(path.join(libraryRoot, 'library.json'), 'utf8')); }
  catch { throw new Error('library.json ausente o inválido en el origen'); }

  const snapshotRoot = path.join(destRoot, '.eos');
  const record = path.join(snapshotRoot, 'install-manifest.json');
  const previous = JSON.parse(await readFile(record, 'utf8').catch(() => '{"created":[]}'));
  const recorded = previous.files ?? {};
  const files = { ...recorded };
  const created = [];
  const skipped = [];
  const updated = [];
  const unchanged = [];
  const conflicts = [];
  const desired = new Set();
  const write = async (destFile, content) => {
    if (dryRun) return;
    await mkdir(path.dirname(destFile), { recursive: true });
    await writeFile(destFile, content);
  };
  // Instalación: nunca sobrescribe. Actualización: reemplaza solo lo que EOS escribió y nadie editó;
  // una edición local queda intacta y la versión nueva se deja al lado como <archivo>.eos-new.
  const put = async (destFile, content) => {
    const relative = toPosix(path.relative(destRoot, destFile));
    const hash = sha256(content);
    desired.add(relative);
    const current = await readFile(destFile).catch(() => null);
    if (current === null) { created.push(relative); files[relative] = hash; await write(destFile, content); return; }
    if (!update) { skipped.push(relative); return; }
    const currentHash = sha256(current);
    if (currentHash === hash) { unchanged.push(relative); files[relative] = hash; return; }
    const untouched = recorded[relative] ? recorded[relative] === currentHash
      : !previous.files && relative.startsWith('.eos/');
    if (untouched) { updated.push(relative); files[relative] = hash; await write(destFile, content); return; }
    conflicts.push(relative);
    await write(`${destFile}.eos-new`, content);
  };
  const placeBlock = async (destFile, block, alreadyPresent) => {
    const relative = toPosix(path.relative(destRoot, destFile));
    const current = await readFile(destFile, 'utf8').catch(() => null);
    if (current !== null && alreadyPresent(current)) {
      const begin = current.indexOf(BEGIN);
      const finish = current.indexOf(END, begin);
      if (!update || begin < 0 || finish < 0) { skipped.push(relative); return; }
      const next = current.slice(0, begin) + block.trimEnd() + current.slice(finish + END.length);
      if (next === current) { unchanged.push(relative); return; }
      updated.push(relative);
      await write(destFile, next);
      return;
    }
    created.push(relative);
    const separator = current && !current.endsWith('\n') ? '\n\n' : current ? '\n' : '';
    await write(destFile, (current ?? '') + separator + block);
  };

  const snapshot = [...manifest.documents, ...manifest.sources.map(item => item.path), 'library.json'];
  for (const relative of SNAPSHOT_EXTRAS) {
    if (await exists(path.join(libraryRoot, relative))) snapshot.push(relative);
  }
  for (const relative of snapshot) {
    await put(path.join(snapshotRoot, relative), await readFile(path.join(libraryRoot, relative)));
  }

  const agents = (manifest.agents ?? []).map(relative => path.join(libraryRoot, relative));
  const skills = manifest.documents.filter(item => /^skills\/[^/]+\/SKILL\.md$/.test(item))
    .map(relative => path.join(libraryRoot, relative));
  const copyRewritten = async (sourceFile, destFile) => {
    const text = await readFile(sourceFile, 'utf8');
    await put(destFile, rewriteLinks(text, sourceFile, destFile, libraryRoot, snapshotRoot));
  };
  const skillDest = (base, file) => path.join(destRoot, base, path.basename(path.dirname(file)), 'SKILL.md');

  if (host === 'claude' || host === 'all') {
    for (const file of agents) await copyRewritten(file, path.join(destRoot, '.claude/agents', path.basename(file)));
    for (const file of skills) await copyRewritten(file, skillDest('.claude/skills', file));
  }
  if (host === 'codex' || host === 'all') {
    for (const file of agents) await copyRewritten(file, path.join(destRoot, '.agents/eos-agents', path.basename(file)));
    for (const file of skills) await copyRewritten(file, skillDest('.agents/skills', file));
  }
  await placeBlock(path.join(destRoot, 'AGENTS.md'), eosBlock(manifest.version), text => text.includes(BEGIN));
  if (host === 'claude' || host === 'all') {
    await placeBlock(path.join(destRoot, 'CLAUDE.md'), claudeBlock,
      text => text.includes(BEGIN) || text.includes('@AGENTS.md'));
  }
  // Retirados: instalados antes y ausentes de esta versión. Solo se informan; borrar es decisión humana.
  const removed = update
    ? [...new Set([...(previous.created ?? []), ...Object.keys(recorded)])]
      .filter(relative => !desired.has(relative) && relative !== 'AGENTS.md' && relative !== 'CLAUDE.md')
    : [];

  if (!dryRun && (created.length || update)) {
    await writeFile(record, JSON.stringify({
      tool: 'scripts/install-agents.mjs',
      owner: manifest.owner,
      version: manifest.version,
      host,
      installed_at: new Date().toISOString(),
      created: [...new Set([...(previous.created ?? []), ...created])],
      files,
    }, null, 2) + '\n');
  }
  return { created, skipped, updated, unchanged, conflicts, removed, dryRun };
}

export function parseArgs(args) {
  const options = { host: 'all', dryRun: false };
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === '--dry-run') { options.dryRun = true; continue; }
    if (flag === '--update') { options.update = true; continue; }
    if (!['--target', '--host', '--source'].includes(flag) || !args[index + 1]) return null;
    options[flag.slice(2)] = args[index + 1];
    index += 1;
  }
  if (!options.target) return null;
  const { target, host, dryRun, source, update } = options;
  return { target, host, dryRun, ...(source ? { source } : {}), ...(update ? { update } : {}) };
}

async function main(args) {
  const options = parseArgs(args);
  if (!options) {
    process.stderr.write('Uso: node scripts/install-agents.mjs --target <directorio> [--host claude|codex|all] [--update] [--dry-run]\n');
    process.exitCode = 1;
    return;
  }
  const source = options.source ?? path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  try {
    const result = await installAgents({ ...options, source });
    if (options.update) {
      const head = result.dryRun ? 'Simulación de actualización' : 'Actualización completada';
      process.stdout.write(head + ': ' + result.created.length + ' nuevos, ' + result.updated.length + ' actualizados, '
        + result.unchanged.length + ' sin cambios, ' + result.conflicts.length + ' conflictos, ' + result.removed.length + ' retirados\n');
      for (const file of result.created) process.stdout.write('  + ' + file + '\n');
      for (const file of result.updated) process.stdout.write('  ~ ' + file + ' (actualizado)\n');
      for (const file of result.conflicts) process.stdout.write('  ! ' + file + ' (modificado localmente; propuesta en ' + file + '.eos-new)\n');
      for (const file of result.removed) process.stdout.write('  - ' + file + ' (ya no forma parte de EOS; revísalo y bórralo si corresponde)\n');
      return;
    }
    const summary = result.dryRun
      ? `Simulación: se crearían ${result.created.length} archivos; ${result.skipped.length} existentes no se modificarían`
      : `Instalación completada: ${result.created.length} archivos creados, ${result.skipped.length} omitidos por existir`;
    process.stdout.write(`${summary}\n`);
    for (const file of result.created) process.stdout.write(`  + ${file}\n`);
    for (const file of result.skipped) process.stdout.write(`  = ${file} (existente, no modificado)\n`);
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
