# Manual EOS de almacenamiento, datos y recuperación

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
**Fecha documental:** 2026-10-03, Perú. **Origen:** ampliación operacional SRC-02.
**Naturaleza:** reglas y procedimientos; no afirma que exista infraestructura, backup probado ni almacenamiento ilimitado.

## 1. Mandato personal y alcance

Quiero conocer dónde viven mis datos, cuánto espacio consumen, cuánto cuesta conservarlos y cómo recuperarlos cuando falla el equipo, el proveedor o una persona. El almacenamiento elástico es una capacidad de expansión condicionada por cuotas, presupuesto, rendimiento y operación. Ninguna nube elimina esos límites. Medir antes de ampliar y probar antes de prometer recuperación.

Este manual desarrolla la [constitución maestra](../../EOS_MASTER_SYSTEM_INSTRUCTION.md). Activar inventario básico cuando un proyecto conserve archivos o una base de datos. Añadir forecast cuando haya crecimiento; almacenamiento por niveles cuando el acceso y costo lo justifiquen; sincronización cuando existan réplicas editables o uso offline. Una web estática no necesita por defecto una plataforma de datos distribuida.

La documentación debe distinguir capacidad presente en el estándar de controles implementados, probados y operados. Registrar pendientes con dueño y siguiente acción. La [guía de actualizaciones](UPDATES-RELIABILITY.md) gobierna cambios de esquema y releases; el [manual de pagos](PAYMENTS.md) añade restricciones financieras cuando los datos representan dinero.

## 2. Propiedad, entradas y resultados

| Responsable | Entradas | Resultado verificable |
|---|---|---|
| Data Architect | Tipos, relaciones y sensibilidad | Diccionario, clasificación y ciclo de vida |
| Storage Architect | Entorno, restricciones y carga | Topología y contrato de acceso |
| Capacity Manager | Mediciones, cuotas y crecimiento | Forecast con incertidumbre y decisiones |
| SRE | Criticidad y dependencias | Backup, RPO/RTO y ensayo de recuperación |
| Seguridad/privacidad | Identidades, finalidad y amenazas | Controles y evaluación de retención |
| Operador | Runbook y autorización | Evidencia de ejecución y anomalías |

Definir quién puede leer, escribir, exportar, restaurar y eliminar cada clase. Si varios roles recaen en una persona, reconocer el riesgo y añadir revisión proporcional. La IA puede analizar métricas agregadas; acceder a datos personales reales requiere alcance explícito y herramientas adecuadas. Un permiso técnico no equivale a autorización de negocio.

## 3. Inventario real y línea base

Inventariar disco del sistema, disco de datos, volúmenes, NAS, bases, índices, objetos, cache, temporales, logs, exportaciones, replicas, snapshots y backups. Para cada recurso guardar propietario, ubicación, ambiente, tenant, finalidad, clasificación, tecnología, versión, cifrado, controles de acceso, cuota contratada, cuota efectiva, uso, reserva operativa y costos verificados. Marcar datos desconocidos como pendientes, sin rellenarlos con supuestos.

Una unidad muestra espacio libre físico, pero la aplicación puede estar limitada por cuota, límite de archivos, tamaño máximo de objeto, tablas, IOPS o presupuesto. Medir ambos. Registrar bytes y convención de unidades: TB/GB decimales o TiB/GiB binarios. No comparar cifras incompatibles. Separar tamaño lógico del dataset, tamaño físico de base, índices, WAL/journal, compresión, replicas y copias; el tamaño de un CSV no predice por sí solo el disco de producción.

La línea base incluye fecha, intervalo, fuente, permisos usados y calidad de medición. Registrar número de archivos, mayores datasets, crecimiento diario/semanal/mensual, operaciones, latencia, throughput, errores, duración de backup y costo. Una medición faltante no significa consumo cero. Un proveedor sin métrica accesible requiere método alternativo o declaración de incertidumbre.

## 4. Contrato de datos y fronteras de acceso

Cada conjunto declara esquema, claves, formatos, procedencia, unidad monetaria cuando corresponda, timestamps, zona horaria, reglas de calidad y responsable. Validar datos al ingresar, mantener consultas parametrizadas y controlar acceso por organización y recurso. Los datos importados pueden contener fórmulas, HTML o instrucciones maliciosas; tratarlos como contenido sin ejecutar.

