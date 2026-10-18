---
name: eos-adopt
description: Adoptar software existente mediante arqueología, baseline y mejoras acotadas que preserven datos y comportamiento.
---

# EOS ADOPT

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Trigger

Usa esta skill para entender y mantener un sistema existente.
También sirve antes de corregir un fallo en software desconocido.
Lee [EOS-CORE](../../EOS-CORE.md); abre la [constitución](../../EOS_MASTER_SYSTEM_INSTRUCTION.md) solo en las secciones que indique.
La regla central es comprender y preservar antes de reemplazar.

## Entradas

- Repositorio y entorno operativo.
- Problema observado y alcance autorizado.
- Datos, configuraciones y fuentes privadas.
- Pruebas, historial y decisiones existentes.
- Restricciones de operación y equipo receptor.
- Permisos externos concedidos.

## Alcance y roles

La arqueología inicial es de lectura.
Adoptar no autoriza automáticamente reescritura o migración.
El encargo determina qué correcciones pueden prepararse.
Asigna exploración, arquitectura, caracterización y revisión.
Invoca agentes reales disponibles con ownership explícito.
Si faltan, revisa secuencialmente y declara independencia limitada.

## Pasos ordenados

1. Revisa instrucciones, estado Git y archivos ignorados relevantes.
   Conserva cambios locales y datos fuera del control de versiones.
   No uses reset, clean ni stash automático.

2. Reconstruye arranque, módulos y dependencias.
   Identifica fuentes de verdad, flujos y efectos externos.
   Diferencia implementación, documentación histórica y supuestos.

3. Completa [PROJECT-PROFILE](../../templates/PROJECT-PROFILE.md).
   Registra tecnología desplegada, recursos y criticidad reales.
   Marca vacíos sin rellenarlos con una arquitectura idealizada.

4. Aplica [EOS STRATEGY](../eos-strategy/SKILL.md) al cambio solicitado.
   Conserva las decisiones de negocio vigentes; pregunta por vacíos que puedan
   cambiar objetivo, usuarios, mercado, operación o aceptación. Evalúa marketing,
   capacidad de personas/HR, gestión y economía sin ampliar el parche por rutina.

5. Captura baseline de funciones, pruebas y rendimiento relevante.
   Reproduce el fallo antes de modificar.
   No repitas acciones financieras o comunicaciones en producción.

6. Registra brechas en [FINDING](../../templates/FINDING.md).
   Ordena por impacto, evidencia y dependencia.
   No conviertas preferencias tecnológicas en defectos.

7. Define [TASK-PACKET](../../templates/TASK-PACKET.md).
   Limita archivos y cambios al objetivo del usuario.
   Registra decisiones nuevas en [ADR](../../templates/ADR.md).

8. Añade caracterización y pruebas negativas relevantes.
   Corrige progresivamente en rama cuando corresponda.
   Mantén interfaces y datos hasta justificar cambios incompatibles.

9. Revalida la estrategia al cambiar el alcance, antes de una entrega material
   y después de recibir evidencia nueva; conserva lo no afectado.

10. Revisa regresión, seguridad y documentación.
   Sigue [ENGINEERING-QUALITY](../../docs/manuals/ENGINEERING-QUALITY.md)
   y [UPDATES-RELIABILITY](../../docs/manuals/UPDATES-RELIABILITY.md).
   Separa resultados comprobados de operación pendiente.

## Artefactos

- Mapa del sistema y línea base reproducible.
- Perfil, hallazgos y decisiones.
- Pruebas de caracterización y corrección autorizada.
- Instrucciones reales de uso y recuperación.
- Pendientes con propietario y siguiente paso.

## Aceptación

El comportamiento anterior sigue funcionando donde debía preservarse.
El fallo autorizado tiene prueba y resultado verificable.
No hay cambios ajenos, secretos publicados ni datos reemplazados.
Los accesos y contratos afectados tienen revisión pertinente.
Otro operador puede reproducir la baseline y el cambio.

## Fallos y autorización

Si no puedes reproducir, conserva evidencia y reduce incertidumbre.
Continúa documentación o pruebas independientes sin declarar corrección.
Detén cambios que excedan alcance o amenacen datos desconocidos.
Publicar, migrar producción y cambiar recursos externos necesitan
autorización explícita aplicable; honra la ya concedida.
No instalar herramientas globales ni alterar políticas para adoptar.

**Firma editorial:** Pierre R. Boss · oprbguitar.

## Admisión transversal incremental y estado vivo

Después de la arqueología y antes del plan técnico, revisa solo los perfiles afectados por el cambio material: distribución, jurisdicciones/sector, datos/finalidades/terceros, marca y captación. Aplica sección 96 y [eos-privacy-review](../eos-privacy-review/SKILL.md), [eos-landing-brand](../eos-landing-brand/SKILL.md), [eos-desktop-release](../eos-desktop-release/SKILL.md) cuando corresponda. Conserva identidad, canales y decisiones vigentes salvo cambio autorizado. Un parche no autoriza añadir landing o infraestructura a un proyecto existente.

Mantén `docs/EOS-PROJECT-STATUS.md` del destino con [PROJECT-STATUS](../../templates/PROJECT-STATUS.md) para desarrollo material. Si ya existe un registro equivalente, enlaza/migra con declaración explícita de fuente única. No sobrescribas sin rastro conclusiones históricas ni mantengas estados duplicados. Documenta baseline comprobada, incremento, revisión, evidencia, riesgos y próxima tarea en cada hito; un parche menor actualiza su registro existente justificando dominios no afectados.

La aceptación incluye instrucciones reales por canal y decisiones afectadas con evidencia o NOT_APPLICABLE razonado. Lo no ejecutado permanece NOT_RUN; no declares cumplimiento, firma, consentimiento operativo o release por el mero hecho de documentarlos.
