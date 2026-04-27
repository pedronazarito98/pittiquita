import type { CSSProperties } from 'react'

import { css, cx } from '../styled-system/css'
import { panelButton } from '../styled-system/recipes'

import type { PanelPosition, PittiquitaTheme } from '../core/types'

/** Contrato visual padrão para consumidores que ainda passam sobrescritas em `theme`. */
export const defaultTheme: PittiquitaTheme = {
  panelBg: 'rgba(255, 255, 255, 0.9)',
  borderColor: 'rgba(148, 163, 184, 0.28)',
  borderRadius: '14px',
  accentColor: '#06b6d4',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '13px',
  gap: '14px',
  padding: '14px',
  zIndex: 1400,
}

/**
 * Converte a API pública `theme` em variáveis legadas e variáveis do Panda CSS.
 *
 * As variáveis legadas mantêm sobrescritas antigas por className/style funcionando,
 * enquanto as variáveis Panda fazem as recipes geradas herdarem a mesma customização.
 */
export const themeToVars = (
  theme: Partial<PittiquitaTheme>
): Record<string, string | number> => {
  const merged = { ...defaultTheme, ...theme }

  return {
    '--pittiquita-panel-bg': merged.panelBg,
    '--pittiquita-border-color': merged.borderColor,
    '--pittiquita-border-radius': merged.borderRadius,
    '--pittiquita-accent': merged.accentColor,
    '--pittiquita-text-primary': merged.textPrimary,
    '--pittiquita-text-secondary': merged.textSecondary,
    '--pittiquita-text-muted': merged.textMuted,
    '--pittiquita-font-family': merged.fontFamily,
    '--pittiquita-font-size': merged.fontSize,
    '--pittiquita-gap': merged.gap,
    '--pittiquita-padding': merged.padding,
    '--pittiquita-z-index': merged.zIndex,
    '--colors-surface-panel': merged.panelBg,
    '--colors-surface-glass': merged.panelBg,
    '--colors-border-default': merged.borderColor,
    '--colors-border-focus': merged.accentColor,
    '--colors-accent-solid': merged.accentColor,
    '--colors-accent-text': merged.accentColor,
    '--colors-text-primary': merged.textPrimary,
    '--colors-text-secondary': merged.textSecondary,
    '--colors-text-muted': merged.textMuted,
    '--fonts-sans': merged.fontFamily,
    '--font-sizes-panel': merged.fontSize,
    '--radii-lg': merged.borderRadius,
    '--pq-colors-surface-panel': merged.panelBg,
    '--pq-colors-surface-glass': merged.panelBg,
    '--pq-colors-border-default': merged.borderColor,
    '--pq-colors-border-focus': merged.accentColor,
    '--pq-colors-accent-solid': merged.accentColor,
    '--pq-colors-accent-text': merged.accentColor,
    '--pq-colors-text-primary': merged.textPrimary,
    '--pq-colors-text-secondary': merged.textSecondary,
    '--pq-colors-text-muted': merged.textMuted,
    '--pq-fonts-sans': merged.fontFamily,
    '--pq-font-sizes-panel': merged.fontSize,
    '--pq-radii-lg': merged.borderRadius,
  }
}

const positionMap: Record<PanelPosition, Pick<CSSProperties, 'top' | 'right' | 'bottom' | 'left'>> = {
  'bottom-right': { bottom: '16px', right: '16px' },
  'bottom-left': { bottom: '16px', left: '16px' },
  'top-right': { top: '16px', right: '16px' },
  'top-left': { top: '16px', left: '16px' },
}

/** Retorna os estilos de posicionamento fixo que precisam continuar dinâmicos em runtime. */
export const panelStyle = (position: PanelPosition = 'bottom-right'): CSSProperties => ({
  position: 'fixed',
  ...positionMap[position],
  zIndex: 'var(--pittiquita-z-index, 1400)' as unknown as number,
})

