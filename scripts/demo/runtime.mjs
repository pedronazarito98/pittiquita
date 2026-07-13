import { spawn } from 'node:child_process'

const DEFAULT_LOG_LIMIT = 64 * 1024

export const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export function createLogBuffer(limit = DEFAULT_LOG_LIMIT) {
  let output = ''

  return {
    append(chunk) {
      output += chunk.toString()
      if (output.length > limit) output = output.slice(-limit)
    },
    read() {
      return output
    },
  }
}

export function createCleanupStack() {
  const cleanups = []
  let cleanupPromise

  return {
    add(cleanup) {
      cleanups.push(cleanup)
      return cleanup
    },
    run() {
      if (cleanupPromise) return cleanupPromise

      cleanupPromise = (async () => {
        const errors = []

        for (const cleanup of cleanups.reverse()) {
          try {
            await cleanup()
          } catch (error) {
            errors.push(error)
          }
        }

        if (errors.length > 0) {
          throw new AggregateError(errors, 'One or more demo cleanup steps failed')
        }
      })()

      return cleanupPromise
    },
  }
}

export async function waitForServer(
  url,
  { timeoutMs = 30000, intervalMs = 300, fetchImpl = fetch, signal } = {}
) {
  const startedAt = Date.now()
  let lastError

  while (Date.now() - startedAt < timeoutMs) {
    if (signal?.aborted) throw signal.reason ?? new Error('Server wait aborted')

    try {
      const response = await fetchImpl(url, { signal })
      if (response.ok) return
      lastError = new Error(`Server responded with HTTP ${response.status}`)
    } catch (error) {
      if (signal?.aborted) throw signal.reason ?? error
      lastError = error
    }

    await wait(intervalMs)
  }

  const detail = lastError instanceof Error ? ` Last error: ${lastError.message}` : ''
  throw new Error(`Timed out waiting for ${url}.${detail}`)
}

export function runCommand(command, args, options = {}) {
  const {
    cwd,
    env = process.env,
    input,
    spawnImpl = spawn,
  } = options

  return new Promise((resolve, reject) => {
    const child = spawnImpl(command, args, {
      cwd,
      env,
      stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
      windowsHide: true,
    })
    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString()
    })
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString()
    })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve({ stdout, stderr })
        return
      }

      reject(
        new Error(
          [
            `${command} exited with ${code === null ? `signal ${signal}` : `code ${code}`}.`,
            stderr.trim(),
            stdout.trim(),
          ]
            .filter(Boolean)
            .join('\n')
        )
      )
    })

    if (input !== undefined) child.stdin?.end(input)
  })
}

function waitForExit(child, timeoutMs) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true)

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.off('exit', onExit)
      resolve(false)
    }, timeoutMs)
    timer.unref?.()

    function onExit() {
      clearTimeout(timer)
      resolve(true)
    }

    child.once('exit', onExit)
  })
}

export async function terminateProcessTree(
  child,
  {
    platform = process.platform,
    timeoutMs = 5000,
    spawnImpl = spawn,
  } = {}
) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return

  if (platform === 'win32' && child.pid) {
    await new Promise((resolve, reject) => {
      const killer = spawnImpl(
        'taskkill',
        ['/pid', String(child.pid), '/T', '/F'],
        { stdio: 'ignore', windowsHide: true }
      )
      killer.once('error', reject)
      killer.once('exit', (code) => {
        if (code === 0 || child.exitCode !== null) resolve()
        else reject(new Error(`taskkill exited with code ${code}`))
      })
    })
    return
  }

  const signalTree = (signal) => {
    try {
      if (child.pid) process.kill(-child.pid, signal)
      else child.kill(signal)
    } catch (error) {
      if (error?.code !== 'ESRCH') throw error
    }
  }

  signalTree('SIGTERM')
  if (await waitForExit(child, timeoutMs)) return

  signalTree('SIGKILL')
  if (!(await waitForExit(child, timeoutMs))) {
    throw new Error(`Process tree ${child.pid ?? '(unknown pid)'} did not exit`)
  }
}
