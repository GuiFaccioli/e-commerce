# Setup de tracking

A base de tracking está preparada, mas não envia dados para ferramentas externas por padrão.

## Debug local

O painel visual aparece automaticamente em desenvolvimento (`npm run dev`) ou em qualquer ambiente com a query string:

```txt
?debug_tracking=true
```

Ele mostra os últimos eventos enviados ao `dataLayer`, horário, payload resumido e botão para limpar o histórico local.

## Validar no navegador

1. Abra a loja.
2. Faça ações reais: pesquisar, filtrar, clicar em produto, adicionar ao carrinho, abrir carrinho, checkout e compra fake.
3. No console, rode:

```js
window.dataLayer
```

Você deve ver eventos como:

- `page_view_custom`
- `select_item`
- `view_item`
- `add_to_cart`
- `remove_from_cart`
- `view_cart`
- `begin_checkout`
- `purchase`
- `search`

## Variável de ambiente para GTM

O GTM só será carregado se existir uma variável de ambiente. Não há ID hardcoded no código.

Para Vite/Vercel, configure:

```txt
VITE_GTM_ID=GTM-XXXXXXX
```

O código também tenta ler `NEXT_PUBLIC_GTM_ID` por compatibilidade, mas neste projeto Vite o recomendado é `VITE_GTM_ID`.

Se a variável não existir, o site continua funcionando normalmente e os eventos seguem disponíveis em `window.dataLayer`.

## Onde está a implementação

- Helper central: `src/lib/dataLayer.ts`
- Eventos e-commerce: `src/analytics/dataLayer.ts`
- Disparos nas ações reais: `src/App.tsx`
- Painel de debug: `src/components/TrackingDebugPanel.tsx`

## Próximos passos

1. Criar container GTM real.
2. Configurar tags GA4 Event lendo os eventos do `dataLayer`.
3. Validar no GTM Preview.
4. Validar no DebugView do GA4.
5. Só depois publicar o container.
