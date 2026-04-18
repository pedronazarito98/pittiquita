import { useCallback, useEffect, useState } from 'react'

import type {
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
import { headerStyle, panelStyle, textSmall, themeToVars } from './styles'

export type FigmaCapturePanelProps = {
  theme?: Partial<PittiquitaTheme>
  className?: string
  classNames?: PittiquitaClassNames
  pathname?: string | null
  searchKey?: string
  labels?: Partial<PittiquitaLabels>
  position?: PanelPosition
  /** URL alternativa para o script de captura (ex.: self-host ou mirror). */
  scriptSrc?: string
  /** `nonce` aplicado à tag `<script>` — necessário com CSP estrita. */
  nonce?: string
  /** Hash SRI aplicado à tag `<script>` (ex.: `sha384-...`). */
  integrity?: string
  /** Atributo `crossorigin` da tag `<script>`. */
  crossOrigin?: 'anonymous' | 'use-credentials'
  onCaptureActivate?: () => void
  onRegionSelect?: (region: RegionEntry) => void
}

export function FigmaCapturePanel({
  theme,
  className,
  classNames,
  pathname,
  searchKey,
  labels: labelOverrides,
  position = 'bottom-right',
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

  return (
    <aside
      style={{ ...panelStyle(position), ...cssVars } as React.CSSProperties}
      className={className}
      data-figma-helper="true"
    >
      <div style={headerStyle} className={classNames?.header}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
          {labels.panelTitle}
        </p>
        <button
          type="button"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--pittiquita-text-secondary, #4a5568)',
          }}
          onClick={handleHide}
        >
          {labels.hide}
        </button>
      </div>

      <p style={textSmall}>
        {labels.instructions.prefix}{' '}
        <strong>{labels.instructions.entireScreen}</strong>{' '}
        {labels.instructions.or}{' '}
        <strong>{labels.instructions.selectElement}</strong>{' '}
        {labels.instructions.suffix}
      </p>

      <ActionsRow
        labels={labels}
        className={classNames?.actions}
        onActivate={handleActivate}
        onReset={handleReset}
      />

      {fileRef.status ? <p style={{ margin: 0, fontSize: '11px', color: 'var(--pittiquita-text-secondary)' }}>{fileRef.status}</p> : null}

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
