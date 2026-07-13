<div align="center">
  <img src="https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/logo.svg" width="132" alt="pittiquita sleeping cat mascot" />
  <h1>pittiquita</h1>
  <p>
    <strong>Capture live React UI states running on localhost and bring them into Figma through HTML to Design.</strong>
  </p>
  <p>
    A small developer tool with SSR-aware browser guards for engineers and designers who need the rendered product—not a screenshot—to continue the design loop.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm version" src="https://img.shields.io/npm/v/pittiquita?color=6366f1&style=flat-square" /></a>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm downloads" src="https://img.shields.io/npm/dm/pittiquita?color=0ea5e9&style=flat-square" /></a>
    <a href="https://bundlephobia.com/package/pittiquita"><img alt="minified and gzipped bundle size" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip&color=22c55e&style=flat-square" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml"><img alt="CI status" src="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml/badge.svg" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/npm/l/pittiquita?color=111827&style=flat-square" /></a>
  </p>
  <p>
    English
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/docs/README.pt-BR.md">Português</a>
  </p>
  <p>
    <a href="#demo">Demo</a>
    ·
    <a href="#installation">Install</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/tree/main/docs/guides">Guides</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/docs/architecture/overview.md">Architecture</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/SECURITY.md">Security</a>
  </p>
</div>

---

## At a glance

`pittiquita` adds a capture panel to a local React application. It can discover named regions, enable the capture hash, and load the external HTML to Design capture script. You then copy the browser URL and paste it into the independent [HTML to Design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design) Figma plugin.

```text
React app on localhost
  → pittiquita panel or headless hooks
  → #figmacapture=manual + capture script
  → copy the browser URL
  → HTML to Design
  → editable Figma layers
```

| Built for | What it contributes |
| --- | --- |
| UI implementation reviews | Uses the state actually rendered by the browser: props, CSS, data, layout, and the visible interaction state at that moment. |
| Design-to-code-to-design loops | Makes the return path from a working React screen to Figma explicit and repeatable. |
| Dense pages | Lets teams name useful regions and navigate to them from the panel. |
| Development environments | Shows no capture UI outside `localhost` and `127.0.0.1`; the Vite integration is serve-only. |

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

The fourth image is a local mock, not evidence of a real Figma import. It keeps the demo reproducible without a Figma login. See the [demo notes](https://github.com/pedronazarito98/pittiquita/tree/main/docs/demo) for the generation command and that boundary.

## The problem

The UI in a design file and the UI running in a product naturally drift apart. Once implementation starts, the browser becomes the only place where component props, real CSS, current data, layout constraints, and transient states exist together.

Common workarounds lose useful information:

| Workaround | Limitation |
| --- | --- |
| Screenshot | Preserves pixels, but not editable structure. |
| Copy HTML manually | Requires DOM inspection and is easy to repeat incorrectly. |
| Rebuild the state in Figma | Duplicates work and may miss implementation details. |
| Share source code only | Does not communicate the exact state rendered in the browser. |

## What pittiquita does

- Renders a compact capture panel in a local React tree.
- Enables `#figmacapture=manual` without replacing an existing capture hash.
- Loads the HTML to Design capture script only when capture mode is active on an accepted local hostname.
- Discovers visible elements marked with `data-figma-target` or the legacy-compatible `data-debug-layer` attribute.
- Lets the user scroll to a named region and marks it with `data-figma-selected` so the host app can style the selected state if desired.
- Exposes headless hooks for teams that need their own UI.
- Provides a serve-only Vite plugin that mounts the panel automatically.
- Publishes ESM, CommonJS, and TypeScript declarations through four public entry points.

## Who it is for

- Frontend engineers reviewing implemented UI with product designers.
- Design-system teams comparing real component states with their source designs.
- Product engineers who need to bring a local dashboard, form, or flow back into Figma for iteration.
- Small teams that want this handoff without operating another backend or account system.

## Why I built this

I built `pittiquita` for the moment when “the design” is no longer only in Figma. The implemented screen now contains decisions encoded in props, responsive CSS, realistic data, loading and error states, and browser layout. Screenshots flatten those decisions, while copying HTML by hand turns each iteration into a fragile DevTools task.

The goal is deliberately narrow: give designers and engineers a short path from a live local React state back to an editable design workflow, while keeping the helper visible, inspectable, and limited to development hosts.

## How it works

1. Run the React application on `localhost` or `127.0.0.1`.
2. Mount `FigmaCapturePanel`, or use the Vite plugin/headless hooks.
3. Optionally mark useful regions with `FigmaTarget` or `figmaTarget()`.
4. Choose **Activate capture**. `pittiquita` adds `#figmacapture=manual` and appends the default external capture script to the page.
5. Copy the complete URL from the browser.
6. Open HTML to Design in Figma and use its URL import flow.

The browser page remains the source of the captured state. `pittiquita` does not run a proxy, upload service, or Figma API backend.

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

Installing it as a development dependency communicates the intended usage. If your production build still resolves code that imports the package, bundle exclusion depends on your integration and bundler.

## Quick start

Render the panel inside a client-side React tree:

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

Open the app on `localhost` or `127.0.0.1`. On other hostnames, the component returns `null` after the client-side origin check.

For a production-conscious setup, also use the environment guard supported by your framework so the panel is not mounted in production. The localhost check prevents the capture UI from rendering; it is not by itself a guarantee that every bundler removes the package bytes.

## React configuration

The prebuilt panel supports positioning, partial theme/label overrides, callback hooks, and capture-script security attributes:

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function DevelopmentTools() {
  return (
    <FigmaCapturePanel
      position="bottom-left"
      labels={{ panelTitle: 'Design handoff' }}
      onRegionSelect={(region) => console.info(region.id)}
    />
  )
}
```

See the [React guide](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/react.md) for theming, labels, callbacks, and development gating.

## Vite

The dedicated Vite plugin mounts the panel during `vite dev`:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

The plugin declares `apply: 'serve'`, so it does not inject its virtual module during `vite build`. Plugin options must be serializable; render `FigmaCapturePanel` manually when you need function props such as callbacks.

See the [Vite guide](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/vite.md).

## Next.js App Router

Use a Client Component. This is the recommended and explicit integration:

```tsx
// app/pittiquita-panel.tsx
'use client'

import { usePathname } from 'next/navigation'
import { FigmaCapturePanel } from 'pittiquita'

export function PittiquitaPanel() {
  return <FigmaCapturePanel pathname={usePathname()} />
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { PittiquitaPanel } from './pittiquita-panel'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <PittiquitaPanel /> : null}
      </body>
    </html>
  )
}
```

The current `pittiquita/next` entry point exports `withPittiquita`, but that configuration helper does **not** mount the React panel. Do not rely on it for automatic UI injection. The Client Component above is the recommended documented path, and a dedicated Next.js integration test is not yet present.

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

Use `figmaTarget()` to add the attributes to an existing element:

```tsx
import { figmaTarget } from 'pittiquita'

