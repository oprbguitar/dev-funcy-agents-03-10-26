# Ingeniería, arquitectura y calidad verificable

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

**Origen:** SRC-03, especialmente §§8–29, 53–61, 108–116 y 125–153. **Constitución:** §§5–10, 38–46, 60–63 y 84–95. **Estado:** procedimiento operativo de diseño y ejecución; la aplicación concreta debe aportar sus propias pruebas.

## 1. Contrato de una tarea de ingeniería

Antes de implementar, escribe el comportamiento que debe cambiar y el que debe conservarse. «Mejorar el sistema» necesita traducirse en tareas observables: recuperar una sesión válida tras un refresh, exportar todas las filas con sus filtros o conseguir que un usuario complete una reserva en móvil. El alcance incluye archivos, consumidores, datos y entorno. La urgencia no reemplaza este contrato.

La entrada mínima es objetivo, contexto del producto, autorización, evidencia disponible, baseline y criterio de aceptación. La salida mínima es cambio revisable, resultado de pruebas, decisiones relevantes, riesgos y operación posterior. Si faltan datos que condicionan permisos o integridad, trabaja en inspección y propuesta mientras solicitas la aclaración necesaria. Las preferencias reversibles se resuelven con criterio y se explican.

| Responsable | Obligación | Evidencia |
|---|---|---|
| Orchestrator | Mantener objetivo, dependencias y alcance | Paquete de tarea actualizado |
| Arquitecto | Definir límites y comparar alternativas | ADR proporcional al cambio |
| Developer | Implementar el comportamiento acordado | Diff y pruebas |
| TDD Guide | Diseñar regresión relevante antes del cambio | RED, GREEN y coverage del código |
| Reviewer | Contrastar consecuencias y contratos | Hallazgos con ubicación |
| Especialista UX/SRE/Data | Revisar su riesgo cuando corresponda | Medición o escenario específico |
| Propietario | Autorizar operaciones sensibles o externas | Alcance de autorización registrado |

No es obligatorio ejecutar siete agentes para corregir una etiqueta. Las responsabilidades deben quedar cubiertas y los agentes usados deben existir realmente en el runtime. La separación más importante ocurre entre quien propone un cambio de alto riesgo y quien verifica su consecuencia.

## 2. Perfil y clasificación antes de elegir tecnología

Completa [el perfil](../../templates/PROJECT-PROFILE.md) con problema, usuarios, flujos, plataforma, datos, exposición, criticidad, disponibilidad, recursos, costos, jurisdicción y receptor futuro. Registra `unknown` cuando no existe evidencia. No conviertas usuarios registrados en concurrencia ni una expectativa comercial en capacidad probada.

Una aplicación de consulta sobre un archivo grande puede necesitar lectura paginada y un índice local; una aplicación multiusuario necesita transacciones y controles de aislamiento; un producto offline necesita una política de sincronización. Elegir la base por popularidad ignora estas diferencias. Evalúa primero patrones de lectura/escritura, tamaño real, latencia, mantenimiento y recuperación.

En L0 el objetivo puede ser validar una idea con datos sintéticos. En L1 prima el uso mantenible por un equipo pequeño. L2 exige operación real y recuperación. L3 incorpora varios equipos, integraciones y responsabilidades. L4 requiere controles adicionales según impacto y regulación. Estos niveles son perfiles EOS internos; no son certificaciones externas. La criticidad del componente puede superar a la del resto del producto: un pequeño portal con pagos necesita invariantes financieros específicos.

## 3. Arquitectura mediante alternativas reales

Considera al menos una alternativa sencilla, una intermedia y una especializada cuando la decisión compromete evolución o costos. Para un servicio de consultas, podrían ser aplicación nativa con almacenamiento local, monolito modular con base gestionada y API independiente con workers. Compara los mismos criterios y conserva restricciones que descartan una opción.

La decisión describe cómo cada alternativa cumple los requisitos, su carga operativa, costo estimado con supuestos, privacidad, dependencia de proveedores, competencias del receptor, prueba necesaria y salida de migración. No llenes una matriz con puntuaciones inventadas. Si asignas pesos, explica quién los decidió y muestra incertidumbre.

Usa límites de dominio claros. La lógica de negocio consume interfaces; adapters concretan bases, proveedores, IA, correo y pagos. Esta separación no obliga a crear microservicios ni a construir una abstracción para cada función. Un monolito modular puede preservar independencia suficiente con menor operación.

Cada módulo declara entradas, salidas, invariantes y dependencias permitidas. Evita ciclos de importación y fuentes de estado duplicadas. Si una misma entidad vive en cliente, API y base, define cuál representación es autoritativa y cómo se versiona. Mantén las decisiones en [ADR](../../templates/ADR.md), incluyendo qué hecho futuro haría reconsiderarlas.

## 4. Contratos y compatibilidad

