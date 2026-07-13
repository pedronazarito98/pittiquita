import { spawn } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  DEMO_GIF,
  DEMO_SCREENSHOTS,
  DEMO_VIDEO,
  FIGMA_MOCK_LABEL,
  FIGMA_MOCK_NOTE,
  VIDEO_SIZE,
  parseDemoPort,
  resolveDemoPaths,
} from './demo/config.mjs'
import { renderFigmaMockHtml } from './demo/figma-mock.mjs'
import {
  assertMediaTools,
  createGifFromVideo,
  createVideoFromScreenshots,
  normalizeRecordedVideo,
} from './demo/media.mjs'
import {
  createCleanupStack,
  createLogBuffer,
  terminateProcessTree,
  wait,
  waitForServer,
} from './demo/runtime.mjs'
import {
  formatValidationReport,
  validateDemoArtifacts,
} from './demo/validation.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPaths = resolveDemoPaths(rootDir)
const port = parseDemoPort()
const baseUrl = `http://127.0.0.1:${port}`
const captureScriptUrl = 'https://mcp.figma.com/mcp/html-to-design/capture.js'

const childEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key, value]) => value !== undefined && !key.startsWith('=')
  )
)

function parseCommandLine(args) {
  const knownFlags = new Set(['--', '--screenshots', '--record', '--from-screenshots'])
  const unknownFlags = args.filter((argument) => !knownFlags.has(argument))

  if (unknownFlags.length > 0) {
    throw new Error(`Unknown demo option(s): ${unknownFlags.join(', ')}`)
  }
  if (args.includes('--screenshots') && args.includes('--record')) {
    throw new Error('Choose either --screenshots or --record, not both')
  }

  const mode = args.includes('--record') ? 'record' : 'screenshots'
  const fromScreenshots =
    args.includes('--from-screenshots') ||
    process.env.PITTIQUITA_DEMO_FROM_SCREENSHOTS === '1'

  if (fromScreenshots && mode !== 'record') {
    throw new Error('--from-screenshots is only supported together with --record')
  }

  return { mode, fromScreenshots }
}

function startPlayground() {
  const pnpmExecPath = process.env.npm_execpath
  const canReusePnpmProcess = pnpmExecPath?.includes('pnpm')
  const command = canReusePnpmProcess
    ? process.execPath
    : process.platform === 'win32'
      ? process.env.ComSpec ?? 'cmd.exe'
      : 'pnpm'
  const args = canReusePnpmProcess
    ? [
        pnpmExecPath,
        '--dir',
        'playground',
        'dev',
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
        '--strictPort',
      ]
    : process.platform === 'win32'
      ? ['/d', '/s', '/c', `pnpm --dir playground dev --host 127.0.0.1 --port ${port} --strictPort`]
      : [
          '--dir',
          'playground',
          'dev',
          '--host',
          '127.0.0.1',
          '--port',
          String(port),
          '--strictPort',
        ]
  const logs = createLogBuffer()
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: process.platform !== 'win32',
    windowsHide: true,
    env: {
      ...childEnv,
      BROWSER: 'none',
    },
  })

  child.stdout.on('data', (chunk) => logs.append(chunk))
  child.stderr.on('data', (chunk) => logs.append(chunk))

  const exited = new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => resolve({ code, signal }))
  })

  return {
    exited,
    getLogs: () => logs.read(),
    stop: () => terminateProcessTree(child),
  }
}

async function launchBrowser() {
  let chromium

  try {
    const playwright = await import('playwright')
    chromium = playwright.chromium
  } catch (error) {
    throw new Error(
      `Playwright is not installed. Run \`pnpm install --frozen-lockfile\`.\n${error.message}`
    )
  }

  const requestedChannel = process.env.PLAYWRIGHT_CHANNEL
  let channelError

  if (requestedChannel) {
    try {
      return await chromium.launch({ channel: requestedChannel })
    } catch (error) {
      channelError = error
    }
  }

  try {
    return await chromium.launch()
  } catch (defaultError) {
    throw new Error(
      [
        'Could not launch Playwright Chromium.',
        'Run `pnpm exec playwright install chromium` or set PLAYWRIGHT_CHANNEL to an installed channel.',
        channelError ? `Channel ${requestedChannel}: ${channelError.message}` : '',
        `Bundled Chromium: ${defaultError.message}`,
      ]
        .filter(Boolean)
        .join('\n')
    )
  }
}

