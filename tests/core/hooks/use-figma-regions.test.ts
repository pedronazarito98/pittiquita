import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useFigmaRegions } from '../../../src/core/hooks/use-figma-regions'

/** jsdom returns all-zero rects; stub a visible rect for testing. */
const stubVisibleRect = () => {
  const original = HTMLElement.prototype.getBoundingClientRect
  HTMLElement.prototype.getBoundingClientRect = function () {
    return { x: 0, y: 0, width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, toJSON() {} } as DOMRect
  }
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original
  }
}

describe('useFigmaRegions', () => {
  let restoreRect: () => void

  beforeEach(() => {
    document.body.innerHTML = ''
    restoreRect = stubVisibleRect()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    restoreRect()
  })

  it('returns empty regions when no targets exist', () => {
    const { result } = renderHook(() => useFigmaRegions())
    expect(result.current.regions).toEqual([])
  })

  it('discovers data-figma-target elements', async () => {
    document.body.innerHTML =
      '<div data-figma-target="header" style="width:100px;height:50px;">H</div>'

    const { result } = renderHook(() => useFigmaRegions())

    // MutationObserver + rAF need a tick
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })

    expect(result.current.regions.length).toBeGreaterThanOrEqual(1)
    expect(result.current.regions[0].label).toBe('Header')
  })

  it('refresh() updates regions on demand', async () => {
    const { result } = renderHook(() => useFigmaRegions())
    expect(result.current.regions).toEqual([])

    document.body.innerHTML =
      '<div data-figma-target="sidebar" style="width:100px;height:50px;">S</div>'

    act(() => result.current.refresh())

    expect(result.current.regions.length).toBe(1)
    expect(result.current.regions[0].label).toBe('Sidebar')
  })
})
