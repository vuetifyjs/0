// Utilities
import { zlibSync } from 'fflate'

function compressAndEncode (str: string) {
  const u8 = new TextEncoder().encode(str)
  const compressed = zlibSync(u8)
  const binary = String.fromCodePoint(...compressed)
  const encoded = btoa(binary)
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const BIN_LANGUAGE_MAP: Record<string, string> = {
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

export interface BinFile {
  name: string
  code: string
  language?: string
}

export function getMultiFileBinUrl (files: BinFile[], title?: string) {
  const payload = files.map(f => ({
    name: f.name,
    content: f.code,
    language: f.language ?? BIN_LANGUAGE_MAP[f.name.split('.').pop() ?? ''] ?? 'text',
  }))
  const json = JSON.stringify(payload)
  const hash = compressAndEncode(json)
  const params = new URLSearchParams({ files: hash })
  if (title) params.set('title', title)
  return `https://bin.vuetifyjs.com?${params}`
}
