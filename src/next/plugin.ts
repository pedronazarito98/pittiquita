import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'

export { PittiquitaNextPanel } from './PittiquitaNextPanel'
export type { PittiquitaNextPanelProps } from './PittiquitaNextPanel'

type PittiquitaNextOptions = Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>
type NextConfig = Record<string, unknown>

/**
 * @deprecated Use `PittiquitaNextPanel` em um Client Component do App Router.
 *
 * Versões anteriores expunham este helper como se ele injetasse a interface no
 * Next.js, mas o wrapper nunca alterou o bundle nem montou o painel. A função é
 * mantida temporariamente como identidade para não quebrar configurações
 * existentes durante a migração.
 */
export function withPittiquita(
  nextConfig: NextConfig = {},
  options: PittiquitaNextOptions = {}
): NextConfig {
  void options
  return nextConfig
}
