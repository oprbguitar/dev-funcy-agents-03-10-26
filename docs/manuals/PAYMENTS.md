# Manual EOS de pagos, conciliación y confianza financiera

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
**Fecha documental:** 2026-10-03, Perú. **Origen:** ampliación operacional SRC-02.
**Naturaleza:** instrucciones de diseño y operación; no acredita una integración ejecutada, disponibilidad comercial ni cumplimiento legal.

## 1. Mandato personal y activación

Mi criterio es que cobrar dinero exige poder explicar cada intento, cada movimiento y cada diferencia. Quiero decisiones verificables, proveedores reemplazables y una experiencia honesta cuando la respuesta sea incierta. Un mensaje de éxito no sustituye evidencia financiera. Ningún agente debe mejorar la apariencia de una operación ocultando su estado real.

Este manual desarrolla la [constitución maestra](../../EOS_MASTER_SYSTEM_INSTRUCTION.md) y se utiliza junto al [punto de entrada](../../AGENTS.md). El Capability Profiler debe registrar una decisión antes de incorporar SDK, cuenta comercial, suscripciones o cobros. Una web informativa deja pagos inactivos; un sistema que registra comprobantes puede requerir integración contable sin procesar dinero. Cobros, membresías, marketplace, anticipos o transferencias administradas requieren evaluación específica.

La ficha inicial identifica entidad que vende, entidad que cobra, países, monedas, volumen estimado, fondos propios o ajenos, devoluciones, recurrencia, proveedores candidatos y responsables. Separar presupuesto estimado de tarifas verificadas. No crear cuentas, aceptar contratos ni habilitar cobros reales por deducción. Registrar `inactive`, `evaluation`, `sandbox`, `production-approved` o `suspended`, con motivo y evidencia. Estos estados de capacidad no son estados de una transacción.

## 2. Roles, entradas y resultados

| Responsable | Entrada que necesita | Entrega exigida |
|---|---|---|
| Orquestador | Perfil, alcance y autorización del usuario | Activación, riesgos y tareas acotadas |
| Arquitecto de pagos | Flujo comercial y contratos | Puerto, estados, invariantes y adaptadores |
| Especialista de seguridad | Límites de confianza y credenciales | Amenazas, controles y pruebas negativas |
| Responsable financiero | Política comercial y liquidaciones | Reglas de conciliación y excepciones |
| Revisor competente | Rol real y fuentes oficiales | Evaluación de aplicabilidad pendiente o resuelta |
| Operador autorizado | Procedimiento y evidencia | Ejecución registrada y resultado verificable |

Una misma persona puede asumir varios roles en un equipo pequeño, pero debe hacer explícita esa concentración. Para impacto alto definir revisión independiente; un agente no puede inventar aprobaciones ni aprobarse con una identidad ficticia. Las entradas faltantes producen una lista concreta de pendientes. Se puede diseñar y probar localmente mientras se completa la información que bloquea producción.

## 3. Puerto reemplazable y registro de proveedores

Mantener la secuencia `dominio → Payment Integration Port → políticas → router → adaptador → proveedor`. El dominio trabaja con operaciones propias: crear intento, consultar estado, autorizar, capturar, cancelar, devolver y listar movimientos. Cada adaptador declara cuáles soporta, su significado y sus límites; una operación no soportada devuelve un error definido, nunca una simulación presentada como ejecución.

El contrato normaliza identificadores, importe, moneda, referencia comercial, idempotencia, fechas y resultado. Conservar el estado original del proveedor como dato restringido para diagnóstico, sin permitir que determine directamente permisos del negocio. Los errores distinguen validación, rechazo definitivo, indisponibilidad, autenticación, límite de tasa y resultado desconocido. No igualar una autorización a dinero liquidado.

El registro incluye país admitido, entidad contratante, entorno, versión API, documentación oficial, métodos habilitados por contrato, webhooks, recurrencia, capturas, devoluciones, disputas, tarifas, monedas, límites, responsables y última verificación. Mercado Pago, Culqi u otro nombre pueden servir como candidatos; esta guía no declara que alguna modalidad esté disponible actualmente para una cuenta o negocio. El Payment Provider Scout debe verificar documentación y condiciones antes de recomendar.

