# Incident Response: contener, recuperar y aprender con evidencia

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
**Edición:** 2026-10-03 · **Idioma:** español de Perú · **Naturaleza:** runbooks y contratos de respuesta.

Este manual desarrolla [la constitución maestra](../../EOS_MASTER_SYSTEM_INSTRUCTION.md), secciones 3, 15–28, 32, 40–42, 60–61 y 64. Procede de **SRC-01**, especialmente los bloques históricos 203–219 y 221–222. La configuración preventiva corresponde a [Security Fabric](SECURITY-FABRIC.md). Los números históricos no reemplazan la numeración vigente de la constitución.

**Estado verificable:** aquí se especifica cómo debería funcionar una respuesta. No se afirma que exista un centro operativo, detección desplegada, automatización, personal de guardia o restauración probada. Cada proyecto debe completar contactos, permisos, capacidades, tiempos y evidencias antes de presentar estos runbooks como operativos. Los ejemplos son ejercicios de diseño y no incidentes reales.

## 1. Mi mandato durante un incidente

Quiero recuperar el servicio sin perder la verdad de lo ocurrido. La primera obligación es reducir daño con decisiones acotadas; la segunda, preservar evidencia y explicar lo que sabemos. No acepto un cierre basado en «parece normal», ocultar una afectación ni borrar registros para limpiar el problema.

Un incidente combina disponibilidad, integridad, confidencialidad y confianza. Se puede restablecer una página mientras las credenciales siguen comprometidas. También se puede detener un ataque bloqueando a todos los usuarios. Ninguno de esos resultados satisface recuperación completa.

El operador nombra un responsable, delimita recursos y registra acciones. La IA ayuda a correlacionar y redactar, pero no se transforma en autoridad ilimitada. Toda decisión conserva motivo, autorización, resultado esperado y condición de reversión. Si falta capacidad, se declara y se solicita el recurso concreto; no se inventa una defensa funcionando.

## 2. Preparación y entradas obligatorias

Antes del incidente se necesita un inventario con dueños, servicios esenciales, dependencias, ambientes, accesos administrativos y rutas de escalamiento. La ficha incluye objetivos de recuperación acordados, backups, restauración, observabilidad, herramientas realmente disponibles y política de comunicación. Los contactos operativos se guardan en un canal controlado; no se publican teléfonos privados ni secretos en Git.

La entrada de un caso contiene alerta, fuente, período, ambiente, síntomas, usuarios potencialmente afectados y calidad de la señal. El operador contrasta al menos disponibilidad y métricas técnicas cuando sea posible. Alertas duplicadas se correlacionan con el mismo incidente; no crean autorizaciones repetidas ni multiplican contenciones.

La salida mínima comprende registro del incidente, clasificación, decisión de estado, evidencia restringida, acciones ejecutadas, validación de recuperación, incertidumbres y tareas de prevención. Un caso descartado conserva la razón y la evidencia que contradijo la hipótesis. No se convierte en «ataque confirmado» únicamente porque una herramienta usó ese rótulo.

## 3. Responsabilidades y coordinación

| Responsabilidad | Decisión y salida |
|---|---|
| Responsable del incidente | Prioridades, alcance, estado y continuidad del registro |
| Operador técnico | Ejecutar pasos permitidos y comprobar resultados |
| Security Auditor | Correlacionar evidencias, revisar contención y acceso |
| Propietario del servicio | Identificar flujos esenciales y validar recuperación |
| Responsable de datos | Determinar clases de información y preservar restricciones |
| Responsable de comunicación | Preparar mensajes verificados y obtener autorización requerida |

Una persona puede asumir varias responsabilidades en un proyecto pequeño, pero las decisiones no desaparecen. Los relevos entregan situación, acciones activas, vencimientos y siguiente decisión. Las herramientas de colaboración deben estar disponibles sin depender del servicio afectado.

Cada operador anuncia el recurso que modifica. Se evita que dos personas reviertan mutuamente reglas o roten una misma credencial sin coordinación. El responsable limita cambios paralelos cuando impiden atribuir efectos, manteniendo tareas independientes como análisis y validación.

## 4. Severidad, confianza y modos

