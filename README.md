# TechZone Periféricos

E-commerce fake de periféricos gamer e acessórios para PC criado para estudo de tracking/analytics.

## Funcionalidades

- Produtos, ofertas, categorias e busca local.
- Modal de detalhes de produto.
- Carrinho com adicionar, remover, aumentar, diminuir e limpar.
- Checkout fake com formulário e compra simulada.
- Geração de `transaction_id` fake no padrão `TZ- + timestamp`.
- Eventos e-commerce preparados em `window.dataLayer` sem GTM/GA4 real.

## Rodar localmente

```bash
npm install
npm run dev
```

## Validações

```bash
npm run build
npm run lint
npm run typecheck
```

## Tracking

Consulte `docs/ECOMMERCE_TRACKING.md`, `docs/TRACKING_EVENTS.md` e `docs/TRACKING_SETUP.md` para os eventos implementados e instruções de teste no console.

Debug local:

```txt
?debug_tracking=true
```

GTM opcional via variável de ambiente, sem ID hardcoded:

```txt
VITE_GTM_ID=GTM-XXXXXXX
```

## Backend e deploy

O projeto não possui backend: tudo funciona com estado local no navegador. O deploy do front-end está preparado para Vercel com `vercel.json`.

Consulte `docs/DEPLOY.md`.