Las claves están fuera del repositorio, separadas por entorno y tenant cuando corresponda. Usar permisos mínimos, rotación registrada y validación de configuración al iniciar. No reutilizar credenciales de producción en pruebas ni enviar secretos a IA, capturas o soportes públicos. Definir salida del proveedor: exportación de referencias, conservación de evidencia, cancelación de recurrencia y período de coexistencia. La portabilidad de tokens depende del contrato; no prometerla.

## 4. Dinero, identidad y estados

Representar importes como enteros en unidades menores y moneda explícita. Para un ejemplo PEN, S/ 125.90 se representa como `12590` con exponente monetario validado; no asumir dos decimales para todas las monedas. Validar rangos, signo permitido por operación, precisión y desbordamiento. Descuentos, impuestos y redondeos deben usar reglas documentadas y operaciones exactas. El servidor recalcula totales desde precios confiables.

Cada pago relaciona `tenant_id`, `order_id`, `payment_id`, `attempt_id`, proveedor y referencia externa. El identificador enviado por el cliente no autoriza acceso. Verificar pertenencia, estado de orden, stock o servicio y política antes de crear el intento. Una orden puede tener varios intentos; únicamente los movimientos confirmados cambian lo entregable.

| Estado de pago | Significado interno | Condición de cambio |
|---|---|---|
| `pending` | Intento registrado, resultado aún pendiente | Confirmación verificable o expiración definida |
| `authorized` | Autorización confirmada | Captura, cancelación o expiración del proveedor |
| `captured` | Captura confirmada | Devolución o disputa posteriores |
| `failed` | Fallo definitivo conocido del intento | Nuevo intento separado, si procede |
| `partially_refunded` | Parte del capturado fue devuelta | Otra devolución dentro del saldo permitido |
| `refunded` | Total capturado fue devuelto | Evidencia de devolución completa |
| `disputed` | Disputa abierta o registrada | Resolución documentada, sin borrar historia |

Mantener `settlement_status`, `reconciliation_status` y `outcome_uncertain` como dimensiones adicionales. Un pago capturado puede no estar liquidado; una disputa puede coexistir con devoluciones parciales. No forzar todos estos conceptos a una única columna. Los estados cancelado o expirado, si se incorporan, requieren contrato y transiciones explícitas. Ningún evento tardío convierte automáticamente un pago devuelto en capturado otra vez.

## 5. Ledger y entrega exactamente una vez en el dominio

El ledger conserva asientos anexados con tipo, importe, moneda, pago, origen, secuencia, actor, fecha de negocio, fecha de recepción, motivo y correlación. Corregir mediante reverso o asiento compensatorio que referencia el anterior. No sobrescribir montos históricos para cuadrar un informe. La proyección de saldo puede regenerarse desde asientos y debe distinguir bruto, comisión, impuesto, devolución, disputa y neto.

Definir invariantes verificables: suma devuelta no supera captura elegible; moneda del movimiento corresponde al pago; una referencia externa no pertenece a dos tenants; una entrega comercial usa una clave única por derecho adquirido. Persistir transición, asiento y mensaje de entrega en una transacción local cuando la base lo permita. Utilizar outbox duradero para la publicación posterior; el consumidor aplica su propia deduplicación.

No afirmar ejecución global exactamente una vez porque exista una cola. Diseñar entrega repetible y efecto de negocio único. Si se corta energía después de registrar captura y antes de publicar, la recuperación procesa el outbox; si el consumidor recibe dos mensajes, la restricción de unicidad impide dos entregas. Conservar evidencia de cada intento sin duplicar el resultado económico.

## 6. Idempotencia durable

La clave de idempotencia se vincula a tenant, operación y huella canónica de la solicitud. Guardar registro transaccional con restricción única, estado, resultado, referencia externa y fechas. Dos solicitudes concurrentes con la misma clave deben obtener un resultado consistente. Si cambia el importe, moneda, orden u otro campo significativo, responder conflicto; no aceptar silenciosamente un payload distinto.

Reservar la operación antes de contactar al proveedor y reutilizar su clave cuando su contrato lo admita. Persistir el vínculo externo inmediatamente después de conocerlo. Un bloqueo en memoria no protege múltiples procesos ni reinicios. Si la transacción local termina pero la llamada externa queda incierta, consultar por referencia e idempotencia; no asumir fallo por ausencia de respuesta HTTP.

