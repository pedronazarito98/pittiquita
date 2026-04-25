# PLANS.md - pittiquita

Use este template para tarefas maiores do Codex antes da implementacao.

## Objetivo

Explique o resultado visivel para o usuario e os arquivos ou superficies provavelmente envolvidos.

## Contexto

Preencha esta parte para dar ao Codex os pontos de partida corretos.

- Entry points relevantes:
- Testes existentes:
- Restricoes vindas de `AGENTS.md`:
- Docs externas ou fontes MCP necessarias:

## Plano

Estes passos mantem a execucao pequena, verificavel e facil de revisar.

1. Mapear o comportamento atual.
2. Identificar a menor mudanca coerente.
3. Implementar em arquivos focados.
4. Adicionar ou atualizar testes quando o comportamento mudar.
5. Rodar validacao.
6. Revisar o diff em busca de alteracoes perigosas.

## Validacao

Use esta lista como base e ajuste conforme o tipo de mudanca.

- `pnpm test:run`
- `pnpm typecheck`
- `pnpm build`
- `pnpm --dir playground build` quando o comportamento do playground mudar

## Concluido quando

Estes criterios dizem ao Codex quando ele pode encerrar a tarefa.

- O comportamento solicitado foi implementado.
- Testes e checagens relevantes passaram, ou checagens puladas foram explicadas explicitamente.
- A resposta final inclui resumo conciso, validacao e riscos restantes.
