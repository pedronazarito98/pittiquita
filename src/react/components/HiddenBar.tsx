import type { PanelPosition } from '../../core/types'
import { buttonClass, hiddenBarClass, hiddenBarStyle, joinClasses } from '../styles'

type HiddenBarProps = {
  /** Texto compacto exibido no botão do launcher. */
  labels: { show: string }
  /** Canto da viewport em que o launcher fica fixo. */
  position: PanelPosition
  /** Classe opcional do slot passada pelo consumidor. */
  className?: string
  /** Restaura o painel de captura completo. */
  onShow: () => void
}

/** Renderiza o launcher compacto exibido após ocultar o painel de captura. */
export function HiddenBar({ labels, position, className, onShow }: HiddenBarProps) {
  return (
    <div
      style={hiddenBarStyle(position)}
      className={joinClasses(hiddenBarClass, className)}
      data-figma-helper="true"
    >
      <button type="button" className={buttonClass({ tone: 'primary' })} onClick={onShow}>
        {labels.show}
      </button>
    </div>
  )
}
