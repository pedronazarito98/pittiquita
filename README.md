<div align="center">
  <img src="https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/logo.svg" width="132" alt="pittiquita sleeping cat mascot" />
  <h1>pittiquita</h1>
  <p>
    <strong>Capture live React UI states running on localhost and bring them into Figma through HTML to Design.</strong>
  </p>
  <p>
    A focused development tool for engineers and designers who need the rendered product—not a screenshot—to continue the design loop.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm version" src="https://img.shields.io/npm/v/pittiquita?color=6366f1&style=flat-square" /></a>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm downloads" src="https://img.shields.io/npm/dm/pittiquita?color=0ea5e9&style=flat-square" /></a>
    <a href="https://bundlephobia.com/package/pittiquita"><img alt="minified and gzipped bundle size" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip&color=22c55e&style=flat-square" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml"><img alt="CI status" src="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml/badge.svg" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/npm/l/pittiquita?color=111827&style=flat-square" /></a>
  </p>
  <p>
    English · <a href="https://github.com/pedronazarito98/pittiquita/blob/main/docs/README.pt-BR.md">Português</a>
  </p>
  <p>
    <a href="#demo">Demo</a> ·
    <a href="#installation">Install</a> ·
    <a href="https://github.com/pedronazarito98/pittiquita/tree/main/docs/guides">Guides</a> ·
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/docs/architecture/overview.md">Architecture</a> ·
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/SECURITY.md">Security</a>
  </p>
</div>

---

## At a glance

`pittiquita` adds a capture panel to a local React application. It discovers named regions, enables the capture hash, loads the external HTML to Design capture script, and prepares the browser URL for the independent HTML to Design Figma plugin.

```text
React app on localhost
  → pittiquita panel, framework adapter, or headless hooks
  → #figmacapture=manual + capture script
  → copy the browser URL
  → HTML to Design
  → editable Figma layers
```

| Built for | What it contributes |
| --- | --- |
| UI implementation reviews | Uses the state actually rendered by the browser: props, CSS, data, layout, and visible interaction state. |
| Design-to-code-to-design loops | Makes the return path from a working React screen to Figma explicit and repeatable. |
| Dense pages | Lets teams name useful regions and navigate to them from the panel. |
| Local development | Hides the capture UI outside `localhost` and `127.0.0.1`; the Vite adapter is serve-only. |

> [!IMPORTANT]
> `pittiquita` is an independent developer tool. It is not affiliated with, endorsed by, or an official product of Figma. The final import is performed by the separate HTML to Design plugin.

## Demo

The checked-in walkthrough shows the real local panel and an explicitly illustrative final handoff step.

![Animated pittiquita flow from the local playground to the illustrative HTML to Design handoff](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/pittiquita-flow.gif)

> The animation is generated from the local playground. Its final Figma screen is an explicitly labeled local mock, not a recorded import.

| Panel on localhost | Capture mode active |
| --- | --- |
| ![pittiquita panel running in the local playground](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/01-localhost-panel.png) | ![pittiquita after enabling the capture hash](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/02-capture-active.png) |

| Browser URL ready to copy | Illustrative HTML to Design step |
| --- | --- |
| ![browser URL with the pittiquita capture hash](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/03-copy-url.png) | ![local mock that illustrates where to paste the URL in HTML to Design](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/04-figma-import-step.png) |

