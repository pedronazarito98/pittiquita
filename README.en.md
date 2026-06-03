# pittiquita

> A development-only React toolkit for capturing live localhost components and sending them to Figma through HTML to Design.

<p>
  <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm version" src="https://img.shields.io/npm/v/pittiquita?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm downloads" src="https://img.shields.io/npm/dm/pittiquita?style=flat-square" /></a>
  <a href="https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/pittiquita?style=flat-square" /></a>
  <a href="https://bundlephobia.com/package/pittiquita"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/pittiquita?style=flat-square" /></a>
</p>

**Language:** [Portugues (default)](https://github.com/pedronazarito98/pittiquita/blob/main/README.md) | English

`pittiquita` helps teams move faster across the Design <-> Code loop. It adds a small capture panel to local React apps, marks useful regions on the page, and prepares the current localhost URL for Figma's [HTML to Design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design) plugin.

It is SSR-safe, localhost-only, tree-shakeable, and designed to have zero production impact.

- npm: [pittiquita](https://www.npmjs.com/package/pittiquita)
- GitHub: [pedronazarito98/pittiquita](https://github.com/pedronazarito98/pittiquita)
- License: [MIT](./LICENSE)
- Visual demo: [docs/demo](./docs/demo)

## Visual Demo

The demo shows the intended flow:

```txt
localhost -> activate capture -> URL ready -> paste in Figma / HTML to Design
```

| Localhost panel | Capture active |
| --- | --- |
| ![pittiquita panel on localhost](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/01-localhost-panel.png) | ![pittiquita capture active](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/02-capture-active.png) |

| Copy URL | HTML to Design step |
| --- | --- |
| ![pittiquita capture URL ready](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/03-copy-url.png) | ![illustrative HTML to Design import step](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/04-figma-import-step.png) |

The last screen is an illustrative local mock. It documents where to paste the URL in HTML to Design without requiring a Figma login or plugin session.

Regenerate the screenshots with:

```bash
pnpm build
pnpm --dir playground install
pnpm run demo:capture
```

If Playwright cannot find a browser on your machine, install Chromium once:

```bash
pnpm exec playwright install chromium
```

## The Problem

Designers and engineers often need to inspect the real rendered state of a component before bringing it back into Figma. The manual workflow is slow:

1. Open DevTools.
2. Find the right DOM node.
3. Copy HTML by hand.
4. Paste it into a Figma plugin.
5. Repeat when the component state changes.

That process is fragile because the useful thing is not the source component. It is the live component, with current props, CSS, data, layout, and browser-rendered state.

## The Solution

`pittiquita` adds a local capture helper to your React app.

It lets you:

- Activate Figma capture mode from a floating panel.
- Copy the current localhost URL with the capture hash ready.
- Mark specific page regions as named targets.
- Jump to those targets from the panel.
- Keep capture tooling out of production.

The handoff remains simple: run your app locally, activate capture, copy the URL, and paste it into Figma's HTML to Design plugin.

## When To Use

Use `pittiquita` when you want to:

- Bring real React UI states into Figma for review or iteration.
- Document component states from a local development environment.
- Give designers a stable way to import rendered screens without DevTools.
- Capture specific page regions such as hero, pricing, cards, forms, or dashboards.
- Keep the workflow development-only and safe for production bundles.

It is not a replacement for design tokens, component libraries, Storybook, or Figma components. It is a bridge for capturing live HTML states quickly.

## Installation

```bash
pnpm add pittiquita
```

Peer dependencies:

```txt
react >=18
react-dom >=18
```

## Quick Use

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

Start your development server and open a localhost URL. The panel returns `null` outside `localhost` and `127.0.0.1`.

## Next.js Example

For the App Router, put a small client component near your root layout.

```tsx
// app/PittiquitaPanel.tsx
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
import { PittiquitaPanel } from './PittiquitaPanel'

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

The `NODE_ENV` guard is optional because the component already checks localhost, but it helps bundlers remove development-only UI from production branches.

## Vite Example

Use the Vite plugin to inject the panel automatically during `vite dev`:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

The Vite plugin only applies while serving the dev server. Production builds are left untouched.

You can also render `<FigmaCapturePanel />` manually in a Vite app if you prefer explicit control.

## Marking Regions

Marked regions appear in the panel as named shortcuts. Selecting one scrolls it into view and highlights it for capture.

### With `FigmaTarget`

```tsx
import { FigmaTarget } from 'pittiquita'

export function MarketingPage() {
  return (
    <FigmaTarget name="hero-section" label="Hero">
      <section>
        <h1>Design-ready product UI</h1>
      </section>
    </FigmaTarget>
  )
}
```

### With `figmaTarget`

Use the helper when you do not want an extra wrapper element:

```tsx
import { figmaTarget } from 'pittiquita'

export function PricingCards() {
  return (
    <section {...figmaTarget('pricing-cards', { label: 'Pricing cards' })}>
      ...
    </section>
  )
}
```

Both APIs write `data-figma-target` and `data-figma-label` attributes. The panel discovers them automatically through `MutationObserver`.

## How Capture Works

1. `FigmaCapturePanel` renders only on `localhost` or `127.0.0.1`.
2. Clicking `Activate capture` adds `#figmacapture=manual` to the current URL.
3. When that hash is present, pittiquita injects Figma's HTML to Design capture script.
4. You copy the full localhost URL.
5. In Figma, open HTML to Design and import from URL.
6. The plugin reads the rendered page and recreates it as editable Figma layers.

The panel marks itself with `data-figma-helper` so the helper UI can be ignored by capture logic.

## Headless Hooks

If you want to build your own UI, import the hooks entry point:

```tsx
import {
  useFigmaCapture,
  useFigmaFileRef,
  useFigmaRegions,
  useLocalOrigin,
} from 'pittiquita/hooks'

export function CustomCaptureToolbar() {
  const isLocal = useLocalOrigin()
  const { activate } = useFigmaCapture({ enabled: isLocal })
  const { regions } = useFigmaRegions({ enabled: isLocal })
  const fileRef = useFigmaFileRef()

  if (!isLocal) return null

  return (
    <div>
      <button type="button" onClick={activate}>
        Capture
      </button>
      <span>{regions.length} regions</span>
      <input value={fileRef.value} onChange={(event) => fileRef.setValue(event.target.value)} />
    </div>
  )
}
```

## Architecture

```txt
src/
  core/
    hooks/      React hooks with browser guards
    utils/      capture, file-ref, labels, and region utilities
    types.ts    shared public types
  react/
    FigmaCapturePanel.tsx
    FigmaTarget.tsx
    components/
    styles.ts   inline styles and CSS custom properties
  vite/
    plugin.ts   development-only Vite injection
  next/
    plugin.ts   Next.js config helper entry point
tests/
  core/
  react/
playground/
  Vite demo app linked to the local package
docs/demo/
  Playwright-generated visual walkthrough
```

Public entry points:

| Import | Purpose |
| --- | --- |
| `pittiquita` | Components, hooks, utilities, and public types |
| `pittiquita/hooks` | Headless hooks and utilities |
| `pittiquita/vite` | Vite development plugin |
| `pittiquita/next` | Next.js config helper |

## Development Scripts

Use `pnpm`.

```bash
pnpm install
pnpm test:run
pnpm typecheck
pnpm build
pnpm lint
pnpm run demo:capture
pnpm --dir playground dev
pnpm --dir playground build
```

The demo capture script expects the package to be built first because the playground consumes the parent package through its public exports.

## Package Metadata

The package is published as ESM and CJS through `tsup`.

- `main`: `./dist/index.cjs`
- `module`: `./dist/index.js`
- `types`: `./dist/index.d.ts`
- `exports`: `.`, `./hooks`, `./vite`, `./next`
- `files`: `dist`
- `sideEffects`: `false`
- `license`: `MIT`

`sideEffects: false` is intentional because the package has no import-time side effects. Capture behavior starts only when consumers render the panel or call the hooks in a browser context.

## Known Limitations

- Capture is limited to `localhost` and `127.0.0.1` by design.
- The real HTML import step depends on Figma's HTML to Design plugin.
- The package does not authenticate with Figma and does not manage Figma files.
- Shadow DOM and iframe-heavy pages may need manual verification in HTML to Design.
- The Vite plugin is intended for development server usage, not production injection.

## Security And Privacy

- No `.env` values, tokens, cookies, or credentials are required by pittiquita.
- The helper returns `null` outside local development origins.
- The package does not send data to a pittiquita server.
- When capture mode is activated, Figma's HTML to Design script is loaded from Figma's domain and the import behavior is controlled by Figma's plugin.
- Use a development dataset when importing sensitive product screens into Figma.

## Roadmap

- Add a richer visual region map for dense pages.
- Add optional copy-to-clipboard affordances for the capture URL.
- Improve docs for design-system and Storybook workflows.
- Add more examples for Next.js App Router and Vite monorepos.

## License

MIT (c) Pedro Nazarito. See [LICENSE](./LICENSE).
