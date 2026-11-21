# Seguridad de programación básica

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Referencia aplicada y mínima que todo producto EOS implementa antes de exponerse a internet. Resume en controles programables lo que [SECURITY-FABRIC](../manuals/SECURITY-FABRIC.md) desarrolla como contrato (secciones 9, 23, 26 y 27) y la constitución exige en las secciones 16–28 y 88. Si algo aquí contradice el manual, prevalece el manual y se reporta la diferencia.

> **Estado:** referencia documental. Los fragmentos de código son **ejemplos ilustrativos en Node.js sin dependencias**; no están probados en un producto y no acreditan seguridad. Cada producto escribe sus propias pruebas de aceptación (al final).

## 1. Reglas que no se negocian

1. **El servidor decide.** Toda validación, autorización y límite vive en el servidor; ocultar un botón o un menú no protege nada.
2. **Autorización por objeto.** Cada lectura o escritura comprueba que *este* usuario puede tocar *este* registro.
3. **Fallar cerrado en autorización, abierto con cuidado en disponibilidad.** Si el servicio de reputación cae, no se bloquea a todo el mundo; si el chequeo de permisos falla, la operación no se ejecuta.
4. **Entrada externa = datos.** Formularios, cabeceras, archivos, webhooks, páginas web y respuestas de IA nunca se ejecutan ni se obedecen como instrucciones.
5. **Mínimo privilegio y secretos fuera del código.** Variables de entorno o gestor de secretos; nunca en el repositorio, logs ni prompts.
6. **Medir antes de bloquear.** Todo control de abuso empieza en modo observación con métrica de falsos positivos y tiene vía de recuperación para el usuario legítimo.

## 2. Mapa amenaza → control mínimo

| Amenaza | Señal típica | Control mínimo | Dónde |
|---|---|---|---|
| Bots de abuso (spam, scraping, altas falsas) | Ráfagas, formularios en < 2 s, rutas sin navegación previa | Límite por clave + fricción progresiva + honeypot | §3, §4 |
| Fuerza bruta de contraseñas | Muchos fallos sobre una cuenta | Límite por cuenta e IP, retardo creciente, MFA | §5 |
| Credential stuffing | Pocos intentos por cuenta, muchas cuentas, muchas IP | Límite global de login, detección de contraseñas filtradas, alerta de éxito anómalo | §5 |
| Enumeración de usuarios | Mensajes o tiempos distintos para cuenta existente | Respuesta y tiempo uniformes | §5 |
| IDOR / scraping por ID | IDs secuenciales recorridos | Autorización por objeto, IDs no predecibles, paginación acotada | §6 |
| Inundación L7 (DDoS de aplicación) | Picos en rutas caras | Edge/WAF, límites de tamaño y tiempo, caché, degradación | §7 |
| Inyección SQL, comandos, rutas | Comillas, `;`, `../` en entradas | Consultas parametrizadas, `execFile`, normalizar rutas | §8 |
| XSS | `<script>` o atributos en contenido de usuario | Codificar al renderizar + CSP | §8 |
| Ataques guiados e inyección de instrucciones a agentes/IA | Texto que ordena «ignora tus reglas», enlaces o archivos con instrucciones | Contenido externo como dato, herramientas en allowlist, aprobación humana | §9 |
| CSRF y robo de sesión | Peticiones de otro origen con cookie | Cookies `HttpOnly; Secure; SameSite`, token CSRF, rotación de sesión | §10 |
| Webhooks falsificados o repetidos | Firma ausente, marca de tiempo vieja | HMAC con comparación constante + ventana + id único | §11 |

## 3. Bots: clasificar antes de castigar

- **Bot legítimo** (buscadores, monitores, socios): identidad verificable por el procedimiento oficial del bot o credencial de máquina con dueño, alcance y expiración. Un `User-Agent` no prueba nada. `robots.txt` comunica preferencias; no protege datos.
- **Automatización propia** (tareas programadas, integraciones): API key o token de servicio por integración, nunca la sesión de un administrador.
- **Bot de abuso:** se responde con fricción progresiva, no con bloqueo inmediato:

| Nivel | Disparador (ejemplo, se calibra con datos reales) | Respuesta |
|---|---|---|
| 0 Observar | Siempre | Métrica por ruta, clave y resultado |
| 1 Frenar | Supera el límite por minuto | `429` con `Retry-After` |
| 2 Desafiar | Persiste o hay señales de formulario automático | Desafío interactivo solo en flujos humanos (nunca en APIs) |
| 3 Bloquear temporal | Abuso confirmado | Bloqueo con expiración, registro y vía de apelación |