async function configureNetworkIsolation(context) {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: baseUrl,
  })
  await context.route('**/*', async (route) => {
    const requestUrl = route.request().url()

    if (requestUrl === captureScriptUrl) {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'window.__pittiquitaDemoCaptureLoaded = true;',
      })
      return
    }

    const url = new URL(requestUrl)
    if (url.origin === baseUrl) {
      await route.continue()
      return
    }

    await route.abort('blockedbyclient')
  })
}

async function showOverlay(
  page,
  { eyebrow, title, detail = '', copyValue = '' }
) {
  await page.evaluate(
    ({ eyebrow, title, detail, copyValue }) => {
      document
        .querySelectorAll('[data-pittiquita-demo-overlay]')
        .forEach((node) => node.remove())

      const style = document.createElement('style')
      style.dataset.pittiquitaDemoOverlay = 'true'
      style.textContent = `
        .pittiquita-demo-overlay {
          position: fixed;
          top: 18px;
          left: 18px;
          z-index: 999999;
          width: min(560px, calc(100vw - 36px));
          box-sizing: border-box;
          padding: 15px 17px;
          border: 1px solid rgba(15, 23, 42, 0.14);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.16);
          color: #0f172a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .pittiquita-demo-eyebrow {
          color: #4f46e5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pittiquita-demo-title { margin-top: 5px; font-size: 18px; font-weight: 750; line-height: 1.25; }
        .pittiquita-demo-detail { margin-top: 7px; color: #475569; font-size: 13px; line-height: 1.4; }
        .pittiquita-demo-copy-row { display: flex; gap: 8px; margin-top: 10px; }
        .pittiquita-demo-url {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          padding: 9px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          color: #334155;
          font: 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pittiquita-demo-copy {
          border: 0;
          border-radius: 8px;
          background: #4f46e5;
          color: white;
          cursor: pointer;
          padding: 0 14px;
          font-weight: 800;
        }
      `

      const overlay = document.createElement('section')
      overlay.className = 'pittiquita-demo-overlay'
      overlay.dataset.pittiquitaDemoOverlay = 'true'

      const eyebrowNode = document.createElement('div')
      eyebrowNode.className = 'pittiquita-demo-eyebrow'
      eyebrowNode.textContent = eyebrow
      overlay.appendChild(eyebrowNode)

      const titleNode = document.createElement('div')
      titleNode.className = 'pittiquita-demo-title'
      titleNode.textContent = title
      overlay.appendChild(titleNode)

      if (detail) {
        const detailNode = document.createElement('div')
        detailNode.className = 'pittiquita-demo-detail'
        detailNode.textContent = detail
        overlay.appendChild(detailNode)
      }

      if (copyValue) {
        const row = document.createElement('div')
        row.className = 'pittiquita-demo-copy-row'
        const urlNode = document.createElement('div')
        urlNode.className = 'pittiquita-demo-url'
        urlNode.textContent = copyValue
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'pittiquita-demo-copy'
        button.dataset.pittiquitaDemoCopy = 'true'
        button.textContent = 'Copy URL'
        button.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(copyValue)
            button.textContent = 'Copied'
          } catch {
            button.textContent = 'Copy shown'
          }
        })
        row.append(urlNode, button)
        overlay.appendChild(row)
      }

      document.head.appendChild(style)
      document.body.appendChild(overlay)
    },
    { eyebrow, title, detail, copyValue }
  )
}