Definir TTL por contrato y ventana de reintentos. La caducidad de una respuesta cacheada no elimina el historial financiero ni habilita repetir un cargo antiguo. Conservar una tombstone o referencia de operación suficiente para impedir reutilización peligrosa. Separar retención de datos sensibles, historial comercial y deduplicación. Probar concurrencia, caída del proceso, reintento tras reinicio y recuperación desde backup con operaciones recientes.

## 7. Webhooks autenticados y eventos desordenados

El endpoint acepta únicamente rutas y métodos previstos, limita tamaño y aplica controles de abuso compatibles con el proveedor. Verificar la firma con el algoritmo oficial sobre los bytes originales del cuerpo cuando así lo exija el contrato. No reconstruir JSON para verificar una firma de cuerpo crudo. Evaluar timestamp firmado, tolerancia temporal, versión de clave y comparación segura. Una allowlist IP puede complementar, pero no reemplazar autenticación.

Antes de producir efectos, validar esquema, cuenta comercial, entorno, tenant, referencia, importe y moneda. Distinguir autenticidad del emisor de validez del contenido para esta operación. Persistir la recepción en un inbox duradero con unicidad por proveedor, cuenta y evento. Confirmar al emisor cuando se haya alcanzado el punto durable definido; los fallos temporales usan la semántica de reintento documentada.

La ventana antirreplay se basa en el contrato: no rechazar una notificación legítimamente retrasada por un TTL inventado. Una firma antigua requiere revisión o consulta autenticada según el procedimiento. Eventos duplicados conservan evidencia de recepción y no generan otro asiento. Eventos fuera de orden pasan por reglas de versión, transición y consulta de estado; poner en cuarentena conflictos sin entregar productos.

Registrar verificación, identificador y huella del evento. El cuerpo crudo usado para autenticación no se convierte automáticamente en log permanente: si se conserva para investigación, cifrarlo, minimizarlo, restringirlo y asignar retención. La integración debe resistir navegador que finge éxito, firma inválida, evento desconocido, tenant incorrecto, devolución antes de captura observada y notificaciones simultáneas.

## 8. Resultado incierto y alternativas de pago

Timeout, conexión cerrada o respuesta perdida pueden ocurrir después de un cobro válido. Marcar resultado incierto, bloquear un nuevo cargo automático y consultar al proveedor. Programar consultas acotadas con backoff, jitter y presupuesto; agotar reintentos produce excepción operativa visible. La interfaz informa que se está verificando el pago y evita inducir doble intento.

Cambiar de pasarela exige evidencia de que el intento previo no produjo autorización o captura, o un procedimiento de resolución aprobado. Nunca cobrar por un segundo proveedor a ciegas. Si se ofrece otro método, explicar su carácter de nuevo intento y obtener la acción explícita del usuario. No reutilizar una orden cerrada sin una regla comercial. Ante confirmación tardía de dos cobros, abrir incidente y resolver con aprobación financiera, conservando ambos registros.

## 9. Conciliación, devoluciones y disputas

Conciliar orden/ERP, ledger, reporte del proveedor y abono bancario cuando esté disponible. Definir período, zona horaria, fechas de captura y liquidación, moneda, comisiones, impuestos, conversiones y calendario bancario. Una diferencia temporal puede ser legítima; documentar tolerancia y vencimiento, sin ocultar diferencias de importe.

El procedimiento importa evidencia con hash y origen, normaliza movimientos, empareja por referencias verificadas, calcula bruto y neto, clasifica huérfanos, duplicados, faltantes y desacuerdos, asigna responsable y cierra únicamente con soporte. Entregar reporte con registros comparados, excepciones abiertas, antigüedad y resolución. Un total global coincidente no prueba que todas las operaciones correspondan.

La devolución necesita derecho comercial, saldo elegible, destinatario, importe, motivo y autorización vigente. Reusar idempotencia propia de devolución y consultar su resultado. No liberar inventario ni marcar devolución completa por un clic administrativo. Las disputas preservan fecha límite, evidencia, comunicaciones y decisión. Responder a un contracargo, aceptar pérdida o transferir fondos requiere aprobación A3 según alcance; no se concede por tener acceso al panel.

## 10. Autonomía y operación en Perú

