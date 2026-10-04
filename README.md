# Pierre R. Boss — Engineering Operating System

**EOS · Edición de especificaciones de ingeniería 3.0.0 · 3 de octubre de 2026 · Perú**

> Quiero software que pueda entender, verificar, proteger, mantener y entregar. Quiero que cada decisión tenga una razón, cada permiso un límite y cada resultado una prueba. La IA debe ampliar mi capacidad de trabajo sin quitarme el control del sistema.
>
> — Pierre R. Boss / oprbguitar, declaración editorial de esta edición

EOS es mi biblioteca de instrucciones para dirigir trabajo de ingeniería con Claude, Codex, modelos locales y otros entornos de agentes. Reúne arquitectura, desarrollo, revisión, seguridad activa, IA conectable, datos, pagos, almacenamiento, operación, UX, cumplimiento, propiedad intelectual y transferencia del producto.

La biblioteca convierte cuatro conversaciones anteriores en procedimientos verificables. Conserva la constitución existente y desarrolla sus reglas con responsables, contratos, registros, escenarios de fallo y criterios de aceptación. Está escrita para dirigir mis proyectos con decisiones explícitas sobre autoridad, invariantes, concurrencia, recursos, recuperación y evidencia. Cada módulo mayor desarrolla una especificación extensa que puedo aplicar por sección y revisar contra el sistema concreto.

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.** La firma es editorial; su alcance está explicado en [AUTHORSHIP.md](AUTHORSHIP.md).

## Sistema de agentes listo para clonar

El repositorio funciona como sistema de orquestación en Claude Code, Codex u otros hosts. No requiere instalar dependencias: los agentes y skills son Markdown, y el validador e instalador usan solo Node.js 24.

```bash
git clone https://github.com/oprbguitar/dev-funcy-agents-03-10-26.git
```

| Host | Cómo usarlo | Qué obtienes |
|---|---|---|
| Claude Code (dentro del repo) | Abre el clon; [CLAUDE.md](CLAUDE.md) importa [AGENTS.md](AGENTS.md) | Reglas EOS, 13 subagentes y 6 skills |
| Claude Code (como plugin) | `/plugin marketplace add oprbguitar/dev-funcy-agents-03-10-26` y luego instala `eos-agents` | Subagentes `eos-*` y skills en cualquier proyecto |
| Claude Code (copia local) | `node scripts/install-agents.mjs --host claude --target <proyecto>` | `.claude/agents/`, `.claude/skills/`, `.eos/` y bloque en `AGENTS.md`/`CLAUDE.md` |
| Codex | `node scripts/install-agents.mjs --host codex --target <proyecto>` | Bloque EOS en `AGENTS.md`, skills en `.agents/skills/`, roles en `.agents/eos-agents/` |
| Otro host o modelo local | Entrega `AGENTS.md`, la skill del modo y el archivo del rol | Las mismas reglas por lectura manual |

El instalador acepta `--dry-run` para revisar el efecto antes de escribir, nunca sobrescribe archivos existentes y registra lo creado en `.eos/install-manifest.json`. Revisa las herramientas de cada agente antes de habilitarlo en un proyecto con datos sensibles.

| Agente | Para qué |
|---|---|
| [eos-orchestrator](agents/eos-orchestrator.md) | Coordina admisión, plan, delegación, integración, verificación y publicación autorizada |
| [eos-planner](agents/eos-planner.md) | Planes ejecutables con hitos verificables y ownership de archivos |
| [eos-architect](agents/eos-architect.md) | Contratos, tres alternativas y ADR |
| [eos-tdd-guide](agents/eos-tdd-guide.md) | Pruebas primero y caracterización de sistemas existentes |
| [eos-implementer](agents/eos-implementer.md) | Cambios acotados con verificación |
| [eos-code-reviewer](agents/eos-code-reviewer.md) / [eos-security-reviewer](agents/eos-security-reviewer.md) | Revisión en solo lectura con severidad y evidencia |
| [eos-qa-verifier](agents/eos-qa-verifier.md) | Ejecuta verificaciones y reporta estados exactos |
| [eos-docs-writer](agents/eos-docs-writer.md) | Documentación sincronizada y firmada |
| [eos-migration-archaeologist](agents/eos-migration-archaeologist.md) | Inventario y reglas ocultas de sistemas heredados |
| [eos-incident-commander](agents/eos-incident-commander.md) | Respuesta a incidentes y postmortem |
| [eos-release-manager](agents/eos-release-manager.md) | Releases reproducibles y transferencia |
| [eos-compliance-analyst](agents/eos-compliance-analyst.md) | Aplicabilidad normativa, licencias y promesas comerciales |

