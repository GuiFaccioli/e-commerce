# Deploy do front-end

Este projeto é somente front-end. Não existe backend, banco de dados, API de pagamento ou integração real com GTM/GA4.

## Build

```bash
npm install
npm run build
```

A pasta gerada para deploy é `dist`.

## Vercel

Configuração já incluída em `vercel.json`:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Rewrite SPA para `/`

## Como publicar na Vercel

1. Importe o repositório no painel da Vercel.
2. Selecione o framework **Vite**.
3. Confirme:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Faça o deploy.
