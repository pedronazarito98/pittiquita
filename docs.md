# pittiquita — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a biblioteca npm `pittiquita` — pacote React para captura de componentes HTML para o Figma, extraído do `mti-webapp/src/components/dev`.

**Architecture:** Pacote único com múltiplos entry points (`.`, `./hooks`, `./next`, `./vite`). Camada core headless (hooks + utils puros) sem dependência de UI, camada react com componente pré-montado customizável via inline styles + CSS vars + classNames (Tailwind-ready), e plugins de auto-inject para Next.js e Vite.

**Tech Stack:** React 18+, TypeScript strict, tsup (ESM + CJS + DTS), Vitest + Testing Library, pnpm.

**Spec:** `docs/superpowers/specs/2026-04-16-pittiquita-design.md`

**Código fonte de referência:** `src/components/dev/` (mti-webapp)

---

## File Map

### Criados

```
pittiquita/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .gitignore
├── README.md
├── src/
│   ├── index.ts                              # re-export principal (.)
│   ├── hooks.ts                              # re-export headless (./hooks)
│   ├── core/
│   │   ├── types.ts                          # RegionEntry, PittiquitaTheme, PittiquitaLabels, etc.
│   │   ├── utils/
│   │   │   ├── capture.ts                    # ensureCaptureScript, enableCaptureHash, isLocalOrigin, isCaptureActive
│   │   │   ├── regions.ts                    # buildRegionEntries, areRegionsEqual, prettifyLabel
│   │   │   ├── file-ref.ts                   # normalizeFileKey, buildFigmaFileUrl
│   │   │   └── labels.ts                     # defaultLabels
│   │   └── hooks/
│   │       ├── use-local-origin.ts
│   │       ├── use-figma-capture.ts
│   │       ├── use-figma-regions.ts
│   │       └── use-figma-file-ref.ts
│   ├── react/
│   │   ├── FigmaCapturePanel.tsx
│   │   ├── FigmaTarget.tsx                   # <FigmaTarget> + figmaTarget()
│   │   ├── styles.ts                         # inline styles + CSS var helpers
│   │   └── components/
│   │       ├── ActionsRow.tsx
│   │       ├── FileRefField.tsx
│   │       ├── HiddenBar.tsx
│   │       └── RegionList.tsx
│   ├── next/
│   │   └── plugin.ts                         # withPittiquita()
│   └── vite/
│       └── plugin.ts                         # pittiquita()
├── tests/
│   ├── core/
│   │   ├── utils/
│   │   │   ├── capture.test.ts
│   │   │   ├── regions.test.ts
│   │   │   └── file-ref.test.ts
│   │   └── hooks/
│   │       ├── use-local-origin.test.ts
│   │       ├── use-figma-capture.test.ts
│   │       ├── use-figma-regions.test.ts
│   │       └── use-figma-file-ref.test.ts
│   └── react/
│       ├── FigmaTarget.test.tsx
│       └── FigmaCapturePanel.test.tsx
└── playground/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        └── App.tsx
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `pittiquita/package.json`
- Create: `pittiquita/tsconfig.json`
- Create: `pittiquita/tsup.config.ts`
- Create: `pittiquita/vitest.config.ts`
- Create: `pittiquita/.gitignore`

- [ ] **Step 1: Criar diretório e inicializar git**

```bash
mkdir -p ../pittiquita && cd ../pittiquita && git init
```

- [ ] **Step 2: Criar package.json**

```json
{
  "name": "pittiquita",
  "version": "0.0.1",
  "description": "React toolkit for capturing HTML components to Figma",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    },
    "./hooks": {
      "import": { "types": "./dist/hooks.d.mts", "default": "./dist/hooks.mjs" },
      "require": { "types": "./dist/hooks.d.cts", "default": "./dist/hooks.cjs" }
    },
    "./next": {
      "import": { "types": "./dist/next.d.mts", "default": "./dist/next.mjs" },
      "require": { "types": "./dist/next.d.cts", "default": "./dist/next.cjs" }
    },
    "./vite": {
      "import": { "types": "./dist/vite.d.mts", "default": "./dist/vite.mjs" },
      "require": { "types": "./dist/vite.d.cts", "default": "./dist/vite.cjs" }
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "pnpm run build"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "next": { "optional": true },
    "vite": { "optional": true }
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "jsdom": "^25.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  },
  "keywords": ["figma", "capture", "react", "devtools", "html-to-design"],
  "license": "MIT"
}
```

- [ ] **Step 3: Criar tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests", "playground"]
}
```

- [ ] **Step 4: Criar tsup.config.ts**

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    hooks: 'src/hooks.ts',
    next: 'src/next/plugin.ts',
    vite: 'src/vite/plugin.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'next', 'vite'],
})
```

- [ ] **Step 5: Criar vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
```

- [ ] **Step 6: Criar .gitignore**

```
node_modules/
dist/
*.tsbuildinfo
.DS_Store
```

- [ ] **Step 7: Instalar dependências**

```bash
pnpm install
```

- [ ] **Step 8: Verificar que compila**

```bash
pnpm typecheck
```
Expected: sem erros (ainda não há arquivos src).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "chore: scaffold pittiquita project"
```

---

## Task 2: Core Types

**Files:**
- Create: `src/core/types.ts`

- [ ] **Step 1: Criar src/core/types.ts**

```ts
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
```

- [ ] **Step 2: Verificar typecheck**

```bash
pnpm typecheck
```
Expected: PASS, sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/core/types.ts && git commit -m "feat: add core type definitions"
```

---

## Task 3: Core Utils — capture.ts

