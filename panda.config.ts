import {
  defineConfig,
  defineGlobalStyles,
  defineRecipe,
  defineSemanticTokens,
  defineTextStyles,
  defineTokens,
} from '@pandacss/dev'

const tokens = defineTokens({
  colors: {
    white: { value: '#ffffff' },
    black: { value: '#07090f' },
    slate: {
      50: { value: '#f8fafc' },
      100: { value: '#f1f5f9' },
      200: { value: '#e2e8f0' },
      300: { value: '#cbd5e1' },
      400: { value: '#94a3b8' },
      500: { value: '#64748b' },
      600: { value: '#475569' },
      700: { value: '#334155' },
      800: { value: '#1e293b' },
      900: { value: '#0f172a' },
      950: { value: '#020617' },
    },
    indigo: {
      300: { value: '#a5b4fc' },
      400: { value: '#818cf8' },
      500: { value: '#6366f1' },
      600: { value: '#4f46e5' },
    },
    emerald: {
      300: { value: '#6ee7b7' },
      500: { value: '#10b981' },
      600: { value: '#059669' },
    },
    amber: {
      300: { value: '#fcd34d' },
      500: { value: '#f59e0b' },
    },
    rose: {
      300: { value: '#fda4af' },
      500: { value: '#f43f5e' },
      600: { value: '#e11d48' },
    },
    cyan: {
      300: { value: '#67e8f9' },
      500: { value: '#06b6d4' },
    },
  },
  fonts: {
    sans: {
      value:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    mono: {
      value:
        '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, ui-monospace, monospace',
    },
  },
  radii: {
    xs: { value: '6px' },
    sm: { value: '8px' },
    md: { value: '10px' },
    lg: { value: '14px' },
    xl: { value: '18px' },
    full: { value: '999px' },
  },
  shadows: {
    panelRaised: {
      value:
        '0 24px 70px rgba(15, 23, 42, 0.16), 0 1px 0 rgba(255, 255, 255, 0.55) inset',
    },
    panelRaisedDark: {
      value:
        '0 26px 80px rgba(0, 0, 0, 0.48), 0 1px 0 rgba(255, 255, 255, 0.08) inset',
    },
    focus: { value: '0 0 0 3px rgba(99, 102, 241, 0.24)' },
  },
})

const semanticTokens = defineSemanticTokens({
  colors: {
    surface: {
      panel: {
        value: { _light: '{colors.white}', _dark: '{colors.slate.950}' },
      },
      elevated: {
        value: { _light: '{colors.slate.50}', _dark: '{colors.slate.900}' },
      },
      subtle: {
        value: { _light: '{colors.slate.100}', _dark: '{colors.slate.800}' },
      },
      glass: {
        value: {
          _light: 'rgba(255, 255, 255, 0.86)',
          _dark: 'rgba(2, 6, 23, 0.86)',
        },
      },
    },
    text: {
      primary: {
        value: { _light: '{colors.slate.950}', _dark: '{colors.slate.50}' },
      },
      secondary: {
        value: { _light: '{colors.slate.600}', _dark: '{colors.slate.300}' },
      },
      muted: {
        value: { _light: '{colors.slate.400}', _dark: '{colors.slate.500}' },
      },
      inverse: {
        value: { _light: '{colors.white}', _dark: '{colors.slate.950}' },
      },
    },
    border: {
      default: {
        value: { _light: '{colors.slate.200}', _dark: '{colors.slate.800}' },
      },
      strong: {
        value: { _light: '{colors.slate.300}', _dark: '{colors.slate.700}' },
      },
      focus: {
        value: { _light: '{colors.indigo.500}', _dark: '{colors.indigo.300}' },
      },
    },
    accent: {
      solid: {
        value: { _light: '{colors.indigo.600}', _dark: '{colors.indigo.400}' },
      },
      text: {
        value: { _light: '{colors.indigo.600}', _dark: '{colors.indigo.300}' },
      },
      soft: {
        value: {
          _light: 'rgba(99, 102, 241, 0.12)',
          _dark: 'rgba(129, 140, 248, 0.16)',
        },
      },
    },
    success: {
      solid: {
        value: { _light: '{colors.emerald.600}', _dark: '{colors.emerald.300}' },
      },
      soft: {
        value: {
          _light: 'rgba(16, 185, 129, 0.12)',
          _dark: 'rgba(110, 231, 183, 0.14)',
        },
      },
    },
    warning: {
      solid: {
        value: { _light: '{colors.amber.500}', _dark: '{colors.amber.300}' },
      },
      soft: {
        value: {
          _light: 'rgba(245, 158, 11, 0.13)',
          _dark: 'rgba(252, 211, 77, 0.14)',
        },
      },
    },
    danger: {
      solid: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.rose.300}' },
      },
      soft: {
        value: {
          _light: 'rgba(244, 63, 94, 0.11)',
          _dark: 'rgba(253, 164, 175, 0.14)',
        },
      },
    },
  },
  shadows: {
    panel: {
      value: { _light: '{shadows.panelRaised}', _dark: '{shadows.panelRaisedDark}' },
    },
  },
})

