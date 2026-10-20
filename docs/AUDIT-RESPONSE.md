# Auditoría aportada: decisiones, correcciones y pendientes

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Fecha: 2026-10-19, America/Lima. Modo ADOPT, biblioteca L1. La auditoría entregada es una fuente de observaciones, no órdenes ejecutables ni evidencia automática de vulnerabilidades. Se contrastó contra la revisión local 4.4.1 y sus herramientas; no se reprodujeron tiempos históricos de CI ni se adoptaron sus estimaciones de días como compromiso. El manifiesto previo declaraba 4.4.1 en la rama de ampliación y 4.2.0 en main, no una versión uniforme en todo el repositorio.

## Decisiones por observación

| Observación | Decisión y evidencia | Límite o siguiente paso |
|---|---|---|
| Ramas desalineadas | IMPLEMENTED: PR #7 fusionado en main con commit `70c89b14`; PR #8 cambiado a base main y fusionado con commit `9c629682`. Se conserva ascendencia; la ampliación nueva se integra después de su CI | Revisar main final, SHA remoto y ramas totalmente fusionadas; no borrar trabajo ajeno ni reescribir historia |
| run sin timeout | CONFIRMED/FIXED: antes spawnSync carecía de límite; ahora timeout validado, SIGKILL para hijo, salida 124, ledger con causa/señal/código | No sandbox, no aprobación A3/A4, no garantía sobre todos los descendientes. El host sigue autorizando herramientas |
| Política de comandos permitidos | DEFERRED: no se incorpora un filtro de palabras que aparente garantizar efectos seguros | Para aislamiento real diseñar ejecutables permitidos, argumentos/recursos, datos, red, permisos y plataforma. El usuario no ha pedido instalar sandbox/proveedor |
| gate con tiempo agregado excesivo | CONFIRMED/FIXED: presupuesto total monotónico, timeout por comando, fail-fast opcional, NOT_RUN con razón y fallo global. Biblioteca configura 60 s/comando y 120 s/secuencia | El total cubre ejecución secuencial, no fingerprint/preparación. Mantiene trust explícito; paralelo requiere declarar dependencias y política propia |
| Instalador y symlinks/junctions | CONFIRMED/FIXED: fixtures reales en Windows mostraron escritura exterior por enlaces interiores y backup. Preflight revisa rutas portables, origen, destino, propuestas, registro y backups | Raíz elegida canonicalizada puede ser junction; se rechazan enlaces interiores incluso internos. No resuelve TOCTOU ni caída abrupta |
| Registro final y rollback | IMPLEMENTED: registro se escribe al final del plan y entra en rollback de errores capturados; revisión independiente detectó además destinos duplicados que podían reemplazar baseline de backup | FIXED y verificado: ruta/contenido idénticos se deduplican antes de contadores y escrituras; contenidos distintos y aliases Windows se rechazan antes de escribir. Instalación real comprobada. La restauración puede dejar directorios vacíos/backups |
| Ayuda al usuario ausente en productos | IMPLEMENTED en EOS: sección 98, skill, checklist, perfil y gates INIT/ADOPT/RELEASE. Una app debe ofrecer guía dentro de la interfaz con tareas, permisos, errores y recuperación | La biblioteca no modifica retroactivamente todas las aplicaciones. ADOPT inspecciona carencias y corrige el alcance autorizado; resto con dueño/plazo |
| Menú desplegable, iconos y guías de referencias del propietario | ASSESSED: patrones de Smart Storage y personalERP inspeccionados por rutas/commits, con procedencia/licencias y límites explícitos | Adoptar comportamiento según módulos/arquitectura, no copiar código propietario ni afirmar UI probada por inspección estática |
| Recuperación adversarial 60% | CONFIRMED como resultado del corpus previo, no exactitud de respuestas. Se añaden regresiones de recuperación para ayuda; no se retocan expectativas existentes para inflar puntaje | Aumentar corpus independiente y medir sinónimos/reformulación con presupuesto. La mejora de recuperación general sigue pendiente |
| Índice persistente/caché | DEFERRED: no se introduce estado persistente sin medir beneficio y coste de invalidación | Diseñar clave de versión/hashes, archivo atómico, concurrencia, permisos, corrupción y fallback; medir frío/caliente antes de elegir |
| Doctor | BACKLOG P1: útil como diagnóstico read-only de versión/integridad/instalación/conflictos | No declarar comando existente. Definir contrato JSON y pruebas sobre instalación sana, modificada, parcial y host desconocido |
| Benchmark EOS vs sin EOS | BACKLOG P1: necesario para afirmar eficiencia real | Misma tarea/criterios/entorno/modelo, orden y réplica, tiempo/tokens/costo/defectos/intervenciones con límites. No inventar ahorro |
| Perfiles ERP/SaaS/desktop/jurídico/POS | PARTIAL: existen perfil, criticidad y skills condicionales; no detector semántico de capacidades certificadas | Extender perfiles basados en evidencia de pilotos autorizados, evitando activar SUNAT/pagos/IA por nombre |
| Dashboard, radar normativo y generador | DEFERRED: son propuestas de producto, no correcciones necesarias de la biblioteca | Requieren caso de uso, recursos, datos, seguridad y aceptación. No se despliega web, scheduler ni servicio externo por esta auditoría |
| Pilotos en aplicaciones reales | NOT_RUN en este incremento | Los dos repos citados son referencias de patrones. PersonalERP tiene cambios locales conservados; no se ejecutan flujos financieros ni se modifican productos sin tarea específica |

## Ejecución acotada, no aislamiento

`run --timeout-ms` admite enteros 1–3600000 ms, por defecto 600000 ms. Timeout termina como 124 y registra fallo con contexto; no cuenta como tarea exitosa. `gate` admite timeout_ms, total_timeout_ms y fail_fast en configuración y los flags correspondientes. Un comando que agota presupuesto falla; los restantes se marcan NOT_RUN con TOTAL_BUDGET o FAIL_FAST. La salida JSON conserva las causas. La confianza sigue vinculada al archivo y revisión según su alcance; el agente no se concede confianza a sí mismo.

No hay clasificación jurídica de comandos arbitrarios ni credencial de aprobación inventada. La ejecución de un shell dentro de gate sigue siendo una facultad del archivo revisado, y run conserva argumentos sin shell. Un timeout no limita CPU/memoria/red ni permisos del proceso y no es un sandbox. Para comandos que lancen servicios persistentes se requiere administración de procesos específica y autorizada.

## Documentación operativa y evidencia

Usa [USER-HELP](../skills/eos-user-help/SKILL.md), [checklist](../templates/USER-GUIDE-CHECKLIST.md) y [patrones inspeccionados](reference/USER-HELP-NAVIGATION-PATTERNS.md). Ninguna guía aprueba funciones que no existen. Una aplicación debe probar acceso a ayuda desde UI, instrucciones por rol/tarea y recuperación en la misma versión. En CLI/biblioteca, los comandos existentes y manual constituyen el canal; EOS incorpora help/--help y ayuda por comando con salida 0, respetando argumentos del programa ejecutado tras --. No se impone un dashboard.

Evidencias definitivas, conteos de tests/cobertura y publicación: [VERIFICATION](VERIFICATION.md) y [estado canónico](EOS-PROJECT-STATUS.md). Un PASS de biblioteca no certifica privacidad, calidad, accesibilidad o conformidad normativa de sus productos receptores. El backlog no se presenta como implementación ni como fecha comprometida.
