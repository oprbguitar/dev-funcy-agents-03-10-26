---
name: eos-init
description: Crear un producto con perfil, capacidades justificadas, arquitectura y evidencia proporcional al alcance autorizado.
---

# EOS INIT

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Trigger

Usa esta skill al iniciar software nuevo o una capacidad nueva aislada.
Un repositorio existente normalmente requiere ADOPT antes de cambios mayores.
Lee [EOS-CORE](../../EOS-CORE.md); abre la [constitución](../../EOS_MASTER_SYSTEM_INSTRUCTION.md) solo en las secciones que indique
y las instrucciones locales del destino.

## Entradas

- Problema, usuarios y tareas prioritarias.
- Criticidad, países y datos tratados.
- Plataforma, operación offline y restricciones.
- Recursos disponibles y presupuesto.
- Alcance de implementación y publicación.
- Identidad existente y criterios de aceptación.

## Alcance y roles

Inspección y diseño pueden avanzar sin desplegar.
Implementa solo cuando forme parte del encargo.
Si el usuario pide únicamente arquitectura, conserva esa fase documental.
Planificación, arquitectura, pruebas y seguridad necesitan responsables.
Usa agentes disponibles; si faltan, asume roles secuencialmente
y declara el límite de independencia.
No inventes equipos ni permisos.

## Pasos ordenados

1. Comprueba entorno, instrucciones y archivos existentes.
   Conserva trabajo ajeno y detecta dependencias reales.

2. Aplica [EOS STRATEGY](../eos-strategy/SKILL.md) antes de decidir el producto.
   Completa la entrevista con respuestas ya disponibles; pregunta solo por vacíos
   materiales y evalúa producto, marketing, capacidad de personas, gestión,
   economía y jurisdicción con estados explícitos.

3. Completa [PROJECT-PROFILE](../../templates/PROJECT-PROFILE.md).
   Registra hipótesis y datos pendientes sin inventar métricas.

4. Completa [CAPABILITY-MATRIX](../../templates/CAPABILITY-MATRIX.md).
   Mantén capacidades especializadas dormidas hasta justificar activación.
   Pagos, sincronización y almacenamiento avanzado son condicionales.

5. Define límites y arquitectura mínima mantenible.
   Registra decisiones en [ADR](../../templates/ADR.md).
   Evalúa alternativas con evidencia; no impongas Docker ni microservicios.

6. Conserva AI Integration Port conceptualmente disponible.
   Sigue [AI-GATEWAY](../../docs/manuals/AI-GATEWAY.md).
   IA dormida no descarga modelos, abre cuentas ni inicia gasto.
   Evalúa RAM, VRAM, privacidad y licencias antes de activarla.

7. Crea [TASK-PACKET](../../templates/TASK-PACKET.md).
   Asigna archivos, pruebas, dependencias y operaciones autorizadas.
   Para frontend aplica la dirección visual exigida por el destino.

8. Escribe pruebas de comportamiento antes de implementación pertinente.
   Construye incrementos pequeños; valida entradas y errores.
   Revisa calidad y seguridad después de cambios.

9. Revalida estrategia en las puertas estrategia→ingeniería, ingeniería→entrega
   y entrega→aprendizaje; actualiza solo las decisiones afectadas.

10. Verifica flujos críticos, configuración y recursos reales.
   Usa [ENGINEERING-QUALITY](../../docs/manuals/ENGINEERING-QUALITY.md).
   Documenta uso y operación en la estructura existente.

## Artefactos

- Perfil y matriz con estados honestos.
- Decisiones, paquete de tarea y código autorizado.
- Pruebas ejecutadas y resultados reproducibles.
- Documentación de arranque y pendientes.
- Evaluación normativa cuando el dominio lo requiera.

## Aceptación

Demuestra el flujo principal y casos negativos relevantes.
Comprueba acceso, validación y privacidad según criticidad.
La cobertura exigida por el destino acompaña pruebas útiles.
Declara capacidades propuestas que todavía no están implementadas.
Otro operador debe poder iniciar el producto siguiendo instrucciones.

## Fallos y autorización

Detén activación si faltan recursos, procedencia o permiso esencial.
Continúa diseño y pruebas independientes con supuestos etiquetados.
Publicar, contratar servicios o desplegar requiere autorización explícita.
Honra permisos ya concedidos dentro de su alcance.
No instales herramientas globales ni servicios por comodidad.

**Firma editorial:** Pierre R. Boss · oprbguitar.

## Admisión transversal y estado vivo

Antes de definir arquitectura, amplía el perfil con distribución/mercados, jurisdicciones/sector, finalidades y terceros, identidad y presencia comercial. Evalúa [eos-privacy-review](../eos-privacy-review/SKILL.md), [eos-landing-brand](../eos-landing-brand/SKILL.md) y [eos-desktop-release](../eos-desktop-release/SKILL.md) según sección 96 de la constitución. Registra razón/estado/responsable aun si no aplica. Perú depende de la operación real; no asumas banners, nube, IA o telemetría.

Un producto web nuevo público o de venta incluye por defecto un diseño/artefacto local de landing dentro del alcance autorizado. CLI, biblioteca, interno o sin presencia pública justifican NOT_APPLICABLE. Crear un diseño no autoriza alojarlo; un producto desktop puede evaluar landing sin inferir hosting.

Cuando el desarrollo sea material, crea `docs/EOS-PROJECT-STATUS.md` del destino desde [PROJECT-STATUS](../../templates/PROJECT-STATUS.md), enlazando registros canónicos. Actualiza en cada hito: baseline, rutas reales, decisiones, checks con fecha/entorno, riesgos, operación y próximo paso. Verifica guía de instalación/configuración/uso/recuperación antes de entregar; distingue PLANNED, IMPLEMENTED, VERIFIED y OPERATING. Un diseño pedido sin implementación conserva esa fase.
