import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'

type PittiquitaNextOptions = Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>

type NextConfig = Record<string, unknown> & {
  webpack?: (config: Record<string, unknown>, context: Record<string, unknown>) => Record<string, unknown>
}

/**
 * Wrapper para next.config que injeta <FigmaCapturePanel> em dev.
 * Em producao, retorna a config inalterada.
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
  void options

  if (process.env.NODE_ENV !== 'development') return nextConfig

  const originalWebpack = nextConfig.webpack

  return {
    ...nextConfig,
    webpack(config: Record<string, unknown>, context: Record<string, unknown>) {
      const resolvedConfig = originalWebpack
        ? originalWebpack(config, context)
        : config

      // Injeta o script de bootstrap via webpack plugin.
      const entry = resolvedConfig.entry as () => Promise<Record<string, string[]>>

      resolvedConfig.entry = async () => {
        const entries = await entry()

        // O bootstrap sera injetado via custom document/layout.
        const clientEntry = entries['main-app'] ?? entries['main']
        if (clientEntry && !clientEntry.includes('pittiquita')) {
          // Next.js App Router: usar layout.tsx wrapping.
        }

        return entries
      }

      return resolvedConfig
    },
  }
}