/** Retorna os estilos de posicionamento fixo para o launcher recolhido. */
export const hiddenBarStyle = (position: PanelPosition = 'bottom-right'): CSSProperties => ({
  position: 'fixed',
  ...positionMap[position],
  zIndex: 'var(--pittiquita-z-index, 1400)' as unknown as number,
})

/** Container principal do painel flutuante. */
export const panelClass = css({
  backdropFilter: 'blur(22px) saturate(1.28)',
  bg: 'surface.glass',
  borderColor: 'border.default',
  borderRadius: 'lg',
  borderStyle: 'solid',
  borderWidth: '1px',
  boxShadow: 'panel',
  color: 'text.primary',
  display: 'grid',
  fontFamily: 'sans',
  fontSize: '13px',
  gap: '10px',
  isolation: 'isolate',
  maxH: 'calc(100vh - 32px)',
  overflowX: 'hidden',
  overflowY: 'auto',
  p: '13px',
  position: 'relative',
  w: 'min(520px, calc(100vw - 32px))',
  _before: {
    bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(99, 102, 241, 0.14) 42%, transparent 68%)',
    content: '""',
    inset: '0',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: '-1',
  },
})

/** Cabeçalho com marca, indicador de modo e ações do painel. */
export const headerClass = css({
  alignItems: 'center',
  display: 'grid',
  gap: '10px',
  gridTemplateColumns: 'minmax(0, 1fr) auto auto',
})

/** Marca compacta usada para ancorar visualmente o painel. */
export const markClass = css({
  alignItems: 'center',
  bg: 'rgba(6, 182, 212, 0.14)',
  borderColor: 'border.focus',
  borderRadius: 'sm',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'accent.text',
  display: 'inline-flex',
  fontSize: '12px',
  fontWeight: '800',
  h: '28px',
  justifyContent: 'center',
  lineHeight: '1',
  w: '28px',
})

/** Selo técnico que comunica que o painel observa a página em tempo real. */
export const liveBadgeClass = css({
  alignItems: 'center',
  bg: 'success.soft',
  borderColor: 'rgba(16, 185, 129, 0.28)',
  borderRadius: 'full',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'success.solid',
  display: 'inline-flex',
  fontSize: '10px',
  fontWeight: '800',
  gap: '6px',
  h: '24px',
  letterSpacing: '0',
  px: '8px',
  textTransform: 'uppercase',
})

/** Linha de marca que mantém título e metadados auxiliares agrupados. */
export const titleWrapClass = css({
  alignItems: 'center',
  display: 'grid',
  gap: '10px',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  minW: '0',
})

/** Título principal do painel. */
export const titleClass = css({
  color: 'text.primary',
  fontSize: '14px',
  fontWeight: '750',
  letterSpacing: '0',
  lineHeight: '1.2',
  m: '0',
})

/** Linha pequena de status abaixo do título do painel. */
export const subtitleClass = css({
  color: 'text.muted',
  fontSize: '11px',
  lineHeight: '1.35',
  m: '2px 0 0',
})

/** Bloco de instrução que reduz ruído textual com uma faixa sutil. */
export const instructionsClass = css({
  bg: 'surface.elevated',
  borderColor: 'border.default',
  borderRadius: 'md',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'text.secondary',
  lineHeight: '1.45',
  m: '0',
  p: '10px 11px',
})

/** Bloco principal que transforma a captura em uma leitura útil da página. */
export const commandCenterClass = css({
  bg: 'linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.02))',
  borderColor: 'border.default',
  borderRadius: 'lg',
  borderStyle: 'solid',
  borderWidth: '1px',
  display: 'grid',
  gap: '10px',
  overflow: 'hidden',
  p: '11px',
})

/** Cabeçalho interno do bloco de valor da captura. */
export const commandHeaderClass = css({
  alignItems: 'start',
  display: 'grid',
  gap: '10px',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
})

/** Rótulo superior curto do bloco de valor. */
export const eyebrowClass = css({
  color: 'accent.text',
  fontFamily: 'mono',
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '0',
  lineHeight: '1',
  m: '0 0 6px',
  textTransform: 'uppercase',
})

