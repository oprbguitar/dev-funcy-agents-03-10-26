# Shell de navegación: menú plegable, temas, guía, documentación y administrador

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Patrón base de distribución para toda aplicación EOS con interfaz. Complementa [USER-HELP-NAVIGATION-PATTERNS](USER-HELP-NAVIGATION-PATTERNS.md) y la skill [USER HELP](../../skills/eos-user-help/SKILL.md) (sección 98). Es un **patrón propuesto**, derivado de la inspección de una aplicación propia del propietario y redactado de nuevo; no copia código. Se adapta a la identidad del producto: en ADOPT se conserva la navegación existente y solo se cubren las carencias.

## 1. Requisitos mínimos (siempre presentes)

| # | Requisito | Aceptación |
|---|---|---|
| R1 | Menú lateral **plegable**: completo ↔ compacto (solo iconos) | Un botón y un atajo alternan; la preferencia persiste |
| R2 | **Cajón** en pantallas angostas (< 900 px) con fondo que cierra al tocar | Sin scroll horizontal a 360 px |
| R3 | **Varios temas** visuales seleccionables, incluidos alto contraste claro y oscuro | Cambiar tema no recarga ni parpadea |
| R4 | Acceso permanente a **Guía** (ayuda por sección) | Visible en todo estado del menú |
| R5 | Acceso permanente a **Documentación** (todas las secciones de un vistazo) | Visible en todo estado del menú |
| R6 | Acceso permanente a **Administrador** | Enlace visible; contenido protegido en servidor |
| R7 | Navegación agrupada **por intención del usuario**, no por tabla de datos | Ningún grupo con más de ~7 ítems |
| R8 | Operable por teclado y lector de pantalla | Ver §6 |

## 2. Anatomía

```text
┌──────────────────────────────────────────────────────────────────┐
│ ☰  Marca         [ Buscar…            ]        🎨 Tema  ⚙ Vista   │  cabecera
├────────────┬─────────────────────────────────────────┬───────────┤
│ DESCUBRIR  │                                         │ Panel     │
│  ⌂ Inicio  │           Contenido del módulo          │ contextual│
│  ▤ Lista   │                                         │ plegable  │
│ ENTENDER   │                                         │  ⇥        │
│  ◎ Mapa    │                                         │           │
│ CONSTRUIR  │                                         │           │
│  ⚒ Taller  │                                         │           │
│ ADMIN 🔒   │  (solo con sesión de administrador)     │           │
│────────────│                                         │           │
│ ❓ Guía     │                                         │           │
│ 📖 Docs     │                                         │           │
│ 🔑 Admin    │                                         │           │
└────────────┴─────────────────────────────────────────┴───────────┘
 Compacto: la columna izquierda muestra solo iconos con tooltip.
 Móvil: cajón + barra inferior con 4 destinos principales.
```

- **Cabecera:** marca, botón de menú (`aria-expanded`), búsqueda, selector de tema y menú *Vista* (menú compacto, densidad, panel contextual).
- **Grupos sugeridos:** *Descubrir* (qué hay), *Entender* (análisis), *Construir* (herramientas), *Mío* (favoritos, historial), *Administración* (solo administradores). Se renombran según el dominio.
- **Pie del menú:** Guía, Documentación y Acceso administrador; nunca se ocultan al compactar (pasan a icono con etiqueta accesible).
- **Panel contextual plegable** a la derecha: al cerrarlo, tablas y mapas usan todo el ancho; su estado se recuerda por módulo.

## 3. Modelo de datos de navegación

Una sola lista declarativa alimenta menú completo, compacto, cajón, barra móvil, documentación y guía, para que no diverjan.

```ts
// Ejemplo ilustrativo.
type NavGroup = 'discover' | 'understand' | 'build' | 'mine' | 'admin';
type NavItem = {
  path: string;            // ruta única
  labelKey: string;        // clave de traducción; nunca texto fijo en el componente
  icon: IconComponent;     // icono siempre acompañado de etiqueta o aria-label
  group: NavGroup;
  adminOnly?: boolean;     // se oculta a visitantes; el servidor igual autoriza
  guide?: { title: string; steps: string[] };   // tarjeta de ayuda de la sección
};
const visibleNav = (items: NavItem[], isAdmin: boolean) => items.filter(i => isAdmin || !i.adminOnly);
```

## 4. Estados del menú

| Estado | Cuándo | Comportamiento |
|---|---|---|
| `full` | Escritorio, preferencia por defecto | Icono + etiqueta + títulos de grupo |
| `compact` | Escritorio, elegido por el usuario | Solo iconos; tooltip al pasar o enfocar; títulos de grupo como separadores |
| `drawer` | Ancho < 900 px | Oculto; se abre sobre el contenido con fondo; `Escape` o tocar fuera lo cierra y devuelve el foco al botón |