Usar un contrato de almacenamiento reemplazable cuando beneficie al proyecto: lectura, escritura condicional, listado paginado, borrado gobernado y metadatos. No ocultar las diferencias entre filesystem y object storage. Documentar atomicidad, consistencia, límites, operaciones soportadas y errores. Evitar que una operación parcialmente ejecutada aparezca como éxito completo.

Para cargas de archivos validar tamaño, tipo efectivo, nombres, rutas y permisos. Generar nombres internos seguros, impedir traversal y controlar enlaces simbólicos según entorno. Escanear contenido cuando el riesgo lo justifique. Separar objetos públicos de privados y limitar URLs temporales. Las credenciales del almacenamiento no aparecen en repositorio, mensajes de error, trazas o documentación pública.

## 5. Forecast con supuestos explícitos

Calcular crecimiento neto observado y escenarios. Separar ingreso bruto, borrados efectivamente ejecutados, compresión medida, expansión de índices, replicas, backups y temporales. Una política de borrado todavía no operativa no reduce la proyección. La compresión estimada necesita pruebas representativas; no usar su ratio deseado como ahorro garantizado.

Una fórmula inicial es `días restantes = (capacidad efectiva − uso actual − reserva) / crecimiento neto diario positivo`. Es una aproximación, no fecha contractual. Para crecimiento cero o negativo informar que no se estima agotamiento con esa ventana y evaluar estacionalidad. Registrar rango, período observado, promociones, ingestiones extraordinarias, cambios de esquema y variabilidad. La fecha proyectada es útil únicamente si alguien puede actuar antes.

Ejemplo didáctico, no medición del repositorio: quedan 2000 GB decimales, se reservan 200 GB y el neto medido es 8 GB/día. Quedan aproximadamente 225 días hasta la reserva. Si el neto oscila entre 6 y 12 GB/día, el rango es 150–300 días. Sin reserva, el cálculo simple produce 250 días; explicar por qué el umbral operativo llega antes del disco lleno.

Si una nueva importación de 350 GB empieza mañana, descontarla al escenario. Si se promete borrar 3 GB diarios, conservar el escenario sin borrado hasta verificar la ejecución. Si backups comparten el volumen, añadir su expansión; si usan otro destino, proyectarlo aparte. Entregar escenarios base, adverso y planificado con acciones concretas: reducir retención permitida, optimizar índices, compactar con reserva o ampliar cuota.

## 6. Estados de capacidad y reservas

Configurar NORMAL, WARNING, CRITICAL y EMERGENCY por proyecto. Porcentajes como 70/80/90/95 son ejemplos, nunca política universal. Un archivo enorme puede agotar el espacio con uso del 60%; una base puede necesitar espacio adicional para reconstruir índices o migrar. Definir reserva por peor operación razonable y por tiempo de reposición de capacidad.

Combinar uso, forecast, latencia, errores de escritura y tiempo de aprovisionamiento. Ejemplo adaptable: WARNING si la reserva se alcanza en menos de 45 días; CRITICAL si quedan menos de 14 días o el rendimiento afecta el SLO; EMERGENCY si una escritura segura ya no puede completarse. El presupuesto o la cuota del proveedor también pueden disparar un estado aunque quede espacio físico.

Usar histéresis: entrar tras persistencia definida y salir únicamente después de recuperación sostenida con margen. No emitir cientos de alertas por oscilar alrededor de un porcentaje. Exigir mensaje con recurso, uso, fuente, tendencia, consecuencia, responsable y acción. Escalar si el forecast se acorta o la ampliación tarda más de lo disponible. Nunca resolver la alerta borrando silenciosamente datos.

## 7. Niveles, retención y suspensión de borrado

HOT atiende acceso frecuente y requisitos de latencia; WARM reduce costo con acceso razonable; COLD y ARCHIVE pueden imponer demoras y costos de recuperación. Elegir por patrones medidos. Períodos como 30 días en HOT y un año en WARM son ejemplos, no obligaciones legales. Incluir costos de solicitudes, egreso, versiones, mínimos de permanencia y recuperación al comparar proveedores.

