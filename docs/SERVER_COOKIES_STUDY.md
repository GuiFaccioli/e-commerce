# Estudo de cookies de servidor

Este projeto e uma SPA React/Vite. Ele nao usa Next.js nem possui um backend Express.

Para fins educacionais, o projeto expoe uma Vercel Function em:

```txt
/api/server-cookies/context
```

No deploy da Vercel, essa rota e atendida por `api/server-cookies/context.ts`.
Durante `npm run dev`, o `vite.config.ts` tambem registra uma rota equivalente para estudo local.

## Cookies criados

- `mb_session_id`: identifica a sessao fake do usuario.
- `mb_ecommerce_context`: guarda carrinho, favoritos e produtos vistos recentemente.

Ambos sao cookies `HttpOnly`, com `SameSite=Lax`, `Path=/` e expiracao de 7 dias. Em producao, a flag `Secure` tambem e adicionada.

## Fluxo estudado

1. O usuario adiciona item ao carrinho, favorita um produto ou abre detalhes.
2. O React atualiza o estado local.
3. O frontend envia um resumo seguro para `/api/server-cookies/context`.
4. O servidor local do Vite valida o payload e grava cookies.
5. Ao recarregar, o frontend chama a mesma API.
6. A API le os cookies `HttpOnly` e devolve o contexto para a interface.

O frontend nao acessa os cookies diretamente. Isso simula o fluxo correto para cookies de servidor.

## Limite proposital

Esta camada e didatica. Ela persiste contexto pequeno no navegador via cookie `HttpOnly`, mas nao substitui banco de dados, autenticacao ou storage de producao.