Documenta contratos de APIs y eventos con formatos apropiados: OpenAPI para HTTP cuando aporte valor, esquemas de eventos para mensajes y contratos del cliente real. Un contrato debe describir tipos, unidades, zona horaria, moneda, nulabilidad, autenticación, permisos, errores, paginación, cuotas, idempotencia y versiones. Un JSON de ejemplo no describe por sí solo todos los valores permitidos.

| Cambio | Riesgo a evaluar | Prueba requerida |
|---|---|---|
| Campo opcional adicional | Clientes con parsers estrictos | Compatibilidad del consumidor real |
| Campo obligatorio nuevo | Solicitudes antiguas inválidas | Versión o transición compatible |
| Cambio de unidad o moneda | Cálculos silenciosamente incorrectos | Test de valores y semántica |
| Orden de paginación | Duplicados o filas faltantes | Recorrido completo con cambios concurrentes |
| Nuevo estado de evento | Consumidor ignora o rompe | Estado desconocido y replay |
| Error renombrado | UI pierde recuperación | Test de error y acción del usuario |

Valida entradas en los límites con esquema y restricciones semánticas. Los inputs internos pueden requerir validación adicional cuando cruzan confianza, persistencia o herramientas de IA. Usa consultas parametrizadas, controla rutas y distingue texto de comandos. Evita interpolar datos del usuario en shell o HTML. La corrección de un test nunca consiste en retirar una validación porque hizo visible un supuesto equivocado.

## 5. Ciclo TDD con evidencia suficiente

1. Reproduce el problema con el mínimo escenario representativo. Captura versión, entrada y resultado actual.
2. Escribe una prueba del comportamiento esperado. Debe fallar por el defecto concreto; una importación rota solo es un RED de bootstrap, no una reproducción de un bug de negocio.
3. Implementa el cambio mínimo que haga pasar el caso. Conserva contratos relacionados.
4. Añade bordes donde el impacto lo exige: ausencia de datos, errores del proveedor, concurrencia, autorización, timeout y repetición.
5. Refactoriza solo dentro del alcance y repite los checks pertinentes.
6. Revisa coverage de código ejecutable. El objetivo EOS es al menos 80%; la cifra no reemplaza pruebas de casos críticos.
7. Ejecuta revisión del diff y prueba del flujo real cuando el cambio afecta interacción o integración.

Las unitarias prueban reglas y transformaciones. Las de integración prueban límites reales entre componentes, persistencia y contratos. Las E2E prueban un recorrido del usuario o un comando de extremo a extremo. En una herramienta CLI documental no existe una interfaz web que justifique Playwright; una prueba del proceso y sus exit codes es su E2E adecuada.

La cobertura se declara por conjunto de archivos y versión. Nunca incluyas documentación como si fuera lógica probada. No cuentes mocks como validación del proveedor real. Un test con mock y un test sandbox tienen propósitos diferentes, y producción requiere su propio alcance autorizado. Si no puede ejecutarse una prueba, conserva su estado pendiente y explica el motivo específico.

## 6. Baseline y ausencia de regresión

En ADOPT captura flujos principales antes de cambiar. No presupongas que lo viejo es correcto: etiqueta reglas verificadas, comportamientos aceptados y defectos conocidos. Una characterization test protege el comportamiento observado hasta que se decide modificarlo; no convierte un error en requisito.

Una corrección de autenticación exige revisar login, refresh, expiración, logout, permisos y sesiones revocadas según alcance. Una corrección de búsqueda exige revisar filtros, orden, resultados vacíos, paginación y exportación. Una mejora visual pequeña no necesita reescribir todo el test suite, pero debe comprobar el flujo afectado y las vistas donde cambia el layout.

Guarda resultados comparables: misma carga, conjunto de datos, máquina o descripción de diferencias, build y periodo. Si un benchmark usa muestras pequeñas, no extrapoles capacidad a millones de usuarios. Si los tiempos se midieron con caché caliente, declara esa condición.

## 7. Diseño y experiencia de usuario

El objetivo visual nace del dominio, los usuarios, los flujos y la densidad de información. Antes de componer una UI inspecciona lo existente, considera tres direcciones estructurales y selecciona una con razones. Aplica el harness de diseño que esté realmente configurado en el entorno. Los comandos de un harness ausente se reportan como no disponibles; no se inventa una aprobación.

Define tokens antes de la pantalla: colores con roles, familias tipográficas por contexto, escala de tamaños, espaciado, radios, sombras, densidad y motion. Mantén `DESIGN.md` en aplicaciones sustanciales y conserva identidad aprobada. Para el contexto personal de Pierre, prioriza legibilidad, español de Perú, acentos controlados, eficiencia de información y tipografía madura. Evita por defecto Inter, Geist, Roboto y system-ui; no uses una paleta industrial como si fuera una norma regulada.

Verifica 360, 768, 1280 y 1600 px. Complementa con zoom, portrait/landscape y contenido largo. Probar solo una captura vacía omite errores habituales: nombres largos, tablas densas, estados vacíos, validaciones y menús. En móvil revisa drawers, foco, navegación, botones, formularios, teclado virtual, scroll y overflow.

