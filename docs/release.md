# Release

Este pacote publica no npm automaticamente pelo GitHub Actions quando um novo commit chega na branch `main`.

## Publicacao com token

1. Crie um token de acesso no npm com permissao de publicacao para o pacote `pittiquita`.
2. No GitHub, abra as configuracoes do repositorio.
3. Acesse Settings -> Secrets and variables -> Actions -> New repository secret.
4. Crie um secret chamado `NPM_TOKEN` e cole o token do npm como valor.
5. Atualize a `version` no `package.json`, abra um pull request e faca merge na `main`.

O workflow de publicacao roda `pnpm validate`, confere o conteudo do pacote com `npm pack --dry-run`, verifica se a mesma versao ja existe no npm e publica apenas quando a versao e nova.

Nunca commite tokens do npm, nunca coloque tokens de publicacao em um arquivo `.env` versionado e nunca imprima tokens em logs.

Para fazer merge sem publicar, inclua `[skip publish]` na mensagem do commit de merge.

## Alternativa com Trusted Publishing

O npm Trusted Publishing e preferivel quando estiver disponivel, porque permite que o GitHub Actions publique via OIDC em vez de usar um `NPM_TOKEN` de longa duracao.

Nao troque o workflow antes de configurar um trusted publisher nas configuracoes do pacote no npm. No npm, configure:

- Provider: GitHub Actions
- Repositorio: `pedronazarito98/pittiquita`
- Nome do arquivo de workflow: `publish.yml`
- Acao permitida: `npm publish`

Atualmente, o npm exige npm CLI 11.5.1 ou mais novo e Node.js 22.14.0 ou mais novo para Trusted Publishing. Depois de confirmar a configuracao no npm, o workflow pode remover `NODE_AUTH_TOKEN`, adicionar `id-token: write`, usar uma versao compativel de Node/npm e rodar `npm publish --access public` sem `NPM_TOKEN`.

Referencias:

- npm Trusted Publishing: https://docs.npmjs.com/trusted-publishers/
- npm trust CLI: https://docs.npmjs.com/cli/v11/commands/npm-trust/
- Guia do GitHub para publicacao no npm: https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages
