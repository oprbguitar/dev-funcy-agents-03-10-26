# Manual EOS: AI Integration Port y AI Gateway

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
**Versión documental:** 1.0.0 · **Fecha de elaboración:** 3 de octubre de 2026, Perú.
**Fuentes de intención:** SRC-04, conversación sobre el conector de IA; SRC-03, constitución unificada.
**Autoridad interna:** [constitución maestra](../../EOS_MASTER_SYSTEM_INSTRUCTION.md).
**Documento relacionado:** [orquestación de agentes](AGENT-ORCHESTRATION.md).

Este manual especifica una capacidad de arquitectura. Sus esquemas, rutas y ejemplos son contratos propuestos para implementar y verificar en cada proyecto; su presencia documental no acredita que exista un gateway ejecutable en este repositorio. Ninguna referencia a un proveedor garantiza compatibilidad, disponibilidad, precio, calidad o cumplimiento vigente.

## 1. Mandato de Pierre: integrable desde el inicio, activo por necesidad

Todo proyecto EOS debe conservar un punto de extensión para IA. En un sitio sencillo puede bastar un contrato documentado y un adaptador desactivado. En una aplicación compleja puede existir un servicio completo. La proporción depende del producto, la criticidad y la evidencia. Está prohibido introducir un proceso permanente, un contenedor o una descarga de modelos solo para decir que el puerto existe.

Separar cuatro estados: puerto presente, proveedor habilitado, modelo cargado y función habilitada. Tener uno no implica los demás. El estado inicial de un proyecto sin caso de IA autorizado es `OFF`: cero descargas automáticas, cero llamadas pagadas, cero precargas y ningún modelo residente. La interfaz puede consumir la memoria ordinaria de la aplicación; no se promete consumo total de RAM igual a cero.

La lógica de negocio llama al puerto, el puerto aplica políticas y el adaptador traduce al proveedor. El componente que calcula impuestos, valida identificadores o ejecuta reglas exactas conserva una implementación determinística. IA no sustituye controles de integridad, autorización ni cálculo financiero.

**Entrada:** Project Profile, casos de uso y restricciones. **Salida:** decisión de presencia y activación independiente. **Aceptación:** arrancar en `OFF` funciona sin credenciales ni runtime de modelos; las funciones esenciales mantienen su comportamiento. **Falla:** si el producto depende realmente de IA, declarar esa dependencia y ofrecer un estado de indisponibilidad honesto, sin inventar un resultado alternativo equivalente.

## 2. Modos exactos y semántica de selección

Usar exclusivamente estos identificadores en configuraciones nuevas:

| Modo | Destino permitido | Condición de uso |
|---|---|---|
| `OFF` | Ningún proveedor de IA | Contrato disponible; solicitudes de IA se rechazan claramente |
| `LOCAL` | Proceso en el mismo equipo | Recursos, licencia y aislamiento aprobados |
| `LOCAL_REMOTE` | Otro equipo o servidor de la organización | Identidad del servidor, red, transporte y permisos verificados |
| `CLOUD_API` | API de tercero | Proveedor aprobado, datos permitidos y presupuesto reservado |
| `PRIVATE_CLOUD` | Infraestructura cloud bajo gobierno de la organización | Validar operador, región, acceso, retención y dependencias externas |
| `HYBRID` | Composición de rutas autorizadas | Cada etapa conserva clasificación y trazabilidad |
| `AUTO` | Selección por políticas entre candidatos permitidos | Nunca amplía permisos ni habilita gasto por iniciativa propia |

`AUTO` es una estrategia de decisión, no una nueva ubicación. Registrar el modo solicitado y el efectivo. `LOCAL_REMOTE` no equivale automáticamente a seguro por estar en una LAN. `PRIVATE_CLOUD` tampoco garantiza exclusividad, ausencia de subencargados o residencia adecuada; esas propiedades requieren evidencia.

En adopciones, traducir etiquetas históricas como `REMOTE LOCAL` únicamente mediante una migración explícita. Un valor desconocido produce `INVALID_MODE`; no debe convertirse silenciosamente en `AUTO`.

## 3. Pipeline de admisión: intersección, nunca compensación