async function runTimeline(page, screenshotPaths, recording) {
  const pause = (milliseconds) => recording ? wait(milliseconds) : Promise.resolve()

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-figma-helper="true"]').waitFor()
  await showOverlay(page, {
    eyebrow: 'Step 1 · localhost',
    title: 'Open the local app and inspect the marked regions.',
    detail: 'The pittiquita panel is available only during local development.',
  })
  await page.screenshot({ path: screenshotPaths[0], animations: 'disabled' })
  await pause(1500)

  await showOverlay(page, {
    eyebrow: 'Step 2 · choose a region',
    title: 'Select the Hero region from the capture panel.',
    detail: 'pittiquita discovers data-figma-target regions in the live page.',
  })
  const heroRegion = page.getByRole('button', { name: 'Hero', exact: true })
  await heroRegion.hover()
  await pause(450)
  await heroRegion.click()
  await showOverlay(page, {
    eyebrow: 'Step 2 · region selected',
    title: 'The Hero region is selected and visible in the page.',
    detail: 'Captured immediately after pittiquita navigates to the named target.',
  })
  await page.screenshot({ path: screenshotPaths[1], animations: 'disabled' })
  await pause(1100)

  await showOverlay(page, {
    eyebrow: 'Step 3 · activate capture',
    title: 'Activate capture for the current localhost page.',
  })
  const activateButton = page.getByRole('button', {
    name: 'Activate capture',
    exact: true,
  })
  await activateButton.hover()
  await pause(350)
  await activateButton.click()
  await page.waitForFunction(() => window.location.hash.includes('figmacapture='))
  await showOverlay(page, {
    eyebrow: 'Step 3 · capture active',
    title: 'The capture hash is now part of the local URL.',
    detail: 'The external capture script is intercepted with a local no-op during this demo.',
  })
  await page.screenshot({ path: screenshotPaths[2], animations: 'disabled' })
  await pause(1400)

  const captureUrl = page.url()
  await showOverlay(page, {
    eyebrow: 'Step 4 · demo overlay · browser copy',
    title: 'Copy the complete localhost URL for the handoff.',
    detail: 'This temporary demo control uses the browser clipboard. It is not a pittiquita product feature.',
    copyValue: captureUrl,
  })
  await page.screenshot({ path: screenshotPaths[3], animations: 'disabled' })
  await pause(500)
  const copyButton = page.locator('[data-pittiquita-demo-copy="true"]')
  await copyButton.hover()
  await copyButton.click()
  await pause(1400)

  await page.setContent(renderFigmaMockHtml(captureUrl))
  await page.getByText(FIGMA_MOCK_LABEL, { exact: true }).waitFor()
  await page.getByText(FIGMA_MOCK_NOTE, { exact: true }).waitFor()
  await page.screenshot({ path: screenshotPaths[4], animations: 'disabled' })
  await pause(3000)
}

async function copyGeneratedFiles(sourceFiles, destinationFiles) {
  await mkdir(outputPaths.outputDir, { recursive: true })

  for (let index = 0; index < sourceFiles.length; index += 1) {
    await copyFile(sourceFiles[index], destinationFiles[index])
  }
}

async function recordFromVersionedScreenshots(tempDir) {
  await assertMediaTools()
  const tempVideo = path.join(tempDir, DEMO_VIDEO)
  const tempGif = path.join(tempDir, DEMO_GIF)

  console.log('Using the explicit screenshot fallback; Chromium is not being launched.')
  await createVideoFromScreenshots(outputPaths.screenshots, tempVideo)
  await createGifFromVideo(tempVideo, tempGif)
  await copyGeneratedFiles(
    [tempVideo, tempGif],
    [outputPaths.video, outputPaths.gif]
  )
}

