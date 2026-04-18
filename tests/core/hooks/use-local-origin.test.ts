import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useLocalOrigin } from '../../../src/core/hooks/use-local-origin'

describe('useLocalOrigin', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
    })
  })

  it('returns true on localhost after mount', () => {
    const { result } = renderHook(() => useLocalOrigin())
    expect(result.current).toBe(true)
  })

  it('returns false on production host', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'app.example.com' },
      writable: true,
    })
    const { result } = renderHook(() => useLocalOrigin())
    expect(result.current).toBe(false)
  })
})
