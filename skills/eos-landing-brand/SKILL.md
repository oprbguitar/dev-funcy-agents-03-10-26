---
name: eos-landing-brand
description: Resolver identidad, landing y captación según audiencia, distribución y evidencia, sin publicar ni instalar plantillas por inferencia.
---

# EOS LANDING & BRAND

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Activación y entradas

Lee [EOS-CORE](../../EOS-CORE.md) y conserva el modo INIT/ADOPT/AUDIT. Activa ante producto nuevo, cambio de identidad o presencia pública. Recibe perfil real, marca aprobada, público/mercado, canal, capacidades implementadas, autorización y presupuesto. En AUDIT entrega hallazgos y brief; no implementes cambios.

Evalúa siempre la landing. En producto web nuevo público o comercial empieza en `PLANNED` y produce por defecto brief y diseño/artefacto revisable dentro del alcance de construcción autorizado. Para herramienta interna, CLI, biblioteca o infraestructura registra `NOT_APPLICABLE` con razón; no publiques una superficie adicional. Escritorio comercial puede requerir sitio de descarga separado: propón alcance, no infieras hosting. Si el encargo es solo diagnóstico, conserva el blueprint como `PLANNED`.

## Flujo ejecutable por el agente

1. Inspecciona implementación, contenido y arquitectura de marcas existentes. Separa firma editorial EOS, marca matriz pública aprobada y marca de producto mediante [BRAND-BRIEF](../../templates/BRAND-BRIEF.md). Co-branding `off | subtle | visible`, inicialmente `off` hasta decisión del propietario. No publiques identidad del autor por inercia.
2. Deriva al menos tres direcciones estructurales del dominio, audiencia, densidad y flujo; registra elección y descartes en el documento de diseño canónico. Si el host exige un harness visual, ejecútalo antes de componer UI. No impongas framework, paleta ni tipografía universal.
3. Declara tokens semánticos y estados antes de pantallas; usa [BRAND-AND-COLOR-SYSTEM](../../docs/reference/BRAND-AND-COLOR-SYSTEM.md) y [ejemplo JSON](../../templates/DESIGN-TOKENS.example.json) como formato ilustrativo, nunca como conformidad ya probada.
4. Completa [LANDING-BRIEF](../../templates/LANDING-BRIEF.md): problema, destinatario, propuesta comprobable, CTA y recorrido hasta activación/soporte. Cada claim apunta a capacidad y evidencia. Solo muestra capturas, logos, testimonios y precios reales con permisos. Marca mockups como propuestos.
5. Elige arquitectura mínima compatible: página estática, integración en frontend o sitio separado justificado. Consulta [investigación de repositorios](../../docs/reference/LANDING-REPOSITORY-RESEARCH.md) antes de incorporar código; no clones ni añadas dependencias automáticamente.
6. Resuelve SEO técnico, metadatos, semántica, canonicals, indexación por entorno, rendimiento presupuestado y accesibilidad objetivo. Verifica formularios, éxito/error/abuso y minimiza campos. No prometas ranking ni conversión.
7. Evalúa datos, proveedores, cookies y almacenamiento antes de activar analytics, embeds, píxeles o experimentos. Una landing sin tratamiento que requiera consentimiento no recibe CMP ornamental. Un proveedor que dice ser cookieless sigue sujeto a evaluación de datos y tráfico real. Emplea [GROWTH-EXPERIMENT](../../templates/GROWTH-EXPERIMENT.md) cuando exista hipótesis comercial.
8. Ejecuta pruebas en el producto destino: 360/768/1280/1600 px, teclado/foco, estados hover/active/disabled/loading/selected, contraste efectivo, reducción de movimiento, enlaces, CTA y formularios. Inspecciona tráfico/almacenamiento en primera visita, aceptación, rechazo y revocación cuando procedan; documenta condiciones y resultado.

## Gates y salida

Entrega brief, tokens versionados, decisión de landing, matriz claim → evidencia y checks `PASS | FAIL | NOT_RUN | NOT_APPLICABLE`. Un archivo escrito no demuestra UI funcionando: sin producto/runtime las pruebas visuales, SEO remoto y red son `NOT_RUN`, con responsable y siguiente paso. Usa los estados de capacidad EOS: `PLANNED`, `IMPLEMENTED`, `VERIFIED`, `OPERATING`; no saltes por documentación.

Bloquea publicación por claims falsos, assets sin derechos, secretos, tracking contrario a la decisión de privacidad o fallo crítico de accesibilidad del flujo. Continúa tareas locales independientes. Campañas, dominios, anuncios, gastos, envío comercial y publicación requieren autorización A3 concreta; reutiliza la ya concedida dentro de su alcance. Cierra con [AGENT-RESULT](../../templates/AGENT-RESULT.md).
