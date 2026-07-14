# React guide

Use the root `pittiquita` entry point when you want the prebuilt UI or target components.

## Manual panel mounting

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function DevelopmentTools() {
  return <FigmaCapturePanel position="bottom-right" />
}
```

The panel is SSR-aware: it starts hidden and checks the hostname after mounting. It is not a build-time switch. Wrap it in the development condition supported by your application if package-byte exclusion is required.

For example, a manually mounted Vite application can use:

```tsx
export function DevelopmentTools() {
  return import.meta.env.DEV ? <FigmaCapturePanel /> : null
}
```

The dedicated [Vite plugin](./vite.md) is a more direct serve-only option.

## Panel props

| Prop | Purpose |
| --- | --- |
| `position` | `bottom-right`, `bottom-left`, `top-right`, or `top-left`. |
| `theme` | Partial override of the panel's CSS custom-property theme. |
| `labels` | Partial text override, including nested `instructions`. |
| `className` | Class for the panel container. |
| `classNames` | Classes for header, actions, region list, file field, and hidden bar slots. |
| `pathname` | Route value used to trigger region refresh, useful for Next.js. |
| `searchKey` | Search-state value used to trigger region refresh. |
| `scriptSrc` | Alternative capture-script URL. |
| `nonce` | CSP nonce placed on the capture script element. |
| `integrity` | SRI value placed on the capture script element. |
| `crossOrigin` | `anonymous` or `use-credentials` on the capture script. |
| `onCaptureActivate` | Callback after the activation handler runs. |
| `onRegionSelect` | Callback with the selected `RegionEntry`. |

## Theme overrides

`theme` accepts a partial object. Current keys are:

```tsx
<FigmaCapturePanel
  theme={{
    panelBg: '#10131a',
    borderColor: '#2d3340',
    borderRadius: '12px',
    accentColor: '#8b5cf6',
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    gap: '10px',
    padding: '12px',
    zIndex: 10000,
  }}
/>
```

Only provide the tokens you need to change.

## Label overrides

Labels are merged with defaults, including the nested instruction object and operational feedback messages:

```tsx
<FigmaCapturePanel
  labels={{
    panelTitle: 'Design handoff',
    activateCapture: 'Prepare URL',
    captureActivated: 'Capture ready. Copy the browser URL.',
    fileRefInvalid: 'Enter a valid design-file reference.',
    fileOpened: 'Design file opened.',
    instructions: {
      prefix: 'Import',
      entireScreen: 'the full page',
      or: 'or',
      selectElement: 'a named region',
      suffix: 'through HTML to Design.',
    },
  }}
/>
```

The panel now forwards `fileRefInvalid` and `fileOpened` to the file-reference hook, so custom copy is used consistently in validation errors and success announcements.

`regionsCount` is a function. It works with manual React mounting, but function-valued options are intentionally omitted when Vite serializes plugin options.

## Accessibility behavior

The prebuilt panel provides a complementary landmark named by `panelTitle`, associated labels and errors for the Figma file field, pressed state for selected regions, and polite status announcements for capture activation, file opening, and region selection.

- Press `Escape` while focus is inside the expanded panel to collapse it.
- The icon-only file action exposes `openTooltip` as its accessible name.
- Validation errors use `aria-invalid`, `aria-describedby`, and an alert role.
- Region buttons expose `aria-pressed` and remain keyboard-operable native buttons.

Custom `classNames` should preserve visible focus states and sufficient contrast.

## Capture-script controls

```tsx
<FigmaCapturePanel
  scriptSrc="https://assets.example.test/controlled-capture.js"
  nonce={cspNonce}
  integrity="sha384-your-reviewed-digest"
  crossOrigin="anonymous"
/>
```

The example values are placeholders. A consumer that changes `scriptSrc` owns the source, review, availability, and matching integrity digest. The package does not ship a pinned digest for the default external script.

## Route changes

The region hook already observes DOM mutations, `popstate`, and `hashchange`. Framework routers can also pass `pathname` and `searchKey` so a route-state change schedules a refresh:

```tsx
<FigmaCapturePanel pathname={pathname} searchKey={searchParams.toString()} />
```

## Production notes

- The local-origin guard applies to the prebuilt panel and capture script.
- `FigmaTarget`/`figmaTarget()` emit markup wherever they are rendered.
- Headless hooks require the consumer to pass an appropriate `enabled` value.
- A runtime `null` result does not prove the code was removed from a bundle.
- Inspect the production output when bundle exclusion is a requirement.

For a custom UI, continue with [Targets and headless hooks](./targets-and-hooks.md).
