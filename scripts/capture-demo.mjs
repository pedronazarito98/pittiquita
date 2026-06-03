import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outputDir = path.join(rootDir, 'docs', 'demo')
const port = Number(process.env.PITTIQUITA_DEMO_PORT ?? 4175)
const baseUrl = `http://127.0.0.1:${port}`
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const childEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key, value]) => value !== undefined && !key.startsWith('=')
  )
)

const screenshotOptions = {
  animations: 'disabled',
  fullPage: false,
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // Keep polling until Vite is ready.
    }

    await wait(300)
  }

  throw new Error(`Timed out waiting for ${url}`)
}

function startPlayground() {
  const command = process.platform === 'win32'
    ? process.env.ComSpec ?? 'cmd.exe'
    : pnpm
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', `pnpm --dir playground dev --host 127.0.0.1 --port ${port}`]
    : ['--dir', 'playground', 'dev', '--host', '127.0.0.1', '--port', String(port)]

  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...childEnv,
      BROWSER: 'none',
    },
  })

  let logs = ''
  child.stdout.on('data', (chunk) => {
    logs += chunk.toString()
  })
  child.stderr.on('data', (chunk) => {
    logs += chunk.toString()
  })

  return {
    stop: async () => {
      if (child.killed) return

      if (process.platform === 'win32' && child.pid) {
        const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
          stdio: 'ignore',
        })
        await once(killer, 'exit')
        return
      }

      child.kill()
      await once(child, 'exit')
    },
    getLogs: () => logs,
  }
}

async function launchBrowser() {
  const channel = process.env.PLAYWRIGHT_CHANNEL ?? 'msedge'

  try {
    return await chromium.launch({ channel })
  } catch (channelError) {
    try {
      return await chromium.launch()
    } catch (defaultError) {
      throw new Error(
        [
          `Could not launch Playwright Chromium or ${channel}.`,
          'Run `pnpm exec playwright install chromium` or set PLAYWRIGHT_CHANNEL to an installed browser channel.',
          `Channel error: ${channelError.message}`,
          `Default error: ${defaultError.message}`,
        ].join('\n')
      )
    }
  }
}

async function addOverlay(page, title, body, extra = '') {
  await page.evaluate(
    ({ title, body, extra }) => {
      document.querySelectorAll('[data-pittiquita-demo-overlay]').forEach((node) => node.remove())

      const overlay = document.createElement('div')
      overlay.dataset.pittiquitaDemoOverlay = 'true'
      overlay.innerHTML = `
        <div class="pittiquita-demo-label">${title}</div>
        <div class="pittiquita-demo-body">${body}</div>
        ${extra ? `<div class="pittiquita-demo-extra">${extra}</div>` : ''}
      `

      Object.assign(overlay.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: '999999',
        width: 'min(560px, calc(100vw - 40px))',
        boxSizing: 'border-box',
        padding: '16px 18px',
        border: '1px solid rgba(15, 23, 42, 0.14)',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.96)',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
        color: '#0f172a',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      })

      const style = document.createElement('style')
      style.dataset.pittiquitaDemoOverlay = 'true'
      style.textContent = `
        .pittiquita-demo-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4f46e5;
          margin-bottom: 6px;
        }
        .pittiquita-demo-body {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.25;
        }
        .pittiquita-demo-extra {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 12px;
          overflow-wrap: anywhere;
        }
      `

      document.head.appendChild(style)
      document.body.appendChild(overlay)
    },
    { title, body, extra }
  )
}

