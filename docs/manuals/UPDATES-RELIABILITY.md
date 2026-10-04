# Manual EOS de actualizaciones, confiabilidad y continuidad

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
**Fecha documental:** 2026-10-03, Perú. **Origen:** ampliación operacional SRC-02.
**Naturaleza:** instrucciones; no prueba que exista updater, monitor programado, pipeline ni servicio operativo.

## 1. Mandato personal

Quiero evolución sostenida con capacidad de demostrar qué versión está funcionando, qué cambió, quién autorizó el cambio y cómo se recupera el servicio. Una actualización debe cuidar la base de datos, los archivos, la configuración y el trabajo del usuario. No aceptaré un botón que descargue cualquier cosa y la ejecute, ni una release declarada estable porque el proceso arrancó.

Este manual desarrolla la [constitución maestra](../../EOS_MASTER_SYSTEM_INSTRUCTION.md) y el [punto de entrada de agentes](../../AGENTS.md). Aplicarlo a aplicaciones, clientes, dependencias, runtimes, esquemas, conectores, agentes, modelos, paquetes de datos y políticas. Ajustar su intensidad a criticidad y entorno; una herramienta local sencilla no requiere la infraestructura de una plataforma crítica, pero sí necesita versión, verificación y recuperación proporcional.

El Update & Evolution Manager es una responsabilidad definida por EOS. Su existencia documental no crea un scheduler ni un servicio en segundo plano. Cada proyecto declara qué revisiones son manuales, cuáles están implementadas y cómo se comprueba su ejecución. No prometer vigilancia continua sin configuración real, propietario y evidencia.

## 2. Responsables y expediente de cambio

| Responsable | Entrada | Salida obligatoria |
|---|---|---|
| Technology Scout | Inventario y fuentes oficiales | Cambio detectado, impacto y fecha |
| Arquitecto | Compatibilidad y dependencias | Plan de transición y límites |
| QA/revisor | Cambio y riesgos | Pruebas pertinentes y defectos |
| Seguridad | Procedencia y superficie afectada | Riesgos de suministro y controles |
| SRE/operador | SLO, runbook y ambiente | Rollout, observación y recuperación |
| Propietario | Resultado revisable y alcance | Autorización de impacto alto |

El expediente identifica componente, versión actual/propuesta, fuente, commit, artefacto, motivo, compatibilidad, riesgos, pruebas, backup, rollback, aprobación y responsable. Adjuntar referencias a resultados reales; un casillero “PASS” escrito por un agente no sustituye una ejecución. Mantener cambios relacionados juntos y separar refactors ajenos al objetivo. Las instrucciones del usuario delimitan alcance y prevalecen sobre preferencias de automatización.

## 3. Inventario y versiones fijadas

Inventariar frontend, backend, base, runtime, sistema operativo relevante, SDK, servicios externos, build tools, workflows, modelos y paquetes de datos. Registrar versión desplegada además de la declarada en el repositorio. Un lockfile actualizado no garantiza que producción use ese árbol. Identificar propietario, soporte, fin de vida, licencia, procedencia y dependencias transitivas relevantes.

Fijar versiones reproducibles mediante lockfiles y referencias inmutables cuando sea viable. Verificar que la instalación utilice el mecanismo determinista del gestor real. No usar `latest` como identidad de release. Registrar digest de contenedor o artefacto y versión de herramientas de build. Fijar una versión reduce variación, pero no la convierte en segura; revisar vulnerabilidades y ciclo de actualización.

El inventario debe distinguir requisito, instalado, desplegado y verificado. Los componentes sin versión identificable son pendientes con consecuencia concreta. Detectar cambios de licencia y formatos antes de adoptar. Mantener una ruta de salida para conectores y runtimes con soporte limitado; no migrar por moda o por un aumento de usuarios sin evidencia del cuello de botella.

## 4. Cadena de suministro y artefactos

Revisar procedencia de código, dependencias, build, credenciales CI y repositorio de artefactos. Usar accesos mínimos y separar publicación de ejecución ordinaria. No exponer secretos a builds de contribuciones no confiables. Identificar scripts de instalación que pueden ejecutar código, typosquatting y fuentes alternativas. Los paquetes descargados se consideran no confiables hasta completar controles.

Cada release relaciona código autorizado, herramientas, dependencias, resultado de build y artefacto entregado. Incorporar SBOM o inventario equivalente proporcional al proyecto. Aplicar análisis de dependencias y revisión de cambios, sin confundir ausencia de alertas con ausencia de riesgo. Documentar excepciones, vigencia y responsable; no desactivar un scanner para fabricar un resultado favorable.

