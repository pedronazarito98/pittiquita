import type { PanelPosition } from '../../core/types'
import { buttonAccentStyle, hiddenBarStyle } from '../styles'

type HiddenBarProps = {
  labels: { show: string; panelTitle: string }
  position: PanelPosition
  className?: string
  onShow: () => void
}

export function HiddenBar({ labels, position, className, onShow }: HiddenBarProps) {
  return (
    <aside
      style={hiddenBarStyle(position)}
      className={className}
      data-figma-helper="true"
      aria-label={labels.panelTitle}
    >
      <button
        type="button"
        style={buttonAccentStyle}
        aria-label={labels.show}
        onClick={onShow}
      >
        {labels.show}
      </button>
    </aside>
  )
}