Severidad mide impacto; confianza mide certeza. Un servicio crítico caído puede ser un incidente severo con causa todavía desconocida. Un intento inequívoco rechazado puede tener confianza alta y escaso impacto. Ambas dimensiones quedan separadas de la respuesta.

Este runbook usa cuatro estados canónicos: `normal`, `elevated`, `under_attack` y `lockdown`. El valor `HIGH` listado en la sección 27 de la constitución se interpreta como subnivel de `elevated` y se conserva en `legacy_label` si existe una interfaz previa. Esta correspondencia documental no migra software por sí sola.

| Estado | Evidencia de entrada | Respuesta permitida | Evidencia de salida |
|---|---|---|---|
| `normal` | Sin degradación atribuible activa | Controles basales y observación | Anomalía validada para elevar |
| `elevated` | Desviación o alerta que necesita investigación | Más observación y medidas reversibles acotadas | Hipótesis descartada o abuso confirmado |
| `under_attack` | Abuso corroborado o compromiso confirmado con alcance identificable | Contención del vector dentro de autorización | Ataque reducido y verificación de recuperación |
| `lockdown` | Compromiso grave o contención anterior insuficiente | Aislar alcance crítico y mantener servicios esenciales seguros | Integridad, identidad y restauración verificadas |

Una transición directa a lockdown puede justificarse por compromiso confirmado. No se requiere esperar una secuencia artificial mientras continúa el daño. La evidencia y autoridad siguen siendo obligatorias.

## 5. Transiciones con contrato verificable

Cada cambio de estado produce `transition_id`, estado anterior, estado nuevo, evidencia, ambiente, alcance, actor, regla, autorización, TTL, acciones y recuperación prevista. La operación es idempotente: repetir una alerta no instala varias reglas equivalentes.

`normal → elevated` utiliza desviación contra baseline o alerta verificable y registra explicaciones alternativas. `elevated → under_attack` requiere señales que sustenten abuso, no solamente incremento de tráfico. `under_attack → lockdown` identifica qué daño continúa y por qué una medida menos restrictiva no basta. Toda reducción de estado depende de pruebas de servicio y seguridad.

La política se evalúa con versión concreta y reloj confiable. Si falta evidencia o autoridad, se realiza observación permitida y se prepara la decisión pendiente. Un modelo no modifica estados mediante lenguaje libre; propone una transición estructurada que un motor autorizado valida.

**Aceptación:** alerta incompleta no causa un bloqueo global; evento repetido no duplica cambios; dos actualizaciones concurrentes no pierden estado; una transición rechazada deja razón auditable; renovar un TTL requiere nueva decisión, evitando renovación infinita silenciosa.

## 6. Autorización existente y respuesta automática

La sección 3 de la constitución distingue cambios seguros, cambios en rama y operaciones sensibles. La autorización directa del usuario puede existir antes del incidente. Se verifica acción, entorno, recurso, período y límites; si cubre el paso concreto, no se pide lo mismo otra vez. Una aprobación para publicar documentación no autoriza cambiar un firewall, revocar usuarios ni enviar datos a terceros.

Una política aprobada puede delegar contención automática con condiciones precisas. Esa delegación se registra como autoridad efectiva; «emergencia» o «alta confianza» no crea permiso por sí sola. Sin cobertura, el operador prepara el cambio revisable y mantiene acciones ya permitidas.

El motor automático tiene lista cerrada de acciones, alcance máximo, duración, presupuesto, límite de repeticiones y kill switch. No borra datos, no elimina auditoría, no modifica pagos ni desactiva autenticación para mejorar disponibilidad. Una regla de desafío por endpoint no se convierte en bloqueo de país completo.

Las comunicaciones externas, cambios de credenciales, despliegues y aislamiento severo se realizan con autorización aplicable. Se registra evidencia de esa autorización sin copiar conversaciones privadas completas. Si falta, la solicitud deberá explicar la operación concreta y su impacto; el resto del análisis continúa.

## 7. TTL, reversión y vencimiento seguro

Toda contención temporal guarda configuración anterior, identificador del cambio, inicio, expiración y procedimiento de rollback. Los bloqueos de tráfico tienen límites que evitan castigar indefinidamente a usuarios legítimos. Expirar una medida no significa declarar resuelto el caso.