export function Pricing() {
  return <section {...figmaTarget('pricing-grid')}>...</section>
}
```

Both APIs emit `data-figma-target` and `data-figma-label`. Region discovery observes DOM changes and ignores anything inside `data-figma-helper`.

## Headless hooks

Build a custom toolbar through `pittiquita/hooks`:

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

The hooks entry point also exports file-reference helpers, labels, capture utilities, and public hook types. See [Targets and headless hooks](https://github.com/pedronazarito98/pittiquita/blob/main/docs/guides/targets-and-hooks.md).

## Public entry points

The package manifest exposes exactly four entry points, each built as ESM and CommonJS with declarations:

| Import | Purpose |
| --- | --- |
| `pittiquita` | React components, hooks, utilities, and public types. |
| `pittiquita/hooks` | Headless hooks, supporting utilities, and hook types. |
| `pittiquita/vite` | Serve-only Vite plugin with automatic panel mounting. |
| `pittiquita/next` | Development-time Next config wrapper; it does not mount UI. |

## Architecture

The code is intentionally split by responsibility:

| Area | Responsibility |
| --- | --- |
| `src/core/` | Browser guards, capture state, region discovery, file-reference utilities, and shared types. |
| `src/react/` | `FigmaCapturePanel`, `FigmaTarget`, small UI components, and inline styles. |
| `src/vite/` | Vite virtual module and serve-only injection. |
| `src/next/` | Next.js config wrapper; no component injection. |
| `playground/` | Vite app linked to the parent package for manual/demo validation. |
| `tests/` | Vitest/jsdom tests mirroring core and React behavior. |
| `scripts/` | Reproducible visual-demo automation. |
| `docs/demo/` | Versioned PNG, GIF, and WebM evidence with honest handoff documentation. |

Read the [architecture and trust-boundary overview](https://github.com/pedronazarito98/pittiquita/blob/main/docs/architecture/overview.md).

## Security and privacy

- `pittiquita` has no backend, account, analytics, or telemetry service.
- Importing the package has no intentional network side effect.
- The capture script is appended only after capture mode is active and the hostname is exactly `localhost` or `127.0.0.1`.
- By default, that script comes from `https://mcp.figma.com/mcp/html-to-design/capture.js` and executes in the page. Treat this as a third-party trust boundary: it can inspect the rendered DOM.
- `scriptSrc`, `nonce`, `integrity`, and `crossOrigin` are available for teams with a controlled mirror or strict Content Security Policy.
- The optional Figma file reference is stored in browser `localStorage`; pittiquita does not upload it, and the panel's reset action does not remove the stored value.
- The local-host check is a product guard, not authentication or a security sandbox.

