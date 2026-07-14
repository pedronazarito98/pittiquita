import { useId } from 'react'

import type { RegionEntry } from '../../core/types'
import {
  buttonAccentStyle,
  buttonBaseStyle,
  regionListStyle,
  sectionStyle,
  textMuted,
  textSmall,
  textTitle,
} from '../styles'

type RegionListProps = {
  labels: {
    regionsTitle: string
    regionsCount: (count: number) => string
    regionsEmpty: string
  }
  regions: RegionEntry[]
  selectedId: string | null
  className?: string
  onSelect: (region: RegionEntry) => void
}

export function RegionList({
  labels,
  regions,
  selectedId,
  className,
  onSelect,
}: RegionListProps) {
  const titleId = useId()

  return (
    <div style={sectionStyle} className={className}>
      <p id={titleId} style={textTitle}>
        {labels.regionsTitle}
      </p>
      <p style={textMuted} aria-live="polite">
        {labels.regionsCount(regions.length)}
      </p>

      {regions.length > 0 ? (
        <ul
          aria-labelledby={titleId}
          style={{
            ...regionListStyle,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {regions.map((region) => (
            <li key={region.id}>
              <button
                type="button"
                aria-pressed={selectedId === region.id}
                style={{
                  ...(selectedId === region.id
                    ? buttonAccentStyle
                    : buttonBaseStyle),
                  width: '100%',
                }}
                onClick={() => onSelect(region)}
              >
                {region.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={textSmall}>{labels.regionsEmpty}</p>
      )}
    </div>
  )
}
