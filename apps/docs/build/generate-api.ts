/**
 * Vite plugin to generate API documentation from TypeScript sources.
 *
 * - Components: Uses vue-component-meta to extract props, events, slots
 * - Composables: Uses ts-morph to extract options, return type methods
 *
 * Provides a virtual module `virtual:api` for SSG compatibility.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Project } from 'ts-morph'
import { createChecker } from 'vue-component-meta'

// Types
import type { InterfaceDeclaration, JSDocableNode, TypeAliasDeclaration } from 'ts-morph'
import type { Plugin } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..')
const COMPONENTS_DIR = resolve(ROOT, 'packages/0/src/components')
const COMPOSABLES_DIR = resolve(ROOT, 'packages/0/src/composables')
const TSCONFIG = resolve(ROOT, 'tsconfig.json')

const VIRTUAL_MODULE_ID = 'virtual:api'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID
const API_CACHE_DIR = resolve(__dirname, '../node_modules/.cache')
const API_CACHE_FILE = resolve(API_CACHE_DIR, 'api-cache.json')

// Vue internal props to filter out
const VUE_INTERNALS = new Set([
  'key',
  'ref',
  'ref_for',
  'ref_key',
  'class',
  'style',
  'onVue:beforeMount',
  'onVue:mounted',
  'onVue:beforeUpdate',
  'onVue:updated',
  'onVue:beforeUnmount',
  'onVue:unmounted',
])

// ============================================================================
// Component API Types
// ============================================================================

export interface ApiProp {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface ApiEvent {
  name: string
  type: string
  description?: string
}

export interface ApiSlot {
  name: string
  type?: string
  description?: string
}

export interface ComponentApi {
  kind: 'component'
  name: string
  description?: string
  props: ApiProp[]
  events: ApiEvent[]
  slots: ApiSlot[]
}

// ============================================================================
// Composable API Types
// ============================================================================

export interface ApiOption {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface ApiMethod {
  name: string
  type: string
  description?: string
  example?: string
}

export interface ApiProperty {
  name: string
  type: string
  description?: string
  example?: string
}

export interface ComposableApi {
  kind: 'composable'
  name: string
  description?: string
  options: ApiOption[]
  methods: ApiMethod[]
  properties: ApiProperty[]
}

export type Api = ComponentApi | ComposableApi

// ============================================================================
// Component Extraction (vue-component-meta)
// ============================================================================

let checker: ReturnType<typeof createChecker> | null = null

function getChecker () {
  if (!checker) {
    checker = createChecker(TSCONFIG, {
      forceUseTs: true,
      printer: { newLine: 1 },
    })
  }
  return checker
}

function extractComponentApi (filePath: string): ComponentApi | null {
  try {
    const meta = getChecker().getComponentMeta(filePath)

    const props: ApiProp[] = meta.props
      .filter(p => !VUE_INTERNALS.has(p.name))
      .map(p => ({
        name: p.name,
        type: p.type,
        required: p.required,
        default: p.default,
        description: p.description,
      }))

    const events: ApiEvent[] = meta.events
      .filter(e => e.name !== 'update:modelValue')
      .map(e => ({
        name: e.name,
        type: e.type,
        description: e.description,
      }))

    const slots: ApiSlot[] = meta.slots.map(s => ({
      name: s.name,
      type: s.type,
      description: s.description,
    }))

    return {
      kind: 'component',
      name: meta.name || filePath.split('/').pop()?.replace('.vue', '') || 'Unknown',
      props,
      events,
      slots,
    }
  } catch {
    return null
  }
}

async function findComponentFiles (): Promise<string[]> {
  const files: string[] = []
  const dirs = await readdir(COMPONENTS_DIR)

  for (const dir of dirs) {
    const dirPath = resolve(COMPONENTS_DIR, dir)
    const entries = await readdir(dirPath).catch(() => [])

    for (const entry of entries) {
      if (entry.endsWith('.vue')) {
        files.push(resolve(dirPath, entry))
      }
    }
  }

  return files
}

async function generateComponentApis (): Promise<Record<string, ComponentApi>> {
  const apis: Record<string, ComponentApi> = {}
  const files = await findComponentFiles()

  // Process all files in parallel for better performance
  const results = await Promise.all(
    files.map(file => Promise.resolve(extractComponentApi(file))),
  )

  for (const [index, api] of results.entries()) {
    if (api && api.props.length > 0) {
      const file = files[index]
      // Extract namespace from directory and sub-component from file
      // e.g., /components/Step/StepRoot.vue → Step.Root
      // e.g., /components/Atom/Atom.vue → Atom (standalone, no sub-component)
      const parts = file.split('/')
      const fileName = parts.pop()?.replace('.vue', '') || 'Unknown'
      const namespace = parts.pop() || ''
      const subComponent = fileName.replace(namespace, '')
      const displayName = subComponent ? `${namespace}.${subComponent}` : namespace

      apis[displayName] = { ...api, name: displayName }
    }
  }

  return apis
}

// ============================================================================
// Composable Extraction (ts-morph)
// ============================================================================

let project: Project | null = null

function getProject () {
  if (!project) {
    project = new Project({
      tsConfigFilePath: TSCONFIG,
      skipAddingFilesFromTsConfig: true,
    })
  }
  return project
}

function getJsDocInfo (node: JSDocableNode): { description?: string, example?: string } {
  const jsDocs = node.getJsDocs()
  if (jsDocs.length === 0) return {}

  const doc = jsDocs[0]
  const description = doc.getDescription()?.trim() || undefined

  // Extract @example tag content
  const exampleTag = doc.getTags().find(t => t.getTagName() === 'example')
  let example: string | undefined
  if (exampleTag) {
    example = exampleTag.getCommentText()?.trim()
    // Remove markdown code fence if present
    if (example?.startsWith('```')) {
      example = example.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
    }
  }

  return { description, example }
}

function extractInterfaceMembers (
  iface: InterfaceDeclaration | TypeAliasDeclaration | undefined,
): { methods: ApiMethod[], properties: ApiProperty[] } {
  const methods: ApiMethod[] = []
  const properties: ApiProperty[] = []

  if (!iface) return { methods, properties }

  // Handle interface with getProperties
  if ('getProperties' in iface) {
    for (const prop of iface.getProperties()) {
      const name = prop.getName()
      const type = prop.getType().getText(prop)
      const { description, example } = getJsDocInfo(prop)

      // Check if it's a function type
      if (type.includes('=>') || type.startsWith('(')) {
        methods.push({ name, type, description, example })
      } else {
        properties.push({ name, type, description, example })
      }
    }

    for (const method of iface.getMethods()) {
      const name = method.getName()
      const params = method.getParameters().map(p => `${p.getName()}: ${p.getType().getText(p)}`).join(', ')
      const returnType = method.getReturnType().getText(method)
      const type = `(${params}) => ${returnType}`
      const { description, example } = getJsDocInfo(method)
      methods.push({ name, type, description, example })
    }
  }

  return { methods, properties }
}

function extractOptionsMembers (
  iface: InterfaceDeclaration | undefined,
): ApiOption[] {
  const options: ApiOption[] = []

  if (!iface) return options

  for (const prop of iface.getProperties()) {
    const name = prop.getName()
    const type = prop.getType().getText(prop)
    const { description } = getJsDocInfo(prop)
    const required = !prop.hasQuestionToken()

    // Try to extract default from JSDoc @default tag
    const jsDocs = prop.getJsDocs()
    let defaultValue: string | undefined
    if (jsDocs.length > 0) {
      const defaultTag = jsDocs[0].getTags().find(t => t.getTagName() === 'default')
      if (defaultTag) {
        defaultValue = defaultTag.getCommentText()?.trim()
      }
    }

    options.push({ name, type, required, default: defaultValue, description })
  }

  return options
}

function extractComposableApi (filePath: string, composableName: string): ComposableApi | null {
  try {
    const proj = getProject()
    const sourceFile = proj.addSourceFileAtPath(filePath)

    // Get module description from first JSDoc comment
    const firstStatement = sourceFile.getStatements()[0]
    let description: string | undefined
    if (firstStatement && 'getJsDocs' in firstStatement) {
      const jsDocs = (firstStatement as JSDocableNode).getJsDocs()
      if (jsDocs.length > 0) {
        const moduleTag = jsDocs[0].getTags().find(t => t.getTagName() === 'module')
        if (moduleTag) {
          // Get the remarks section
          const remarksTag = jsDocs[0].getTags().find(t => t.getTagName() === 'remarks')
          description = remarksTag?.getCommentText()?.trim()
        }
      }
    }

    // Build list of possible interface name patterns
    // For useRegistry -> Registry, RegistryOptions, RegistryContext
    // For createContext -> CreateContext, Context, Plugin, etc.
    const baseName = composableName.replace(/^use/, '')
    const baseNameSingular = baseName.replace(/s$/, '')

    // For create* functions, also try PascalCase of full name and just the second word
    const isCreate = composableName.startsWith('create')
    const pascalName = composableName.charAt(0).toUpperCase() + composableName.slice(1)
    const secondWord = isCreate ? composableName.replace(/^create/, '') : null

    // Find Options interface with multiple naming patterns
    const optionsInterface = sourceFile.getInterface(`${baseName}Options`)
      ?? sourceFile.getInterface(`${baseNameSingular}Options`)
      ?? (isCreate ? sourceFile.getInterface(`${pascalName}Options`) : undefined)
      ?? (secondWord ? sourceFile.getInterface(`${secondWord}Options`) : undefined)

    // Find Context interface with multiple naming patterns
    const contextInterface = sourceFile.getInterface(`${baseName}Context`)
      ?? sourceFile.getInterface(`${baseNameSingular}Context`)
      ?? (isCreate ? sourceFile.getInterface(`${pascalName}Context`) : undefined)
      ?? (secondWord ? sourceFile.getInterface(`${secondWord}Context`) : undefined)

    const options = extractOptionsMembers(optionsInterface)
    const { methods, properties } = extractInterfaceMembers(contextInterface)

    // Remove source file to avoid memory leak
    proj.removeSourceFile(sourceFile)

    // Only return if we found meaningful content
    if (options.length === 0 && methods.length === 0 && properties.length === 0) {
      return null
    }

    return {
      kind: 'composable',
      name: composableName,
      description,
      options,
      methods,
      properties,
    }
  } catch {
    return null
  }
}

async function findComposableFiles (): Promise<{ path: string, name: string }[]> {
  const files: { path: string, name: string }[] = []
  const dirs = await readdir(COMPOSABLES_DIR)

  for (const dir of dirs) {
    // Composable directories start with 'use' or 'create'
    if (!dir.startsWith('use') && !dir.startsWith('create')) continue

    const indexPath = resolve(COMPOSABLES_DIR, dir, 'index.ts')
    files.push({ path: indexPath, name: dir })
  }

  return files
}

async function generateComposableApis (): Promise<Record<string, ComposableApi>> {
  const apis: Record<string, ComposableApi> = {}
  const files = await findComposableFiles()

  for (const { path, name } of files) {
    const api = extractComposableApi(path, name)
    if (api) {
      apis[name] = api
    }
  }

  return apis
}

// ============================================================================
// Plugin
// ============================================================================

export interface ApiData {
  components: Record<string, ComponentApi>
  composables: Record<string, ComposableApi>
}

export default function generateApiPlugin (): Plugin {
  let apiData: ApiData | null = null
  let apiPromise: Promise<ApiData> | null = null

  async function getApiData () {
    if (apiData) return apiData

    // Try to read from cache first (SSR build reuses client build cache)
    if (existsSync(API_CACHE_FILE)) {
      try {
        apiData = JSON.parse(readFileSync(API_CACHE_FILE, 'utf8')) as ApiData
        console.log(`[generate-api] Loaded API from cache`)
        return apiData
      } catch {
        // Cache read failed, regenerate
      }
    }

    if (!apiPromise) {
      apiPromise = (async () => {
        try {
          const [components, composables] = await Promise.all([
            generateComponentApis(),
            generateComposableApis(),
          ])
          const data = { components, composables }
          // Write to cache for subsequent builds (SSR reuses this)
          try {
            mkdirSync(API_CACHE_DIR, { recursive: true })
            writeFileSync(API_CACHE_FILE, JSON.stringify(data))
          } catch {
            // Cache write failed, continue without caching
          }
          console.log(`[generate-api] Extracted API for ${Object.keys(components).length} components, ${Object.keys(composables).length} composables`)
          return data
        } catch (error) {
          apiPromise = null
          throw error
        }
      })()
    }
    apiData = await apiPromise
    return apiData
  }

  return {
    name: 'generate-api',

    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    async load (id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const data = await getApiData()
        return `export default ${JSON.stringify(data)}`
      }
    },

    configureServer (server) {
      // Serve api.json in dev mode
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api.json') return next()

        try {
          const data = await getApiData()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (error) {
          console.error('[generate-api] Error:', error)
          res.statusCode = 500
          res.end('Error generating API data')
        }
      })
    },

    async generateBundle (_, bundle) {
      // Emit api.json for runtime access (DocsAsk context)
      if (Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const data = await getApiData()
      this.emitFile({
        type: 'asset',
        fileName: 'api.json',
        source: JSON.stringify(data),
      })
    },

    buildEnd () {
      checker = null
      project = null
      apiData = null
      apiPromise = null
    },
  }
}
