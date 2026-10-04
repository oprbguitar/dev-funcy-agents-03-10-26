# Cumplimiento, privacidad, producto y propiedad intelectual

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

**Origen:** SRC-03 §§10–14, 62–83, 101–107, 115 y 138; SRC-02 §§5, 14–15 y 35–37. **Constitución:** §§47–57, 65–67 y 91–92. **Estado:** instrucciones para investigar, documentar y someter decisiones a revisión competente; no constituye certificación ni dictamen legal de un producto.

## 1. Comenzar por aplicabilidad

Una matriz normativa útil se construye con un producto concreto. Registra entidad responsable, países de operación, ubicación de usuarios, sector, naturaleza pública o privada, datos, funciones, proveedores, contratos y destino de transferencias. «Está alojado en Perú» no resuelve por sí solo todas las jurisdicciones. Una empresa que vende en otros países debe investigar el alcance aplicable a esas relaciones.

El Compliance Architect clasifica requisitos y prepara evidencia. El Regulatory Scout localiza textos oficiales y cambios. El Data Architect inventaría tratamiento y flujos. Product Legal compara promesas con funcionamiento. El propietario o revisor competente decide interpretaciones de impacto legal. Un agente puede encontrar una norma, pero no debe inventar representación profesional ni comunicar compromisos legales a terceros.

| Tipo EOS | Ejemplo de origen | Qué probar |
|---|---|---|
| MANDATORY_LEGAL | Ley, reglamento o norma sectorial aplicable | Texto, vigencia y supuesto de aplicación |
| MANDATORY_CONTRACTUAL | Contrato con cliente/proveedor | Cláusula, partes y alcance |
| MANDATORY_INTERNAL | Política aprobada de la organización | Autoridad, versión y usuarios sujetos |
| VOLUNTARY_STANDARD | Estándar adoptado por decisión | Alcance y controles seleccionados |
| BEST_PRACTICE | Guía técnica reconocida | Riesgo que mitiga y pertinencia |
| CERTIFICATION_TARGET | Objetivo de certificación futuro | Esquema, auditor y brechas |
| INFORMATIONAL | Tendencia o texto sin efecto obligatorio | Estado y razón de observación |

No promociones una buena práctica a ley. No llames certificado a un sistema preparado para una auditoría. La matriz distingue controles existentes, evidencia pendiente y decisión de aplicabilidad. Para un prototipo sin datos reales puede bastar un registro compacto; para datos de salud o servicios críticos el alcance exige mayor profundidad.

## 2. Registro normativo y estados separados

Cada registro tiene `requirement_id`, título, autoridad, jurisdicción, sector, URL oficial, texto o artículo relevante, fecha de publicación, fecha de efecto, reglas transitorias, versión, norma que modifica o reemplaza, fecha de consulta, dueño y próxima revisión. Si una fecha no se ha comprobado, usa `unknown` y no construyas un deadline con ella.

El estado de la fuente se expresa como DRAFT, PUBLISHED, EFFECTIVE, SUPERSEDED o REPEALED. El estado del control se expresa como VERIFIED, PARTIAL, MISSING, NOT_APPLICABLE o LEGAL_REVIEW_REQUIRED. Una norma EFFECTIVE puede tener controles MISSING en tu producto. Un documento PUBLISHED puede contener disposiciones con calendario distinto. Una interpretación pendiente no se vuelve VERIFIED porque el control técnico pase un test.

Conserva el [RDR](../../templates/REGULATORY-DECISION.md) que une requisito, interpretación, control y evidencia. La evidencia identifica versión y entorno. Si la aplicación cambia cómo comparte información, la decisión anterior se reabre aunque no cambie el texto legal.

## 3. Country pack Perú

El pack peruano es un catálogo de líneas de investigación, activado por contexto. Revisa datos personales, gobierno digital, confianza digital, interoperabilidad, IA, firmas, consumidores, pagos, tributación, propiedad intelectual y normas del sector. Una web corporativa no hereda automáticamente obligaciones reservadas a una entidad pública o participante del sistema de pagos.