Cada clase define finalidad, retención operativa, eventual obligación legal, ubicación, cifrado, backup, responsable y mecanismo de eliminación. El período concreto queda pendiente de revisión competente cuando dependa de normativa, contrato o investigación. El [DS 016-2024-JUS publicado por ANPD](https://www.gob.pe/institucion/anpd/normas-legales/6554453-n-016-2024-jus) es fuente para evaluar protección de datos en Perú; no determina por sí solo una retención universal.

Un legal hold suspende el borrado de los objetos afectados, con motivo, alcance, autoridad y revisión. No convierte todo el repositorio en conservación indefinida. Las solicitudes de supresión requieren evaluar obligaciones, hold, trazabilidad y copias. Documentar cuándo desaparece un dato de producción, replicas y backups, y qué restricciones impiden restaurarlo como activo. La evidencia de eliminación no debe recrear el dato eliminado.

## 8. Local, nube e híbrido

En local evaluar acceso físico, energía, disco, antivirus, actualizaciones, robo y disponibilidad del responsable. En nube evaluar región, contrato, permisos, cuotas, costos, dependencia y salida. En híbrido identificar origen autorizado por clase, sincronización, reconciliación y conducta ante desconexión. No elegir nube por hábito ni local por asumir privacidad automática.

La sincronización necesita versiones, identificadores estables, operaciones pendientes durables y tombstones para borrados. Definir conflicto por campo o entidad: rechazo, resolución humana o merge probado. “Último escritor gana” solo procede cuando la pérdida resultante sea aceptable y documentada; no usarlo para ledger, autorizaciones o reservas críticas. Relojes locales pueden divergir, por lo que un timestamp no siempre establece orden fiable.

Probar desconexión, duplicados, modificación simultánea, eliminación offline, reconexión tardía y dispositivo perdido. Un cliente no puede recuperar permisos revocados por enviar operaciones antiguas. Cifrar tránsito y proteger material local; definir expiración de credenciales offline. Un documento sincronizado entre equipos sigue necesitando backup independiente del error replicado.

## 9. Backup, réplica y snapshot

Una réplica mejora disponibilidad, pero puede propagar corrupción o borrado. Un snapshot captura un punto, pero puede depender de la misma cuenta, disco o credencial. Un backup debe ofrecer recuperación frente a las amenazas definidas y conservar versiones suficientes. Una copia en otra carpeta del mismo disco no protege ante falla del disco.

Definir cobertura: base consistente, objetos vinculados, esquemas, configuración no secreta, manifiestos y procedimientos para recuperar secretos desde su fuente protegida. No copiar una base activa mediante un método que el motor no soporte. Verificar consistencia entre metadatos y archivos. Guardar catálogo con fecha, alcance, versión, checksum, cifrado, claves recuperables, duración y resultado.

RPO es pérdida máxima de datos aceptable; RTO es tiempo objetivo hasta recuperar el servicio necesario. Determinarlos por proceso y criticidad. Una frecuencia de backup no demuestra RPO si falla la ejecución; un restore de archivo no demuestra RTO si faltan identidad, DNS, claves y dependencias. Medir cumplimiento real y registrar pruebas fallidas.

Mantener separación de credenciales y destinos proporcional al riesgo, recuperación de claves y acceso de emergencia auditado. Retención bloqueada o almacenamiento WORM pueden reducir alteración, pero necesitan evaluación de configuración, privilegios y límites. Cifrado sin clave recuperable produce un backup inutilizable. El costo de copia y ensayo forma parte del presupuesto, no de un supuesto residual.

## 10. Ensayo de restauración aislado

Entradas obligatorias: punto de recuperación, backup elegido, manifiesto, dependencias, llaves autorizadas, destino aislado y criterios de aceptación. Antes de iniciar comprobar espacio, versión del motor, compatibilidad y acceso. El ensayo no se realiza encima de producción. Aislar notificaciones, pagos, webhooks salientes y tareas programadas para que la recuperación no repita acciones reales.

Procedimiento: verificar integridad del artefacto, restaurar con herramienta soportada, validar estructura y conteos, comprobar relaciones y muestras, iniciar aplicación con configuración de prueba, ejecutar flujos críticos y medir duración. Comparar último evento recuperable con el RPO y disponibilidad funcional con el RTO. Registrar diferencias, responsable y corrección.

Resultados: acta de ensayo, logs sanitizados, hashes, tiempos, versión restaurada, limitaciones y evidencia funcional. No conservar copias sensibles de prueba más allá del período autorizado. La aceptación exige un segundo operador capaz de seguir el runbook sin depender de memoria privada. Si falla la clave, el motor, un archivo o la aplicación, declarar fallo y no marcar backup como recuperable.

## 11. Fallos que deben tener respuesta

| Escenario | Respuesta inicial | Evidencia de salida |
|---|---|---|
| Disco lleno | Detener ingestión no esencial; preservar datos | Escritura segura y reserva restablecidas |
| Ransomware o borrado propagado | Aislar acceso y copias afectadas | Punto limpio verificado y permisos revisados |
| Backup incompleto | Mantener copia anterior; alertar | Nuevo backup íntegro y restaurado |
| Clave inaccesible | Activar custodio autorizado | Recuperación de clave auditada |
| Restore lento | Medir cuello de botella | RTO revisado o recuperación optimizada |
| Cuota cloud agotada | Confirmar límites y presupuesto | Ampliación o reducción autorizada |
| Conflicto híbrido | Cuarentena y resolución explícita | Versión elegida con motivo |
| Error de operador | Contener y recuperar sin ocultarlo | Cronología y control preventivo |

No ejecutar limpieza automática ante cualquiera de estos fallos. Un proceso de emergencia prioriza continuidad mínima, evidencia y recuperación. Ampliaciones que aumentan costo necesitan autorización dentro del presupuesto aprobado. Borrados de datos de producción no se ejecutan autónomamente por urgencia; preparar selección y consecuencias para la autoridad correspondiente.

## 12. Procedimientos Windows y entorno real

Inspeccionar sistema, rutas absolutas, usuario de servicio, disco, runtime disponible y permisos antes de elegir comandos. Usar PowerShell nativo para operaciones de archivos y `-LiteralPath` cuando corresponda. Si el runbook incluye mover o eliminar árboles, resolver y verificar que el destino esté dentro del workspace o directorio expresamente autorizado. No encadenar selección en PowerShell con borrado en otro shell.

Un lanzador documenta directorio de trabajo, argumentos, puerto, ubicación de base, logs y forma de detener. Preservar `.env`, base local y archivos del usuario al actualizar. Arranques de servicios auxiliares en segundo plano deben evitar ventanas innecesarias y generar diagnóstico verificable. No exigir Docker, Python o WSL si el entorno tiene una solución más adecuada.

El modo offline especifica qué funciona sin red, qué operaciones quedan pendientes y cómo se reanudan. Entregar exportación e importación reproducibles cuando el proyecto lo requiera, con formatos, versiones, checksum y comprobación posterior. El paquete de handoff no contiene secretos ni una copia privada inadvertida. Documentar pasos de recuperación y ubicación segura de originales.

## 13. Autonomía, aceptación y trazabilidad

A0/A1 inventarían y miden sin modificar datos. A2 prepara scripts, proyecciones y pruebas con datos sintéticos en rama. A3 exige autorización para restauración real, migración, ampliaciones costosas, exportaciones sensibles o cambios de retención. Aplicar autorizaciones previas dentro de su alcance. A4 prohíbe eliminación autónoma de producción, exposición de fuentes privadas y evidencia falsa.

Antes de cerrar exigir inventario completo o pendientes explícitos, unidades consistentes, forecast reproducible, umbrales con responsable, permisos por clase, política de retención y al menos un restore aislado cuando se prometa recuperación. Probar fallos de escritura, corrupción, pérdida de clave y sincronización si aplican. Registrar `trace_id`, recurso, actor seudonimizado, acción, resultado y referencia de autorización; nunca claves ni sesiones crudas.

El expediente conserva mediciones agregadas, manifest de backup, resultados de restore, decisiones y próxima revisión en la estructura documental existente. La fecha de prueba vence para efectos operativos cuando cambian esquema, motor, llaves o topología. No cerrar incidentes con “ya hay una copia” sin demostrar lectura y funcionamiento. Este repositorio proporciona el manual; cada proyecto debe aportar su evidencia real.

## 14. Referencias y revisión

Referencia primaria consultada el **2026-10-03**: [ANPD, DS 016-2024-JUS](https://www.gob.pe/institucion/anpd/normas-legales/6554453-n-016-2024-jus). La aplicabilidad, finalidad, transferencias y conservación quedan pendientes de revisión competente para cada proyecto. Las cifras y umbrales de este manual son ejemplos de ingeniería y deben sustituirse por mediciones.

**Firma documental:** Pierre R. Boss · oprbguitar. Quiero expansión con presupuesto, conservación con propósito y recuperación que otro operador pueda demostrar.
