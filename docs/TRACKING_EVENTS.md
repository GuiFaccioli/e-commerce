# Contrato inicial de eventos — TechZone Periféricos

Todos os eventos nascem em ações reais do usuário e são enviados por `pushToDataLayer()` em `src/lib/dataLayer.ts`. Os eventos e-commerce usam itens padronizados por `mapProductToAnalyticsItem()` em `src/analytics/dataLayer.ts`.

## page_view_custom

- Ação real: carregamento inicial da loja.
- Onde nasce: `src/App.tsx`, no `useEffect` inicial.
- Parâmetros: `page_location`, `page_title`.
- Futuro GA4: `page_view`.
- Risco: duplicidade em desenvolvimento por hot reload; mitigado com `useRef` por montagem.

```js
window.dataLayer.push({ event: "page_view_custom", page_location: "https://site/", page_title: "TechZone Periféricos" })
```

## select_item

- Ação real: clique em card/produto ou botão de detalhes.
- Onde nasce: `src/App.tsx`.
- Parâmetros: `ecommerce.items`.
- Futuro GA4: `select_item`.
- Risco: clique em botões internos pode disparar seleção se não houver `stopPropagation`; botões principais já bloqueiam propagação.

```js
window.dataLayer.push({ event: "select_item", ecommerce: { items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## view_item

- Ação real: usuário abre o modal de detalhes do produto.
- Onde nasce: `src/App.tsx`, função `viewDetails()`.
- Parâmetros: `currency`, `value`, `items`.
- Futuro GA4: `view_item`.
- Risco: preço enviado usa preço promocional quando existir.

```js
window.dataLayer.push({ event: "view_item", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## add_to_cart

- Ação real: adicionar produto ou aumentar quantidade no carrinho.
- Onde nasce: `src/App.tsx`, funções `addToCart()` e `changeQuantity()`.
- Parâmetros: `currency`, `value`, `items`.
- Futuro GA4: `add_to_cart`.
- Risco: se o clique for repetido rapidamente, cada clique gera um evento válido.

```js
window.dataLayer.push({ event: "add_to_cart", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## remove_from_cart

- Ação real: diminuir quantidade, remover item ou limpar carrinho.
- Onde nasce: `src/App.tsx`.
- Parâmetros: `currency`, `value`, `items`.
- Futuro GA4: `remove_from_cart`.
- Risco: limpar carrinho envia um evento por item removido.

```js
window.dataLayer.push({ event: "remove_from_cart", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## view_cart

- Ação real: abrir o carrinho no header.
- Onde nasce: `src/App.tsx`, função `openCart()`.
- Parâmetros: `currency`, `value`, `items`.
- Futuro GA4: `view_cart`.
- Risco: abrir carrinho vazio gera evento com valor 0 e lista vazia, útil para validação de intenção.

```js
window.dataLayer.push({ event: "view_cart", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## begin_checkout

- Ação real: clique em finalizar compra com carrinho não vazio.
- Onde nasce: `src/App.tsx`, função `beginCheckout()`.
- Parâmetros: `currency`, `value`, `items`.
- Futuro GA4: `begin_checkout`.
- Risco: não inclui dados pessoais nem forma de pagamento; isso evita coleta desnecessária.

```js
window.dataLayer.push({ event: "begin_checkout", ecommerce: { currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## purchase

- Ação real: envio do checkout fake no botão Comprar agora.
- Onde nasce: `src/App.tsx`, função `submitOrder()`.
- Parâmetros: `transaction_id`, `currency`, `value`, `items`.
- Futuro GA4: `purchase`.
- Risco: compra é simulada, não representa receita real.

```js
window.dataLayer.push({ event: "purchase", ecommerce: { transaction_id: "TZ-1710000000000", currency: "BRL", value: 219.9, items: [{ item_id: "TZ-MXP", item_name: "Mouse Gamer Precision X Pro", item_category: "Mouses", price: 219.9, quantity: 1 }] } })
```

## search

- Ação real: digitação no campo de busca com mais de 1 caractere.
- Onde nasce: `src/App.tsx`, função `handleSearch()`.
- Parâmetros: `search_term`.
- Futuro GA4: `search`.
- Risco: dispara por mudança de texto; futuramente pode receber debounce.

```js
window.dataLayer.push({ event: "search", search_term: "mouse" })
```
