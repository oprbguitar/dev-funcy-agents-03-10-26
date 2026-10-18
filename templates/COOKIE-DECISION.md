# COOKIE-DECISION — tecnologías de seguimiento y preferencias

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

- ID / proyecto / commit / entorno / fecha / evaluador:
- Jurisdicción y criterio territorial probado:
- Fuentes oficiales, artículos, versión, vigencia y revisión competente:
- Recorrido probado: arranque limpio, páginas, login, rechazar, aceptar por finalidad, retirar, recargar.

## Inventario observado

| Elemento y origen | Cookie/storage/SDK/pixel/iframe/red | Proveedor y país | Finalidad y necesidad demostrada | Datos/identificadores | Duración | Se inicia cuándo | Evidencia |
|---|---|---|---|---|---|---|---|
| PENDING | | | | | | | |

Incluye carga indirecta por tag manager, fuentes, embeds, service worker y servidor; revisa logs/CDN aunque la página no use cookies. En desktop revisa telemetría, crash reporting, sincronización, permisos OS, updates y SDK: no presupongas cookies web.

## Decisión justificada

Selecciona una, con razón y límites:

- `NO_COOKIE_BANNER`: inventario y runtime no encuentran tecnología que requiera esa interfaz bajo los regímenes aplicables. Evaluar avisos por otros tratamientos por separado.
- `NOTICE_ONLY`: elementos descritos y base/excepción verificada no requieren gestor para ese alcance; informar sigue siendo decisión distinta.
- `CONSENT_MANAGER_REQUIRED`: finalidad/tecnología y regla concreta requieren elección previa. Opcionales OFF hasta decisión válida.
- `LEGAL_REVIEW_REQUIRED`: fuente, necesidad, identificabilidad o jurisdicción sin resolver; opcionales afectados OFF mientras se decide.

## Contrato de preferencias cuando aplica

Categorías: `strictly_necessary`, `preferences`, `analytics`, `marketing`, `other`, descritas por proveedor/finalidad/duración. Estados por finalidad: `unknown | granted | denied | partially_granted | withdrawn | expired`. No casillas opcionales premarcadas; no consentimiento por scroll; rechazo y retiro comprensibles; essential no sirve para esconder marketing.

Registro mínimo: versión de regla/aviso, finalidad, decisión, fecha, UI de origen y evidencia. Retención y acceso definidos; no guardar IP ni identidad salvo necesidad justificada. Cambio material de finalidad/proveedor reabre evaluación; no reinicia todos los consentimientos por rutina.

| Prueba negativa | Esperado | Resultado/evidencia |
|---|---|---|
| Antes de decidir / `marketing=unknown` | Sin pixel, iframe o SDK opcional afectado | NOT_RUN |
| `analytics=denied`, incluida navegación/recarga | Cero solicitudes al proveedor afectado | NOT_RUN |
| Retirar decisión | Detener nuevas capturas; proceso separado para datos ya enviados | NOT_RUN |
| Error de CMP o storage | Opcionales OFF, función esencial disponible | NOT_RUN |
| Finalidad nueva / aviso incompatible | Evaluación previa a activación | NOT_RUN |
| Teclado, lector, móvil y reapertura | Elección accesible y modificable | NOT_RUN |

- Responsable / pendientes / riesgo residual / próxima revisión:
- Aprobación técnica acotada y revisión legal: `PENDING`.
