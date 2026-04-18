import { createElement, type ElementType, type ReactNode } from 'react'

import { prettifyLabel } from '../core/utils/regions'

export type FigmaTargetProps = {
  name: string
  label?: string
  as?: ElementType
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
 * <div {...figmaTarget('kpi-header', { label: 'KPI Header' })}>
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
