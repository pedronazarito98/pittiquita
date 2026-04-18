import { useEffect, useMemo } from 'react'

import {
  type EnsureCaptureScriptOptions,
  enableCaptureHash,
  ensureCaptureScript,
} from '../utils/capture'

export type UseFigmaCaptureOptions = {
  enabled?: boolean
  onHashChange?: () => void
  scriptSrc?: string
  nonce?: string
  integrity?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
}

export type UseFigmaCaptureResult = {
  activate: () => void
}

/**
 * Gerencia o ciclo de vida do modo de captura do Figma:
 *   - injeta o script quando o hash contém o token;
 *   - ouve `hashchange` para re-injetar e notificar;
 *   - expõe `activate()` para ligar o modo manualmente.
 */
export const useFigmaCapture = ({
  enabled = true,
  onHashChange,
  scriptSrc,
  nonce,
  integrity,
  crossOrigin,
}: UseFigmaCaptureOptions = {}): UseFigmaCaptureResult => {
  const scriptOptions = useMemo<EnsureCaptureScriptOptions>(
    () => ({ scriptSrc, nonce, integrity, crossOrigin }),
    [scriptSrc, nonce, integrity, crossOrigin]
  )

  useEffect(() => {
    if (!enabled) return

    const sync = () => {
      ensureCaptureScript(scriptOptions)
      onHashChange?.()
    }

    sync()
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
    }
  }, [enabled, onHashChange, scriptOptions])

  return {
    activate: () => {
      enableCaptureHash()
      ensureCaptureScript(scriptOptions)
    },
  }
}
