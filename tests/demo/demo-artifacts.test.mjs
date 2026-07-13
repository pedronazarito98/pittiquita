import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import {
  DEMO_BUDGETS,
  DEMO_GIF,
  DEMO_SCREENSHOTS,
  DEMO_VIDEO,
  resolveDemoPaths,
} from '../../scripts/demo/config.mjs'

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
)
const paths = resolveDemoPaths(rootDir)

describe('versioned demo artifacts', () => {
  it.each(paths.screenshots)('keeps a non-empty PNG: %s', async (filePath) => {
    const [header, fileStat] = await Promise.all([
      readFile(filePath).then((buffer) => buffer.subarray(0, 8)),
      stat(filePath),
    ])

    expect(header.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe(true)
    expect(fileStat.size).toBeGreaterThan(0)
    expect(fileStat.size).toBeLessThanOrEqual(DEMO_BUDGETS.screenshotBytes)
  })

  it('keeps an animated GIF within its budget', async () => {
    const [header, fileStat] = await Promise.all([
      readFile(paths.gif).then((buffer) => buffer.subarray(0, 6).toString('ascii')),
      stat(paths.gif),
    ])

    expect(['GIF87a', 'GIF89a']).toContain(header)
    expect(fileStat.size).toBeLessThanOrEqual(DEMO_BUDGETS.gifBytes)
  })

  it('keeps a WebM within its budget', async () => {
    const [header, fileStat] = await Promise.all([
      readFile(paths.video).then((buffer) => buffer.subarray(0, 4)),
      stat(paths.video),
    ])

    expect(header.equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))).toBe(true)
    expect(fileStat.size).toBeLessThanOrEqual(DEMO_BUDGETS.videoBytes)
  })

  it('tracks the documented artifact names', () => {
    expect(DEMO_SCREENSHOTS).toHaveLength(5)
    expect(path.basename(paths.gif)).toBe(DEMO_GIF)
    expect(path.basename(paths.video)).toBe(DEMO_VIDEO)
  })
})
