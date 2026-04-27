import type { PittiquitaLabels } from '../types'

/** Labels padrão do painel. O consumidor faz override parcial via props. */
export const defaultLabels: PittiquitaLabels = {
  panelTitle: 'Figma Capture',
  hide: 'Hide',
  show: 'Figma',
  instructions: {
    prefix: 'Use',
    entireScreen: 'Entire screen',
    or: 'or',
    selectElement: 'Select element',
    suffix: 'in Figma.',
  },
  activateCapture: 'Capture to Figma',
  reset: 'Reset map',
  captureActivated: 'Capture activated. Copy the browser URL and paste it in Figma.',
  fileSectionTitle: 'Figma file',
  fileRefLabel: 'Figma URL or fileKey',
  fileRefPlaceholder: 'Paste URL or fileKey',
  fileRefInvalid: 'Enter a valid Figma URL or fileKey.',
  fileOpened: 'Figma file opened in new tab.',
  openTooltip: 'Open file in Figma',
  valueTitle: 'Capture-ready DOM map',
  valueDescription:
    'pittiquita found the live regions on this page and prepared a Figma-friendly capture flow.',
  scanLabel: 'regions',
  destinationLabel: 'destination',
  selectionLabel: 'selection',
  destinationReady: 'linked',
  destinationMissing: 'missing',
  noSelection: 'none',
  pageMapTitle: 'Page map',
  pageMapEmpty: 'Mark regions with FigmaTarget to build a page map.',
  regionsTitle: 'Pre-marked regions',
  regionsCount: (count: number) =>
    `${count} visible ${count === 1 ? 'section' : 'sections'} on this page.`,
  regionsEmpty: 'No marked regions found.',
}

/**
 * Mescla labels parciais do consumidor com os defaults.
 * Suporta override do objeto `instructions` aninhado.
 */
export const mergeLabels = (
  overrides?: Partial<PittiquitaLabels>
): PittiquitaLabels => {
  if (!overrides) return defaultLabels
  return {
    ...defaultLabels,
    ...overrides,
    instructions: {
      ...defaultLabels.instructions,
      ...overrides.instructions,
    },
  }
}
