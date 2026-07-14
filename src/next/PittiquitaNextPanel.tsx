'use client'

import { usePathname } from 'next/navigation'

import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'
import { FigmaCapturePanel } from '../react/FigmaCapturePanel'

export type PittiquitaNextPanelProps = Omit<FigmaCapturePanelProps, 'pathname'> & {
  /**
   * Permite desligar explicitamente a integração sem desmontar o componente.
   * Por padrão, o painel só é habilitado em `development`.
   */
  enabled?: boolean
}

/**
 * Integração oficial para Next.js App Router.
 *
 * O componente lê o pathname atual no client e encaminha a navegação para o
 * painel. Em produção, retorna `null` por padrão; `enabled` pode ser usado por
 * aplicações que possuem uma regra de ambiente própria.
 */
export function PittiquitaNextPanel({
  enabled = process.env.NODE_ENV === 'development',
  ...props
}: PittiquitaNextPanelProps) {
  const pathname = usePathname()

  if (!enabled) return null

  return <FigmaCapturePanel {...props} pathname={pathname} />
}
