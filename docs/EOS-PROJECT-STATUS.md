# EOS — estado del proyecto y consolidación 4.5

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Actualizado: 2026-10-19, America/Lima. La sección 4.5.0 al final es el estado vigente; los hitos 4.3 siguientes son antecedentes fechados. Modo ADOPT, criticidad L1. Base: `40cafdbd582cc1476a52f59b299a52a386dbd78a`. Rama: `feat/eos-4.3-lifecycle-governance`. Responsable de publicación: propietario; ejecución asistida por Codex. Autorización directa: implementar en el sistema, subir a GitHub y añadir licencia y README con guía usable. No incluye desplegar productos, campañas, gastos ni cambiar visibilidad.

## Qué se conserva y qué cambia

| Superficie | Decisión | Aceptación |
|---|---|---|
| Constitución, doce manuales y trece agentes | EXTENDER | Conservar autoridad, firma, contexto bajo demanda y pisos congelados |
| Cuatro fuentes históricas | EXISTENTE | SHA-256 sin cambios; excluidas de MIT |
| CLI e instalador | EXTENDER | Contexto obligatorio por tema e instalación portable de nuevas skills |
| Privacidad y derecho | EXTENDER + registros nuevos | Jurisdicción y finalidad antes de consentimiento; fuentes primarias y límites |
| Marca, landing y crecimiento | NUEVOS flujos sobre STRATEGY | Tokens, evidencia comercial, landing condicional y campañas autorizadas |
| Web y escritorio | EXTENDER RELEASE | Gates separados, firma/actualización/rollback y datos locales |
| Estado del proyecto | NUEVA plantilla | Registro canónico por hito en cada destino |
| Sitio público, CMP, CRM o app EOS | NOT_APPLICABLE | Esta biblioteca distribuye instrucciones, no un servicio |

## Plan reversible y responsabilidades

1. G0: inspección y baseline, planner/orquestador. Completado: árbol limpio, remoto privado confirmado y 66 pruebas previas PASS; validador previo PASS con 64 documentos, 4 fuentes, 13 agentes.
2. G1: especialista de privacidad: manual compliance, rol, skill, registro normativo y cinco plantillas.
3. G2–G3: especialista de producto/entrega: marca, landing, crecimiento y escritorio; sin instalar frameworks externos.
4. G4: especialista de gobierno: admisión, constitución, perfil, agentes y documento vivo. Mantenedor: router/instalador con TDD; orquestador: catálogo, licencia y README.
5. G5: verificar manifiesto, enlaces, firmas, fuentes, suites con cobertura, corpus de recuperación y revisión independiente del diff.
6. G6: commit firmado editorialmente y push de rama, PR revisable; confirmar SHA remoto y estado real de CI.

No hay migración de datos ni dependencias nuevas. Antes de publicación se puede descartar el diff propio tras inspección; después, revertir el commit en una rama nueva. En proyectos instalados, usar `--update --dry-run`; las ediciones locales se preservan como conflictos y las propuestas quedan en `.eos-new`. No revertir trabajo ajeno ni usar push forzado.

## Evidencia y límites

