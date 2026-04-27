import type { RegionEntry } from '../../core/types'
import {
  buttonClass,
  joinClasses,
  regionButtonContentClass,
  regionIndexClass,
  regionLabelClass,
  regionListClass,
  sectionClass,
  sectionHeaderClass,
  textMutedClass,
  textSmallClass,
  textTitleClass,
} from '../styles'

type RegionListProps = {
  /** Textos usados pela seção de regiões. */
  labels: {
    regionsTitle: string
    regionsCount: (count: number) => string
    regionsEmpty: string
  }
  /** Regiões capturáveis do DOM descobertas na página atual. */
  regions: RegionEntry[]
  /** Região marcada como selecionada no DOM. */
  selectedId: string | null
  /** Classe opcional do slot passada pelo consumidor. */
  className?: string
  /** Seleciona uma região e notifica o painel pai. */
  onSelect: (region: RegionEntry) => void
}

/** Lista regiões capturadas do DOM com alvos compactos e selecionáveis. */
export function RegionList({
  labels,
  regions,
  selectedId,
  className,
  onSelect,
}: RegionListProps) {
  return (
    <div className={joinClasses(sectionClass, className)}>
      <div className={sectionHeaderClass}>
        <p className={textTitleClass}>{labels.regionsTitle}</p>
        <p className={textMutedClass}>{labels.regionsCount(regions.length)}</p>
      </div>

      {regions.length > 0 ? (
        <div className={regionListClass}>
          {regions.map((region, index) => (
            <button
              key={region.id}
              type="button"
              className={buttonClass({
                selected: selectedId === region.id,
                tone: 'region',
              })}
              onClick={() => onSelect(region)}
            >
              <span className={regionButtonContentClass}>
                <span className={regionIndexClass}>{index + 1}</span>
                <span className={regionLabelClass}>{region.label}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className={textSmallClass}>{labels.regionsEmpty}</p>
      )}
    </div>
  )
}
