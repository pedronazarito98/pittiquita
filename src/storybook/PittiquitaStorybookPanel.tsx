import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { useLocalOrigin } from '../core/hooks/use-local-origin'
import { figmaTarget } from '../react/FigmaTarget'
import {
  FigmaCapturePanel,
  type FigmaCapturePanelProps,
} from '../react/FigmaCapturePanel'

type PittiquitaStorybookPanelProps = {
  storyId: string
  canvasElement?: HTMLElement
  target: boolean
  label: string
  panelProps: Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>
}

export function PittiquitaStorybookPanel({
  storyId,
  canvasElement,
  target,
  label,
  panelProps,
}: PittiquitaStorybookPanelProps) {
  const ready = useLocalOrigin()

  useEffect(() => {
    if (!ready || !target || !canvasElement) return
    if (canvasElement.hasAttribute('data-figma-target')) return

    const attributes = figmaTarget(storyId, { label })
    const previous = new Map<string, string | null>()

    for (const [name, value] of Object.entries(attributes)) {
      previous.set(name, canvasElement.getAttribute(name))
      canvasElement.setAttribute(name, value)
    }

    return () => {
      for (const [name, value] of Object.entries(attributes)) {
        if (canvasElement.getAttribute(name) !== value) continue
        const original = previous.get(name)
        if (original == null) canvasElement.removeAttribute(name)
        else canvasElement.setAttribute(name, original)
      }
    }
  }, [ready, target, canvasElement, storyId, label])

  if (!ready) return null

  // O portal mantém o painel fora do layout e das transforms do canvas.
  return createPortal(
    <FigmaCapturePanel {...panelProps} pathname={storyId} />,
    document.body
  )
}
