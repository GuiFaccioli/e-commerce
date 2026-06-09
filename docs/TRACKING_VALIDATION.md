# Checklist de validação de tracking

Use o site local ou publicado com o painel de debug:

```txt
?debug_tracking=true
```

## Fluxo mínimo

1. Recarregue a página.
2. Clique em um produto/card.
3. Clique em **Ver detalhes**.
4. Adicione produto ao carrinho.
5. Abra o carrinho.
6. Finalize compra.
7. Preencha o checkout fake e clique em **Comprar agora**.
8. Use busca e categorias para validar filtros.

## Comandos no console

Listar eventos enviados:

```js
window.dataLayer.map(item => item.event)
```

Ver resumo dos eventos e-commerce:

```js
window.dataLayer
  .filter(item => item.event)
  .map(item => ({
    event: item.event,
    value: item.ecommerce?.value,
    currency: item.ecommerce?.currency,
    items: item.ecommerce?.items,
    transaction_id: item.ecommerce?.transaction_id
  }))
```

Ver o último purchase:

```js
window.dataLayer
  .filter(item => item.event === "purchase")
  .at(-1)
```

Validar filtros:

```js
window.dataLayer
  .filter(item => item.event === "filter_products")
  .at(-1)
```

## Resultado esperado

- `select_item` aparece com `ecommerce.value` e `ecommerce.currency` preenchidos.
- `purchase` aparece somente após compra simulada concluída.
- `purchase.ecommerce.transaction_id` está preenchido e começa com `TZ-`.
- `purchase.ecommerce.value` bate com o total do carrinho antes da compra.
- `purchase.ecommerce.currency` é `BRL`.
- `purchase.ecommerce.items` contém todos os produtos comprados com `item_id`, `item_name`, `item_category`, `price` e `quantity`.
- `filter_products` contém `filter_category`, `filter_term` e `results_count`.
