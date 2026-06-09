# Checklist GTM Preview

## Pré-requisitos

1. Criar ou ter um container GTM manualmente.
2. Configurar `VITE_GTM_ID` no ambiente desejado.
3. Fazer novo deploy se estiver testando produção na Vercel.

## Checklist local

1. Criar `.env.local`:

```txt
VITE_GTM_ID=GTM-XXXXXXX
```

2. Rodar o projeto:

```bash
npm run dev
```

3. Abrir o console do navegador.
4. Validar que o GTM carregou:

```js
window.google_tag_manager
```

5. Validar o dataLayer:

```js
window.dataLayer
```

6. Abrir o Preview no GTM.
7. Conectar a URL local ou produção.
8. Clicar em produto.
9. Abrir detalhes do produto.
10. Adicionar ao carrinho.
11. Usar filtro ou busca.
12. Abrir carrinho.
13. Iniciar checkout.
14. Finalizar compra simulada.

## Eventos esperados no Preview

- `page_view_custom`
- `view_item`
- `select_item`
- `add_to_cart`
- `filter_products`
- `view_cart`
- `begin_checkout`
- `purchase`

## Comandos úteis no console

```js
window.dataLayer.map(item => item.event)
```

```js
window.dataLayer.filter(item => item.event === "add_to_cart").at(-1)
```

```js
window.dataLayer.filter(item => item.event === "purchase").at(-1)
```

## Problemas comuns

### Evento aparece no dataLayer, mas não aparece no Preview

- Verificar se o GTM ID é o mesmo container aberto no Preview.
- Recarregar a sessão do Tag Assistant.
- Verificar bloqueador de anúncios.
- Confirmar se `window.google_tag_manager` existe.

### GTM ID errado

- Conferir `VITE_GTM_ID` em `.env.local` ou na Vercel.
- Confirmar formato `GTM-XXXXXXX`.
- Fazer novo deploy após alterar variável na Vercel.

### Variável de ambiente ausente

- Sem `VITE_GTM_ID`, o site funciona, mas o GTM não carrega.
- Console esperado nesse caso: `window.google_tag_manager` fica `undefined`.

### Deploy antigo na Vercel

- Variáveis novas exigem redeploy.
- Confirmar se o deploy ativo é posterior à configuração da variável.

### Bloqueador de anúncios

- Extensões podem bloquear `googletagmanager.com`.
- Testar em janela anônima sem extensões.

### Trigger com nome diferente do evento

- Custom Event Trigger precisa usar exatamente o nome do evento do dataLayer.
- Exemplo: `add_to_cart`, não `Add To Cart`.

### Tag disparando sem parâmetros

- Verificar se a tag GA4 usa as Data Layer Variables corretas.
- Conferir a aba Variables no Preview.

### Data Layer Variable retornando undefined

- Conferir caminho da variável, por exemplo `ecommerce.items`.
- Conferir se o evento selecionado na timeline realmente possui `ecommerce`.
- Eventos como `filter_products` não usam `ecommerce`.
