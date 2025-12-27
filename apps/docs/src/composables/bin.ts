// Utilities
import { zlibSync } from 'fflate'

export function compressAndEncode (str: string) {
  const u8 = new TextEncoder().encode(str)
  const compressed = zlibSync(u8)
  const binary = String.fromCodePoint(...compressed)
  const encoded = btoa(binary)
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export const BIN_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  vue: 'vue',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  md: 'markdown',
  sh: 'shell',
  bash: 'shell',
}

export function getBinUrl (code: string, language: string, title?: string) {
  const hash = compressAndEncode(code)
  const lang = BIN_LANGUAGE_MAP[language] ?? language
  const params = new URLSearchParams({ code: hash, lang })
  if (title) params.set('title', title)
  return `https://bin.vuetifyjs.com?${params}`
}
