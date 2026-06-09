# GTM Setup — TechZone Periféricos

O Google Tag Manager é opcional neste projeto. Por padrão, o site funciona apenas com `window.dataLayer` local. O GTM só é carregado quando a variável `VITE_GTM_ID` existe.

## Onde o GTM é carregado

- Utilitário: `src/analytics/gtm.ts`
- Inicialização: `src/main.tsx`

A inicialização:

1. verifica se está no browser;
2. lê `import.meta.env.VITE_GTM_ID`;
3. garante `window.dataLayer`;
4. envia `{ "gtm.start": Date.now(), event: "gtm.js" }`;
5. injeta o script `https://www.googletagmanager.com/gtm.js?id=...`;
6. evita duplicar o snippet se o app renderizar novamente.

Não há ID hardcoded no código.

## Configurar localmente

Crie um arquivo `.env.local` baseado em `.env.example`:

```txt
VITE_GTM_ID=GTM-XXXXXXX
```

Depois rode:

```bash
npm run dev
```

Se a variável não existir, o site continua funcionando normalmente e nenhum script do GTM é carregado.

## Configurar na Vercel

1. Acesse o projeto na Vercel.
2. Vá em **Settings** → **Environment Variables**.
3. Crie a variável:

```txt
VITE_GTM_ID=GTM-XXXXXXX
```

4. Selecione os ambientes desejados, por exemplo Production/Preview.
5. Salve e faça um novo deploy.

## Validar no console

Com `VITE_GTM_ID` configurado, abra o site e rode:

```js
window.google_tag_manager
```

Também valide os eventos do dataLayer:

```js
window.dataLayer.map(item => item.event)
```

Último add_to_cart:

```js
window.dataLayer.filter(item => item.event === "add_to_cart").at(-1)
```

## GTM Preview

1. Abra o container no Google Tag Manager.
2. Clique em **Preview**.
3. Informe a URL local ou da Vercel.
4. Conecte o Tag Assistant.
5. Interaja com a loja: produto, carrinho, checkout e compra fake.
6. Verifique se os eventos aparecem na timeline do Preview.

Eventos esperados:

- `page_view_custom`
- `view_item`
- `select_item`
- `add_to_cart`
- `filter_products`
- `view_cart`
- `begin_checkout`
- `purchase`

## Observação sobre noscript

O fallback `<noscript>` padrão do GTM só funciona quando inserido no HTML inicial. Como este projeto carrega o GTM dinamicamente via variável de ambiente no React/Vite, não há fallback noscript dinâmico confiável sem hardcodar ID. A estratégia segura atual é carregar apenas o script quando `VITE_GTM_ID` existir.
