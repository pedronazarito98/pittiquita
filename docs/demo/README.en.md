# Reproducible pittiquita demo

This folder contains the short, reproducible React → pittiquita → HTML to Design walkthrough. The automation opens only the local playground, selects a region, activates capture, copies the hashed URL, and ends on a clearly identified local mock.

> **Illustrative Figma step** · **Local mock — no Figma login required**
>
> The final screen documents the HTML to Design handoff. It does not simulate an authenticated import, access a Figma account, or send the URL to an external service.

**Language:** [Português (default)](./README.md) | English

## Versioned artifacts

| File | Content | Budget |
| --- | --- | ---: |
| `01-localhost-panel.png` | Local playground, panel, and marked regions | 500 KiB |
| `02-region-selected.png` | Selected Hero region; in fallback mode, the action is identified by a `DEMO` annotation | 500 KiB |
| `02-capture-active.png` | Active capture and local hash | 500 KiB |
| `03-copy-url.png` | Temporary demo overlay that copies the URL through the browser | 500 KiB |
| `04-figma-import-step.png` | Labeled illustrative handoff mock | 500 KiB |
| `pittiquita-flow.webm` | Full VP9 flow, between 8 and 15 seconds | 3 MiB |
| `pittiquita-flow.gif` | The same flow, converted from the WebM | 4 MiB |

The total budget is 9 MiB. The GIF, WebM, and screenshots are versioned because they are part of the repository's first-visit experience and must render without a build, an external service, or a Figma account.

## Standard regeneration

Prerequisites:

- Node.js 20 or newer and pnpm 10;
- Chromium installed by Playwright;
- `ffmpeg` and `ffprobe` 6 or newer available on `PATH`.

From a clean clone:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm --dir playground install --frozen-lockfile
pnpm exec playwright install chromium
pnpm demo:record
pnpm demo:check
```

`demo:record` regenerates the five PNGs, records the WebM with Playwright, converts that same video into the GIF, and runs the full validation. `demo:capture` regenerates only the PNGs. `demo:check` does not trust file extensions alone: it uses `ffprobe` to inspect streams and `ffmpeg` to decode all seven files.

The “Copy URL” control shown in step 3 belongs only to the automation's temporary overlay and uses the browser Clipboard API. It is not a pittiquita API, button, or advertised native capability; it merely makes the browser's manual copy action visible in the recording.

## Install ffmpeg

| System | Example |
| --- | --- |
| Ubuntu/Debian | `sudo apt-get update && sudo apt-get install ffmpeg` |
| macOS | `brew install ffmpeg` |
| Windows | `winget install Gyan.FFmpeg` or `choco install ffmpeg` |

On Windows, open a new terminal after installation and confirm `ffmpeg -version` and `ffprobe -version`. Custom executable paths are supported through the variables below.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PITTIQUITA_DEMO_PORT` | `4175` | Local port from 1 to 65535; Vite uses `--strictPort` |
| `PLAYWRIGHT_CHANNEL` | Playwright Chromium | Optional local channel such as `chrome` or `msedge` |
| `PITTIQUITA_FFMPEG_PATH` | `ffmpeg` | Encoder executable path |
| `PITTIQUITA_FFPROBE_PATH` | `ffprobe` | Probe executable path |
| `PITTIQUITA_DEMO_FROM_SCREENSHOTS` | disabled | Explicit fallback equivalent to `--from-screenshots` |

Example with another port:

```bash
PITTIQUITA_DEMO_PORT=5180 pnpm demo:record
```

PowerShell:

```powershell
$env:PITTIQUITA_DEMO_PORT = '5180'
pnpm demo:record
```

## Browserless fallback

When Chromium cannot be installed, the animated artifacts can be rebuilt deterministically from the five versioned PNGs:

```bash
pnpm demo:record -- --from-screenshots
pnpm demo:check
```

This fallback is deliberately explicit and prints that the browser was not launched. In `02-region-selected.png`, the frame and `DEMO · Hero selected` label are a visual annotation added over a real screenshot to make the action unambiguous; they are not native pittiquita UI. The fallback preserves the sequence and duration, but it **does not replace** the Playwright gate: it cannot prove that the current playground still generates the screenshots. Before a release, run `pnpm demo:record` without the fallback on a suitable machine or in the Chromium workflow.

## Isolation and cleanup

- No `.env`, token, private data, or login is used.
- The only allowed origin is `http://127.0.0.1:<port>`.
- The remote capture script is intercepted by a local no-op; every other external request is blocked.
- Browser, context, and Vite server close in order on failures and on `SIGINT`/`SIGTERM`.
- The server uses its own process group on Linux/macOS and `taskkill /T` on Windows.
- Raw videos and intermediate files stay in the operating system's temporary directory and are removed at the end.
- Playground logs are bounded in memory and included in the error if the server exits before it becomes ready.

## CI

The main CI runs the lightweight tests and `pnpm demo:check` against the versioned binaries. The **Reproducible demo** workflow installs Chromium and ffmpeg, regenerates media when demo files change or on manual dispatch, validates the result, and uploads the PNG, GIF, and WebM files for visual inspection.

The full workflow does not need to run on pull requests unrelated to the demo. This keeps the common gate fast while retaining a real browser check whenever the automation changes.

## Troubleshooting

### Chromium was not found

```bash
pnpm exec playwright install chromium
```

On minimal Linux/CI images, use `pnpm exec playwright install --with-deps chromium`. If a system browser is already available, try `PLAYWRIGHT_CHANNEL=chrome` or `PLAYWRIGHT_CHANNEL=msedge`.

### The port is busy

Choose another port with `PITTIQUITA_DEMO_PORT`. Invalid values fail before any process starts, and `--strictPort` prevents Vite from silently moving to a different port.

### ffmpeg or ffprobe was not found

Confirm both commands are on `PATH`, or set `PITTIQUITA_FFMPEG_PATH` and `PITTIQUITA_FFPROBE_PATH`. Both should come from the same ffmpeg installation.

### A budget or duration check failed

Run `pnpm demo:check`; its report includes the measured dimensions, codec, duration, and size of every file. Do not increase a budget before investigating resolution, FPS, idle time, and visual regressions.

### The process was interrupted

Cleanup waits up to five seconds and then forces the process tree to exit. If the port remains occupied, terminate the residual process manually and record the operating system and displayed logs so the issue can be reproduced.
