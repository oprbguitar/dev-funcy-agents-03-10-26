# Plantillas operativas EOS

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Estas plantillas desarrollan la [constitución maestra](../EOS_MASTER_SYSTEM_INSTRUCTION.md).
Son registros documentales; no ejecutan controles ni acreditan cumplimiento.
Copiar únicamente los formatos pertinentes.

## Cómo empezar

1. Leer perfil e instrucciones aplicables.
2. Elegir el formato pertinente.
3. Copiarlo a la estructura documental existente.
4. Completar datos verificados o declarar pendientes.
5. Asociar conclusiones a evidencia y revisión.
6. Actualizar cuando cambie el contexto.

| Archivo | Evento que lo necesita |
|---|---|
| [PROJECT-PROFILE.md](PROJECT-PROFILE.md) | Inicio o adopción |
| [PROJECT-STATUS.md](PROJECT-STATUS.md) | Estado canónico del proyecto, actualizado por hito |
| [PRIVACY-ASSESSMENT.md](PRIVACY-ASSESSMENT.md) | Evaluación de datos y jurisdicciones por finalidad |
| [DATA-FLOW-REGISTER.md](DATA-FLOW-REGISTER.md) | Captura, almacenamiento, destinos, conservación y derechos |
| [COOKIE-DECISION.md](COOKIE-DECISION.md) | Decidir aviso/gestor y comprobar aceptación, rechazo y retiro |
| [PROCESSOR-AND-TRANSFER-REGISTER.md](PROCESSOR-AND-TRANSFER-REGISTER.md) | Proveedores, subencargados, regiones y transferencias |
| [LEGAL-DOCUMENT-CHECKLIST.md](LEGAL-DOCUMENT-CHECKLIST.md) | Documentos aplicables, borradores, revisión y aprobación |
| [BRAND-BRIEF.md](BRAND-BRIEF.md) y [tokens ilustrativos](DESIGN-TOKENS.example.json) | Identidad, marca pública y sistema visual |
| [LANDING-BRIEF.md](LANDING-BRIEF.md) | Producto web público/comercial o exclusión justificada |
| [GROWTH-EXPERIMENT.md](GROWTH-EXPERIMENT.md) | Hipótesis comercial, medición lícita y decisión con resultados |
| [DESKTOP-RELEASE-CHECKLIST.md](DESKTOP-RELEASE-CHECKLIST.md) | Distribución, updater, rollback y datos locales por plataforma |
| [TASK-PACKET.md](TASK-PACKET.md) | Asignación y handoff |
| [EXEC-PLAN.md](EXEC-PLAN.md) | Trabajo largo con varios hitos o agentes |
| [AGENT-RESULT.md](AGENT-RESULT.md) | Cierre de cada entrega de agente para integración compacta |
| [ADR.md](ADR.md) | Decisión arquitectónica |
| [FINDING.md](FINDING.md) | Riesgo con evidencia |
| [EXCEPTION.md](EXCEPTION.md) | Desviación temporal permitida |
| [MODEL-CARD.md](MODEL-CARD.md) | Evaluación de modelo |
| [CAPABILITY-MATRIX.md](CAPABILITY-MATRIX.md) | Gobierno de capacidades |
| [REGULATORY-DECISION.md](REGULATORY-DECISION.md) | Aplicabilidad regulatoria |
| [RELEASE-RECORD.md](RELEASE-RECORD.md) | Entrega verificable |
| [INCIDENT-RECORD.md](INCIDENT-RECORD.md) | Gestión de incidente |
| [HANDOFF-CHECKLIST.md](HANDOFF-CHECKLIST.md) | Transferencia operable |

## Convenciones que evitan evidencia falsa

`PENDIENTE` indica información faltante; `null`, número desconocido.
`0` requiere medición o confirmación. Propuesta no equivale a ejecución.
Una autorización pendiente no es aprobada.
Usar timestamps ISO 8601 con zona, entorno y revisión.

Separar `PROPOSED`, `VERIFIED`, `PARTIAL`, `MISSING` y `NOT_APPLICABLE`.
Una casilla no sustituye evidencia. Justificar no aplicabilidad.
Identificar pendientes en resultados parciales.

## Autoría, aprobación y privacidad

La firma identifica dirección documental, no aprobación del registro.
Escribir nombres y roles únicamente cuando existan.
No inventar firmas ni revisiones independientes.

Reutilizar autorización vigente dentro de su alcance.
Revisarla ante cambios materiales de destino, costo, datos o riesgo.
Ningún registro modifica permisos superiores o levanta prohibiciones.

Guardar referencias minimizadas, sin secretos ni expedientes completos.
Sanear capturas y logs.
Limitar evidencia restringida a revisores autorizados.

## Calidad de un registro completado

- Identifica dueño, estado, alcance, entorno, versión y fecha.
- Diferencia propuesta, observación, inferencia y decisión.
- Explica método, resultado, limitación y aceptación.
- Conserva historial; evita duplicados «final».
- Permite reproducción sin privilegios innecesarios.

Los ejemplos hipotéticos no son evidencia.
Declarar hechos y limitaciones del proyecto receptor.

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**


## IA y calidad

[AI-QUALITY-ASSESSMENT](AI-QUALITY-ASSESSMENT.md) registra aplicabilidad, responsables, evidencias, riesgos, mejora continua y decisión de entrega. Enlaza privacidad, modelos y decisiones regulatorias existentes; no crea una certificación ni un segundo registro de estado.
