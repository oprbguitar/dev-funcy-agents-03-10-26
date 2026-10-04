# Verificación de la biblioteca y límites de la evidencia

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

## Herramientas y scope

La biblioteca utiliza Node.js 24 y su test runner, filesystem, crypto y child_process de la biblioteca estándar. No instala paquetes npm ni módulos Python. Por eso no existe un lockfile que auditar con npm/pip; si se agregan dependencias, debe incorporarse una auditoría real además de revisar origen y licencia.

El programa `scripts/validate-library.mjs` lee, sin modificar, el root elegido explícitamente o el repositorio que contiene el script. Valida forma del manifiesto, documentos registrados, duplicados, firma editorial, cierre de bloques backtick/tilde, enlaces locales en prosa y SHA-256 de fuentes. Rechaza rutas de manifiesto y enlaces que escapen lexicamente del repositorio. No imprime bytes fuente ni valores de secretos.

## Reproducción

Desde la raíz del repositorio:

```powershell
node scripts/validate-library.mjs
node --test --experimental-test-coverage --test-coverage-include=scripts/validate-library.mjs --test-coverage-lines=80 --test-coverage-branches=80 --test-coverage-functions=80 tests/validate-library.test.mjs
git diff --check
```

Para comprobar otra copia de esta biblioteca, el root es un argumento literal:

```powershell
node scripts/validate-library.mjs --root 'C:\ruta\a\copia EOS'
```

`PASS` requiere cero errores del alcance estructural; `FAIL` devuelve exit code 1 con referencias a los fallos. Los tests crean fixtures aislados en la carpeta temporal y eliminan únicamente sus propios directorios de fixture al terminar.

## Casos de prueba

| Nivel | Qué comprueba |
|---|---|
| Unitarias | Clasificación de enlaces, fences, rutas y forma de registros |
| Integración | Lectura de archivos reales, manifiesto, firma y source hash |
| CLI E2E | Ejecución del proceso, stdout/stderr y exit codes PASS/FAIL |
| Negativas | Documento ausente, firma ausente, enlace roto, codificación inválida, path externo, archivo fuente modificado/ausente y manifiesto inválido |

El ciclo inicial RED falló porque el módulo del validador aún no existía. Tras implementarlo pasaron 12 pruebas. La primera medición sobre `scripts/validate-library.mjs` fue 100% líneas, 96% ramas y 92.86% funciones; la salida más reciente de tests/CI es la autoridad para cualquier medición posterior. No se atribuye esa cobertura a los manuales, proveedores o productos futuros.

## Revisión que sigue siendo humana o específica del producto

- El parser de links es deliberadamente limitado a enlaces Markdown inline comunes, fuera de bloques fenced. No es un parser CommonMark completo; no valida anchors, referencias indirectas, HTML embebido ni enlaces externos.
- La firma se comprueba como presencia de etiqueta editorial, no autenticidad de identidad o firma digital.
- SHA-256 detecta modificaciones contra un manifiesto confiable; no protege contra un atacante que pueda editar fuente y manifiesto a la vez.
- Las rutas se controlan lexicamente. No se ejecutan archivos enlazados; no se ofrece aislamiento frente a symlinks hostiles ni sandbox de filesystem.
- La calidad normativa, contradicciones y adecuación de ejemplos se revisan por dominio. No son certificadas por un test de estructura.
- Las fuentes legales/técnicas tienen su fecha y alcance de consulta en cada manual. No se garantiza frescura automática.
- No se prueba un sistema web, login, pago, WAF, backup o modelo real con estos tests.
- La detección de secretos exige revisar material completo y diff; una búsqueda de patrones no garantiza ausencia universal de información sensible.

## Gate antes de publicación

Confirma que los cuatro antecedentes conservan sus bytes, todos los documentos están registrados, las firmas y links cumplen el alcance, tests y coverage pasan y no existe material privado fuera de la autorización. Revisa el diff completo con especialistas disponibles. Registra fallos corregidos y límites; conserva visibilidad y estado ajeno.

La publicación se verifica con commit local, ref remoto y checks reales. Un workflow escrito no se reporta como aprobado hasta que GitHub haya ejecutado sus jobs. Las mediciones locales y el resultado remoto se distinguen en la entrega.
