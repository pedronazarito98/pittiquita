---
name: pittiquita
description: Configurar Pittiquita em projetos React, Vite, Next.js e Storybook, posicionar o painel e marcar componentes ou regioes pedidos pelo usuario para captura no Figma. Use quando a tarefa mencionar pittiquita ou pitiquita, ou ajustar a captura em um projeto que ja usa o pacote.
---

# Pittiquita em projetos consumidores

Prepare a interface React local solicitada pelo usuário para o fluxo de captura. Preserve a arquitetura, o layout e o design system do projeto consumidor. Esta skill orienta o uso do pacote; não é uma autorização para importar, publicar ou alterar arquivos no Figma.

## Identifique o trabalho

Leia as instruções locais, o manifest do app e o ponto de montagem relevante. Localize importações de `pittiquita`, integrações em Vite/Storybook e atributos `data-figma-target`/`data-debug-layer` antes de adicionar qualquer coisa. Em monorepos, trabalhe no app solicitado, usando seu gerenciador e a convenção de dependências do workspace.

Confira a versão **e os exports reais do pacote instalado**, incluindo declarações TypeScript. Esta skill pode ter sido copiada de uma versão diferente. Não invente APIs nem presuma que atualizar o número da versão disponibiliza algo ainda não publicado. Uma resolução como `node -p "require.resolve('pittiquita/storybook')"` confere o subpath sem executar o módulo; não use `pittiquita/package.json` via import, pois ele não é um export público.

Distinga o pedido:

- **Configurar o projeto:** escolha uma única estratégia de montagem na superfície solicitada.
- **“Adicionar no card/header/tabela”:** se o painel já existe, normalmente basta marcar esse elemento como região. Não monte um painel por card ou linha.
- **Mover/limitar o painel:** respeite o canto, rota ou story solicitados; não habilite globalmente um pedido local.
- **Corrigir captura:** inspecione a causa com [troubleshooting](references/troubleshooting.md).

Se o alvo puder ser localizado no código e no contexto, prossiga. Pergunte apenas quando houver mais de um alvo plausível que mude o escopo, ou quando o pedido não distinguir entre posicionar o painel e marcar a região.

## Leia apenas a referência relevante

| Situação | Referência |
| --- | --- |
| React manual, painel por rota, Vite automático | [React e Vite](references/react-vite.md) |
| Next.js App Router ou Pages Router | [Next.js](references/nextjs.md) |
| Storybook React, Canvas, Docs e iframe | [Storybook](references/storybook.md) |
| Adicionar regiões ao componente solicitado | [Alvos de captura](references/targets.md) |
| Painel ausente/duplicado, região ausente, CSP ou captura | [Diagnóstico](references/troubleshooting.md) |

Não carregue todas as referências no início. Uma tarefa de marcar uma região em um projeto configurado normalmente só precisa de `targets.md`.

## Preserve os limites do produto

- Um painel por documento de preview/página. Reutilize a integração existente antes de adicionar outra.
- React e React DOM são necessários; não trate os adaptadores como suporte a Vue, Angular ou Web Components.
- O painel e o script aceitam somente `localhost` e `127.0.0.1`. `0.0.0.0` pode ser endereço de bind, mas não é hostname aceito para abrir a captura.
- O guard de localhost é de runtime. Use a condição de desenvolvimento do framework e verifique o bundle se o pedido exigir excluir bytes em produção.
- Não adicione dependências ou alterações globais para uma simples marcação. Não mude hooks, estilos, semântica ou layout sem necessidade.
- Os alvos só existem quando renderizados e visíveis. Marcação de região não abre modais, não expande seções nem configura o seletor do importador externo automaticamente.
- Ativar captura injeta um script externo. Use conteúdo de desenvolvimento apropriado; não leia credenciais, sessões ou arquivos de autenticação para configurar Pittiquita.

## Conclua com evidência

Execute as validações existentes adequadas aos arquivos alterados; não crie testes ou mocks sem solicitação do usuário. Verifique no navegador quando disponível: um painel, regiões corretas, interação preservada e comportamento de navegação. Ative a captura somente quando esse fluxo fizer parte do pedido.

Reporte a superfície configurada, arquivos alterados, a URL local, como chegar ao componente/estado solicitado, verificações realizadas e limites não verificados. Separe “painel configurado”, “script injetado” e “importação no Figma concluída”; só o último requer evidência no Figma. Não faça push, merge ou publicação fora da autorização do usuário e das regras do repositório.
