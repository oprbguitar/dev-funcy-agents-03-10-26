# Security Fabric: defensa permanente, proporcional y comprobable

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
**Edición:** 2026-10-03 · **Idioma:** español de Perú · **Naturaleza:** manual normativo y criterios de implementación.

Este manual desarrolla [la constitución maestra](../../EOS_MASTER_SYSTEM_INSTRUCTION.md), secciones 15–28, 40, 42, 60–61 y 64. Su fuente conversacional es **SRC-01**, «EOS — Security Fabric & Active Defense», bloques históricos 154–222. Esos números identifican la conversación; las referencias normativas vigentes corresponden a la constitución. Las decisiones operativas y recuperaciones se completan en [Incident Response](INCIDENT-RESPONSE.md).

**Estado verificable:** este repositorio documenta capacidades y contratos. La presencia de este archivo no instala un WAF, un SIEM, un antivirus, un gateway, MFA ni controles de red. Cada proyecto debe demostrar qué controles existen, dónde se ejecutan y qué prueba acredita su funcionamiento. «Diseñado», «configurado», «verificado» y «pendiente» son estados distintos.

## 1. Mi instrucción de seguridad

Quiero que mis sistemas puedan crecer sin descubrir demasiado tarde que carecían de defensa. La seguridad deberá acompañar al diseño, la operación y la recuperación. Exijo medidas proporcionadas: un sitio estático y un ERP con datos sensibles tienen exposiciones distintas; ambos necesitan responsables, inventario, controles comprobables y una respuesta preparada.

El orquestador inicia con exposición, criticidad, usuarios, datos y proveedores. Entrega una matriz de riesgos y controles. No compra herramientas por apariencia, no declara protección absoluta y no interpreta una anomalía como culpabilidad. Cada defensa deberá explicar qué protege, qué no cubre, qué usuarios puede afectar y cómo se revierte.

Los controles nuevos entran mediante cambios revisables. Las excepciones tendrán responsable, motivo, compensación, vencimiento y prueba de cierre. Un bloqueo fallido no justifica desactivar autenticación. Un presupuesto pequeño exige priorización y transparencia, nunca afirmaciones de seguridad sin evidencia.

## 2. Contrato de entrada y salida

La entrada mínima contiene Project Profile, dominios y puertos, endpoints, proveedores, clases de datos, autenticación, sesiones, integraciones, agentes, capacidad y presupuesto. Se incorporan flujos administrativos, cargas de archivos, tareas programadas y dependencias de construcción. Si falta un dato, se registra como desconocido y se asigna una tarea de verificación.

La salida obligatoria contiene:

| Entregable | Contenido comprobable |
|---|---|
| Inventario de exposición | Activo, propietario, ambiente, acceso, dependencia y fecha de revisión |
| Modelo de amenazas | Actor, superficie, abuso, impacto y control propuesto |
| Matriz de controles | Estado, implementación, evidencia, limitación y responsable |
| Política de decisión | Señal, umbral, acción permitida, TTL y reversión |
| Plan de validación | Casos positivos, negativos, abuso y falsos positivos |
| Registro de excepciones | Alcance, autorización, compensación y vencimiento |

La aceptación exige demostrar un flujo legítimo y uno rechazado por cada frontera importante. No basta una captura de configuración: se prueba el comportamiento real, con datos sintéticos y carga autorizada. El operador registra versión, ambiente y fecha; una prueba en staging no acredita producción.

## 3. Capas y responsabilidades

El borde absorbe y filtra tráfico; el gateway valida rutas y cuotas; identidad reconoce al actor; autorización decide qué objeto puede usar; aplicación valida operaciones; almacenamiento protege información; runtime limita ejecución; auditoría conserva evidencia. Cada capa tiene un dueño y una condición de fallo conocida.

La secuencia conceptual es `Internet → edge → gateway → identidad → autorización → aplicación → datos → auditoría`. No obliga a crear ocho servicios separados. Un producto pequeño puede reunir funciones manteniendo las fronteras lógicas y pruebas independientes.