**Files:**
- Create: `src/core/utils/capture.ts`
- Create: `tests/core/utils/capture.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  CAPTURE_HASH_TOKEN,
  CAPTURE_SCRIPT_SRC,
  DEFAULT_CAPTURE_HASH,
  HELPER_ATTR,
  SELECTED_ATTR,
  STORAGE_FILE_REF_KEY,
  isLocalOrigin,
  isCaptureActive,
  enableCaptureHash,
  ensureCaptureScript,
} from '../../../src/core/utils/capture'

describe('capture constants', () => {
  it('exports expected constants', () => {
    expect(CAPTURE_SCRIPT_SRC).toBe(
      'https://mcp.figma.com/mcp/html-to-design/capture.js'
    )
    expect(CAPTURE_HASH_TOKEN).toBe('figmacapture=')
    expect(HELPER_ATTR).toBe('data-figma-helper')
    expect(SELECTED_ATTR).toBe('data-figma-selected')
    expect(STORAGE_FILE_REF_KEY).toBe('figma-file-ref')
    expect(DEFAULT_CAPTURE_HASH).toBe('figmacapture=manual')
  })
})

describe('isLocalOrigin', () => {
  it('returns true for localhost', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
    })
    expect(isLocalOrigin()).toBe(true)
  })

  it('returns true for 127.0.0.1', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: '127.0.0.1' },
      writable: true,
    })
    expect(isLocalOrigin()).toBe(true)
  })

  it('returns false for production host', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'app.example.com' },
      writable: true,
    })
    expect(isLocalOrigin()).toBe(false)
  })
})

describe('isCaptureActive', () => {
  it('returns true when hash contains capture token', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '#figmacapture=manual',
      writable: true,
    })
    expect(isCaptureActive()).toBe(true)
  })

  it('returns false when hash is empty', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '',
      writable: true,
    })
    expect(isCaptureActive()).toBe(false)
  })
})

describe('enableCaptureHash', () => {
  it('sets hash when not present', () => {
    Object.defineProperty(window.location, 'hash', {
      value: '',
      writable: true,
    })
    enableCaptureHash()
    expect(window.location.hash).toBe(DEFAULT_CAPTURE_HASH)
  })

  it('does not overwrite existing capture hash', () => {
    const existing = '#figmacapture=existing'
    Object.defineProperty(window.location, 'hash', {
      value: existing,
      writable: true,
    })
    enableCaptureHash()
    expect(window.location.hash).toBe(existing)
  })
})

describe('ensureCaptureScript', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', hash: '#figmacapture=manual' },
      writable: true,
    })
  })

  afterEach(() => {
    document.querySelectorAll('script[data-figma-capture-loader]').forEach(
      (el) => el.remove()
    )
  })

  it('injects script tag when capture is active on localhost', () => {
    ensureCaptureScript()
    const script = document.querySelector('script[data-figma-capture-loader]')
    expect(script).not.toBeNull()
    expect(script?.getAttribute('src')).toBe(CAPTURE_SCRIPT_SRC)
  })

  it('does not inject twice', () => {
    ensureCaptureScript()
    ensureCaptureScript()
    const scripts = document.querySelectorAll('script[data-figma-capture-loader]')
    expect(scripts.length).toBe(1)
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/utils/capture.test.ts
```
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar capture.ts**

```ts
/** URL do script oficial do Figma que captura o HTML da página. */
export const CAPTURE_SCRIPT_SRC =
  'https://mcp.figma.com/mcp/html-to-design/capture.js'

/** Token do hash da URL que indica modo de captura ativo. */
export const CAPTURE_HASH_TOKEN = 'figmacapture='

/** Atributo aplicado no container do helper para ele se auto-ignorar. */
export const HELPER_ATTR = 'data-figma-helper'

/** Atributo aplicado no elemento atualmente selecionado via painel. */
export const SELECTED_ATTR = 'data-figma-selected'

/** Chave do localStorage onde a URL/fileKey do Figma é persistida. */
export const STORAGE_FILE_REF_KEY = 'figma-file-ref'

/** Valor padrão do hash ao ativar o modo manual de captura. */
export const DEFAULT_CAPTURE_HASH = `${CAPTURE_HASH_TOKEN}manual`

/**
 * Retorna `true` quando o app está rodando em localhost/127.0.0.1.
 */
export const isLocalOrigin = (): boolean => {
  if (typeof window === 'undefined') return false
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )
}

/** Retorna `true` se o hash atual contém o token de captura. */
export const isCaptureActive = (): boolean =>
  typeof window !== 'undefined' &&
  window.location.hash.includes(CAPTURE_HASH_TOKEN)

/**
 * Liga o modo de captura escrevendo o token no hash da URL.
 * Não sobrescreve caso o token já esteja presente.
 */
export const enableCaptureHash = (): void => {
  if (typeof window === 'undefined') return
  if (window.location.hash.includes(CAPTURE_HASH_TOKEN)) return
  window.location.hash = DEFAULT_CAPTURE_HASH
}

/**
 * Injeta o script de captura do Figma no `<head>` quando o modo está ativo.
 * Idempotente: não injeta duas vezes nem fora do localhost.
 */
export const ensureCaptureScript = (): void => {
  if (typeof window === 'undefined' || !isLocalOrigin() || !isCaptureActive()) {
    return
  }

  if (document.querySelector('script[data-figma-capture-loader]')) {
    return
  }

  const script = document.createElement('script')
  script.src = CAPTURE_SCRIPT_SRC
  script.async = true
  script.dataset.figmaCaptureLoader = 'true'
  document.head.appendChild(script)
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/utils/capture.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/utils/capture.ts tests/core/utils/capture.test.ts
git commit -m "feat: add capture utilities with tests"
```

---

## Task 4: Core Utils — regions.ts

**Files:**
- Create: `src/core/utils/regions.ts`
- Create: `tests/core/utils/regions.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  prettifyLabel,
  buildRegionEntries,
  areRegionsEqual,
} from '../../../src/core/utils/regions'
import type { RegionEntry } from '../../../src/core/types'

describe('prettifyLabel', () => {
  it('converts kebab-case to Title Case', () => {
    expect(prettifyLabel('kpi-header')).toBe('Kpi Header')
  })

  it('converts snake_case to Title Case', () => {
    expect(prettifyLabel('kpi_header')).toBe('Kpi Header')
  })

  it('converts dot.case to Title Case', () => {
    expect(prettifyLabel('kpi.header.total')).toBe('Kpi Header Total')
  })

  it('trims and collapses whitespace', () => {
    expect(prettifyLabel('  kpi   header  ')).toBe('Kpi Header')
  })
})

describe('buildRegionEntries', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns empty array when no regions exist', () => {
    expect(buildRegionEntries()).toEqual([])
  })

  it('finds elements with data-figma-target', () => {
    document.body.innerHTML = '<div data-figma-target="header" style="width:100px;height:100px;">H</div>'
    const entries = buildRegionEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].label).toBe('Header')
  })

  it('finds elements with data-debug-layer', () => {
    document.body.innerHTML = '<div data-debug-layer="sidebar" style="width:100px;height:100px;">S</div>'
    const entries = buildRegionEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].label).toBe('Sidebar')
  })

  it('uses data-figma-label when present', () => {
    document.body.innerHTML =
      '<div data-figma-target="x" data-figma-label="Custom Label" style="width:100px;height:100px;">X</div>'
    const entries = buildRegionEntries()
    expect(entries[0].label).toBe('Custom Label')
  })

  it('ignores elements inside data-figma-helper', () => {
    document.body.innerHTML = `
      <div data-figma-helper="true">
        <div data-figma-target="inside" style="width:100px;height:100px;">I</div>
      </div>
      <div data-figma-target="outside" style="width:100px;height:100px;">O</div>
    `
    const entries = buildRegionEntries()
    expect(entries).toHaveLength(1)
    expect(entries[0].label).toBe('Outside')
  })

  it('deduplicates labels with counter suffix', () => {
    document.body.innerHTML = `
      <div data-figma-target="card" style="width:100px;height:100px;">1</div>
      <div data-figma-target="card" style="width:100px;height:100px;">2</div>
    `
    const entries = buildRegionEntries()
    expect(entries[0].label).toBe('Card')
    expect(entries[1].label).toBe('Card 2')
  })
})

describe('areRegionsEqual', () => {
  it('returns true for identical arrays', () => {
    const el = document.createElement('div')
    const regions: RegionEntry[] = [{ element: el, id: '1', label: 'A' }]
    expect(areRegionsEqual(regions, [...regions])).toBe(true)
  })

  it('returns false for different lengths', () => {
    expect(areRegionsEqual([], [{ element: document.createElement('div'), id: '1', label: 'A' }])).toBe(false)
  })

  it('returns false for different ids', () => {
    const el = document.createElement('div')
    const a: RegionEntry[] = [{ element: el, id: '1', label: 'A' }]
    const b: RegionEntry[] = [{ element: el, id: '2', label: 'A' }]
    expect(areRegionsEqual(a, b)).toBe(false)
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/utils/regions.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implementar regions.ts**

```ts
import type { RegionEntry } from '../types'
import { HELPER_ATTR } from './capture'

