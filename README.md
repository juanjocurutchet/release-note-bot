# Release Note Generator

Este proyecto genera y envía automáticamente un documento `.docx` con el resumen del sprint actual usando IA (GPT) y Jira.

## Scripts

- `npm run generate-release` → Ejecuta el flujo manualmente.
- `npm start` → Inicia el cron para correr cada día a las 9:00.

## Configuración

Editá `.env` y `src/config/jiraAccounts.ts` con tus claves y destinatarios.
