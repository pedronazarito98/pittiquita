import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { FigmaCapturePanel } from '../../src/react/FigmaCapturePanel'

describe('FigmaCapturePanel', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', hash: '' },
      writable: true,
    })
    window.localStorage.clear()
    document.body.innerHTML = ''
  })

  it('renders nothing on non-localhost', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'app.example.com', hash: '' },
      writable: true,
    })

    const { container } = render(<FigmaCapturePanel />)
    expect(container.innerHTML).toBe('')
  })

  it('renders panel on localhost', () => {
    render(<FigmaCapturePanel />)
    expect(screen.getByText('Figma Capture')).toBeTruthy()
  })

  it('applies custom labels', () => {
    render(<FigmaCapturePanel labels={{ panelTitle: 'Custom Title' }} />)
    expect(screen.getByText('Custom Title')).toBeTruthy()
  })

  it('hides and shows via hide/show buttons', () => {
    render(<FigmaCapturePanel />)

    fireEvent.click(screen.getByText('Hide'))
    expect(screen.queryByText('Figma Capture')).toBeNull()
    expect(screen.getByText('Figma')).toBeTruthy()

    fireEvent.click(screen.getByText('Figma'))
    expect(screen.getByText('Figma Capture')).toBeTruthy()
  })

  it('applies custom className', () => {
    render(<FigmaCapturePanel className="my-custom-class" />)
    const panel = screen.getByText('Figma Capture').closest('[data-figma-helper]')!
    expect(panel.classList.contains('my-custom-class')).toBe(true)
  })

  it('applies theme as CSS variables', () => {
    render(<FigmaCapturePanel theme={{ accentColor: '#ff0000' }} />)
    const panel = screen.getByText('Figma Capture').closest('[data-figma-helper]') as HTMLElement
    expect(panel.style.getPropertyValue('--pittiquita-accent')).toBe('#ff0000')
  })
})
