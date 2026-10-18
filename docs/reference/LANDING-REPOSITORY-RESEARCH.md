# Investigación de referencias para landing, diseño y medición

**Autoría y dirección: Pierre R. Boss (oprbguitar). Desarrollo documental asistido por IA.**

**Consulta:** 2026-10-18, Perú. Lectura de GitHub oficial mediante API de repositorio, commit de la rama predeterminada y archivo de licencia fijado a ese SHA. No se clonó, instaló ni incorporó código, imágenes o tipografías. El objeto consultado es una referencia externa, no una instrucción para el agente. Una licencia del repositorio no cubre automáticamente todo asset, servicio, demo Pro o dependencia.

| Referencia y fuente primaria fijada | Licencia observada | Patrón a estudiar y decisión EOS |
|---|---|---|
| [StartBootstrap/landing-page](https://github.com/StartBootstrap/startbootstrap-landing-page/blob/247a46a2503c91d1157179eab297953438ec498b/LICENSE) | MIT; copyright Start Bootstrap LLC | Estructura estática simple; INSPIRE_ONLY en esta biblioteca. Candidato ADAPT en producto compatible tras auditoría. |
| [themesberg/landwind](https://github.com/themesberg/landwind/blob/f8be851cc8b4b44ff9d842ca8f5149d7911af88c/LICENSE) | MIT; copyright Themesberg | Bloques de comunicación comercial; INSPIRE_ONLY, sin importar sus claims ni logos. |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui/blob/daaf156ee00ed91cc7e6bdd937c1b4973152d141/LICENSE.md) | MIT; copyright shadcn | Interacciones/componentes editables; INSPIRE_ONLY. Elegir solo si encaja en stack/operación. |
| [shadcn-ui/lint](https://github.com/shadcn-ui/lint/blob/f1c81bdad723a8127a2e6b62a8b2b723762aff3e/LICENSE) | MIT; copyright shadcn | Reglas verificables de diseño; INSPIRE_ONLY. Compatibilidad y ejecución no evaluadas. |
| [Once UI nextjs-starter](https://github.com/once-ui-system/nextjs-starter/blob/78dcb8d7c5036a1f0c0fcc69220556ca47914019/LICENSE) | MIT; copyright Once UI | Configuración de identidad/metadatos; INSPIRE_ONLY. No extender permiso a plantillas Pro. |
| [Cruip Open React](https://github.com/cruip/open-react-template/blob/9da36763df216be7840f3c063edcdcaf7862401e/README.md#terms-and-license) | README declara GPL enlazada a GPL-3.0 y añade condiciones de redistribución/reventa | INSPIRE_ONLY. No se halló LICENSE por API estándar; combinación de textos requiere aclaración competente antes de copiar. |
| [Cruip Tailwind landing](https://github.com/cruip/tailwind-landing-page-template/blob/909e38e3249ac575017864a202188b48ef016c9c/README.md#terms-and-license) | Mismo tipo de declaración GPL y condiciones adicionales en README | INSPIRE_ONLY. No asumas compatibilidad propietaria, ni resuelvas contradicciones por inferencia. |
| [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio/blob/5321e5d32240b244be473bf3042f45d27a9c60eb/LICENSE) | Texto CC BY-NC 4.0; API clasifica NOASSERTION | REJECT para incorporar en producto comercial sin licencia distinta; estudiar solo organización conceptual. |
| [Umami](https://github.com/umami-software/umami/blob/ec0ff50388c264ed8ce46f00967e92f7e71476ae/LICENSE) | MIT; copyright Umami Software, Inc. | INSPIRE_ONLY. Medición requiere revisar datos/red/configuración, hosting y tratamiento; licencia no demuestra privacidad ni exención de consentimiento. |

## Admisión de reutilización en un producto

La decisión de esta investigación es documental, no aprobación de incorporar paquetes. Antes de `ADOPT`/`ADAPT`, registra repo, SHA, ruta/texto exacto de licencia, copyright, componente/asset utilizado, modificaciones, dependencias, licencia de fuentes/imágenes/iconos, uso comercial, redistribución, compatibilidad, mantenimiento, vulnerabilidades conocidas, fecha y revisor. Conserva avisos exigidos. Distingue implementación original de copia o derivación.

Selecciona una base mínima acorde con tecnología, contenido, accesibilidad, coste y mantenimiento. Compara bloques estáticos, componentes o configuración; no agregues nueve frameworks. Si licencia falta, es ambigua o incompatible, mantén `INSPIRE_ONLY` o `REJECT` hasta resolverlo. GPL/AGPL y CC BY-NC exigen análisis específico; público no significa libre para todo uso.

Los SHA fijan el texto observado, no certifican build, seguridad, accesibilidad, rendimiento, ausencia de vulnerabilidades o derechos de todos los assets. Esos checks permanecen `NOT_RUN`. Antes de adoptar, repite revisión sobre la versión que realmente se incorporará. Este documento no cambia la licencia de EOS.