See the [demo notes](https://github.com/pedronazarito98/pittiquita/tree/main/docs/demo) for generation, validation, media budgets, and the mock boundary.

## Why it exists

Once implementation starts, the browser becomes the only place where component props, real CSS, realistic data, responsive constraints, loading states, error states, and interaction state coexist.

Common workarounds lose useful information:

| Workaround | Limitation |
| --- | --- |
| Screenshot | Preserves pixels, but not editable structure. |
| Copy HTML manually | Requires DOM inspection and is easy to repeat inconsistently. |
| Rebuild the state in Figma | Duplicates work and can miss implementation decisions. |
| Share source code only | Does not communicate the exact rendered state. |

`pittiquita` keeps the scope deliberately narrow: prepare a live local React state for an editable design handoff without operating a backend, proxy, account system, or Figma API integration.

## What it does

- Renders an accessible capture panel in a local React tree.
- Enables `#figmacapture=manual` without duplicating an existing capture token.
- Loads the HTML to Design capture script only when capture mode is active on an accepted local hostname.
- Discovers visible elements marked with `data-figma-target` or legacy-compatible `data-debug-layer`.
- Scrolls to named regions and exposes the selected state through `data-figma-selected`.
- Exposes headless hooks for custom interfaces.
- Provides a serve-only Vite plugin with automatic, HMR-safe mounting.
- Provides a route-aware Client Component for Next.js App Router.
- Publishes ESM, CommonJS, and TypeScript declarations through four public entry points.

## Installation

React 18 or newer and React DOM 18 or newer are peer dependencies.

```bash
pnpm add -D pittiquita
```

Equivalent commands:

```bash
npm install --save-dev pittiquita
yarn add --dev pittiquita
```

Installing it as a development dependency communicates the intended usage. Runtime guards do not universally guarantee bundle-byte removal, so use the environment boundary provided by your application or framework.

## React quick start

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function App() {
  return (
    <>
      <YourApplication />
      <FigmaCapturePanel />
    </>
  )
}
```

Open the app on `localhost` or `127.0.0.1`. On other hostnames, the panel returns `null` after the client-side origin check.

The panel supports positioning, theme and label overrides, CSP/SRI attributes, callbacks, keyboard interaction, semantic status announcements, and slot class names:

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function DevelopmentTools() {
  return (
    <FigmaCapturePanel
      position="bottom-left"
      labels={{
        panelTitle: 'Design handoff',
        activateCapture: 'Prepare URL',
      }}
      onRegionSelect={(region) => console.info(region.id)}
    />
  )
}
```

See the [React guide](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/react.md).

## Vite

The dedicated Vite plugin mounts the panel only during `vite dev`:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

The plugin declares `apply: 'serve'`, reuses its mount during development, and cleans it up during hot-module replacement. Plugin options must be serializable; render `FigmaCapturePanel` manually when you need function props such as callbacks.

See the [Vite guide](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/vite.md).

## Next.js App Router

Use the route-aware Client Component exported by `pittiquita/next`:

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { PittiquitaNextPanel } from 'pittiquita/next'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PittiquitaNextPanel />
      </body>
    </html>
  )
}
```

`PittiquitaNextPanel` already contains the client boundary, reads `usePathname()`, refreshes regions after App Router navigation, and returns `null` outside development by default.

`withPittiquita()` remains available only as a deprecated identity wrapper for migration. It never mounted the UI. Move existing integrations to `PittiquitaNextPanel` and remove the legacy wrapper from `next.config`.

See the [Next.js guide](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/nextjs.md).

## Marking capture regions

Use `FigmaTarget` when a wrapper element is appropriate:

```tsx
import { FigmaTarget } from 'pittiquita'

export function Hero() {
  return (
    <FigmaTarget as="section" name="marketing-hero" label="Marketing hero">
      <h1>Rendered product UI</h1>
    </FigmaTarget>
  )
}
```

Use `figmaTarget()` to add attributes to an existing element:

```tsx
import { figmaTarget } from 'pittiquita'

export function Pricing() {
  return <section {...figmaTarget('pricing-grid')}>...</section>
}
```

Both APIs emit `data-figma-target` and `data-figma-label`. Region discovery observes DOM changes and ignores anything inside `data-figma-helper`.

## Headless hooks

Build a custom interface through `pittiquita/hooks`:

```tsx
import {
  useFigmaCapture,
  useFigmaRegions,
  useLocalOrigin,
} from 'pittiquita/hooks'

