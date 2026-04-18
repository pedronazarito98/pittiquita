import type { PanelPosition, PittiquitaTheme } from '../core/types'

/** Tema padrão. */
export const defaultTheme: PittiquitaTheme = {
  panelBg: '#ffffff',
  borderColor: '#e2e8f0',
  borderRadius: '14px',
  accentColor: '#6366f1',
  textPrimary: '#1a202c',
  textSecondary: '#4a5568',
  textMuted: '#a0aec0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '13px',
  gap: '14px',
  padding: '14px',
  zIndex: 1400,
}

/**
 * Gera CSS variables a partir do theme para aplicar no container.
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
  }
}

const positionMap: Record<PanelPosition, Pick<React.CSSProperties, 'top' | 'right' | 'bottom' | 'left'>> = {
  'bottom-right': { bottom: '16px', right: '16px' },
  'bottom-left': { bottom: '16px', left: '16px' },
  'top-right': { top: '16px', right: '16px' },
  'top-left': { top: '16px', left: '16px' },
}

export const panelStyle = (position: PanelPosition = 'bottom-right'): React.CSSProperties => ({
  position: 'fixed',
  ...positionMap[position],
  zIndex: 'var(--pittiquita-z-index, 1400)' as unknown as number,
  width: 'min(340px, calc(100vw - 32px))',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--pittiquita-gap, 14px)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--pittiquita-border-color, #e2e8f0)',
  background: 'var(--pittiquita-panel-bg, #ffffff)',
  borderRadius: 'var(--pittiquita-border-radius, 14px)',
  padding: 'var(--pittiquita-padding, 14px)',
  fontFamily: 'var(--pittiquita-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  fontSize: 'var(--pittiquita-font-size, 13px)',
  color: 'var(--pittiquita-text-primary, #1a202c)',
  boxSizing: 'border-box',
})

export const hiddenBarStyle = (position: PanelPosition = 'bottom-right'): React.CSSProperties => ({
  position: 'fixed',
  ...positionMap[position],
  zIndex: 'var(--pittiquita-z-index, 1400)' as unknown as number,
})

export const headerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export const actionsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '8px',
}

export const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gap: '8px',
}

export const fileRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: '8px',
  alignItems: 'end',
}

export const regionListStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '8px',
  maxHeight: '220px',
  overflowY: 'auto',
}

export const buttonBaseStyle: React.CSSProperties = {
  border: '1px solid var(--pittiquita-border-color, #e2e8f0)',
  borderRadius: '8px',
  padding: '6px 12px',
  fontSize: 'var(--pittiquita-font-size, 13px)',
  fontFamily: 'inherit',
  cursor: 'pointer',
  background: 'transparent',
  color: 'var(--pittiquita-text-primary, #1a202c)',
}

export const buttonAccentStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  background: 'var(--pittiquita-accent, #6366f1)',
  borderColor: 'var(--pittiquita-accent, #6366f1)',
  color: '#ffffff',
}

export const inputStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  cursor: 'text',
  width: '100%',
  boxSizing: 'border-box',
}

export const textSmall: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--pittiquita-font-size, 13px)',
  color: 'var(--pittiquita-text-secondary, #4a5568)',
  lineHeight: 1.4,
}

export const textMuted: React.CSSProperties = {
  margin: 0,
  fontSize: '11px',
  color: 'var(--pittiquita-text-muted, #a0aec0)',
  lineHeight: 1.4,
}

export const textTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--pittiquita-text-primary, #1a202c)',
  lineHeight: 1.4,
}

export const errorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '11px',
  color: '#e53e3e',
  lineHeight: 1.4,
}