El vencimiento depende del tipo de control. Una regla temporal de rate limiting puede volver a la política base aprobada; el aislamiento de un componente comprometido no se levanta automáticamente solo porque pasó tiempo. En ese caso el TTL exige revisión y escalamiento, manteniendo el estado seguro previamente autorizado hasta que se verifique recuperación. Esa distinción se define antes de activar la medida.

**Ejemplo ilustrativo**, sujeto a aprobación y calibración:

```yaml
example_only: true
response_policy:
  observation_review_minutes: 10
  temporary_endpoint_rule_minutes: 15
  maximum_automatic_renewals: 1
  traffic_rule_expiry: restore_approved_baseline
  compromised_workload_expiry: require_recovery_review
  maximum_scope: one_service_one_environment
```

Si el controlador deja de funcionar, un watchdog independiente observa medidas vencidas. La prueba simula esa pérdida y comprueba que no se habilita un recurso inseguro ni queda un bloqueo temporal sin revisión.

## 8. Registro y preservación de evidencia

El expediente contiene cronología con zona horaria, deployment, fuentes, hechos, hipótesis, decisiones y efectos. Se registra UTC para correlación y se presenta hora de Perú cuando ayude al operador. Desfase de relojes y lag del colector se documentan antes de reconstruir una secuencia.

Los artefactos se preservan con identificador, hash, origen, momento, recolector, acceso y ubicación restringida. Un hash permite detectar cambios; no prueba por sí mismo autenticidad ni integridad completa del sistema. Se conserva la herramienta y método de obtención. La contención urgente puede preceder a una captura si el daño continúa; se explica lo que pudo perderse.

No se vuelcan contraseñas, bearer tokens, cookies o claves en tickets, capturas públicas o postmortems. Se utilizan referencias no reutilizables y material redactado. La evidencia sensible requiere acceso mínimo, almacenamiento cifrado y retención definida. OWASP documenta restricciones de datos y protección de logs. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

**Aceptación:** un operador sin permisos no accede al expediente; una muestra no contiene secretos; se detecta alteración del artefacto; un fallo de ingestión queda visible y no borra el historial previo.

## 9. Playbook DDoS y abuso de recursos

**Disparadores:** saturación, incremento anormal de rutas costosas, errores o alertas de edge. **Entrada:** volumen, latencia, consumo, baseline, evento comercial conocido y cobertura upstream. **Salida:** vector acotado, control aplicado, impacto legítimo medido y recuperación.

1. Confirmar ambiente y revisar si existe campaña, despliegue fallido o proveedor caído. Comparar conversiones válidas y operaciones terminadas con solicitudes recibidas.
2. Identificar si el problema es enlace, conexiones o trabajo de aplicación. Un ataque volumétrico requiere proveedor upstream; no se intenta absorberlo sumando servidores indefinidamente.
3. Verificar protección del origen y ausencia de bypass antes de confiar en reglas de borde. Conservar el acceso operativo independiente.
4. Activar únicamente controles preautorizados para el vector: rate limiting, desafío o filtro específico. Registrar identificador, TTL y cohorte afectada.
5. Aumentar caché solo para contenido que pueda compartirse de manera segura. No cachear respuestas privadas ni ignorar parámetros funcionales sin prueba.
6. Medir errores, usuarios válidos, colas y costo. Escalar demanda legítima dentro del presupuesto aprobado.
7. Retirar gradualmente medidas temporales cuando cumplan salida; observar recurrencia y conservar evidencia.

