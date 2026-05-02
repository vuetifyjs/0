import { indexHtmlTemplate, packageJsonTemplate, tsconfigTemplate, unoConfigTemplate, viteConfigTemplate } from '@/util/export-templates'

// REPL infrastructure files; the template versions (or no version at all) win.
const EXCLUDED_FILES = new Set([
  'import-map.json',
  'src/uno.config.ts',
  'tsconfig.json',
])

interface GenerateProjectFilesOptions {
  files: Record<string, string>
  importMap: { imports: Record<string, string> }
}

function generateProjectFiles ({ files, importMap }: GenerateProjectFilesOptions): Record<string, string> {
  const packageJson = importMapToPackageJson(importMap)

  const templates: Record<string, string> = {
    'index.html': indexHtmlTemplate,
    'package.json': JSON.stringify(packageJson, null, 2),
    'src/uno.config.ts': unoConfigTemplate,
    'tsconfig.json': tsconfigTemplate,
    'vite.config.ts': viteConfigTemplate,
  }

  const projectFiles: Record<string, string> = {}

  for (const [path, content] of Object.entries(files)) {
    if (!EXCLUDED_FILES.has(path)) {
      projectFiles[replaceExtension(path)] = content
    }
  }

  for (const [path, content] of Object.entries(templates)) {
    if (!(path in projectFiles)) {
      projectFiles[replaceExtension(path)] = content
    }
  }

  const mainTs = projectFiles['src/main.ts']
  if (mainTs) {
    projectFiles['src/main.ts'] = adaptMainTs(mainTs)
  }

  return projectFiles
}

function importMapToPackageJson (importMap: { imports: Record<string, string> }): Record<string, unknown> {
  const deps = extractDependenciesFromImportMap(importMap)

  const packageJson = JSON.parse(packageJsonTemplate)

  for (const [name, version] of Object.entries(deps)) {
    packageJson.dependencies[name] = version === 'latest' ? version : `^${version}`
  }

  return packageJson
}

function extractDependenciesFromImportMap (importMap: { imports: Record<string, string> }): Record<string, string> {
  const deps: Record<string, string> = {}

  for (const [key, value] of Object.entries(importMap.imports)) {
    const dep = extractPackageInfoFromUrl(value)
    if (key === 'vue') {
      deps[key] = dep?.version ?? 'latest'
    } else {
      deps[dep?.name ?? key] = dep?.version ?? 'latest'
    }
  }

  return deps
}

function extractPackageInfoFromUrl (url: string): { name: string, version: string } | null {
  const cdnPatterns = [
    { regex: /\/npm\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\//, nameIdx: 1, versionIdx: 2 },
    { regex: /unpkg\.com\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\//, nameIdx: 1, versionIdx: 2 },
    { regex: /esm\.sh\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\//, nameIdx: 1, versionIdx: 2 },
  ]

  for (const { regex, nameIdx, versionIdx } of cdnPatterns) {
    const match = url.match(regex)
    if (match) {
      return { name: match[nameIdx], version: match[versionIdx] }
    }
  }

  return null
}

function replaceExtension (path: string): string {
  if (path.endsWith('.js')) {
    return path.replace(/\.js$/, '.ts')
  }
  return path
}

function adaptMainTs (source: string): string {
  // Strip the playground's sandbox-only `./uno.config.ts` side-effect import; in a
  // real Vite project the UnoCSS plugin emits CSS via the virtual module instead.
  let updated = source.replace(/^import\s+['"]\.\/uno\.config\.ts['"]\n?/m, '')
  if (!updated.includes('\'virtual:uno.css\'') && !updated.includes('"virtual:uno.css"')) {
    updated = `import 'virtual:uno.css'\n${updated}`
  }
  return updated
}

export { generateProjectFiles }
