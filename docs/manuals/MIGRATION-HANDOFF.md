# Migración progresiva, portabilidad y transferencia

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

**Origen:** SRC-03 §§5, 23–24, 84–92, 116 y 147; SRC-04 §§33–35; SRC-02 §§30–34. **Constitución:** §§58–59, 76–78 y 93. **Estado:** procedimiento reutilizable; ningún cambio de plataforma o transferencia a terceros se ejecuta solo por existir este manual.

## 1. La migración empieza con una causa comprobable

Documenta qué problema requiere migrar: incompatibilidad, fin de soporte, límites demostrados del runtime, requisitos de privacidad, costo, necesidad de mantenimiento o capacidad que el sistema actual no puede cubrir razonablemente. El crecimiento de usuarios o la aparición de un framework nuevo son señales para investigar, no razones suficientes para reescribir.

Compara permanecer y optimizar, sustituir un componente y migrar un dominio. La opción de no migrar conserva un papel legítimo. Incluye costo de transición, doble operación, formación, incidentes posibles, licencias, contratos y reversión. Si la alternativa nueva no demuestra valor en un ensayo representativo, conserva la evaluación en ASSESS o HOLD.

El propietario aprueba el alcance de cambios sensibles o externos. El Migration Architect diseña fases. System Archaeologist reconstruye comportamiento. Data Architect conserva integridad. Integration Architect compara consumidores. SRE ensaya continuidad. Handoff Auditor comprueba que el receptor pueda operar. Un developer implementa los componentes asignados. Los roles pueden combinarse proporcionalmente, pero los riesgos importantes requieren contraste independiente cuando el entorno lo permita.

## 2. Arqueología de un sistema existente

Inventaría código, versiones, despliegues, configuración, usuarios/roles, rutas, procesos, datos, jobs, integraciones, archivos y dependencias. Inspecciona documentación y verifica qué coincide con la implementación. Un README desactualizado es una pista; no lo conviertas en arquitectura real sin leer el código y observar el comportamiento.

Identifica reglas de negocio: quién puede realizar qué acción, estados permitidos, unidades, redondeos, plazos, horarios, límites, consecuencias y excepciones. Distingue reglas declaradas, reglas observadas y defectos conocidos. Si una regla carece de dueño, registra el bloqueo de decisión; un agente no inventa una política financiera o institucional.

Registra activos sensibles mediante rutas y categorías mínimas, sin volcar su contenido en tickets o logs. Descubrir una base de datos privada no autoriza copiarla al repo. El baseline utiliza datasets sintéticos o muestras autorizadas y minimizadas. Preserva el estado de trabajo y no ejecutes `reset --hard`, `clean`, sobrescrituras o stash automático para facilitar una migración.

## 3. Caracterización y equivalencia

Construye casos que capturen el comportamiento antes del cambio. Cada caso contiene entrada, precondiciones, actor, operación, salida, estado persistido y efecto externo. Determina qué equivalencia se necesita: exacta, semántica o con tolerancia explícita. Un resumen de IA no puede declararse equivalente a una salida determinista solo porque ambos parecen plausibles.

| Dimensión | Comparación mínima |
|---|---|
| Funcional | Mismos casos de negocio y errores importantes |
| Autorización | Acceso permitido y denegado por usuario/tenant/rol |
| Datos | Cantidades, constraints, referencias, claves, formatos y estados |
| Operación | Jobs, retry, cuotas, health y recuperabilidad |
| Rendimiento | Latencia, recursos y costos con cargas comparables |
| UX | Flujos, foco, móvil, accesibilidad y mensajes |
| Integraciones | Contratos, eventos, idempotencia y compatibilidad |
| Privacidad | Destinos, retención, permisos y propagación de borrado |

No exijas igualdad byte a byte cuando el contrato solo define equivalencia semántica. No reduzcas la comparación a conteos cuando importan importes, relaciones y permisos. Las tolerancias tienen motivo, dueño y criterio de fallo; no se amplían después del resultado para forzar aprobación.