Cloudflare recomienda origen protegido y caché dentro de una estrategia de defensa; no garantiza que cualquier configuración cubra todos los servicios. [Referencia primaria](https://developers.cloudflare.com/ddos-protection/best-practices/proactive-defense/).

**Aceptación del ejercicio:** campaña legítima conserva navegación; el abuso sintético limitado consume menos origen; el presupuesto no se desborda; una regla no afecta inesperadamente APIs automáticas; la reversión restaura la configuración base.

## 10. Playbook ataque de cuentas y sesiones

**Disparadores:** fallos distribuidos, recuperación anómala, sesión revocada reutilizada o acción sensible inesperada. **Entrada:** eventos seudonimizados, dimensiones de cuota, método de autenticación y historial pertinente. **Salida:** cuentas afectadas delimitadas, acceso legítimo protegido y credenciales revisadas.

1. Diferenciar intento rechazado, acceso sospechoso y compromiso confirmado. No usar geolocalización o VPN como prueba concluyente.
2. Verificar que existan buckets independientes por cuenta y por fuente confiable. Si se detecta bypass, corregir la frontera mediante cambio autorizado.
3. Aplicar demoras, desafío o step-up acotados. No permitir que fallos provocados bloqueen permanentemente a la víctima.
4. Ante compromiso confirmado, revocar sesiones y mecanismos relevantes bajo autorización; verificar también refresh tokens y persistencia de acceso.
5. Proteger recuperación: validación adicional, enlaces de uso único, expiración y rechazo de repetición. No enviar secretos por canales inseguros.
6. Revisar cambios de permisos, integraciones, exports y acciones de negocio realizados durante el período afectado.
7. Validar acceso del titular por un camino confiable y monitorear recurrencia; documentar qué sesiones permanecen válidas y por qué.

OWASP trata renovación y revocación de sesión como parte de su ciclo; la implementación debe demostrar su efecto real. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

**Aceptación:** un token revocado falla en la API; la recuperación no revela existencia de cuentas; el titular no queda sin salida; el registro no conserva contraseñas intentadas ni sus huellas.

## 11. Playbook código malicioso y suministro

**Disparadores:** binario inesperado, dependencia comprometida, escritura no autorizada o actividad de red corroborada. **Entrada:** versión, procedencia, runtime, rutas afectadas y exposición. **Salida:** ejecución contenida, alcance investigado y reconstrucción confiable.

1. Delimitar componente y detener ejecución dañina con el mecanismo autorizado. Evitar propagar artefactos o trabajar desde un host que pueda capturar credenciales nuevas.
2. Preservar logs y metadatos relevantes. No ejecutar un archivo sospechoso para «ver qué hace» en la máquina operativa.
3. Identificar entrada probable: paquete, imagen, CI, extensión, archivo cargado o credencial. Separar hechos de hipótesis.
4. Buscar otros ambientes que compartan componente o identidad. Suspender distribución del artefacto comprometido con alcance concreto.
5. Rotar credenciales afectadas desde un entorno confiable, coordinar consumidores y comprobar revocación. No rotar indiscriminadamente sin conocer dependencias.
6. Reconstruir desde fuentes verificadas, pipeline limpio y dependencias revisadas. Un reinicio o antivirus sin alertas no acredita erradicación.
7. Probar integridad, permisos, salidas de red y flujos esenciales antes del retorno gradual.

La revisión de suministro incluye artefactos y pipeline, conforme a riesgos descritos por OWASP. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html).

**Aceptación:** la versión comprometida no se redepliega; secretos anteriores dejan de funcionar; el artefacto restaurado tiene procedencia verificable; el rollback no reintroduce la causa.

## 12. Playbook agente comprometido

**Disparadores:** llamada fuera de scope, instrucciones externas obedecidas, destino no autorizado o modificación inesperada. **Entrada:** identidad, tarea, permisos, llamadas, diff y destinos. **Salida:** ejecución detenida, permisos revocados, efectos inspeccionados y tarea reanudable de forma segura.

1. Detener agente y workers asociados; cancelar colas y reintentos. Conservar task ID y momento efectivo de detención.
2. Revocar herramientas, credenciales y delegaciones relacionadas. El kill switch debe operar fuera de la conversación del agente.
3. Restringir egress autorizado para contención. Verificar llamadas en curso y transferencias terminadas; una cancelación no recupera información enviada.
4. Revisar archivos, publicaciones, cambios de configuración y datos afectados. Comparar contra versión conocida; preservar trabajo legítimo de otros colaboradores.
5. Identificar la frontera vulnerada: inyección indirecta, permisos excesivos, validador defectuoso o token reutilizado. No limitar la solución a añadir una frase al prompt.
6. Restaurar cambios concretos y renovar identidad cuando corresponda. Revalidar permisos con llamadas negativas antes de reanudar.
7. Reiniciar con tarea delimitada y observar. No darle nuevamente acceso total para completar más rápido.

OWASP recomienda validar llamadas y limitar privilegios en agentes con herramientas. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