/**
 * Converte identificador em kebab/snake/dot-case para Title Case.
 */
export const prettifyLabel = (value: string): string =>
  value
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

/**
 * Verifica se o elemento tem área visível.
 */
const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return false
  const styles = window.getComputedStyle(element)
  return styles.display !== 'none' && styles.visibility !== 'hidden'
}

/**
 * Varre o DOM por elementos marcados com `data-figma-target` ou
 * `data-debug-layer`, filtra os visíveis, ordena por posição e
 * devolve a lista com labels únicos.
 */
export const buildRegionEntries = (): RegionEntry[] => {
  const matches = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-figma-target], [data-debug-layer]'
    )
  )

  const visibleElements = matches
    .filter(
      (element) =>
        !element.closest(`[${HELPER_ATTR}]`) && isElementVisible(element)
    )
    .sort((left, right) => {
      const leftRect = left.getBoundingClientRect()
      const rightRect = right.getBoundingClientRect()
      if (leftRect.top !== rightRect.top) return leftRect.top - rightRect.top
      return leftRect.left - rightRect.left
    })

  const counts = new Map<string, number>()

  return visibleElements.map((element, index) => {
    const source =
      element.dataset.figmaTarget ??
      element.dataset.debugLayer ??
      `region-${index + 1}`
    const rawLabel =
      element.dataset.figmaLabel ??
      element.dataset.debugLayer ??
      element.dataset.figmaTarget ??
      `region-${index + 1}`
    const baseLabel = prettifyLabel(rawLabel)
    const duplicateCount = (counts.get(baseLabel) ?? 0) + 1
    counts.set(baseLabel, duplicateCount)

    return {
      element,
      id: `${source}-${index + 1}`,
      label: duplicateCount === 1 ? baseLabel : `${baseLabel} ${duplicateCount}`,
    }
  })
}

/**
 * Compara duas listas de regiões em ordem e conteúdo.
 */
export const areRegionsEqual = (
  current: RegionEntry[],
  next: RegionEntry[]
): boolean => {
  if (current.length !== next.length) return false
  return current.every((region, index) => {
    const nextRegion = next[index]
    return (
      region.id === nextRegion.id &&
      region.label === nextRegion.label &&
      region.element === nextRegion.element
    )
  })
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/utils/regions.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/utils/regions.ts tests/core/utils/regions.test.ts
git commit -m "feat: add region discovery utilities with tests"
```

---

## Task 5: Core Utils — file-ref.ts

**Files:**
- Create: `src/core/utils/file-ref.ts`
- Create: `tests/core/utils/file-ref.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect } from 'vitest'

import {
  normalizeFileKey,
  buildFigmaFileUrl,
} from '../../../src/core/utils/file-ref'

describe('normalizeFileKey', () => {
  it('returns empty string for empty input', () => {
    expect(normalizeFileKey('')).toBe('')
    expect(normalizeFileKey('   ')).toBe('')
  })

  it('returns raw alphanumeric key as-is', () => {
    expect(normalizeFileKey('abc123XYZ')).toBe('abc123XYZ')
  })

  it('extracts key from figma design URL', () => {
    expect(
      normalizeFileKey('https://www.figma.com/design/ABC123/My-File')
    ).toBe('ABC123')
  })

  it('extracts key from figma file URL', () => {
    expect(
      normalizeFileKey('https://www.figma.com/file/XYZ789/My-File')
    ).toBe('XYZ789')
  })

  it('returns empty string for invalid URL', () => {
    expect(normalizeFileKey('not-a-url-or-key!@#')).toBe('')
  })

  it('trims whitespace', () => {
    expect(normalizeFileKey('  abc123  ')).toBe('abc123')
  })
})

describe('buildFigmaFileUrl', () => {
  it('builds canonical Figma URL', () => {
    expect(buildFigmaFileUrl('ABC123')).toBe(
      'https://www.figma.com/design/ABC123'
    )
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/utils/file-ref.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implementar file-ref.ts**

```ts
/**
 * Normaliza a entrada (URL completa do Figma ou fileKey puro)
 * e devolve o fileKey. Retorna string vazia quando não consegue extrair.
 */
export const normalizeFileKey = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  if (/^[A-Za-z0-9]+$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const segments = url.pathname.split('/').filter(Boolean)
    const designIndex = segments.findIndex(
      (segment) => segment === 'design' || segment === 'file'
    )
    if (designIndex >= 0 && typeof segments[designIndex + 1] === 'string') {
      return segments[designIndex + 1]
    }
  } catch {
    return ''
  }

  return ''
}

/** Monta a URL canônica do arquivo no Figma a partir do fileKey. */
export const buildFigmaFileUrl = (fileKey: string): string =>
  `https://www.figma.com/design/${fileKey}`
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/utils/file-ref.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/utils/file-ref.ts tests/core/utils/file-ref.test.ts
git commit -m "feat: add file-ref normalization utilities with tests"
```

---

## Task 6: Core Utils — labels.ts

**Files:**
- Create: `src/core/utils/labels.ts`

- [ ] **Step 1: Criar labels.ts**

```ts
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
```

- [ ] **Step 2: Verificar typecheck**

```bash
pnpm typecheck
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/core/utils/labels.ts
git commit -m "feat: add default labels with merge utility"
```

---

## Task 7: Core Hooks — useLocalOrigin

**Files:**
- Create: `src/core/hooks/use-local-origin.ts`
- Create: `tests/core/hooks/use-local-origin.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useLocalOrigin } from '../../../src/core/hooks/use-local-origin'

describe('useLocalOrigin', () => {
  it('returns true on localhost after mount', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
    })

    const { result } = renderHook(() => useLocalOrigin())
    expect(result.current).toBe(true)
  })

  it('returns false on production hostname', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'app.example.com' },
      writable: true,
    })

    const { result } = renderHook(() => useLocalOrigin())
    expect(result.current).toBe(false)
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/hooks/use-local-origin.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implementar use-local-origin.ts**