El router debe evaluar, en este orden lógico, autorización del caso, posibilidad determinística, capacidad requerida, clasificación de datos, destinos admitidos, compatibilidad técnica, recursos, presupuesto y salud. Puede precalcular filtros sin ejecutar proveedores. La ruta elegible es la intersección de todas las condiciones.

Un modelo barato no compensa una infracción de privacidad. Un modelo privado no compensa falta de RAM. Un modelo capaz no compensa un presupuesto agotado. Si la intersección queda vacía, devolver un rechazo específico o una alternativa con pérdida de capacidad declarada. No degradar una respuesta jurídica sustentada a una opinión genérica manteniendo la misma etiqueta de calidad.

**Ejemplo hipotético:** resumir un manual público permite candidatos cloud aprobados; extraer campos de expedientes restringidos permite únicamente destinos privados aprobados. Si el servidor privado falla, el segundo caso permanece en cola o devuelve indisponibilidad. La falla no habilita una API pública.

La selección debe registrar `policy_version`, candidatos descartados y razones. Para información desconocida aplicar la clase más restrictiva razonablemente necesaria hasta confirmar su clasificación. Una indicación contenida dentro del documento analizado nunca cambia esa política.

## 4. Clasificación, minimización y límites de circulación

| Clase | Regla EOS de enrutamiento | Evidencia mínima |
|---|---|---|
| `PUBLIC` | Destinos aprobados por política | Fuente pública y propósito válido |
| `INTERNAL` | Proveedores expresamente aprobados | Acuerdo de tratamiento y configuración evaluados |
| `CONFIDENTIAL` | Local/privado; otra ruta requiere evaluación y autorización del tratamiento | Minimización, controles y revisión del responsable |
| `RESTRICTED` | Local/privado permitido expresamente | Aislamiento, acceso, retención y auditoría adecuados |

La clasificación aplica también a prompts, adjuntos, embeddings, caché, resultados, trazas y llamadas de herramientas. Pseudonimizar no convierte automáticamente un conjunto en público. Una anonimización declarada debe evaluar reidentificación y los metadatos conservados. Este manual establece controles internos; no sustituye la determinación legal del tratamiento aplicable.

Recuperar solo fragmentos necesarios; filtrar autorización antes de recuperar; deduplicar sin mezclar organizaciones; redactar secretos; limitar retención. El caché debe separar organización, usuario o dominio de autorización, política, modelo, versión y propósito. Invalidarlo cuando cambie el acceso. Prohibir reutilización cruzada que revele información privada.

**Prueba negativa:** dos organizaciones presentan prompts iguales con documentos diferentes; ningún resultado de una debe aparecer en la otra. **Aceptación:** el contexto enviado puede reconstruirse mediante identificadores y hashes autorizados sin publicar su contenido sensible.

## 5. Evaluación de recursos antes de descargar, cargar o aumentar concurrencia

Inventariar sistema operativo, CPU, GPU, RAM disponible, VRAM disponible, disco libre, carga actual, procesos relevantes, restricciones del runtime y prioridad del producto. Registrar hora y método de medición. La fotografía de recursos caduca; repetir la admisión si la carga cambió significativamente.

No estimar memoria solo por tamaño del archivo. Considerar pesos, runtime, buffers, activaciones, contexto, KV cache cuando corresponda, precisión, cuantización, número de solicitudes simultáneas, lote y copias temporales. RAM y VRAM son presupuestos separados: que los pesos quepan en GPU no prueba que la aplicación quepa en RAM. Offloading modifica consumo y latencia; requiere medición propia.

Fórmula conceptual de admisión:

```text
necesidad_estimada = pesos + runtime + buffers + contexto/KV + concurrencia + transitorios
margen_permitido = memoria_disponible - reserva_del_producto - reserva_del_sistema
admitir solo si necesidad_estimada <= margen_permitido
y el benchmark confirma latencia, estabilidad y ausencia de swapping perjudicial
```

Las reservas se fijan por perfil y medición, no por un porcentaje universal. La guía de 8/16/32 GB de SRC-03 y SRC-04 es orientativa: nunca se transforma en garantía de que cierto modelo funcionará. Si faltan medidas, clasificar `RESOURCE_UNVERIFIED`, limitar el ensayo y evitar activación en producción.

