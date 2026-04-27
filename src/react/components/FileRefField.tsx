import {
  buttonClass,
  errorClass,
  fileRowClass,
  inputClass,
  inputErrorClass,
  joinClasses,
  sectionClass,
  textTitleClass,
} from '../styles'

type FileRefFieldProps = {
  /** Textos usados pelo campo de referência do arquivo e pela ação. */
  labels: {
    fileSectionTitle: string
    fileRefLabel: string
    fileRefPlaceholder: string
    openTooltip: string
  }
  /** URL ou id atual do arquivo Figma armazenado localmente. */
  value: string
  /** Mensagem de validação exibida quando a referência não pode ser aberta. */
  error: string
  /** Classe opcional do slot passada pelo consumidor. */
  className?: string
  /** Atualiza a referência de arquivo persistida. */
  onChange: (next: string) => void
  /** Abre o arquivo Figma referenciado em uma nova aba. */
  onOpen: () => void
}

/** Renderiza a referência persistida do arquivo Figma e sua ação de abertura externa. */
export function FileRefField({
  labels,
  value,
  error,
  className,
  onChange,
  onOpen,
}: FileRefFieldProps) {
  return (
    <div className={joinClasses(sectionClass, className)}>
      <p className={textTitleClass}>{labels.fileSectionTitle}</p>
      <div className={fileRowClass}>
        <input
          type="text"
          aria-label={labels.fileRefLabel}
          className={joinClasses(inputClass, error ? inputErrorClass : undefined)}
          value={value}
          placeholder={labels.fileRefPlaceholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className={buttonClass({ size: 'icon', tone: 'secondary' })}
          title={labels.openTooltip}
          onClick={onOpen}
        >
          ↗
        </button>
      </div>
      {error ? <p className={errorClass}>{error}</p> : null}
    </div>
  )
}