Verificar integridad del artefacto y autenticidad de su origen. Un hash publicado junto a un binario en un servidor comprometido no prueba por sí solo procedencia. Usar firma o manifest firmado con raíz de confianza independiente cuando el updater dependa de ella. Proteger claves de firma, registrar rotación y disponer de revocación. La [guía OWASP de suministro](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html) es referencia técnica para revisar estos controles.

## 5. Clasificación y preparación

Clasificar cambio como seguridad, corrección, funcionalidad, incompatibilidad, datos o norma; puede pertenecer a más de una categoría. Evaluar impacto en usuarios, permisos, integración, almacenamiento, costo y recuperación. Una corrección de seguridad puede requerir urgencia, pero no justifica ejecutar material desconocido o destruir datos.

Antes de modificar inspeccionar estado Git, cambios locales, configuración, runtimes y datos. Crear rama para cambios no triviales y preservar trabajo ajeno. Definir plan, dependencias, pruebas y criterio de salida. Escribir primero pruebas relevantes cuando se implemente comportamiento; para cambios documentales verificar referencias, consistencia y trazabilidad sin inventar runtime.

Preparar notas de release entendibles: problema concreto, comportamiento final, requisitos, limitaciones y acciones del operador. El plan de recuperación identifica versión anterior, esquema compatible, configuración necesaria y autoridad que decide. Reutilizar autorización explícita ya concedida dentro del alcance; no terminar el trabajo con otra petición genérica si la acción ya fue autorizada.

## 6. Updater de escritorio seguro

El cliente conoce canal aprobado, URL permitida, versión, sistema operativo, arquitectura, tamaño, hash, firma, requisitos y versión mínima compatible. Validar manifest y artefacto antes de ejecutar. Rechazar firma incorrecta, descarga truncada, plataforma equivocada y downgrade no autorizado. El canal usa transporte seguro y una política explícita para redirecciones; no aceptar cualquier URL enviada por un documento externo.

Separar binarios reemplazables de base, preferencias, archivos personales, secretos y logs. El updater conserva rutas y argumentos existentes. Descargar a ubicación temporal dentro del alcance previsto, verificar espacio suficiente para instalación y rollback, detener únicamente los procesos propios requeridos y realizar sustitución controlada. Un corte de energía debe dejar versión anterior o nueva recuperable, no una mezcla silenciosa.

Definir bloqueo de actualización concurrente, checkpoints y reanudación. Probar app abierta, archivo bloqueado, antivirus, usuario sin privilegios, descarga fallida, firma caducada o revocada y manifest incompatible. No requerir administrador por comodidad. Comunicar progreso, pausa, resultado y recuperación; una ventana cerrada no equivale a instalación exitosa.

Si se actualiza código desde Git, preferir fast-forward y detener ante cambios locales, divergencia o incompatibilidad. No usar `reset --hard`, `clean`, stash automático ni sustitución de configuración para esconder conflictos. Guardar base y argumentos, validar arranque y hacer visible la versión efectiva. El mecanismo concreto se implementa y prueba en el proyecto; este manual no crea el botón.

## 7. Migraciones expand-contract

Separar evolución de aplicación y evolución de datos. Expandir primero con estructuras compatibles, desplegar código que soporte coexistencia, migrar mediante lotes observables, validar y retirar lo antiguo después. Definir compatibilidad entre versiones N/N−1 y esquema. Las ventanas de convivencia son explícitas; no mantener dos fuentes indefinidamente sin responsable.

El plan de migración incluye volumen, índices, locks, duración, espacio extra, transacción, checkpoints, backfill, validaciones y condiciones de interrupción. Probar sobre datos representativos protegidos o sintéticos adecuados. Una copia pequeña no predice bloqueo de millones de filas. Medir y limitar carga para conservar funciones esenciales.

Tomar backup apropiado y comprobar restore siguiendo el [manual de almacenamiento](STORAGE-DATA.md). Un backup no habilita deshacer indiscriminadamente transacciones posteriores. Si hubo cobros, comunicaciones, exportaciones o acciones externas, restaurar una base antigua puede perder evidencia y repetir efectos. Para [pagos](PAYMENTS.md) conservar ledger y reconciliar; preferir corrección hacia adelante cuando un downgrade violaría invariantes.

