# Release Note Generator

Este proyecto genera y envía automáticamente un documento `.docx` con el resumen del sprint actual usando Jira.

## Scripts

- `npx ts-node src/index.ts --manual --sprint="Sprint xxx"` → Ejecuta el flujo manualmente.
- `npm start` → Inicia el cron para correr cada día a las 9:00.

## Configuración

Editá `.env` y `src/config/jiraAccounts.ts` con tus claves y destinatarios.
