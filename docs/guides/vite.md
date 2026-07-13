# Vite guide

The `pittiquita/vite` entry point provides automatic panel mounting while Vite is serving the application.

## Configuration

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

The plugin:

1. declares `apply: 'serve'`;
2. adds a `virtual:pittiquita` module to the development HTML;
3. creates `#pittiquita-root` under `document.body`;
4. mounts `FigmaCapturePanel` with React DOM's `createRoot()`.

Because it is serve-only, the virtual module is not injected by `vite build`.

## Serializable options

You can pass serializable `FigmaCapturePanel` options except `pathname` and `searchKey`:

```ts
export default defineConfig({
  plugins: [
    react(),
    pittiquita({
      position: 'bottom-left',
      labels: {
        panelTitle: 'Design handoff',
      },
    }),
  ],
})
```

The options cross a generated virtual-module boundary through `JSON.stringify()`. Function values are omitted. Mount the panel manually when you need `onCaptureActivate`, `onRegionSelect`, or a function such as `labels.regionsCount`.

## Manual alternative

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function DevelopmentTools() {
  return import.meta.env.DEV ? <FigmaCapturePanel /> : null
}
```

Use one mounting strategy for the panel. The package does not currently deduplicate multiple panel roots if both the plugin and manual mounting are enabled.

## Verification

```bash
pnpm build
pnpm --dir playground install --frozen-lockfile
pnpm --dir playground build
pnpm --dir playground dev
```

The repository playground configures the Vite plugin, but it also contains a manually rendered panel for demo purposes. A successful playground build proves that the configuration compiles; it is not an isolated integration test of automatic mounting.

In a consumer fixture, verify both states:

- `vite dev`: one panel root is mounted on an accepted local hostname;
- `vite build`: generated production HTML contains no `virtual:pittiquita` injection.

## Limits

- The plugin assumes React and React DOM are available in the consumer.
- Plugin callbacks are not serializable.
- Automatic mounting is implemented but does not have a dedicated isolated test in this repository.
- Custom development hostnames are still rejected by the panel's local-origin check.
