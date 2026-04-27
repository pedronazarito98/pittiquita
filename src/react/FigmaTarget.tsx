import { createElement, type ElementType, type ReactNode } from 'react'

import { prettifyLabel } from '../core/utils/regions'

export type FigmaTargetProps = {
  /** Nome técnico usado no atributo `data-figma-target`. */
  name: string
  /** Label legível exibida no painel; quando ausente, deriva de `name`. */
  label?: string
  /** Elemento renderizado pelo wrapper sem alterar os data-attributes. */
  as?: ElementType
  /** Conteúdo da região que será marcada para captura. */
  children: ReactNode
}

/**
 * Componente wrapper que marca um elemento no DOM para captura pelo Figma.
 */
export function FigmaTarget({
  name,
  label,
  as: Component = 'div',
  children,
}: FigmaTargetProps) {
  return createElement(
    Component,
    {
      'data-figma-target': name,
      'data-figma-label': label ?? prettifyLabel(name),
    },
    children
  )
}

/**
 * Retorna data-attributes para marcar um elemento sem wrapper extra.
 *
 * @example
 * <div {...figmaTarget('cabecalho-kpi', { label: 'Cabeçalho KPI' })}>
 */
export function figmaTarget(
  name: string,
  options?: { label?: string }
): Record<string, string> {
  return {
    'data-figma-target': name,
    'data-figma-label': options?.label ?? prettifyLabel(name),
  }
}
