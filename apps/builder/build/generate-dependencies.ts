import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..')
const V0_SRC = resolve(ROOT, 'packages/0/src')

interface DependencyGraph {
  composables: Record<string, string[]>
  components: Record<string, string[]>
}

// Tests and benchmarks import far more than the feature itself needs — Dialog
// only reaches for Scrim in its browser test, useTheme only for useStorage in
// its unit test. Counting those makes the review sheet promise dependencies the
// generated starter deliberately never installs.
const EXCLUDED = /\.(?:test|browser\.test|ssr\.test|bench)\.ts$/

// `import type` is erased at build time, so a type-only edge is not a runtime
// dependency. Stripping the whole statement before scanning is simpler than
// trying to classify each specifier, and the brace form covers multi-line.
const TYPE_ONLY = /^[^\S\n]*(?:import|export)\s+type\s+(?:\{[^}]*\}|[^\n]*?)\s*from\s*['"][^'"]+['"]/gm

// The trailing group captures deep imports (`useTheme/adapters`,
// `createDataTable/columns`) which the specifier regex used to skip entirely.
const SPECIFIER = /from\s+['"]#v0\/(?:composables|components)\/(\w+)(?:\/[\w/]+)?['"]/g

function extractV0Imports (filePath: string): string[] {
  if (EXCLUDED.test(filePath)) return []

  let content: string
  try {
    content = readFileSync(filePath, 'utf8')
  } catch {
    return []
  }

  const runtime = content.replaceAll(TYPE_ONLY, '')
  const imports = [...runtime.matchAll(SPECIFIER)].map(match => match[1])

  return [...new Set(imports)]
}

// Recursive: a feature's real dependencies are not all at the top level.
// createDataTable reaches createFilter from adapters/adapter.ts, and a
// single-level scan reported that edge only by accident, via a type import in
// index.ts that is not a runtime dependency at all.
function collectFiles (dir: string): string[] {
  const files: string[] = []

  try {
    for (const entry of readdirSync(dir)) {
      const path = resolve(dir, entry)

      if (statSync(path).isDirectory()) {
        files.push(...collectFiles(path))
      } else if (entry.endsWith('.ts') || entry.endsWith('.vue')) {
        files.push(path)
      }
    }
  } catch { /* empty */ }

  return files
}

function scanDirectory (dir: string): Record<string, string[]> {
  const entries = readdirSync(dir)
  const graph: Record<string, string[]> = {}

  for (const entry of entries) {
    const entryPath = resolve(dir, entry)
    if (!statSync(entryPath).isDirectory()) continue

    const deps = collectFiles(entryPath).flatMap(file => extractV0Imports(file))

    graph[entry] = [...new Set(deps)].filter(d => d !== entry).toSorted()
  }

  return graph
}

const graph: DependencyGraph = {
  composables: scanDirectory(resolve(V0_SRC, 'composables')),
  components: scanDirectory(resolve(V0_SRC, 'components')),
}

const outPath = resolve(__dirname, '../src/data/dependencies.json')
writeFileSync(outPath, JSON.stringify(graph, null, 2) + '\n')

console.log(
  `Generated dependency graph: ${Object.keys(graph.composables).length} composables, ${Object.keys(graph.components).length} components`,
)
