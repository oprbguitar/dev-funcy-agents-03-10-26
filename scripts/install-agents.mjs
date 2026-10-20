// Instalador del sistema de agentes EOS en otro proyecto.
// Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo asistido por IA.
// Copia una instantánea de la biblioteca a <destino>/.eos y, según el host, agentes y skills
// a .claude/ (Claude Code) o .agents/ (Codex). La instalación nunca sobrescribe archivos
// existentes. Con --update reemplaza solo archivos que EOS instaló y nadie modificó (SHA-256
// del manifiesto de instalación), de forma transaccional: planifica, respalda, aplica, verifica
// y revierte errores capturados. No garantiza atomicidad ante caída del proceso ni aislamiento
// frente a cambios concurrentes de rutas (TOCTOU). No descarga ni ejecuta código.
import { readFile, writeFile, mkdir, stat, lstat, realpath, readdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HOSTS = new Set(['claude', 'codex', 'all']);
const BEGIN = '<!-- EOS:BEGIN -->';
// Archivos auxiliares enlazados por la documentación que no figuran en library.json.
const SNAPSHOT_EXTRAS = ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'docs/sources/source-index.json', 'scripts/eos.mjs', 'eos.gate.json',
  'LICENSE', 'LICENSE-SCOPE.md', 'docs/assets/eos-strategy-flow.gif', 'docs/assets/eos-strategy-flow.png'];
const END = '<!-- EOS:END -->';

const toPosix = value => value.split(path.sep).join('/');
const sha256 = data => createHash('sha256').update(data).digest('hex');
const missingOnly = error => { if (error.code !== 'ENOENT') throw error; return null; };
const exists = async file => (await stat(file).catch(missingOnly)) !== null;
const isInside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
};

// Resuelve una raíz elegida por el usuario (incluida una junction legítima), sin crearla.
async function canonicalRoot(root) {
  try { return await realpath(root); }
  catch (error) {
    missingOnly(error);
    // Una raíz enlazada pero rota no es un directorio nuevo seguro.
    const entry = await lstat(root).catch(missingOnly);
    if (entry) throw new Error(`Ruta raíz inaccesible: ${root}`);
    return path.join(await canonicalRoot(path.dirname(root)), path.basename(root));
  }
}

function validateRelative(relative) {
  if (typeof relative !== 'string' || !relative || /[\\:\x00]/.test(relative)
      || relative.startsWith('/') || relative.split('/').some(part => !part || part === '.' || part === '..'
        || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) {
    throw new Error(`Ruta de manifiesto inválida: ${String(relative)}`);
  }
  return relative;
}

// Las raíces se canonicalizan; bajo ellas no seguimos enlaces/junctions, ni siquiera rotos.
async function assertSafePath(root, file) {
  if (!isInside(root, file)) throw new Error(`Ruta fuera de la raíz: ${file}`);
  let current = root;
  for (const part of path.relative(root, file).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const entry = await lstat(current).catch(missingOnly);
    if (!entry) break;
    if (entry.isSymbolicLink()) throw new Error(`Enlace no permitido en ruta: ${current}`);
    if (!isInside(root, await realpath(current))) throw new Error(`Ruta física fuera de la raíz: ${current}`);
  }
}

async function assertSafeBackup(root, directory) {
  await assertSafePath(root, directory);
  const entry = await lstat(directory).catch(missingOnly);
  if (!entry?.isDirectory()) return;
  for (const name of await readdir(directory)) await assertSafeBackup(root, path.join(directory, name));
}

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
  '- Estrategia antes del backlog: `.eos/skills/eos-strategy/SKILL.md`; privacidad, landing/marca y entrega escritorio se activan según el perfil, sin presumir un runtime.',
  '- Plantillas de registro: `.eos/templates/`, incluida `EXEC-PLAN.md` para trabajo largo.',
  '',
  'Ahorro de contexto (sin modelo, sin red):',
  '- `node .eos/scripts/eos.mjs context "<tarea>" --mode <MODO> --list` muestra qué secciones cargar; sin `--list` entrega el paquete dentro del presupuesto (`--budget`, 8000 tokens por defecto).',
  '- `.eos/eos.gate.json` es referencia de la biblioteca; el gate del producto se define y revisa en la raíz del proyecto receptor. La copia no activa ni autoriza comandos.',
  '- `node .eos/scripts/eos.mjs gate --json` ejecuta los comandos de `eos.gate.json` y devuelve solo fallos resumidos; exige revisión previa (`gate --plan`, luego `gate --trust` por el responsable).',
  '- `node .eos/scripts/eos.mjs run --agent <rol> -- <comando del host>` ejecuta sin shell y registra tokens y costo reales en `~/.eos/runs/` (fuera del repositorio; la tarea solo como huella salvo `--log-task`); `runs` los resume.',
  '',
  'Antes de cambiar código: inspecciona el repositorio, detecta el modo, respeta cambios ajenos y entrega evidencia verificable.',
  END,
  '',
].join('\n');

