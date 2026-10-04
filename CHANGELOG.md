# Registro de cambios EOS

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## 2.0.0 — 2026-10-03

### Biblioteca de instrucciones operativas

- Conserva las secciones 0–83 del maestro y añade aclaraciones 84–95 sobre autoridad, capacidades, evidencias, privacidad, permisos, IA, invariantes y gates.
- Normaliza modos IA a OFF, LOCAL, LOCAL_REMOTE, CLOUD_API, PRIVATE_CLOUD, HYBRID y AUTO. Aclara que la presencia del puerto no activa modelos ni gasto.
- Corrige el algoritmo AUDIT con evaluación read-only y retorno antes de modificar/configurar componentes. Acota loops por tiempo, pasos, presupuesto y autorización.
- El algoritmo descarta acciones prohibidas y retorna con propuesta revisable cuando falta autorización, antes de ejecutar o registrar verificación de un cambio inexistente.
- Añade diez manuales de dominio que desarrollan entradas, responsables, contratos, fallos, aceptación y operación.
- Añade seis skills canónicas, prompts por especialidad y plantillas para registros verificables.
- Amplía README, entrada de agentes, perfil real de la biblioteca, guía de navegación, firma y procedencia.
- Conserva los cuatro antecedentes exactos con SHA-256 y mapa de 301 secciones numeradas.

### Herramientas y revisión

- Incorpora validador de manifiesto, documentos, firma, enlaces locales, fences y hashes sin dependencias externas.
- Incorpora pruebas unitarias, integración y E2E de CLI, con gate mínimo de 80% de coverage del código de soporte.
- Incorpora CI con acciones fijadas a commit, permisos de lectura y checks de alcance documental.
- Distingue hechos verificados, propuestas y funciones futuras: los manuales no despliegan infraestructura, pagos, IA ni automatizaciones.

### Precisiones de seguridad y producto

- Fallback IA restringido por privacidad, destinos y presupuesto.
- Monitoreo sin contraseñas, fingerprints de intentos, tokens de sesión reutilizables ni payloads sensibles íntegros.
- Proxy trust explícito, recuperación tras falsos positivos y límites a respuestas automáticas.
- Pagos inciertos reconciliados antes de nuevos cobros; ledger con correcciones y sin reescribir historia.
- Capacity forecast y restores con datos medidos; ninguna promesa de almacenamiento físicamente ilimitado.
- Aplicabilidad normativa e IP trazable, firma editorial y asistencia de IA transparentes.

## Baseline anterior

El commit `0afe7df` introdujo la constitución EOS identificada con Pierre R. Boss. El commit `e7fcbd5` es el inicio del repositorio. Estas referencias describen historia observada; no se inventa una fecha o release semántica para los commits previos.
