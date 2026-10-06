import { constants } from 'node:fs'
import { lstat, mkdir, open, readFile } from 'node:fs/promises'
import { dirname, join, sep } from 'node:path'

export type FileChange = {
  path: string
  previous: string | null
  content: string
}

/** Recusa links e caminhos especiais antes de ler ou escrever arquivos do projeto. */
async function inspectPath(root: string, relativePath: string) {
  const segments = relativePath.split('/')
  let current = root

  for (const [index, segment] of segments.entries()) {
    current = join(current, segment)
    const info = await lstat(current).catch((error: unknown) => {
      if (isMissing(error)) return null
      throw error
    })

    if (!info) return null
    if (info.isSymbolicLink()) {
      throw new Error(`Caminho com link simbolico: ${relativePath}`)
    }
    if (index < segments.length - 1 && !info.isDirectory()) {
      throw new Error(`Esperava uma pasta em ${current}`)
    }
    if (index === segments.length - 1 && (!info.isFile() || info.nlink > 1)) {
      throw new Error(`Esperava um arquivo regular sem hard links: ${relativePath}`)
    }
  }

  return join(root, ...segments)
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

export async function readProjectFile(root: string, path: string) {
  const absolutePath = await inspectPath(root, path)
  return absolutePath ? readFile(absolutePath, 'utf8') : null
}

export async function applyFileChanges(root: string, changes: FileChange[]) {
  for (const change of changes) {
    // Confere novamente porque o planejamento pode ter sido seguido de outra edição.
    if (await readProjectFile(root, change.path) !== change.previous) {
      throw new Error(`O arquivo mudou durante a instalacao: ${change.path}`)
    }

    const destination = join(root, ...change.path.split('/'))
    await mkdir(dirname(destination), { recursive: true })

    if (change.previous === null) {
      const file = await open(destination, 'wx')
      try {
        await file.writeFile(change.content, 'utf8')
      } finally {
        await file.close()
      }
    } else {
      // A unica edicao permitida em arquivos existentes e acrescentar instrucoes.
      if (!change.content.startsWith(change.previous)) {
        throw new Error(`A instalacao nao pode substituir ${change.path}`)
      }

      const file = await open(destination, constants.O_RDWR | constants.O_APPEND | constants.O_NOFOLLOW)
      try {
        const info = await file.stat()
        if (!info.isFile() || info.nlink > 1 || await file.readFile('utf8') !== change.previous) {
          throw new Error(`O arquivo mudou durante a instalacao: ${change.path}`)
        }
        await file.writeFile(change.content.slice(change.previous.length), 'utf8')
      } finally {
        await file.close()
      }
    }

    console.log(`${change.previous === null ? 'Criado' : 'Atualizado'}: ${change.path.split('/').join(sep)}`)
  }
}