async function captureWithPlaywright({ mode, tempDir, cleanup }) {
  const recording = mode === 'record'
  if (recording) await assertMediaTools()

  const tempScreenshots = DEMO_SCREENSHOTS.map((fileName) =>
    path.join(tempDir, fileName)
  )
  const server = startPlayground()
  cleanup.add(() => server.stop())

  const readinessController = new AbortController()
  try {
    await Promise.race([
      waitForServer(baseUrl, { signal: readinessController.signal }),
      server.exited.then(({ code, signal }) => {
        readinessController.abort(new Error('Playground exited'))
        throw new Error(
          `Playground exited before becoming ready (${code ?? signal ?? 'unknown status'}).\n${server.getLogs()}`
        )
      }),
    ])
  } finally {
    readinessController.abort(new Error('Playground readiness resolved'))
  }

  const browser = await launchBrowser()
  let browserClosed = false
  cleanup.add(async () => {
    if (!browserClosed) await browser.close()
  })

  const context = await browser.newContext({
    viewport: VIDEO_SIZE,
    recordVideo: recording
      ? { dir: tempDir, size: VIDEO_SIZE }
      : undefined,
  })
  let contextClosed = false
  cleanup.add(async () => {
    if (!contextClosed) await context.close()
  })
  await configureNetworkIsolation(context)

  const page = await context.newPage()
  const rawVideo = recording ? page.video() : undefined
  await runTimeline(page, tempScreenshots, recording)
  await page.close()
  await context.close()
  contextClosed = true

  const generatedFiles = [...tempScreenshots]
  const destinationFiles = [...outputPaths.screenshots]

  if (recording) {
    const rawVideoPath = path.join(tempDir, 'playwright-raw.webm')
    const tempVideo = path.join(tempDir, DEMO_VIDEO)
    const tempGif = path.join(tempDir, DEMO_GIF)

    await rawVideo.saveAs(rawVideoPath)
    await normalizeRecordedVideo(rawVideoPath, tempVideo)
    await createGifFromVideo(tempVideo, tempGif)
    generatedFiles.push(tempVideo, tempGif)
    destinationFiles.push(outputPaths.video, outputPaths.gif)
  }

  await browser.close()
  browserClosed = true
  await copyGeneratedFiles(generatedFiles, destinationFiles)
}

function installSignalCleanup(cleanup) {
  let handlingSignal = false
  const handlers = new Map()

  for (const [signal, exitCode] of [
    ['SIGINT', 130],
    ['SIGTERM', 143],
  ]) {
    const handler = () => {
      if (handlingSignal) return
      handlingSignal = true
      console.error(`Received ${signal}; cleaning up the demo process...`)
      cleanup
        .run()
        .catch((error) => console.error(error.message))
        .finally(() => process.exit(exitCode))
    }
    handlers.set(signal, handler)
    process.once(signal, handler)
  }

  return () => {
    for (const [signal, handler] of handlers) process.off(signal, handler)
  }
}

async function main() {
  const options = parseCommandLine(process.argv.slice(2))
  const cleanup = createCleanupStack()
  const removeSignalHandlers = installSignalCleanup(cleanup)
  const tempDir = await mkdtemp(path.join(tmpdir(), 'pittiquita-demo-'))
  cleanup.add(() => rm(tempDir, { recursive: true, force: true }))
  let primaryError

  try {
    if (options.fromScreenshots) {
      await recordFromVersionedScreenshots(tempDir)
    } else {
      await captureWithPlaywright({
        mode: options.mode,
        tempDir,
        cleanup,
      })
    }

    if (options.mode === 'record') {
      const report = await validateDemoArtifacts(rootDir)
      console.log(formatValidationReport(report))
    } else {
      console.log(`Captured ${DEMO_SCREENSHOTS.length} screenshots in docs/demo.`)
    }
  } catch (error) {
    primaryError = error
    throw error
  } finally {
    removeSignalHandlers()
    try {
      await cleanup.run()
    } catch (cleanupError) {
      if (primaryError) {
        console.error(`Cleanup also failed: ${cleanupError.message}`)
      } else {
        throw cleanupError
      }
    }
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