La revisión comienza por recorridos: usuario anónimo, usuario autenticado, administrador, bot, webhook y agente. Para cada recorrido se determina dónde se valida, qué credencial existe, cuál es el límite y qué ocurre cuando una dependencia falla. Un error del proveedor de reputación no convierte automáticamente a todos los visitantes en atacantes. Un error de autorización sí debe impedir la operación protegida.

## 4. DDoS y protección del origen

Un ataque volumétrico que satura el enlace requiere mitigación aguas arriba. La aplicación puede limitar trabajo, pero no recuperar ancho de banda ya consumido. La estrategia define cobertura L3/L4/L7, servicios y protocolos incluidos, escalamiento con el proveedor y restricciones del plan contratado. Cloudflare documenta protección del origen y reducción de presión mediante caché como componentes de defensa. [Referencia primaria](https://developers.cloudflare.com/ddos-protection/best-practices/proactive-defense/).

El origen acepta únicamente rutas previstas: túnel, red privada, identidad de servicio o conexiones de edge verificadas. Ocultar una IP mediante DNS proxied no reemplaza controles de acceso. El operador comprueba dominios alternos, registros históricos, puertos de administración y servicios que pudieran ofrecer otra entrada.

El runbook separa caché pública y datos personalizados. Cambiar claves de caché exige comprobar parámetros funcionales, cookies, autorización y aislamiento entre usuarios. No se elimina indiscriminadamente el query string. El autoscaling conserva un techo de gasto; se amplía capacidad para demanda válida después de filtrar abuso, evitando convertir consumo hostil en facturación ilimitada.

**Aceptación:** una conexión directa no autorizada al origen falla; la ruta legítima funciona; el acceso administrativo conserva un camino independiente; el control tiene rollback; una respuesta privada nunca se entrega desde una caché compartida a otra cuenta.

## 5. Popularidad, anomalía y ataque

La línea base registra volumen por ruta, latencia, errores, conexiones, consumo, aciertos de caché y operaciones terminadas. Se segmenta por horario y eventos conocidos. El baseline tiene período observado y limitaciones; siete días sin campañas no describen necesariamente un lanzamiento anual.

Un pico aislado dispara observación. Una campaña documentada, referencias esperadas y conversiones saludables favorecen la hipótesis de demanda legítima. Solicitudes repetidas costosas, errores y agotamiento junto con señales independientes favorecen abuso. País, ASN, VPN o User-Agent aportan contexto, nunca identidad ni condena automática.

El detector entrega hechos y alternativas: qué aumentó, respecto de qué período, qué servicio degradó y qué evidencia falta. La política determina la acción; una explicación generada por IA no ejecuta bloqueos por sí sola. Durante una campaña se permite una excepción limitada a rutas y período, manteniendo protección de administración y operaciones sensibles.

**Pruebas:** reproducir una campaña sintética con usuarios válidos y una secuencia abusiva acotada; verificar clasificación, presupuesto y disponibilidad. Si ambas reciben el mismo castigo, ajustar señales antes de enforcement. Las pruebas de carga sobre terceros necesitan autorización específica.

## 6. Cadena de proxies confiables

La fuente inicial es el peer observado por el transporte. Se aceptan cabeceras de origen únicamente cuando ese peer pertenece a la infraestructura configurada y el ingreso impide caminos alternos. `X-Forwarded-For`, `Forwarded` y `CF-Connecting-IP` enviados arbitrariamente por un cliente son datos no confiables. Cloudflare describe diferencias entre sus cabeceras y cómo una cadena puede contener valores anteriores. [Referencia primaria](https://developers.cloudflare.com/fundamentals/reference/http-headers/).

El propietario documenta topología, rangos o identidades confiables, quién elimina cabeceras entrantes y quién escribe el valor canónico. Cada salto se valida. Para cadenas genéricas se recorre desde el extremo próximo y se deja de confiar al encontrar un salto no autorizado; no se elige ciegamente el primer valor. Un número fijo de saltos solo es válido si todas las rutas lo garantizan.

Registrar `transport_peer`, `trusted_proxy_chain` y `client_source_ref` distingue observación de atribución. CIDR, IPv6 y parsers se prueban explícitamente. Una actualización de rangos tiene revisión y rollback.

**Aceptación:** falsificar cabeceras desde un cliente directo no cambia su cuota; una cadena truncada, duplicada o malformada no obtiene confianza; una ruta alternativa no permite suplantación; los proxys legítimos conservan atribución y no comparten accidentalmente un único bucket global.

## 7. Identidad humana, recuperación y sesiones

Administración y cambios sensibles requieren MFA según el perfil. Se prefieren opciones resistentes a phishing cuando sean viables. La recuperación no será un atajo más débil que el acceso: debe contar con validación, expiración, uso único y auditoría. OWASP trata throttling, respuestas que evitan enumeración y factores adicionales como controles complementarios. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

La aplicación demuestra regeneración de sesión al autenticar y cambiar privilegios, expiración por inactividad y absoluta, cierre y revocación. Cookies se ajustan al contexto con `Secure`, `HttpOnly`, `SameSite`, alcance de dominio y ruta. SameSite no reemplaza toda defensa CSRF. HSTS requiere confirmar previamente HTTPS y los subdominios afectados. [Referencia primaria sobre ciclo de sesión](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

Cambiar de red móvil o usar VPN no obliga por sí solo a cerrar sesiones. El step-up combina señales y conserva recuperación accesible. Para tokens autocontenidos se explicita cómo se cumple revocación: duración acotada, versión de credenciales, lista de rechazo u otro mecanismo probado. Decir «logout» mientras el token sigue funcionando no satisface el requisito.

## 8. Login: dos límites independientes

La política conserva un bucket por cuenta y otro por fuente verificada. Una solicitud pasa solo si ambos permiten el intento. Un contador exclusivo `IP + usuario` no cubre una cuenta atacada desde múltiples fuentes ni una fuente que prueba muchas cuentas. OWASP explicita esa separación. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html).

Se normaliza el identificador conforme a reglas del producto y se evita exponerlo en claves visibles. La operación del contador es atómica; réplicas concurrentes no deben multiplicar el límite. Se limita cardinalidad, duración y costo del almacenamiento. Identificadores inexistentes reciben tratamiento comparable, evitando enumeración.

La respuesta es progresiva: demora acotada, challenge compatible, reautenticación o restricción temporal. No se bloquea indefinidamente a una víctima por errores provocados. El éxito no borra necesariamente todo historial de abuso. Si el almacén de cuotas falla, se aplica una política documentada por riesgo y se alerta; no se elimina silenciosamente el control.

**Aceptación:** muchas fuentes contra una cuenta alcanzan su bucket; una fuente contra cuentas distintas alcanza el suyo; un cliente legítimo detrás de NAT conserva un camino razonable; recuperación no permite repetir ataques sin límite.

## 9. Bots, cuotas y costo de operación

Un User-Agent no acredita un bot. Internos y socios usan identidades de máquina con dueño, alcance, expiración y revocación. Un bot verificado recibe permiso para acciones concretas, no acceso universal. Los webhooks validan firma, antigüedad y repetición según su protocolo; los secretos nunca aparecen en ejemplos operativos.

Cada endpoint tiene límite por identidad y costo. Buscar, exportar, procesar archivos o invocar modelos consume recursos diferentes. La cuota combina frecuencia, concurrencia, tamaño y duración; una sola solicitud puede agotar capacidad aunque el conteo por minuto sea bajo. La implementación reserva capacidad antes del trabajo y libera reservas al fallar, sin regalar reintentos ilimitados.

Los clientes de API reciben un rechazo documentado, idempotencia cuando corresponda y orientación de reintento. Un challenge HTML no se inserta indiscriminadamente en una integración automática. Los reintentos usan espera y límite total para evitar tormentas.

Las cifras siguientes son **ejemplos de diseño**, no ajustes listos para producción:

```yaml
example_only: true
login:
  account_attempts: 8
  source_attempts: 30
  observation_seconds: 300
  temporary_restriction_seconds: 120
export:
  concurrent_jobs_per_actor: 1
  maximum_rows: 10000
agent:
  maximum_task_seconds: 900
  external_network_default: denied
```

Se calibran con carga, SLA, accesibilidad y presupuesto. Los límites no afirman una eficacia universal.

## 10. Autorización y entradas de aplicación

Toda operación comprueba permisos sobre el recurso solicitado y el tenant real. Estar autenticado no autoriza a leer cualquier ID. Los filtros del frontend no constituyen control. Las consultas usan parámetros; comandos y rutas no se construyen concatenando entrada externa. Los esquemas validan formato, longitud, rango y combinaciones válidas.

Los mensajes externos explican el fallo sin filtrar stack traces, SQL, secretos o la existencia de cuentas. Internamente se conserva una referencia de diagnóstico sanitizada. El manejo de errores incluye timeout, dependencia caída, solicitud duplicada y autorización revocada durante la operación.

**Aceptación:** intercambiar identificadores entre dos cuentas sintéticas no cruza datos; cambiar tenant en una solicitud falla; privilegios retirados se aplican; un webhook repetido no duplica efectos; un campo imprevisto no altera autorización. Las pruebas cubren lectura y escritura porque proteger una pantalla no protege su API.

## 11. Archivos y aislamiento

La carga autoriza usuario y destino antes de recibir contenido. Extensión, MIME declarado, estructura, tamaño y contenido se contrastan; no se confía únicamente en el encabezado. OWASP recomienda controles combinados y almacenamiento aislado del webroot. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

El flujo define `received → quarantined → inspected → accepted/rejected`. El archivo no se publica ni procesa como confiable antes de completar controles requeridos. Los nombres internos son generados; el nombre original sanitizado se conserva solo cuando es necesario. Para archivos comprimidos se limita expansión, profundidad, número de entradas y tiempo. Un escáner caído produce cuarentena o rechazo según política, no una falsa etiqueta de «limpio».

El parser corre con permisos mínimos y límites; se prohíben macros y ejecución salvo necesidad expresa y aislamiento especializado. Antivirus reduce riesgo, no demuestra inocuidad absoluta. Descargas verifican autorización y usan cabeceras adecuadas.

**Aceptación:** archivo renombrado, ruta ascendente, nombre reservado de Windows, expansión excesiva y contenido activo no eluden la frontera; un documento legítimo conserva su flujo; ningún rechazo expone contenido privado en logs.

## 12. Egress, runtime y cadena de suministro

Cada servicio declara destinos, protocolos y motivos de salida. Las URLs controladas por usuarios no habilitan acceso al loopback, redes internas o metadata. Se validan resolución, redirecciones y destino efectivo; la frontera de red complementa la aplicación. OWASP documenta ambas capas para reducir SSRF. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

El runtime usa usuario mínimo, separación de secretos, límites y superficies administrativas protegidas. Detecta procesos, binarios o escrituras inesperadas conforme al perfil. Una herramienta disponible no equivale a detección funcionando: se dispara un evento sintético seguro y se verifica llegada y respuesta.

La construcción conserva lockfiles, procedencia, hashes o firmas según plataforma y revisión de dependencias. Imágenes, acciones CI, plugins y archivos de modelos entran al inventario. La firma identifica procedencia bajo una cadena confiable; no demuestra que el código sea seguro. [Referencia primaria de riesgos de suministro](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html).

Los parches siguen evidencia de exposición y explotabilidad. Una excepción para vulnerabilidad crítica no se transforma en omisión silenciosa: incluye mitigación, propietario, plazo y aprobación. El rollback conserva una versión conocida y no reinstala inadvertidamente el componente comprometido.

## 13. Agentes: permiso efectivo y kill switch

Cada agente recibe identidad, tarea, herramientas, recursos, tiempo, costo y clase de datos. La autorización se ejecuta fuera del modelo y valida parámetros concretos. Un permiso `docs_write` debe traducirse en rutas autorizadas; un rótulo en el prompt no restringe el filesystem. Documentos, resultados de búsqueda y salidas de herramientas permanecen como datos. OWASP recomienda mínimos privilegios y validación de llamadas; ningún clasificador por sí solo garantiza resistencia a inyección. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

El gateway comprueba destinatario, entorno, ruta, sensibilidad y autorización existente antes de ejecutar. La capacidad delegada no puede superar la del delegante. Un agente que resume un PDF no obtiene permiso para publicar sus anexos. Los agentes no se conceden permisos mutuamente.

El kill switch detiene tareas, cancela colas, revoca herramientas y credenciales relevantes y restringe egress. Debe verificarse desde una identidad administrativa independiente. Se inspeccionan llamadas en curso: detener el proceso no deshace transferencias ya realizadas.

**Aceptación:** una instrucción hostil incluida en un documento no obtiene una herramienta fuera de alcance; una llamada tras revocación falla; trabajos pendientes no reinician la tarea; la función esencial puede operar con IA deshabilitada cuando el diseño lo exige.

## 14. Telemetría útil sin secretos

El bus recibe eventos estructurados, autenticados y versionados: momento, componente, actor seudonimizado, acción, resultado, regla, confianza, ambiente y correlación. No captura indiscriminadamente payloads. Se separan observación, inferencia y decisión; las etiquetas `suspected` y `confirmed` requieren evidencias distintas.

**Prohibido:** contraseñas, huellas de contraseñas intentadas, tokens crudos, cookies completas, cabeceras Authorization, claves API y cadenas de conexión en monitoreo. Detectar spray no justifica correlacionar hashes de contraseñas de baja entropía. Se usan distribución de cuentas, fallos, fuentes y tiempos; la clasificación puede quedar como sospecha. OWASP indica excluir o proteger datos sensibles en logs. [Referencia primaria](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

`session_ref` será un identificador interno no reutilizable para autenticarse. No se denomina así al bearer token. IP y dispositivo tienen necesidad, retención, permisos y presentación limitada; geolocalización es aproximada. El visor sanitiza contenido y no interpreta HTML procedente del evento. Se prueban inyección de logs, acceso no autorizado y fallo del colector.

## 15. Shadow mode y puesta en servicio

En ADOPT se conservan controles existentes y se simulan los nuevos. Shadow significa que una regla candidata observa y calcula acciones, sin bloquear; no desactiva las defensas vigentes. Se mide tasa de desafío, rechazo, cobertura, soporte y usuarios afectados. Las muestras incluyen redes compartidas, dispositivos móviles, accesibilidad y automatizaciones autorizadas.

Cada regla entra por ruta y cohorte limitada. Una exención lleva identidad, propósito, período y revisión; nunca un comodín administrativo permanente. El operador verifica efectos secundarios y conserva la configuración anterior. Si se degradan flujos legítimos, revierte la regla candidata y mantiene observabilidad.

La salida de shadow requiere dueño, señales suficientes, umbrales revisados, rollback probado y evidencia de pruebas. «Cero falsos positivos» sin muestra representativa no acredita calidad. Los incidentes confirmados pueden usar contención preautorizada; el entrenamiento de una regla no concede permisos nuevos.

## 16. Puerta de aceptación y referencias

Antes de declarar el Security Fabric operativo se entregan inventario actualizado, controles por estado, pruebas, límites conocidos, credenciales administradas fuera de Git, alarmas recibidas y recuperación ensayada. Un operador distinto del implementador debe poder seguir el runbook. En ausencia de evidencia, el estado queda pendiente y la exposición se decide explícitamente.

Las referencias enlazadas son documentación primaria de **Cloudflare** y **OWASP Cheat Sheet Series**, consultadas el **2026-10-03**. Sustentan controles puntuales; el contrato, las cifras ilustrativas y las decisiones de operación son instrucciones propias de EOS. Su uso no acredita certificaciones, cumplimiento legal ni garantías de un proveedor. Antes de implementar, verificar API, cobertura y plan vigentes. La firma identifica autoría y dirección documental; no es una firma criptográfica ni una auditoría independiente.

Referencias principales para el implementador, consulta **2026-10-03**:

- [Cloudflare: Proactive DDoS defense](https://developers.cloudflare.com/ddos-protection/best-practices/proactive-defense/).
- [Cloudflare: HTTP headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/).
- [OWASP: Bot Management and Anti-Automation](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html).
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
- [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
- [OWASP: LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**