## 4. Elegir el patrón de transición

**Strangler Fig:** redirige un dominio o ruta al componente nuevo mientras el resto sigue en el sistema existente. Declara ownership de datos y evita dos escrituras autoritativas inadvertidas.

**Branch by Abstraction:** introduce una interfaz para sustituir implementación sin cambiar consumidores. Prueba ambas implementaciones contra el mismo contrato y conserva una bandera controlada.

**Anti-Corruption Layer:** transforma formatos y semántica del sistema anterior. Los mappings tienen ejemplos, errores y límites; una traducción silenciosa de estados puede perder obligaciones.

**Parallel Run:** compara resultados con side effects aislados. Es útil para lecturas y cálculos, pero no puede cobrar, enviar correo o modificar expedientes dos veces. Los efectos externos del sistema sombra deben estar bloqueados o simulados con pruebas de aislamiento.

Elige un patrón por frontera real y registra ADR. Un Big Bang solo se evalúa si restricciones concretas descartan alternativas graduales; necesita ventana, recuperación, validación y autorización explícitas.

## 5. Datos, migraciones y sincronización

Define formato de origen/destino, invariantes, mapping de claves, unidades, zona horaria, encoding, nulabilidad y transformaciones. Documenta qué datos se descartan y con qué autorización. Nunca uses «limpiar» como permiso genérico para eliminar registros problemáticos.

Prefiere expand/contract: añade estructuras compatibles, despliega lectores/escritores preparados, migra en lotes verificables y retira lo viejo después de confirmar ausencia de consumidores. Cada lote registra checkpoint, cantidad, checksum o reconciliación apropiada, errores y reanudación. La ejecución debe poder repetirse de forma segura.

Una copia inicial seguida de cambios concurrentes exige un plan de delta, ventana o sincronización. El rollback puede requerir mappings inversos o forward repair. Un backup previo no asegura que se pueda volver sin perder transacciones ocurridas durante la transición. Especialmente en pagos, una restauración no debe borrar historia financiera válida.

Ensaya restauración aislada y conserva RPO/RTO medidos para el ejercicio. El plan identifica quién tiene acceso a claves y backups, dónde se recupera y cómo se valida integridad. Un archivo de backup encontrado no constituye una prueba de recuperación.

## 6. Canary, promoción y retorno

La fase canary define población, rutas, duración, tamaño de muestra, métricas de salud, eventos prohibidos y condición de promoción. Los porcentajes son elegidos para el producto; no uses un 5% universal sin tráfico suficiente. Combina percentiles, tasa de errores, invariantes de negocio y comparación de datos. Una única prueba exitosa no prueba estabilidad bajo carga.

Asocia cada versión a artifact digest/commit y configuración. Promueve el mismo artefacto verificado, o vuelve a verificar si se recompila. Captura dependencias externas y cambios de esquema relevantes. No expliques un fallo comparando un build local con otro commit desplegado.

Antes de ejecutar define retorno: qué componente vuelve, cómo se conserva el dato nuevo, qué consumidores seguirán compatibles, quién decide y qué criterio lo activa. Si el retorno no es seguro después de una fase, declara ese punto irreversible y requiere autorización correspondiente. «Rollback disponible» necesita un ensayo o límites concretos, no una frase.

## 7. Sustituir proveedores

Para IA usa [AI-GATEWAY](AI-GATEWAY.md): capacidad, formato, datos, embeddings, tool calls, calidad, costos y licencias se revalidan. Cambiar un endpoint no prueba equivalencia. Un proveedor alternativo puede devolver otra dimensión de embedding, usar un formato incompatible o tener restricciones contractuales diferentes.

Para pagos usa [PAYMENTS](PAYMENTS.md): transacciones inciertas se reconcilian antes de reenviarse. Mantén referencias del proveedor antiguo para devoluciones, disputas y auditoría. Desactivar nuevos cobros no implica poder borrar el adapter o sus credenciales de consulta inmediatamente.

