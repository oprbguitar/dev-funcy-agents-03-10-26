# Pierre R. Boss — Engineering Operating System

**EOS · Edición de especificaciones de ingeniería 4.5.0 · 19 de octubre de 2026 · Perú**

🧭 **Tu copiloto tiene mapa, frenos y bitácora. El volante sigue siendo tuyo.**

[Empezar](#empezar-en-tres-pasos) · [Mapa](#mapa-del-repositorio) · [Documentación interna](docs/README.md) · [Guía completa](docs/GUIA-COMPLETA.md) · [Estado real](docs/EOS-PROJECT-STATUS.md) · [Licencia MIT](LICENSE) ([alcance](LICENSE-SCOPE.md))

![Cómo funciona EOS: petición, EOS-CORE, modo, skills y agentes, gate y entrega con estado vivo](docs/assets/eos-flujo.svg)

![Cómo se coordinan los agentes: el orquestador envía paquetes de tarea y recibe resultados eos-result](docs/assets/eos-agentes.svg)

![Construcción de la base de datos por etapas, con un checkpoint conversado con el usuario en cada etapa](docs/assets/eos-datos.svg)

## Finalidad

EOS es una **biblioteca de reglas, procedimientos y roles** para que agentes de IA (Claude Code, Codex, modelos locales) y personas construyan software con evidencia:

- **Decide con límites:** cada tarea tiene modo, autonomía A0–A4 y autorización explícita.
- **Construye por partes:** diseño de sistema y base de datos incremental, conversado con el usuario en cada etapa.
- **Entrega verificable:** pruebas, revisión de seguridad, documentación interna y estado vivo en cada hito.

EOS **no** es un runtime ni un servicio: no despliega, no cobra y no certifica cumplimiento. Solo la evidencia de cada proyecto demuestra qué funciona.

## Empezar en tres pasos

Requisitos: Git y Node.js 24. Sin `npm install`, Docker ni claves. `RUTA/DE/TU-PROYECTO` es un marcador.

```bash
git clone https://github.com/oprbguitar/dev-funcy-agents-03-10-26.git
```

```bash
node dev-funcy-agents-03-10-26/scripts/install-agents.mjs --host all --target "RUTA/DE/TU-PROYECTO" --dry-run
```

Revisa la lista; repite sin `--dry-run` para instalar (nunca pisa archivos existentes; `--update` para versiones nuevas). Luego abre tu proyecto en el agente:

```text
Aplica EOS 4.5.0 en MODE=ADOPT a este proyecto.
Lee AGENTS.md y .eos/EOS-CORE.md, inspecciona antes de editar y conserva mi trabajo.
Objetivo: [cambio]. Primera entrega útil: [resultado observable].
Antes de cada etapa dime la decisión, el plan y el avance, y espera mi confirmación.
```

Detalles por host, actualización, ahorro de tokens y calidad ISO/Perú: [guía completa](docs/GUIA-COMPLETA.md).

## Mapa del repositorio

| Grupo | Carpetas y archivos | Para qué sirve |
|---|---|---|
| 🏛️ **Gobierno** | [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), [EOS-CORE](EOS-CORE.md), [constitución](EOS_MASTER_SYSTEM_INSTRUCTION.md) | Reglas que todo agente lee primero |
| 🤖 **Operación** | [agents/](agents/README.md), [skills/](skills/README.md), [prompts/](prompts/README.md), [templates/](templates/README.md) | Roles, procedimientos por modo, prompts y registros |
| 📚 **Conocimiento** | [docs/manuals/](docs/README.md#manuales), [docs/reference/](docs/README.md#referencias), [docs/sources/](docs/sources/README.md) | Contratos de ingeniería, referencias aplicadas y fuentes históricas |
| 🧭 **Estado** | [docs/](docs/README.md) (perfil, estado vivo, verificación, auditoría) | Qué existe, qué se verificó y qué sigue |
| 🛠️ **Herramientas** | [scripts/](scripts/), [tests/](tests/), [evals/](evals/), [eos.gate.json](eos.gate.json), [library.json](library.json), `.claude-plugin/` | Instalador, validador, router de contexto, pruebas y plugin |

## Qué cubre

| Necesidad | Dónde |
|---|---|
| Documentación interna del sistema y de cada producto | [Centro de documentación](docs/README.md) |
| Seguridad base: bots, fuerza bruta, abuso, inyección de instrucciones | [Seguridad de programación básica](docs/reference/SECURE-CODING-BASELINE.md) |
| Menú plegable, compacto, temas, guía, documentación y acceso administrador | [Shell de navegación](docs/reference/APP-SHELL-NAVIGATION.md) |
| Diseño de sistema inicial: escalado, caché, colas, base de datos | [Diseño de sistemas](docs/reference/SYSTEM-DESIGN-BASELINE.md) |
| Base de datos por etapas, conversada con el usuario | [Skill DATA DESIGN](skills/eos-data-design/SKILL.md) y [registro](templates/DATA-MODEL-RECORD.md) |
| Modos INIT · ADOPT · AUDIT · MIGRATE · RELEASE · INCIDENT | [Skills](skills/README.md) |

## Verificar

```bash
node scripts/eos.mjs gate
```

Ejecuta validador, tres suites con cobertura ≥ 80 %, evaluación de contexto y `git diff --check` (la primera vez: `gate --plan` y `gate --trust`). Detalle en [VERIFICATION](docs/VERIFICATION.md).

---

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.** Firma editorial ([AUTHORSHIP](AUTHORSHIP.md)). Cambios en [CHANGELOG](CHANGELOG.md).