const textStyles = defineTextStyles({
  caption: {
    description: 'Metadados pequenos e textos auxiliares dentro do painel de captura.',
    value: {
      fontFamily: '{fonts.sans}',
      fontSize: '11px',
      lineHeight: '1.45',
      letterSpacing: '0',
    },
  },
  body: {
    description: 'Texto legível padrão para controles e descrições do painel.',
    value: {
      fontFamily: '{fonts.sans}',
      fontSize: '13px',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },
  title: {
    description: 'Título compacto de seção para superfícies utilitárias.',
    value: {
      fontFamily: '{fonts.sans}',
      fontSize: '14px',
      fontWeight: '650',
      lineHeight: '1.35',
      letterSpacing: '0',
    },
  },
})

const panelButton = defineRecipe({
  className: 'panel-button',
  description: 'Tratamento visual compartilhado para botões do painel de captura.',
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderColor: 'border.default',
    borderRadius: 'sm',
    borderStyle: 'solid',
    borderWidth: '1px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'sans',
    fontSize: '12px',
    fontWeight: '650',
    gap: '7px',
    justifyContent: 'center',
    letterSpacing: '0',
    lineHeight: '1',
    minH: '36px',
    outline: 'none',
    px: '11px',
    transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    _focusVisible: {
      borderColor: 'border.focus',
      boxShadow: 'focus',
    },
    _hover: {
      transform: 'translateY(-1px)',
    },
    _active: {
      transform: 'translateY(0)',
    },
  },
  variants: {
    tone: {
      primary: {
        bg: 'accent.solid',
        borderColor: 'accent.solid',
        color: 'text.inverse',
        _hover: {
          bg: 'accent.text',
          borderColor: 'accent.text',
        },
      },
      secondary: {
        bg: 'surface.elevated',
        color: 'text.primary',
        _hover: {
          bg: 'surface.subtle',
          borderColor: 'border.strong',
        },
      },
      ghost: {
        bg: 'transparent',
        borderColor: 'transparent',
        color: 'text.secondary',
        _hover: {
          bg: 'surface.subtle',
          color: 'text.primary',
        },
      },
      region: {
        bg: 'surface.elevated',
        color: 'text.secondary',
        justifyContent: 'flex-start',
        textAlign: 'left',
        _hover: {
          bg: 'accent.soft',
          borderColor: 'border.focus',
          color: 'accent.text',
        },
      },
    },
    selected: {
      true: {
        bg: 'accent.soft',
        borderColor: 'border.focus',
        color: 'accent.text',
      },
    },
    size: {
      sm: {
        minH: '32px',
        px: '9px',
      },
      md: {
        minH: '38px',
      },
      icon: {
        h: '36px',
        minH: '36px',
        px: '0',
        w: '36px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'secondary',
  },
})

const globalCss = defineGlobalStyles({
  '[data-figma-helper="true"] *': {
    boxSizing: 'border-box',
  },
  '[data-figma-helper="true"] button': {
    font: 'inherit',
  },
})

export default defineConfig({
  preflight: false,
  prefix: 'pq',
  include: ['./src/**/*.{ts,tsx}', './playground/src/**/*.{ts,tsx}'],
  exclude: ['node_modules', 'dist', 'src/styled-system'],
  outdir: 'src/styled-system',
  outExtension: 'js',
  jsxFramework: 'react',
  conditions: {
    light: '[data-pittiquita-color-mode=light] &',
    dark: '[data-pittiquita-color-mode=dark] &',
  },
  globalCss,
  staticCss: {
    recipes: {
      panelButton: ['*'],
    },
  },
  theme: {
    extend: {
      tokens,
      semanticTokens,
      textStyles,
      recipes: {
        panelButton,
      },
    },
  },
})
