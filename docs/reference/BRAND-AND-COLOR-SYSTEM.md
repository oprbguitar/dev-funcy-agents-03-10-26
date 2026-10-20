# Marca y tokens: decisiones por producto

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Este contrato se aplica cuando existe UI o identidad pública. Para CLI/biblioteca sin UI, registra `NOT_APPLICABLE` y razón; no fuerces colores ni logos. Firma editorial EOS, marca matriz y marca del producto son campos distintos. El nombre público de la matriz queda pendiente hasta aprobación; co-branding `off | subtle | visible`, sin activar publicación por inferencia. Dominio disponible no demuestra disponibilidad de marca: registra revisión preliminar de conflictos y deriva análisis jurídico cuando sea material.

## Decisión visual antes de código

Inspecciona identidad y UI vigentes. Describe audiencia, rubro, tareas, volumen de información, canal, accesibilidad e idioma. Compara tres estructuras diferentes y elige por comprensión y operabilidad. En legal puede convenir lectura documental; en retail, exploración y compra; en industria, lectura técnica densa; ninguna asociación de color es una regla sectorial o de seguridad. Conserva la identidad aprobada antes de renombrar.

El documento canónico del producto es `docs/brand/DESIGN-SYSTEM.md`, o su `DESIGN.md` existente con referencia única. Incluye decisiones y versiones; no mantengas dos fuentes divergentes. Declara logotipo, favicon/iconos, variantes y licencias disponibles; si solo hay brief, marca assets `PLANNED`, nunca archivos supuestamente generados.

## Contrato de tokens

Declara roles semánticos `primary`, `secondary`, `accent`, `background`, `surface`, `text`, `mutedText`, `border`, `success`, `warning`, `danger`, `focus`, `overlay`, con pares texto/fondo explícitos para cada estado/tema. El [JSON de ejemplo](../../templates/DESIGN-TOKENS.example.json) tiene valores ilustrativos: reemplázalos según proyecto; no declara contraste verificado.

Añade familias tipográficas con licencias y fallbacks, escala de tamaños/alturas de línea, espacios, radios, sombras, anchos/breakpoints y duración/easing de motion. Aplica escala a componentes; los valores excepcionales deben justificar su función. No heredes tipografías o assets externos sin revisión de derechos y privacidad de carga.

Define navegación, tabla, formulario, botón, alerta y diálogo solo si existen en el flujo. Por componente documenta estados normal/hover/active/focus-visible/disabled/loading/selected y empty/error/success/offline cuando procedan. El color no será la única señal de error/estado; añade texto e iconografía comprensible. Movimiento con propósito, desactivable y con `prefers-reduced-motion`; contenido completo en alternativa estática.

## Verificación y cambios

Elige nivel WCAG como objetivo técnico, no certificación. Calcula contraste de combinaciones reales incluidas transparencias y estados; complementa con teclado, foco, zoom, lectura semántica, alto contraste y preferencias OS. Prueba 360/768/1280/1600 px sobre producto real. Guarda entorno/commit/resultado/evidencia saneada; sin UI ejecutable usa `NOT_RUN`.

Cambio de identidad exige diff de tokens/componentes, capturas comparables, impacto en marcas/iconos/instaladores y aprobación de publicación correspondiente. Un fallo bloqueante de flujo o contenido engañoso impide liberar esa superficie; corrige y verifica la versión nueva.