```ts
import { useEffect, useState } from 'react'

import { isLocalOrigin } from '../utils/capture'

/**
 * Detecta de forma SSR-safe se o app está em localhost.
 * Começa como `false` e atualiza no client após montagem.
 */
export const useLocalOrigin = (): boolean => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(isLocalOrigin())
  }, [])

  return ready
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/hooks/use-local-origin.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/hooks/use-local-origin.ts tests/core/hooks/use-local-origin.test.ts
git commit -m "feat: add useLocalOrigin hook with tests"
```

---

## Task 8: Core Hooks — useFigmaCapture

**Files:**
- Create: `src/core/hooks/use-figma-capture.ts`
- Create: `tests/core/hooks/use-figma-capture.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useFigmaCapture } from '../../../src/core/hooks/use-figma-capture'

describe('useFigmaCapture', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', hash: '' },
      writable: true,
    })
    document.querySelectorAll('script[data-figma-capture-loader]').forEach(
      (el) => el.remove()
    )
  })

  it('returns activate function', () => {
    const { result } = renderHook(() =>
      useFigmaCapture({ enabled: true })
    )
    expect(typeof result.current.activate).toBe('function')
  })

  it('does not inject script when disabled', () => {
    renderHook(() => useFigmaCapture({ enabled: false }))
    expect(document.querySelector('script[data-figma-capture-loader]')).toBeNull()
  })

  it('calls onHashChange on hashchange event', () => {
    const onHashChange = vi.fn()
    renderHook(() =>
      useFigmaCapture({ enabled: true, onHashChange })
    )

    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    expect(onHashChange).toHaveBeenCalled()
  })

  it('activate sets capture hash and injects script', () => {
    const { result } = renderHook(() =>
      useFigmaCapture({ enabled: true })
    )

    act(() => {
      result.current.activate()
    })

    expect(window.location.hash).toContain('figmacapture=')
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/hooks/use-figma-capture.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implementar use-figma-capture.ts**

```ts
import { useEffect } from 'react'

import { enableCaptureHash, ensureCaptureScript } from '../utils/capture'

export type UseFigmaCaptureOptions = {
  enabled?: boolean
  onHashChange?: () => void
}

export type UseFigmaCaptureResult = {
  activate: () => void
}

/**
 * Gerencia o ciclo de vida do modo de captura do Figma:
 *   - injeta o script quando o hash contém o token;
 *   - ouve `hashchange` para re-injetar e notificar;
 *   - expõe `activate()` para ligar o modo manualmente.
 */
export const useFigmaCapture = ({
  enabled = true,
  onHashChange,
}: UseFigmaCaptureOptions = {}): UseFigmaCaptureResult => {
  useEffect(() => {
    if (!enabled) return

    const sync = () => {
      ensureCaptureScript()
      onHashChange?.()
    }

    sync()
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
    }
  }, [enabled, onHashChange])

  return {
    activate: () => {
      enableCaptureHash()
      ensureCaptureScript()
    },
  }
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/hooks/use-figma-capture.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/hooks/use-figma-capture.ts tests/core/hooks/use-figma-capture.test.ts
git commit -m "feat: add useFigmaCapture hook with tests"
```

---

## Task 9: Core Hooks — useFigmaRegions

**Files:**
- Create: `src/core/hooks/use-figma-regions.ts`
- Create: `tests/core/hooks/use-figma-regions.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useFigmaRegions } from '../../../src/core/hooks/use-figma-regions'

describe('useFigmaRegions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns empty regions when disabled', () => {
    const { result } = renderHook(() =>
      useFigmaRegions({ enabled: false })
    )
    expect(result.current.regions).toEqual([])
  })

  it('discovers regions when enabled', async () => {
    document.body.innerHTML =
      '<div data-figma-target="header" style="width:100px;height:100px;">H</div>'

    const { result } = renderHook(() =>
      useFigmaRegions({ enabled: true })
    )

    // MutationObserver + rAF: aguardar próximo frame
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve))
    })

    expect(result.current.regions.length).toBeGreaterThanOrEqual(1)
  })

  it('refresh() re-scans the DOM', async () => {
    const { result } = renderHook(() =>
      useFigmaRegions({ enabled: true })
    )

    document.body.innerHTML =
      '<div data-figma-target="new-region" style="width:100px;height:100px;">N</div>'

    act(() => {
      result.current.refresh()
    })

    expect(result.current.regions).toHaveLength(1)
  })

  it('re-scans when pathname changes', async () => {
    const { result, rerender } = renderHook(
      ({ pathname }) => useFigmaRegions({ enabled: true, pathname }),
      { initialProps: { pathname: '/page-a' } }
    )

    document.body.innerHTML =
      '<div data-figma-target="region" style="width:100px;height:100px;">R</div>'

    rerender({ pathname: '/page-b' })

    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve))
    })

    expect(result.current.regions.length).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/hooks/use-figma-regions.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implementar use-figma-regions.ts**