A0/A1 inspeccionan documentación, analizan reportes anonimizados y ejecutan pruebas no financieras. A2 prepara adaptadores, políticas y cambios de sandbox en rama. A3 cubre habilitación real, cambio de credenciales o proveedor, cobros, devoluciones, disputas y cambios de política financiera. Si el usuario ya autorizó expresamente una acción concreta, usar esa autorización dentro de su alcance; no pedirla repetidamente. A4 prohíbe falsificar conciliaciones, borrar asientos o ocultar incidentes.

En Perú identificar primero si se opera como comercio, plataforma, proveedor de servicios de pago u otro actor. Evaluar BCRP, SBS, protección al consumidor, SUNAT y protección de datos según el caso. La [Circular 0022-2025-BCRP](https://www.bcrp.gob.pe/docs/Transparencia/Normas-Legales/Circulares/2025/circular-0022-2025-bcrp.pdf) es una referencia primaria para revisar el marco de pagos; no prueba que sus obligaciones correspondan íntegramente a todo comercio.

El alcance normativo queda **pendiente de verificación competente** hasta revisar rol, normativa vigente, modificaciones y contrato real. Este manual no proporciona asesoría jurídica ni certificación financiera. No publicar afirmaciones de cumplimiento por haber seguido una checklist. Registrar norma, artículos revisados, aplicabilidad, responsable, evidencia y próxima revisión en documentación del proyecto.

Preferir tokenización, checkout del proveedor o campos alojados para reducir exposición. La externalización no elimina las responsabilidades del comercio; confirmar obligaciones con adquirente y evaluador competente. No almacenar datos sensibles de autenticación posteriores a autorización, incluido CVV, en bases, logs o backups; revisar la [FAQ PCI SSC sobre códigos de verificación](https://www.pcisecuritystandards.org/faqs/1280/). La FAQ oficial de [PCI SSC sobre externalización](https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/) explica responsabilidades que deben evaluarse.

## 11. Criterios de aceptación y expediente de cierre

Antes de activar producción exigir pruebas unitarias de dinero y estados, integración de persistencia/idempotencia y flujo completo en sandbox. Probar firma incorrecta, replay, eventos desordenados, claves con payload distinto, tenant ajeno, refund parcial, timeout después de captura y caída del worker. La cobertura debe acompañarse de invariantes demostradas y casos de fallo; un porcentaje aislado no acredita seguridad.

El expediente contiene contrato del puerto, mapa de confianza, evidencia de sandbox, catálogo de secretos sin valores, reglas de conciliación, responsables, autorización, límites y plan de suspensión. Verificar una conciliación de muestra y una recuperación controlada. Alertar por incertidumbre envejecida, fallos de firma, inbox atrasado, discrepancias y devoluciones duplicadas. Las métricas excluyen PAN, CVV, tokens y sesiones en bruto.

Cierre aceptable: ningún cobro duplicado en los ensayos; ninguna entrega por callback del navegador; toda corrección rastreable; toda excepción tiene propietario; las capacidades no probadas se declaran pendientes. Conectar recuperación al [manual de almacenamiento](STORAGE-DATA.md) y despliegue al [manual de actualizaciones](UPDATES-RELIABILITY.md). La revisión documental no implica haber movido dinero.

## 12. Referencias primarias y actualización

Consultadas el **2026-10-03**; revalidar para cada implementación y cambio contractual:

- [OWASP: integración de pasarelas](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html): referencia técnica para confianza del servidor y autenticación de notificaciones.
- [PCI SSC: responsabilidades cuando se externaliza](https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/): delimitación a revisar con entidades competentes.
- [PCI SSC: conservación de códigos de verificación](https://www.pcisecuritystandards.org/faqs/1280/): restricción posterior a autorización, incluida recurrencia.
- [BCRP: Circular 0022-2025](https://www.bcrp.gob.pe/docs/Transparencia/Normas-Legales/Circulares/2025/circular-0022-2025-bcrp.pdf): fuente normativa a evaluar por rol real.
- [ANPD: DS 016-2024-JUS](https://www.gob.pe/institucion/anpd/normas-legales/6554453-n-016-2024-jus): fuente oficial para evaluar tratamiento de datos personales.

**Firma documental:** Pierre R. Boss · oprbguitar. Quiero que cada sol tenga explicación, cada incertidumbre tenga seguimiento y cada aprobación tenga alcance visible.
