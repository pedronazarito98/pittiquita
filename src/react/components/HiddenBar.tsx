import type { PanelPosition } from '../../core/types'
import { buttonAccentStyle, hiddenBarStyle } from '../styles'

type HiddenBarProps = {
  labels: { show: string }
  position: PanelPosition
  className?: string
  onShow: () => void
}

export function HiddenBar({ labels, position, className, onShow }: HiddenBarProps) {
  return (
    <div
      style={hiddenBarStyle(position)}
      className={className}
      data-figma-helper="true"
    >
      <button type="button" style={buttonAccentStyle} onClick={onShow}>
        {labels.show}
      </button>
    </div>
  )
}