Retirar columnas, formatos o endpoints requiere evidencia de que ya no se usan y autorización cuando afecte producción. No combinar eliminación irreversible y release sin necesidad demostrada. Registrar operaciones compensatorias, pasos manuales y pérdidas potenciales. La palabra rollback debe especificar qué se revierte, qué se conserva y qué no se puede recuperar automáticamente.

## 8. Canary y criterios medibles

Definir rollout proporcional: staging, usuario interno, instancia, tenant o porcentaje elegido. Evitar asignar a ciegas operaciones financieras o usuarios críticos. Registrar cohorte, duración mínima, volumen mínimo, comparación y responsable. Si el tráfico es insuficiente, usar ensayos controlados y declarar el límite; no publicar una conclusión estadística a partir de dos solicitudes.

Medir errores, p95/p99, disponibilidad funcional, colas, fallos de autenticación, capacidad y métricas del objetivo del cambio. Un endpoint `/health` debe tener semántica definida; proceso vivo no implica base accesible ni flujo exitoso. Ejemplo ilustrativo: suspender expansión si aumenta el error de la función crítica o si una invariante financiera falla. Los valores exactos provienen del SLO y baseline del proyecto.

Separar liveness, readiness y pruebas sintéticas de negocio. Usar timeouts, reintentos acotados y circuit breakers donde se justifiquen; no multiplicar reintentos en cada capa hasta saturar un proveedor. Incorporar presupuesto de error y detener releases cuando la política lo exija. La alerta debe conducir a una acción, no ser una decoración del dashboard.

## 9. Release, aprobación y verificación pública

El paquete revisable incluye diff final, pruebas, riesgos, artefacto, notas, backup y recuperación. Despliegue de producción, cambios de autenticación, pagos o seguridad requieren A3 según la constitución. La autorización debe identificar entorno y operación. “Publica esta versión” puede autorizar ese despliegue; no autoriza borrar datos o publicar secretos.

Después de desplegar verificar destino real, identidad de versión, configuración esperada y flujos críticos. Un push Git no demuestra despliegue ni descarga funcional. Probar autenticación, navegación o endpoints según producto, con cuentas y datos autorizados. Para artefactos descargables comprobar disponibilidad, tamaño, hash y compatibilidad anunciada. Mantener evidencia sanitizada y registrar lo que no pudo comprobarse.

La release alcanza estado verificado cuando cumple criterios del expediente; si falla, contener, decidir recuperación y registrar incidente. El operador no debe improvisar cambios adicionales fuera de alcance. Un rollback previamente aprobado puede ejecutarse según sus condiciones; si requiere otra operación irreversible o cambia el riesgo, obtener autorización específica antes de esa parte.

## 10. Observabilidad sin filtración

Correlacionar logs, métricas y trazas mediante `trace_id`, `request_id`, componente, versión, entorno y actor seudonimizado. Los identificadores deben ser útiles sin convertirse en credenciales. No registrar contraseñas, claves, tokens de acceso, cookies, sesiones en bruto, datos completos de tarjeta ni cuerpos sensibles por defecto.

Configurar redacción, límites de tamaño, controles de acceso, retención y eliminación. Validar que errores y trazas de desarrollo no filtren contenido al usuario. No usar datos personales como etiquetas de métricas de alta cardinalidad. Una sesión puede representarse con identificador derivado y política de uso, sin conservar el bearer token.

Probar fallo del colector, disco de logs lleno, reloj desalineado, saturación y payload de log malicioso. El sistema conserva funciones esenciales cuando la telemetría no crítica falla; eventos de auditoría críticos requieren política específica para no perder integridad sin aviso. Registrar degradación y límites. La [guía OWASP de logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) sirve como referencia de revisión, no como certificación.

## 11. Auditoría e integridad

El audit ledger reúne actualizaciones, migraciones, configuración, conectores, IA, almacenamiento y acciones administrativas. Cada evento identifica actor, acción, objeto, motivo, resultado, timestamp, correlación y autorización. Reducir snapshots de antes/después a los campos necesarios y evitar secretos. Distinguir auditoría de negocio de logs técnicos efímeros.

Un append-only lógico o una cadena de hashes puede detectar alteraciones cuando se conserva una referencia confiable. No garantiza inmutabilidad si un administrador puede reescribir la cadena completa y sus anclas. Firmas, anclaje externo, almacenamiento WORM, separación de funciones y restricciones de retención aportan controles distintos. Describir amenaza cubierta y límite de cada mecanismo.

