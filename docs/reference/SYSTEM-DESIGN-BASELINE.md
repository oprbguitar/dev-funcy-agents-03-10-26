# Diseño de sistemas inicial: robusto, consistente y proporcional

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Guía para que un agente proponga el **primer diseño** de un sistema y su base de datos sin sobredimensionar. Se usa en INIT y en cambios materiales de ADOPT junto con [STORAGE-DATA](../manuals/STORAGE-DATA.md), [UPDATES-RELIABILITY](../manuals/UPDATES-RELIABILITY.md) y la skill [DATA DESIGN](../../skills/eos-data-design/SKILL.md). Cada decisión se registra en un [ADR](../../templates/ADR.md).

> Adaptación y síntesis en español de conceptos de *The System Design Primer* (Donne Martin, licencia CC BY 4.0, commit `ae9bbd7b02d90b9866215de185217d33f39ab733`, consultado 2026-11-21) — ver §10. Las cifras son órdenes de magnitud ilustrativos, no mediciones.

## 1. Método en cuatro pasos

1. **Casos de uso, restricciones y supuestos.** Quién usa el sistema, qué hace, cuántos usuarios, lecturas/escrituras por segundo, volumen por año, latencia aceptable, disponibilidad requerida, presupuesto y jurisdicción. Lo desconocido queda como supuesto explícito con responsable.
2. **Diseño de alto nivel.** Componentes principales y flujo de una petición; un diagrama de contexto basta.
3. **Componentes centrales.** API (contratos), modelo de datos, flujos críticos y sus fallos.
4. **Escalar solo donde duela.** Identificar el cuello de botella medido o previsto y aplicar el patrón mínimo (§3–§7). Cada patrón se justifica con su costo.

**Cálculo de servilleta** (ejemplo hipotético): 10 000 usuarios activos × 20 acciones/día ≈ 200 000 peticiones/día ≈ 2–3 por segundo de media y ~10× en pico. Eso cabe en **un servidor y una base relacional**; distribuir antes de tiempo solo añade fallos.

## 2. Arquitectura inicial por defecto

Salvo evidencia contraria, la primera versión es:

```text
Cliente ─► (CDN/edge opcional) ─► Aplicación monolito modular ─► Base relacional
                                        │                          (SQLite local · PostgreSQL servidor)
                                        └─► Cola de tareas simple (tabla o proceso) para trabajos lentos
```

- **Monolito modular:** módulos con fronteras claras (dominio, datos, API) dentro de un solo despliegue. Se separa en servicios cuando un módulo necesita escalar, desplegarse o pertenecer a otro equipo de forma independiente.
- **Sin estado en la aplicación:** sesiones y archivos fuera del proceso, para poder añadir instancias detrás de un balanceador cuando haga falta.
- **Recursos reales primero:** no se asume Docker, Kubernetes ni un proveedor de nube concreto ([CAPABILITY-PROFILER](../manuals/CAPABILITY-PROFILER.md)).

## 3. Compromisos fundamentales

| Concepto | Qué decidir | Regla práctica |
|---|---|---|
| Rendimiento vs escalabilidad | ¿Lento para un usuario o lento bajo carga? | Lo primero es un problema de código/consulta; lo segundo, de arquitectura |
| Latencia vs throughput | Tiempo por operación vs operaciones por segundo | Buscar throughput máximo con latencia aceptable |
| CAP (con particiones de red) | Consistencia o disponibilidad | **CP** para dinero, inventario, permisos; **AP** para feeds, contadores, catálogos |
| Consistencia | Débil, eventual o fuerte | Fuerte dentro de una transacción relacional; eventual entre servicios y réplicas |
| Disponibilidad | Cuántos nueves y a qué costo | 99,9 % ≈ 8 h 46 min de caída/año; 99,99 % ≈ 52 min. Componentes en serie multiplican su disponibilidad (bajan); en paralelo la suben |
| Failover | Activo-pasivo o activo-activo | Activo-pasivo es más simple; ambos necesitan detección de fallo y prueba de conmutación |

## 4. Base de datos

### 4.1 Relacional o NoSQL

| Elegir relacional (SQL) si… | Elegir NoSQL si… |
|---|---|
| Datos estructurados con relaciones | Datos semiestructurados o de esquema muy variable |
| Se necesitan transacciones ACID | Volumen o tasa de escritura muy alta con acceso por clave |
| Consultas ad hoc, joins e informes | Patrón de acceso conocido y simple |
| Integridad por restricciones | Escala horizontal por diseño |

**Por defecto: relacional.** Tipos NoSQL y su uso: *clave-valor* (sesiones, caché, contadores), *documentos* (contenido con estructura variable), *columna ancha* (series y eventos masivos), *grafo* (relaciones de muchos saltos).

### 4.2 Diseño del esquema