La admisión de concurrencia necesita reserva atómica de memoria estimada y cupos. Dos solicitudes no deben consumir simultáneamente el mismo margen. Aplicar cola acotada y deadline. Ante presión de memoria: detener nuevas admisiones, cancelar trabajo de menor prioridad si la política lo permite y descargar modelos ociosos después de finalizar sus solicitudes. No matar procesos ajenos.

## 6. Registro de modelos, fuentes y licencias

Cada artefacto debe tener identidad estable, revisión exacta, responsable y estado `DISCOVERED`, `QUARANTINED`, `EVALUATING`, `APPROVED`, `DEPRECATED` o `REMOVED`. El nombre comercial por sí solo no identifica pesos ni configuración.

**Ejemplo hipotético de registro; los valores no describen un modelo real:**

```yaml
id: extractor-interno-demo
revision: revision-inmutable-demo
provider_adapter: private_http_v1
execution_modes: [LOCAL_REMOTE]
artifact:
  source: pendiente-de-fuente-verificada
  publisher: pendiente
  hash: pendiente
  signature: no-disponible
  license_id: pendiente-de-revision
  license_text_ref: pendiente
  size_bytes: null
runtime:
  version: pendiente
  quantization: pendiente
  context_limit: null
  benchmark_ref: pendiente
capabilities: [DOCUMENT_ANALYSIS]
allowed_data_classes: [INTERNAL]
cost_policy_ref: pendiente
owner: responsable-por-asignar
last_verified: null
status: QUARANTINED
```

Un registro con campos críticos pendientes no habilita uso. Revisar origen, hash, firma si existe, licencia de pesos, tokenizer, datasets relevantes, dependencias y código asociado. Una firma válida confirma una procedencia, no calidad ni seguridad integral. No ejecutar código remoto del modelo por conveniencia sin revisar y autorizar su alcance.

La descarga requiere espacio para archivo temporal, artefacto final, extracción cuando exista y reserva de disco del producto. Descargar a cuarentena, validar integridad y registrar resultado antes de promover. Permitir cancelar, reanudar si es seguro y eliminar parciales propios. No borrar modelos compartidos sin inventario de referencias.

## 7. Contratos por capacidad, con límites observables

Mantener un catálogo explícito: `TEXT`, `CODE`, `VISION`, `OCR`, `EMBEDDINGS`, `AUDIO`, `SPEECH_TO_TEXT`, `TEXT_TO_SPEECH`, `CLASSIFICATION`, `RERANKING`, `IMAGE_GENERATION`, `DOCUMENT_ANALYSIS` y `AGENT_TOOLS`. Un adaptador declara cuáles soporta, con qué límites y cuáles pasaron evaluación.

**Esquema conceptual de solicitud; no es una API implementada:**

```json
{
  "contract_version": "eos.ai.v1",
  "request_id": "demo-request-001",
  "tenant_id": "demo-tenant",
  "capability": "CLASSIFICATION",
  "data_class": "INTERNAL",
  "input": {"text": "Texto hipotético", "labels": ["consulta", "incidente"]},
  "constraints": {
    "mode": "AUTO",
    "deadline_ms": 3000,
    "max_output_tokens": 64,
    "allowed_tools": [],
    "budget_reservation_id": "demo-reservation"
  },
  "policy_version": "demo-policy-v1"
}
```

Validar tipos, tamaños, rangos, valores del catálogo y límites antes de enviar. La clase declarada por el cliente puede endurecerse por el servidor; jamás se acepta una rebaja sin control. Resolver `tenant_id` e identidad desde contexto autenticado, no confiar en el identificador enviado. `budget_reservation_id` debe pertenecer a esa operación, actor y vigencia.

Una salida común incluye `success`, `request_id`, `status`, `data`, `error`, `provenance` y `usage`. La forma de `data` varía por capacidad. Embeddings declaran dimensión, modelo, revisión y normalización; OCR declara páginas y posición si el producto la exige; clasificación devuelve etiqueta válida; audio declara formato, duración y límites. Las afirmaciones de confianza solo se muestran si su significado y calibración están evaluados.

