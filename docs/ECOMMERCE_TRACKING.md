# TechZone Periféricos — tracking e-commerce fake

A loja usa estado local e envia eventos para `window.dataLayer` em `src/analytics/dataLayer.ts`. Não há GTM, GA4, backend ou pagamento real configurado.

## Eventos implementados

- `select_item`: clique em um card de produto ou abertura de detalhes.
- `view_item`: clique em **Ver detalhes** e exibição do modal do produto.
- `add_to_cart`: clique em **Carrinho**, **Adicionar ao carrinho** ou aumento de quantidade.
- `remove_from_cart`: diminuir quantidade, remover item ou limpar carrinho.
- `view_cart`: abertura do carrinho pelo header.
- `begin_checkout`: clique em **Finalizar compra**.
- `purchase`: envio do formulário **Comprar agora**, com `transaction_id` fake `TZ- + timestamp`.
- `search`: digitação de termo com mais de 1 caractere no campo de busca.
- `filter_products`: clique em uma categoria/filtro.

## Parâmetros enviados

Eventos GA4 e-commerce enviam `ecommerce.currency = "BRL"`, `ecommerce.value` quando aplicável e `ecommerce.items` com:

- `item_id`
- `item_name`
- `item_category`
- `price`
- `quantity`

`purchase` também envia `transaction_id`. `search` envia `search_term`. `filter_products` envia `filter_type` e `filter_value`.

## Onde está no código

- Funções centralizadas: `src/analytics/dataLayer.ts`
- Disparos nas interações da loja: `src/App.tsx`
- Produtos fake tipados: `src/data/products.ts`

## Como testar

1. Rode o projeto com `npm run dev`.
2. Interaja com busca, filtros, cards, carrinho e checkout fake.
3. Abra o console do navegador e execute:

```js
window.dataLayer
```

Você deve ver eventos como `view_item`, `select_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `purchase`, `search` e `filter_products`.

## Conexão futura com GTM/GA4

Os eventos já seguem formato compatível com GA4 e-commerce e podem ser conectados futuramente a tags do GTM/GA4. Basta instalar/configurar o container real fora deste playground, sem alterar os nomes dos eventos.
