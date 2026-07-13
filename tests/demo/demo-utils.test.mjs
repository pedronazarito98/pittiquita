import path from 'node:path'
import { EventEmitter } from 'node:events'

import { describe, expect, it, vi } from 'vitest'

import {
  DEMO_GIF,
  DEMO_SCREENSHOTS,
  DEMO_VIDEO,
  FIGMA_MOCK_LABEL,
  FIGMA_MOCK_NOTE,
  hasFigmaMockMarkers,
  parseDemoPort,
  resolveDemoPaths,
} from '../../scripts/demo/config.mjs'
import { renderFigmaMockHtml } from '../../scripts/demo/figma-mock.mjs'
import {
  createCleanupStack,
  terminateProcessTree,
  waitForServer,
} from '../../scripts/demo/runtime.mjs'
import {
  expectedArtifacts,
  validateArtifactMetadata,
} from '../../scripts/demo/validation.mjs'

describe('demo configuration', () => {
  it('uses a stable default port and accepts an override', () => {
    expect(parseDemoPort(undefined)).toBe(4175)
    expect(parseDemoPort('5199')).toBe(5199)
  })

  it.each(['0', '-1', '65536', 'abc', '4175.5'])(
    'rejects invalid port %s',
    (port) => {
      expect(() => parseDemoPort(port)).toThrow(/between 1 and 65535/)
    }
  )

  it('resolves all generated paths under docs/demo', () => {
    const rootDir = path.join(path.sep, 'repo')
    const paths = resolveDemoPaths(rootDir)

    expect(paths.outputDir).toBe(path.join(rootDir, 'docs', 'demo'))
    expect(paths.screenshots.map((filePath) => path.basename(filePath))).toEqual(
      DEMO_SCREENSHOTS
    )
    expect(path.basename(paths.video)).toBe(DEMO_VIDEO)
    expect(path.basename(paths.gif)).toBe(DEMO_GIF)
  })
})

describe('illustrative Figma mock', () => {
  it('contains both mandatory honesty markers', () => {
    const html = renderFigmaMockHtml('http://127.0.0.1:4175/#figmacapture=manual')

    expect(hasFigmaMockMarkers(html)).toBe(true)
    expect(html).toContain(FIGMA_MOCK_LABEL)
    expect(html).toContain(FIGMA_MOCK_NOTE)
  })

  it('escapes the capture URL before rendering it', () => {
    const html = renderFigmaMockHtml('http://localhost/?value=<script>')

    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('value=<script>')
  })
})

describe('demo runtime cleanup', () => {
  it('runs cleanup in reverse order only once', async () => {
    const order = []
    const cleanup = createCleanupStack()
    cleanup.add(async () => order.push('server'))
    cleanup.add(async () => order.push('browser'))
    cleanup.add(async () => order.push('temporary files'))

    await cleanup.run()
    await cleanup.run()

    expect(order).toEqual(['temporary files', 'browser', 'server'])
  })

  it('finishes every cleanup even when one fails', async () => {
    const lastCleanup = vi.fn()
    const cleanup = createCleanupStack()
    cleanup.add(lastCleanup)
    cleanup.add(async () => {
      throw new Error('browser close failed')
    })

    await expect(cleanup.run()).rejects.toThrow(/cleanup steps failed/)
    expect(lastCleanup).toHaveBeenCalledOnce()
  })

  it('retries server readiness without using a real port', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('connection refused'))
      .mockResolvedValueOnce({ ok: true })

    await waitForServer('http://127.0.0.1:4175', {
      fetchImpl,
      intervalMs: 0,
      timeoutMs: 100,
    })

    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('terminates the complete POSIX process group', async () => {
    const child = new EventEmitter()
    child.pid = 43210
    child.exitCode = null
    child.signalCode = null
    const killSpy = vi.spyOn(process, 'kill').mockImplementation((pid, signal) => {
      expect(pid).toBe(-43210)
      expect(signal).toBe('SIGTERM')
      setTimeout(() => {
        child.exitCode = 0
        child.emit('exit', 0, null)
      }, 0)
      return true
    })

    try {
      await terminateProcessTree(child, { platform: 'linux', timeoutMs: 50 })
    } finally {
      killSpy.mockRestore()
    }

    expect(child.exitCode).toBe(0)
  })
})

describe('artifact validation', () => {
  it('accepts valid measured metadata', () => {
    expect(
      validateArtifactMetadata(
        { name: DEMO_VIDEO, budgetBytes: 1024, codec: 'vp9', animated: true },
        {
          bytes: 512,
          codec: 'vp9',
          width: 1280,
          height: 720,
          durationSeconds: 10.5,
        }
      )
    ).toEqual([])
  })

  it('reports dimensions, codec, duration, and budget failures together', () => {
    const errors = validateArtifactMetadata(
      { name: DEMO_GIF, budgetBytes: 100, codec: 'gif', animated: true },
      {
        bytes: 101,
        codec: 'png',
        width: 1,
        height: 1,
        durationSeconds: 2,
      }
    )

    expect(errors).toHaveLength(4)
  })

  it('builds the complete expected artifact inventory', () => {
    const artifacts = expectedArtifacts(path.join(path.sep, 'repo'))

    expect(artifacts.map((artifact) => artifact.name)).toEqual([
      ...DEMO_SCREENSHOTS,
      DEMO_GIF,
      DEMO_VIDEO,
    ])
  })
})
