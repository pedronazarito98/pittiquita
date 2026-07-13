# Next.js App Router guide

Next.js integration currently uses an explicit Client Component. This is a documented path, not an automated framework integration test.

## 1. Create the client boundary

```tsx
// app/pittiquita-panel.tsx
'use client'

import { usePathname } from 'next/navigation'
import { FigmaCapturePanel } from 'pittiquita'

export function PittiquitaPanel() {
  const pathname = usePathname()

  return <FigmaCapturePanel pathname={pathname} />
}
```

Passing `pathname` prompts region discovery to refresh after an App Router navigation.

## 2. Mount only in development

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

The environment condition expresses the intended build boundary. Confirm its effect against your Next.js version and output mode; the panel's own localhost check is a runtime UI guard, not a universal bundle-size guarantee.

## What `pittiquita/next` does today

The package exports `withPittiquita()` from `pittiquita/next`, preserving the four-entry-point package contract. In the current implementation:

- production returns the supplied config unchanged;
- development wraps the existing webpack callback/entry flow;
- supplied pittiquita options are not mounted or applied to UI;
- no bootstrap component is injected.

Therefore this guide does not use `withPittiquita()`. Do not describe it as automatic panel injection.

## App Router considerations

- `FigmaCapturePanel` must be rendered below a `'use client'` boundary because it uses hooks and browser state.
- Pass `pathname` when client-side route changes should refresh regions.
- You can also pass a stable `searchKey` string when query-state changes matter.
- The first activation replaces an unrelated URL hash, so test hash-based application behavior.
- Only `localhost` and `127.0.0.1` are accepted, regardless of the Next.js dev-server bind address.

## Verification checklist

- A development render on `localhost` shows one panel.
- Navigating between App Router routes refreshes marked regions.
- A non-local hostname produces no panel UI.
- The production output follows your intended environment/bundle boundary.
- Server rendering produces no browser-global exception from the mounted path.
- Capture activation works with your Content Security Policy.

The repository does not currently include Next.js as a development dependency or run this checklist in CI. Contributions that add a focused fixture are welcome; see [CONTRIBUTING.md](../../CONTRIBUTING.md).
