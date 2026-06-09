# Plano futuro de automação GTM em dry-run

Este documento descreve a automação futura. Nada aqui foi implementado contra API real do GTM.

## Tags necessárias no GTM

- GA4 Configuration, com Measurement ID configurado por variável do ambiente/cliente.
- GA4 Event para `select_item`.
- GA4 Event para `view_item`.
- GA4 Event para `add_to_cart`.
- GA4 Event para `remove_from_cart`.
- GA4 Event para `view_cart`.
- GA4 Event para `begin_checkout`.
- GA4 Event para `purchase`.
- GA4 Event para `search`.
- GA4 Event para `page_view_custom`, mapeando para `page_view` se for necessário substituir page view automático.

## Triggers

Cada trigger deve ouvir um Custom Event com o mesmo nome do evento no `dataLayer`:

- `select_item`
- `view_item`
- `add_to_cart`
- `remove_from_cart`
- `view_cart`
- `begin_checkout`
- `purchase`
- `search`
- `page_view_custom`

## Variáveis de camada de dados

Variáveis recomendadas:

- `ecommerce.currency`
- `ecommerce.value`
- `ecommerce.items`
- `ecommerce.transaction_id`
- `search_term`
- `page_location`
- `page_title`

## Tradução de add_to_cart para GA4

Trigger: Custom Event `add_to_cart`.

Tag: GA4 Event com nome `add_to_cart`.

Parâmetros:

- `currency` = `{{DLV - ecommerce.currency}}`
- `value` = `{{DLV - ecommerce.value}}`
- `items` = `{{DLV - ecommerce.items}}`

## Tradução de purchase para GA4

Trigger: Custom Event `purchase`.

Tag: GA4 Event com nome `purchase`.

Parâmetros:

- `transaction_id` = `{{DLV - ecommerce.transaction_id}}`
- `currency` = `{{DLV - ecommerce.currency}}`
- `value` = `{{DLV - ecommerce.value}}`
- `items` = `{{DLV - ecommerce.items}}`

## Validação antes de publicar

1. Abrir o site com `?debug_tracking=true`.
2. Conferir `window.dataLayer` no console.
3. Ativar GTM Preview somente em ambiente de teste.
4. Verificar se cada trigger dispara uma única tag.
5. Validar payload dos itens e valores.
6. Validar GA4 DebugView.
7. Publicar apenas após aprovação.

## Automação futura via API do GTM

Em dry-run, uma automação poderia:

1. Ler este contrato de eventos.
2. Criar variáveis de camada de dados.
3. Criar triggers Custom Event.
4. Criar tags GA4 Event.
5. Gerar relatório de diff antes de aplicar.
6. Aplicar somente com confirmação humana.

Nenhuma chamada à API do GTM deve ser feita nesta etapa.
