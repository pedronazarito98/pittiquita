/**
 * Normaliza a entrada (URL completa do Figma ou fileKey puro)
 * e devolve o fileKey. Retorna string vazia quando não consegue extrair.
 */
export const normalizeFileKey = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  if (/^[A-Za-z0-9]+$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const segments = url.pathname.split('/').filter(Boolean)
    const designIndex = segments.findIndex(
      (segment) => segment === 'design' || segment === 'file'
    )
    if (designIndex >= 0 && typeof segments[designIndex + 1] === 'string') {
      return segments[designIndex + 1]
    }
  } catch {
    return ''
  }

  return ''
}

/** Monta a URL canônica do arquivo no Figma a partir do fileKey. */
export const buildFigmaFileUrl = (fileKey: string): string =>
  `https://www.figma.com/design/${fileKey}`
