# Ayuda integrada, navegación e iconos

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Este estándar aplica a productos creados o mantenidos con EOS. Un README de
instalación no sustituye el manual de la persona que usa el sistema. La entrega
incluye ayuda utilizable dentro del producto y contenido específico de las
funciones implementadas. EOS es una biblioteca de prácticas: este documento no
instala automáticamente un frontend ni modifica los repositorios de referencia.

## Evidencia y procedencia

Revisión estática del 19 de octubre de 2026, sin iniciar servicios ni consultar
datos de negocio. Los remotes locales corresponden a los repositorios indicados
por el usuario. No se verificó aquí el comportamiento renderizado de esas apps.

| Referencia | Revisión inspeccionada | Evidencia concreta |
|---|---|---|
| [Smart Storage 360](https://github.com/oprbguitar/smart-storage-360) | `27e816a1c2c0a6b74724c37480a354859f8641eb`; HEAD remoto coincidía al consultar | `static/app.js`: grupos plegables y menú compacto; `static/index.html`: accesos visibles a Ayuda; `static/js/ui.js`: símbolos SVG propios; `static/js/help.js`: panel lateral, índice, búsqueda, seguimiento del módulo, enlaces y redimensionado por teclado; `smart_storage/help.py`: catálogo por ID, audiencia y funciones habilitadas. |
| [personalERP](https://github.com/oprbguitar/personalERP) | Baseline local comprometido `2955ce09e9e2969bc811cb8f629cb6b908cf3c12`, reproducible con `git show 2955ce09e9e2969bc811cb8f629cb6b908cf3c12:ruta` | `ifm-express/public/app/app.js`: grupos plegables, iconos SVG, Ayuda y Guía; `ayuda.js`: índice filtrado por permisos y panel contextual; `guias.js`: documentos por tarea y ejemplos; `tour.js`: pasos, Saltar guía, flechas, Escape y tratamiento de movimiento reducido. |

La evidencia está fijada a los SHA citados: el checkout de personalERP cambió durante la revisión por trabajo concurrente ajeno, conservado intacto. En la consulta inicial el HEAD remoto observado era
`fc1014074e0fcc1813fcfb21fe67d1e4d7fbde4b`, diferente del baseline local.
No se atribuyen los cambios locales sin commit al remoto ni se afirma que el
baseline inspeccionado sea la última publicación. El patrón corresponde a
`ifm-express`, no a una afirmación sobre todas las interfaces Frappe del repo.

Enlaces de trazabilidad al código de Smart Storage:
[navegación](https://github.com/oprbguitar/smart-storage-360/blob/27e816a1c2c0a6b74724c37480a354859f8641eb/static/app.js),
[ayuda](https://github.com/oprbguitar/smart-storage-360/blob/27e816a1c2c0a6b74724c37480a354859f8641eb/static/js/help.js),
[catálogo](https://github.com/oprbguitar/smart-storage-360/blob/27e816a1c2c0a6b74724c37480a354859f8641eb/smart_storage/help.py).
Para personalERP, las rutas y el SHA anteriores identifican la evidencia local;
no se verificó su accesibilidad como enlaces públicos.

### Licencias y límites de reutilización

`Smart Storage 360/LICENSE` declara software propietario, todos los derechos
reservados. `personalERP/LICENSES.md` inventaría licencias de upstream y deja
pendiente la licencia de la app propia; no concede una licencia general a su UI.
EOS incorpora contratos de comportamiento redactados nuevamente, sin copiar
código, SVG, imágenes, marca ni documentación de esos productos. Si se reutiliza
material en una implementación posterior, comprobar titularidad, autorización,
licencia de cada dependencia y avisos que deban conservarse. No asumir Lucide:
las superficies inspeccionadas usan definiciones SVG propias.

## Decisión por tipo de producto

| Superficie real | Adaptación requerida |
|---|---|
| Aplicación con varios módulos | Navegación por grupos de tareas reales, desplegables cuando ayuden a orientarse; menú compacto y acceso visible a ayuda. |
| Interfaz pequeña o landing | Navegación simple proporcional; ayuda, preguntas frecuentes o instrucciones de sus acciones reales. No añadir un sidebar vacío. |
| Aplicación de escritorio | Ayuda accesible desde menú o barra del producto, conservando el flujo de trabajo y funcionamiento local previsto. |
| CLI o servicio sin interfaz humana gráfica | `--help` o equivalente idiomático, manual de operaciones y ejemplos ejecutables seguros; frontend no aplicable con justificación. |

Conservar identidad, framework, tokens y componentes revisados del producto.
Antes de una implementación visual, aplicar `pierre-design-director`, registrar
dirección y tokens y verificar sus gates. El presente catálogo no prescribe una
paleta ni crea pantallas. Una función de IA habilitada en un menú no demuestra
que exista un proveedor configurado o una capacidad operativa.

## Contratos de navegación e iconografía

- Agrupar según tareas y permisos reales. Los grupos vacíos desaparecen; los
  enlaces conducen a rutas existentes. La sección activa permanece reconocible
  y su grupo puede abrirse al navegar por enlace directo.
- Usar botones para desplegar, enlaces para navegar, `aria-expanded` y
  `aria-controls` coherentes. Un disclosure de navegación no se convierte en
  `role="menu"` sin implementar el comportamiento de teclado correspondiente.
- Tab recorre controles visibles; Enter o Espacio despliegan botones. Los hijos
  cerrados no reciben foco. Un drawer móvil cierra con Escape y devuelve el foco
  al activador; si es modal, contiene el foco y vuelve inerte el fondo.
- Iconos consistentes del sistema aprobado, acompañados de texto en navegación
  normal. En modo compacto hay nombre accesible y ayuda visible con foco o
  puntero; `title` solo no basta. SVG decorativos quedan fuera del árbol
  accesible; no usar emoji como sustituto de controles de navegación.
- Hover, active, focus-visible, disabled, loading y selected tienen tratamiento
  cuando aplican. Color e icono no son la única señal de estado.
- Conservar datos sin guardar al abrir/cerrar ayuda o navegación. Ocultar un
  enlace no reemplaza autorización del backend.

## Contrato del centro de ayuda

1. Un acceso persistente «Ayuda» o «Ayuda y documentación» abre el manual desde
   la interfaz. Un enlace al repositorio técnico por sí solo no cumple.
2. El índice contiene primeros pasos, temas por módulo habilitado, tareas,
   glosario, errores frecuentes, recuperación y permisos. Cada tema tiene ID
   estable, título, resumen, audiencia, ruta/módulo y versión revisada.
3. Cada procedimiento explica objetivo, requisitos/rol, ubicación exacta de los
   controles, pasos, resultado esperado, límites, errores y cómo corregirlos.
   Capturas o ejemplos usan datos sintéticos rotulados y texto alternativo.
4. La búsqueda encuentra títulos, resúmenes y contenido autorizado; muestra
   estado sin resultados. No indexa datos de negocio ni documentos restringidos.
   Limitar carga, concurrencia y caché al tamaño real del manual.
5. La ayuda contextual abre el tema del módulo actual; «Seguir módulo» es
   opcional. Un enlace al módulo respeta permisos y cambios sin guardar.
   Señalar un control es explicativo: no ejecuta una operación de negocio.
6. En escritorio puede usarse panel paralelo; en móvil se adapta sin tapar
   controles indispensables. Cerrar restaura foco. Carga, error y reintento son
   legibles y no muestran trazas, rutas privadas ni secretos.
7. Tanto el índice como documentos, buscador, enlaces directos y caché respetan
   autorización. La documentación técnica administrativa queda separada por
   audiencia. Un catálogo estático público no incluye contenido confidencial.
8. Publicar solo documentos reales y completos. «Documento en preparación» no
   satisface un gate de guía para una tarea entregada, aunque una referencia
   inspeccionada use ese fallback. Actualizar guía junto al cambio funcional.

Si hay IA, describir qué acción la usa, datos que recibe/envía, proveedor real
cuando corresponda, límites, revisión humana y alternativa disponible. Validar
afirmaciones normativas mediante [EOS PERU QUALITY](../../skills/eos-peru-quality/SKILL.md);
no presentar un checklist como certificación ISO o garantía legal.

## Guía inicial y recorridos

Un recorrido aporta orientación breve y enlaza al manual completo. No reemplaza
procedimientos. Debe ofrecer Saltar, cerrar, desactivar recorridos automáticos y
reactivar/repetir desde Ayuda o Preferencias. Saltar, terminar y desactivar son
estados distintos. No bloquear la operación para forzar una guía ni reproducirla
en cada ingreso. Guardar únicamente preferencias necesarias, separadas por
usuario/instalación y versión cuando corresponda; sin tracking innecesario.

Usar ejemplos que nunca escriban registros reales ni envíen transacciones.
No mostrar pasos de módulos sin permiso o aún inexistentes. Resolver objetivos
ausentes sin errores ni pasos vacíos. Verificar foco, Escape, lectura del paso,
orden de teclado y `prefers-reduced-motion`; los efectos no deben parpadear ni
depender de animación para comunicar la explicación.

Las fuentes inspeccionadas evidencian Saltar y el acceso Guía para repetir.
No se comprobó una preferencia global de desactivación ni cumplimiento total de
accesibilidad: son requisitos EOS a validar, no capacidades heredadas por copia.

## Adopción y gate de entrega

En ADOPT, inventariar rutas, roles, funciones, ayuda y guías actuales; registrar
la brecha y el recorrido crítico que el usuario no puede completar sin ayuda.
Dentro del alcance de implementación autorizado, añadir contenido e integración
visible en el mismo incremento. Una auditoría estrictamente de lectura produce
brecha y tarea concreta, sin editar el producto por iniciativa propia. Un registro
vacío, enlace roto o plantilla pendiente no corrige la ausencia de ayuda.

Completar [USER-GUIDE-CHECKLIST](../../templates/USER-GUIDE-CHECKLIST.md) con
evidencia por versión: rutas y búsqueda, rol permitido/denegado y enlace directo,
teclado/foco, responsive 360/768/1280/1600, movimiento reducido, errores de carga,
recorrido saltar/desactivar/reactivar y un procedimiento crítico ejecutado con
datos sintéticos. Cuando aplique, probar backend además de UI. Los checks de
archivos del harness no prueban estos comportamientos en un producto consumidor.
Un incumplimiento del gate aplicable bloquea declarar la guía terminada; registrar
excepción justificada, responsable y plazo si el proceso permite una entrega
condicionada. No marcar PASS a verificaciones no realizadas.