Errores mínimos: `AI_DISABLED`, `INVALID_REQUEST`, `CAPABILITY_UNSUPPORTED`, `PRIVACY_DENIED`, `RESOURCE_DENIED`, `BUDGET_DENIED`, `DEADLINE_EXCEEDED`, `PROVIDER_UNAVAILABLE`, `OUTPUT_INVALID`, `CANCELLED` y `TOOL_DENIED`. Incluir si el error admite reintento, sin exponer credenciales, prompts ni respuestas sensibles. Un texto malformado no se convierte en éxito por parecer legible.

## 8. Equivalencia de adaptadores, con evidencia por operación

La abstracción evita llamadas de negocio al SDK; no crea compatibilidad universal. Evaluar por separado tokenización, contexto máximo, salida estructurada, streaming, herramientas, imágenes, audio, embeddings, cancelación, límites, errores y políticas de retención. Un proveedor puede cumplir texto y fallar visión. Una API de apariencia compatible puede cambiar semántica.

Cada contrato aprobado necesita fixtures representativos y pruebas negativas. El adaptador traduce respuestas y rechazos al dominio EOS, pero conserva el detalle técnico necesario en registros protegidos. Si una función no existe, devolver `CAPABILITY_UNSUPPORTED`; no simularla sin declarar la transformación y su evaluación.

Migrar requiere comparación sobre casos del proyecto, tolerancias explícitas y revisión de efectos operativos. Cambiar únicamente un nombre de modelo no demuestra equivalencia. Para requisitos estrictos, mantener proveedor previo como rollback hasta completar validación, siempre dentro del conjunto de destinos permitidos.

## 9. Presupuesto reservado y costo conciliado

Definir límites por solicitud, usuario, organización, tarea, día y mes; moneda, fuente de tarifa, fecha, margen de incertidumbre y autoridad para modificarlos. Reservar atómicamente el costo máximo estimado antes de despachar, incluyendo reintentos autorizados y etapas del agente. Si no puede estimarse con una cota aceptable, rechazar o usar una modalidad controlada.

Estado de reserva: `RESERVED → DISPATCHED → SETTLED`; alternativas `CANCELLED` o `RECONCILIATION_PENDING`. Cuando el proveedor confirma uso, liquidar costo real y liberar diferencia. Si hay timeout después del despacho, no liberar todo suponiendo que no hubo consumo: registrar exposición pendiente y conciliar. La suma de reservado, consumido y pendiente no debe superar el límite aprobado.

Separar cache hit, estimación, uso confirmado y facturación conciliada. Los tokens no son moneda y los contadores de distintos proveedores no son necesariamente equivalentes. Un presupuesto diario agotado deshabilita candidatos pagados; una alternativa local solo procede si también pasa privacidad, capacidad y recursos.

**Prueba:** dos solicitudes simultáneas intentan reservar el último saldo; solo se admite la combinación dentro del tope. **Aceptación:** ningún cambio de modelo, retry o fallback elude la reserva.

## 10. Reintentos, streaming, cancelación y efectos de herramientas

Reintentar solo errores transitorios definidos, con límite, espera controlada, deadline total y reserva vigente. Validación fallida, falta de permisos y clasificación prohibida no se corrigen insistiendo. Evitar reintentos simultáneos descontrolados entre gateway, SDK y worker; asignar una capa responsable y contabilizar todas las tentativas.

El streaming entrega eventos con secuencia, `request_id`, tipo, fragmento y estado final. Un flujo interrumpido es `PARTIAL` o fallido, nunca éxito completo. La interfaz debe distinguir respuesta en curso, detenida y validada. No ejecutar herramientas a partir de argumentos incompletos ni publicar automáticamente fragmentos que esperan validación.

Cancelar detiene admisiones futuras y solicita interrupción al adaptador. Registrar si la cancelación fue confirmada, no soportada o incierta. El consumo ya incurrido permanece contabilizado. Un kill switch revoca herramientas y nuevas llamadas; no promete deshacer una acción externa ya efectuada.

Para herramientas con efectos, usar autorización independiente de la inferencia, validación de argumentos, identidad, alcance, clave de idempotencia y registro de resultado. La clave debe asociarse a parámetros normalizados y actor: reutilizarla con otro contenido produce conflicto. Si una operación quedó incierta, consultar su estado antes de repetir. Cuando el destino no soporta idempotencia, la capa local no puede garantizar exactamente una ejecución; requerir reconciliación o revisión humana.