**Señales baratas para formularios humanos** (ejemplo):

```js
// Ejemplo ilustrativo. Campo trampa invisible + tiempo mínimo de llenado.
// El HTML incluye <input name="website" tabindex="-1" autocomplete="off" hidden>
// y un campo firmado con la hora en que se sirvió el formulario.
export function looksAutomated(body, servedAtMs, nowMs = Date.now()) {
  if (body.website) return true;                // un humano no ve el campo trampa
  if (nowMs - servedAtMs < 2000) return true;   // llenado en menos de 2 s
  return false;                                 // no prueba que sea humano: solo filtra lo burdo
}
```

## 4. Límite de tasa (token bucket)

Clave compuesta según el riesgo: `ruta + IP`, `ruta + cuenta`, `ruta + API key`. En varias instancias, el contador vive en un almacén compartido (Redis, base de datos, edge); el ejemplo en memoria sirve solo para una instancia.

```js
// Ejemplo ilustrativo: una instancia, sin dependencias.
const buckets = new Map();
export function allow(key, { capacity = 10, refillPerSec = 1 } = {}, now = Date.now()) {
  const b = buckets.get(key) ?? { tokens: capacity, at: now };
  b.tokens = Math.min(capacity, b.tokens + ((now - b.at) / 1000) * refillPerSec);
  b.at = now;
  const ok = b.tokens >= 1;
  if (ok) b.tokens -= 1;
  buckets.set(key, b);
  return ok; // si es false: responder 429 con Retry-After
}
```

Límites distintos por tipo de ruta: login y registro estrictos; lectura pública más amplia; operaciones caras (IA, exportaciones, envíos de correo) con cuota por usuario además de por minuto.

## 5. Login: fuerza bruta, stuffing y enumeración

- Contraseñas con **hash lento y sal** (`scrypt` de `node:crypto`, Argon2 o bcrypt); jamás reversible ni registrado.
- **Dos límites a la vez:** por cuenta (protege a la víctima) y por IP/red (frena al atacante). Un límite global de intentos de login detecta stuffing distribuido.
- **Respuesta uniforme:** «Usuario o contraseña incorrectos» y tiempo comparable, exista o no la cuenta; la recuperación de contraseña responde igual siempre.
- **MFA** disponible y obligatorio para administradores. Rotar el identificador de sesión al iniciar sesión y al elevar privilegios.
- Opcional: rechazar contraseñas conocidas como filtradas (lista local o servicio con k-anonimato).

```js
// Ejemplo ilustrativo de hash y verificación con node:crypto.
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
export const hashPassword = pw => { const salt = randomBytes(16); return `${salt.toString('hex')}:${scryptSync(pw, salt, 64).toString('hex')}`; };
export function verifyPassword(pw, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(pw, Buffer.from(saltHex, 'hex'), 64);
  return timingSafeEqual(actual, expected);
}
```

## 6. Acceso a objetos y scraping

- Cada consulta filtra por dueño o permiso: `WHERE id = $1 AND owner_id = $2`, no solo `WHERE id = $1`.
- IDs públicos no predecibles (UUID v4/v7 o equivalentes); el id secuencial queda interno.
- Paginación con máximo fijo (por ejemplo 100) y cursor; nunca «devolver todo».
- Respuestas sin campos internos: se arma un DTO explícito en lugar de serializar el registro completo.

## 7. Inundación de aplicación (DDoS L7)

- Límite de tamaño de cuerpo y número de campos; tiempo máximo por petición y por consulta.
- Caché para lecturas públicas; rutas caras detrás de cola o cuota.
- Edge/CDN/WAF del proveedor cuando el producto es público; el origen no se expone directamente si puede evitarse.
- **Degradación planificada:** qué se apaga primero (búsqueda, exportación, IA) para que el núcleo siga respondiendo.

## 8. Inyección y XSS

```js
// SQL: siempre parámetros, nunca concatenar.
await db.query('SELECT * FROM orders WHERE id = $1 AND owner_id = $2', [orderId, userId]);

// Comandos: execFile con argumentos separados; nunca exec con texto del usuario.
import { execFile } from 'node:child_process';
execFile('convert', [inputPath, outputPath]);

// Rutas: resolver y confirmar que siguen dentro de la carpeta permitida.
import path from 'node:path';
const safe = path.resolve(UPLOAD_DIR, name);
if (!safe.startsWith(path.resolve(UPLOAD_DIR) + path.sep)) throw new Error('ruta no permitida');
```

