import type { RegionEntry } from '../types'
import { HELPER_ATTR } from './capture'

/**
 * Converte identificador em kebab/snake/dot-case para Title Case.
 */
export const prettifyLabel = (value: string): string =>
  value
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

/**
 * Verifica se o elemento tem área visível.
 */
const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return false
  const styles = window.getComputedStyle(element)
  return styles.display !== 'none' && styles.visibility !== 'hidden'
}

/**
 * Varre o DOM por elementos marcados com `data-figma-target` ou
 * `data-debug-layer`, filtra os visíveis, ordena por posição e
 * devolve a lista com labels únicos.
 */
export const buildRegionEntries = (): RegionEntry[] => {
  const matches = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-figma-target], [data-debug-layer]'
    )
  )

  const visibleElements = matches
    .filter(
      (element) =>
        !element.closest(`[${HELPER_ATTR}]`) && isElementVisible(element)
    )
    .sort((left, right) => {
      const leftRect = left.getBoundingClientRect()
      const rightRect = right.getBoundingClientRect()
      if (leftRect.top !== rightRect.top) return leftRect.top - rightRect.top
      return leftRect.left - rightRect.left
    })

  const counts = new Map<string, number>()

  return visibleElements.map((element, index) => {
    const source =
      element.dataset.figmaTarget ??
      element.dataset.debugLayer ??
      `region-${index + 1}`
    const rawLabel =
      element.dataset.figmaLabel ??
      element.dataset.debugLayer ??
      element.dataset.figmaTarget ??
      `region-${index + 1}`
    const baseLabel = prettifyLabel(rawLabel)
    const duplicateCount = (counts.get(baseLabel) ?? 0) + 1
    counts.set(baseLabel, duplicateCount)

    return {
      element,
      id: `${source}-${index + 1}`,
      label: duplicateCount === 1 ? baseLabel : `${baseLabel} ${duplicateCount}`,
    }
  })
}

/**
 * Compara duas listas de regiões em ordem e conteúdo.
 */
export const areRegionsEqual = (
  current: RegionEntry[],
  next: RegionEntry[]
): boolean => {
  if (current.length !== next.length) return false
  return current.every((region, index) => {
    const nextRegion = next[index]
    return (
      region.id === nextRegion.id &&
      region.label === nextRegion.label &&
      region.element === nextRegion.element
    )
  })
}