## 11. Salud, circuit breakers y degradación deliberada

Medir disponibilidad, latencia, errores, cola, memoria, uso, costo, rechazo de políticas y calidad observada. Health check de transporte no acredita calidad. Definir ventanas, mínimos de muestra y umbrales por servicio. Los estados `CLOSED`, `OPEN` y `HALF_OPEN` gobiernan llamadas de prueba acotadas.

Separar fallas del proveedor, errores del cliente y rechazos de política. Abrir circuitos por una avalancha de solicitudes inválidas confunde diagnóstico. Un cambio de ruta debe volver a evaluar políticas. Mantener lista de fallbacks previamente aprobados, capacidad perdida y mensaje de producto. Ante falta de ruta, preferir una indisponibilidad explícita a una fuga de datos o resultado fabricado.

Auto-unload libera modelos ociosos con referencias activas igual a cero. Warming necesita ventana justificada y presupuesto de recursos; se suspende ante presión del producto. Registrar consumo después de descargar, porque algunos runtimes conservan cachés. Verificar recuperación real antes de afirmar que RAM o VRAM quedó libre.

## 12. Evaluación, actualización, canary y retirada

Technology Scout detecta candidatos; AI Architect define evaluación; Security e IP revisan riesgos y licencias; Resource Evaluator mide; el responsable del producto acepta tolerancias. El descubrimiento no autoriza descarga, publicación ni cambio de producción.

Evaluar con conjunto versionado, representativo y protegido, incluyendo errores, idiomas del usuario, documentos adversariales, datos faltantes, sobrelongitud y abstención. Registrar calidad por caso y grupo, latencia, recursos, costo y regresiones. No afirmar superioridad por un promedio si empeora una clase crítica.

Promover mediante canary acotado con métricas, duración, responsable, frenos y rollback. El porcentaje se fija por exposición aceptable; no aplicar una secuencia universal. Las pruebas con tráfico copiado requieren controles de privacidad, retención y ausencia de efectos duplicados.

Cambiar embeddings exige evaluar dimensión, normalización y espacio semántico. Incluso con dimensión igual, una revisión puede volver incompatibles vectores antiguos. Crear índice versionado, reindexar corpus autorizado, comparar recuperación y cambiar lecturas con rollback. No mezclar vectores incompatibles ni sobrescribir el único índice recuperable.

Retirar un modelo implica bloquear nuevas solicitudes, drenar o cancelar las vigentes, comprobar referencias, invalidar caché y conservar metadatos necesarios para auditoría. Eliminar pesos no borra automáticamente índices, resultados ni obligaciones de retención. Documentar cada componente afectado.

## 13. Operación administrativa y prueba de cierre

La ruta conceptual `/admin/engineering/ai` muestra estado, modo solicitado/efectivo, modelos, recursos, costo confirmado/pendiente, salud, fallbacks, actualización y fecha de verificación. Su existencia debe comprobarse en el proyecto receptor; este manual no la implementa.

Cada acción `Enable`, `Disable`, `Download`, `Load`, `Unload`, `Benchmark`, `Switch`, `Delete`, `Set fallback`, `Set budget` o `Set privacy` exige autorización del servidor, alcance y auditoría. Cambiar un presupuesto o relajar privacidad no es una preferencia visual. Registrar actor, instante, política, antes/después saneados, motivo, aprobación cuando corresponda y resultado. Un error de autorización no debe ejecutar parcialmente la acción.

La aceptación final exige evidencia de arranque `OFF`, contratos por capacidad, rechazo de ruta prohibida, admisión de recursos concurrentes, reserva de presupuesto concurrente, cancelación/resultado incierto, pruebas de herramientas y rollback de modelo. Marcar cada control `VERIFIED`, `PARTIAL`, `MISSING` o `NOT_APPLICABLE` con fundamento. Ningún ejemplo de este manual cuenta como prueba ejecutada.

**Instrucción operativa final:** conserva el puerto, enciende solo la capacidad necesaria, admite solicitudes únicamente dentro de todas las políticas, mide lo que realmente ocurre y permite retirar la IA sin abandonar la función esencial del producto.

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