Verificar periódicamente secuencia, firma y anclas; registrar gaps y recuperación del colector. La política de conservación depende de finalidad y obligaciones evaluadas. No etiquetar un log como “inalterable” sin comprobar permisos, configuración y amenaza. Exportar evidencia de incidentes con hash, origen y custodio cuando corresponda, sin exponer datos innecesarios.

## 12. Connector Watch y evolución de IA

Cada conector registra versión vigente, deprecada, sunset, breaking changes, límites, licencia, autenticación, contacto y fecha de verificación. La revisión consulta fuentes oficiales y distingue anuncio de fecha efectiva. Asignar frecuencia por criticidad y tiempo de migración; un sunset cercano requiere decisión concreta, pruebas y responsable.

Si la revisión es manual, indicarlo. Si se solicita monitor o recordatorio, configurarlo mediante herramientas disponibles y verificar la programación real. Este repositorio no declara activo un monitor. Notificar cambios significativos y acciones requeridas conforme a la preferencia del usuario, sin generar mensajes repetitivos de estado inalterado.

Modelos y agentes también son componentes versionados. Antes de cambiar modelo revisar licencia, procedencia, seguridad, RAM/VRAM, contexto, costo y calidad con evals representativas. Comparar comportamiento, privacidad y herramientas permitidas. No cargar un modelo que degrade la función principal; mantener mecanismo para desactivar IA conservando el producto operativo. Una nueva versión no implica mejor resultado en el dominio.

## 13. Incidentes, offline y handoff Windows

Ante fallo: detectar, contener, recuperar funciones esenciales, preservar evidencia, analizar impacto y evaluar comunicaciones obligatorias con responsable competente. Mantener cronología, decisiones y límites. El postmortem identifica causa, factores contribuyentes, brechas de detección y una acción verificable. Evitar ocultar fallos bajo una actualización silenciosa.

En Windows verificar sistema, rutas, permisos, runtime y proceso real antes de ejecutar. Usar herramientas existentes y comandos adecuados a PowerShell. Para operaciones recursivas resolver destino absoluto y verificar alcance; no generar listas en un shell y borrarlas en otro. Conservar configuraciones y datos. Los servicios auxiliares en segundo plano requieren diagnóstico y cierre claro, sin ventanas visibles innecesarias.

Un paquete offline contiene artefactos verificados, manifest, requisitos, instrucciones y checksums. Define lo que necesita red, mecanismo de actualización posterior y compatibilidad de datos. No incluir claves de producción. El handoff proporciona arranque, parada, versión, logs, backup, restore, rollback y contactos por rol. Pedir a otro operador que ejecute un ensayo desde el documento; si depende de memoria del autor, el traspaso está incompleto.

## 14. Escenarios obligatorios y cierre

| Fallo ensayado | Resultado aceptable |
|---|---|
| Descarga corrupta o firma inválida | Rechazo sin ejecutar ni cambiar datos |
| Corte durante actualización | Versión recuperable y estado conocido |
| Cambios Git locales | Detención preservando trabajo |
| Migración interrumpida | Checkpoint, invariantes y reanudación definidos |
| Canary degradado | Expansión detenida y decisión registrada |
| Provider sunset | Responsable y transición antes del límite |
| Observabilidad indisponible | Degradación visible, política aplicada |
| Restore tras efectos externos | Conciliación, sin repetición ciega |

Aceptar cierre solo con inventario actualizado, versión efectiva probada, evidencia de pruebas, aprobación aplicable, observación y recuperación documentadas. A0/A1 investigan y prueban sin efectos de producción; A2 prepara rama y artefactos; A3 cubre cambios de impacto alto; A4 impide ejecutar binarios arbitrarios, borrar producción, desactivar seguridad o fabricar evidencia. Las tareas pendientes deben quedar identificadas, sin convertir propuesta en resultado.

## 15. Referencias primarias

Consultadas el **2026-10-03**: [OWASP, Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html) y [OWASP, Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html). Revalidar documentos y procedimientos oficiales del runtime, proveedor y motor concretos al implementar. Las obligaciones legales o regulatorias quedan pendientes de evaluación competente; este manual no certifica cumplimiento ni sustituye contratos.

**Firma documental:** Pierre R. Boss · oprbguitar. Quiero avanzar con versiones identificables, decisiones explicables y un camino de recuperación que resista la prueba.
