import { describe, expect, it } from 'vitest'

import { pittiquita } from '../../src/vite/plugin'

describe('pittiquita Vite plugin', () => {
  it('resolve e gera o modulo virtual com props serializaveis', async () => {
    const plugin = pittiquita({ position: 'top-left' })
    const resolveId = plugin.resolveId as Function
    const load = plugin.load as Function

    const resolvedId = await resolveId.call({}, 'virtual:pittiquita')
    const source = await load.call({}, resolvedId)

    expect(resolvedId).toBe('\0virtual:pittiquita')
    expect(source).toContain('"position":"top-left"')
    expect(source).toContain("document.getElementById(ROOT_ID)")
    expect(source).toContain('container.__pittiquitaRoot')
    expect(source).toContain('import.meta.hot.dispose')
  })

  it('ignora funcoes que nao podem ser serializadas', async () => {
    const plugin = pittiquita({
      labels: {
        regionsCount: (count) => `${count}`,
      },
    })
    const resolveId = plugin.resolveId as Function
    const load = plugin.load as Function

    const resolvedId = await resolveId.call({}, 'virtual:pittiquita')
    const source = await load.call({}, resolvedId)

    expect(source).not.toContain('regionsCount')
  })

  it('injeta o modulo apenas durante o servidor Vite', () => {
    const plugin = pittiquita()
    const transformIndexHtml = plugin.transformIndexHtml as Function

    expect(plugin.apply).toBe('serve')
    expect(transformIndexHtml.call({})).toEqual([
      {
        tag: 'script',
        attrs: { type: 'module', src: 'virtual:pittiquita' },
        injectTo: 'body',
      },
    ])
  })
})