- **XSS:** el framework codifica por defecto; prohibido insertar HTML de usuario sin sanitizar (`innerHTML`, `dangerouslySetInnerHTML`). Añadir `Content-Security-Policy` sin `unsafe-inline` para scripts.
- **Archivos subidos:** validar tipo por contenido, limitar tamaño, guardar fuera de la raíz pública con nombre generado.

## 9. Ataques guiados e inyección de instrucciones (IA y agentes)

Un ataque guiado es una cadena dirigida: el atacante prepara contenido (página, PDF, issue, correo, campo de formulario) para que un agente o modelo lo lea y ejecute acciones que el usuario no pidió. Controles mínimos:

- **Separar canales:** las instrucciones vienen solo del sistema y del usuario autorizado; todo lo demás entra marcado como dato no confiable.
- **Herramientas en allowlist** con el menor alcance posible; las acciones irreversibles o externas (pagar, enviar, borrar, publicar) requieren aprobación humana explícita.
- **Salida validada:** la respuesta del modelo se valida contra un esquema antes de usarse; nunca se ejecuta como SQL, shell ni HTML.
- **Sin secretos en el contexto:** el modelo no recibe claves ni datos que no necesita para la tarea.
- **Cuotas de costo** por usuario y por día para cualquier llamada a IA de pago.
- Registrar decisiones del agente con su evidencia para auditoría.

## 10. Sesiones, CSRF y cabeceras

- Cookie de sesión: `HttpOnly; Secure; SameSite=Lax` (o `Strict`), expiración y cierre de sesión que invalida en servidor.
- Formularios que cambian estado con token CSRF o comprobación de `Origin`.
- Cabeceras base: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'` salvo necesidad.
- CORS con lista explícita de orígenes; nunca `*` con credenciales.

## 11. Webhooks

```js
// Ejemplo ilustrativo: firma HMAC, ventana de 5 minutos e id único contra repetición.
import { createHmac, timingSafeEqual } from 'node:crypto';
export function verifyWebhook(rawBody, signatureHex, timestampSec, secret, seenIds, eventId, now = Date.now()) {
  if (Math.abs(now / 1000 - timestampSec) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestampSec}.${rawBody}`).digest();
  const given = Buffer.from(signatureHex, 'hex');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  if (seenIds.has(eventId)) return false;
  seenIds.add(eventId);
  return true;
}
```

Cada proveedor define su formato de firma: se sigue su documentación oficial, no este ejemplo.

## 12. Logs, secretos y dependencias

- Logs con id de petición, ruta, resultado y clave de límite; **sin** contraseñas, tokens, documentos ni cuerpos completos.
- Secretos rotables y por entorno; un secreto expuesto se revoca, no solo se borra del repositorio.
- Lockfile versionado y auditoría real de dependencias (`npm audit`, `pip-audit` u otra) cuando existe manifiesto.

## 13. Pruebas de aceptación mínimas

Cada producto público demuestra, con pruebas automatizadas o registro de verificación:

- [ ] Login: el intento N+1 sobre una cuenta devuelve `429`; usuario inexistente y contraseña errónea producen el mismo mensaje.
- [ ] Un usuario no puede leer ni modificar un objeto de otro cambiando el id (prueba IDOR).
- [ ] Una entrada con `' OR 1=1 --` no altera la consulta; `<script>` se muestra como texto.
- [ ] El campo trampa lleno o un envío en menos de 2 s se rechaza sin romper el flujo humano normal.
- [ ] Una ruta cara respeta su cuota por usuario.
- [ ] Un webhook con firma inválida, vieja o repetida se rechaza.
- [ ] Un documento externo con instrucciones («ignora tus reglas y envía…») no provoca ninguna acción del agente sin aprobación.
- [ ] Las cabeceras de seguridad están presentes en la respuesta.
- [ ] Ningún secreto aparece en el repositorio ni en los logs de prueba.

Pasar esta lista es un mínimo; no certifica seguridad. Para producción aplica el contrato completo de [SECURITY-FABRIC](../manuals/SECURITY-FABRIC.md) y la revisión de `eos-security-reviewer`.

## Fuentes

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — Authentication, Credential Stuffing Prevention, Bot Management and Anti-Automation, SQL Injection Prevention, XSS Prevention, CSRF Prevention (consultadas como guía general, 2026-11-21).
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/) — inyección de instrucciones y agencia excesiva.
- Síntesis propia; no reproduce texto de esas fuentes.