Para storage usa [STORAGE-DATA](STORAGE-DATA.md): ownership, checksums, egress, cifrado, permisos, URLs, retención y eliminación se comparan. Para conectores, registra límites, APIs sunset y formatos de error. La salida incluye datos exportables y documentación que permita otro cambio futuro.

## 8. Handoff pensado para el receptor

El paquete se adapta a quién mantendrá el producto. Un equipo que usa Java y PostgreSQL puede preferir contratos y herramientas distintas de una persona que ejecuta un visor local en Windows. No impongas sofisticación que solo el autor conoce. La arquitectura elegida debe poder operarse con habilidades, presupuesto y acceso del receptor.

Incluye propósito, flujos, mapa de módulos, versiones, instalación, ejecución, configuración sin secretos, variables requeridas, datos y ubicación, contratos, deploy, rollback, backup, restore, observabilidad, permisos, pruebas, incidencias conocidas, licencias, decisiones y actualización. Usa rutas precisas y comandos específicos al entorno. Si un archivo contiene datos privados, referencia su ubicación local y política de acceso; no lo publiques para hacer el handoff cómodo.

Las credenciales se transfieren mediante el mecanismo seguro autorizado, con acceso mínimo y rotación cuando corresponda. El repositorio incluye placeholders, no claves reales. Documenta dependencias de cuentas, dominios, certificados y proveedores. Un sistema que corre solo con la sesión del autor conserva una dependencia operativa que debe resolverse.

## 9. Ejercicio Windows reproducible

Esta secuencia es un procedimiento, no un instalador ejecutado por este repositorio:

1. El receptor recibe el commit o release exacto y verifica su procedencia.
2. Abre PowerShell en la carpeta acordada y confirma versiones requeridas; no instala runtimes arbitrariamente.
3. Copia la configuración de ejemplo al archivo local ignorado y obtiene secretos por canal autorizado.
4. Identifica rutas absolutas de datos, backups y logs; comprueba permisos y espacio.
5. Ejecuta el launcher documentado o comando de arranque y observa el health real.
6. Completa un flujo permitido y uno denegado desde una sesión real cuando aplica.
7. Ejecuta pruebas de soporte y verifica su scope.
8. Detiene y reinicia; comprueba persistencia y límites de shutdown.
9. Ensaya recuperación en un destino aislado, nunca sobre producción por defecto.
10. Registra qué pudo hacer sin asistencia, qué faltó y cómo se corrigió.

Si el producto necesita un launcher Windows, debe respetar argumentos, rutas con espacios, logs, procesos existentes y secretos. Un archivo `.bat` que abre una consola no prueba que el backend esté disponible. Un túnel HTTPS necesita validación del enlace real y del flujo autenticado, dentro del alcance autorizado.

## 10. Gate de transferencia

Usa [HANDOFF-CHECKLIST](../../templates/HANDOFF-CHECKLIST.md). El receptor debe iniciar, usar, detener, diagnosticar y restaurar el sistema con documentación. Los pasos que solo el autor puede ejecutar se registran como pendientes. La transferencia de propiedad, cuentas o licencias exige su propio alcance contractual y autorización.

| Situación | Fallo que debe detectar el gate | Resultado necesario |
|---|---|---|
| Nueva DB tiene el mismo número de filas | Relaciones o importes incorrectos | Reconciliación de invariantes |
| Shadow envía un correo real | Side effects no aislados | Aislamiento y prueba negativa |
| App funciona con sesión del autor | Dependencia de credenciales personales | Cuenta y acceso revisados |
| Rollback requiere perder pagos | Retorno incompatible | Forward repair o decisión explícita |
| Launcher pierde ruta con espacios | Operación no reproducible | Arranque probado por receptor |
| Receptor no puede recuperar backup | Entrega incompleta | Ensayo de restore documentado |

La migración termina cuando el comportamiento acordado, los datos, la operación y la recuperación se verifican en el destino. El handoff termina cuando el receptor puede mantenerlo y reconoce los pendientes; un push por sí solo no satisface ninguno de esos dos criterios.