- Claves primarias propias e inmutables; id público no predecible separado si se expone.
- Restricciones en la base, no solo en la aplicación: `NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`.
- Tipos ajustados (`CHAR` de longitud fija para códigos, `TEXT` para texto libre, `DECIMAL` para dinero, `TIMESTAMP WITH TIME ZONE` en UTC).
- Columnas de auditoría: `created_at`, `updated_at`, `created_by`; borrado lógico solo cuando la retención lo exige.
- Normalizar hasta 3FN; **desnormalizar** solo con una consulta medida que lo justifique y una forma de mantener la copia consistente.
- Migraciones versionadas, reversibles y probadas sobre una copia antes de producción.

### 4.3 Rendimiento

- **Índices** en columnas de `WHERE`, `JOIN` y `ORDER BY` frecuentes; cada índice cuesta en escritura y espacio.
- Revisar el plan (`EXPLAIN`) de las consultas críticas; registrar consultas lentas.
- Evitar N+1 y joins costosos en rutas calientes; paginar con cursor.
- **Particionar tablas** grandes por fecha o tenant cuando el volumen lo justifica.

### 4.4 Escalar la base (en este orden)

1. Optimizar consultas e índices.
2. **Caché** de lecturas (§5).
3. **Réplicas de lectura** (primaria-réplica): escalan lecturas; añaden retraso de replicación y lógica de promoción.
4. **Federación:** separar bases por función (usuarios, pedidos, catálogo); complica joins entre ellas.
5. **Sharding:** repartir filas por clave (tenant, usuario); máxima escala con máxima complejidad (rebalanceo, consultas cruzadas). Solo con evidencia.

Primaria-primaria (multi-maestro) exige resolución de conflictos y se evita salvo necesidad documentada.

## 5. Caché

| Estrategia | Cómo | Riesgo |
|---|---|---|
| Cache-aside (por defecto) | La app lee caché; si falla, lee la base y guarda | Primera lectura lenta; datos viejos hasta expirar |
| Write-through | La app escribe en caché y esta en la base | Escrituras más lentas |
| Write-behind | Escribe en caché y persiste después | Pérdida de datos si la caché cae |
| Refresh-ahead | Renueva antes de expirar | Trabajo inútil si se predice mal |

Niveles: cliente, CDN, servidor web, aplicación (objetos), base de datos. Toda entrada tiene TTL y una regla de invalidación escrita; los datos de permisos y dinero no se cachean sin invalidación inmediata.

## 6. Asincronía

- **Colas de mensajes/tareas** para trabajo lento (correos, informes, IA, procesamiento de archivos). Respuesta inmediata al usuario y estado consultable.
- Tareas **idempotentes** con id único y reintentos limitados con espera creciente; cola de mensajes fallidos revisable.
- **Back pressure:** si la cola se llena, responder `429/503` con `Retry-After` en lugar de aceptar trabajo imposible.

## 7. Comunicación y componentes de red

- **REST** sobre HTTP para APIs públicas (recursos, verbos, códigos de estado); **RPC** para llamadas internas de alto rendimiento cuando haya varios servicios.
- **Balanceador de carga** (capa 4 o 7) cuando haya más de una instancia; necesita chequeos de salud y no debe ser punto único de fallo.
- **Proxy inverso** para TLS, compresión, caché estática y ocultar el origen.
- **CDN** para estáticos y contenido público; **DNS** con TTL razonable para poder mover servicios.
- Versionar la API y documentar contratos; los cambios incompatibles conviven con la versión anterior durante la transición.

## 8. Fiabilidad y seguridad

- Timeouts, reintentos con límite y *circuit breaker* en cada dependencia externa.
- Observabilidad mínima: logs estructurados con id de petición, métricas de latencia/error por ruta y alertas sobre SLO ([UPDATES-RELIABILITY](../manuals/UPDATES-RELIABILITY.md)).
- Backups automáticos **con restauración ensayada** ([STORAGE-DATA](../manuals/STORAGE-DATA.md)).
- Controles de [SECURE-CODING-BASELINE](SECURE-CODING-BASELINE.md): cifrado en tránsito, mínimo privilegio, validación de entradas, consultas parametrizadas.

## 9. Lista de revisión del diseño inicial

- [ ] Casos de uso, cifras y supuestos escritos con responsable.
- [ ] Diagrama de contexto y flujo de la petición principal.
- [ ] Modelo de datos con entidades, relaciones, restricciones y dueño (vía [DATA-MODEL-RECORD](../../templates/DATA-MODEL-RECORD.md)).
- [ ] Decisión SQL/NoSQL y CP/AP justificada por caso de uso en un ADR.
- [ ] Punto único de fallo identificado y aceptado o mitigado.
- [ ] Estrategia de caché con invalidación escrita, o «no aplica todavía».
- [ ] Trabajo lento fuera de la petición, con idempotencia.
- [ ] Backup y restauración ensayada planificados.
- [ ] Qué se escalará primero y con qué señal medida.

## 10. Atribución

Este documento adapta y resume, en español y con cambios, ideas de [The System Design Primer](https://github.com/donnemartin/system-design-primer) de Donne Martin, distribuido bajo [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Se modificó estructura, alcance y redacción para el contexto EOS; el autor original no respalda esta adaptación. Esta atribución forma parte de los límites descritos en [LICENSE-SCOPE](../../LICENSE-SCOPE.md).
