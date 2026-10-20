# DESKTOP-RELEASE-CHECKLIST — entrega por plataforma

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

- Producto/versión/commit/canal/owner/fecha: PENDIENTE
- Modalidad offline/conectada/híbrida, SO/arquitectura probados: PENDIENTE
- Framework/formato/herramientas y versiones: PENDIENTE
- Artefacto/ruta/URL/tamaño/SHA-256/procedencia: PENDIENTE
- Firma de código y verificación autenticidad del updater (mecanismos distintos): PENDIENTE
- Requisitos mínimos medidos y entorno de medición: PENDIENTE
- Rutas de datos, permisos, cifrado/claves, backup y política de desinstalación: PENDIENTE
- SBOM/licencias/avisos; escaneo de secretos del paquete: PENDIENTE
- Autorización A3 destino/canal/acción: PENDIENTE

Repite esta tabla por cada SO/arquitectura prometida. Resultado permitido: `PASS | FAIL | NOT_RUN | NOT_APPLICABLE`. Cada check necesita comando/pasos, entorno, fecha y evidencia saneada. Razona exclusiones. Valores iniciales deliberadamente sin verificar.

| Prueba | Resultado inicial | Evidencia/limitación/owner |
|---|---|---|
| Instalación limpia y cuenta no administradora | NOT_RUN | PENDIENTE |
| Primer arranque, permisos y capacidades prometidas | NOT_RUN | PENDIENTE |
| Sin red, expiración de licencia y reconexión | NOT_RUN | PENDIENTE |
| Backup/exportación y restauración de datos | NOT_RUN | PENDIENTE |
| Actualización desde versión soportada y migración | NOT_RUN | PENDIENTE |
| Descarga corrupta/firma inválida: rechazar antes de activar | NOT_RUN | PENDIENTE |
| Red cortada/espacio insuficiente/proceso interrumpido | NOT_RUN | PENDIENTE |
| Recuperación/rollback o reparación forward-only compatible | NOT_RUN | PENDIENTE |
| Tráfico, crash reports y controles de telemetría | NOT_RUN | PENDIENTE |
| OAuth/TLS/proxy/sync/conflictos si conectado | NOT_RUN | PENDIENTE |
| Desinstalación con conservación/borrado explícitos | NOT_RUN | PENDIENTE |
| Descarga pública real, hash, firma y versión efectiva | NOT_RUN | PENDIENTE |

- Gate escritorio: NOT_RUN; gate web independiente: NOT_RUN
- Riesgos/bloqueos, soporte, notas de versión e instalación: PENDIENTE
- Recuperación probada, owner y criterio de parada: PENDIENTE

Sin producto escritorio usa `NOT_APPLICABLE` justificado; no conviertas esta plantilla en prueba del instalador. Un hash no sustituye una firma de editor y la firma editorial no es criptográfica.
