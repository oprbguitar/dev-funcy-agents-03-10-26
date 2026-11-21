---
name: eos-data-design
description: Diseñar y construir la base de datos por etapas, conversando con el usuario en cada checkpoint (decisión, plan, avance y confirmación), con glosario, entidades, contratos, dueños, clasificación, linaje, calidad y migraciones versionadas.
---

# EOS DATA DESIGN

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Cuándo usar

En INIT cuando el producto guarda datos, y en ADOPT/MIGRATE cuando se crea, cambia o hereda un modelo de datos. También cuando el usuario pide «diseñar la base de datos», «modelar», «crear tablas» o «documentar los datos». Un cambio trivial (añadir una columna opcional sin efecto en permisos, privacidad ni informes) recorre solo las etapas 3, 6 y su checkpoint.

## Carga mínima

1. [EOS-CORE](../../EOS-CORE.md) y `node scripts/eos.mjs context "diseño base de datos esquema migración" --mode INIT --list`.
2. [SYSTEM-DESIGN-BASELINE](../../docs/reference/SYSTEM-DESIGN-BASELINE.md) §4 para decisiones de motor, esquema y escala.
3. [STORAGE-DATA](../../docs/manuals/STORAGE-DATA.md) por secciones (16 clasificación, 17 integridad, 18 migraciones, 19 acceso, 28–29 backup y restauración).
4. Si hay datos personales: [PRIVACY REVIEW](../eos-privacy-review/SKILL.md).
5. Registro de trabajo: [DATA-MODEL-RECORD](../../templates/DATA-MODEL-RECORD.md) en `docs/data/` del destino.

## Principio: construir por partes y conversar

La base de datos no se entrega de una sola vez. Se avanza **etapa por etapa**; al cerrar cada una el agente se detiene en un **checkpoint** y conversa con el usuario antes de pasar a la siguiente. Nada se crea, migra ni borra en una base real sin confirmación explícita en ese checkpoint.

Formato obligatorio de cada checkpoint (breve, en lenguaje claro):

```text
🧭 Etapa N/6 — <nombre>
Decisión que propongo: <qué y por qué, en 1–3 líneas; alternativa descartada y su motivo>
Plan de esta etapa: <pasos concretos y archivos que tocaré>
Avance: <hecho ✅ / pendiente ⏳ / bloqueado ⛔ con responsable>
Necesito de ti: <pregunta concreta o «confirma para continuar»>
```

Reglas del diálogo:

- Pregunta solo lo que cambia el diseño (volumen, quién ve qué, retención, informes, integraciones). Lo que se puede inferir del código o los documentos se presenta como hecho con su evidencia.
- Si el usuario no responde una duda secundaria, se registra como supuesto con responsable y se continúa lo independiente; una duda que afecta permisos, dinero o datos personales **bloquea** la etapa.
- Cada respuesta del usuario queda en la sección *Decisiones* del registro, con fecha.
- El usuario puede pedir volver a una etapa anterior; el agente indica qué etapas posteriores se reabren.

## Etapas

| # | Etapa | Entrega | Concepto aplicado |
|---|---|---|---|
| 1 | **Dominio y glosario** | Términos del negocio con definición, sinónimos y dueño; casos de uso y cifras estimadas | Glosario de negocio: un término, una definición, un responsable |
| 2 | **Entidades y nombres** | Lista de entidades, relaciones y cardinalidades; jerarquía de nombres totalmente calificados `servicio.base.esquema.tabla.columna` | Entidades tipadas con identificador estable y nombre jerárquico único |
| 3 | **Esquema y contratos** | Tablas, tipos, claves, restricciones e índices; contrato de cada tabla (columnas garantizadas, semántica, frescura) definido como esquema legible por máquina | El esquema es la fuente de verdad; código y documentación se derivan de él |
| 4 | **Dueños y clasificación** | Dueño y dominio por entidad; etiquetas de sensibilidad por columna (`PII.Sensible`, `PII.NoSensible`, `Interno`, `Público`) y la política de acceso que implica | Propiedad explícita, dominios y clasificación con etiquetas jerárquicas |
| 5 | **Linaje y calidad** | De dónde viene y a dónde va cada dato (tabla y columna); pruebas de calidad por tabla: unicidad, no nulos, rangos, referencias, frescura | Linaje a nivel de tabla y columna; suites de pruebas de calidad con resultado registrado |
| 6 | **Migración y catálogo** | Migraciones versionadas y reversibles; datos semilla sintéticos; diccionario publicado en `docs/data/`; versión del modelo incrementada con su registro de cambios | Versionado de entidades y eventos de cambio auditables |