export function CaptureToolbar() {
  const isLocal = useLocalOrigin()
  const { regions } = useFigmaRegions({ enabled: isLocal })
  const { activate } = useFigmaCapture({ enabled: isLocal })

  if (!isLocal) return null

  return (
    <button type="button" onClick={activate}>
      Capture {regions.length} regions
    </button>
  )
}
```

See [Targets and headless hooks](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/targets-and-hooks.md).

## Public entry points

| Import | Purpose |
| --- | --- |
| `pittiquita` | React components, hooks, utilities, and public types. |
| `pittiquita/hooks` | Headless hooks, supporting utilities, and hook types. |
| `pittiquita/vite` | Serve-only Vite adapter with automatic HMR-safe mounting. |
| `pittiquita/next` | Route-aware App Router component and deprecated migration wrapper. |

All four entry points are built as ESM and CommonJS with TypeScript declarations.

## Architecture

| Area | Responsibility |
| --- | --- |
| `src/core/` | Browser guards, capture state, region discovery, file-reference utilities, and shared types. |
| `src/react/` | Accessible panel, target APIs, UI slots, and inline styles. |
| `src/vite/` | Serve-only virtual module and automatic mount lifecycle. |
| `src/next/` | Route-aware App Router client adapter and legacy compatibility export. |
| `playground/` | Linked Vite consumer used for browser and demo validation. |
| `tests/` | Unit and integration-oriented Vitest/jsdom coverage. |
| `scripts/` | Reproducible visual-demo automation. |

Read the [architecture and trust-boundary overview](https://github.com/pedronazarito98/pittiquita/blob/main/docs/architecture/overview.md).

## Security and privacy

- No backend, account, analytics, or telemetry service is included.
- Importing the package has no intentional network side effect.
- The capture script is appended only after capture mode is active and the hostname is exactly `localhost` or `127.0.0.1`.
- The default script comes from `https://mcp.figma.com/mcp/html-to-design/capture.js` and executes in the host page. Treat it as a third-party trust boundary that can inspect the rendered DOM.
- `scriptSrc`, `nonce`, `integrity`, and `crossOrigin` support controlled mirrors and stricter Content Security Policy setups.
- The optional Figma file reference is stored only in browser `localStorage`.
- The local-host check is a product guard, not authentication or a security sandbox.

Use synthetic or sanitized development data. Do not capture production secrets, personal data, access tokens, or confidential customer content. Read [SECURITY.md](https://github.com/pedronazarito98/pittiquita/blob/main/SECURITY.md).

## Compatibility and evidence

| Environment | Evidence level | Current boundary |
| --- | --- | --- |
| React 18 | Declared support | Peer range is `>=18.0.0`; dedicated React 18 CI coverage is still future work. |
| React 19 | Tested baseline | Repository development and automated tests use React 19. |
| Vite | Unit-tested adapter | Serve-only behavior, serialization, idempotent mounting, and HMR cleanup are covered. |
| Next.js App Router | Unit-tested adapter | The client wrapper and route-aware contract are covered; a full framework fixture is still future work. |
| SSR | Implemented guards | Browser access is deferred or guarded; framework-level fixture coverage remains limited. |
| Non-local origins | Tested runtime guard | The panel returns no UI. This does not prove bundle-byte removal. |
| ESM and CommonJS | Build-verified | All public entry points produce both formats and declarations. |
| `localhost`, `127.0.0.1` | Tested baseline | IPv6 loopback, LAN IPs, and custom local domains are not accepted. |

## Known limitations

- Capture depends on the external HTML to Design script and the separate Figma plugin.
- The first activation replaces a pre-existing non-capture hash.
- Region discovery covers visible matching elements in the main document, not Shadow DOM or cross-origin iframes.
- Canvas-heavy content, video, complex animation, and browser-only assets can require manual verification after import.
- `FigmaTarget` and `figmaTarget()` emit markup wherever the consumer renders them, including production.
- The panel asks the user to copy the browser URL; it does not currently provide a clipboard action.
- Build-time exclusion for manual React and Next.js usage depends on the consumer's environment guard and bundler.

## Project quality

Run the same gates used by the repository:

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm pack:check
pnpm --dir playground install --frozen-lockfile
pnpm --dir playground build
pnpm demo:check
```

The repository includes automated tests, package dry-run inspection, a linked consumer playground, reproducible demo media, contribution and security policies, and bilingual product documentation. Counts are intentionally not hard-coded here; the CI result is the source of truth.

## Contributing

Start with [CONTRIBUTING.md](https://github.com/pedronazarito98/pittiquita/blob/main/CONTRIBUTING.md), follow the [Code of Conduct](https://github.com/pedronazarito98/pittiquita/blob/main/CODE_OF_CONDUCT.md), and use the issue and pull request templates.

Security findings must follow the private process in [SECURITY.md](https://github.com/pedronazarito98/pittiquita/blob/main/SECURITY.md), not a public issue.

## Roadmap direction

- Add full React 18 and Next.js App Router fixtures.
- Improve region navigation for dense pages.
- Make the capture-URL handoff more direct while keeping browser permissions explicit.
- Expand examples for design-system and monorepo workflows.

These are directions, not committed release dates. Track accepted work in [GitHub Issues](https://github.com/pedronazarito98/pittiquita/issues).

## License

[MIT](https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE) © Pedro Nazarito.
