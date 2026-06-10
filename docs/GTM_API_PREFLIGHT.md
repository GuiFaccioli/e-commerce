# GTM API Preflight Read-Only

O preflight é a primeira integração com a API real do Google Tag Manager, mas em modo somente leitura.

## O que é

O script `npm run gtm:preflight` autentica localmente com Google APIs, lista contas, containers e workspaces acessíveis e compara o contrato local `tracking/ga4-events.contract.json` com o estado real do GTM.

Ele gera um relatório de diferenças no terminal.

## Diferença entre dry-run e preflight

- `npm run gtm:dry-run`: não acessa Google. Lê apenas o contrato local e mostra o plano esperado.
- `npm run gtm:preflight`: acessa a API real do GTM em modo read-only e compara o contrato com recursos existentes.

## O que o preflight não faz

- Não cria workspace.
- Não cria variável.
- Não cria trigger.
- Não cria tag.
- Não edita nada.
- Não publica container.
- Não chama GA4 Admin API.

## Variáveis de ambiente necessárias

Crie `.env.local` baseado em `.env.example`:

```txt
VITE_GTM_ID=GTM-XXXXXXX

GTM_ACCOUNT_ID=123456789
GTM_CONTAINER_ID=123456789
GTM_WORKSPACE_NAME=Hermes - Ecommerce Tracking
GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-service-account.json
```

## Credencial local segura

Use uma credencial de service account ou credencial local autorizada somente para leitura quando possível.

Regras:

- Não commitar credenciais.
- Não colocar JSON real no repositório.
- Guardar o arquivo em `secrets/` localmente.
- Conferir que `secrets/*.json` está no `.gitignore`.
- Usar escopo read-only: `https://www.googleapis.com/auth/tagmanager.readonly`.

## Como rodar

```bash
npm run gtm:preflight
```

Se faltar variável ou credencial, o script falha com mensagem clara e não altera nada.

## Como interpretar Auth OK

`Auth: OK` significa que a credencial local foi aceita pela Google API e possui acesso de leitura suficiente para iniciar a consulta.

## Como interpretar Account found

`Account found` significa que `GTM_ACCOUNT_ID` existe entre as contas acessíveis pela credencial.

Se falhar, confira:

- ID da conta.
- Permissão da service account no GTM.
- Projeto/credencial usada.

## Como interpretar Container found

`Container found` significa que `GTM_CONTAINER_ID` foi localizado dentro da conta informada.

Se falhar, confira se o container pertence à conta configurada.

## Como interpretar Workspace not found

Se aparecer:

```txt
Workspace not found. It would be created in a future apply step.
```

Isso é apenas um aviso. O preflight não cria workspace. A criação só deve acontecer futuramente em modo apply controlado.

## Como interpretar Diff

O diff mostra o que o contrato espera e o que ainda não existe no workspace real:

- `Variables missing`: Data Layer Variables esperadas ausentes.
- `Triggers missing`: Custom Event Triggers esperados ausentes.
- `Tags missing`: GA4 Event Tags esperadas ausentes.

Se o workspace não existir, todos os itens do contrato aparecerão como ausentes.

## Actions taken: none

Esse bloco confirma que o script não modificou o GTM:

```txt
Actions taken:
* none
```

## Próximos passos para apply controlado

1. Validar `window.dataLayer` no site.
2. Rodar `npm run gtm:dry-run`.
3. Rodar `npm run gtm:preflight`.
4. Revisar o diff.
5. Gerar plano de apply em workspace seguro.
6. Só depois implementar chamadas de escrita na API GTM.
7. Validar no GTM Preview.
8. Publicar manualmente ou via fluxo controlado.