async function renderFigmaMock(page, captureUrl) {
  await page.setContent(
    `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HTML to Design import step</title>
        <style>
          :root {
            color-scheme: light;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #111827;
            background: #f5f7fb;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            grid-template-columns: 280px minmax(0, 1fr) 380px;
            background:
              linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
              linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
              #f8fafc;
            background-size: 24px 24px;
          }
          aside {
            background: #ffffff;
            border-right: 1px solid #e5e7eb;
            padding: 20px;
          }
          main {
            padding: 40px;
            display: grid;
            place-items: center;
          }
          .canvas {
            width: min(720px, 100%);
            aspect-ratio: 4 / 3;
            background: white;
            border: 1px solid #dbe3ef;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
            padding: 34px;
            display: grid;
            gap: 18px;
            align-content: start;
          }
          .node {
            border: 1px solid #c7d2fe;
            background: #eef2ff;
            border-radius: 10px;
            padding: 18px;
          }
          .row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
          .panel {
            background: #ffffff;
            border-left: 1px solid #e5e7eb;
            padding: 22px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .plugin-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
          }
          .plugin-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #111827;
            color: white;
            display: grid;
            place-items: center;
            font-weight: 800;
          }
          .field {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px;
            color: #334155;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px;
            overflow-wrap: anywhere;
            background: #f8fafc;
          }
          .button {
            border: 0;
            border-radius: 10px;
            background: #4f46e5;
            color: white;
            padding: 12px 14px;
            text-align: center;
            font-weight: 800;
          }
          .note {
            color: #64748b;
            font-size: 13px;
            line-height: 1.5;
          }
          h1, h2, p { margin: 0; }
          h1 { font-size: 22px; }
          h2 { font-size: 14px; color: #475569; }
        </style>
      </head>
      <body>
        <aside>
          <h2>Local demonstration</h2>
          <p class="note" style="margin-top: 10px;">
            This screen is an honest mock of the Figma plugin step. It does not require a Figma login.
          </p>
        </aside>
        <main>
          <div class="canvas">
            <div class="node">
              <h1>Imported localhost component</h1>
              <p class="note" style="margin-top: 8px;">HTML to Design recreates the selected page or region as editable Figma layers.</p>
            </div>
            <div class="row">
              <div class="node">Hero</div>
              <div class="node">Stats cards</div>
              <div class="node">Event log</div>
            </div>
          </div>
        </main>
        <section class="panel">
          <div class="plugin-title">
            <div class="plugin-icon">H</div>
            <div>
              <h1>HTML to Design</h1>
              <p class="note">Import from URL</p>
            </div>
          </div>
          <div>
            <h2>Paste the pittiquita capture URL</h2>
            <div class="field">${captureUrl}</div>
          </div>
          <div class="button">Import</div>
          <p class="note">
            Illustrative step: in a real workflow, paste this URL into the Figma community plugin.
          </p>
        </section>
      </body>
    </html>`
  )
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const server = startPlayground()
  let browser

  try {
    await waitForServer(baseUrl)
    browser = await launchBrowser()

    const page = await browser.newPage({ viewport: { width: 1365, height: 900 } })
    await page.route('https://mcp.figma.com/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'window.__pittiquitaDemoCaptureLoaded = true;',
      })
    )

    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.locator('[data-figma-helper="true"]').waitFor()
    await addOverlay(
      page,
      'Step 1 - localhost',
      'Open the app in development. The pittiquita capture panel appears only on localhost.'
    )
    await page.screenshot({
      path: path.join(outputDir, '01-localhost-panel.png'),
      ...screenshotOptions,
    })

    await page.getByRole('button', { name: 'Activate capture' }).click()
    await page.waitForFunction(() => window.location.hash.includes('figmacapture='))
    await addOverlay(
      page,
      'Step 2 - activate capture',
      'The URL receives the capture hash and the page is ready for the Figma HTML to Design script.'
    )
    await page.screenshot({
      path: path.join(outputDir, '02-capture-active.png'),
      ...screenshotOptions,
    })

    const captureUrl = page.url()
    await addOverlay(
      page,
      'Step 3 - copy URL',
      'Copy the full localhost URL, including the hash, and use it as the import source.',
      captureUrl
    )
    await page.screenshot({
      path: path.join(outputDir, '03-copy-url.png'),
      ...screenshotOptions,
    })

    await renderFigmaMock(page, captureUrl)
    await page.screenshot({
      path: path.join(outputDir, '04-figma-import-step.png'),
      ...screenshotOptions,
    })

    await writeFile(
      path.join(outputDir, 'README.md'),
      `# Demo visual do pittiquita

Esta pasta contem um walkthrough visual curto gerado com Playwright para o fluxo do pittiquita:

1. \`01-localhost-panel.png\` - o playground rodando em localhost com o painel de captura visivel.
2. \`02-capture-active.png\` - modo de captura apos clicar em \`Activate capture\`.
3. \`03-copy-url.png\` - URL completa com \`#figmacapture=manual\` pronta para copiar.
4. \`04-figma-import-step.png\` - mock local ilustrativo mostrando onde a URL e colada no plugin HTML to Design do Figma.

A ultima tela e intencionalmente um mock. Ela evita exigir login no Figma ou uma sessao real do plugin, mas documenta o passo de handoff com honestidade.

**Idioma:** Portugues (padrao) | [English](./README.en.md)

## Regenerar

\`\`\`bash
pnpm build
pnpm --dir playground install
pnpm run demo:capture
\`\`\`

Se o Playwright nao encontrar um navegador local, rode:

\`\`\`bash
pnpm exec playwright install chromium
\`\`\`
`,
      'utf8'
    )
    await writeFile(
      path.join(outputDir, 'README.en.md'),
      `# pittiquita visual demo

This folder contains a short Playwright-generated visual walkthrough of the pittiquita flow:

1. \`01-localhost-panel.png\` - the playground running on localhost with the capture panel visible.
2. \`02-capture-active.png\` - capture mode after clicking \`Activate capture\`.
3. \`03-copy-url.png\` - the full URL with \`#figmacapture=manual\` ready to copy.
4. \`04-figma-import-step.png\` - an illustrative local mock showing where the URL is pasted in Figma's HTML to Design plugin.

The last screen is intentionally a mock. It avoids requiring a Figma login or a real plugin session while still documenting the handoff step accurately.

**Language:** [Portugues (default)](./README.md) | English

## Regenerate

\`\`\`bash
pnpm build
pnpm --dir playground install
pnpm run demo:capture
\`\`\`

If Playwright cannot find a local browser, run:

\`\`\`bash
pnpm exec playwright install chromium
\`\`\`
`,
      'utf8'
    )
  } catch (error) {
    const logs = server.getLogs()
    throw new Error(`${error.message}\n\nPlayground logs:\n${logs}`)
  } finally {
    if (browser) await browser.close()
    await server.stop()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