**Aceptación:** el agente detenido no ejecuta una llamada adicional ni reinicia por cola; el documento hostil no cambia su autoridad; la función esencial conserva el fallback previsto.

## 13. Restauración y retorno al servicio

La restauración comienza con un punto conocido, no necesariamente el backup más reciente. Se evalúa si contiene corrupción, datos maliciosos o credenciales comprometidas. El entorno de prueba permanece separado y conserva restricciones de datos. Se prueba integridad lógica, acceso, autorización y operaciones esenciales.

El responsable registra RTO observado y pérdida real comparados con objetivos acordados, sin inventar cifras. Para escrituras posteriores al backup se define conciliación y riesgo de duplicados. Operaciones económicas o datos de producción no se editan arbitrariamente para «cuadrar» resultados.

El retorno es gradual: componente, cohorte y flujo. Se revisan alarmas, métricas de negocio y seguridad junto con el rollback preparado. Si reaparece el vector, se contiene de nuevo bajo la misma política vigente o una autorización ampliada; no se ignora porque el servicio ya volvió.

**Criterio de recuperación:** disponibilidad aceptable, vector contenido, permisos y sesiones coherentes, datos revisados, reglas temporales gestionadas y monitoreo activo. Las incertidumbres restantes tienen responsable y plazo. Restaurar servicio y cerrar investigación son decisiones distintas.

## 14. Comunicación y cierre responsable

El mensaje de estado explica qué servicio está afectado, desde cuándo, qué se conoce y qué acción necesita el usuario. No acusa personas ni publica hipótesis como hechos. No promete una hora de recuperación sin sustento. Se indica próxima revisión cuando esté acordada.

El análisis de obligaciones de notificación depende de datos, contrato y jurisdicción. Se deriva al responsable competente; este manual no inventa plazos legales ni certifica cumplimiento. Preparar un borrador no equivale a enviarlo: la transmisión externa requiere autorización aplicable y destinatarios verificados.

El cierre incluye servicios recuperados, exposición evaluada, evidencia preservada, contenciones pendientes y tareas abiertas. Un incidente puede cerrarse operativamente con investigación adicional en curso si ese alcance se explica. No se declara «sin filtración» solo por falta de una alerta; se informa qué se revisó y qué quedó sin visibilidad.

## 15. Postmortem, auditabilidad y ejercicios

El postmortem registra impacto, cronología, causa respaldada, factores contribuyentes, detección, respuesta, recuperación y acciones. Evita culpar sin análisis. Cada acción preventiva tiene propietario, plazo, prioridad y prueba de terminación; «mejorar seguridad» no es una tarea verificable.

El ledger conserva quién decidió, qué cambió, por qué, con qué autorización y resultado. Rollbacks también son eventos. Configuraciones temporales pendientes se revisan hasta retirarlas o convertirlas en políticas permanentes mediante cambio explícito. La lección se incorpora a pruebas y runbooks, no se duplica indiscriminadamente en documentos.

Los ejercicios usan datos sintéticos y entornos autorizados. Se ensayan pérdida del controlador, alerta duplicada, fallo del colector, falso positivo, token revocado, restauración y kill switch. Se mide tiempo observado y se declara qué no se probó. Una sesión de mesa valida decisiones; no acredita automáticamente que un firewall o backup funcione.

## 16. Referencias y puerta de operación

Las referencias primarias enlazadas de Cloudflare y OWASP se consultaron el **2026-10-03**. Respaldan controles concretos; los contratos, roles, modos y valores ilustrativos son diseño operativo de EOS. Antes de implementar se comprueba disponibilidad del proveedor y comportamiento del stack elegido.

Este manual está listo para adaptación cuando el proyecto complete dueños, permisos, contactos restringidos, inventario, alcance de automatización, evidencias de restauración y pruebas. Hasta entonces se presenta como runbook diseñado. Ninguna firma documental equivale a certificación de seguridad o firma criptográfica.

Referencias principales para el operador, consulta **2026-10-03**:

- [Cloudflare: Proactive DDoS defense](https://developers.cloudflare.com/ddos-protection/best-practices/proactive-defense/).
- [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
- [OWASP: Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html).
- [OWASP: LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
