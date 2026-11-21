# Centro de documentación interna EOS

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Punto único para encontrar cualquier documento de esta biblioteca y contrato mínimo de documentación interna que EOS exige a cada producto que construye o adopta. El [README](../README.md) resume; aquí se navega.

## Cómo buscar

1. **Por tarea:** `node scripts/eos.mjs context "<tarea>" --list` devuelve las secciones exactas que cargar.
2. **Por tema:** usa las tablas de abajo; cada fila apunta a un solo documento canónico.
3. **Por estado:** [estado vivo](EOS-PROJECT-STATUS.md) y [verificación](VERIFICATION.md) dicen qué existe y qué se comprobó.

## Gobierno y lectura obligatoria

| Documento | Uso |
|---|---|
| [EOS-CORE](../EOS-CORE.md) | Digesto operativo: modos, autonomía y tabla de carga bajo demanda |
| [Constitución](../EOS_MASTER_SYSTEM_INSTRUCTION.md) | Autoridad final; se lee por secciones |
| [AGENTS.md](../AGENTS.md) · [CLAUDE.md](../CLAUDE.md) | Reglas del repositorio para cualquier host |
| [Guía de navegación](CODEX-NAVIGATION-GUIDE.md) | Qué leer según el tipo de tarea |
| [Guía completa](GUIA-COMPLETA.md) | Instalación por host, actualización, tokens, calidad ISO/Perú |

## Manuales

Contratos extensos de ingeniería (un manual, una función).

| Área | Manual |
|---|---|
| Autoridad, decisión y cierre | [PRIME-DIRECTIVE](manuals/PRIME-DIRECTIVE.md) |
| Activar o dormir capacidades | [CAPABILITY-PROFILER](manuals/CAPABILITY-PROFILER.md) |
| Roles, delegación y permisos | [AGENT-ORCHESTRATION](manuals/AGENT-ORCHESTRATION.md) |
| IA conectable, modelos y costos | [AI-GATEWAY](manuals/AI-GATEWAY.md) |
| Seguridad activa, bots, login, DDoS | [SECURITY-FABRIC](manuals/SECURITY-FABRIC.md) |
| Incidentes | [INCIDENT-RESPONSE](manuals/INCIDENT-RESPONSE.md) |
| Pagos | [PAYMENTS](manuals/PAYMENTS.md) |
| Datos, almacenamiento y backup | [STORAGE-DATA](manuals/STORAGE-DATA.md) |
| Releases, SLO y observabilidad | [UPDATES-RELIABILITY](manuals/UPDATES-RELIABILITY.md) |
| Calidad, TDD y UX | [ENGINEERING-QUALITY](manuals/ENGINEERING-QUALITY.md) |
| Regulación, PI y licencias | [COMPLIANCE-IP-PRODUCT](manuals/COMPLIANCE-IP-PRODUCT.md) |
| Migración y transferencia | [MIGRATION-HANDOFF](manuals/MIGRATION-HANDOFF.md) |

## Referencias

Guías aplicadas, cortas y accionables.

| Tema | Referencia |
|---|---|
| Seguridad de programación básica: bots, fuerza bruta, abuso, inyección | [SECURE-CODING-BASELINE](reference/SECURE-CODING-BASELINE.md) |
| Menú plegable, temas, guía, documentación y administrador | [APP-SHELL-NAVIGATION](reference/APP-SHELL-NAVIGATION.md) |
| Diseño de sistema inicial y base de datos | [SYSTEM-DESIGN-BASELINE](reference/SYSTEM-DESIGN-BASELINE.md) |
| Ayuda al usuario, iconos y onboarding | [USER-HELP-NAVIGATION-PATTERNS](reference/USER-HELP-NAVIGATION-PATTERNS.md) |
| Marca y color | [BRAND-AND-COLOR-SYSTEM](reference/BRAND-AND-COLOR-SYSTEM.md) |
| Referencias de landing | [LANDING-REPOSITORY-RESEARCH](reference/LANDING-REPOSITORY-RESEARCH.md) |
| Privacidad Perú | [PRIVACY-PERU-REGISTRY](reference/PRIVACY-PERU-REGISTRY.md) |
| IA Perú e ISO/NTP | [AI-PERU-QUALITY](reference/AI-PERU-QUALITY.md) · [ENIA 2026–2030](reference/ENIA-2026-2030.md) |

## Estado y evidencia de esta biblioteca

| Documento | Uso |
|---|---|
| [PROJECT-PROFILE](PROJECT-PROFILE.md) | Perfil real de este repositorio |
| [EOS-PROJECT-STATUS](EOS-PROJECT-STATUS.md) | Estado vivo por hito |
| [VERIFICATION](VERIFICATION.md) | Qué verifica el gate y qué no |
| [AUDIT-RESPONSE](AUDIT-RESPONSE.md) · [DEPTH-REPORT](DEPTH-REPORT.md) | Auditoría y método de profundidad |
| [Fuentes](sources/README.md) · [trazabilidad](sources/TRACEABILITY.md) | Antecedentes históricos con hash |

## Contrato de documentación interna para cada producto

Todo producto creado (INIT) o adoptado (ADOPT) con EOS mantiene un centro de documentación interna propio, separado de la ayuda al usuario final. Mínimo exigible:

| Pieza | Contenido | Plantilla |
|---|---|---|
| `docs/README.md` del destino | Índice por grupo, como este | — |
| Perfil y estado | Qué es, quién responde, qué funciona hoy | [PROJECT-PROFILE](../templates/PROJECT-PROFILE.md), [PROJECT-STATUS](../templates/PROJECT-STATUS.md) |
| Arquitectura y decisiones | Diagrama de contexto, componentes, ADR | [ADR](../templates/ADR.md) |
| Datos | Diccionario por entidad, dueños, clasificación, linaje y pruebas | [DATA-MODEL-RECORD](../templates/DATA-MODEL-RECORD.md) |
| Seguridad | Amenazas, controles activos y pendientes | [SECURE-CODING-BASELINE](reference/SECURE-CODING-BASELINE.md) |
| Operación | Arranque, despliegue, backup, restauración, incidentes | [RELEASE-RECORD](../templates/RELEASE-RECORD.md), [INCIDENT-RECORD](../templates/INCIDENT-RECORD.md) |
| Ayuda al usuario | En la app si hay UI; en `--help`/manual si es CLI o biblioteca | [USER-GUIDE-CHECKLIST](../templates/USER-GUIDE-CHECKLIST.md) |

Reglas:

- **Un tema, un documento canónico.** Los demás enlazan; no copian.
- **Se actualiza en el mismo cambio** que altera el comportamiento; un PR que cambia código sin su documento queda incompleto.
- **Acceso interno:** si la app tiene UI, la documentación interna se enlaza desde el menú (sección *Documentación*) y la parte operativa solo es visible con sesión de administrador; la autorización real se comprueba en el servidor.
- **Etiquetas honestas:** ejemplo, propuesta, implementado y verificado se distinguen siempre.
- **Sin secretos:** nunca credenciales, tokens ni datos personales reales en la documentación.