Use synthetic or sanitized development data. Do not capture production secrets, personal data, access tokens, or confidential customer content. Read [SECURITY.md](https://github.com/pedronazarito98/pittiquita/blob/main/SECURITY.md) before enabling the external script in a sensitive application.

## What pittiquita is not

`pittiquita`:

- does not replace Storybook, design tokens, a component library, or a design system;
- does not replace native Figma components or variants;
- is not a Figma plugin and is not an official Figma integration;
- does not authenticate with Figma or manage Figma files;
- does not recreate React source code, state logic, event handlers, or application behavior inside Figma;
- does not guarantee pixel-perfect conversion—the independent HTML to Design importer owns that result;
- should not be used to expose sensitive production states.

## Compatibility and evidence

The labels below distinguish tested behavior from declared or documented behavior:

- **Tested baseline**: exercised by this repository's automated suite or build.
- **Implemented**: present in source/package configuration, without a dedicated integration matrix.
- **Documented path**: expected usage based on the public API, not yet covered by an end-to-end framework test.

| Environment | Evidence level | Current boundary |
| --- | --- | --- |
| React 18 | Declared support | `react` and `react-dom` peers are `>=18.0.0`; the current automated suite runs React 19, not a separate React 18 job. |
| React 19 | Tested baseline | Development and tests use React `^19.2.5`. |
| Vite | Implemented | Dedicated `pittiquita/vite` plugin configured in the playground; production injection is disabled with `apply: 'serve'`, but automatic mounting has no isolated integration test. |
| Next.js App Router | Documented path | Mount a Client Component manually; no automated Next.js integration test exists. |
| SSR | Implemented guards | Browser access is deferred/guarded, but there is no framework-level SSR matrix yet. |
| Non-local origins | Tested runtime guard | The panel returns no UI. This does not prove bundle-byte removal. |
| ESM and CommonJS | Tested build | `tsup` produces both formats and declaration files for all entry points. |
| `localhost`, `127.0.0.1` | Tested baseline | These are the only accepted hostnames. IPv6 `::1` and custom local domains are not accepted. |

## Known limitations

- URL capture depends on the external HTML to Design script and the separate Figma plugin.
- The capture hash replaces a pre-existing non-capture hash when first activated.
- Custom development hostnames, LAN IPs, HTTPS preview domains, and IPv6 loopback are outside the current local-origin allowlist.
- Shadow DOM, cross-origin iframes, canvas-heavy content, video, complex animations, and browser-only assets may require manual verification after import.
- Region discovery only lists visible matching elements in the main document.
- `FigmaTarget` and `figmaTarget()` still emit their wrapper/attributes wherever the consumer renders them, including production.
- The panel asks the user to copy the browser URL; it does not currently provide a copy-to-clipboard button.
- Build-time removal for manual React/Next usage depends on the consumer's environment guard and bundler.
- React 18 and Next.js do not yet have dedicated CI matrix jobs in this repository.

## Project quality

The current repository baseline is inspectable rather than aspirational:

| Evidence | Current baseline | How to verify |
| --- | --- | --- |
| Package version | `0.1.7` | `package.json` or the dynamic npm badge. |
| Public entry points | 4 | Inspect `package.json#exports` and `tsup.config.ts`. |
| Automated tests | 82 tests across 11 files in the integrated reproducible-demo baseline | Run `pnpm test:run`. Before the demo tests were added, the verified baseline was 58 across 9 files. |
| Type/build outputs | ESM, CommonJS, and declarations | Run `pnpm typecheck` and `pnpm build`. |
| Package contents | Dry-run tarball inspection | Run `pnpm pack:check`; sizes are intentionally not hard-coded here. |
| Continuous integration | lint, tests, demo artifact check, typecheck, build, pack dry-run | Inspect `.github/workflows/ci.yml` or the CI badge. |

## Contributing

Contributions are welcome when they preserve the development-only boundary and public API stability. Start with [CONTRIBUTING.md](https://github.com/pedronazarito98/pittiquita/blob/main/CONTRIBUTING.md), follow the [Code of Conduct](https://github.com/pedronazarito98/pittiquita/blob/main/CODE_OF_CONDUCT.md), and use the issue/PR templates.

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm pack:check
pnpm --dir playground build
```

Changes to demo automation or media also require `pnpm demo:check` and the workflow documented under `docs/demo/`.

Security findings should follow the private process in [SECURITY.md](https://github.com/pedronazarito98/pittiquita/blob/main/SECURITY.md), not a public issue.

## Roadmap direction

These are directions, not committed release dates:

- Add explicit automated matrices for React 18 and a Next.js App Router fixture.
- Improve region navigation for dense pages.
- Make the capture-URL handoff more direct while keeping browser permissions explicit.
- Expand examples for design-system and monorepo workflows.

Track accepted work in [GitHub Issues](https://github.com/pedronazarito98/pittiquita/issues); do not treat this list as a compatibility promise.

## License

[MIT](https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE) © Pedro Nazarito.
