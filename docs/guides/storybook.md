# Storybook React

The existing React panel can be mounted manually inside Storybook's preview. The new `pittiquita/storybook` entry point provides a dedicated decorator that follows the current story, names its canvas automatically, and keeps the panel outside the component layout.

This entry point is available from `pittiquita@0.2.0`. Upgrade older installations before importing it, or build and link this checkout for local development.

## Configure the preview

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/react-vite'
import { withPittiquita } from 'pittiquita/storybook'

const preview = {
  decorators: process.env.NODE_ENV === 'development' ? [withPittiquita()] : [],
} satisfies Preview

export default preview
```

Use the `Preview` type from your React framework package (for example, `@storybook/react-vite`, `@storybook/react-webpack5`, or `@storybook/nextjs`). Register the decorator once, globally. The adapter uses React and React DOM without importing Storybook or a builder at runtime. The repository example uses Storybook 10 with React/Vite; the other builders still need runtime verification.

The explicit development condition also allows the bundler to remove the unused decorator from a static build. The decorator itself defaults to disabled outside development, but a runtime guard alone does not guarantee byte exclusion.

## What the decorator does

- Runs in the Canvas preview document, where the story's real DOM exists.
- Adds `data-figma-target` and a label to `context.canvasElement`, without an extra layout wrapper. Existing target attributes are preserved and added attributes are restored on cleanup.
- Renders the existing `FigmaCapturePanel` through a portal to the preview document's body, outside the story's layout and transforms.
- Resets panel selection when the story ID changes. Existing DOM observation discovers regions added or removed by Controls and component interactions.
- Skips Docs, where several stories may be rendered together, to avoid multiple floating panels.
- Keeps the existing `localhost`/`127.0.0.1` restriction. It does not load the external capture script until capture is active.

Open a story's Canvas to capture it from Docs. React stories are supported; this adapter is not for Vue, Angular, or Web Components renderers.

## Options and per-story configuration

`withPittiquita()` accepts the existing panel props except `pathname` and `searchKey`. Callbacks and function-valued labels are supported because options are passed directly to React.

It also accepts:

| Option | Default | Meaning |
| --- | --- | --- |
| `enabled` | `process.env.NODE_ENV === 'development'` | Enables the integration. The local hostname guard still applies. |
| `target` | `true` | Marks the canvas as a region. Set to `false` to list only explicit targets inside the story. |
| `label` | `title / name` | Label for the automatic canvas region. |

```ts
import type { PittiquitaStorybookOptions } from 'pittiquita/storybook'

export const Compact = {
  parameters: {
    pittiquita: {
      label: 'Compact account card',
      position: 'bottom-left',
    } satisfies PittiquitaStorybookOptions,
  },
}

export const WithoutCapture = {
  parameters: { pittiquita: false },
}
```

Options in `parameters.pittiquita` override the decorator defaults with a shallow merge. A story-level `theme`, `labels`, or `classNames` object replaces that decorator-level object; the panel still merges its own built-in defaults. `enabled: false` is also supported.

Continue using `FigmaTarget` or `figmaTarget()` inside components for finer regions. They work in the same preview document.

## Capture the story URL

Storybook has two documents: the manager with navigation/toolbars and the preview iframe with your component. The panel changes the preview's hash, not the manager's address bar.

1. Select the story and adjust Controls, viewport, and component state.
2. Use Storybook's **Open in isolation mode** action (or **Open canvas in new tab**, depending on the version/view). The new URL points to `iframe.html?id=...&viewMode=story` and should retain any args/globals query parameters from Storybook. Confirm them in the new tab before capturing.
3. Check the state in that tab. Opening a document again resets component-local state, so repeat interactions as needed.
4. Choose **Activate capture** in the panel in that tab. The URL gains `#figmacapture=manual` without removing the story ID, args, or globals query string.
5. Copy that full preview URL for the existing HTML to Design workflow.

Do not copy the manager URL (`?path=/story/...`) as the component's capture URL. Importing from a URL can reload the story, so express reproducible states as args or dedicated stories; transient click state is not serialized by pittiquita.

Selecting a region scrolls to it and marks `data-figma-selected`; it does not change the external importer's selection automatically. Final Figma conversion remains the responsibility of the external capture script/plugin and requires manual validation.

## Avoid duplicate panels with Vite

Storybook's Vite builder can load your application's `vite.config.ts`. If that config already uses `pittiquita/vite`, its automatic panel and this decorator would both mount a panel. Use one mounting strategy.

The repository example selects a separate, minimal Vite config through `framework.options.builder.viteConfigPath` in `.storybook/main.ts`. In your project, use a Storybook Vite config that retains the aliases/plugins you need and excludes `pittiquita/vite`.

## Run the repository example

```bash
pnpm install
pnpm build
pnpm --dir playground install
pnpm --dir playground storybook
```

The example opens at `http://127.0.0.1:6006` and includes Light, Dark, Without Panel, and Named Regions Only stories. It uses the linked local package. Rebuild the library after editing it, or run `pnpm dev` in another terminal.

```bash
pnpm --dir playground typecheck:storybook
pnpm --dir playground build-storybook
```

The Storybook tooling is a development dependency of the playground only. The library's existing React peer dependencies and Node engine range are unchanged; use Node 22+ for the Storybook example.

## References

- [Storybook: global decorators and story context](https://storybook.js.org/docs/writing-stories/decorators)
- [Storybook: preview configuration and iframe](https://storybook.js.org/docs/configure/index)
- [Storybook: Vite builder configuration](https://storybook.js.org/docs/builders/vite)
