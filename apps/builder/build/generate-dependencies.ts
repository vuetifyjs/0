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

function extractV0Imports (filePath: string): string[] {
  let content: string
  try {
    content = readFileSync(filePath, 'utf8')
  } catch {
    return []
  }

  const imports: string[] = []
  const pattern = /from\s+['"]#v0\/(composables|components)\/(\w+)['"]/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    imports.push(match[2])
  }

  return [...new Set(imports)]
}

function scanDirectory (dir: string): Record<string, string[]> {
  const entries = readdirSync(dir)
  const graph: Record<string, string[]> = {}

  for (const entry of entries) {
    const entryPath = resolve(dir, entry)
    if (!statSync(entryPath).isDirectory()) continue

    const indexPath = resolve(entryPath, 'index.ts')
    const deps = extractV0Imports(indexPath)

    // Also scan .vue files and non-index .ts files
    try {
      const files = readdirSync(entryPath)
      for (const file of files) {
        if (file.endsWith('.vue') || (file.endsWith('.ts') && file !== 'index.ts')) {
          deps.push(...extractV0Imports(resolve(entryPath, file)))
        }
      }
    } catch { /* empty */ }

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
