import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { applyFileChanges, readProjectFile, type FileChange } from './project-files'

const SKILL_DIRECTORY = '.agents/skills/pittiquita'
const SKILL_FILES = [
  'SKILL.md',
  'references/react-vite.md',
  'references/nextjs.md',
  'references/storybook.md',
  'references/targets.md',
  'references/troubleshooting.md',
]
const START_MARKER = '<!-- pittiquita:agents:start -->'
const END_MARKER = '<!-- pittiquita:agents:end -->'

function instructionBlock(newline: string): string {
  return [
    START_MARKER,
    '## Pittiquita',
    '',
    'Quando a tarefa envolver configurar pittiquita/pitiquita, adicionar o painel',
    'ou marcar regioes para captura, leia `.agents/skills/pittiquita/SKILL.md`.',
    'Carregue apenas a referencia do framework e da tarefa em andamento.',
    'Confira a API da versao instalada e reutilize o painel existente.',
    'Estas instrucoes se aplicam ao Pittiquita; preserve as regras deste projeto.',
    END_MARKER,
  ].join(newline)
}

export async function installSkill(root: string, source: string, dryRun: boolean) {
  if (await readProjectFile(root, 'package.json') === null) {
    throw new Error('Execute na pasta do projeto consumidor que contem package.json.')
  }

  const changes: FileChange[] = []

  for (const file of SKILL_FILES) {
    const path = `${SKILL_DIRECTORY}/${file}`
    const content = await readFile(join(source, file), 'utf8')
    const previous = await readProjectFile(root, path)

    if (previous !== null && previous !== content) {
      throw new Error(`A skill existente difere do pacote: ${path}. Revise e mescle manualmente; nada foi escrito.`)
    }
    if (previous === null) changes.push({ path, previous, content })
  }

  // Um override nao vazio tem precedencia sobre AGENTS.md no Codex.
  const override = await readProjectFile(root, 'AGENTS.override.md')
  const instructionPath = override?.trim() ? 'AGENTS.override.md' : 'AGENTS.md'
  const previous = instructionPath === 'AGENTS.override.md'
    ? override
    : await readProjectFile(root, instructionPath)
  const newline = previous?.includes('\r\n') ? '\r\n' : '\n'
  const block = instructionBlock(newline)

  if (previous?.includes(START_MARKER) || previous?.includes(END_MARKER)) {
    if (
      !previous.includes(block) ||
      previous.split(START_MARKER).length !== 2 ||
      previous.split(END_MARKER).length !== 2
    ) {
      throw new Error(`O bloco Pittiquita em ${instructionPath} foi editado. Revise-o manualmente; nada foi escrito.`)
    }
  } else {
    changes.push({
      path: instructionPath,
      previous,
      content: `${previous ?? ''}${previous ? newline + newline : ''}${block}${newline}`,
    })
  }

  if (changes.length === 0) {
    console.log('A skill Pittiquita e as instrucoes ja estao instaladas. Nenhum arquivo alterado.')
    return
  }

  if (dryRun) {
    console.log(`Previa em ${root}:`)
    for (const change of changes) {
      console.log(`- ${change.previous === null ? 'Criar' : 'Acrescentar bloco em'} ${change.path}`)
    }
    console.log('Nenhum arquivo escrito. Execute sem --dry-run para instalar.')
    return
  }

  await applyFileChanges(root, changes)
  console.log('Skill instalada. Use $pittiquita para pedir a configuracao ou marcar uma regiao.')
  console.log('Nenhum componente, dependencia ou arquivo de configuracao da aplicacao foi alterado.')
}
