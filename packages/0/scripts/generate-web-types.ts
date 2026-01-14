import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createChecker } from 'vue-component-meta'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..')
const PACKAGE_ROOT = resolve(ROOT, 'packages/0')
const COMPONENTS_DIR = resolve(PACKAGE_ROOT, 'src/components')
const OUTPUT_DIR = resolve(PACKAGE_ROOT, 'dist/json')
const TSCONFIG = resolve(PACKAGE_ROOT, 'tsconfig.json')

// Ensure output dir exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Read package.json for version
const packageJson = JSON.parse(readFileSync(resolve(PACKAGE_ROOT, 'package.json'), 'utf8'))
const version = packageJson.version

// Vue internal props to filter out
const VUE_INTERNALS = new Set([
  'key', 'ref', 'ref_for', 'ref_key', 'class', 'style',
  'onVue:beforeMount', 'onVue:mounted', 'onVue:beforeUpdate',
  'onVue:updated', 'onVue:beforeUnmount', 'onVue:unmounted',
])

function toKebab (str: string) {
  return str.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

async function run () {
  console.log('Generating web-types...')

  const checker = createChecker(TSCONFIG, {
    forceUseTs: true,
    printer: { newLine: 1 },
  })

  const componentDirs = await readdir(COMPONENTS_DIR)
  const components: any[] = []
  const namespaces: string[] = []
  const globalEvents: Map<string, any> = new Map()

  for (const dir of componentDirs) {
    const dirPath = resolve(COMPONENTS_DIR, dir)
    // Check if it's a directory
    try {
      const stats = await stat(dirPath)
      if (!stats.isDirectory()) continue
    } catch {
      continue
    }

    // Check for namespace export
    try {
      const indexContent = readFileSync(resolve(dirPath, 'index.ts'), 'utf8')
      const namespaceExport = new RegExp(String.raw`export\s+(?:const|var|let)\s+${dir}\b`).test(indexContent) ||
        new RegExp(String.raw`export\s+\{[^}]*\bas\s+${dir}\b[^}]*\}`).test(indexContent)

      if (namespaceExport) {
        namespaces.push(dir)
      }
    } catch {
      // index.ts might not exist
    }

    const entries = await readdir(dirPath).catch(() => [])

    // Find .vue files
    for (const entry of entries) {
      if (!entry.endsWith('.vue')) continue

      const componentName = entry.replace('.vue', '')
      const filePath = resolve(dirPath, entry)

      console.log(`Processing ${componentName}...`)

      try {
        const meta = checker.getComponentMeta(filePath)

        const props = meta.props
          .filter(p => !VUE_INTERNALS.has(p.name))
          .map(p => ({
            name: p.name,
            type: p.type,
            required: p.required,
            default: p.default,
            description: p.description,
          }))

        const events = meta.events
          .filter(e => e.name !== 'update:modelValue')
          .map(e => {
            let type = e.type
            if (type?.startsWith('[') && type?.endsWith(']')) {
              type = type.slice(1, -1).replace(/^\w+:\s*/, '')
            }
            return {
              name: e.name,
              type,
              description: e.description,
            }
          })

        for (const e of events) {
          if (!globalEvents.has(e.name)) {
            globalEvents.set(e.name, {
              name: e.name,
              arguments: [{
                name: '$event',
                type: e.type,
              }],
              description: e.description,
            })
          }
        }

        const slots = meta.slots.map(s => ({
          name: s.name,
          type: s.type,
          description: s.description,
        }))

        components.push({
          name: componentName, // PascalCase
          kebabName: toKebab(componentName),
          props,
          events,
          slots,
          description: `Vuetify 0 ${componentName} component`,
        })
      } catch (error) {
        console.error(`Failed to process ${componentName}:`, error)
      }
    }
  }

  // Generate web-types.json
  const webTypes = {
    '$schema': 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    'framework': 'vue',
    'name': '@vuetify/v0',
    version,
    'js-types-syntax': 'typescript',
    'contributions': {
      html: {
        elements: components.map(c => {
          const element: any = {
            name: c.kebabName,
            description: c.description,
            attributes: c.props.map((p: any) => ({
              name: p.name,
              value: {
                kind: 'expression',
                type: p.type,
              },
              description: p.description,
              default: p.default,
              required: p.required,
            })),
          }

          if (c.slots.length > 0) {
            element.slots = c.slots.map((s: any) => {
              let type = s.type
              if (type && /^[A-Z]\w+SlotProps/.test(type)) {
                const baseType = type.replace(/<.*>$/, '')
                type = `import('${packageJson.name}').${baseType}`
              }
              return {
                name: s.name,
                type,
                description: s.description,
              }
            })
          }

          return element
        }),
      },
      js: {
        events: Array.from(globalEvents.values()),
      },
    },
  }

  writeFileSync(resolve(OUTPUT_DIR, 'web-types.json'), JSON.stringify(webTypes, null, 2))

  // Generate tags.json
  const tags = components.reduce((acc, c) => {
    acc[c.kebabName] = {
      attributes: c.props.map((p: any) => p.name),
      description: c.description,
    }
    return acc
  }, {} as Record<string, any>)

  writeFileSync(resolve(OUTPUT_DIR, 'tags.json'), JSON.stringify(tags, null, 2))

  // Generate attributes.json
  const attributes = components.reduce((acc, c) => {
    for (const p of c.props) {
      acc[`${c.kebabName}/${p.name}`] = {
        type: p.type,
        description: p.description,
      }
    }
    return acc
  }, {} as Record<string, any>)

  writeFileSync(resolve(OUTPUT_DIR, 'attributes.json'), JSON.stringify(attributes, null, 2))

  // Generate importMap.json
  const importMap = {
    components: {
      ...components.reduce((acc, c) => {
        acc[c.name] = {
          from: '@vuetify/v0',
          styles: [],
        }
        return acc
      }, {} as Record<string, any>),
      ...namespaces.reduce((acc, name) => {
        acc[name] = {
          from: '@vuetify/v0',
          styles: [],
        }
        return acc
      }, {} as Record<string, any>),
    },
  }

  writeFileSync(resolve(OUTPUT_DIR, 'importMap.json'), JSON.stringify(importMap, null, 2))

  console.log('Done!')
}

run()