El diseño toma patrones verificables de los principales sistemas de agentes —procedimientos por rol y artefactos intermedios, grafos de estado con puntos de control, transferencias con guardrails, sandboxes paralelos, subagentes definidos en archivo, instrucciones por directorio y planes ejecutables— sin depender de ninguno. El detalle está en [AGENT-ORCHESTRATION](docs/manuals/AGENT-ORCHESTRATION.md), Parte II.

## Empieza según tu trabajo

| Lo que necesitas | Entrada | Resultado esperado |
|---|---|---|
| Entender el marco completo | [Constitución maestra](EOS_MASTER_SYSTEM_INSTRUCTION.md) y [mapa de lectura](docs/CODEX-NAVIGATION-GUIDE.md) | Saber qué reglas aplican y qué partes están dormidas |
| Crear un producto | [INIT](skills/eos-init/SKILL.md) | Perfil, decisiones, implementación autorizada y pruebas |
| Adoptar software existente | [ADOPT](skills/eos-adopt/SKILL.md) | Baseline, reglas reales, brechas y mejora progresiva |
| Revisar sin cambiar el sistema | [AUDIT](skills/eos-audit/SKILL.md) | Hallazgos respaldados por evidencia y limitaciones |
| Cambiar tecnología o proveedor | [MIGRATE](skills/eos-migrate/SKILL.md) | Equivalencia, transición y retorno verificable |
| Preparar una entrega | [RELEASE](skills/eos-release/SKILL.md) | Versión reproducible, aceptación y operación |
| Responder a un incidente | [INCIDENT](skills/eos-incident/SKILL.md) | Contención acotada, recuperación y postmortem |

## La biblioteca operativa

| Manual | Qué desarrolla |
|---|---|
| [Prime Directive](docs/manuals/PRIME-DIRECTIVE.md) | Autoridad, decisión, evidencia, presupuesto, reversibilidad y cierre del trabajo |
| [Capability Profiler](docs/manuals/CAPABILITY-PROFILER.md) | Clasificación, admisión, dependencias, activación, degradación y retiro de capacidades |
| [Ingeniería y calidad](docs/manuals/ENGINEERING-QUALITY.md) | Perfil, arquitectura, TDD, contratos, UX, rendimiento y evidencias |
| [Orquestación de agentes](docs/manuals/AGENT-ORCHESTRATION.md) | Roles, coordinación, permisos, paquetes de contexto y revisiones |
| [AI Gateway](docs/manuals/AI-GATEWAY.md) | Puerto dormido, modos, recursos, modelos, costos, privacidad y sustitución |
| [Security Fabric](docs/manuals/SECURITY-FABRIC.md) | Edge, bots, login, sesiones, cadena de suministro y seguridad de agentes |
| [Respuesta a incidentes](docs/manuals/INCIDENT-RESPONSE.md) | Estados de defensa, playbooks, falsos positivos y recuperación |
| [Pagos](docs/manuals/PAYMENTS.md) | Estados, idempotencia, webhooks, ledger, conciliación y resultados inciertos |
| [Almacenamiento y datos](docs/manuals/STORAGE-DATA.md) | Capacidad, retención, cuotas, tiers, sincronización y restauración |
| [Actualización y fiabilidad](docs/manuals/UPDATES-RELIABILITY.md) | Releases, migraciones, observabilidad, reversión y auditoría |
| [Cumplimiento, producto y propiedad intelectual](docs/manuals/COMPLIANCE-IP-PRODUCT.md) | Aplicabilidad, fuentes, privacidad, autoría, licencias y promesas comerciales |
| [Migración y transferencia](docs/manuals/MIGRATION-HANDOFF.md) | Arqueología, caracterización, equivalencia y mantenimiento por el receptor |

Los [agentes](agents/README.md), los [prompts de ejecución](prompts/README.md), las [plantillas](templates/README.md) (incluido el [plan ejecutable](templates/EXEC-PLAN.md)), el [perfil de esta biblioteca](docs/PROJECT-PROFILE.md), el [registro de fuentes](docs/sources/README.md) y la [trazabilidad por sección](docs/sources/TRACEABILITY.md) completan el recorrido.

Por decisión del propietario, **cada uno de los doce módulos mayores debe superar 1,000 líneas de contenido**, con un piso adicional de 12,000 palabras por módulo. El validador excluye líneas vacías, títulos, marcadores de bloque, separadores y puntuación estructural del conteo. Una instrucción conserva su unidad lógica en una línea: envolver párrafos o repetir texto para alcanzar el piso incumple esta edición. El [informe de profundidad](docs/DEPTH-REPORT.md) registra las medidas y el alcance de revisión; los números por sí solos no prueban calidad técnica.

La constitución sirve de entrada y autoridad común. Las skills, prompts y plantillas conservan su función de ejecución y registro; el requisito extenso aplica a los doce módulos de `docs/manuals/` identificados en [library.json](library.json).

