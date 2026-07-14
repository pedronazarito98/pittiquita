import type { Plugin } from 'vite'

import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'

type PittiquitaViteOptions = Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>

const VIRTUAL_MODULE_ID = 'virtual:pittiquita'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/**
 * Plugin Vite que injeta automaticamente o <FigmaCapturePanel>
 * em mode development. Zero overhead em produção.
 */
export function pittiquita(options: PittiquitaViteOptions = {}): Plugin {
  return {
    name: 'pittiquita',
    apply: 'serve',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return

      const propsJson = JSON.stringify(options, (_, value) => {
        // Funções não serializam no módulo virtual; usar montagem manual nesses casos.
        if (typeof value === 'function') return undefined
        return value
      })
        // U+2028 / U+2029 são válidos em JSON, mas quebram parsers JS antigos.
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')

      return `
        import { createElement } from 'react'
        import { createRoot } from 'react-dom/client'
        import { FigmaCapturePanel } from 'pittiquita'

        const ROOT_ID = 'pittiquita-root'
        const existingContainer = document.getElementById(ROOT_ID)
        const container = existingContainer ?? document.createElement('div')

        if (!existingContainer) {
          container.id = ROOT_ID
          document.body.appendChild(container)
        }

        const previousRoot = container.__pittiquitaRoot
        const root = previousRoot ?? createRoot(container)
        container.__pittiquitaRoot = root
        root.render(createElement(FigmaCapturePanel, ${propsJson}))

        if (import.meta.hot) {
          import.meta.hot.dispose(() => {
            root.unmount()
            container.remove()
          })
        }
      `
    },

    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module', src: VIRTUAL_MODULE_ID },
          injectTo: 'body',
        },
      ]
    },
  }
}
