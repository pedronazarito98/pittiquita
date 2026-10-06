#!/usr/bin/env node
import { realpath } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { installSkill } from './install-skill'

const HELP = `Pittiquita — orientacoes para agentes no projeto consumidor

Uso:
  pittiquita agents init [--dry-run]
  pittiquita --help

Instala .agents/skills/pittiquita e acrescenta um bloco curto ao AGENTS.md
(ou ao AGENTS.override.md ativo). Rode na pasta que contem package.json.
Arquivos personalizados nao sao sobrescritos. --dry-run mostra a previa.
Nao instala dependencias, nao modifica a aplicacao e nao acessa a rede.
`

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0 || (args.length === 1 && ['--help', '-h'].includes(args[0]))) {
    console.log(HELP)
    return
  }

  if (
    args[0] !== 'agents' || args[1] !== 'init' || args.length > 3 ||
    (args[2] !== undefined && args[2] !== '--dry-run')
  ) {
    throw new Error('Argumentos invalidos. Use pittiquita agents init [--dry-run].')
  }

  // Resolve tambem quando o binario e chamado por um link em node_modules/.bin.
  const executable = await realpath(process.argv[1])
  const source = resolve(dirname(executable), '../skills/pittiquita')
  await installSkill(await realpath(process.cwd()), source, args[2] === '--dry-run')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Nao foi possivel instalar a skill.')
  process.exitCode = 1
})
