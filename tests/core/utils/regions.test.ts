import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  prettifyLabel,
  buildRegionEntries,
  areRegionsEqual,
} from '../../../src/core/utils/regions'
import type { RegionEntry } from '../../../src/core/types'

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

describe('prettifyLabel', () => {
  it('converts kebab-case to Title Case', () => {
    expect(prettifyLabel('kpi-header')).toBe('Kpi Header')
  })

  it('converts snake_case to Title Case', () => {
    expect(prettifyLabel('kpi_header')).toBe('Kpi Header')
  })

  it('converts dot.case to Title Case', () => {
    expect(prettifyLabel('kpi.header.total')).toBe('Kpi Header Total')
  })

  it('trims and collapses whitespace', () => {
    expect(prettifyLabel('  kpi   header  ')).toBe('Kpi Header')
  })
})

describe('buildRegionEntries', () => {
  let restoreRect: () => void

  beforeEach(() => {
    document.body.innerHTML = ''
    restoreRect = stubVisibleRect()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    restoreRect()
  })

  it('returns empty array when no regions exist', () => {
    expect(buildRegionEntries()).toEqual([])
  })

  it('finds elements with data-figma-target', () => {
    document.body.innerHTML = '<div data-figma-target="header" style="width:100px;height:100px;">H</div>'
    const entries = buildRegionEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].label).toBe('Header')
  })

  it('finds elements with data-debug-layer', () => {
    document.body.innerHTML = '<div data-debug-layer="sidebar" style="width:100px;height:100px;">S</div>'
    const entries = buildRegionEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].label).toBe('Sidebar')
  })

  it('uses data-figma-label when present', () => {
    document.body.innerHTML =
      '<div data-figma-target="x" data-figma-label="Custom Label" style="width:100px;height:100px;">X</div>'
    const entries = buildRegionEntries()
    expect(entries[0].label).toBe('Custom Label')
  })

  it('ignores elements inside data-figma-helper', () => {
    document.body.innerHTML = `
      <div data-figma-helper="true">
        <div data-figma-target="inside" style="width:100px;height:100px;">I</div>
      </div>
      <div data-figma-target="outside" style="width:100px;height:100px;">O</div>
    `
    const entries = buildRegionEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].label).toBe('Outside')
  })

  it('deduplicates labels with counter suffix', () => {
    document.body.innerHTML = `
      <div data-figma-target="card" style="width:100px;height:100px;">1</div>
      <div data-figma-target="card" style="width:100px;height:100px;">2</div>
    `
    const entries = buildRegionEntries()
    expect(entries[0].label).toBe('Card')
    expect(entries[1].label).toBe('Card 2')
  })
})

describe('areRegionsEqual', () => {
  it('returns true for identical arrays', () => {
    const el = document.createElement('div')
    const regions: RegionEntry[] = [{ element: el, id: '1', label: 'A' }]
    expect(areRegionsEqual(regions, [...regions])).toBe(true)
  })

  it('returns false for different lengths', () => {
    expect(areRegionsEqual([], [{ element: document.createElement('div'), id: '1', label: 'A' }])).toBe(false)
  })

  it('returns false for different ids', () => {
    const el = document.createElement('div')
    const a: RegionEntry[] = [{ element: el, id: '1', label: 'A' }]
    const b: RegionEntry[] = [{ element: el, id: '2', label: 'A' }]
    expect(areRegionsEqual(a, b)).toBe(false)
  })
})
