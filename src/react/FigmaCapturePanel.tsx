import { useCallback, useEffect, useState, type CSSProperties } from 'react'

import type {
  PittiquitaColorMode,
  PanelPosition,
  PittiquitaClassNames,
  PittiquitaLabels,
  PittiquitaTheme,
  RegionEntry,
} from '../core/types'
import { useFigmaCapture } from '../core/hooks/use-figma-capture'
import { useFigmaFileRef } from '../core/hooks/use-figma-file-ref'
import { useFigmaRegions } from '../core/hooks/use-figma-regions'
import { useLocalOrigin } from '../core/hooks/use-local-origin'
import { SELECTED_ATTR } from '../core/utils/capture'
import { mergeLabels } from '../core/utils/labels'

import { ActionsRow } from './components/ActionsRow'
import { FileRefField } from './components/FileRefField'
import { HiddenBar } from './components/HiddenBar'
import { RegionList } from './components/RegionList'
import {
  buttonClass,
  commandCenterClass,
  commandHeaderClass,
  eyebrowClass,
  headerClass,
  joinClasses,
  liveBadgeClass,
  markClass,
  pageMapCanvasClass,
  pageMapClass,
  pageMapEmptyClass,
  pageMapHeaderClass,
  pageMapNodeClass,
  pageMapNodeSelectedClass,
  pageMapNodeWideClass,
  panelClass,
  panelStyle,
  signalCardClass,
  signalGridClass,
  signalLabelClass,
  signalValueClass,
  statusClass,
  subtitleClass,
  titleClass,
  titleWrapClass,
  valueDescriptionClass,
  valueTitleClass,
  themeToVars,
} from './styles'

export type FigmaCapturePanelProps = {
  /** Sobrescritas visuais aplicadas como variáveis CSS no painel. */
  theme?: Partial<PittiquitaTheme>
  /** Classe extra aplicada ao container principal. */
  className?: string
  /** Classes por slot para integração com shells de produto. */
  classNames?: PittiquitaClassNames
  /** Caminho usado para filtrar regiões capturáveis quando a página muda. */
  pathname?: string | null
  /** Chave da query string usada por integrações que dependem de rota. */
  searchKey?: string
  /** Sobrescrita parcial de textos para i18n ou nomenclatura do produto. */
  labels?: Partial<PittiquitaLabels>
  /** Posição fixa do painel na viewport. */
  position?: PanelPosition
  /** Modo de cor do painel; `system` segue `prefers-color-scheme`. */
  colorMode?: PittiquitaColorMode
  /** URL alternativa para o script de captura (ex.: self-host ou mirror). */
  scriptSrc?: string
  /** `nonce` aplicado à tag `<script>` — necessário com CSP estrita. */
  nonce?: string
  /** Hash SRI aplicado à tag `<script>` (ex.: `sha384-...`). */
  integrity?: string
  /** Atributo `crossorigin` da tag `<script>`. */
  crossOrigin?: 'anonymous' | 'use-credentials'
  /** Função chamada quando o usuário ativa o modo de captura. */
  onCaptureActivate?: () => void
  /** Função chamada quando uma região da página é selecionada. */
  onRegionSelect?: (region: RegionEntry) => void
}

