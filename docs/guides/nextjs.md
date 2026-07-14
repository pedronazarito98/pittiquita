# Next.js App Router guide

`pittiquita/next` provides a Client Component that reads the current App Router pathname and mounts the capture panel only in development by default.

## 1. Mount the official integration

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

`PittiquitaNextPanel` already contains the `'use client'` boundary, reads `usePathname()`, and forwards the route to `FigmaCapturePanel`. Region discovery therefore refreshes after App Router navigation.

The component returns `null` outside `development` by default. The panel also keeps its localhost runtime guard, so both conditions must pass before UI or the external capture script can appear.

## 2. Apply panel options

The wrapper accepts the same props as `FigmaCapturePanel`, except `pathname`, plus an `enabled` switch:

```tsx
import { PittiquitaNextPanel } from 'pittiquita/next'

export function DevelopmentTools() {
  return (
    <PittiquitaNextPanel
      position="bottom-left"
      labels={{ panelTitle: 'Design handoff' }}
      searchKey="filters-v2"
      onRegionSelect={(region) => console.info(region.id)}
    />
  )
}
```

Use `enabled` when the application has its own environment or feature-flag rule:

```tsx
<PittiquitaNextPanel enabled={process.env.NEXT_PUBLIC_ENABLE_PITTIQUITA === 'true'} />
```

Only expose such a flag in trusted development environments. Localhost is an operational guard, not authentication.

## Migrating from `withPittiquita`

Older versions exported `withPittiquita()` as though it injected the panel through `next.config`. It never mounted UI or applied the supplied options.

The function remains temporarily available as a deprecated identity wrapper so existing configuration files do not break immediately:

```ts
// Legacy compatibility only. Remove this wrapper during migration.
import { withPittiquita } from 'pittiquita/next'

export default withPittiquita({ reactStrictMode: true })
```

Move the actual integration to `PittiquitaNextPanel` in the App Router layout, then remove `withPittiquita` from `next.config`.

## App Router considerations

- The official wrapper is a Client Component and imports `next/navigation`; use this entry point only inside an application that already has Next.js installed.
- `searchKey` can trigger region refreshes when query-driven UI state changes without a pathname change.
- The first activation replaces an unrelated URL hash, so test applications that own hash navigation.
- Only `localhost` and `127.0.0.1` are accepted, regardless of the Next.js dev-server bind address.
- The environment check prevents rendering by default in production, but consumers should still inspect their own build output when bundle exclusion is a requirement.

## Verification checklist

- A development render on `localhost` shows one panel.
- Navigating between App Router routes refreshes marked regions.
- A non-local hostname produces no panel UI.
- Production renders no panel unless `enabled` is explicitly overridden.
- Server rendering produces no browser-global exception from the mounted path.
- Capture activation works with the application's Content Security Policy.

The repository unit-tests the wrapper contract and route-aware mount path. A full Next.js fixture remains useful future coverage for framework-version compatibility.
