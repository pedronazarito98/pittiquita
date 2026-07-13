# Getting started

This is the shortest path to prepare a local React screen for the HTML to Design URL flow.

## 1. Check the boundary

You need:

- React and React DOM `>=18.0.0`;
- an application served with hostname `localhost` or `127.0.0.1`;
- a modern browser with `MutationObserver`, `localStorage`, and `requestAnimationFrame`;
- the independent HTML to Design plugin installed in Figma for the final import.

The repository's current tests run with React 19. React 18 is declared through the peer range but does not have its own CI job yet.

## 2. Install as a development dependency

```bash
pnpm add -D pittiquita
```

Or:

```bash
npm install --save-dev pittiquita
yarn add --dev pittiquita
```

## 3. Mount the panel

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function App() {
  return (
    <>
      <ProductScreen />
      <FigmaCapturePanel />
    </>
  )
}
```

The panel becomes visible after the client confirms an accepted local hostname. For framework-specific build gating, continue with the [Vite](./vite.md) or [Next.js](./nextjs.md) guide.

## 4. Mark an optional region

```tsx
import { figmaTarget } from 'pittiquita'

export function AccountSummary() {
  return (
    <section {...figmaTarget('account-summary', { label: 'Account summary' })}>
      {/* rendered product UI */}
    </section>
  )
}
```

The panel lists visible marked regions. Selecting one scrolls it into view and adds `data-figma-selected="true"`; style that attribute in the host application if you need a visible selected state.

## 5. Activate capture

1. Open the application on `http://localhost:...` or `http://127.0.0.1:...`.
2. Choose **Activate capture** in the panel.
3. Confirm the browser URL now contains `#figmacapture=manual`.
4. Copy the complete URL using the browser. The current panel does not copy it to the clipboard.
5. In Figma, open HTML to Design and use its URL import flow.

Activating capture loads `https://mcp.figma.com/mcp/html-to-design/capture.js` by default. Do not perform this step with secrets or sensitive production data rendered on the page.

## 6. Verify your integration

- On an accepted local hostname, the panel appears after mount.
- On another hostname, the prebuilt panel returns `null`.
- Activating capture changes the hash and adds one `script[data-figma-capture-loader]` element.
- Repeated activation does not add duplicate capture scripts.
- A marked visible region appears in the panel.
- Your production build uses the framework-specific guard you chose.

## Troubleshooting

### The panel does not appear

Check `window.location.hostname`. `::1`, `0.0.0.0`, LAN IPs, preview domains, and custom local domains are not accepted by the current allowlist.

### The capture script is blocked

Your Content Security Policy may reject the default source. See [SECURITY.md](../../SECURITY.md#content-security-policy-and-sri) and configure `scriptSrc`, `nonce`, `integrity`, and `crossOrigin` according to your policy.

### Activating capture breaks hash navigation

The first activation replaces an unrelated existing hash. Hash-router applications should preserve/restore their route or isolate the capture page until the package provides hash composition.

### A region is missing

Region discovery only includes visible elements in the main document. Confirm the element has non-zero dimensions, is not `display: none`/`visibility: hidden`, and carries `data-figma-target` or `data-debug-layer`.

### The imported result differs from the browser

Conversion is performed by HTML to Design, not by pittiquita. Shadow DOM, cross-origin iframes, canvas/video, complex animation, fonts, and protected assets may require manual follow-up.
