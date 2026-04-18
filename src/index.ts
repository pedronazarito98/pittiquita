// React components
export { FigmaCapturePanel } from './react/FigmaCapturePanel'
export { FigmaTarget, figmaTarget } from './react/FigmaTarget'

// Re-export everything from hooks entry point
export {
  useLocalOrigin,
  useFigmaCapture,
  useFigmaRegions,
  useFigmaFileRef,
  normalizeFileKey,
  buildFigmaFileUrl,
  buildRegionEntries,
  areRegionsEqual,
  prettifyLabel,
  isLocalOrigin,
  isCaptureActive,
  ensureCaptureScript,
  enableCaptureHash,
  defaultLabels,
  mergeLabels,
} from './hooks'

// Types
export type {
  RegionEntry,
  PittiquitaTheme,
  PittiquitaLabels,
  PittiquitaClassNames,
  PanelPosition,
} from './core/types'

export type {
  UseFigmaCaptureOptions,
  UseFigmaCaptureResult,
  UseFigmaRegionsOptions,
  UseFigmaRegionsResult,
  UseFigmaFileRefOptions,
  UseFigmaFileRefResult,
} from './hooks'

export type { FigmaCapturePanelProps } from './react/FigmaCapturePanel'
export type { FigmaTargetProps } from './react/FigmaTarget'
