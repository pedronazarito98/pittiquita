export { useLocalOrigin } from './core/hooks/use-local-origin'

export {
  useFigmaCapture,
  type UseFigmaCaptureOptions,
  type UseFigmaCaptureResult,
} from './core/hooks/use-figma-capture'

export {
  useFigmaRegions,
  type UseFigmaRegionsOptions,
  type UseFigmaRegionsResult,
} from './core/hooks/use-figma-regions'

export {
  useFigmaFileRef,
  type UseFigmaFileRefOptions,
  type UseFigmaFileRefResult,
} from './core/hooks/use-figma-file-ref'

export type { RegionEntry, PittiquitaLabels } from './core/types'
export { defaultLabels, mergeLabels } from './core/utils/labels'

export { normalizeFileKey, buildFigmaFileUrl } from './core/utils/file-ref'
export { buildRegionEntries, areRegionsEqual, prettifyLabel } from './core/utils/regions'
export {
  isLocalOrigin,
  isCaptureActive,
  ensureCaptureScript,
  enableCaptureHash,
} from './core/utils/capture'
