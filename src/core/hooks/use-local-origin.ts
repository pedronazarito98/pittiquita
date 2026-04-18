import { useEffect, useState } from 'react'

import { isLocalOrigin } from '../utils/capture'

/**
 * Detecta de forma SSR-safe se o app está em localhost.
 * Começa como `false` e atualiza no client após montagem.
 */
export const useLocalOrigin = (): boolean => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(isLocalOrigin())
  }, [])

  return ready
}