/** Título de valor do fluxo de captura. */
export const valueTitleClass = css({
  color: 'text.primary',
  fontSize: '17px',
  fontWeight: '800',
  letterSpacing: '0',
  lineHeight: '1.15',
  m: '0',
})

/** Descrição curta do valor gerado pelo painel. */
export const valueDescriptionClass = css({
  color: 'text.secondary',
  fontSize: '12px',
  lineHeight: '1.35',
  m: '5px 0 0',
  maxW: '38ch',
})

/** Grade de métricas que mostra o estado real da captura. */
export const signalGridClass = css({
  display: 'grid',
  gap: '7px',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
})

/** Métrica compacta do command center. */
export const signalCardClass = css({
  bg: 'surface.elevated',
  borderColor: 'border.default',
  borderRadius: 'md',
  borderStyle: 'solid',
  borderWidth: '1px',
  display: 'grid',
  gap: '2px',
  minW: '0',
  p: '8px',
})

/** Valor principal de uma métrica. */
export const signalValueClass = css({
  color: 'text.primary',
  fontSize: '16px',
  fontWeight: '800',
  lineHeight: '1',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/** Rótulo de uma métrica. */
export const signalLabelClass = css({
  color: 'text.muted',
  fontSize: '10px',
  fontWeight: '700',
  lineHeight: '1.2',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
})

/** Moldura do mini mapa que demonstra a estrutura capturável da página. */
export const pageMapClass = css({
  bg: 'rgba(2, 6, 23, 0.04)',
  borderColor: 'border.default',
  borderRadius: 'md',
  borderStyle: 'solid',
  borderWidth: '1px',
  display: 'grid',
  gap: '7px',
  p: '8px',
})

/** Cabeçalho do mini mapa. */
export const pageMapHeaderClass = css({
  alignItems: 'center',
  color: 'text.secondary',
  display: 'flex',
  fontSize: '11px',
  fontWeight: '750',
  justifyContent: 'space-between',
  lineHeight: '1.2',
})

/** Canvas abstrato das regiões detectadas. */
export const pageMapCanvasClass = css({
  display: 'grid',
  gap: '4px',
  gridAutoRows: '15px',
  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
})

/** Nó visual de uma região dentro do mini mapa. */
export const pageMapNodeClass = css({
  appearance: 'none',
  bg: 'surface.elevated',
  borderColor: 'border.default',
  borderRadius: 'xs',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'text.muted',
  cursor: 'pointer',
  fontFamily: 'mono',
  fontSize: '9px',
  fontWeight: '800',
  lineHeight: '1',
  minW: '0',
  outline: 'none',
  px: '0',
  transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease',
  _focusVisible: {
    borderColor: 'border.focus',
    boxShadow: 'focus',
  },
  _hover: {
    borderColor: 'border.focus',
    color: 'accent.text',
    transform: 'translateY(-1px)',
  },
})

/** Nó destacado no mini mapa quando a região está selecionada. */
export const pageMapNodeSelectedClass = css({
  bg: 'accent.solid',
  borderColor: 'accent.solid',
  color: 'text.inverse',
})

/** Nó mais largo para simular regiões de layout dominantes. */
export const pageMapNodeWideClass = css({
  gridColumn: 'span 2',
})

/** Texto vazio do mini mapa. */
export const pageMapEmptyClass = css({
  alignItems: 'center',
  bg: 'surface.elevated',
  borderColor: 'border.default',
  borderRadius: 'sm',
  borderStyle: 'dashed',
  borderWidth: '1px',
  color: 'text.muted',
  display: 'flex',
  fontSize: '11px',
  justifyContent: 'center',
  minH: '56px',
  p: '10px',
  textAlign: 'center',
})

/** Ênfase inline para termos importantes da instrução. */
export const instructionStrongClass = css({
  color: 'text.primary',
  fontWeight: '750',
})

/** Grid que mantém as ações primária e de reset fáceis de acessar. */
export const actionsGridClass = css({
  display: 'grid',
  gap: '8px',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
})

/** Layout genérico de seção usado pelo campo de arquivo e pelas regiões. */
export const sectionClass = css({
  display: 'grid',
  gap: '8px',
})

/** Linha de cabeçalho para seções densas com título e metadados opcionais. */
export const sectionHeaderClass = css({
  alignItems: 'center',
  display: 'flex',
  gap: '8px',
  justifyContent: 'space-between',
})

/** Linha de referência do arquivo com input e ação externa compacta. */
export const fileRowClass = css({
  alignItems: 'end',
  display: 'grid',
  gap: '8px',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
})

/** Lista de regiões ajustada para escanear muitos alvos sem alongar o painel. */
export const regionListClass = css({
  display: 'grid',
  gap: '7px',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  maxH: '170px',
  overflowY: 'auto',
  pr: '2px',
  scrollbarWidth: 'thin',
})

/** Conteúdo interno do botão de região. */
export const regionButtonContentClass = css({
  alignItems: 'center',
  display: 'grid',
  gap: '8px',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  minW: '0',
  w: '100%',
})

/** Índice visual de uma região detectada. */
export const regionIndexClass = css({
  alignItems: 'center',
  bg: 'rgba(6, 182, 212, 0.1)',
  borderRadius: 'xs',
  color: 'accent.text',
  display: 'inline-flex',
  fontFamily: 'mono',
  fontSize: '10px',
  fontWeight: '850',
  h: '20px',
  justifyContent: 'center',
  lineHeight: '1',
  w: '24px',
})

/** Estilo de campo compartilhado por inputs de texto no painel. */
export const inputClass = css({
  appearance: 'none',
  bg: 'surface.elevated',
  borderColor: 'border.default',
  borderRadius: 'sm',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'text.primary',
  fontFamily: 'sans',
  fontSize: '12px',
  h: '38px',
  outline: 'none',
  px: '10px',
  transition: 'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
  w: '100%',
  _focus: {
    borderColor: 'border.focus',
    boxShadow: 'focus',
  },
  _placeholder: {
    color: 'text.muted',
  },
})

/** Sobrescrita de borda de erro para inputs inválidos. */
export const inputErrorClass = css({
  borderColor: 'danger.solid',
})

/** Texto pequeno para descrições e estados vazios. */
export const textSmallClass = css({
  color: 'text.secondary',
  fontSize: '12px',
  lineHeight: '1.45',
  m: '0',
})

/** Texto discreto para metadados. */
export const textMutedClass = css({
  color: 'text.muted',
  fontSize: '11px',
  lineHeight: '1.4',
  m: '0',
})

/** Texto de título de seção. */
export const textTitleClass = css({
  color: 'text.primary',
  fontSize: '12px',
  fontWeight: '750',
  lineHeight: '1.3',
  m: '0',
})

/** Feedback inline de status para ações de arquivo bem-sucedidas. */
export const statusClass = css({
  bg: 'success.soft',
  borderColor: 'rgba(16, 185, 129, 0.28)',
  borderRadius: 'sm',
  borderStyle: 'solid',
  borderWidth: '1px',
  color: 'success.solid',
  fontSize: '11px',
  fontWeight: '650',
  lineHeight: '1.35',
  m: '0',
  px: '9px',
  py: '7px',
})

/** Texto de erro de validação. */
export const errorClass = css({
  color: 'danger.solid',
  fontSize: '11px',
  lineHeight: '1.4',
  m: '0',
})

/** Superfície do launcher recolhido. */
export const hiddenBarClass = css({
  alignItems: 'center',
  display: 'inline-flex',
})

/** Truncamento do texto dos botões de região para evitar redimensionamento das linhas. */
export const regionLabelClass = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/** Retorna a classe de recipe para uma variante de botão do painel. */
export const buttonClass = panelButton

/** Junta nomes de classes ignorando sobrescritas vazias. */
export const joinClasses = cx
