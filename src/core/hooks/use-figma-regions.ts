import { useCallback, useEffect, useState } from 'react'

import type { RegionEntry } from '../types'
import { areRegionsEqual, buildRegionEntries } from '../utils/regions'

export type UseFigmaRegionsOptions = {
  enabled?: boolean
  pathname?: string | null
  searchKey?: string
}

export type UseFigmaRegionsResult = {
  regions: RegionEntry[]
  refresh: () => void
}

/**
 * Descobre e mantém atualizada a lista de regiões marcadas na página.
 *
 * Atualiza automaticamente via:
 *   1. MutationObserver (childList + subtree + atributos figma)
 *   2. popstate + hashchange (navegação SPA genérica)
 *   3. Mudança de pathname/searchKey (opt-in, para Next.js)
 *   4. Chamadas explícitas de refresh()
 */
export const useFigmaRegions = ({
  enabled = true,
  pathname,
  searchKey,
}: UseFigmaRegionsOptions = {}): UseFigmaRegionsResult => {
  const [regions, setRegions] = useState<RegionEntry[]>([])

  const refresh = useCallback(() => {
    const next = buildRegionEntries()
    setRegions((current) =>
      areRegionsEqual(current, next) ? current : next
    )
  }, [])

  // Refresh on pathname/searchKey changes (opt-in)
  useEffect(() => {
    if (!enabled) return
    const frameId = window.requestAnimationFrame(refresh)
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [enabled, pathname, searchKey, refresh])

  // MutationObserver for DOM changes
  useEffect(() => {
    if (!enabled) return

    let frameId: number | null = null

    const schedule = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        frameId = null
        refresh()
      })
    }

    const observer = new MutationObserver(schedule)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-debug-layer', 'data-figma-target', 'data-figma-label'],
    })

    return () => {
      observer.disconnect()
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [enabled, refresh])

  // popstate + hashchange for generic SPA navigation
  useEffect(() => {
    if (!enabled) return

    const handleNavigation = () => {
      window.requestAnimationFrame(refresh)
    }

    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('hashchange', handleNavigation)
    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [enabled, refresh])

  return { regions, refresh }
}
