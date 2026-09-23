export interface PlaygroundFile {
  name: string
  code: string
}

/**
 * Hidden relative module the browser compiler-sfc can read.
 * Vue's browser build refuses `import type` from packages
 * (`Type import from non-relative sources is not supported in the browser build`).
 */
export const V0_MACROS_FILE = 'src/v0-macros.ts'

const RE_MACRO = /\bdefine(?:Props|Emits|Model)\s*</
const RE_PACKAGE = /^(?:@vuetify\/v0(?:\/.*)?|@paper\/[\w-]+(?:\/.*)?)$/
const RE_TYPE_IMPORT = /^([ \t]*)import\s+type\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm
const RE_VALUE_IMPORT = /^([ \t]*)import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm
const RE_SHIM_IMPORT = /import\s+type\s+\{([^}]+)\}\s+from\s+['"](?:\.\.\/)*v0-macros['"]/g
const RE_IDENT = /^[A-Za-z_$][\w$]*$/
const RE_AS = /\s+as\s+/

const KNOWN_MACROS: Record<string, string> = {
  AtomProps: [
    'export interface AtomProps {',
    '  as?: string | null',
    '  renderless?: boolean',
    '}',
  ].join('\n'),
}

function toPascal (str: string): string {
  return str.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())
}

/**
 * Detect which file is the entry point for a multi-file example.
 */
export function detectEntryFile (files: PlaygroundFile[]): PlaygroundFile | undefined {
  const vueFiles = files.filter(f => f.name.endsWith('.vue'))

  const entryNames = ['index.vue', 'App.vue', 'example.vue', 'main.vue']
  for (const name of entryNames) {
    const found = vueFiles.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (found) return found
  }

  for (const file of vueFiles) {
    const importsOthers = vueFiles.some(other =>
      other !== file && file.code.includes(`./${other.name.replace(/\.\w+$/, '')}`),
    )
    if (importsOthers) return file
  }

  return vueFiles.at(-1)
}

/**
 * Generate an App.vue wrapper that imports and renders the entry component.
 */
export function generateAppWrapper (entryPath: string): string {
  const baseName = entryPath.split('/').pop()!.replace(/\.vue$/, '')
  const pascalName = toPascal(baseName)
  return [
    '<' + `script setup lang="ts">`,
    `  import ${pascalName} from './${entryPath}'`,
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="p-4">',
    `    <${pascalName} />`,
    '  </div>',
    '</template>',
    '',
  ].join('\n')
}

/**
 * Build the src/-prefixed file record that the playground REPL expects.
 * When dir is provided, files are nested: src/{dir}/{name}
 */
export function buildPlaygroundFiles (inputFiles: PlaygroundFile[], dir?: string): Record<string, string> {
  const files: Record<string, string> = {}
  const prefix = dir ? `src/${dir}` : 'src'

  for (const file of inputFiles) {
    const path = file.name.startsWith('src/') ? file.name : `${prefix}/${file.name}`
    files[path] = file.code
  }

  const hasAppVue = inputFiles.some(f => f.name.toLowerCase() === 'app.vue')
  if (!hasAppVue) {
    const entryFile = detectEntryFile(inputFiles)
    if (entryFile) {
      const entryPath = dir ? `${dir}/${entryFile.name}` : entryFile.name
      files['src/App.vue'] = generateAppWrapper(entryPath)
    }
  }

  return rewritePackageMacroTypes(files)
}

/**
 * Point SFC-macro `import type` from packages at {@link V0_MACROS_FILE}.
 * Idempotent — already-rewritten files only ensure the shim exists.
 */
export function rewritePackageMacroTypes (
  files: Record<string, string>,
): Record<string, string> {
  const next: Record<string, string> = { ...files }
  const names = new Set<string>()

  for (const [path, code] of Object.entries(files)) {
    if (!path.endsWith('.vue') || !RE_MACRO.test(code)) continue
    const rewritten = rewriteVueMacros(path, code)
    if (rewritten.code !== code) next[path] = rewritten.code
    for (const name of rewritten.names) names.add(name)
  }

  for (const code of Object.values(next)) {
    collectShimNames(code, names)
  }

  if (names.size > 0) next[V0_MACROS_FILE] = generateMacroShim(names)
  return next
}

function rewriteVueMacros (filePath: string, code: string): { code: string, names: string[] } {
  const relative = macrosSpecifier(filePath)
  const names: string[] = []

  let next = code.replace(RE_TYPE_IMPORT, (line, indent: string, specifiers: string, spec: string) => {
    if (!RE_PACKAGE.test(spec)) return line
    const imported = importedNames(specifiers)
    if (imported.length === 0) return line
    names.push(...imported)
    return `${indent}import type { ${specifiers.trim()} } from '${relative}'`
  })

  next = next.replace(RE_VALUE_IMPORT, (line, indent: string, specifiers: string, spec: string) => {
    if (!RE_PACKAGE.test(spec)) return line
    const split = splitMixedImport(specifiers)
    if (!split) return line
    names.push(...split.names)
    if (split.values.length === 0) {
      return `${indent}import type { ${split.types.join(', ')} } from '${relative}'`
    }
    return [
      `${indent}import { ${split.values.join(', ')} } from '${spec}'`,
      `${indent}import type { ${split.types.join(', ')} } from '${relative}'`,
    ].join('\n')
  })

  return { code: next, names }
}

function macrosSpecifier (filePath: string): string {
  const normalized = filePath.replaceAll('\\', '/')
  const slash = normalized.lastIndexOf('/')
  const dir = slash === -1 ? '' : normalized.slice(0, slash)
  if (dir === '' || dir === 'src') return './v0-macros'
  const rest = dir.startsWith('src/') ? dir.slice(4) : dir
  const depth = rest.split('/').filter(Boolean).length
  return `${'../'.repeat(depth)}v0-macros`
}

function importedNames (specifiers: string): string[] {
  return specifiers.split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => part.replace(/^type\s+/, '').split(RE_AS)[0]!.trim())
    .filter(name => RE_IDENT.test(name))
}

function splitMixedImport (specifiers: string): { values: string[], types: string[], names: string[] } | undefined {
  const values: string[] = []
  const types: string[] = []
  for (const part of specifiers.split(',').map(item => item.trim()).filter(Boolean)) {
    if (part.startsWith('type ')) types.push(part.slice(5).trim())
    else values.push(part)
  }
  if (types.length === 0) return undefined
  return { values, types, names: importedNames(types.join(', ')) }
}

function collectShimNames (code: string, names: Set<string>) {
  for (const match of code.matchAll(RE_SHIM_IMPORT)) {
    for (const name of importedNames(match[1]!)) names.add(name)
  }
}

function generateMacroShim (names: Iterable<string>): string {
  const unique = [...names].filter(name => RE_IDENT.test(name)).toSorted()
  const blocks = unique.map(name => KNOWN_MACROS[name] ?? `export interface ${name} {}`)
  return `${blocks.join('\n\n')}\n`
}