```ts
import { useCallback, useEffect, useState } from 'react'

import type { RegionEntry } from '../types'
import { areRegionsEqual, buildRegionEntries } from '../utils/regions'

export type UseFigmaRegionsOptions = {
  enabled?: boolean
  pathname?: string | null
  searchKey?: string
}

export type UseFigmaRegionsResult = {
  regions: RegionEntry[]
  refresh: () => void
}

/**
 * Descobre e mantém atualizada a lista de regiões marcadas na página.
 *
 * Atualiza automaticamente via:
 *   1. MutationObserver (childList + subtree + atributos figma)
 *   2. popstate + hashchange (navegação SPA genérica)
 *   3. Mudança de pathname/searchKey (opt-in, para Next.js)
 *   4. Chamadas explícitas de refresh()
 */
export const useFigmaRegions = ({
  enabled = true,
  pathname,
  searchKey,
}: UseFigmaRegionsOptions = {}): UseFigmaRegionsResult => {
  const [regions, setRegions] = useState<RegionEntry[]>([])

  const refresh = useCallback(() => {
    const next = buildRegionEntries()
    setRegions((current) =>
      areRegionsEqual(current, next) ? current : next
    )
  }, [])

  // Refresh on pathname/searchKey changes (opt-in)
  useEffect(() => {
    if (!enabled) return
    const frameId = window.requestAnimationFrame(refresh)
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [enabled, pathname, searchKey, refresh])

  // MutationObserver for DOM changes
  useEffect(() => {
    if (!enabled) return

    let frameId: number | null = null

    const schedule = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        frameId = null
        refresh()
      })
    }

    const observer = new MutationObserver(schedule)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-debug-layer', 'data-figma-target', 'data-figma-label'],
    })

    return () => {
      observer.disconnect()
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [enabled, refresh])

  // popstate + hashchange for generic SPA navigation
  useEffect(() => {
    if (!enabled) return

    const handleNavigation = () => {
      window.requestAnimationFrame(refresh)
    }

    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('hashchange', handleNavigation)
    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [enabled, refresh])

  return { regions, refresh }
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/hooks/use-figma-regions.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/hooks/use-figma-regions.ts tests/core/hooks/use-figma-regions.test.ts
git commit -m "feat: add useFigmaRegions hook with tests"
```

---

## Task 10: Core Hooks — useFigmaFileRef

**Files:**
- Create: `src/core/hooks/use-figma-file-ref.ts`
- Create: `tests/core/hooks/use-figma-file-ref.test.ts`

- [ ] **Step 1: Escrever testes**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useFigmaFileRef } from '../../../src/core/hooks/use-figma-file-ref'
import { STORAGE_FILE_REF_KEY } from '../../../src/core/utils/capture'

