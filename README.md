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

## Tracking / Analytics

O site usa `window.dataLayer` para registrar ações reais do usuário. O GTM é opcional e só carrega quando `VITE_GTM_ID` está configurado, sem ID hardcoded.

Documentação principal:

- Eventos: `docs/TRACKING_EVENTS.md`
- Setup de tracking: `docs/TRACKING_SETUP.md`
- Setup GTM: `docs/GTM_SETUP.md`
- Validação GTM Preview: `docs/GTM_PREVIEW_VALIDATION.md`

Debug local:

```txt
?debug_tracking=true
```

GTM opcional:

```txt
VITE_GTM_ID=GTM-XXXXXXX
```

## GTM Automation Dry Run

O contrato de automação fica em `tracking/ga4-events.contract.json`.

Para ver o plano local do que seria criado no GTM:

```bash
npm run gtm:dry-run
```

Esse comando não altera o GTM real. Ele apenas mostra variáveis, triggers e tags planejadas para configuração futura.

## Backend e deploy

O projeto não possui backend: tudo funciona com estado local no navegador. O deploy do front-end está preparado para Vercel com `vercel.json`.

Consulte `docs/DEPLOY.md`.
