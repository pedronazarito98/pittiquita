# Diagnóstico focado

## O painel não aparece

1. Confirme o hostname no navegador: apenas `localhost` ou `127.0.0.1` são aceitos. Endereços LAN, `::1`, `0.0.0.0` e domínios de preview não são aceitos pelo guard atual.
2. Confirme a montagem real: o pacote instalado sozinho não injeta UI. O plugin Vite só roda em `serve`; Storybook monta no preview; Next precisa de um componente montado.
3. Confira o guard de ambiente e se o usuário recolheu o painel com Hide. Não remova guards para “consertar” uma página de produção.
4. Confira o export instalado. `withPittiquita` de `pittiquita/next` não monta nada.

## Existem dois painéis

Procure simultaneamente `pittiquita()` em Vite, `FigmaCapturePanel`, `PittiquitaNextPanel` e decorators de Storybook. Escolha uma montagem por documento. Um painel no app e outro no documento independente do Storybook são superfícies diferentes.

## A região não aparece

Confira os atributos no DOM real, visibilidade e dimensões. Um componente customizado pode não encaminhar os atributos. Alvos dentro de outros iframes ou Shadow DOM não são descobertos por essa varredura. Leia [targets.md](targets.md) antes de adicionar wrappers ou hooks.

## A captura não conclui

- Verifique se o hash contém `figmacapture=` e se existe uma tag `script[data-figma-capture-loader]` no documento correto.
- Uma tag ou mensagem de ativação não prova que o script foi carregado nem que houve importação no Figma.
- Se houver erro de rede/CSP, use as opções reais `scriptSrc`, `nonce`, `integrity` e `crossOrigin` conforme a política já adotada pelo projeto. Não desative CSP ou invente um hash SRI. Não leia credenciais para resolver a configuração.
- Em Storybook, use a URL do iframe em uma aba isolada. Capturar a URL do manager pode incluir a interface do Storybook.
- A primeira ativação substitui hashes que não são de captura. Em apps com hash router, isole o fluxo ou preserve a navegação; não assuma composição automática de hashes.

## Painel cobre o componente

Reutilize Hide/Show ou `position` nos quatro cantos. O painel continua fixo e pode ocupar grande parte de um preview estreito. Não redesenhe o componente capturado para acomodar a ferramenta.

## Produção e headless

Retornar `null` fora de localhost não prova ausência do código no bundle. `FigmaTarget`/`figmaTarget()` não possuem guard de ambiente.

Os hooks `useFigmaRegions()` e `useFigmaCapture()` são habilitados por padrão; o consumidor headless precisa fornecer `enabled` e guardar sua própria UI. `activate()` também deve ser chamado apenas pelo fluxo habilitado. Não introduza uma implementação headless para um pedido que o painel existente resolve.

Rode os scripts existentes pertinentes. Se a suíte existente falhar em Node 26 com Web Storage, confirme a versão do Node e o erro antes de atribuir a regressão ao código; esse repositório já precisou de `NODE_OPTIONS=--no-experimental-webstorage`. Não aplique esse ajuste globalmente a outros projetos sem reproduzir o problema.