Para datos personales, la fuente oficial identifica el **DS 016-2024-JUS** como reglamento de la Ley 29733. El producto debe verificar artículos, supuestos, plazos, transferencias y controles concretos en el texto completo; este catálogo no determina automáticamente el cumplimiento. [ANPD](https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus), [texto oficial alojado por el Congreso](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_016-2024-jus.pdf).

Para IA, la PCM publicó el **DS 115-2025-PCM**, que aprueba el reglamento de la Ley 31814. Investiga la clasificación y requisitos del caso de uso, incluyendo disposiciones de vigencia y transición; no confundas la fecha de publicación con todos los plazos de implementación. [PCM](https://www.gob.pe/institucion/pcm/normas-legales/7133522-115-2025-), [texto oficial alojado por el Congreso](https://www.congreso.gob.pe/Docs/DGP/DIDP/files/ds_115-2025-pcm.pdf).

Para pagos consulta [el manual específico](PAYMENTS.md). La disponibilidad comercial de una pasarela y la aplicabilidad regulatoria son decisiones distintas. Para una entidad pública investiga además su normativa y contratos de interoperabilidad; no deduzcas autorización de acceso de que una base tenga un endpoint público.

Fuentes consultadas para identificación de este catálogo el **2026-10-03**. Las fichas de gob.pe pueden bloquear acceso automatizado; la recuperación de una ficha indexada no equivale a revisión íntegra de todos sus anexos. Usa el PDF oficial y registra la revisión concreta antes de una decisión de cumplimiento. No congeles este pack como lista exhaustiva o permanentemente vigente.

## 4. Estándares internacionales y estrategia dual

Evalúa estándares de calidad, seguridad, gestión de servicios, continuidad, IA, accesibilidad y desarrollo seguro según riesgo y contrato. Registra la versión realmente consultada, alcance y acceso al texto. Conocer el nombre de una ISO no autoriza afirmar conformidad con requisitos no revisados.

Si un requisito local remite a una edición anterior, conserva el baseline exigible y evalúa los controles nuevos por separado. La adopción voluntaria de una edición reciente no debe omitir lo requerido por una cláusula o norma específica. El RDR explica cómo conviven ambas referencias y qué evidencia satisface cada una.

Para accesibilidad, [WCAG 2.2](https://www.w3.org/TR/WCAG22/) es una referencia oficial del W3C. El alcance se acuerda y se prueba con técnicas automáticas y evaluación humana. Esta biblioteca no afirma que todo producto esté sujeto a un nivel legal uniforme ni que un escaneo equivalga a conformidad.

## 5. Privacidad desde el inventario de tratamiento

El registro de tratamiento relaciona finalidad, categorías, origen, sujetos, fundamento a evaluar, acceso, proveedores, ubicación, transferencias, retención, eliminación, derechos y eventos de riesgo. Crea un mapa que permita responder qué sistema contiene un dato y qué terceros reciben una copia. Si no puede encontrarse la réplica o exportación, la política de borrado está incompleta.

No recolectes información porque sea técnicamente accesible. La IP de sesión, la geolocalización estimada, el dispositivo y el historial pueden servir para seguridad, pero requieren finalidad, minimización, permisos y retención. La cuenta de un administrador no justifica un panel que exponga toda la actividad personal a cualquier operador.

Clasifica PUBLIC, INTERNAL, CONFIDENTIAL y RESTRICTED para controles de ingeniería, sin presentar esa taxonomía interna como clasificación legal universal. La clase debe gobernar logs, backups, exports, datasets de evaluación, retrieval y proveedores IA. Pseudonimizar preserva vínculos potenciales; anonimizar requiere evaluar reidentificación. Ejecutar localmente reduce algunos flujos, pero no concede por sí solo permiso de uso.

## 6. Derechos, conservación y proveedores

Un procedimiento de solicitudes registra ID, canal, identidad verificada de forma proporcional, tipo, datos/localizaciones relevantes, responsable, plazo legal verificado, decisión, ejecución y comunicación autorizada. El agente no concede derechos sobre datos de otra persona para completar una respuesta rápida. Tampoco exige más datos de identidad de los necesarios.

La retención debe asociarse a finalidad y requisitos aplicables. Cuando existe un legal hold documentado, separa conservación de uso ordinario. Define cómo caducan copias, índices, cachés y backups conforme a su ciclo; no prometas eliminación instantánea de todas las copias si el proceso real no la garantiza. Las restauraciones deben reaplicar tombstones o reglas necesarias para evitar resucitar datos eliminados sin justificación.

Antes de enviar datos a un proveedor registra servicio, región, contrato, condiciones de uso, subprocesadores si aplican, seguridad, retención, acceso, usos de entrenamiento y salida. Una casilla «no entrenar» no sustituye revisión del resto del flujo. Una contingencia de IA no aprueba un proveedor que aún no pasó el review.

## 7. Incidentes y responsabilidades

Relaciona incidentes de datos con [respuesta a incidentes](INCIDENT-RESPONSE.md). Contener y preservar evidencia no significa notificar indiscriminadamente ni publicar detalles de afectados. Determina quién evalúa obligaciones de comunicación, a quién, con qué contenido, mediante qué canal y en qué plazo verificado.

Usa una matriz de impacto con categorías de datos, cantidad estimada, sistemas, duración, destinatarios posibles y certeza de cada observación. Si solo hay una sospecha, dilo. Si el número aumenta, versiona la evaluación. La evidencia se guarda con acceso restringido; los informes generales usan referencias y agregados.

## 8. Mapa de activos y contribución humana

Registra código, documentación, diseño, marcas, datasets, modelos, prompts, algoritmos, secretos comerciales y material adquirido. Cada activo tiene creador/contribuyente conocido, fuente, propietario declarado, contrato/licencia, restricciones y evidencia. No rellenes titularidad con el nombre del dueño del repositorio por defecto.

Para material asistido por IA registra herramienta y modelo si se conocen, fecha, tarea, inputs autorizados, resultados, selección, cambios humanos, revisión y derechos pendientes. El registro demuestra el proceso editorial; no pretende resolver la legislación de autoría en todas las jurisdicciones. La política EOS conserva la responsabilidad humana sobre decisiones y aceptación.

La firma de esta edición tiene alcance en [AUTHORSHIP](../../AUTHORSHIP.md). Git permite trazar cambios; un commit firmado editorialmente en texto no es una firma digital. La ausencia de licencia OSS no debe interpretarse como autorización de redistribución. Respeta fuentes, proveedores y colaboradores.

Indecopi dispone de un canal de registro de programas de ordenador, identificado en su publicación oficial. Una inscripción requiere el trámite correspondiente; crear este archivo no ejecuta ese trámite ni otorga un registro. [Indecopi](https://www.gob.pe/institucion/indecopi/noticias/906591-el-indecopi-habilita-servicio-para-que-creadores-de-software-registren-sus-programas-a-traves-de-la-plataforma-de-registro-virtual-de-obras).

## 9. Patentes, marcas y secreto comercial

Antes de una divulgación pública de una posible invención, registra problema técnico, solución, antecedentes, contribuciones y estrategia de revisión. El Patentability Gate recomienda evaluación especializada; no determina novedad con una búsqueda superficial ni garantiza registro. Mantener privado un repositorio no reemplaza acuerdos y gestión de acceso.

Para una marca, inventaría nombre, logo, clases potenciales, países, dominios, similitudes y consultas. Tener un dominio o usuario social no prueba disponibilidad registral. Las decisiones de solicitud o oposición requieren alcance autorizado y revisión competente.

Para secreto comercial define información protegida, accesos, acuerdos, retención, auditoría, compartición y baja de usuarios. Un documento público que revela el secreto puede frustrar la estrategia; el agente debe identificar ese conflicto antes de publicar, dentro de las instrucciones reales del propietario.

## 10. Licencias y dependencias

Inventaría licencias de runtime, frameworks, paquetes, fuentes tipográficas, iconos, tiles, imágenes, datasets y modelos. Conserva notices, condiciones de distribución, atribución, patentes, uso comercial y restricciones de modificación. Una dependencia permitida para desarrollo puede tener condiciones distintas para redistribución o servicio.

Clasifica compatibilidad según la forma real de uso, incluyendo linking, distribución, SaaS, modificación y contratos. No reduzcas todo copyleft a una etiqueta roja automática ni apruebes todo permissive sin leer obligaciones. Registra incertidumbre y revisión cuando corresponda. La incorporación de material sin origen claro debe detenerse hasta aclarar derechos o elegir una alternativa autorizada.

## 11. Producto, consumidores y operación comercial

El modo comercial activa una comparación de web, términos, privacidad, checkout, correo de confirmación y funcionamiento real. Verifica precio, impuestos que correspondan, moneda, recurrencia, renovación, cancelación, reembolsos, soporte, disponibilidad prometida y tratamiento de datos. Cualquier contradicción material genera `LEGAL_CONSISTENCY_FAIL` y dueño de corrección.

Evita escasez falsa, costos ocultos, consentimiento inducido, cancelación deliberadamente dificultada, opciones pagadas preseleccionadas o botones engañosos. Product/UX revisan el recorrido completo, incluyendo error y baja. Si una promoción es una hipótesis o demo, identifícala. No inventes testimonios, volumen de clientes, garantías o métricas para hacer una página convincente.

El registro de reclamos incluye caso, canal, categoría, pedido, fecha, responsable, evidencias, plazo aplicable verificado, escalamiento, acción y cierre. Un borrador generado por IA no se envía al reclamante sin la autorización apropiada. El sistema registra qué respuesta se comunicó y cuándo; no declara resuelto por redactar un mensaje.

CEO, Marketing, Sales, Pricing y Finance son roles opcionales. Pueden proponer estrategia y analizar datos autorizados. No aprueban presupuesto, descuentos, movimientos financieros ni campañas por contar con ese título. Cada recomendación comercial separa hechos observados, supuestos y experimento medible.

## 12. Excepciones y gates de aceptación

Una excepción tiene razón, ámbito, dueño, riesgo residual, compensación, aprobación, fecha y vencimiento. El registro [EXCEPTION](../../templates/EXCEPTION.md) no puede legalizar una obligación incumplida ni conceder derechos inexistentes. Ante cambio de contexto, vuelve a evaluar; no renueves automáticamente porque una fecha expiró.

Antes de release exige: fuentes identificadas, requisitos clasificados, datos mapeados, controles con evidencia, promesas coherentes, licencias conocidas y pendientes con responsable. La decisión comercial o legal pendiente se expresa de manera concreta; nunca como «100% compliant».

| Fallo a ensayar | Conducta esperada | Evidencia de cierre |
|---|---|---|
| Norma citada sin texto íntegro | Revisar fuente o conservar incertidumbre | RDR con alcance revisado |
| Proveedor cambia retención | Reabrir privacidad y contrato | Flujo y controles revalidados |
| Checkout contradice términos | Bloquear promesa afectada | Recorrido alineado |
| Request de derechos restaura dato borrado | Corregir propagación/tombstones | Ensayo de restauración |
| Licencia del modelo cambia | Suspender nueva adopción | Registro y alternativa aprobada |
| Reclamo sin plazo comprobado | Asignar revisión antes de prometer | Fuente, dueño y deadline real |
