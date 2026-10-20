---
name: eos-privacy-review
description: Evaluar jurisdicción, flujos de datos, cookies, proveedores y documentos legales con decisiones justificadas y pruebas negativas; sin certificar cumplimiento.
---

# EOS Privacy Review

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Cuándo usar

Cuando cambian formularios, almacenamiento, telemetría, publicidad, SDK, IA externa, proveedores, región, usuarios objetivo o una aplicación web/desktop trata datos personales. También ante una petición de política, consentimiento o revisión legal. No activa tratamientos ni publica políticas por sí misma.

## Entradas y carga mínima

1. Lee [EOS-CORE](../../EOS-CORE.md) y ejecuta `node scripts/eos.mjs context "privacidad cookies jurisdicción proveedores" --mode ADOPT --list` (usa AUDIT para revisión sin cambios).
2. Consulta [procedimiento operativo](../../docs/manuals/COMPLIANCE-IP-PRODUCT.md#16-procedimiento-operativo-de-privacidad-cookies-y-documentos) y, solo si Perú es pertinente, [registro Perú](../../docs/reference/PRIVACY-PERU-REGISTRY.md).
3. Identifica versión/entorno, responsable, personas y países, finalidades, permisos, repositorios, terceros, contratos y muestras sintéticas disponibles. Pregunta únicamente vacíos materiales; no inventes identidad del responsable ni contacto ARCO.

## Ejecución

1. Reconstruye captura → proceso → destinatario → retención → eliminación desde código, configuración y runtime autorizado. Incluye hosting, CDN, fuentes externas, logs, embeddings, backups, actualizaciones y reportes de fallos. Registra cada flujo en [DATA-FLOW-REGISTER](../../templates/DATA-FLOW-REGISTER.md).
2. Clasifica dato e identificabilidad, titular/responsable/encargado, país y finalidad. Selecciona jurisdicciones por hechos territoriales; Perú y GDPR no son universales. Para terminales UE, analiza también ePrivacy y su implementación nacional, aunque no haya dato personal GDPR.
3. Llena [PRIVACY-ASSESSMENT](../../templates/PRIVACY-ASSESSMENT.md): fuente/artículo/versiones/transitorios, base o excepción propuesta, necesidad de aviso, consentimiento, derechos, retención e incidentes. Una base UE no se importa automáticamente al régimen peruano.
4. Resuelve [COOKIE-DECISION](../../templates/COOKIE-DECISION.md): `NO_COOKIE_BANNER`, `NOTICE_ONLY`, `CONSENT_MANAGER_REQUIRED` o `LEGAL_REVIEW_REQUIRED`. Incertidumbre sobre un rastreador opcional deja ese rastreador OFF; no bloquea sin razón la función esencial.
5. Registra encargado, subencargado, accesos remotos y garantías propuestas en [PROCESSOR-AND-TRANSFER-REGISTER](../../templates/PROCESSOR-AND-TRANSFER-REGISTER.md). Un cambio de modelo/proveedor IA exige revisar país, uso para entrenamiento y retención antes de enviar datos.
6. Selecciona documentos en [LEGAL-DOCUMENT-CHECKLIST](../../templates/LEGAL-DOCUMENT-CHECKLIST.md); parametriza borradores originales desde operación comprobada. Marca interpretación o texto vinculante `LEGAL_REVIEW_REQUIRED`. No copia cláusulas ajenas ni convierte un borrador en contrato vigente.
7. Define y, si está autorizado, ejecuta pruebas con datos sintéticos: arranque limpio, rechazo, aceptación por finalidad, retiro, recarga/navegación, fallo CMP, cambio de versión, solicitudes ARCO, supresión/backup y fallos de proveedor. Captura destinos y almacenamiento sin tokens ni personas reales.
8. Asigna acciones, dueño, plazo derivado de fuente y criterio de cierre. Entrega bloque `eos-result`; evidencia ausente queda `NOT_RUN`, no PASS.

## Contrato de salida

Devuelve decisiones por flujo, fuente y fecha; estado de evidencia separado de aplicabilidad; documentos propuestos; pruebas y límites; preguntas exactas para revisión competente. Para una revisión pequeña completa solo registros pertinentes; `NOT_APPLICABLE` siempre requiere razón. Vincula artefactos existentes antes de duplicarlos.

## Límites y reapertura

No consentimientos universales, banners decorativos, certificaciones, DNI en evidencias, envío a modelos ni publicación/inscripción/notificación sin alcance autorizado. Reabre evaluación ante cambio de finalidad, SDK, proveedor, jurisdicción, población, incidente, norma o contrato. Un permiso OS no equivale automáticamente a consentimiento legal y aceptar términos no autoriza marketing.