- La preferencia `full/compact` se guarda localmente; en `drawer` se ignora sin perderla.
- El estado se aplica **antes del primer pintado** (script mínimo en `<head>`) para evitar saltos.
- Toda lectura/escritura de almacenamiento local va en `try/catch`: en modo privado la app funciona con los valores por defecto.

## 5. Temas

**Base + paleta:** unas pocas *bases* definen los tokens que usan los componentes (`light`, `dark`, `pastel`, `contrast-light`, `contrast-dark`); las *paletas* solo re-tiñen tokens sobre una base (por ejemplo `mint` o `sunset` sobre `pastel`, `obsidian` sobre `dark`). Así una paleta nueva hereda todos los ajustes ya hechos para claro u oscuro.

```css
/* Ejemplo ilustrativo: tokens por base, re-teñido por paleta. */
:root[data-theme="light"]  { --bg:#f7f8fc; --surface:#fff;    --ink:#1d2340; --accent:#5b5bd6; color-scheme:light; }
:root[data-theme="dark"]   { --bg:#12152a; --surface:#1c2140; --ink:#eef0ff; --accent:#9b9bff; color-scheme:dark; }
:root[data-theme="contrast-dark"] { --bg:#000; --surface:#000; --ink:#fff; --accent:#ffde00; }
:root[data-palette="mint"] { --accent:#0f9d8a; }
```

Orden de resolución del tema inicial:

1. Preferencia guardada válida.
2. `prefers-contrast: more` → variante de alto contraste (clara u oscura según `prefers-color-scheme`).
3. Tema por defecto del producto.

Reglas: el selector muestra una muestra de color y el nombre de cada tema; contraste AA mínimo en todos (AAA en los de alto contraste); ningún tema depende solo del color para comunicar estado; respetar `prefers-reduced-motion`.

## 6. Teclado y accesibilidad

- Botón de menú y menús desplegables siguen el modelo *menu button* de WAI-ARIA: abrir enfoca el ítem marcado o el primero; flechas, `Home` y `End` mueven; `Escape` cierra y devuelve el foco al disparador; `Tab` o clic fuera cierra.
- Ítem activo con `aria-current="page"`; en compacto cada icono tiene `aria-label` y tooltip también al enfocar.
- Enlace «Saltar al contenido» al inicio; foco visible en todos los temas.
- Objetivos táctiles ≥ 44 px en cajón y barra móvil.

## 7. Guía y documentación integradas

- **Guía (❓):** activa una tarjeta por sección que sigue la ruta actual: qué es, para qué sirve, pasos y siguiente/anterior entre secciones. Se puede cerrar, desactivar y reactivar desde el mismo botón.
- **Documentación (📖):** panel con todas las secciones, búsqueda y enlace a la documentación interna completa. Las secciones de administrador aparecen solo con sesión de administrador.
- Un indicador suave marca Guía y Documentación hasta el primer uso; nada parpadea.
- El contenido de la guía sale de la misma lista de navegación (§3), así no queda desactualizado cuando se añade una sección.

## 8. Acceso administrador

- El pie del menú siempre muestra **Acceso administrador**: lleva al inicio de sesión o, con sesión activa, a la consola.
- Los ítems `adminOnly` se ocultan a visitantes. Si alguien llega por URL directa ve una página breve que explica que es una herramienta interna, ofrece una alternativa pública y un enlace «Soy el administrador»; nunca una página llena de errores.
- **Ocultar no es proteger:** cada endpoint de administración verifica sesión y rol en servidor, con MFA para administradores (ver [SECURE-CODING-BASELINE](SECURE-CODING-BASELINE.md) §5 y §10).
- En desarrollo local puede tratarse al operador como administrador solo si el servidor escucha en `localhost` y esa regla está documentada; nunca en un despliegue público.

## 9. Pruebas de aceptación

- [ ] Alternar completo/compacto con botón y atajo; recargar conserva la elección; sin salto visual al cargar.
- [ ] A 360 px el menú es cajón, se cierra con `Escape` y fondo, y el foco vuelve al botón.
- [ ] Cada tema aplica sin recarga; alto contraste supera AA (verificación automatizada de contraste).
- [ ] Guía, Documentación y Acceso administrador son alcanzables por teclado en los tres estados del menú.
- [ ] Un visitante no ve ítems de administración; por URL directa recibe la página explicativa; la API responde `401/403`.
- [ ] Con almacenamiento local bloqueado la app carga con valores por defecto.
- [ ] Añadir una sección a la lista de navegación la hace aparecer en menú, documentación y guía sin otro cambio.