Cada componente tiene estados deliberados de hover, active, focus-visible, disabled, loading y selected cuando corresponda. El estado loading conserva contexto y evita múltiples envíos. El estado error explica qué pasó y cómo continuar sin revelar información sensible. El estado vacío ofrece una acción útil sin inventar métricas. Motion comunica cambio o continuidad y respeta `prefers-reduced-motion`.

Usa teclado y comprueba foco visible, lectura de etiquetas, secuencia y recuperación tras cerrar modales. Evalúa contraste, alternativas de texto, reflow y formularios. WCAG 2.2 es una referencia técnica oficial que debe aplicarse según el alcance acordado; un escaneo automático o cuatro viewports no acredita conformidad completa. [W3C](https://www.w3.org/TR/WCAG22/), referencia consultada el 2026-10-03.

## 8. Rendimiento y escalado progresivo

Mide antes de optimizar. Divide tiempo de extremo a extremo en cliente, red, aplicación, base y proveedor. Registra percentiles y tamaño de la muestra; el promedio puede ocultar colas y picos. Un fallo ocasional de latencia se analiza con carga, queries, locks, I/O y límites del proveedor antes de culpar al lenguaje.

El orden de evaluación es código, acceso a datos, índices, caché, trabajo asíncrono, escala horizontal, replicas y extracción de dominios. No todos los pasos son necesarios. Un índice debe justificarse con consulta y plan, incluyendo costo de escritura. Una caché declara TTL, invalidación, aislamiento por usuario/tenant y comportamiento ante caída. Un worker declara timeout, retry, deduplicación y dead-letter.

El presupuesto incluye latencia, throughput, memoria, CPU, bundle, arranque, costos y recursos compartidos. Los umbrales se acuerdan o se marcan como hipótesis; no se presentan como universales. Repite mediciones después del cambio y conserva comparación. Si mejora un flujo y empeora otro crítico, la optimización no cumple todavía.

## 9. Código mantenible y error handling

Organiza por dominio y responsabilidad. Prefiere funciones cortas y archivos enfocados, normalmente entre 200 y 400 líneas y con revisión cuando excedan 800. No partas un contrato cohesivo solo para cumplir una cifra. Las estructuras compartidas se actualizan mediante nuevas copias cuando corresponda; documenta operaciones transaccionales y mecanismos de sincronización, donde «inmutable» no elimina persistencia controlada.

Maneja errores en el límite apropiado con contexto privado y mensaje útil. No captures una excepción para devolver éxito o una lista vacía indistinguible de datos reales. Clasifica input inválido, acceso negado, no encontrado, conflicto, indisponibilidad y error interno. Los logs usan trace y referencias minimizadas; los clientes no reciben stacks, SQL, claves ni rutas sensibles.

Las dependencias tienen propósito, versión, licencia, dueño, mantenimiento, vulnerabilidades conocidas, tamaño e impacto de reemplazo. Actualiza con evidencia. Un package con auditoría limpia puede tener riesgos de mantenimiento; un scanner que terminó no demuestra que todos sus findings fueron triados. Las excepciones usan vencimiento y compensación.

## 10. Control administrativo y aprendizaje

Para productos que necesitan consola de ingeniería, cada vista declara fuente, frescura, permisos y acciones. Un health score requiere una fórmula pública dentro del sistema, pesos acordados y controles faltantes visibles. No promedies un riesgo crítico hasta ocultarlo con métricas verdes. Un badge `OPERATING` necesita evidencia, y `DORMANT` no puede mostrar costos inventados.

Technology Scout registra ADOPT, TRIAL, ASSESS y HOLD con versión, fuente y contexto. Regulatory Scout y Model Scout siguen sus manuales. Una recomendación no se autoaplica. Una lección de incidente se propone como cambio versionado y se prueba en un alcance comparable antes de generalizar.

## 11. Cierre y revisión

Entrega objetivo cumplido, archivos, pruebas y alcance, decisiones, riesgos, ruta de operación y versión. Revisa todos los archivos del cambio; no atribuyas checks que no ejecutaste. La aceptación exige que el comportamiento pedido funcione y que los límites estén claros. Una implementación con una limitación pendiente no se vende como completamente verificada.

| Escenario de fallo | Respuesta requerida | Prueba de aceptación |
|---|---|---|
| No se reproduce el bug | Preservar evidencia y refinar escenario | Caso que falle por la causa real |
| Test solo verifica implementación | Cambiarlo a conducta observable | Detecta una regresión plausible |
| Bench incomparable | Repetir con condiciones registradas | Before/after interpretable |
| UI falla con datos largos | Corregir layout y foco | Viewports y flujo autenticado |
| Dependencia sin licencia clara | Detener incorporación | Registro de licencia revisado |
| Scope crece por preferencia | Separar propuesta del cambio | Diff limitado al objetivo |
| Mantenimiento depende del autor | Mejorar runbook y handoff | Receptor puede reproducirlo |
