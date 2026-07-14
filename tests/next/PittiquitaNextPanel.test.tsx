import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setMockPathname } from '../mocks/next-navigation'
import {
  PittiquitaNextPanel,
  withPittiquita,
} from '../../src/next/plugin'

describe('PittiquitaNextPanel', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', hash: '' },
      writable: true,
    })
    window.localStorage.clear()
    document.body.innerHTML = ''
    setMockPathname('/dashboard')
  })

  it('monta o painel quando a integracao esta habilitada', () => {
    render(<PittiquitaNextPanel enabled />)

    expect(screen.getByText('Figma Capture')).toBeTruthy()
  })

  it('nao monta o painel quando a integracao esta desabilitada', () => {
    const { container } = render(<PittiquitaNextPanel enabled={false} />)

    expect(container.innerHTML).toBe('')
  })

  it('mantem o fluxo de ocultar e reabrir no wrapper Next.js', () => {
    render(<PittiquitaNextPanel enabled />)

    fireEvent.click(screen.getByText('Hide'))
    expect(screen.queryByText('Figma Capture')).toBeNull()

    fireEvent.click(screen.getByText('Figma'))
    expect(screen.getByText('Figma Capture')).toBeTruthy()
  })
})

describe('withPittiquita', () => {
  it('preserva a mesma configuracao durante a migracao', () => {
    const config = { reactStrictMode: true }

    expect(withPittiquita(config)).toBe(config)
  })
})
