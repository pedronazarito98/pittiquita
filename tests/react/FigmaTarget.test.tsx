import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { FigmaTarget, figmaTarget } from '../../src/react/FigmaTarget'

describe('FigmaTarget', () => {
  it('renders children with data-figma-target attribute', () => {
    render(
      <FigmaTarget name="header">
        <span>Hello</span>
      </FigmaTarget>
    )

    const wrapper = screen.getByText('Hello').parentElement!
    expect(wrapper.getAttribute('data-figma-target')).toBe('header')
  })

  it('sets data-figma-label from label prop', () => {
    render(
      <FigmaTarget name="header" label="Main Header">
        <span>Hello</span>
      </FigmaTarget>
    )

    const wrapper = screen.getByText('Hello').parentElement!
    expect(wrapper.getAttribute('data-figma-label')).toBe('Main Header')
  })

  it('auto-generates label from name via prettifyLabel', () => {
    render(
      <FigmaTarget name="kpi-header">
        <span>Hello</span>
      </FigmaTarget>
    )

    const wrapper = screen.getByText('Hello').parentElement!
    expect(wrapper.getAttribute('data-figma-label')).toBe('Kpi Header')
  })

  it('renders custom element via as prop', () => {
    render(
      <FigmaTarget name="nav" as="nav">
        <span>Navigation</span>
      </FigmaTarget>
    )

    const nav = screen.getByText('Navigation').parentElement!
    expect(nav.tagName).toBe('NAV')
  })
})

describe('figmaTarget', () => {
  it('returns data attributes object', () => {
    const attrs = figmaTarget('sidebar')
    expect(attrs).toEqual({
      'data-figma-target': 'sidebar',
      'data-figma-label': 'Sidebar',
    })
  })

  it('uses custom label when provided', () => {
    const attrs = figmaTarget('sidebar', { label: 'Side Panel' })
    expect(attrs).toEqual({
      'data-figma-target': 'sidebar',
      'data-figma-label': 'Side Panel',
    })
  })
})
