import type { ReactElement } from 'react'

import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'
import { PittiquitaStorybookPanel } from './PittiquitaStorybookPanel'

export type PittiquitaStorybookOptions = Omit<
  FigmaCapturePanelProps,
  'pathname' | 'searchKey'
> & {
  /** Habilitado em development por padrão, sempre restrito a localhost. */
  enabled?: boolean
  /** Marca o canvas como região sem inserir wrappers no layout da story. */
  target?: boolean
  /** Nome da região; por padrão usa o título e o nome da story. */
  label?: string
}

/** Contrato estrutural para não acoplar o pacote a uma versão do Storybook. */
export type PittiquitaStoryContext = {
  id: string
  title: string
  name: string
  viewMode: string
  canvasElement?: HTMLElement
  parameters: {
    pittiquita?: PittiquitaStorybookOptions | false
  }
}

/** Decorator React para .storybook/preview.ts, compatível com Vite e Webpack. */
export function withPittiquita(options: PittiquitaStorybookOptions = {}) {
  return function PittiquitaDecorator(
    Story: () => ReactElement,
    context: PittiquitaStoryContext
  ) {
    const parameters = context.parameters.pittiquita
    const {
      enabled = process.env.NODE_ENV === 'development',
      target = true,
      label = `${context.title} / ${context.name}`,
      ...panelProps
    } = { ...options, ...parameters }

    const active = enabled && parameters !== false && context.viewMode === 'story'

    return (
      <>
        <Story />
        {active && (
          <PittiquitaStorybookPanel
            key={context.id}
            storyId={context.id}
            canvasElement={context.canvasElement}
            target={target}
            label={label}
            panelProps={panelProps}
          />
        )}
      </>
    )
  }
}
