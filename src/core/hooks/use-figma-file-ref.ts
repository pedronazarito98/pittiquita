import { useCallback, useEffect, useState } from 'react'

import { STORAGE_FILE_REF_KEY } from '../utils/capture'
import { buildFigmaFileUrl, normalizeFileKey } from '../utils/file-ref'
import { defaultLabels } from '../utils/labels'

export type UseFigmaFileRefOptions = {
  storageKey?: string
  initialValue?: string
  invalidMessage?: string
  openedMessage?: string
}

export type UseFigmaFileRefResult = {
  value: string
  error: string
  status: string
  setValue: (next: string) => void
  clearStatus: () => void
  openExistingFile: () => void
  reset: () => void
}

/**
 * Hook do campo "Arquivo no Figma".
 * Hidrata do localStorage, valida URL/fileKey, abre em nova aba.
 */
export const useFigmaFileRef = (
  options?: UseFigmaFileRefOptions
): UseFigmaFileRefResult => {
  const storageKey = options?.storageKey ?? STORAGE_FILE_REF_KEY
  const invalidMessage = options?.invalidMessage ?? defaultLabels.fileRefInvalid
  const openedMessage = options?.openedMessage ?? defaultLabels.fileOpened

  const [value, setValueState] = useState(options?.initialValue ?? '')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (options?.initialValue !== undefined) return
    setValueState(window.localStorage.getItem(storageKey) ?? '')
  }, [storageKey, options?.initialValue])

  const setValue = useCallback(
    (next: string) => {
      setValueState(next)
      if (error) setError('')
      if (status) setStatus('')
    },
    [error, status]
  )

  const clearStatus = useCallback(() => setStatus(''), [])

  const openExistingFile = useCallback(() => {
    const fileKey = normalizeFileKey(value)

    if (!fileKey) {
      setError(invalidMessage)
      setStatus('')
      return
    }

    setError('')

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, value.trim())
      window.open(buildFigmaFileUrl(fileKey), '_blank', 'noopener,noreferrer')
    }

    setStatus(openedMessage)
  }, [invalidMessage, openedMessage, storageKey, value])

  const reset = useCallback(() => {
    setError('')
    setStatus('')
  }, [])

  return { value, error, status, setValue, clearStatus, openExistingFile, reset }
}
