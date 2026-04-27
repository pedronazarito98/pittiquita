import { actionsGridClass, buttonClass } from '../styles'

type ActionsRowProps = {
  /** Textos dos botões já mesclados com os padrões. */
  labels: { activateCapture: string; reset: string }
  /** Classe opcional do slot passada pelo consumidor. */
  className?: string
  /** Ativa o helper de captura do HTML to Design. */
  onActivate: () => void
  /** Limpa seleção, estado do arquivo e cache de regiões. */
  onReset: () => void
}

/** Renderiza o comando principal de captura ao lado da ação de reset. */
export function ActionsRow({ labels, className, onActivate, onReset }: ActionsRowProps) {
  return (
    <div className={`${actionsGridClass}${className ? ` ${className}` : ''}`}>
      <button type="button" className={buttonClass({ tone: 'primary' })} onClick={onActivate}>
        {labels.activateCapture}
      </button>
      <button type="button" className={buttonClass({ tone: 'secondary' })} onClick={onReset}>
        {labels.reset}
      </button>
    </div>
  )
}
