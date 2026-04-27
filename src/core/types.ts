/** Região mapeada da página, com id único e label pronto para exibir. */
export type RegionEntry = {
  /** Elemento real encontrado no DOM. */
  element: HTMLElement
  /** Identificador estável derivado dos atributos de captura. */
  id: string
  /** Texto legível exibido para seleção no painel. */
  label: string
}

/** Tokens de tema para o componente pré-montado. */
export type PittiquitaTheme = {
  /** Fundo principal do painel. */
  panelBg: string
  /** Cor de borda aplicada a campos, botões e painel. */
  borderColor: string
  /** Raio de borda do painel. */
  borderRadius: string
  /** Cor de destaque para ações primárias e foco. */
  accentColor: string
  /** Cor principal de texto. */
  textPrimary: string
  /** Cor secundária para descrições e labels auxiliares. */
  textSecondary: string
  /** Cor discreta para metadados. */
  textMuted: string
  /** Família tipográfica usada pelo painel. */
  fontFamily: string
  /** Tamanho base da tipografia do painel. */
  fontSize: string
  /** Espaçamento entre grupos principais. */
  gap: string
  /** Padding interno do painel. */
  padding: string
  /** Camada visual do painel na viewport. */
  zIndex: number
}

/** Modo de cor usado pelo painel de captura. */
export type PittiquitaColorMode = 'light' | 'dark' | 'system'

/** Textos do painel. Override parcial para i18n. */
export type PittiquitaLabels = {
  /** Título principal do painel. */
  panelTitle: string
  /** Ação para ocultar o painel. */
  hide: string
  /** Ação para reexibir o painel oculto. */
  show: string
  /** Frase curta que orienta o fluxo de captura. */
  instructions: {
    /** Texto antes da primeira ação destacada. */
    prefix: string
    /** Termo destacado para captura da tela inteira. */
    entireScreen: string
    /** Conector entre as duas opções de captura. */
    or: string
    /** Termo destacado para seleção de elemento. */
    selectElement: string
    /** Texto final da instrução. */
    suffix: string
  }
  /** Texto do botão que ativa o script de captura. */
  activateCapture: string
  /** Texto do botão que limpa estado local e seleção. */
  reset: string
  /** Mensagem emitida quando a captura é ativada. */
  captureActivated: string
  /** Título da seção de vínculo com arquivo Figma. */
  fileSectionTitle: string
  /** Label acessível do campo de referência do arquivo. */
  fileRefLabel: string
  /** Placeholder do campo de referência do arquivo. */
  fileRefPlaceholder: string
  /** Mensagem para referência inválida. */
  fileRefInvalid: string
  /** Mensagem quando o arquivo é aberto. */
  fileOpened: string
  /** Tooltip do botão de abrir arquivo. */
  openTooltip: string
  /** Título do bloco que comunica o valor da captura. */
  valueTitle: string
  /** Descrição curta do que o painel preparou para o Figma. */
  valueDescription: string
  /** Rótulo da métrica de regiões detectadas. */
  scanLabel: string
  /** Rótulo da métrica de destino Figma. */
  destinationLabel: string
  /** Rótulo da métrica de seleção atual. */
  selectionLabel: string
  /** Estado exibido quando existe destino Figma preenchido. */
  destinationReady: string
  /** Estado exibido quando ainda não existe destino Figma. */
  destinationMissing: string
  /** Estado exibido quando nenhuma região está selecionada. */
  noSelection: string
  /** Título do mini mapa das regiões detectadas. */
  pageMapTitle: string
  /** Estado vazio do mini mapa. */
  pageMapEmpty: string
  /** Título da lista de regiões capturáveis. */
  regionsTitle: string
  /** Texto dinâmico com a quantidade de regiões. */
  regionsCount: (count: number) => string
  /** Estado vazio da lista de regiões. */
  regionsEmpty: string
}

/** Nomes dos slots para className overrides. */
export type PittiquitaClassNames = {
  /** Slot do cabeçalho do painel. */
  header?: string
  /** Slot da linha de ações principais. */
  actions?: string
  /** Slot da lista de regiões. */
  regionList?: string
  /** Slot do campo de referência do arquivo. */
  fileField?: string
  /** Slot do launcher exibido quando o painel está oculto. */
  hiddenBar?: string
}

/** Posição do painel flutuante. */
export type PanelPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