## Úsalo en otro proyecto

1. Lee la constitución, PRIME-DIRECTIVE y CAPABILITY-PROFILER; selecciona el modo y las capacidades aplicables. Entrega al agente las reglas comunes, los contratos relevantes y las referencias de edición y cláusula.
2. Integra una referencia a EOS en el `AGENTS.md` existente del destino. Conserva instrucciones locales, controles de permisos y decisiones anteriores.
3. Completa [Project Profile](templates/PROJECT-PROFILE.md), la matriz de capacidades y el [paquete de tarea](templates/TASK-PACKET.md).
4. Usa la skill del modo y exige una salida con archivos, pruebas, hallazgos, límites y próximos pasos concretos.
5. Versiona la configuración EOS aplicada y registra excepciones. Revisa las mejoras del marco antes de incorporarlas a un producto activo.

Ejemplo de petición adaptada:

```text
Aplica EOS 3.0.0 en MODE=ADOPT a este repositorio.
Objetivo: documentar y corregir el fallo de sesión que describo.
Alcance: autenticación web y pruebas relacionadas.
No cambies pagos, base de datos ni infraestructura.
Primero inspecciona y captura el comportamiento actual.
Usa roles disponibles, declara responsabilidades y limita permisos.
Consulta PRIME-DIRECTIVE, CAPABILITY-PROFILER, ENGINEERING-QUALITY y SECURITY-FABRIC.
Entrega la corrección, evidencia de regresión y riesgos pendientes.
La publicación requiere la autorización que figure en el paquete de tarea.
```

Las skills y los agentes son procedimientos Markdown transportables. No se instalan globalmente por sí solos, no conceden permisos y no cambian la configuración de Claude/Codex; el instalador solo copia archivos al proyecto que indiques. Su invocación depende de las funciones reales de cada entorno.

## Qué existe y qué debes implementar en el producto

Este repositorio entrega instrucciones, contratos propuestos, ejemplos, plantillas, fuentes y un validador. No ejecuta un WAF, un SOC, un servidor de IA, una pasarela de pago, un updater ni un panel administrativo. Las rutas administrativas y diagramas de los manuales son propuestas de arquitectura.

Una capacidad atraviesa estados separados: `PRESENT`, `ASSESSED`, `DORMANT`, `PLANNED`, `IMPLEMENTED`, `VERIFIED`, `OPERATING`, `DEGRADED`, `RETIRED`. Solo se declara operativa cuando hay implementación y evidencia del entorno real. IA apagada implica que no se descargan modelos, no se llama a proveedores y no se inicia gasto por este marco.

## Verifica esta biblioteca

Requisito de las herramientas: **Node.js 24 LTS**, sin paquetes externos. No se necesita Node para leer los documentos.

```powershell
node scripts/validate-library.mjs
node --test --experimental-test-coverage --test-coverage-include=scripts/validate-library.mjs --test-coverage-lines=80 --test-coverage-branches=80 --test-coverage-functions=80 tests/validate-library.test.mjs
node --test --experimental-test-coverage --test-coverage-include=scripts/install-agents.mjs --test-coverage-lines=80 --test-coverage-branches=80 --test-coverage-functions=80 tests/install-agents.test.mjs
git diff --check
```

El validador revisa [library.json](library.json), existencia de documentos, firma editorial, frontmatter de los 13 agentes, versión del plugin, enlaces Markdown locales en prosa, cierre de bloques de código, SHA-256 de las cuatro fuentes y los pisos de líneas y palabras por módulo. Imprime las medidas de cada módulo cuando todos los controles pasan. No valida semánticamente contratos, no certifica legislación, no comprueba anchors ni enlaces externos y no prueba la seguridad de una aplicación. Las pruebas unitarias, de integración y de CLI cubren el validador; la cobertura no se extiende al texto ni a productos futuros. Consulta [VERIFICATION.md](docs/VERIFICATION.md).

## Mi criterio de trabajo

- La evidencia pesa más que la preferencia por un framework o proveedor.
- La autonomía sirve para avanzar dentro de un permiso concreto.
- La seguridad debe proteger a usuarios legítimos, incluyendo recuperación y falsos positivos.
- Una capacidad disponible en el estándar se activa cuando el producto la necesita.
- Un software existente se entiende y se protege antes de reemplazarlo.
- Los recursos, costos, licencias y datos condicionan cualquier decisión de IA.
- Una entrega se termina cuando otra persona puede reproducirla, operarla y mantenerla.

Consulta [CHANGELOG.md](CHANGELOG.md) para conocer la evolución. Las cuatro conversaciones son antecedentes; sus afirmaciones históricas no sustituyen la comprobación de fuentes actuales.
