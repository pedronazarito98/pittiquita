/** Região mapeada da página, com id único e label pronto para exibir. */
export type RegionEntry = {
  element: HTMLElement
  id: string
  label: string
}

/** Tokens de tema para o componente pré-montado. */
export type PittiquitaTheme = {
  panelBg: string
  borderColor: string
  borderRadius: string
  accentColor: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  fontFamily: string
  fontSize: string
  gap: string
  padding: string
  zIndex: number
}

/** Textos do painel. Override parcial para i18n. */
export type PittiquitaLabels = {
  panelTitle: string
  hide: string
  show: string
  instructions: {
    prefix: string
    entireScreen: string
    or: string
    selectElement: string
    suffix: string
  }
  activateCapture: string
  reset: string
  captureActivated: string
  fileSectionTitle: string
  fileRefLabel: string
  fileRefPlaceholder: string
  fileRefInvalid: string
  fileOpened: string
  openTooltip: string
  regionsTitle: string
  regionsCount: (count: number) => string
  regionsEmpty: string
}

/** Nomes dos slots para className overrides. */
export type PittiquitaClassNames = {
  header?: string
  actions?: string
  regionList?: string
  fileField?: string
  hiddenBar?: string
}

/** Posição do painel flutuante. */
export type PanelPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
