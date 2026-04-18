import { actionsGridStyle, buttonAccentStyle, buttonBaseStyle } from '../styles'

type ActionsRowProps = {
  labels: { activateCapture: string; reset: string }
  className?: string
  onActivate: () => void
  onReset: () => void
}

export function ActionsRow({ labels, className, onActivate, onReset }: ActionsRowProps) {
  return (
    <div style={actionsGridStyle} className={className}>
      <button type="button" style={buttonAccentStyle} onClick={onActivate}>
        {labels.activateCapture}
      </button>
      <button type="button" style={buttonBaseStyle} onClick={onReset}>
        {labels.reset}
      </button>
    </div>
  )
}
