import { stat } from 'node:fs/promises'
import path from 'node:path'

import {
  DEMO_BUDGETS,
  DEMO_DURATION,
  DEMO_GIF,
  DEMO_MINIMUM_SIZE,
  DEMO_SCREENSHOTS,
  DEMO_VIDEO,
  hasFigmaMockMarkers,
  resolveDemoPaths,
} from './config.mjs'
import { renderFigmaMockHtml } from './figma-mock.mjs'
import { assertMediaTools, decodeMedia, probeMedia } from './media.mjs'

function formatMiB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`
}

export function validateArtifactMetadata(artifact, metadata) {
  const errors = []

  if (!Number.isFinite(metadata.bytes) || metadata.bytes <= 0) {
    errors.push(`${artifact.name} is empty`)
  }
  if (
    !Number.isFinite(metadata.width) ||
    !Number.isFinite(metadata.height) ||
    metadata.width < DEMO_MINIMUM_SIZE.width ||
    metadata.height < DEMO_MINIMUM_SIZE.height
  ) {
    errors.push(
      `${artifact.name} has invalid dimensions ${metadata.width}x${metadata.height}; ` +
      `minimum is ${DEMO_MINIMUM_SIZE.width}x${DEMO_MINIMUM_SIZE.height}`
    )
  }
  if (metadata.bytes > artifact.budgetBytes) {
    errors.push(
      `${artifact.name} is ${formatMiB(metadata.bytes)}, above its ${formatMiB(artifact.budgetBytes)} budget`
    )
  }
  if (artifact.codec && metadata.codec !== artifact.codec) {
    errors.push(`${artifact.name} uses ${metadata.codec ?? 'an unknown codec'}; expected ${artifact.codec}`)
  }
  if (artifact.animated) {
    if (
      !Number.isFinite(metadata.durationSeconds) ||
      metadata.durationSeconds < DEMO_DURATION.minSeconds ||
      metadata.durationSeconds > DEMO_DURATION.maxSeconds
    ) {
      errors.push(
        `${artifact.name} lasts ${metadata.durationSeconds}s; expected ${DEMO_DURATION.minSeconds}-${DEMO_DURATION.maxSeconds}s`
      )
    }
  }

  return errors
}

export function expectedArtifacts(rootDir) {
  const paths = resolveDemoPaths(rootDir)

  return [
    ...paths.screenshots.map((filePath) => ({
      name: path.basename(filePath),
      filePath,
      budgetBytes: DEMO_BUDGETS.screenshotBytes,
      codec: 'png',
      animated: false,
    })),
    {
      name: DEMO_GIF,
      filePath: paths.gif,
      budgetBytes: DEMO_BUDGETS.gifBytes,
      codec: 'gif',
      animated: true,
    },
    {
      name: DEMO_VIDEO,
      filePath: paths.video,
      budgetBytes: DEMO_BUDGETS.videoBytes,
      codec: 'vp9',
      animated: true,
    },
  ]
}

export async function validateDemoArtifacts(rootDir, { decode = true } = {}) {
  if (!hasFigmaMockMarkers(renderFigmaMockHtml('http://127.0.0.1/#figmacapture=manual'))) {
    throw new Error('The illustrative Figma mock is missing its required honesty labels')
  }

  await assertMediaTools()

  const artifacts = expectedArtifacts(rootDir)
  const results = []
  const errors = []

  for (const artifact of artifacts) {
    try {
      const fileStat = await stat(artifact.filePath)
      if (!fileStat.isFile() || fileStat.size === 0) {
        errors.push(`${artifact.name} does not exist as a non-empty file`)
        continue
      }

      const metadata = await probeMedia(artifact.filePath)
      if (decode) await decodeMedia(artifact.filePath)
      errors.push(...validateArtifactMetadata(artifact, metadata))
      results.push({ ...artifact, ...metadata })
    } catch (error) {
      errors.push(`${artifact.name}: ${error.message}`)
    }
  }

  const totalBytes = results.reduce((sum, artifact) => sum + artifact.bytes, 0)
  if (totalBytes > DEMO_BUDGETS.totalBytes) {
    errors.push(
      `Demo assets total ${formatMiB(totalBytes)}, above the ${formatMiB(DEMO_BUDGETS.totalBytes)} budget`
    )
  }

  const gif = results.find((artifact) => artifact.name === DEMO_GIF)
  const video = results.find((artifact) => artifact.name === DEMO_VIDEO)
  if (
    gif &&
    video &&
    Math.abs(gif.durationSeconds - video.durationSeconds) > 0.6
  ) {
    errors.push(
      `${DEMO_GIF} and ${DEMO_VIDEO} durations differ by more than 0.6s ` +
      `(${gif.durationSeconds}s vs ${video.durationSeconds}s)`
    )
  }

  if (errors.length > 0) {
    throw new Error(`Demo artifact validation failed:\n- ${errors.join('\n- ')}`)
  }

  return {
    artifacts: results,
    totalBytes,
    budgets: DEMO_BUDGETS,
    screenshots: DEMO_SCREENSHOTS,
  }
}

export function formatValidationReport(report) {
  const rows = report.artifacts.map((artifact) => {
    const duration = artifact.animated ? `, ${artifact.durationSeconds.toFixed(2)}s` : ''
    return `  OK ${artifact.name}: ${artifact.width}x${artifact.height}, ${formatMiB(artifact.bytes)}${duration}, ${artifact.codec}`
  })

  return [
    'Demo artifacts are valid:',
    ...rows,
    `  Total: ${formatMiB(report.totalBytes)} / ${formatMiB(report.budgets.totalBytes)}`,
  ].join('\n')
}
