import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  CAPTURE_HASH_TOKEN,
  CAPTURE_SCRIPT_SRC,
  DEFAULT_CAPTURE_HASH,
  HELPER_ATTR,
  SELECTED_ATTR,
  STORAGE_FILE_REF_KEY,
  isLocalOrigin,
  isCaptureActive,
  enableCaptureHash,
  ensureCaptureScript,
} from '../../../src/core/utils/capture'

describe('capture constants', () => {
  it('exports expected constants', () => {
    expect(CAPTURE_SCRIPT_SRC).toBe(
      'https://mcp.figma.com/mcp/html-to-design/capture.js'
    )
    expect(CAPTURE_HASH_TOKEN).toBe('figmacapture=')
    expect(HELPER_ATTR).toBe('data-figma-helper')
    expect(SELECTED_ATTR).toBe('data-figma-selected')
    expect(STORAGE_FILE_REF_KEY).toBe('figma-file-ref')
    expect(DEFAULT_CAPTURE_HASH).toBe('figmacapture=manual')
  })
})

describe('isLocalOrigin', () => {
  it('returns true for localhost', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
    })
    expect(isLocalOrigin()).toBe(true)
  })

  it('returns true for 127.0.0.1', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: '127.0.0.1' },
      writable: true,
    })
    expect(isLocalOrigin()).toBe(true)
  })

  it('returns false for production host', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'app.example.com' },
      writable: true,
    })
    expect(isLocalOrigin()).toBe(false)
  })
})

describe('isCaptureActive', () => {
  it('returns true when hash contains capture token', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '#figmacapture=manual',
      writable: true,
    })
    expect(isCaptureActive()).toBe(true)
  })

  it('returns false when hash is empty', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '',
      writable: true,
    })
    expect(isCaptureActive()).toBe(false)
  })
})

describe('enableCaptureHash', () => {
  it('sets hash when not present', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '',
      writable: true,
    })
    enableCaptureHash()
    expect(window.location.hash).toBe(DEFAULT_CAPTURE_HASH)
  })

  it('does not overwrite existing capture hash', () => {
    const existing = '#figmacapture=existing'
    Object.defineProperty(window.location, 'hash', {
      value: existing,
      writable: true,
    })
    enableCaptureHash()
    expect(window.location.hash).toBe(existing)
  })
})

describe('ensureCaptureScript', () => {
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

  it('injects script tag when capture is active on localhost', () => {
    ensureCaptureScript()
    const script = document.querySelector('script[data-figma-capture-loader]')
    expect(script).not.toBeNull()
    expect(script?.getAttribute('src')).toBe(CAPTURE_SCRIPT_SRC)
  })

  it('does not inject twice', () => {
    ensureCaptureScript()
    ensureCaptureScript()
    const scripts = document.querySelectorAll('script[data-figma-capture-loader]')
    expect(scripts.length).toBe(1)
  })
})
