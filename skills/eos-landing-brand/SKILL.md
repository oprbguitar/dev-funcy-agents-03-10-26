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
2. Deriva al menos tres direcciones estructurales del dominio, audiencia, densidad y flujo; registra elección y descartes en el documento de diseño canónico. Tres variantes de color de la misma composición no cumplen esta comparación. Carga `pierre-design-director` cuando esté disponible y sea exigida por el host: conserva su autoridad de dirección visual. Ejecuta `node ~/AI-Design-Harness/bin/design-pick.mjs --project "<destino>" --mode <operate|read|persuade|explore|experience> --domain "<dominio>"` antes del código visual. Sin Node/FS, declara dirección manual en seis líneas antes del código. No impongas framework, paleta ni tipografía universal; justifica desviaciones funcionales del selector y respeta identidad existente.
3. Declara tokens semánticos y estados antes de pantallas; usa [BRAND-AND-COLOR-SYSTEM](../../docs/reference/BRAND-AND-COLOR-SYSTEM.md) y [ejemplo JSON](../../templates/DESIGN-TOKENS.example.json) como formato ilustrativo, nunca como conformidad ya probada.
4. Completa [LANDING-BRIEF](../../templates/LANDING-BRIEF.md): problema, destinatario, propuesta comprobable, CTA y recorrido hasta activación/soporte. Cada claim apunta a capacidad y evidencia. Solo muestra capturas, logos, testimonios y precios reales con permisos. Marca mockups como propuestos.
5. Elige arquitectura mínima compatible: página estática, integración en frontend o sitio separado justificado. Usa el [catálogo de 25 candidatos y procedimiento de selección](../../docs/reference/LANDING-REPOSITORY-RESEARCH.md) para comparar plantilla completa, componentes o implementación original según contexto; no clones ni añadas dependencias automáticamente. Revisa propietario, commit, mantenimiento, dependencias/scripts y licencia exacta por ruta/asset antes de `ADAPT`/`ADOPT`; metadatos MIT no reemplazan lectura del texto. Registra `INSPIRE_ONLY | ADAPT | ADOPT | REJECT`. En ADOPT prioriza incrementos reversibles, conserva flujos/contratos y no migres el stack por una plantilla. Efectos, bento, vidrio y animaciones del catálogo son opcionales y quedan sujetos a Pierre, accesibilidad y presupuesto.
6. Resuelve SEO técnico, metadatos, semántica, canonicals, indexación por entorno, rendimiento presupuestado y accesibilidad objetivo. Verifica formularios, éxito/error/abuso y minimiza campos. No prometas ranking ni conversión.
7. Evalúa datos, proveedores, cookies y almacenamiento antes de activar analytics, embeds, píxeles o experimentos. Una landing sin tratamiento que requiera consentimiento no recibe CMP ornamental. Un proveedor que dice ser cookieless sigue sujeto a evaluación de datos y tráfico real. Emplea [GROWTH-EXPERIMENT](../../templates/GROWTH-EXPERIMENT.md) cuando exista hipótesis comercial.
8. Ejecuta pruebas en el producto destino: 360/768/1280/1600 px, teclado/foco, estados hover/active/disabled/loading/selected, contraste efectivo, reducción de movimiento, enlaces, CTA y formularios. Inspecciona tráfico/almacenamiento en primera visita, aceptación, rechazo y revocación cuando procedan; documenta condiciones y resultado.
9. Para frontend sustancial conserva `DESIGN.md`, tokens y evidencia en el destino. Ejecuta `node ~/AI-Design-Harness/bin/design-lint.mjs .` cuando aplique el harness; corrige RECHAZADO y vuelve a verificar. Registra dirección nueva sustancial con `design-log.mjs` según el harness. Esta biblioteca de instrucciones no crea UI: una actualización del catálogo marca pruebas visuales `NOT_APPLICABLE`, y los builds/auditorías de repos ajenos no ejecutados quedan `NOT_RUN`. No simules un diseño ni ejecutes un selector sin producto solo para llenar evidencia.

## Gates y salida

Entrega brief, tokens versionados, decisión de landing, matriz claim → evidencia y checks `PASS | FAIL | NOT_RUN | NOT_APPLICABLE`. Un archivo escrito no demuestra UI funcionando: sin producto/runtime las pruebas visuales, SEO remoto y red son `NOT_RUN`, con responsable y siguiente paso. Usa los estados de capacidad EOS: `PLANNED`, `IMPLEMENTED`, `VERIFIED`, `OPERATING`; no saltes por documentación.

Bloquea publicación por claims falsos, assets sin derechos, secretos, tracking contrario a la decisión de privacidad o fallo crítico de accesibilidad del flujo. Continúa tareas locales independientes. Campañas, dominios, anuncios, gastos, envío comercial y publicación requieren autorización A3 concreta; reutiliza la ya concedida dentro de su alcance. Cierra con [AGENT-RESULT](../../templates/AGENT-RESULT.md).


## Navegación y documentación para quien usa el producto

Integra [eos-user-help](../eos-user-help/SKILL.md) cuando haya aplicación o flujo interactivo. El diseño incorpora acceso a ayuda y menú de módulos pertinente; usa como referencia los [patrones inspeccionados](../../docs/reference/USER-HELP-NAVIGATION-PATTERNS.md) conservando identidad. Tokens, estados, iconos con etiquetas y teclado/foco cubren también la guía, no solo la pantalla principal. Una landing informativa simple no necesita un panel de manual artificial; su información de uso debe ser localizable y adecuada al producto.
