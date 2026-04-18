import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useFigmaFileRef } from '../../../src/core/hooks/use-figma-file-ref'

describe('useFigmaFileRef', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with empty value', () => {
    const { result } = renderHook(() => useFigmaFileRef())
    expect(result.current.value).toBe('')
    expect(result.current.error).toBe('')
    expect(result.current.status).toBe('')
  })

  it('uses initialValue when provided', () => {
    const { result } = renderHook(() =>
      useFigmaFileRef({ initialValue: 'ABC123' })
    )
    expect(result.current.value).toBe('ABC123')
  })

  it('hydrates from localStorage', () => {
    window.localStorage.setItem('figma-file-ref', 'saved-key')
    const { result } = renderHook(() => useFigmaFileRef())
    expect(result.current.value).toBe('saved-key')
  })

  it('setValue updates value and clears error', () => {
    const { result } = renderHook(() => useFigmaFileRef())
    act(() => result.current.setValue('new-val'))
    expect(result.current.value).toBe('new-val')
  })

  it('openExistingFile sets error for invalid input', () => {
    const { result } = renderHook(() =>
      useFigmaFileRef({ initialValue: '!!invalid!!' })
    )
    act(() => result.current.openExistingFile())
    expect(result.current.error).not.toBe('')
    expect(result.current.status).toBe('')
  })

  it('openExistingFile opens window for valid key', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { result } = renderHook(() =>
      useFigmaFileRef({ initialValue: 'ABC123' })
    )
    act(() => result.current.openExistingFile())
    expect(openSpy).toHaveBeenCalledWith(
      'https://www.figma.com/design/ABC123',
      '_blank',
      'noopener,noreferrer'
    )
    expect(result.current.status).not.toBe('')
    expect(result.current.error).toBe('')
    openSpy.mockRestore()
  })

  it('reset clears error and status', () => {
    const { result } = renderHook(() =>
      useFigmaFileRef({ initialValue: '!!invalid!!' })
    )
    act(() => result.current.openExistingFile())
    expect(result.current.error).not.toBe('')
    act(() => result.current.reset())
    expect(result.current.error).toBe('')
    expect(result.current.status).toBe('')
  })
})
