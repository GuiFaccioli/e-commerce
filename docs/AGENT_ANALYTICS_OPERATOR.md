# Guia operacional para agentes de analytics — TechZone Periféricos

Este documento define o padrão obrigatório de operação para agentes Codex/pi dev em tarefas de analytics, tracking, GTM, GA4, dataLayer, dashboards e automação neste projeto.

## 1. Começar pelo estado atual

Antes de alterar código, documentação ou configuração, declare a camada de trabalho:

- **Camada 1 — Site/dataLayer**: eventos no site, payloads, `window.dataLayer`, debug local.
- **Camada 2 — GTM**: instalação do GTM, Preview, triggers, variáveis, tags no container.
- **Camada 3 — GA4**: eventos recebidos no GA4, DebugView, parâmetros, conversões futuras.
- **Camada 4 — Automação Hermes/Codex**: contratos JSON, dry-run, planos de alteração, API futura.
- **Camada 5 — Dashboard/validação**: relatórios, painéis, reconciliação e confiabilidade dos dados.

Nunca misture camadas sem explicar a origem do dado e o destino esperado.

## 2. Cadeia obrigatória

Toda tarefa deve seguir esta cadeia mental:

```txt
AÇÃO REAL
→ DADO BRUTO
→ EVENTO
→ COLETA
→ DESTINO
→ MÉTRICA
→ CONFIABILIDADE
→ DECISÃO
```

Exemplo:

```txt
Clique em Comprar agora
→ carrinho e total local
→ purchase no dataLayer
→ GTM escuta purchase
→ GA4 recebe purchase futuramente
→ compra simulada / receita simulada
→ transaction_id, value e items validados
→ decidir se o funil está confiável
```

## 3. Não pular validação

Antes de avançar de camada, valide a camada anterior:

- Antes de criar tag no GTM, validar se o evento existe no `window.dataLayer`.
- Antes de enviar para GA4, validar se o GTM escutou o evento no Preview.
- Antes de criar dashboard, validar se o GA4 recebeu o evento e parâmetros corretos.
- Antes de automatizar, validar contrato, dry-run e diff esperado.

Validação mínima no console:

```js
window.dataLayer.map(item => item.event)
```

Para eventos e-commerce:

```js
window.dataLayer
  .filter(item => item.event)
  .map(item => ({
    event: item.event,
    value: item.ecommerce?.value,
    currency: item.ecommerce?.currency,
    items: item.ecommerce?.items,
    transaction_id: item.ecommerce?.transaction_id
  }))
```

## 4. Nunca automatizar direto em produção

Para GTM/GA4, a ordem obrigatória é:

1. Contrato JSON.
2. Dry-run.
3. Plano de alterações.
4. API real apenas em workspace seguro.
5. Validação.
6. Publicação manual ou controlada.

Proibido:

- Criar container real sem solicitação explícita.
- Publicar GTM automaticamente em produção.
- Configurar GA4 real sem validação anterior.
- Inventar métricas ou parâmetros não existentes.
- Enviar dados para plataformas externas sem confirmação.

## 5. Qualquer mudança de código

Sempre executar:

```bash
npm run build
```

Também executar:

```bash
npm run lint
```

Se `npm run lint` não existir, informar no resumo final.

## 6. Sempre mostrar arquivos alterados

No resumo final, liste:

- Arquivos criados.
- Arquivos alterados.
- Eventos afetados.
- Validações feitas.
- Riscos ou pendências.

## 7. Sempre finalizar com Git

Ao final:

```bash
git status
```

Se tudo estiver correto:

```bash
git add .
git commit -m "mensagem objetiva"
git push origin main
```

A mensagem deve explicar a alteração, por exemplo:

```txt
fix: complete ecommerce tracking events
feat: add GTM setup foundation
docs: add analytics agent operator guide
```

## 8. Formato obrigatório da resposta final

Toda tarefa deve terminar com este formato:

```txt
Estado:
Camada trabalhada:
O que foi feito:
Arquivos criados:
Arquivos alterados:
Como testar:
Resultado do build:
Resultado do lint:
Status do git:
Commit:
```

Use linguagem direta, operacional e sem enrolação.

## 9. Linguagem e comportamento

Faça:

- Responder com foco em execução.
- Explicar origem do dado.
- Validar antes de avançar.
- Separar site, GTM, GA4, automação e dashboard.
- Declarar riscos e pendências.

Evite:

- Respostas genéricas.
- Prometer trabalho futuro como se estivesse feito.
- Configurar algo real sem validação.
- Inventar métrica.
- Misturar GTM com GA4 sem explicar o caminho do dado.
- Hardcodar IDs reais.

## 10. Exemplos de resposta

### Exemplo — correção de evento dataLayer

```txt
Estado: implementação concluída e validada.
Camada trabalhada: Camada 1 — Site/dataLayer.
O que foi feito: corrigi select_item para enviar ecommerce.currency, ecommerce.value e ecommerce.items.
Arquivos criados: nenhum.
Arquivos alterados: src/analytics/dataLayer.ts, docs/TRACKING_EVENTS.md.
Eventos afetados: select_item.
Como testar: clicar em produto e rodar window.dataLayer.filter(item => item.event === "select_item").at(-1).
Resultado do build: npm run build passou.
Resultado do lint: npm run lint passou.
Status do git: limpo após commit e push.
Commit: abc1234 fix: complete ecommerce tracking events.
```

### Exemplo — instalação GTM via variável de ambiente

```txt
Estado: GTM preparado, sem container hardcoded.
Camada trabalhada: Camada 2 — GTM.
O que foi feito: criei loader que lê VITE_GTM_ID e injeta o script somente quando a variável existe.
Arquivos criados: src/analytics/gtm.ts, docs/GTM_SETUP.md.
Arquivos alterados: src/main.tsx, README.md.
Eventos afetados: nenhum evento alterado; GTM passa a escutar o dataLayer quando configurado.
Como testar: configurar VITE_GTM_ID=GTM-XXXXXXX e validar window.google_tag_manager.
Resultado do build: npm run build passou.
Resultado do lint: npm run lint passou.
Status do git: limpo após commit e push.
Commit: abc1234 feat: add GTM setup foundation.
```

### Exemplo — dry-run de automação GTM

```txt
Estado: dry-run documentado, sem chamada real de API.
Camada trabalhada: Camada 4 — Automação Hermes/Codex.
O que foi feito: gerei contrato JSON e plano de alterações para triggers e tags GA4 futuras.
Arquivos criados: docs/GTM_AUTOMATION_DRY_RUN.md.
Arquivos alterados: docs/GTM_AUTOMATION_PLAN.md.
Eventos afetados: add_to_cart, purchase, view_item, begin_checkout.
Como testar: revisar o diff do dry-run e comparar com docs/TRACKING_EVENTS.md.
Resultado do build: npm run build passou.
Resultado do lint: npm run lint passou.
Status do git: limpo após commit e push.
Commit: abc1234 docs: add GTM automation dry-run plan.
```

### Exemplo — criação futura de tag GA4

```txt
Estado: plano manual criado; nenhuma tag real publicada.
Camada trabalhada: Camada 3 — GA4, com dependência da Camada 2 — GTM.
O que foi feito: documentei a tag GA4 Event - add_to_cart, trigger e parâmetros.
Arquivos criados: nenhum.
Arquivos alterados: docs/GTM_GA4_MANUAL_PLAN.md.
Eventos afetados: add_to_cart.
Como testar: no GTM Preview, clicar em adicionar ao carrinho e verificar DLVs ecommerce.currency, ecommerce.value e ecommerce.items.
Resultado do build: npm run build passou.
Resultado do lint: npm run lint passou.
Status do git: limpo após commit e push.
Commit: abc1234 docs: update GA4 manual tag plan.
```

### Exemplo — validação de purchase com transaction_id

```txt
Estado: purchase validado no dataLayer.
Camada trabalhada: Camada 1 — Site/dataLayer.
O que foi feito: validei que purchase dispara somente após compra simulada e contém transaction_id único.
Arquivos criados: nenhum.
Arquivos alterados: docs/TRACKING_VALIDATION.md.
Eventos afetados: purchase.
Como testar: finalizar checkout fake e rodar window.dataLayer.filter(item => item.event === "purchase").at(-1).
Resultado do build: npm run build passou.
Resultado do lint: npm run lint passou.
Status do git: limpo após commit e push.
Commit: abc1234 docs: update purchase validation checklist.
```
