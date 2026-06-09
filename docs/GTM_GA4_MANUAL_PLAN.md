# Plano manual GTM → GA4

Este plano descreve configuração manual futura no Google Tag Manager. Não há API GTM/GA4 sendo usada neste projeto.

## Variáveis de camada de dados

Criar no GTM as Data Layer Variables:

| Nome no GTM | Data Layer Variable Name |
|---|---|
| DLV - ecommerce.currency | `ecommerce.currency` |
| DLV - ecommerce.value | `ecommerce.value` |
| DLV - ecommerce.items | `ecommerce.items` |
| DLV - ecommerce.transaction_id | `ecommerce.transaction_id` |
| DLV - filter_category | `filter_category` |
| DLV - filter_term | `filter_term` |
| DLV - results_count | `results_count` |

## Triggers de evento personalizado

Criar triggers do tipo **Custom Event**:

- `CE - page_view_custom` → Event name: `page_view_custom`
- `CE - view_item` → Event name: `view_item`
- `CE - select_item` → Event name: `select_item`
- `CE - add_to_cart` → Event name: `add_to_cart`
- `CE - filter_products` → Event name: `filter_products`
- `CE - view_cart` → Event name: `view_cart`
- `CE - begin_checkout` → Event name: `begin_checkout`
- `CE - purchase` → Event name: `purchase`

## Tags GA4 futuras

Todas as tags dependem de uma tag/configuração GA4 válida criada manualmente no GTM.

### GA4 Event - view_item

- Event name: `view_item`
- Trigger: `CE - view_item`
- Parâmetros: `currency`, `value`, `items`
- Métrica futura: visualizações de item/produto.
- Preview: abrir detalhes de um produto e conferir parâmetros.

### GA4 Event - select_item

- Event name: `select_item`
- Trigger: `CE - select_item`
- Parâmetros: `currency`, `value`, `items`
- Métrica futura: seleção/clique em produto.
- Preview: clicar em um card ou em detalhes.

### GA4 Event - add_to_cart

- Event name: `add_to_cart`
- Trigger: `CE - add_to_cart`
- Parâmetros: `currency`, `value`, `items`
- Métrica futura: adições ao carrinho e valor adicionado.
- Preview: clicar em Carrinho/Adicionar ao carrinho.

### GA4 Event - view_cart

- Event name: `view_cart`
- Trigger: `CE - view_cart`
- Parâmetros: `currency`, `value`, `items`
- Métrica futura: visualizações de carrinho.
- Preview: abrir carrinho pelo header.

### GA4 Event - begin_checkout

- Event name: `begin_checkout`
- Trigger: `CE - begin_checkout`
- Parâmetros: `currency`, `value`, `items`
- Métrica futura: início de checkout.
- Preview: clicar em Finalizar compra.

### GA4 Event - purchase

- Event name: `purchase`
- Trigger: `CE - purchase`
- Parâmetros: `transaction_id`, `currency`, `value`, `items`
- Métrica futura: compras simuladas e receita simulada.
- Preview: concluir checkout fake e conferir se `transaction_id` não está vazio.

### GA4 Event - filter_products

- Event name: `filter_products`
- Trigger: `CE - filter_products`
- Parâmetros: `filter_category`, `filter_term`, `results_count`
- Métrica futura: uso de filtros e buscas internas por categoria/termo.
- Preview: clicar categoria ou digitar busca.

## Validação geral no Preview

Para cada tag:

1. Fazer a ação real no site.
2. Selecionar o evento correspondente na timeline do Preview.
3. Conferir se o trigger disparou.
4. Conferir se a tag disparou uma vez.
5. Conferir se as DLVs não retornam `undefined`.
6. Conferir os parâmetros enviados.

Não publicar o container antes de validar todos os eventos.
