# Targets and headless hooks

The package supports two levels of customization:

- annotate regions while using the prebuilt panel;
- replace the panel with a UI built from `pittiquita/hooks`.

## Target wrapper

`FigmaTarget` creates an element and places target attributes on it:

```tsx
import { FigmaTarget } from 'pittiquita'

export function CheckoutSummary() {
  return (
    <FigmaTarget
      as="section"
      name="checkout-summary"
      label="Checkout summary"
    >
      <Summary />
    </FigmaTarget>
  )
}
```

`as` defaults to `div`. The generated label defaults to a title-cased form of `name`.

## Attribute helper

`figmaTarget()` avoids an extra wrapper:

```tsx
import { figmaTarget } from 'pittiquita'

export function KPIGrid() {
  return <div {...figmaTarget('kpi-grid', { label: 'KPI grid' })}>...</div>
}
```

Both approaches emit:

```html
data-figma-target="..."
data-figma-label="..."
```

These attributes are emitted anywhere the target is rendered. Apply your own development boundary if they must not exist in production markup.

## Discovery rules

`useFigmaRegions()`:

- scans `[data-figma-target]` and `[data-debug-layer]`;
- ignores elements below `[data-figma-helper]`;
- removes zero-size, `display: none`, and `visibility: hidden` matches;
- orders matches by viewport top, then left;
- disambiguates duplicate labels with a numeric suffix;
- refreshes from DOM mutation, navigation events, route props, or `refresh()`.

When the prebuilt panel selects a region, it scrolls the element into view and applies `data-figma-selected="true"`. The package does not provide highlight CSS for that attribute.

## Headless toolbar

```tsx
import {
  useFigmaCapture,
  useFigmaRegions,
  useLocalOrigin,
} from 'pittiquita/hooks'

export function DesignHandoffToolbar() {
  const isLocal = useLocalOrigin()
  const { regions, refresh } = useFigmaRegions({ enabled: isLocal })
  const { activate } = useFigmaCapture({
    enabled: isLocal,
    onHashChange: refresh,
  })

  if (!isLocal) return null

  return (
    <nav aria-label="Design handoff">
      <button type="button" onClick={activate}>
        Activate capture
      </button>
      <span>{regions.length} regions</span>
    </nav>
  )
}
```

The explicit `enabled: isLocal` arguments matter. `useFigmaRegions()` and `useFigmaCapture()` default to enabled; consumers own the guard in headless integrations.

## Hook API

| Hook | Options | Result |
| --- | --- | --- |
| `useLocalOrigin()` | None | Boolean that becomes true only for the accepted hostnames after mount. |
| `useFigmaCapture()` | `enabled`, `onHashChange`, `scriptSrc`, `nonce`, `integrity`, `crossOrigin` | `activate()`. |
| `useFigmaRegions()` | `enabled`, `pathname`, `searchKey` | `regions`, `refresh()`. |
| `useFigmaFileRef()` | `storageKey`, `initialValue` | value/error/status state, setters, open/reset actions. |

## File-reference behavior

`useFigmaFileRef()` accepts either an alphanumeric Figma file key or a Figma `/design/{key}`/`/file/{key}` URL. On **open** it:

1. normalizes the key;
2. persists the original trimmed input to `localStorage`;
3. opens `https://www.figma.com/design/{key}` with `noopener,noreferrer`.

The default storage key is `figma-file-ref`. `reset()` clears transient error and status state but does not clear the stored value. Choose a custom `storageKey` and data-retention behavior if the file reference itself is sensitive.

## Utilities

`pittiquita/hooks` also exports utilities such as:

- `isLocalOrigin`, `isCaptureActive`, `enableCaptureHash`, `ensureCaptureScript`;
- `normalizeFileKey`, `buildFigmaFileUrl`;
- `buildRegionEntries`, `areRegionsEqual`, `prettifyLabel`;
- `defaultLabels`, `mergeLabels`.

Some utilities directly access the DOM. Call browser-only utilities from a client boundary/effect, not during server rendering.
