import { useId } from 'react'

import {
  buttonBaseStyle,
  errorStyle,
  fileRowStyle,
  inputStyle,
  sectionStyle,
  textTitle,
} from '../styles'

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
  const inputId = useId()
  const errorId = `${inputId}-error`

  return (
    <div style={sectionStyle} className={className}>
      <label htmlFor={inputId} style={textTitle}>
        {labels.fileSectionTitle}
      </label>
      <div style={fileRowStyle}>
        <input
          id={inputId}
          type="text"
          aria-label={labels.fileRefLabel}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          style={{
            ...inputStyle,
            ...(error ? { borderColor: '#e53e3e' } : {}),
          }}
          value={value}
          placeholder={labels.fileRefPlaceholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          style={buttonBaseStyle}
          title={labels.openTooltip}
          aria-label={labels.openTooltip}
          onClick={onOpen}
        >
          ↗
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" style={errorStyle}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
