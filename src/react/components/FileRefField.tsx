import { errorStyle, fileRowStyle, inputStyle, sectionStyle, textTitle, buttonBaseStyle } from '../styles'

type FileRefFieldProps = {
  labels: {
    fileSectionTitle: string
    fileRefLabel: string
    fileRefPlaceholder: string
    openTooltip: string
  }
  value: string
  error: string
  className?: string
  onChange: (next: string) => void
  onOpen: () => void
}

export function FileRefField({
  labels,
  value,
  error,
  className,
  onChange,
  onOpen,
}: FileRefFieldProps) {
  return (
    <div style={sectionStyle} className={className}>
      <p style={textTitle}>{labels.fileSectionTitle}</p>
      <div style={fileRowStyle}>
        <input
          type="text"
          aria-label={labels.fileRefLabel}
          style={{
            ...inputStyle,
            ...(error ? { borderColor: '#e53e3e' } : {}),
          }}
          value={value}
          placeholder={labels.fileRefPlaceholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          style={buttonBaseStyle}
          title={labels.openTooltip}
          onClick={onOpen}
        >
          ↗
        </button>
      </div>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  )
}
