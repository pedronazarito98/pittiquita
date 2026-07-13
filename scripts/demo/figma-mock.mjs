import { FIGMA_MOCK_LABEL, FIGMA_MOCK_NOTE } from './config.mjs'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function renderFigmaMockHtml(captureUrl) {
  const safeCaptureUrl = escapeHtml(captureUrl)

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${FIGMA_MOCK_LABEL}</title>
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
          grid-template-columns: 250px minmax(0, 1fr) 350px;
          background:
            linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            #f8fafc;
          background-size: 24px 24px;
        }
        aside, .panel { background: #ffffff; padding: 22px; }
        aside { border-right: 1px solid #e5e7eb; }
        main { padding: 32px; display: grid; place-items: center; }
        .badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 7px 10px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .canvas {
          width: min(650px, 100%);
          aspect-ratio: 4 / 3;
          background: white;
          border: 1px solid #dbe3ef;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
          padding: 30px;
          display: grid;
          gap: 16px;
          align-content: start;
        }
        .node { border: 1px solid #c7d2fe; background: #eef2ff; border-radius: 10px; padding: 16px; }
        .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .panel { border-left: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 18px; }
        .plugin-title { display: flex; align-items: center; gap: 10px; font-weight: 800; }
        .plugin-icon { width: 32px; height: 32px; border-radius: 8px; background: #111827; color: white; display: grid; place-items: center; font-weight: 800; }
        .field { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; color: #334155; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; overflow-wrap: anywhere; background: #f8fafc; }
        .button { border: 0; border-radius: 10px; background: #4f46e5; color: white; padding: 12px 14px; text-align: center; font-weight: 800; }
        .note { color: #64748b; font-size: 13px; line-height: 1.5; }
        h1, h2, p { margin: 0; }
        h1 { font-size: 22px; }
        h2 { font-size: 14px; color: #475569; }
      </style>
    </head>
    <body>
      <aside>
        <span class="badge">${FIGMA_MOCK_LABEL}</span>
        <h1 style="margin-top: 16px;">${FIGMA_MOCK_NOTE}</h1>
        <p class="note" style="margin-top: 10px;">
          This local screen documents the handoff. It does not simulate an authenticated import.
        </p>
      </aside>
      <main>
        <div class="canvas">
          <div class="node">
            <h1>Illustrative imported component</h1>
            <p class="note" style="margin-top: 8px;">In the real workflow, HTML to Design recreates the selected page or region as editable Figma layers.</p>
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
          <div><h1>HTML to Design</h1><p class="note">Import from URL</p></div>
        </div>
        <div>
          <h2>Paste the pittiquita capture URL</h2>
          <div class="field">${safeCaptureUrl}</div>
        </div>
        <div class="button">Import</div>
        <p class="note">Illustrative control only. No request is sent and no Figma account is used in this demo.</p>
      </section>
    </body>
  </html>`
}
