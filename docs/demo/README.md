# pittiquita visual demo

This folder contains a short Playwright-generated visual walkthrough of the pittiquita flow:

1. `01-localhost-panel.png` - the playground running on localhost with the capture panel visible.
2. `02-capture-active.png` - capture mode after clicking `Activate capture`.
3. `03-copy-url.png` - the full URL with `#figmacapture=manual` ready to copy.
4. `04-figma-import-step.png` - an illustrative local mock showing where the URL is pasted in Figma's HTML to Design plugin.

The last screen is intentionally a mock. It avoids requiring a Figma login or a real plugin session while still documenting the handoff step accurately.

## Regenerate

```bash
pnpm build
pnpm --dir playground install
pnpm run demo:capture
```

If Playwright cannot find a local browser, run:

```bash
pnpm exec playwright install chromium
```
