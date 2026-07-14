# Release

O pacote publica no npm somente quando uma tag semantica no formato `vX.Y.Z` e enviada ao GitHub. Merges comuns em `main` nao disparam publicacao.

## Publicacao com Trusted Publishing

O workflow usa npm Trusted Publishing por OIDC, sem `NPM_TOKEN` de longa duracao.

Configure uma unica vez no pacote `pittiquita` no npm:

1. Abra **Settings -> Trusted publishing**.
2. Escolha **GitHub Actions** como provider.
3. Configure:
   - Organization or user: `pedronazarito98`
   - Repository: `pittiquita`
   - Workflow filename: `publish.yml`
   - Allowed action: `npm publish`
4. Salve a configuracao.

O workflow concede somente `contents: read` e `id-token: write`, usa Node.js 22 e atualiza o npm CLI para uma versao compativel com OIDC.

## Checklist de release

1. Garanta que a branch `main` esta verde e contem exatamente o codigo que sera publicado.
2. Atualize `version` no `package.json` seguindo Semantic Versioning.
3. Atualize a secao `Unreleased` do `CHANGELOG.md` e registre a versao/data.
4. Abra e aprove um pull request de release.
5. Depois do merge, crie uma tag exatamente igual a versao do manifesto:

```bash
git switch main
git pull --ff-only
git tag -a v0.2.0 -m "release: v0.2.0"
git push origin v0.2.0
```

6. Acompanhe o workflow **Publicar no npm**.
7. Confirme no npm que a versao, arquivos e proveniencia foram publicados corretamente.

## Gates executados antes da publicacao

O workflow interrompe a release quando qualquer gate falha:

- tag fora do formato `vX.Y.Z`;
- tag diferente de `package.json#version`;
- instalacao congelada do pacote ou playground inconsistente;
- lint, testes, typecheck ou build com erro;
- playground consumidor sem build;
- artefatos versionados da demo invalidos;
- tarball npm inesperado;
- versao ja existente no npm.

A publicacao final usa:

```bash
npm publish --access public --provenance
```

## Por que a publicacao nao ocorre em todo merge

Publicar em cada push de `main` mistura integracao continua com release e torna um bump acidental de versao suficiente para publicar. A tag explicita cria um ponto auditavel, permite revisar o changelog e garante que a versao declarada corresponde ao artefato publicado.

## Falhas comuns

### A tag nao corresponde ao manifesto

Exemplo: tag `v0.2.0` com `package.json` em `0.1.7`. Exclua a tag incorreta somente se ela ainda nao representar uma release publica, corrija o manifesto e crie uma nova tag valida. Nunca mova silenciosamente uma tag que ja foi consumida por terceiros.

### A versao ja existe no npm

Versoes npm sao imutaveis. Incremente `patch`, `minor` ou `major`, atualize o changelog e crie uma nova tag.

### Erro EOTP ou autenticacao

Confirme que o Trusted Publisher aponta exatamente para:

- Repositorio: `pedronazarito98/pittiquita`
- Workflow: `.github/workflows/publish.yml`

Nao adicione tokens ao repositorio, arquivos `.env`, logs ou descricoes de PR. Se OIDC nao estiver disponivel, um token granular com escopo minimo e bypass de 2FA pode ser usado como contingencia temporaria, mas exige uma mudanca revisada no workflow.

## Rollback

Uma versao publicada nao pode ser sobrescrita. Para corrigir uma release:

1. reverta ou corrija o codigo em um novo PR;
2. incremente a versao;
3. documente a correcao no changelog;
4. publique uma nova tag.

Use `npm deprecate` apenas quando consumidores precisarem ser alertados sobre uma versao defeituosa. Evite `unpublish`, pois ele quebra instalacoes reproduziveis e possui restricoes do npm.

## Referencias

- npm Trusted Publishing: https://docs.npmjs.com/trusted-publishers/
- npm provenance: https://docs.npmjs.com/generating-provenance-statements/
- GitHub Actions para pacotes Node.js: https://docs.github.com/actions/publishing-packages/publishing-nodejs-packages
