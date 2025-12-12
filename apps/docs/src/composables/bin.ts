// Utilities
import { zlibSync } from 'fflate'

function compressAndEncode (str: string) {
  const u8 = new TextEncoder().encode(str)
  const compressed = zlibSync(u8)
  const binary = String.fromCodePoint(...compressed)
  const encoded = btoa(binary)
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const languageMap: Record<string, string> = {
  bash: 'markdown',
  sh: 'markdown',
  js: 'javascript',
  ts: 'typescript',
  vue: 'vue',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  md: 'markdown',
}

export function useBin (code: string, language: string, title?: string) {
  const hash = compressAndEncode(code)
  const lang = languageMap[language] ?? language
  const params = new URLSearchParams({ code: hash, lang })
  if (title) params.set('title', title)
  return `https://bin.vuetifyjs.com?${params}`
}
