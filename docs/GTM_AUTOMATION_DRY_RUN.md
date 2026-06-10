# GTM Automation Dry Run

Este dry-run é a primeira automação segura para transformar o contrato de eventos do `dataLayer` em um plano de configuração futura no Google Tag Manager e GA4.

## O que é

O dry-run lê `tracking/ga4-events.contract.json` e mostra no terminal quais itens seriam criados no GTM:

- Data Layer Variables.
- Custom Event Triggers.
- GA4 Event Tags.
- Parâmetros enviados por tag.
- Warnings de qualidade do contrato.

## O que ele não faz

Este comando não chama API real do GTM, não chama API real do GA4, não cria tags reais, não publica container e não usa credenciais.

Ele apenas imprime um plano local e validável.

## Contrato JSON

Arquivo:

```txt
tracking/ga4-events.contract.json
```

O contrato descreve:

- Projeto.
- Container placeholder.
- Measurement ID placeholder.
- Eventos existentes no `dataLayer`.
- Nome futuro do evento GA4.
- Trigger GTM esperado.
- Tag GA4 esperada.
- Parâmetros e caminhos no `dataLayer`.
- Parâmetros obrigatórios.
- Métricas futuras.
- Riscos de qualidade.

IDs como `GTM-XXXXXXX` e `G-XXXXXXXXXX` são placeholders. Não usar IDs reais hardcoded.

## Como rodar

```bash
npm run gtm:dry-run
```

## Como interpretar Variables to create

Cada linha indica uma Data Layer Variable futura do GTM:

```txt
DLV - ecommerce.currency → ecommerce.currency
```

Isso significa que o GTM precisaria de uma variável chamada `DLV - ecommerce.currency` lendo o caminho `ecommerce.currency` no `dataLayer`.

## Como interpretar Triggers to create

Cada linha indica um Custom Event Trigger futuro:

```txt
CE - add_to_cart listens to add_to_cart
```

Isso significa que o GTM deve ouvir o evento `add_to_cart` enviado pelo site.

## Como interpretar Tags to create

Cada bloco indica uma tag GA4 Event futura:

```txt
GA4 Event - add_to_cart sends add_to_cart
```

Os parâmetros mostram quais DLVs seriam usadas:

```txt
currency ← {{DLV - ecommerce.currency}}
value ← {{DLV - ecommerce.value}}
items ← {{DLV - ecommerce.items}}
```

## Como interpretar Warnings

- `Warnings: none`: contrato passou nas validações locais.
- Warning de `requiredParameters`: evento precisa declarar parâmetros obrigatórios.
- Warning de `purchase`: `transaction_id` precisa ser obrigatório.
- Warning de ecommerce sem `items`: evento e-commerce está incompleto.
- Warning de path vazio: algum parâmetro não aponta para um caminho válido do `dataLayer`.

## Pontos manuais que isso pretende automatizar futuramente

- Criação de Data Layer Variables.
- Criação de Custom Event Triggers.
- Criação de GA4 Event Tags.
- Associação de parâmetros GA4 com DLVs.
- Geração de relatório de diff antes de aplicar mudanças reais.

## Próximos passos para API real

1. Validar o contrato contra eventos reais no `window.dataLayer`.
2. Executar dry-run e revisar warnings.
3. Gerar plano de alterações por workspace.
4. Somente depois usar API real do GTM em workspace seguro.
5. Validar no GTM Preview.
6. Validar no GA4 DebugView.
7. Publicar manualmente ou via fluxo controlado.
