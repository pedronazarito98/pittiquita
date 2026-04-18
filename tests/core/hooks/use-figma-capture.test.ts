import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useFigmaCapture } from '../../../src/core/hooks/use-figma-capture'
import { CAPTURE_SCRIPT_SRC, DEFAULT_CAPTURE_HASH } from '../../../src/core/utils/capture'

describe('useFigmaCapture', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', hash: '#figmacapture=manual' },
      writable: true,
    })
  })

  afterEach(() => {
    document.querySelectorAll('script[data-figma-capture-loader]').forEach(
      (el) => el.remove()
    )
  })

  it('injects capture script on mount when hash is active', () => {
    renderHook(() => useFigmaCapture())
    const script = document.querySelector('script[data-figma-capture-loader]')
    expect(script).not.toBeNull()
    expect(script?.getAttribute('src')).toBe(CAPTURE_SCRIPT_SRC)
  })

  it('does not inject when enabled=false', () => {
    renderHook(() => useFigmaCapture({ enabled: false }))
    const script = document.querySelector('script[data-figma-capture-loader]')
    expect(script).toBeNull()
  })

  it('calls onHashChange when mounted', () => {
    const fn = vi.fn()
    renderHook(() => useFigmaCapture({ onHashChange: fn }))
    expect(fn).toHaveBeenCalled()
  })

  it('activate() enables the hash and injects script', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '',
      writable: true,
    })
    const { result } = renderHook(() => useFigmaCapture())
    act(() => result.current.activate())
    expect(window.location.hash).toBe(DEFAULT_CAPTURE_HASH)
  })
})