describe('useFigmaFileRef', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with empty value', () => {
    const { result } = renderHook(() => useFigmaFileRef())
    expect(result.current.value).toBe('')
    expect(result.current.error).toBe('')
    expect(result.current.status).toBe('')
  })

  it('hydrates from localStorage', () => {
    window.localStorage.setItem(STORAGE_FILE_REF_KEY, 'https://figma.com/design/ABC')
    const { result } = renderHook(() => useFigmaFileRef())
    expect(result.current.value).toBe('https://figma.com/design/ABC')
  })

  it('uses custom storageKey', () => {
    window.localStorage.setItem('custom-key', 'XYZ')
    const { result } = renderHook(() =>
      useFigmaFileRef({ storageKey: 'custom-key' })
    )
    expect(result.current.value).toBe('XYZ')
  })

  it('setValue updates value and clears error', () => {
    const { result } = renderHook(() => useFigmaFileRef())

    act(() => {
      result.current.setValue('new-value')
    })

    expect(result.current.value).toBe('new-value')
    expect(result.current.error).toBe('')
  })

  it('openExistingFile sets error for invalid input', () => {
    const { result } = renderHook(() => useFigmaFileRef())

    act(() => {
      result.current.setValue('!!!invalid!!!')
    })

    act(() => {
      result.current.openExistingFile()
    })

    expect(result.current.error).not.toBe('')
  })

  it('openExistingFile persists valid key to localStorage', () => {
    const { result } = renderHook(() => useFigmaFileRef())

    // window.open stub
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    act(() => {
      result.current.setValue('ABC123')
    })

    act(() => {
      result.current.openExistingFile()
    })

    expect(window.localStorage.getItem(STORAGE_FILE_REF_KEY)).toBe('ABC123')
    expect(openSpy).toHaveBeenCalledWith(
      'https://www.figma.com/design/ABC123',
      '_blank',
      'noopener,noreferrer'
    )

    openSpy.mockRestore()
  })

  it('reset clears error and status', () => {
    const { result } = renderHook(() => useFigmaFileRef())

    act(() => {
      result.current.setValue('!!!invalid!!!')
    })
    act(() => {
      result.current.openExistingFile()
    })
    act(() => {
      result.current.reset()
    })

    expect(result.current.error).toBe('')
    expect(result.current.status).toBe('')
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/core/hooks/use-figma-file-ref.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implementar use-figma-file-ref.ts**

```ts
import { useCallback, useEffect, useState } from 'react'

import { STORAGE_FILE_REF_KEY } from '../utils/capture'
import { buildFigmaFileUrl, normalizeFileKey } from '../utils/file-ref'
import { defaultLabels } from '../utils/labels'

export type UseFigmaFileRefOptions = {
  storageKey?: string
  initialValue?: string
}

export type UseFigmaFileRefResult = {
  value: string
  error: string
  status: string
  setValue: (next: string) => void
  clearStatus: () => void
  openExistingFile: () => void
  reset: () => void
}

/**
 * Hook do campo "Arquivo no Figma".
 * Hidrata do localStorage, valida URL/fileKey, abre em nova aba.
 */
export const useFigmaFileRef = (
  options?: UseFigmaFileRefOptions
): UseFigmaFileRefResult => {
  const storageKey = options?.storageKey ?? STORAGE_FILE_REF_KEY

  const [value, setValueState] = useState(options?.initialValue ?? '')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (options?.initialValue !== undefined) return
    setValueState(window.localStorage.getItem(storageKey) ?? '')
  }, [storageKey, options?.initialValue])

  const setValue = useCallback(
    (next: string) => {
      setValueState(next)
      if (error) setError('')
      if (status) setStatus('')
    },
    [error, status]
  )

  const clearStatus = useCallback(() => setStatus(''), [])

  const openExistingFile = useCallback(() => {
    const fileKey = normalizeFileKey(value)

    if (!fileKey) {
      setError(defaultLabels.fileRefInvalid)
      setStatus('')
      return
    }

    setError('')

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, value.trim())
      window.open(buildFigmaFileUrl(fileKey), '_blank', 'noopener,noreferrer')
    }

    setStatus(defaultLabels.fileOpened)
  }, [value, storageKey])

  const reset = useCallback(() => {
    setError('')
    setStatus('')
  }, [])

  return { value, error, status, setValue, clearStatus, openExistingFile, reset }
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/core/hooks/use-figma-file-ref.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/hooks/use-figma-file-ref.ts tests/core/hooks/use-figma-file-ref.test.ts
git commit -m "feat: add useFigmaFileRef hook with tests"
```

---

## Task 11: Entry point — hooks.ts

**Files:**
- Create: `src/hooks.ts`

- [ ] **Step 1: Criar src/hooks.ts**

```ts
// Hooks
export { useLocalOrigin } from './core/hooks/use-local-origin'
export { useFigmaCapture } from './core/hooks/use-figma-capture'
export { useFigmaRegions } from './core/hooks/use-figma-regions'
export { useFigmaFileRef } from './core/hooks/use-figma-file-ref'

// Hook types
export type { UseFigmaCaptureOptions, UseFigmaCaptureResult } from './core/hooks/use-figma-capture'
export type { UseFigmaRegionsOptions, UseFigmaRegionsResult } from './core/hooks/use-figma-regions'
export type { UseFigmaFileRefOptions, UseFigmaFileRefResult } from './core/hooks/use-figma-file-ref'

// Utils
export { normalizeFileKey, buildFigmaFileUrl } from './core/utils/file-ref'
export { buildRegionEntries, areRegionsEqual, prettifyLabel } from './core/utils/regions'
export { isLocalOrigin, isCaptureActive, ensureCaptureScript, enableCaptureHash } from './core/utils/capture'

// Labels
export { defaultLabels, mergeLabels } from './core/utils/labels'

// Types
export type { RegionEntry, PittiquitaLabels } from './core/types'
```

- [ ] **Step 2: Verificar typecheck**

```bash
pnpm typecheck
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/hooks.ts
git commit -m "feat: add hooks entry point with re-exports"
```

---

## Task 12: React — FigmaTarget + figmaTarget()

**Files:**
- Create: `src/react/FigmaTarget.tsx`
- Create: `tests/react/FigmaTarget.test.tsx`

- [ ] **Step 1: Escrever testes**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { FigmaTarget, figmaTarget } from '../../src/react/FigmaTarget'

describe('FigmaTarget', () => {
  it('renders children with data-figma-target attribute', () => {
    render(
      <FigmaTarget name="header">
        <span>Hello</span>
      </FigmaTarget>
    )

    const wrapper = screen.getByText('Hello').parentElement!
    expect(wrapper.getAttribute('data-figma-target')).toBe('header')
  })

  it('sets data-figma-label from label prop', () => {
    render(
      <FigmaTarget name="header" label="Main Header">
        <span>Hello</span>
      </FigmaTarget>
    )

    const wrapper = screen.getByText('Hello').parentElement!
    expect(wrapper.getAttribute('data-figma-label')).toBe('Main Header')
  })

  it('auto-generates label from name via prettifyLabel', () => {
    render(
      <FigmaTarget name="kpi-header">
        <span>Hello</span>
      </FigmaTarget>
    )

    const wrapper = screen.getByText('Hello').parentElement!
    expect(wrapper.getAttribute('data-figma-label')).toBe('Kpi Header')
  })

  it('renders custom element via as prop', () => {
    render(
      <FigmaTarget name="nav" as="nav">
        <span>Navigation</span>
      </FigmaTarget>
    )

    const nav = screen.getByText('Navigation').parentElement!
    expect(nav.tagName).toBe('NAV')
  })
})

describe('figmaTarget', () => {
  it('returns data attributes object', () => {
    const attrs = figmaTarget('sidebar')
    expect(attrs).toEqual({
      'data-figma-target': 'sidebar',
      'data-figma-label': 'Sidebar',
    })
  })

  it('uses custom label when provided', () => {
    const attrs = figmaTarget('sidebar', { label: 'Side Panel' })
    expect(attrs).toEqual({
      'data-figma-target': 'sidebar',
      'data-figma-label': 'Side Panel',
    })
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/react/FigmaTarget.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implementar FigmaTarget.tsx**

```tsx
import { createElement, type ElementType, type ReactNode } from 'react'

import { prettifyLabel } from '../core/utils/regions'

export type FigmaTargetProps = {
  name: string
  label?: string
  as?: ElementType
  children: ReactNode
}

/**
 * Componente wrapper que marca um elemento no DOM para captura pelo Figma.
 */
export function FigmaTarget({
  name,
  label,
  as: Component = 'div',
  children,
}: FigmaTargetProps) {
  return createElement(
    Component,
    {
      'data-figma-target': name,
      'data-figma-label': label ?? prettifyLabel(name),
    },
    children
  )
}

/**
 * Retorna data-attributes para marcar um elemento sem wrapper extra.
 *
 * @example
 * <div {...figmaTarget('kpi-header', { label: 'KPI Header' })}>
 */
export function figmaTarget(
  name: string,
  options?: { label?: string }
): Record<string, string> {
  return {
    'data-figma-target': name,
    'data-figma-label': options?.label ?? prettifyLabel(name),
  }
}
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/react/FigmaTarget.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/react/FigmaTarget.tsx tests/react/FigmaTarget.test.tsx
git commit -m "feat: add FigmaTarget component and figmaTarget utility with tests"
```

---

## Task 13: React — Styles

**Files:**
- Create: `src/react/styles.ts`

- [ ] **Step 1: Criar src/react/styles.ts**

```ts
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
```

- [ ] **Step 2: Verificar typecheck**

```bash
pnpm typecheck
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/react/styles.ts
git commit -m "feat: add inline styles with CSS variable support"
```

---

## Task 14: React — Subcomponentes

**Files:**
- Create: `src/react/components/ActionsRow.tsx`
- Create: `src/react/components/FileRefField.tsx`
- Create: `src/react/components/HiddenBar.tsx`
- Create: `src/react/components/RegionList.tsx`

- [ ] **Step 1: Criar ActionsRow.tsx**

```tsx
import { actionsGridStyle, buttonAccentStyle, buttonBaseStyle } from '../styles'

type ActionsRowProps = {
  labels: { activateCapture: string; reset: string }
  className?: string
  onActivate: () => void
  onReset: () => void
}

export function ActionsRow({ labels, className, onActivate, onReset }: ActionsRowProps) {
  return (
    <div style={actionsGridStyle} className={className}>
      <button type="button" style={buttonAccentStyle} onClick={onActivate}>
        {labels.activateCapture}
      </button>
      <button type="button" style={buttonBaseStyle} onClick={onReset}>
        {labels.reset}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Criar FileRefField.tsx**

```tsx
import { errorStyle, fileRowStyle, inputStyle, sectionStyle, textTitle, buttonBaseStyle } from '../styles'

type FileRefFieldProps = {
  labels: {
    fileSectionTitle: string
    fileRefLabel: string
    fileRefPlaceholder: string
    openTooltip: string
  }
  value: string
  error: string
  className?: string
  onChange: (next: string) => void
  onOpen: () => void
}

export function FileRefField({
  labels,
  value,
  error,
  className,
  onChange,
  onOpen,
}: FileRefFieldProps) {
  return (
    <div style={sectionStyle} className={className}>
      <p style={textTitle}>{labels.fileSectionTitle}</p>
      <div style={fileRowStyle}>
        <input
          type="text"
          aria-label={labels.fileRefLabel}
          style={{
            ...inputStyle,
            ...(error ? { borderColor: '#e53e3e' } : {}),
          }}
          value={value}
          placeholder={labels.fileRefPlaceholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          style={buttonBaseStyle}
          title={labels.openTooltip}
          onClick={onOpen}
        >
          ↗
        </button>
      </div>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  )
}
```

- [ ] **Step 3: Criar HiddenBar.tsx**

```tsx
import type { PanelPosition } from '../../core/types'
import { buttonAccentStyle, hiddenBarStyle } from '../styles'

type HiddenBarProps = {
  labels: { show: string }
  position: PanelPosition
  className?: string
  onShow: () => void
}

export function HiddenBar({ labels, position, className, onShow }: HiddenBarProps) {
  return (
    <div
      style={hiddenBarStyle(position)}
      className={className}
      data-figma-helper="true"
    >
      <button type="button" style={buttonAccentStyle} onClick={onShow}>
        {labels.show}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Criar RegionList.tsx**

```tsx
import type { RegionEntry } from '../../core/types'
import { buttonAccentStyle, buttonBaseStyle, regionListStyle, sectionStyle, textMuted, textSmall, textTitle } from '../styles'

type RegionListProps = {
  labels: {
    regionsTitle: string
    regionsCount: (count: number) => string
    regionsEmpty: string
  }
  regions: RegionEntry[]
  selectedId: string | null
  className?: string
  onSelect: (region: RegionEntry) => void
}

export function RegionList({
  labels,
  regions,
  selectedId,
  className,
  onSelect,
}: RegionListProps) {
  return (
    <div style={sectionStyle} className={className}>
      <p style={textTitle}>{labels.regionsTitle}</p>
      <p style={textMuted}>{labels.regionsCount(regions.length)}</p>

      {regions.length > 0 ? (
        <div style={regionListStyle}>
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              style={selectedId === region.id ? buttonAccentStyle : buttonBaseStyle}
              onClick={() => onSelect(region)}
            >
              {region.label}
            </button>
          ))}
        </div>
      ) : (
        <p style={textSmall}>{labels.regionsEmpty}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Verificar typecheck**

```bash
pnpm typecheck
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/react/components/
git commit -m "feat: add panel subcomponents (ActionsRow, FileRefField, HiddenBar, RegionList)"
```

---

## Task 15: React — FigmaCapturePanel

**Files:**
- Create: `src/react/FigmaCapturePanel.tsx`
- Create: `tests/react/FigmaCapturePanel.test.tsx`

- [ ] **Step 1: Escrever testes**

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { FigmaCapturePanel } from '../../src/react/FigmaCapturePanel'

describe('FigmaCapturePanel', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost', hash: '' },
      writable: true,
    })
    window.localStorage.clear()
    document.body.innerHTML = ''
  })

  it('renders nothing on non-localhost', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'app.example.com', hash: '' },
      writable: true,
    })

    const { container } = render(<FigmaCapturePanel />)
    expect(container.innerHTML).toBe('')
  })

  it('renders panel on localhost', () => {
    render(<FigmaCapturePanel />)
    expect(screen.getByText('Figma Capture')).toBeTruthy()
  })

  it('applies custom labels', () => {
    render(<FigmaCapturePanel labels={{ panelTitle: 'Custom Title' }} />)
    expect(screen.getByText('Custom Title')).toBeTruthy()
  })

  it('hides and shows via hide/show buttons', () => {
    render(<FigmaCapturePanel />)

    fireEvent.click(screen.getByText('Hide'))
    expect(screen.queryByText('Figma Capture')).toBeNull()
    expect(screen.getByText('Figma')).toBeTruthy()

    fireEvent.click(screen.getByText('Figma'))
    expect(screen.getByText('Figma Capture')).toBeTruthy()
  })

  it('applies custom className', () => {
    render(<FigmaCapturePanel className="my-custom-class" />)
    const panel = screen.getByText('Figma Capture').closest('[data-figma-helper]')!
    expect(panel.classList.contains('my-custom-class')).toBe(true)
  })

  it('applies theme as CSS variables', () => {
    render(<FigmaCapturePanel theme={{ accentColor: '#ff0000' }} />)
    const panel = screen.getByText('Figma Capture').closest('[data-figma-helper]') as HTMLElement
    expect(panel.style.getPropertyValue('--pittiquita-accent')).toBe('#ff0000')
  })
})
```

- [ ] **Step 2: Rodar testes para verificar falha**

```bash
pnpm test:run -- tests/react/FigmaCapturePanel.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implementar FigmaCapturePanel.tsx**

```tsx
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
  const { activate } = useFigmaCapture({ enabled: ready, onHashChange: refresh })
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
```

- [ ] **Step 4: Rodar testes**

```bash
pnpm test:run -- tests/react/FigmaCapturePanel.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/react/FigmaCapturePanel.tsx tests/react/FigmaCapturePanel.test.tsx
git commit -m "feat: add FigmaCapturePanel component with tests"
```

---

## Task 16: Entry point — index.ts

**Files:**
- Create: `src/index.ts`

- [ ] **Step 1: Criar src/index.ts**

```ts
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
```

- [ ] **Step 2: Build completo**

```bash
pnpm build
```
Expected: gera `dist/` com `index.mjs`, `index.cjs`, `hooks.mjs`, `hooks.cjs` + tipos.

- [ ] **Step 3: Rodar todos os testes**

```bash
pnpm test:run
```
Expected: todos PASS.

- [ ] **Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: add main entry point with full re-exports"
```

---

## Task 17: Plugin Vite

**Files:**
- Create: `src/vite/plugin.ts`

- [ ] **Step 1: Criar src/vite/plugin.ts**

```ts
import type { Plugin } from 'vite'

import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'

type PittiquitaViteOptions = Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>

const VIRTUAL_MODULE_ID = 'virtual:pittiquita'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/**
 * Plugin Vite que injeta automaticamente o <FigmaCapturePanel>
 * em mode development. Zero overhead em produção.
 */
export function pittiquita(options: PittiquitaViteOptions = {}): Plugin {
  return {
    name: 'pittiquita',
    apply: 'serve', // só em dev

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return

      const propsJson = JSON.stringify(options, (_, value) => {
        // funções (como regionsCount) não serializam; usar defaults
        if (typeof value === 'function') return undefined
        return value
      })

      return `
        import { createElement } from 'react'
        import { createRoot } from 'react-dom/client'
        import { FigmaCapturePanel } from 'pittiquita'

        const container = document.createElement('div')
        container.id = 'pittiquita-root'
        document.body.appendChild(container)

        const root = createRoot(container)
        root.render(createElement(FigmaCapturePanel, ${propsJson}))
      `
    },

    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module', src: VIRTUAL_MODULE_ID },
          injectTo: 'body',
        },
      ]
    },
  }
}
```

- [ ] **Step 2: Build**

```bash
pnpm build
```
Expected: `dist/vite.mjs` e `dist/vite.cjs` gerados.

- [ ] **Step 3: Commit**

```bash
git add src/vite/plugin.ts
git commit -m "feat: add Vite plugin for auto-inject in dev mode"
```

---

## Task 18: Plugin Next.js

**Files:**
- Create: `src/next/plugin.ts`

- [ ] **Step 1: Criar src/next/plugin.ts**

```ts
import type { FigmaCapturePanelProps } from '../react/FigmaCapturePanel'

type PittiquitaNextOptions = Omit<FigmaCapturePanelProps, 'pathname' | 'searchKey'>

type NextConfig = Record<string, unknown> & {
  webpack?: (config: Record<string, unknown>, context: Record<string, unknown>) => Record<string, unknown>
}

/**
 * Wrapper para next.config que injeta <FigmaCapturePanel> em dev.
 * Em produção, retorna a config inalterada.
 *
 * @example
 * // next.config.ts
 * import { withPittiquita } from 'pittiquita/next'
 * export default withPittiquita(nextConfig, { position: 'bottom-left' })
 */
export function withPittiquita(
  nextConfig: NextConfig = {},
  options: PittiquitaNextOptions = {}
): NextConfig {
  if (process.env.NODE_ENV !== 'development') return nextConfig

  const propsJson = JSON.stringify(options, (_, value) => {
    if (typeof value === 'function') return undefined
    return value
  })

  const originalWebpack = nextConfig.webpack

  return {
    ...nextConfig,
    webpack(config: Record<string, unknown>, context: Record<string, unknown>) {
      const resolvedConfig = originalWebpack
        ? originalWebpack(config, context)
        : config

      // Injeta o script de bootstrap via webpack plugin
      const entry = resolvedConfig.entry as () => Promise<Record<string, string[]>>

      resolvedConfig.entry = async () => {
        const entries = await entry()

        // Adiciona o bootstrap ao entry point do client
        const clientEntry = entries['main-app'] ?? entries['main']
        if (clientEntry && !clientEntry.includes('pittiquita')) {
          // O bootstrap será injetado via custom document/layout
          // Next.js App Router: usar layout.tsx wrapping
        }

        return entries
      }

      return resolvedConfig
    },
  }
}
```

> **Nota:** O plugin Next.js tem complexidade adicional por causa do App Router vs Pages Router. A abordagem mais pragmática para v1 é documentar o uso manual:
>
> ```tsx
> // app/layout.tsx
> import { FigmaCapturePanel } from 'pittiquita'
>
> export default function RootLayout({ children }) {
>   return (
>     <html>
>       <body>
>         {children}
>         {process.env.NODE_ENV === 'development' && <FigmaCapturePanel />}
>       </body>
>     </html>
>   )
> }
> ```
>
> O `withPittiquita()` wrapper pode evoluir em versões futuras. Na v1, ele age como um pass-through com setup helpers.

- [ ] **Step 2: Build**

```bash
pnpm build
```
Expected: `dist/next.mjs` e `dist/next.cjs` gerados.

- [ ] **Step 3: Commit**

```bash
git add src/next/plugin.ts
git commit -m "feat: add Next.js plugin wrapper"
```

---

## Task 19: Playground

**Files:**
- Create: `playground/package.json`
- Create: `playground/index.html`
- Create: `playground/vite.config.ts`
- Create: `playground/src/main.tsx`
- Create: `playground/src/App.tsx`

- [ ] **Step 1: Criar playground/package.json**

```json
{
  "name": "pittiquita-playground",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "pittiquita": "link:.."
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Criar playground/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>pittiquita playground</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 3: Criar playground/vite.config.ts**

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

- [ ] **Step 4: Criar playground/src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 5: Criar playground/src/App.tsx**

```tsx
import { FigmaTarget, figmaTarget } from 'pittiquita'

export function App() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>pittiquita playground</h1>

      <FigmaTarget name="hero-section" label="Hero">
        <section style={{ padding: '32px', background: '#f7fafc', borderRadius: '12px' }}>
          <h2>Hero Section</h2>
          <p>Esta seção está marcada com FigmaTarget.</p>
        </section>
      </FigmaTarget>

      <div style={{ marginTop: '24px' }} {...figmaTarget('stats-cards', { label: 'Stats' })}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#edf2f7', borderRadius: '8px' }}>Card 1</div>
          <div style={{ padding: '16px', background: '#edf2f7', borderRadius: '8px' }}>Card 2</div>
          <div style={{ padding: '16px', background: '#edf2f7', borderRadius: '8px' }}>Card 3</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Instalar e rodar playground**

```bash
cd playground && pnpm install && pnpm dev
```
Expected: app abre em localhost, painel pittiquita aparece no canto inferior direito, 2 regiões visíveis (Hero, Stats).

- [ ] **Step 7: Commit**

```bash
git add playground/
git commit -m "feat: add playground app for development and demo"
```

---

## Task 20: Build final e verificação

**Files:** Nenhum novo.

- [ ] **Step 1: Build completo**

```bash
pnpm build
```
Expected: `dist/` contém `index.mjs`, `index.cjs`, `index.d.mts`, `index.d.cts`, `hooks.*`, `next.*`, `vite.*`.

- [ ] **Step 2: Rodar todos os testes**

```bash
pnpm test:run
```
Expected: todos PASS.

- [ ] **Step 3: Verificar typecheck**

```bash
pnpm typecheck
```
Expected: PASS.

- [ ] **Step 4: Verificar exports do pacote**

```bash
node -e "const pkg = require('./package.json'); console.log(Object.keys(pkg.exports))"
```
Expected: `['.', './hooks', './next', './vite']`

- [ ] **Step 5: Verificar que dist contém todos os entry points**

```bash
ls dist/
```
Expected: `index.mjs`, `index.cjs`, `hooks.mjs`, `hooks.cjs`, `next.mjs`, `next.cjs`, `vite.mjs`, `vite.cjs` + `.d.mts`/`.d.cts` para cada.

- [ ] **Step 6: Commit tag de versão**

```bash
git tag v0.0.1
git commit --allow-empty -m "chore: ready for v0.0.1"
```
