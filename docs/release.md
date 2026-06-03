# Release

Este pacote publica no npm automaticamente pelo GitHub Actions quando um novo commit chega na branch `main`.

## Publicacao recomendada com Trusted Publishing

O npm Trusted Publishing e o caminho recomendado, porque permite que o GitHub Actions publique via OIDC sem armazenar um `NPM_TOKEN` de longa duracao.

Para habilitar:

1. Abra o pacote `pittiquita` no npm.
2. Va em Settings -> Trusted publishing.
3. Escolha GitHub Actions como provider.
4. Configure:
   - Organization or user: `pedronazarito98`
   - Repository: `pittiquita`
   - Workflow filename: `publish.yml`
   - Allowed actions: `npm publish`
5. Salve a configuracao.

O workflow de publicacao usa `id-token: write`, Node.js 22 e npm CLI atualizado para permitir que o npm autentique a publicacao por OIDC.

Depois disso, nao e necessario criar nem manter `NPM_TOKEN` no GitHub.

## Fluxo de publicacao

1. Atualize a `version` no `package.json` para uma versao ainda nao publicada.
2. Abra um pull request.
3. Faca merge na `main`.
4. O workflow roda `pnpm validate`.
5. O workflow confere o conteudo com `npm pack --dry-run`.
6. O workflow verifica se a mesma versao ja existe no npm.
7. Se a versao for nova, o workflow publica com `npm publish --access public`.

Para fazer merge sem publicar, inclua `[skip publish]` na mensagem do commit de merge.

## Erro EOTP

Se o GitHub Actions falhar com `npm error code EOTP`, o npm esta exigindo um codigo de 2FA para publicar.

Isso normalmente acontece quando o workflow usa `NPM_TOKEN` e o token nao tem bypass de 2FA. Trusted Publishing corrige esse problema porque troca o token por autenticacao OIDC de curta duracao.

Se for necessario continuar com token em vez de Trusted Publishing, crie no npm um granular access token com permissao de publicacao para `pittiquita` e bypass de 2FA habilitado. Depois substitua o valor do secret `NPM_TOKEN` no GitHub. Nunca commite tokens do npm, nunca coloque tokens de publicacao em um arquivo `.env` versionado e nunca imprima tokens em logs.

## Requisitos do Trusted Publishing

O npm exige npm CLI 11.5.1 ou mais novo e Node.js 22.14.0 ou mais novo para Trusted Publishing.

O trusted publisher precisa apontar exatamente para:

- Repositorio: `pedronazarito98/pittiquita`
- Arquivo de workflow: `publish.yml`
- Caminho no repositorio: `.github/workflows/publish.yml`

Referencias:

- npm Trusted Publishing: https://docs.npmjs.com/trusted-publishers/
- npm trust CLI: https://docs.npmjs.com/cli/v11/commands/npm-trust/
- Guia do GitHub para publicacao no npm: https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages
