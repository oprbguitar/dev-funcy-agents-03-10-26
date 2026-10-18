# EOS — estado del proyecto y plan de ampliación 4.3

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

Actualizado: 2026-10-18, America/Lima. Modo ADOPT, criticidad L1. Base: `40cafdbd582cc1476a52f59b299a52a386dbd78a`. Rama: `feat/eos-4.3-lifecycle-governance`. Responsable de publicación: propietario; ejecución asistida por Codex. Autorización directa: implementar en el sistema, subir a GitHub y añadir licencia y README con guía usable. No incluye desplegar productos, campañas, gastos ni cambiar visibilidad.

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
