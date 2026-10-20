# IA en Perú y calidad: referencias y decisiones operativas

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Consulta: **2026-10-19, Perú**. Alcance: integrar fuentes y prácticas verificables en EOS; no certificar productos ni sustituir revisión competente. La [skill operativa](../../skills/eos-peru-quality/SKILL.md) usa estas referencias y registra resultados en [AI-QUALITY-ASSESSMENT](../../templates/AI-QUALITY-ASSESSMENT.md). Privacidad conserva su registro canónico en [PRIVACY-PERU-REGISTRY](PRIVACY-PERU-REGISTRY.md); no duplicar allí decisiones del proyecto.

## Fuentes y grado de verificación

| ID | Fuente primaria y hecho observado | Verificación y límite |
|---|---|---|
| AI-PE-01 | [Ley 31814, Congreso](https://leyes.congreso.gob.pe/Documentos/2021_2026/ADLP/Texto_Consolidado/31814-TXM.pdf): publicación 2023-07-05; principios, objeto, definiciones y autoridad en arts. único preliminar y 1–4 | Texto consultado; no se afirma consolidación exhaustiva a la fecha ni revisión de toda norma complementaria |
| AI-PE-02 | [DS 115-2025-PCM, publicación oficial alojada en Congreso](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_115-2025-pcm.pdf), publicado 2025-09-09 | Texto oficial consultado: web y extracción en memoria, en particular páginas 8–10 del PDF. Diferenciar disposiciones del decreto y del reglamento; alcance/transición requieren decisión por proyecto |
| Q-ISO-01 | [ISO 9001:2026, ficha ISO](https://www.iso.org/standard/9001) y [anuncio ISO del 2026-09-16](https://www.iso.org/news/2026/09/ISO9001-2026): edición 6, publicada 2026-09 | Identidad/estado verificados en fichas públicas; no se revisó texto completo ni se atribuyen controles a cláusulas no consultadas |
| P-ISO-01 | [ISO/IEC 27701:2025, ficha ISO](https://www.iso.org/standard/27701): edición 2, publicada 2025-10; sistema de gestión de privacidad independiente | Identidad/estado y descripción pública verificados; matriz de cláusulas y conformidad quedan pendientes de texto autorizado y examen real |

Las dos ediciones ISO están publicadas en esta consulta: no tratarlas como borradores por documentación antigua. Tampoco inventar un periodo de transición de certificados. La adopción nacional, contrato o certificación puede exigir versión y calendario propios.

El PDF aportado de ISO/IEC 27701 se identificó por portada/metadatos como edición 2025-10. El otro archivo se identifica como **NTC-ISO 9001:2026, norma técnica colombiana de ICONTEC**, y declara correspondencia IDT y fecha 2026-09-16. Estas observaciones no autentican las copias ni convierten NTC en NTP peruana. No se incorporan archivos ni extractos de las normas al repositorio. No se usaron sus textos íntegros para elaborar esta referencia.

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
