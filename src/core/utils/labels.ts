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
  activateCapture: 'Activate capture',
  reset: 'Reset',
  captureActivated: 'Capture activated. Copy the browser URL and paste it in Figma.',
  fileSectionTitle: 'Figma file',
  fileRefLabel: 'Figma URL or fileKey',
  fileRefPlaceholder: 'Paste URL or fileKey',
  fileRefInvalid: 'Enter a valid Figma URL or fileKey.',
  fileOpened: 'Figma file opened in new tab.',
  openTooltip: 'Open file in Figma',
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
