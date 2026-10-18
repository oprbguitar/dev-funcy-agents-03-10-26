---
name: eos-desktop-release
description: Preparar entrega de escritorio con instalación, integridad, datos locales, offline, updater y recuperación verificados por SO y arquitectura.
---

# EOS DESKTOP RELEASE

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Alcance

Activa solo para distribución Windows/macOS/Linux, offline o conectada. Lee [EOS-CORE](../../EOS-CORE.md), [eos-release](../eos-release/SKILL.md) y la sección de contrato desktop de [UPDATES-RELIABILITY](../../docs/manuals/UPDATES-RELIABILITY.md). EOS aporta instrucciones: no incluye instalador ni updater operativo. Web y escritorio son gates independientes; un frontend desplegado no prueba entrega desktop.

## Preparación

1. Inspecciona framework real, SO/arquitecturas objetivo, herramientas existentes, licencias, formatos de instalador y datos/configuración persistentes. No presumas Electron, Tauri, .NET, Python, Docker ni privilegios de administrador.
2. Completa [DESKTOP-RELEASE-CHECKLIST](../../templates/DESKTOP-RELEASE-CHECKLIST.md) con versión/commit, entorno, artefacto, checksum, permisos y responsable. Requisitos de RAM/CPU/tamaño/tiempo son medidos o `PENDIENTE`; no inventes mínimos.
3. Decide firma de código, mecanismo de verificación del updater, custodia de claves y canales estable/beta. La firma editorial EOS no firma binarios. Un checksum publicado en el mismo servidor detecta corrupción pero no autentica por sí solo al editor. No crees certificados ni modifiques credenciales por inferencia.
4. Revisa permisos y rutas de datos, secretos del cliente y dependencias distribuidas/SBOM. Tokens de servicio nunca se empacan en binarios. Evalúa cifrado y almacén de claves del SO según amenazas; exportación, backup, retención y borrado deben respetar el control del usuario.

## Ensayos sobre artefacto real

- Por cada SO/arquitectura prometida: instalación limpia con cuenta no administradora, lanzamiento, acceso a datos, permisos mínimos, exportación/restore y desinstalación con decisión explícita sobre conservar/borrar datos. Indica VM/equipo y versión del SO; otra plataforma permanece `NOT_RUN`.
- Actualiza desde versión soportada con datos representativos sintéticos. Ensaya falta de espacio, descarga corrupta, firma inválida, caída de red y proceso interrumpido. No actives artefactos incompletos. Verifica recuperación sin duplicar migraciones ni perder datos.
- Para updater: descarga a staging, valida integridad/autenticidad antes de activar, cambia versión de forma atómica cuando plataforma lo soporte y registra `interrupted` recuperable. Si esquema impide downgrade, restaura backup compatible o aplica reparación forward-only ensayada; no prometas rollback binario universal.
- Offline: comprueba capacidades prometidas sin nube, arranque y edición tras desconexión, expiración de licencia y reconexión. Conectada/híbrida: verifica TLS, OAuth/callback, tokens de usuario, proxy, colas, conflictos/sync y compatibilidad cliente-servidor según alcance.
- Inspecciona conexiones salientes y crash reports; minimiza telemetría y limpia datos personales/secretos. Consentimiento y controles se deciden por tratamiento y jurisdicción. No añadas un banner web inexistente a una app offline.

## Publicación y bloqueo

Publica solo destino/canal autorizado y verifica URL real de descarga, hash, versión efectiva, firma y notas de instalación/soporte. Registra pruebas locales y remotas separadamente. Sin certificado, plataforma o runtime, declara `NOT_RUN` o bloqueo según promesa; no fabriques `PASS`. Para producto sin escritorio usa `NOT_APPLICABLE` justificado.

Un artefacto adulterado, migración destructiva sin recuperación, secreto empacado o updater que acepta firma inválida bloquea ese canal. No borres datos ni detengas servicios ajenos. Entrega evidencia saneada, riesgos, recuperación y [AGENT-RESULT](../../templates/AGENT-RESULT.md).
