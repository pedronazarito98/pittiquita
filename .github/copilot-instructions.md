# Copilot Instructions — pittiquita

React toolkit for capturing HTML components to Figma via the [HTML to Design](https://www.figma.com/community/plugin/1159123024924461424) plugin. Dev-only (localhost guard) with zero production overhead.

## Commands

```bash
pnpm build          # tsup → dist/ (ESM + CJS + .d.ts)
pnpm dev            # tsup --watch
pnpm test           # vitest (watch mode)
pnpm test:run       # vitest run (CI, single pass)
pnpm lint           # eslint src/
pnpm typecheck      # tsc --noEmit
```

Run a single test file:

```bash
pnpm vitest run tests/core/utils/regions.test.ts
```

The playground (`playground/`) is a Vite app linked to the root package. Build the library first (`pnpm build` at root), then `cd playground && pnpm dev`.

## Architecture

Four entry points, each a separate tsup bundle:

| Import | Source | Purpose |
|---|---|---|
| `pittiquita` | `src/index.ts` | Components + hooks + utils + types |
| `pittiquita/hooks` | `src/hooks.ts` | Headless hooks + utils only (no React components) |
| `pittiquita/vite` | `src/vite/plugin.ts` | Vite plugin — auto-injects panel via virtual module in dev |
| `pittiquita/next` | `src/next/plugin.ts` | Next.js `withPittiquita()` config wrapper |

### Layer separation

```
src/core/          Pure TypeScript — no React dependency
  utils/           Stateless functions (capture, regions, file-ref, labels)
  hooks/           React hooks that compose utils (use-figma-capture, use-figma-regions, etc.)
  types.ts         Shared types (RegionEntry, PittiquitaTheme, PittiquitaLabels, etc.)

src/react/         React presentation layer — depends on core
  FigmaTarget.tsx       Wrapper component + figmaTarget() spread helper
  FigmaCapturePanel.tsx Main floating panel (composes all hooks + sub-components)
  components/           ActionsRow, FileRefField, HiddenBar, RegionList
  styles.ts             Inline styles + CSS variable system (--pittiquita-*)
```

Core is headless and framework-agnostic. React layer wraps core hooks into components. Keep this separation — new logic goes into `core/`, new UI into `react/`.

### Key mechanisms

- **Region discovery**: `buildRegionEntries()` scans DOM for `data-figma-target` and `data-debug-layer` attributes. `useFigmaRegions` keeps the list live via `MutationObserver` + `requestAnimationFrame` debouncing.
- **Capture activation**: `enableCaptureHash()` writes a token to `location.hash`, then `ensureCaptureScript()` idempotently injects the Figma capture loader script (only on localhost).
- **Localhost guard**: `isLocalOrigin()` gates all dev features. `useLocalOrigin()` is the SSR-safe hook wrapper (starts `false`, updates after mount).
- **Vite plugin**: Serves a `virtual:pittiquita` module that mounts `<FigmaCapturePanel>` into a shadow root. Only active in `apply: 'serve'` (dev).

## Conventions

### Naming

- Files: `kebab-case.ts` (e.g., `use-figma-capture.ts`, `file-ref.ts`)
- Components: `PascalCase` files and exports
- Data attributes: `data-figma-target`, `data-figma-label`, `data-figma-helper`
- CSS variables: `--pittiquita-*` prefix
- Storage keys: `STORAGE_FILE_REF_KEY` constant in `capture.ts`

### Styling

No CSS files or UI library. All styles are inline objects + CSS custom properties defined in `styles.ts`. Theme customization flows through `themeToVars()` which maps `PittiquitaTheme` fields to `--pittiquita-*` variables. Consumers can also override via `classNames` prop slots.

### Testing

Tests mirror `src/` structure under `tests/`. Vitest + `@testing-library/react` + jsdom.

- **Hooks**: `renderHook()` + `act()`. Mock `window.location` via `Object.defineProperty` (writable). Clean up injected scripts/DOM in `afterEach`.
- **Utils**: Direct function calls, DOM setup via `document.createElement`.
- **Components**: `render()` + `screen` queries, assert on data attributes and DOM structure.

### Types

All public API types are exported from `src/core/types.ts` and hook files. Props types are co-located with their component (`FigmaCapturePanelProps`, `FigmaTargetProps`). Use explicit type exports (`export type { ... }`).

### React patterns

- Functional components only, no classes
- `useCallback` for all handler functions passed as props or deps
- Early-return `null` from components when `useLocalOrigin()` is `false`
- `mergeLabels()` for partial i18n overrides with deep merge on `instructions`
