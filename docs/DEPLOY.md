# Deploy do front-end

Este projeto é somente front-end. Não existe backend, banco de dados, API de pagamento ou integração real com GTM/GA4.

## Build

```bash
npm install
npm run build
```

A pasta gerada para deploy é `dist`.

## Netlify

Configuração já incluída em `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Node: `22`
- Redirect SPA: `/* -> /index.html`

## Vercel

Configuração já incluída em `vercel.json`:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Rewrite SPA para `/`

## GitHub Pages

Também é possível publicar a pasta `dist`, mas para GitHub Pages pode ser necessário ajustar `base` no `vite.config.ts` caso o site fique em subpath, por exemplo `/e-commerce/`.