### Detalle por etapa

1. **Dominio y glosario.** Extrae términos de la petición, pantallas y código existente. Separa lo que el negocio llama igual pero significa distinto. Estima usuarios, filas por año y lecturas/escrituras para elegir motor (§4.1 de la guía de diseño). Checkpoint: glosario y motor propuesto.
2. **Entidades.** Dibuja el diagrama entidad-relación (Mermaid `erDiagram` en el registro). Define clave primaria, id público y regla de borrado de cada entidad. Checkpoint: diagrama y cardinalidades.
3. **Esquema y contratos.** Escribe DDL o definición del ORM con restricciones en base de datos. Declara el contrato por tabla y los índices con la consulta que los justifica. Checkpoint: esquema y contratos; aún no se aplica a ninguna base real.
4. **Dueños y clasificación.** Asigna responsable humano por entidad; clasifica columnas; deriva permisos (quién lee, quién escribe, qué se enmascara) y retención. Con datos personales coordina PRIVACY REVIEW. Checkpoint: matriz de acceso.
5. **Linaje y calidad.** Registra orígenes (formulario, importación, integración) y destinos (informes, exportaciones, IA, backups). Define pruebas de calidad ejecutables y su umbral. Checkpoint: pruebas y qué pasa si fallan.
6. **Migración y catálogo.** Genera migración con ida y vuelta, pruébala en una base desechable con semilla sintética, documenta restauración y publica el diccionario. Aplicar en una base compartida o de producción es operación externa: requiere autorización explícita en el checkpoint. Checkpoint final: resumen, evidencia y siguiente paso.

## Roles

`eos-planner` arma el plan de etapas; `eos-architect` decide motor, esquema y ADR; `eos-tdd-guide` + `eos-implementer` escriben pruebas de calidad y migraciones; `eos-security-reviewer` revisa clasificación y acceso; `eos-docs-writer` publica el diccionario. Si el host no ofrece subagentes, ejecuta los roles en secuencia y decláralo.

## Contrato de salida

- [DATA-MODEL-RECORD](../../templates/DATA-MODEL-RECORD.md) completo por entidad, con decisiones fechadas.
- ADR por cada decisión estructural (motor, CP/AP, desnormalización, partición).
- Migraciones y pruebas en el repositorio; resultados reales o `NOT_RUN` con motivo.
- Entrada en `docs/EOS-PROJECT-STATUS.md` y bloque `eos-result`.

## Límites

No crea servicios de catálogo, no instala plataformas de metadatos ni conectores y no usa datos personales reales para pruebas. Los conceptos de catálogo (glosario, linaje, clasificación, pruebas de calidad, versionado) se aplican como documentación y código del propio producto salvo que el usuario autorice una herramienta. Ninguna prueba de calidad acredita cumplimiento legal.

## Procedencia

Las etapas 1–6 aplican, redactados de nuevo, conceptos del modelo de metadatos de [OpenMetadata](https://github.com/open-metadata/OpenMetadata) (Apache-2.0; commit `0b8b4e875530e3a6cf20cc5f1638d77bbd72c484`, consultado 2026-11-21): esquemas como fuente de verdad, nombres totalmente calificados, glosario, propiedad y dominios, clasificación por etiquetas, linaje, pruebas de calidad y versionado de entidades. No se copia código ni se adopta la plataforma.
