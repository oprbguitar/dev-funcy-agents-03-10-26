---
name: eos-user-help
description: Integrar documentación de usuario, ayuda contextual, recorridos accesibles y navegación por módulos en productos nuevos o existentes.
---

# EOS USER HELP

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Trigger

Aplicar al crear sistemas, entregar funciones con interacción humana o adoptar
un producto sin documentación de uso integrada. También al cambiar navegación,
permisos o procedimientos que invalidan una guía existente. El README técnico
no sustituye la ayuda del usuario.

Lee [EOS-CORE](../../EOS-CORE.md) y
[USER-HELP-NAVIGATION-PATTERNS](../../docs/reference/USER-HELP-NAVIGATION-PATTERNS.md).
Para decisiones visuales usa primero `pierre-design-director`; para IA, privacidad
y calidad usa [EOS PERU QUALITY](../eos-peru-quality/SKILL.md) cuando aplique.

## Entradas

- Producto, usuarios, roles, módulos/rutas reales y alcance autorizado.
- Guía, navegación, tokens y componentes existentes; restricciones de privacidad.
- Versión entregada, tareas críticas, pruebas y fuentes de referencia.

## Roles y alcance

Asigna inventario de tareas, contenido, implementación y revisión de accesibilidad
con archivos disjuntos cuando haya agentes disponibles. En ejecución secuencial,
declara la limitación de revisión independiente. Inspeccionar referencias no
autoriza iniciar sus servicios, consultar datos ni modificar sus repositorios.
No copiar código, SVG o marcas sin comprobar autorización y licencia.

## Pasos ordenados

1. En INIT, planificar la ayuda junto a las tareas del producto. En ADOPT,
   inventariar qué existe y reproducir la brecha; preservar datos e identidad.
   Si el encargo es de solo lectura, entregar hallazgo y propuesta concreta.
2. Elegir adaptación proporcional: aplicación modular, escritorio, landing o
   CLI. Justificar frontend no aplicable para CLI/servicios; proveer `--help` o
   equivalente y manual operativo. No crear módulos ficticios ni frontend vacío.
3. Completar [USER-GUIDE-CHECKLIST](../../templates/USER-GUIDE-CHECKLIST.md)
   con rutas/roles, tareas críticas, responsables y criterios verificables.
   Reutilizar la estructura documental del proyecto antes de crear otra.
4. Escribir pruebas de comportamiento para los cambios funcionales: acceso a
   ayuda, búsqueda, permisos, enlaces, teclado y controles del recorrido.
   Verificar el fallo inicial que justifica el cambio antes de implementarlo.
5. Redactar primeros pasos y procedimientos específicos con requisitos, pasos,
   resultado, recuperación y permisos. Usar ejemplos/capturas sintéticos,
   glosario y límites reales; no documentar funciones futuras como disponibles.
6. Implementar acceso visible dentro del producto, índice buscable y ayuda del
   módulo actual. Filtrar índices/documentos/caché según autorizaciones; validar
   renderizado seguro y enlaces. Si corresponde, usar panel paralelo en desktop
   y adaptación móvil, sin perder cambios en curso.
7. Adoptar grupos desplegables e iconos solo si ayudan a navegar los módulos
   reales: nombres accesibles, texto, estado activo, foco y permisos coherentes.
   Mantener estilo/tokens del producto; aplicar el harness visual en cambios UI.
8. Para recorridos, ofrecer saltar/cerrar, desactivar automatismo y reactivar
   desde Ayuda o Preferencias. Probar estados distintos, objetivos ausentes,
   teclado y movimiento reducido. Los ejemplos no ejecutan operaciones reales.
9. Verificar checklist con evidencia de la versión: unitarias e integración
   donde corresponda, E2E de tarea crítica, roles/enlaces directos, teclado,
   360/768/1280/1600 y `prefers-reduced-motion`. Pasar pruebas del harness no
   demuestra que un consumidor tenga una ayuda operativa.
10. Actualizar guía con la función, enlazar desde la UI y registrar resultado
    PASS/FAIL/NOT_RUN/NOT_APPLICABLE con razones. Una guía incompleta no se declara terminada.
    Publicar/push solo dentro de la autorización vigente del usuario.

## Salidas y gate

- Manual de usuario real accesible desde el producto, con contenido por tarea.
- Navegación/iconos proporcionados al dominio y ayuda contextual autorizada.
- Checklist con versión, rutas, roles, pruebas y limitaciones explícitas.
- Pendientes acotados cuando no hay autorización de implementación o una
  excepción de entrega documentada; nunca sustitución por una plantilla vacía.

No afirmar certificación, accesibilidad total ni funcionamiento de una función
de IA sin evidencia específica. Las referencias son precedentes de diseño;
cada producto debe satisfacer los contratos y las pruebas por sí mismo.
