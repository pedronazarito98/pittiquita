import { describe, it, expect } from 'vitest'

import {
  normalizeFileKey,
  buildFigmaFileUrl,
} from '../../../src/core/utils/file-ref'

describe('normalizeFileKey', () => {
  it('returns empty string for empty input', () => {
    expect(normalizeFileKey('')).toBe('')
    expect(normalizeFileKey('   ')).toBe('')
  })

  it('returns raw alphanumeric key as-is', () => {
    expect(normalizeFileKey('abc123XYZ')).toBe('abc123XYZ')
  })

  it('extracts key from figma design URL', () => {
    expect(
      normalizeFileKey('https://www.figma.com/design/ABC123/My-File')
    ).toBe('ABC123')
  })

  it('extracts key from figma file URL', () => {
    expect(
      normalizeFileKey('https://www.figma.com/file/XYZ789/My-File')
    ).toBe('XYZ789')
  })

  it('returns empty string for invalid URL', () => {
    expect(normalizeFileKey('not-a-url-or-key!@#')).toBe('')
  })

  it('trims whitespace', () => {
    expect(normalizeFileKey('  abc123  ')).toBe('abc123')
  })
})

describe('buildFigmaFileUrl', () => {
  it('builds canonical Figma URL', () => {
    expect(buildFigmaFileUrl('ABC123')).toBe(
      'https://www.figma.com/design/ABC123'
    )
  })
})
