import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Types
import type { AnalysisResult, CoverageReport, PaperAnalyzerOptions, PaperAnalyzerTarget } from './types'
import type { Plugin } from 'vite'

import { classify } from './classify'

const VIRTUAL_PREFIX = 'virtual:paper-analysis/'

// Regex patterns to extract named exports from barrel files (index.ts)
const RE_NAMED_EXPORT = /export\s*\{([^}]+)\}\s*from\s/g
const RE_TYPE_EXPORT = /export\s+type\s*\{([^}]+)\}\s*from\s/g
const RE_DIRECT_EXPORT = /export\s+(?:function|const|class)\s+(\w+)/g

function extractExports (source: string): Array<{ name: string, isType: boolean }> {
  const exports: Array<{ name: string, isType: boolean }> = []

  // Extract type exports first
  for (const match of source.matchAll(RE_TYPE_EXPORT)) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/).pop()!.trim()).filter(Boolean)
    for (const name of names) {
      exports.push({ name, isType: true })
    }
  }

  // Extract named runtime exports (remove type exports first to avoid double-matching)
  const withoutTypes = source.replace(RE_TYPE_EXPORT, '')
  for (const match of withoutTypes.matchAll(RE_NAMED_EXPORT)) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/).pop()!.trim()).filter(Boolean)
    for (const name of names) {
      exports.push({ name, isType: false })
    }
  }

  // Extract direct exports (export function/const/class)
  for (const match of withoutTypes.matchAll(RE_DIRECT_EXPORT)) {
    exports.push({ name: match[1], isType: false })
  }

  return exports
}

function resolveEntryPath (target: PaperAnalyzerTarget, root: string): string | null {
  const pkgName = target.package.split('/').pop()!
  const candidates = [
    resolve(root, '..', '..', 'packages', pkgName, 'src', 'index.ts'), // monorepo source
    resolve(root, 'node_modules', target.package, 'dist', 'index.mjs'), // built
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

function analyzePackage (target: PaperAnalyzerTarget, root: string): AnalysisResult & { coverage: CoverageReport } {
  const result: AnalysisResult = {
    components: [],
    composables: [],
    plugins: [],
    constants: [],
    types: [],
    utils: [],
  }

  let importMapComponents: Set<string> | undefined
  if (target.importMap) {
    const mapPath = resolve(root, target.importMap)
    if (existsSync(mapPath)) {
      const map = JSON.parse(readFileSync(mapPath, 'utf-8'))
      importMapComponents = new Set(Object.keys(map.components || {}))
    }
  }

  const entryPath = resolveEntryPath(target, root)
  if (entryPath) {
    const source = readFileSync(entryPath, 'utf-8')
    const exports = extractExports(source)

    for (const { name, isType } of exports) {
      const type = classify(name, isType, importMapComponents)
      switch (type) {
        case 'component': { result.components.push(name); break
        }
        case 'composable': { result.composables.push(name); break
        }
        case 'plugin': { result.plugins.push(name); break
        }
        case 'constant': { result.constants.push(name); break
        }
        case 'type': { result.types.push(name); break
        }
        case 'util': { result.utils.push(name); break
        }
      }
    }
  }

  const manifestNames = new Set([
    ...(target.manifestComponents || []),
    ...(target.manifestComposables || []),
  ])
  const allExportNames = [
    ...result.components,
    ...result.composables,
    ...result.plugins,
  ]
  const documented = allExportNames.filter(name => manifestNames.has(name))
  const stubs = allExportNames.filter(name => !manifestNames.has(name))
  const missing = [...manifestNames].filter(name => !allExportNames.includes(name))
  const total = documented.length + stubs.length
  const score = total > 0 ? Math.round((documented.length / total) * 100) : 100

  return {
    ...result,
    coverage: { documented, stubs, missing, score },
  }
}

export function paperAnalyzer (options: PaperAnalyzerOptions): Plugin {
  const analyses = new Map<string, AnalysisResult & { coverage: CoverageReport }>()
  let root = ''

  return {
    name: 'paper-analyzer',
    configResolved (config) {
      root = config.root
    },
    buildStart () {
      for (const target of options.targets) {
        const result = analyzePackage(target, root)
        analyses.set(target.slug, result)

        if (result.coverage.stubs.length > 0) {
          this.warn(`[paper-analyzer] ${target.slug}: ${result.coverage.stubs.length} exports missing from manifest: ${result.coverage.stubs.join(', ')}`)
        }
        if (result.coverage.missing.length > 0) {
          this.warn(`[paper-analyzer] ${target.slug}: ${result.coverage.missing.length} manifest entries not found in exports: ${result.coverage.missing.join(', ')}`)
        }
      }
    },
    resolveId (id) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return '\0' + id
      }
    },
    load (id) {
      if (id.startsWith('\0' + VIRTUAL_PREFIX)) {
        const slug = id.slice(('\0' + VIRTUAL_PREFIX).length)
        const analysis = analyses.get(slug)
        if (!analysis) {
          this.error(`[paper-analyzer] No analysis for "${slug}". Registered: ${[...analyses.keys()].join(', ')}`)
        }
        return `export default ${JSON.stringify(analysis)}`
      }
    },
    handleHotUpdate ({ file, server }) {
      for (const target of options.targets) {
        const pkgName = target.package.split('/').pop()!
        const isTargetFile = file.includes(`/packages/${pkgName}/`)
          || file.includes(`/node_modules/${target.package}/`)
        if (!isTargetFile) continue

        const analysis = analyzePackage(target, root)
        analyses.set(target.slug, analysis)
        const mod = server.moduleGraph.getModuleById('\0' + VIRTUAL_PREFIX + target.slug)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          return [mod]
        }
      }
    },
  }
}