/** Resolve a preferência do usuário quando o painel usa o modo de cor do sistema. */
const getSystemColorMode = (): Exclude<PittiquitaColorMode, 'system'> => {
  if (typeof window === 'undefined') return 'light'
  if (typeof window.matchMedia !== 'function') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Mantém o modo de cor do painel alinhado às mudanças de `prefers-color-scheme`. */
const useResolvedColorMode = (
  colorMode: PittiquitaColorMode
): Exclude<PittiquitaColorMode, 'system'> => {
  const [systemColorMode, setSystemColorMode] = useState(getSystemColorMode)

  useEffect(() => {
    if (colorMode !== 'system') return undefined
    if (typeof window.matchMedia !== 'function') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemColorMode(media.matches ? 'dark' : 'light')

    update()
    media.addEventListener('change', update)

    return () => {
      media.removeEventListener('change', update)
    }
  }, [colorMode])

  return colorMode === 'system' ? systemColorMode : colorMode
}

/** Painel flutuante exclusivo de desenvolvimento que orquestra captura, arquivo e seleção de região. */
export function FigmaCapturePanel({
  theme,
  className,
  classNames,
  pathname,
  searchKey,
  labels: labelOverrides,
  position = 'bottom-right',
  colorMode = 'system',
  scriptSrc,
  nonce,
  integrity,
  crossOrigin,
  onCaptureActivate,
  onRegionSelect,
}: FigmaCapturePanelProps) {
  const labels = mergeLabels(labelOverrides)

  const [helperHidden, setHelperHidden] = useState(false)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const resolvedColorMode = useResolvedColorMode(colorMode)

  const ready = useLocalOrigin()
  const { regions, refresh } = useFigmaRegions({
    enabled: ready,
    pathname,
    searchKey,
  })
  const { activate } = useFigmaCapture({
    enabled: ready,
    onHashChange: refresh,
    scriptSrc,
    nonce,
    integrity,
    crossOrigin,
  })
  const fileRef = useFigmaFileRef()

  useEffect(() => {
    const element = regions.find((r) => r.id === selectedRegionId)?.element
    if (!element) return

    element.setAttribute(SELECTED_ATTR, 'true')
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })

    return () => {
      element.removeAttribute(SELECTED_ATTR)
    }
  }, [selectedRegionId, regions])

  const handleReset = useCallback(() => {
    setSelectedRegionId(null)
    setHelperHidden(false)
    fileRef.reset()
    refresh()
  }, [fileRef, refresh])

  const handleActivate = useCallback(() => {
    activate()
    fileRef.clearStatus()
    onCaptureActivate?.()
  }, [activate, fileRef, onCaptureActivate])

  const handleSelectRegion = useCallback(
    (region: RegionEntry) => {
      setSelectedRegionId(region.id)
      onRegionSelect?.(region)
    },
    [onRegionSelect]
  )

  const handleHide = useCallback(() => {
    setSelectedRegionId(null)
    setHelperHidden(true)
  }, [])

  if (!ready) return null

  if (helperHidden) {
    return (
      <HiddenBar
        labels={labels}
        position={position}
        className={classNames?.hiddenBar}
        onShow={() => setHelperHidden(false)}
      />
    )
  }

  const cssVars = theme ? themeToVars(theme) : {}
  const selectedRegion = regions.find((region) => region.id === selectedRegionId)
  const hasDestination = fileRef.value.trim().length > 0 && !fileRef.error
  const mapRegions = regions.slice(0, 10)

  return (
    <aside
      style={{ ...panelStyle(position), ...cssVars } as CSSProperties}
      className={joinClasses(panelClass, className)}
      data-figma-helper="true"
      data-pittiquita-color-mode={resolvedColorMode}
    >
      <div className={joinClasses(headerClass, classNames?.header)}>
        <div className={titleWrapClass}>
          <span className={markClass} aria-hidden="true">
            P
          </span>
          <div>
            <p className={titleClass}>{labels.panelTitle}</p>
            <p className={subtitleClass}>
              {regions.length} targets · {resolvedColorMode}
            </p>
          </div>
        </div>
        <span className={liveBadgeClass}>Live DOM</span>
        <button
          type="button"
          className={buttonClass({ size: 'sm', tone: 'ghost' })}
          onClick={handleHide}
        >
          {labels.hide}
        </button>
      </div>

      <section className={commandCenterClass} aria-label={labels.valueTitle}>
        <div className={commandHeaderClass}>
          <div>
            <p className={eyebrowClass}>Capture intelligence</p>
            <p className={valueTitleClass}>{labels.valueTitle}</p>
            <p className={valueDescriptionClass}>{labels.valueDescription}</p>
          </div>
        </div>

        <div className={signalGridClass}>
          <div className={signalCardClass}>
            <span className={signalValueClass}>{regions.length}</span>
            <span className={signalLabelClass}>{labels.scanLabel}</span>
          </div>
          <div className={signalCardClass}>
            <span className={signalValueClass}>
              {hasDestination ? labels.destinationReady : labels.destinationMissing}
            </span>
            <span className={signalLabelClass}>{labels.destinationLabel}</span>
          </div>
          <div className={signalCardClass}>
            <span className={signalValueClass}>
              {selectedRegion ? selectedRegion.label : labels.noSelection}
            </span>
            <span className={signalLabelClass}>{labels.selectionLabel}</span>
          </div>
        </div>

        <div className={pageMapClass}>
          <div className={pageMapHeaderClass}>
            <span>{labels.pageMapTitle}</span>
            <span>{regions.length > 0 ? `${mapRegions.length}/${regions.length}` : '0/0'}</span>
          </div>

          {mapRegions.length > 0 ? (
            <div className={pageMapCanvasClass}>
              {mapRegions.map((region, index) => (
                <button
                  key={region.id}
                  type="button"
                  aria-label={`Selecionar ${region.label} no mapa`}
                  className={joinClasses(
                    pageMapNodeClass,
                    index % 4 === 0 ? pageMapNodeWideClass : undefined,
                    selectedRegionId === region.id ? pageMapNodeSelectedClass : undefined
                  )}
                  onClick={() => handleSelectRegion(region)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          ) : (
            <div className={pageMapEmptyClass}>{labels.pageMapEmpty}</div>
          )}
        </div>
      </section>

      <ActionsRow
        labels={labels}
        className={classNames?.actions}
        onActivate={handleActivate}
        onReset={handleReset}
      />

      {fileRef.status ? <p className={statusClass}>{fileRef.status}</p> : null}

      <FileRefField
        labels={labels}
        value={fileRef.value}
        error={fileRef.error}
        className={classNames?.fileField}
        onChange={fileRef.setValue}
        onOpen={fileRef.openExistingFile}
      />

      <RegionList
        labels={labels}
        regions={regions}
        selectedId={selectedRegionId}
        className={classNames?.regionList}
        onSelect={handleSelectRegion}
      />
    </aside>
  )
}
