import type { RegionEntry } from '../../core/types'
import { buttonAccentStyle, buttonBaseStyle, regionListStyle, sectionStyle, textMuted, textSmall, textTitle } from '../styles'

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
  return (
    <div style={sectionStyle} className={className}>
      <p style={textTitle}>{labels.regionsTitle}</p>
      <p style={textMuted}>{labels.regionsCount(regions.length)}</p>

      {regions.length > 0 ? (
        <div style={regionListStyle}>
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              style={selectedId === region.id ? buttonAccentStyle : buttonBaseStyle}
              onClick={() => onSelect(region)}
            >
              {region.label}
            </button>
          ))}
        </div>
      ) : (
        <p style={textSmall}>{labels.regionsEmpty}</p>
      )}
    </div>
  )
}
