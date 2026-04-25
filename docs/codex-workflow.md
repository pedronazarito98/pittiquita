# Fluxo Codex para pittiquita

Este documento explica como a configuracao do Codex neste repositorio deve ser usada no dia a dia.

## Arquivos de configuracao

Cada arquivo abaixo resolve uma parte diferente do fluxo do agente:

- `AGENTS.md`: instrucoes duraveis do projeto, regras de seguranca e validacao.
- `.codex/config.toml`: padroes do Codex para este projeto, MCP de docs OpenAI, limites de subagentes e registro de agentes customizados.
- `.codex/agents/*.toml`: agentes focados e somente leitura para exploracao, revisao e pesquisa de documentacao.
- `.codex/rules/default.rules`: prompts de aprovacao para comandos destrutivos ou de alto risco.
- `PLANS.md`: template leve de planejamento para mudancas maiores.

## Inicio recomendado

Use esta forma para abrir o Codex ja apontando para a raiz do repositorio:

```bash
codex -C .
```

Use esta forma quando a tarefa depender explicitamente de informacao recente da web:

```bash
codex -C . --search
```

Para trabalhos maiores, comece em Plan mode ou peca para o Codex escrever um plano usando `PLANS.md` antes de alterar codigo.

## Prompts uteis

Cada exemplo abaixo ativa um comportamento esperado da configuracao.

```text
Mapeie a API publica atual e os testes antes de alterar qualquer coisa. Use pittiquita_explorer se for util.
```

```text
Implemente esta mudanca, depois rode pnpm test:run, pnpm typecheck e pnpm build. Termine com scan de alteracoes perigosas.
```

```text
Revise esta branch contra main. Abra agentes focados em estabilidade da API publica, garantias SSR/dev-only e testes ausentes.
```

```text
Pesquise a documentacao atual do Codex pelo MCP de documentacao de desenvolvedores da OpenAI e cite as paginas exatas usadas.
```

## Matriz de validacao do projeto

Esta tabela ajuda o Codex a escolher o menor conjunto de checagens confiavel para cada tipo de mudanca.

| Tipo de mudanca | Validacao minima |
| --- | --- |
| Core utils/hooks | `pnpm test:run`, `pnpm typecheck` |
| Componentes React | `pnpm test:run`, `pnpm typecheck`, smoke visual quando possivel |
| Exports publicos/formato do pacote | `pnpm test:run`, `pnpm typecheck`, `pnpm build` |
| Plugins Vite/Next | `pnpm test:run`, `pnpm build`, checagem relevante no playground/manual |
| Apenas playground | `pnpm --dir playground build` |
| Apenas docs | Revisar links, comandos e exemplos por precisao |

## Observacoes

- O arquivo vazio `playground/.codex` nao e usado como camada de configuracao do Codex. Mantenha a configuracao do projeto na pasta raiz `.codex/`.
- Configuracoes locais em `.codex/` so carregam depois que o projeto e marcado como confiavel no Codex.
- O servidor MCP de documentacao de desenvolvedores da OpenAI esta configurado aqui como MCP HTTP escopado ao projeto.
