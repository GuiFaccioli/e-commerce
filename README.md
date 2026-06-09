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

Consulte `docs/ECOMMERCE_TRACKING.md` para os eventos implementados e instruções de teste no console.
