# EOS — estado del proyecto y ampliación 4.4

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Actualizado: 2026-10-19, America/Lima. La sección 4.4 al final es el estado vigente; los hitos 4.3 siguientes son antecedentes fechados. Modo ADOPT, criticidad L1. Base: `40cafdbd582cc1476a52f59b299a52a386dbd78a`. Rama: `feat/eos-4.3-lifecycle-governance`. Responsable de publicación: propietario; ejecución asistida por Codex. Autorización directa: implementar en el sistema, subir a GitHub y añadir licencia y README con guía usable. No incluye desplegar productos, campañas, gastos ni cambiar visibilidad.

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


## Estado vigente — 4.4.0, 2026-10-19

Modo ADOPT, L1 documental, base `b32aa646889bffd1e70fde6fa217ac2b23fcc8b4`, rama `feat/eos-4.4-peru-quality-ui`. Autorización directa del propietario: integrar referencias de IA Perú/ISO y UI/UX en el sistema local, actualizar README y subir a GitHub. Conserva visibilidad privada, fuentes históricas y trabajo anterior; no fusiona ramas, publica PDF ni despliega aplicaciones. Esta rama parte de la ampliación 4.3 ya publicada, aún no fusionada a main.

Plan realizado: inspección y baseline; dos especialistas con archivos separados (normativa y catálogo UI); integración secuencial de núcleo, constitución97, modos INIT/ADOPT/AUDIT/RELEASE, rol compliance, catálogo/versión4.4 y README. Nueva skill `eos-peru-quality`, referencia primaria y plantilla de evaluación. IA del producto permanece DORMANT/OFF: no se instalaron modelos, dependencias ni servicios. El catálogo incorpora25 candidatos; consulta parcial fechada de licencias, sin adoptar código/activos de terceros. No hay frontend; design-pick/lint y pruebas visuales corresponden al producto receptor.

Verificación local Windows/Node24.14.0:75 pruebas PASS (25 validador,19 instalador,31 CLI); coberturas líneas/ramas/funciones:100/95.21/93.10,100/92.25/100 y100/96.13/98.20 respectivamente. Validador estructural:87 documentos,4 fuentes históricas intactas,13 agentes. RED/GREEN del nuevo router observado: falló antes de implementar y pasó después; prueba E2E CLI confirma sección97 obligatoria para ISO. Instalación temporal real ambos hosts y actualización sin conflictos PASS; snapshot validado. Recuperación `peru_quality`:R@10=1.000,MRR=0.188 para2 casos; exige inclusión, no prioridad sobre otras políticas. Suites históricas mantienen umbrales; adversarialR@10=0.600 sin umbral, límite léxico conocido. No es clasificación jurídica ni control runtime.

Límites: portadas/metadatos de PDF solo identificados, no autenticados; NTC colombiana no acredita NTP. Fichas ISO9001:2026 y27701:2025 verificadas, sin revisión de cláusulas completas ni certificación. DS115 revisado en disposiciones citadas, sin dictamen exhaustivo ni calendario universal. Fuentes/ref: [IA y calidad](reference/AI-PERU-QUALITY.md), [UI](reference/LANDING-REPOSITORY-RESEARCH.md). No se recibieron los XLSX/CSV/JSON enumerados dentro del README adjunto; no se inventaron ni se declara integrado ese catálogo exhaustivo. Las verificaciones pendientes se mantienen explícitas por fuente.

Revisión independiente de código/seguridad: PASS, sin hallazgos accionables pendientes; se corrigió ruta CLI de la nueva skill y se comprobó desde raíz de receptor instalado. Publicación: pendiente de verificar para este candidato. Se preparará PR dependiente de la rama4.3 (PR7); no se fusiona ninguna rama. Recuperación: revertir los commits propios en rama nueva si se requiere; no reescribir historia ni revertir cambios ajenos. Para destinos usar --update --dry-run y resolver .eos-new conservando ediciones locales. Esta entrega modifica la biblioteca local; no instala automáticamente EOS en todos los demás proyectos ni altera skills globales.
