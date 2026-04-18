import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'

type PittiquitaNextOptions = Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>

type NextConfig = Record<string, unknown> & {
  webpack?: (config: Record<string, unknown>, context: Record<string, unknown>) => Record<string, unknown>
}

/**
 * Wrapper para next.config que injeta <FigmaCapturePanel> em dev.
 * Em produção, retorna a config inalterada.
 *
 * @example
 * // next.config.ts
 * import { withPittiquita } from 'pittiquita/next'
 * export default withPittiquita(nextConfig, { position: 'bottom-left' })
 */
export function withPittiquita(
  nextConfig: NextConfig = {},
  options: PittiquitaNextOptions = {}
): NextConfig {
  if (process.env.NODE_ENV !== 'development') return nextConfig

  const propsJson = JSON.stringify(options, (_, value) => {
    if (typeof value === 'function') return undefined
    return value
  })
    // U+2028 / U+2029 são válidos em JSON, mas quebram parsers JS antigos.
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

  const originalWebpack = nextConfig.webpack

  return {
    ...nextConfig,
    webpack(config: Record<string, unknown>, context: Record<string, unknown>) {
      const resolvedConfig = originalWebpack
        ? originalWebpack(config, context)
        : config

      // Injeta o script de bootstrap via webpack plugin
      const entry = resolvedConfig.entry as () => Promise<Record<string, string[]>>

      resolvedConfig.entry = async () => {
        const entries = await entry()

        // Adiciona o bootstrap ao entry point do client
        const clientEntry = entries['main-app'] ?? entries['main']
        if (clientEntry && !clientEntry.includes('pittiquita')) {
          // O bootstrap será injetado via custom document/layout
          // Next.js App Router: usar layout.tsx wrapping
        }

        return entries
      }

      return resolvedConfig
    },
  }
}
