---
name: eos-release
description: Preparar y verificar una release reproducible, revisada y vinculada a commit exacto dentro de la autorización concedida.
---

# EOS RELEASE

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Trigger

Usa esta skill al preparar entrega, publicación o despliegue.
Lee [EOS-CORE](../../EOS-CORE.md); abre la [constitución](../../EOS_MASTER_SYSTEM_INSTRUCTION.md) solo en las secciones que indique
y [UPDATES-RELIABILITY](../../docs/manuals/UPDATES-RELIABILITY.md).
Un push no demuestra un producto desplegado.

## Entradas

- Cambio final y rama de trabajo.
- Requisitos y criterios de aceptación.
- Pruebas, riesgos y excepciones.
- Entorno, remoto y versión objetivo.
- Artefactos, configuración y recuperación.
- Alcance externo explícitamente autorizado.

## Alcance y roles

Preparación local puede avanzar hasta un resultado revisable.
Publicación y producción necesitan autorización explícita aplicable.
Asigna calidad, seguridad y operación a roles disponibles.
Si faltan revisores independientes, declara revisión propia.
No inventes un check, firma o aprobación.
No instales herramientas globales ni cambies políticas del host.

## Pasos ordenados

1. Inspecciona estado Git y alcance final.
   Preserva cambios ajenos y datos ignorados.
   Identifica exactamente qué archivos integran la entrega.

2. Ejecuta pruebas proporcionales al cambio.
   Verifica build, tipos, integración y flujos críticos donde apliquen.
   No inventes tests de aplicación en una biblioteca documental.

3. Revisa secretos y material privado antes del commit.
   Inspecciona diff y staging reales.
   Audita dependencias cuando existan manifiestos pertinentes.
   Nunca publiques `.env`, certificados o datasets privados inadvertidos.

4. Resuelve defectos críticos o documenta bloqueo.
   Usa [EXCEPTION](../../templates/EXCEPTION.md) para desviaciones
   con responsable, vigencia y autorización requeridas.
   No desactives controles para conseguir verde.

5. Crea artefacto e identifica commit exacto.
   Registra hash, versión, requisitos y procedencia.
   La revisión debe corresponder a ese árbol inmutable.
   Si cambian archivos, revisa y verifica el nuevo resultado.

6. Completa [RELEASE-RECORD](../../templates/RELEASE-RECORD.md).
   Incluye pruebas, riesgos, backup y rollback.
   Prepara notas claras y handoff operativo.

7. Comprueba autorización existente.
   Usa remoto, rama y entorno aprobados.
   No amplíes publicación de código a despliegue de producción.
   Si falta permiso, entrega artefacto listo y detén esa acción.

8. Publica o despliega únicamente lo autorizado.
   Verifica commit remoto, artefacto o destino real correspondiente.
   Prueba funcionamiento y versión efectiva cuando aplique.

## Gates independientes por canal

Prepara una fila por canal con commit/artefacto, entorno, responsable, evidencia y `PASS | FAIL | NOT_RUN | NOT_APPLICABLE`. Un gate no hereda resultado de otro canal. Ausencia de producto ejecutable produce pruebas runtime `NOT_RUN`; un canal fuera del alcance admite `NOT_APPLICABLE` motivado.

| Canal | Condición y evidencia mínima |
|---|---|
| Web estática | Build, assets, URL/DNS/HTTPS, cache/cabeceras, enlaces/CTA, accesibilidad y tráfico/almacenamiento según decisión de privacidad; rollback probado |
| Web dinámica/API | Además auth/sesiones/aislamiento, configuración/secretos, migración, backup/restore y flujo crítico remoto |
| Escritorio | [eos-desktop-release](../eos-desktop-release/SKILL.md): instalación por SO/arquitectura, artefacto/hash, firma/autenticidad, offline, updater/migración, datos locales y recuperación |
| Híbrido/móvil | Compatibilidad cliente-servidor, reconexión/conflictos o permisos/store según modalidad; no inferir aprobación de tienda |
| Contenido público/comercial/jurídico | Claims reales, derechos de assets, marca aprobada, obligaciones/avisos pertinentes y autorización de publicar esa versión |

Comprobar una landing o push no certifica backend, escritorio ni campaña. Un instalador local correcto no demuestra URL de descarga pública íntegra. Revisa cambios en cookies, proveedores, contratos o audiencia antes de activar publicación. No conviertas borradores legales en instrumentos revisados por haber pasado tests. Conserva handbook y notas de operación actualizados en el mismo hito.

## Artefactos y aceptación

- Commit y artefacto identificables.
- Evidencia de pruebas y revisión de secretos.
- Registro de release y notas de uso.
- Recuperación y pendientes visibles.

Aceptar exige consistencia entre código revisado y entregado.
Los checks deben pertenecer al commit declarado.
Una descarga prometida se verifica en su URL real.
Una release preparada sin publicar se declara como preparada.
La firma editorial no es firma criptográfica del propietario.

## Fallos y autorización

Detén publicación ante secreto, divergencia o artefacto no íntegro.
Continúa correcciones y verificaciones locales independientes.
No sobrescribas historia ni cambies visibilidad para resolver fallos.
Reutiliza autorización expresa dentro de su alcance.
Rollback sigue su política aprobada y conserva datos y efectos externos.

**Firma editorial:** Pierre R. Boss · oprbguitar.