const claudeBlock = [BEGIN, '<!-- Reglas EOS de Pierre R. Boss (oprbguitar) vía AGENTS.md -->', '@AGENTS.md', END, ''].join('\n');

// Artefactos locales de EOS que no deben versionarse: paquetes de contexto, respaldos y propuestas.
const gitignoreBlock = [`# ${BEGIN}`, '# EOS — Pierre R. Boss (oprbguitar): artefactos locales', '.eos/context*.md',
  '.eos/runs*.jsonl', '.eos/.update-backup/', '*.eos-new', `# ${END}`, ''].join('\n');
const BACKUP = '.eos/.update-backup';

export async function installAgents({ source, target, host = 'all', dryRun = false, update = false, hooks = {} }) {
  if (!HOSTS.has(host)) throw new Error(`host inválido: ${host}; usa claude, codex o all`);
  const libraryRoot = await canonicalRoot(path.resolve(source));
  const destRoot = await canonicalRoot(path.resolve(target));
  if (isInside(libraryRoot, destRoot)) throw new Error('El destino no puede ser el repositorio de origen ni estar dentro de él');
  await assertSafePath(libraryRoot, path.join(libraryRoot, 'library.json'));
  let manifest;
  try { manifest = JSON.parse(await readFile(path.join(libraryRoot, 'library.json'), 'utf8')); }
  catch { throw new Error('library.json ausente o inválido en el origen'); }

  for (const relative of [...manifest.documents, ...manifest.sources.map(item => item.path), ...(manifest.agents ?? [])]) {
    validateRelative(relative);
    if (relative.toLowerCase() === 'install-manifest.json' || relative.split('/')[0].toLowerCase() === '.update-backup') {
      throw new Error(`Ruta reservada del instalador: ${relative}`);
    }
    await assertSafePath(libraryRoot, path.join(libraryRoot, relative));
  }

  const snapshotRoot = path.join(destRoot, '.eos');
  const record = path.join(snapshotRoot, 'install-manifest.json');
  await assertSafePath(destRoot, record);
  await assertSafeBackup(destRoot, path.join(destRoot, BACKUP));
  const previous = JSON.parse(await readFile(record, 'utf8').catch(error => missingOnly(error) ?? '{"created":[]}'));
  for (const relative of [...(previous.created ?? []), ...Object.keys(previous.files ?? {})]) validateRelative(relative);
  const recorded = previous.files ?? {};
  const files = { ...recorded };
  const created = [];
  const skipped = [];
  const updated = [];
  const unchanged = [];
  const conflicts = [];
  const legacy = [];
  const desired = new Set();
  // Fase 1: solo planifica. Ninguna escritura ocurre hasta conocer el plan completo.
  const pending = [];
  const destinationKey = file => process.platform === 'win32' ? file.toLowerCase() : file;
  // Dos entradas de la biblioteca pueden referir la misma licencia/extra. Deduplica antes
  // de contar o escribir; una colisión distinta se rechaza sin tocar el destino.
  const destinations = new Map();
  const writes = new Map();
  const firstDestination = (registry, destFile, content) => {
    const key = destinationKey(destFile);
    const hash = sha256(content);
    const prior = registry.get(key);
    if (prior) {
      if (prior.destFile !== destFile || prior.hash !== hash) throw new Error(`Colisión de destino: ${destFile}`);
      return false;
    }
    registry.set(key, { destFile, hash });
    return true;
  };
  const write = async (destFile, content) => {
    if (firstDestination(writes, destFile, content)) pending.push({ destFile, content });
  };
  // Instalación: nunca sobrescribe. Actualización: reemplaza solo lo que EOS escribió y nadie editó;
  // una edición local queda intacta y la versión nueva se deja al lado como <archivo>.eos-new.
  const put = async (destFile, content) => {
    if (!firstDestination(destinations, destFile, content)) return;
    const relative = toPosix(path.relative(destRoot, destFile));
    const hash = sha256(content);
    desired.add(relative);
    await assertSafePath(destRoot, destFile);
    const current = await readFile(destFile).catch(missingOnly);
    if (current === null) { created.push(relative); files[relative] = hash; await write(destFile, content); return; }
    if (!update) { skipped.push(relative); return; }
    const currentHash = sha256(current);
    if (currentHash === hash) { unchanged.push(relative); files[relative] = hash; return; }
    // Sin hash previo (instalación 3.x) se asume que .eos/ pertenece a EOS; queda respaldado y se informa.
    const assumed = !recorded[relative] && !previous.files && relative.startsWith('.eos/');
    const untouched = recorded[relative] ? recorded[relative] === currentHash : assumed;
    if (untouched) {
      updated.push(relative);
      if (assumed) legacy.push(relative);
      files[relative] = hash;
      await write(destFile, content);
      return;
    }
    conflicts.push(relative);
    await write(`${destFile}.eos-new`, content);
  };
  const placeBlock = async (destFile, block, alreadyPresent) => {
    const relative = toPosix(path.relative(destRoot, destFile));
    await assertSafePath(destRoot, destFile);
    const current = await readFile(destFile, 'utf8').catch(missingOnly);
    if (current !== null && alreadyPresent(current)) {
      const marker = current.indexOf(BEGIN);
      const finish = current.indexOf(END, marker);
      if (!update || marker < 0 || finish < 0) { skipped.push(relative); return; }
      // Reemplaza desde el inicio de la línea del marcador: en .gitignore el marcador va tras "# ".
      const begin = current.lastIndexOf('\n', marker) + 1;
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
    await assertSafePath(libraryRoot, path.join(libraryRoot, relative));
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
  await placeBlock(path.join(destRoot, '.gitignore'), gitignoreBlock, text => text.includes(BEGIN));
  // Retirados: instalados antes y ausentes de esta versión. Solo se informan; borrar es decisión humana.
  const managed = new Set(['AGENTS.md', 'CLAUDE.md', '.gitignore']);
  const removed = update
    ? [...new Set([...(previous.created ?? []), ...Object.keys(recorded)])]
      .filter(relative => !desired.has(relative) && !managed.has(relative))
    : [];

  if (created.length || update) {
      await write(record, JSON.stringify({
        tool: 'scripts/install-agents.mjs',
        owner: manifest.owner,
        version: manifest.version,
        host,
        installed_at: new Date().toISOString(),
        created: [...new Set([...(previous.created ?? []), ...created])],
        files,
      }, null, 2) + '\n');
  }
  // Audita el plan completo, incluidas propuestas y el registro, antes de la primera escritura.
  for (const { destFile } of pending) await assertSafePath(destRoot, destFile);
  if (!dryRun) await applyTransaction(destRoot, pending, hooks);
  return { created, skipped, updated, unchanged, conflicts, removed, legacy, dryRun };
}

// Fase 2: respalda lo que se va a reemplazar en .eos/.update-backup/, escribe, verifica el hash de
// cada archivo y, ante cualquier error, restaura los respaldos y borra lo recién creado. El
// manifiesto es la última escritura y participa también del rollback de errores capturados.
async function applyTransaction(destRoot, pending, hooks) {
  const backupRoot = path.join(destRoot, BACKUP);
  const applied = [];
  await assertSafeBackup(destRoot, backupRoot);
  if (pending.length) await rm(backupRoot, { recursive: true, force: true });
  try {
    for (const [index, { destFile, content }] of pending.entries()) {
      const relative = toPosix(path.relative(destRoot, destFile));
      await assertSafePath(destRoot, destFile);
      const existed = await exists(destFile);
      if (existed) await cp(destFile, path.join(backupRoot, relative), { force: true });
      applied.push({ destFile, relative, existed });
      await hooks.beforeWrite?.(relative, index);
      await mkdir(path.dirname(destFile), { recursive: true });
      await writeFile(destFile, content);
      if (sha256(await readFile(destFile)) !== sha256(content)) throw new Error(`verificación fallida: ${relative}`);
    }
  } catch (error) {
    for (const { destFile, relative, existed } of applied.reverse()) {
      if (existed) await cp(path.join(backupRoot, relative), destFile, { force: true });
      else await rm(destFile, { force: true });
    }
    throw new Error(`Actualización revertida sin cambios: ${error.message}`);
  }
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
      if (result.legacy.length) process.stdout.write('  Aviso: ' + result.legacy.length + ' archivos de .eos/ sin hash previo se asumieron de EOS; la versión anterior queda en ' + BACKUP + '/\n');
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