Estado de la ampliación: VERIFIED dentro del alcance de biblioteca; publicada en rama revisable mediante [PR #7](https://github.com/oprbguitar/dev-funcy-agents-03-10-26/pull/7). La integración a `main` queda pendiente de revisión y fusión. La visibilidad sigue privada.

| Comprobación local | Resultado | Evidencia |
|---|---|---|
| Catálogo, firmas, enlaces, versiones y fuentes | PASS |84 documentos,4 fuentes,13 agentes; hashes de antecedentes intactos |
| Validador | PASS |25 pruebas; cobertura100/95.21/93.10 (líneas/ramas/funciones) |
| Instalador | PASS |19 pruebas; cobertura100/93.57/100 |
| CLI EOS | PASS |29 pruebas; cobertura100/96.13/98.20 |
| Recuperación A–P + manuales nuevos | PASS |16+4 casos; Recall@10=1.000; selección de contexto, no runtime |
| Umbrales de recuperación históricos | PASS |dev0.767; holdout0.950; adversarial0.600 sin umbral |
| Whitespace | PASS |git diff --check |

RED/GREEN: cuatro pruebas nuevas fallaron antes de implementar sus controles (tres iniciales y regresión de subsecciones96); después pasaron. Ver [VERIFICATION](VERIFICATION.md) para reproducción y límites.

Las evaluaciones A–P del router comprueban selección de política, no bloquean físicamente cookies ni prueban instaladores de productos futuros. No hay aplicación desplegada para ejecutar esos controles. Runtime de landing, cookies, desktop, actualizador, telemetría y ARCO: NOT_RUN en EOS; son contratos para el producto que active la capacidad.

Fuentes jurídicas: ver [registro Perú](reference/PRIVACY-PERU-REGISTRY.md). Licencias externas: [investigación](reference/LANDING-REPOSITORY-RESEARCH.md). No se emite dictamen jurídico ni certificación. Ningún documento jurídico de cliente se publica con esta entrega.

## Uso y siguiente hito

Seguir [README](../README.md) para instalar. Los proyectos receptores crean su estado desde [PROJECT-STATUS](../templates/PROJECT-STATUS.md) en su ubicación documental canónica y guardan decisiones específicas allí. La existencia de una skill nunca basta para declarar su control VERIFIED u OPERATING.

Verificación integrada final: instalación real temporal `--host all` y actualización sin conflictos PASS; las diez skills están presentes para ambos hosts y el snapshot de84 documentos supera el validador. El gate de biblioteca se copia únicamente como referencia en `.eos/`; el producto necesita su gate propio revisado. Render Markdown de GitHub PASS: conserva picture, GIF, PNG, media de reducción de movimiento y detalles desplegables. Imagen estática inspeccionada. Revisión independiente: P2 del stemming corregido y regresión añadida; sin bloqueantes en segunda revisión.

## Publicación verificada

Commit de implementación `fbc5b862dc0e45ca078c72b7619a8cecdf368506`: SHA local igual a ref remota `feat/eos-4.3-lifecycle-governance`. [CI de push](https://github.com/oprbguitar/dev-funcy-agents-03-10-26/actions/runs/39169682169) completado en Linux y Windows con resultado SUCCESS. Este registro posterior solo documenta ese hito; los checks del PR muestran la verificación de la revisión más reciente, incluida esta actualización documental. No se fusionó `main` ni se desplegó una aplicación.


## Antecedente — 4.4.0, 2026-10-19

Modo ADOPT, L1 documental, base `b32aa646889bffd1e70fde6fa217ac2b23fcc8b4`, rama `feat/eos-4.4-peru-quality-ui`. Autorización directa del propietario: integrar referencias de IA Perú/ISO y UI/UX en el sistema local, actualizar README y subir a GitHub. Conserva visibilidad privada, fuentes históricas y trabajo anterior; no fusiona ramas, publica PDF ni despliega aplicaciones. Esta rama parte de la ampliación 4.3 ya publicada, aún no fusionada a main.

Plan realizado: inspección y baseline; dos especialistas con archivos separados (normativa y catálogo UI); integración secuencial de núcleo, constitución97, modos INIT/ADOPT/AUDIT/RELEASE, rol compliance, catálogo/versión4.4 y README. Nueva skill `eos-peru-quality`, referencia primaria y plantilla de evaluación. IA del producto permanece DORMANT/OFF: no se instalaron modelos, dependencias ni servicios. El catálogo incorpora25 candidatos; consulta parcial fechada de licencias, sin adoptar código/activos de terceros. No hay frontend; design-pick/lint y pruebas visuales corresponden al producto receptor.

Verificación local Windows/Node24.14.0:75 pruebas PASS (25 validador,19 instalador,31 CLI); coberturas líneas/ramas/funciones:100/95.21/93.10,100/92.25/100 y100/96.13/98.20 respectivamente. Validador estructural:87 documentos,4 fuentes históricas intactas,13 agentes. RED/GREEN del nuevo router observado: falló antes de implementar y pasó después; prueba E2E CLI confirma sección97 obligatoria para ISO. Instalación temporal real ambos hosts y actualización sin conflictos PASS; snapshot validado. Recuperación `peru_quality`:R@10=1.000,MRR=0.188 para2 casos; exige inclusión, no prioridad sobre otras políticas. Suites históricas mantienen umbrales; adversarialR@10=0.600 sin umbral, límite léxico conocido. No es clasificación jurídica ni control runtime.

Límites: portadas/metadatos de PDF solo identificados, no autenticados; NTC colombiana no acredita NTP. Fichas ISO9001:2026 y27701:2025 verificadas, sin revisión de cláusulas completas ni certificación. DS115 revisado en disposiciones citadas, sin dictamen exhaustivo ni calendario universal. Fuentes/ref: [IA y calidad](reference/AI-PERU-QUALITY.md), [UI](reference/LANDING-REPOSITORY-RESEARCH.md). No se recibieron los XLSX/CSV/JSON enumerados dentro del README adjunto; no se inventaron ni se declara integrado ese catálogo exhaustivo. Las verificaciones pendientes se mantienen explícitas por fuente.

Revisión independiente de código/seguridad: PASS, sin hallazgos accionables pendientes; se corrigió ruta CLI de la nueva skill y se comprobó desde raíz de receptor instalado. Publicación verificada: commit de implementación `3aa1d1aa7116fb09e6e3b3b5a5eddaadf9b515fe` coincide con la rama remota. [PR8](https://github.com/oprbguitar/dev-funcy-agents-03-10-26/pull/8) abierto contra rama4.3; depende de PR7 y no se fusionó ninguna rama. [CI del commit de implementación](https://github.com/oprbguitar/dev-funcy-agents-03-10-26/actions/runs/39364721479) SUCCESS en Ubuntu y Windows. Este registro posterior documenta ese commit; sus checks deben consultarse por separado. Recuperación: revertir los commits propios en rama nueva si se requiere; no reescribir historia ni revertir cambios ajenos. Para destinos usar --update --dry-run y resolver .eos-new conservando ediciones locales. Esta entrega modifica la biblioteca local; no instala automáticamente EOS en todos los demás proyectos ni altera skills globales.


## Antecedente — 4.4.1, análisis ENIA y ampliación ISO

Fecha: 2026-10-19, America/Lima. Continuación ADOPT sobre la misma rama y PR #8; encargo del propietario: analizar el anexo ENIA aportado y extraer datos pertinentes también de los otros documentos. Autorización de integración y publicación anterior conservada. Fuentes completas permanecen locales; se publican síntesis propias, referencias y hashes, sin PDF ni datos privados.

Entregables: [análisis ENIA](reference/ENIA-2026-2030.md), 81 páginas identificadas, cuatro ejes y 16 líneas de acción, metas seleccionadas con unidad/año/responsable/página; alcance público/privado y seguimiento diferenciados. [Calidad/privacidad](reference/AI-PERU-QUALITY.md) incorpora revisión selectiva de las copias ISO/IEC 27701 y NTC-ISO 9001, con páginas efectivamente leídas y límites de autenticidad. Se amplían estrategia, evaluación, skill IA, README y sección constitucional 97.1. No se crean servicios, modelos, agentes persistentes, reportes institucionales ni certificaciones.

Verificación local: 76 pruebas PASS (25 validador, 19 instalador, 32 CLI). Cobertura líneas/ramas/funciones: validador 100/95.21/93.10; instalador 100/93.57/100; CLI 100/96.15/98.21. Dos regresiones RED/GREEN: ENIA/RM152 no se reconocían y el detalle 97.1 no se incluía; corregidos con pruebas. Evaluación de contexto PASS, conjunto Perú 3 casos R@10=1.000, MRR=.208; selección de instrucciones, no clasificación jurídica. Validador: 88 documentos, cuatro fuentes históricas intactas y 13 agentes. Revisión visual de tabla ENIA p.69 realizada; las metas son acumuladas y blancos no equivalen a cero.

Límites: hash local no cotejado con bytes remotos. Ficha PCM y publicación El Peruano identificadas; apertura directa de ficha/CDN falló, texto aprobatorio accesible en El Peruano. Lectura ISO selectiva, sin autenticar las copias ni auditar todas sus cláusulas; la NTC sigue siendo colombiana. Los porcentajes de ENIA no son métricas medidas del producto. No se revisó estado actual de cada plataforma, guía o fondo citado, ni se los declara operativos. Revisión independiente de código/seguridad y muestreo de referencias PASS, sin hallazgos accionables; instalación temporal ambos hosts, snapshot 88 y CLI ENIA/97.1 PASS, actualización sin conflictos. Publicación verificada: commit `59452fc5346d481560cfab001fac254bf0c3071a` coincide con rama remota y actualiza [PR #8](https://github.com/oprbguitar/dev-funcy-agents-03-10-26/pull/8). [CI del incremento](https://github.com/oprbguitar/dev-funcy-agents-03-10-26/actions/runs/39365483771): Linux SUCCESS; Windows en ejecución en la última consulta. Este registro posterior documenta ese candidato; consultar sus checks por SHA. Resultados 4.4.0 anteriores no se atribuyen al candidato 4.4.1.


## Estado vigente — 4.5.0, auditoría, ayuda al usuario y consolidación

Actualización: 2026-10-19, America/Lima. ADOPT L1, base local b8ee612, rama temporal `feat/eos-4.5-hardening-help`. Autorización directa: evaluar observaciones aportadas, integrar lo conveniente, usar patrones de navegación/iconos/guías de Smart Storage/personalERP y fusionar todo en una sola rama del repositorio EOS. No comprende cambios de datos, finanzas, despliegues o edición de las aplicaciones de referencia. Se inspeccionan como fuentes; trabajo concurrente en personalERP preservado.

Plan: baseline/contraste auditoría; especialistas separados para run/gate, instalador y ayuda; integración secuencial del orquestador; revisión independiente de seguridad y documentación; verificación real de instalación y suites; publicación/CI/fusión a main. Se mantienen doce manuales mayores y cuatro archivos fuente históricos sin cambios. El núcleo y la constitución se extienden con sección98; catálogo de doce skills y 13 agentes. La biblioteca no tiene frontend, por lo que pruebas visuales/harness de una app EOS son NOT_APPLICABLE; los productos receptores deben implementar/probar su ayuda según la nueva skill.

[Respuesta a auditoría](AUDIT-RESPONSE.md): distingue implementado y backlog. [Ayuda/patrones](reference/USER-HELP-NAVIGATION-PATTERNS.md): SHAs de las dos referencias, sin código/activos copiados, sin iniciar servicios ni consultar datos privados. Nuevo [checklist](../templates/USER-GUIDE-CHECKLIST.md). INIT/ADOPT/AUDIT/RELEASE, perfil, documentación de navegación y README conectados; ayuda visible en apps, equivalente de comandos/manual en CLI y biblioteca. No se declara que todos los sistemas existentes ya tengan guía.

Consolidación previa confirmada: PR#7 fusionado en main `70c89b14ffc71d3c319fb59a140ee05671142815`; PR#8 retargeteado a main y fusionado `9c629682070c05177c5866eadb22de97fc679d20`. Ambos candidatos tenían checks Linux/Windows SUCCESS. La rama documental histórica ya es ancestro de main. Queda integrar incremento4.5 tras su revisión y checks, y retirar únicamente ramas completamente fusionadas, conservando commits.

Hallazgos reproducidos: run sin límite; presupuesto agregado de gate ausente; junctions de destino/backup que podían escribir fuera; registro final fuera del rollback y colisiones de destinos duplicados que podían sustituir su baseline. Se implementan controles y regresiones con límites explícitos: no sandbox, no aprobación de comandos por el agente, no garantía sobre descendientes ni filesystem concurrente/TOCTOU, no atomicidad frente a caída abrupta. El rollback ante errores capturados preserva contenidos; pueden quedar backups y carpetas vacías. Los hallazgos se corrigieron y la segunda revisión independiente no dejó hallazgos pendientes.

Verificación final local PASS: 94 pruebas (25 validador, 31 instalador, 38 CLI), sin omisiones en Windows. Cobertura líneas/ramas/funciones: validador 100/95.21/93.10; instalador 100/91.96/100; CLI 100/96.61/98.25. Validador 92 documentos, cuatro fuentes históricas intactas, 13 agentes y doce skills. Evaluación de contexto PASS con umbrales previos sin cambios; ayuda R@10=1.000 en dos casos, MRR=.125 informada, no exactitud de respuestas. Instalación real temporal ambos hosts, snapshot y CLI --help/context98 PASS; actualización preserva edición local y crea .eos-new, LICENSE solo una escritura. Revisión independiente final de 69 pruebas de herramientas y docs PASS, sin hallazgos pendientes. Publicación del incremento y CI pendientes de confirmar. Los resultados históricos se conservan por candidato y no acreditan el runtime de ninguna aplicación receptora. Recuperación: revertir el incremento propio en commit nuevo según necesidad; no borrar datos, forzar push ni revertir cambios ajenos. Destinos usan --update --dry-run y resuelven conflictos .eos-new sin sobrescribir ediciones locales.


Rama histórica adicional `feat/eos-pierre-r-boss-master-system`: tres commits y tres archivos (README, AGENTS, constitución) inspeccionados; sus versiones son antecedentes ya desarrollados por la biblioteca actual. Se integra su historial conservando las versiones actuales de esos tres documentos, sin reintroducir carga completa rutinaria o instrucciones antiguas. La rama `docs/eos-operating-library`, incluida su revisión local, ya es ancestro de main. Solo se retiran referencias de ramas después de demostrar ascendencia al main final.
