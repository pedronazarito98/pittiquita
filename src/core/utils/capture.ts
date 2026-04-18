/** URL do script oficial do Figma que captura o HTML da página. */
export const CAPTURE_SCRIPT_SRC =
  'https://mcp.figma.com/mcp/html-to-design/capture.js'

/** Token do hash da URL que indica modo de captura ativo. */
export const CAPTURE_HASH_TOKEN = 'figmacapture='

/** Atributo aplicado no container do helper para ele se auto-ignorar. */
export const HELPER_ATTR = 'data-figma-helper'

/** Atributo aplicado no elemento atualmente selecionado via painel. */
export const SELECTED_ATTR = 'data-figma-selected'

/** Chave do localStorage onde a URL/fileKey do Figma é persistida. */
export const STORAGE_FILE_REF_KEY = 'figma-file-ref'

/** Valor padrão do hash ao ativar o modo manual de captura. */
export const DEFAULT_CAPTURE_HASH = `${CAPTURE_HASH_TOKEN}manual`

/**
 * Retorna `true` quando o app está rodando em localhost/127.0.0.1.
 */
export const isLocalOrigin = (): boolean => {
  if (typeof window === 'undefined') return false
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )
}

/** Retorna `true` se o hash atual contém o token de captura. */
export const isCaptureActive = (): boolean =>
  typeof window !== 'undefined' &&
  window.location.hash.includes(CAPTURE_HASH_TOKEN)

/**
 * Liga o modo de captura escrevendo o token no hash da URL.
 * Não sobrescreve caso o token já esteja presente.
 */
export const enableCaptureHash = (): void => {
  if (typeof window === 'undefined') return
  if (window.location.hash.includes(CAPTURE_HASH_TOKEN)) return
  window.location.hash = DEFAULT_CAPTURE_HASH
}

/**
 * Opções para customizar a injeção do script de captura.
 * `nonce` e `integrity` habilitam compatibilidade com CSP estrita.
 */
export type EnsureCaptureScriptOptions = {
  scriptSrc?: string
  nonce?: string
  integrity?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
}

/**
 * Injeta o script de captura do Figma no `<head>` quando o modo está ativo.
 * Idempotente: não injeta duas vezes nem fora do localhost.
 */
export const ensureCaptureScript = (
  options: EnsureCaptureScriptOptions = {}
): void => {
  if (typeof window === 'undefined' || !isLocalOrigin() || !isCaptureActive()) {
    return
  }

  if (document.querySelector('script[data-figma-capture-loader]')) {
    return
  }

  const script = document.createElement('script')
  script.src = options.scriptSrc ?? CAPTURE_SCRIPT_SRC
  script.async = true
  script.dataset.figmaCaptureLoader = 'true'
  if (options.nonce) script.nonce = options.nonce
  if (options.integrity) script.integrity = options.integrity
  if (options.crossOrigin) script.crossOrigin = options.crossOrigin
  document.head.appendChild(script)
}
