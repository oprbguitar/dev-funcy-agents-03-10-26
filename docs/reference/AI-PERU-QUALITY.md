# IA en Perú y calidad: referencias y decisiones operativas

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Consulta: **2026-10-19, Perú**. Alcance: integrar fuentes y prácticas verificables en EOS; no certificar productos ni sustituir revisión competente. La [skill operativa](../../skills/eos-peru-quality/SKILL.md) usa estas referencias y registra resultados en [AI-QUALITY-ASSESSMENT](../../templates/AI-QUALITY-ASSESSMENT.md). Privacidad conserva su registro canónico en [PRIVACY-PERU-REGISTRY](PRIVACY-PERU-REGISTRY.md); no duplicar allí decisiones del proyecto.

## Fuentes y grado de verificación

| ID | Fuente primaria y hecho observado | Verificación y límite |
|---|---|---|
| AI-PE-01 | [Ley 31814, Congreso](https://leyes.congreso.gob.pe/Documentos/2021_2026/ADLP/Texto_Consolidado/31814-TXM.pdf): publicación 2023-07-05; principios, objeto, definiciones y autoridad en arts. único preliminar y 1–4 | Texto consultado; no se afirma consolidación exhaustiva a la fecha ni revisión de toda norma complementaria |
| AI-PE-02 | [DS 115-2025-PCM, publicación oficial alojada en Congreso](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_115-2025-pcm.pdf), publicado 2025-09-09 | Texto oficial consultado: web y extracción en memoria, en particular páginas 8–10 del PDF. Diferenciar disposiciones del decreto y del reglamento; alcance/transición requieren decisión por proyecto |
| Q-ISO-01 | [ISO 9001:2026, ficha ISO](https://www.iso.org/standard/9001) y [anuncio ISO del 2026-09-16](https://www.iso.org/news/2026/09/ISO9001-2026): edición 6, publicada 2026-09 | Identidad/estado verificados en fichas públicas; revisión local selectiva descrita abajo; no se revisó todo el texto ni se autentica la copia |
| P-ISO-01 | [ISO/IEC 27701:2025, ficha ISO](https://www.iso.org/standard/27701): edición 2, publicada 2025-10; sistema de gestión de privacidad independiente | Identidad/estado y descripción pública verificados; revisión local selectiva descrita abajo; matriz integral y conformidad pendientes |

Las dos ediciones ISO están publicadas en esta consulta: no tratarlas como borradores por documentación antigua. Tampoco inventar un periodo de transición de certificados. La adopción nacional, contrato o certificación puede exigir versión y calendario propios.

El PDF aportado de ISO/IEC 27701 se identificó por portada/metadatos como edición 2025-10. El otro archivo se identifica como **NTC-ISO 9001:2026, norma técnica colombiana de ICONTEC**, y declara correspondencia IDT y fecha 2026-09-16. Estas observaciones no autentican las copias ni convierten NTC en NTP peruana. No se incorporan archivos ni extractos de las normas al repositorio. La primera revisión se limitó a identidad; esta ampliación incorpora lectura selectiva de las secciones indicadas abajo, sin reproducir textos íntegros.

## Distinciones jurídicas que el flujo debe conservar

Resumen delimitado de AI-PE-02; leer artículos y disposiciones completos antes de resolver un caso:

- Arts. 3–4: alcance y excepciones requieren hechos; no presumir aplicación universal.
- Art. 28.2, capítulo público: desarrollo de IA por entidades públicas exige NTP-ISO/IEC 42001:2025. No equivale a exigir certificación.
- Arts. 29–30: controles y evaluación de impacto del capítulo público; art. 31: obligaciones del desarrollador/implementador privado.
- Art. 32.1: evaluación de impacto de alto riesgo privada voluntaria; 32.2–32.3: mitigación y documentación, con conservación mínima de tres años para evaluación realizada.
- Art. 33: promoción de estándares; sexta disposición final: uso obligatorio público de NTP-ISO/IEC 27002 y NTP-ISO 31000 vigentes.
- Vigencia del decreto: 90 días hábiles, con excepciones. Primera disposición final del reglamento: implementación gradual por entidad, sector privado y MYPE; no fecha única.

La decisión humana debe identificar artículo, versión y transición concretos; no inferir obligaciones privadas desde un capítulo público ni equiparar promoción con mandato. No es una determinación jurídica automatizada.

## Clasificación y responsabilidad

Cada requisito recibe una categoría del [REGULATORY-DECISION](../../templates/REGULATORY-DECISION.md): `MANDATORY_LEGAL`, `MANDATORY_CONTRACTUAL`, `MANDATORY_INTERNAL`, `VOLUNTARY_STANDARD`, `BEST_PRACTICE` o `CERTIFICATION_TARGET`. Si un contrato exige ISO, su origen contractual y alcance quedan expresos. No toda práctica inspirada en ISO constituye conformidad con la norma.

El análisis técnico propone riesgos con hechos, escenarios y evidencia; una persona competente determina la aplicabilidad, categoría jurídica y calendario. `L0–L4` de EOS solo caracteriza criticidad de ingeniería. Las dudas permanecen `UNDETERMINED`/`LEGAL_REVIEW_REQUIRED` con responsable, acción y plazo interno de revisión. El agente no resuelve una duda legal mediante confianza estadística ni adopta por defecto la categoría menos exigente.

El dueño del proceso acepta requisitos y usos previstos. El responsable técnico implementa límites y recuperabilidad. Privacidad/seguridad revisan flujos y amenazas. El responsable competente valida obligaciones y comunicaciones. El aprobador de entrega decide dentro de su autorización con evidencia. En un equipo unipersonal la misma persona puede asumir varios roles, documentando esa limitación y cuándo necesita apoyo especializado; una segunda respuesta de IA no representa independencia humana.

## Prácticas internas de calidad y privacidad

La tabla siguiente define prácticas de EOS. Su relación con ISO es temática, **sin numeración de cláusulas ni afirmación de equivalencia completa**. Para una certificación o auditoría contractual, adquirir/consultar texto autorizado, fijar alcance organizacional y producir una matriz revisada de requisitos y evidencia; una checklist de software no acredita por sí sola un sistema de gestión.

| Área de gestión | Aplicación proporcional al proyecto | Evidencia mínima útil |
|---|---|---|
| Contexto y dirección | Usuario, finalidad, partes interesadas, responsabilidad y alcance real; criterios de aceptación y exclusiones justificadas | Perfil/ADR y aprobación del dueño |
| Planificación por riesgos | Escenario, daño, probabilidad razonada, controles, riesgo residual y eventos de reapertura | Hallazgo/assessment con responsable y fecha |
| Competencia y operación | Instrucciones verificables, revisión y formación para reconocer límites, fallos y escalamiento | Revisión real o ejercicio demostrado, sin certificados inventados |
| Proveedores y cambios | Modelo/runtime/datos versionados; contratos y dependencias; evaluar cambio antes de promoción | MODEL-CARD, inventario y diff; prueba de regresión |
| Privacidad y responsabilidad | Finalidades, roles, minimización, derechos, encargados y retención; revisar tratamiento local y remoto | Registros canónicos de privacidad y flujo comprobado |
| Evaluación del desempeño | Medidas relevantes con muestra, error, contexto y límites; reclamaciones e incidentes | Resultado reproducible, denominador y revisión humana |
| Mejora continua | Contener defecto, investigar causa, corregir y comprobar eficacia | Incidente/hallazgo enlazado a corrección y nueva medición |

Aplica el ciclo **planificar → hacer → verificar → actuar (PDCA)** en cada incremento material. Planificar fija requisito, riesgo y prueba; hacer conserva configuración/versiones; verificar compara resultados con aceptación; actuar cierra causa raíz y confirma que el cambio funciona sin regresión. Una fila marcada no sustituye estas evidencias.

Para IA, agrega límites de autonomía/herramientas, protección ante instrucciones no confiables, verificación de afirmaciones y citas, abstención, sesgos pertinentes, revisión humana y parada verificable. Los umbrales dependen del uso y del daño: no hay porcentaje universal que vuelva seguro o legal un modelo. Mantén alternativa determinista, degradación y rollback cuando sean necesarios para continuidad.

## Aplicación por modo y entrega

**INIT:** decidir si realmente se requiere IA; perfilar uso, datos, usuarios y recursos; establecer criterios antes de construcción. Un puerto previsto se mantiene OFF. Una demostración con datos sintéticos no acredita aptitud con datos reales.

**ADOPT:** inventariar IA y tratamientos existentes, caracterizar controles y resultados, conservar línea base y plan reversible. Corregir brechas por impacto sin migración o proveedor nuevo por rutina. Una función ya operativa no queda aprobada por antigüedad.

**RELEASE:** cerrar evidencia aplicable y decisiones humanas; identificar lo pendiente y el comportamiento OFF/degradado autorizado. Probar parada y recuperación para el componente afectado. Registrar en [RELEASE-RECORD](../../templates/RELEASE-RECORD.md) y estado vivo; no publicar promesas legales, certificaciones o resultados sin soporte.

**INCIDENT:** contener dentro de permisos, preservar referencias minimizadas, determinar personas/datos/decisiones afectados, coordinar responsable técnico y competente, evaluar comunicaciones y remediar causa raíz. Plazos y destinatarios se derivan de la fuente pertinente, no de un temporizador genérico. Usar [INCIDENT-RECORD](../../templates/INCIDENT-RECORD.md).

Revisar fuentes antes de activación y ante cambios normativos, contractuales o de alcance. Un nuevo proveedor, modelo, dataset, sector, población afectada o uso decisorio reabre las filas relacionadas. Si la fuente no está disponible, conservar la limitación y asignar obtención/revisión; no completar con cláusulas plausibles de memoria.


## ENIA incorporada desde el anexo aportado

[ENIA 2026–2030](ENIA-2026-2030.md) conserva trazabilidad por página, ejes/objetivos, acciones, metas acumuladas y responsables. La [RM 152-2026-PCM en El Peruano](https://busquedas.elperuano.pe/dispositivo/NL/2511535-1) fue fechada el 29 de abril y publicada el 1 de mayo de 2026. Distinguir alcance público (art. 2.1) de referencia para privados y otros actores (art. 2.3). Para entidades públicas comprendidas, revisar alineamiento de planes, contenido/horizonte y aprobación del Plan de Acción de IA, gobierno de datos previo y OIA (arts. 4–6). La referencia privada no elimina obligaciones de otras normas.

La ENIA sintetiza estándares e impacto en términos amplios en pp. 55–56; resolver el ámbito con su fuente normativa y las distinciones de AI-PE-02, sin extender obligaciones del capítulo público del reglamento a todos los privados. Los lineamientos o plataformas anunciados requieren comprobar aprobación/operación por separado. Las frecuencias de seguimiento institucional no fijan por sí solas la frecuencia de monitoreo técnico de cada producto.

## Revisión selectiva de los PDF de privacidad y calidad

Síntesis propia, realizada el 2026-10-19 sobre las copias aportadas. Las páginas siguientes son **posición PDF, empezando en 1**, no página impresa. Identificar un requisito en la copia no autentica edición, traducción o integridad frente al editor ni produce una auditoría de conformidad. No se publican PDF, capturas o texto extraído. Para adopción contractual/certificación confirmar edición y acceso autorizado.

| Documento local | Identidad y revisión realizada | SHA-256 de bytes |
|---|---|---|
| ISO/IEC 27701:2025 | 72 páginas; leídas 1–7, 13–15, 18–26; búsqueda de ubicación en conjunto | `608cb46a02f871dbef0106681a833309bde9402901f289d77a0b43d091d40807` |
| NTC-ISO 9001:2026, ICONTEC | 61 páginas; leídas 1–7, 25, 28–29, 32–35, 37–38, 40–42; traducción colombiana declarada, no NTP | `a0e5cb8a38b71b7c73b8c857ee50d33be05bdc36ef8c77c605be1414a8a60914` |

La tabla anterior de prácticas internas sigue siendo temática. La siguiente añade referencias comprobadas solo para los temas examinados; no es una matriz completa ni transcripción de cláusulas.

| Tema y referencia de la copia | Precisión operativa propia para EOS | Evidencia propuesta en el proyecto |
|---|---|---|
| ISO/IEC 27701, 6.1.2–6.1.3, pp. 13–15; anexo A, p. 21 | Evaluar daño a personas y al negocio por separado; mantener criterios comparables, tratamiento, controles incluidos/excluidos y aceptación del riesgo residual | Declaración de aplicabilidad de privacidad cuando corresponda, plan de tratamiento y dueño del riesgo; no confundir con decisión jurídica |
| ISO/IEC 27701, A.1.2.7–A.1.2.9, p. 21; A.2.2.2–A.2.3.2, p. 23 | Determinar rol por tratamiento; un encargado conserva instrucciones del cliente y escala instrucciones posiblemente ilícitas | Registro canónico por flujo, contratos e instrucciones documentadas, soporte a derechos |
| ISO/IEC 27701, A.2.5.2–A.2.5.9, p. 24 | Evaluar subencargados y sus cambios: servicio, países, aviso y objeción contractual; no todo proveedor es encargado | Inventario/contrato y decisión antes de habilitar modelos o herramientas con datos |
| ISO/IEC 27701, A.1.4.6–A.1.4.9, pp. 22–23; A.2.4.2–A.2.4.3, p. 24 | Definir retención y eliminación verificable. Aplicación EOS: cachés, contextos de agentes, extracción, índices y pruebas con datos personales | Alcance, plazo, prueba y límites del borrado; no prometer eliminación física indemostrable |
| ISO/IEC 27701, A.1.3.11, p. 22 | Detectar decisiones sobre personas basadas solo en tratamiento automatizado; evaluar obligaciones del país/caso | Fuente aplicable y mecanismos reales de atención; no importar GDPR automáticamente |
| ISO/IEC 27701, 9.2–9.3, pp. 19–20; NTC-ISO 9001, 9.2.2–9.3.3, pp. 40–41 | Planificar auditoría y revisión de dirección con alcance, criterios, evidencia, objetividad y decisiones | Programa, hallazgos, seguimiento y recursos; declarar límites de independencia del equipo unipersonal |
| NTC-ISO 9001, 8.3.2–8.3.5, pp. 32–33 | Separar verificación de requisitos y validación del uso previsto | Tests trazables más aceptación/ensayo de uso con personas o escenarios autorizados |
| NTC-ISO 9001, 6.3, p. 25; 8.3.6–8.4.3, pp. 33–35; 8.5.6, p. 37 | Evaluar/reevaluar proveedores y controlar cambios. Aplicación EOS: modelo, prompt, dataset y herramienta | Criterios, desempeño, consecuencias, comunicación, autorizador y regresión posterior |
| NTC-ISO 9001, 8.6–8.7, pp. 37–38; 10.2, p. 42; ISO/IEC 27701, 10.2, p. 20 | Contener salidas no conformes, evitar reutilización/entrega accidental y separar corrección de acción sobre causa raíz | Salida/versión afectada, aislamiento, autoridad de aceptación cuando sea admisible, nueva prueba y eficacia |

La automatización puede comprobar estructura y recopilar evidencia; no aprobar por sí sola riesgo, excepciones legales o certificaciones. Reutilizar evaluación, registros de privacidad, incidentes y release; no duplicar expedientes. Estos controles complementan la ENIA y el reglamento, conservando su naturaleza legal/contractual/voluntaria propia.
