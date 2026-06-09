# Contrato de eventos — TechZone Periféricos

Eventos centralizados em `src/lib/dataLayer.ts` e funções e-commerce em `src/analytics/dataLayer.ts`. Produtos são convertidos por `mapProductToAnalyticsItem(product, quantity)` para evitar duplicação.

## Padrão e-commerce

Eventos abaixo devem enviar `ecommerce.currency`, `ecommerce.value` e `ecommerce.items` quando aplicável: `view_item`, `select_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `purchase`.

Item esperado:

```js
{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }
```

## page_view_custom

- Ação real: carregamento inicial da loja.
- Onde nasce: `src/App.tsx` no `useEffect` inicial.
- Payload esperado: `page_location`, `page_title`.
- Futuro GA4: `page_view`.
- Qualidade: pode duplicar em hot reload de desenvolvimento; mitigado por `useRef` durante a montagem.

```js
window.dataLayer.push({ event: "page_view_custom", page_location: "https://site/", page_title: "TechZone Periféricos" })
```

## select_item

- Ação real: clique em card/produto ou abertura de detalhes.
- Onde nasce: `src/App.tsx`.
- Payload esperado: `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `select_item`.
- Qualidade: botões internos usam `stopPropagation` para evitar seleção acidental duplicada.

```js
window.dataLayer.push({ event: "select_item", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## view_item

- Ação real: usuário abre o modal de detalhes do produto.
- Onde nasce: `src/App.tsx`, função `viewDetails()`.
- Payload esperado: `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `view_item`.
- Qualidade: preço usa valor promocional quando existir.

```js
window.dataLayer.push({ event: "view_item", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## add_to_cart

- Ação real: adicionar produto ou aumentar quantidade no carrinho.
- Onde nasce: `src/App.tsx`, funções `addToCart()` e `changeQuantity()`.
- Payload esperado: `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `add_to_cart`.
- Qualidade: cada clique real gera um evento válido.

```js
window.dataLayer.push({ event: "add_to_cart", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## remove_from_cart

- Ação real: diminuir quantidade, remover item ou limpar carrinho.
- Onde nasce: `src/App.tsx`.
- Payload esperado: `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `remove_from_cart`.
- Qualidade: limpar carrinho envia um evento por item removido.

```js
window.dataLayer.push({ event: "remove_from_cart", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## view_cart

- Ação real: abrir o carrinho no header.
- Onde nasce: `src/App.tsx`, função `openCart()`.
- Payload esperado: `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `view_cart`.
- Qualidade: carrinho vazio gera `value: 0` e `items: []`.

```js
window.dataLayer.push({ event: "view_cart", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## begin_checkout

- Ação real: clique em finalizar compra com carrinho não vazio.
- Onde nasce: `src/App.tsx`, função `beginCheckout()`.
- Payload esperado: `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `begin_checkout`.
- Qualidade: não envia dados pessoais nem forma de pagamento.

```js
window.dataLayer.push({ event: "begin_checkout", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## purchase

- Ação real: envio concluído do checkout fake no botão **Comprar agora**.
- Onde nasce: `src/App.tsx`, função `submitOrder()`.
- Payload esperado: `ecommerce.transaction_id`, `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`.
- Futuro GA4: `purchase`.
- Qualidade: compra é simulada, não representa receita real.

Regras críticas:

- `transaction_id` é obrigatório e único por compra simulada.
- `value` precisa bater com o total do carrinho no momento da compra.
- `items` precisa conter todos os produtos comprados.
- `purchase` não pode duplicar em clique duplo rápido.

```js
window.dataLayer.push({ event: "purchase", ecommerce: { transaction_id: "TZ-1710000000000-A1B2C3", currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## search

- Ação real: digitação no campo de busca com mais de 1 caractere.
- Onde nasce: `src/App.tsx`, função `handleSearch()`.
- Payload esperado: `search_term`.
- Futuro GA4: `search`.
- Qualidade: dispara por mudança de texto; futuramente pode receber debounce.

```js
window.dataLayer.push({ event: "search", search_term: "mouse" })
```

## filter_products

- Ação real: seleção de categoria ou alteração de termo de busca.
- Onde nasce: `src/App.tsx`, funções `chooseCategory()` e `handleSearch()`.
- Payload esperado: `filter_category`, `filter_term`, `results_count`.
- Futuro GA4: evento customizado `filter_products`.
- Qualidade: `results_count` representa os produtos visíveis após o filtro local; não depende de backend.

```js
window.dataLayer.push({ event: "filter_products", filter_category: "Mouses", filter_term: "pro", results_count: 1 })
```
