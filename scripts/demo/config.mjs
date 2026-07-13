import path from 'node:path'

export const DEMO_SCREENSHOTS = [
  '01-localhost-panel.png',
  '02-region-selected.png',
  '02-capture-active.png',
  '03-copy-url.png',
  '04-figma-import-step.png',
]

export const DEMO_VIDEO = 'pittiquita-flow.webm'
export const DEMO_GIF = 'pittiquita-flow.gif'

export const FIGMA_MOCK_LABEL = 'Illustrative Figma step'
export const FIGMA_MOCK_NOTE = 'Local mock — no Figma login required'

export const VIDEO_SIZE = {
  width: 1280,
  height: 720,
}

export const DEMO_DURATION = {
  minSeconds: 8,
  maxSeconds: 15,
}

export const DEMO_BUDGETS = {
  screenshotBytes: 500 * 1024,
  gifBytes: 4 * 1024 * 1024,
  videoBytes: 3 * 1024 * 1024,
  totalBytes: 9 * 1024 * 1024,
}

export const DEMO_MINIMUM_SIZE = {
  width: 640,
  height: 360,
}

export function parseDemoPort(value = process.env.PITTIQUITA_DEMO_PORT) {
  const candidate = value === undefined || value === '' ? 4175 : Number(value)

  if (!Number.isInteger(candidate) || candidate < 1 || candidate > 65535) {
    throw new Error(
      `PITTIQUITA_DEMO_PORT must be an integer between 1 and 65535; received ${String(value)}`
    )
  }

  return candidate
}

export function resolveDemoPaths(rootDir) {
  const outputDir = path.join(rootDir, 'docs', 'demo')

  return {
    outputDir,
    screenshots: DEMO_SCREENSHOTS.map((fileName) => path.join(outputDir, fileName)),
    video: path.join(outputDir, DEMO_VIDEO),
    gif: path.join(outputDir, DEMO_GIF),
  }
}

export function hasFigmaMockMarkers(content) {
  return content.includes(FIGMA_MOCK_LABEL) && content.includes(FIGMA_MOCK_NOTE)
}
