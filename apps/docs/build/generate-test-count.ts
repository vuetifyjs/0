import { readFile, glob } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { Plugin, ViteDevServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(__dirname, '../../..')

const VIRTUAL_MODULE_ID = 'virtual:test-count'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export interface TestCount {
  files: number
  tests: number
}

const TEST_CALL_RE = /(?<![\w.])(?:it|test)\s*(?:\.(each|skip|todo|fails|concurrent|sequential|only))?\s*\(/g

const EXCLUDE_RE = /\/(?:node_modules|dist|coverage|\.cache|\.claude|\.output)\//

function stripCommentsAndStrings (source: string): string {
  let out = ''
  for (let i = 0; i < source.length; i++) {
    const ch = source[i]
    const next = source[i + 1]
    if (ch === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++
      out += '\n'
      continue
    }
    if (ch === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++
      i++
      continue
    }
    if (ch === '"' || ch === '\'' || ch === '`') {
      const quote = ch
      out += ch
      i++
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\' && i + 1 < source.length) {
          out += source[i] === '\n' ? '\n' : ' '
          i++
        }
        out += source[i] === '\n' ? '\n' : ' '
        i++
      }
      if (i < source.length) out += source[i]
      continue
    }
    out += ch
  }
  return out
}

function countEachRows (source: string, openIndex: number): number {
  let i = openIndex + 1
  while (i < source.length && source[i] !== '[' && source[i] !== '`') i++
  if (i >= source.length) return 1

  // Template literal table — too irregular to count reliably; treat as one row.
  if (source[i] === '`') return 1

  // Array literal — count top-level items separated by commas at depth 1.
  let depth = 0
  let topLevelCommas = 0
  let sawContent = false
  for (; i < source.length; i++) {
    const ch = source[i]
    if (ch === '[' || ch === '{' || ch === '(') {
      depth++
      if (depth > 1) sawContent = true
      continue
    }
    if (ch === ']' || ch === '}' || ch === ')') {
      depth--
      if (depth === 0) {
        return sawContent ? topLevelCommas + 1 : 1
      }
      continue
    }
    if (ch === ',' && depth === 1) {
      topLevelCommas++
      continue
    }
    if (ch === '"' || ch === '\'' || ch === '`') {
      sawContent = true
      const quote = ch
      i++
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i++
        i++
      }
      continue
    }
    if (depth >= 1 && !/\s/.test(ch)) sawContent = true
  }
  return 1
}

async function countTests (): Promise<TestCount> {
  let files = 0
  let tests = 0
  for await (const file of glob([
    `${ROOT_DIR}/packages/**/*.test.ts`,
    `${ROOT_DIR}/packages/**/*.spec.ts`,
    `${ROOT_DIR}/apps/**/*.test.ts`,
    `${ROOT_DIR}/apps/**/*.spec.ts`,
  ], { exclude: path => EXCLUDE_RE.test(path) })) {
    const raw = await readFile(file, 'utf8')
    const source = stripCommentsAndStrings(raw)
    files++

    for (const match of source.matchAll(TEST_CALL_RE)) {
      const modifier = match[1]
      if (modifier === 'skip' || modifier === 'todo' || modifier === 'fails') continue
      if (modifier === 'each') {
        const openParen = match.index! + match[0].length - 1
        tests += countEachRows(source, openParen)
        continue
      }
      tests++
    }
  }
  return { files, tests }
}

export default function generateTestCountPlugin (): Plugin {
  let cache: TestCount | null = null
  let pending: Promise<TestCount> | null = null

  async function getCount (): Promise<TestCount> {
    if (cache) return cache
    if (!pending) {
      pending = countTests().then(result => {
        cache = result
        pending = null
        return result
      })
    }
    return pending
  }

  function invalidate () {
    cache = null
    pending = null
  }

  return {
    name: 'generate-test-count',

    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    async load (id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return
      const data = await getCount()
      return `export default ${JSON.stringify(data)}`
    },

    configureServer (server: ViteDevServer) {
      function onChange (file: string) {
        if (!/\.(?:test|spec)\.ts$/.test(file)) return
        invalidate()
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
      server.watcher.on('change', onChange)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },

    buildEnd () {
      invalidate()
    },
  }
}
