// Framework
import { debounce, isArray, isObject, isString, useTheme } from '@vuetify/v0'

// Composables
import { decodePlaygroundHash, encodePlaygroundHash } from '@/composables/usePlayground'
import { usePlaygroundSettings } from '@/composables/usePlaygroundSettings'

// Utilities
import { compileFile, useStore } from '@vue/repl/core'
import { computed, onMounted, shallowRef, watch, watchEffect } from 'vue'

// Types
import type { PlaygroundHashData } from '@/composables/usePlayground'

// Data
import { createMainTs, DEFAULT_CODE, UNO_CONFIG_TS } from '@/data/playground-defaults'
import { ADDONS, PRESETS } from '@/data/presets'

export function usePlaygroundFiles () {
  const theme = useTheme()

  const { importMap, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions } = usePlaygroundSettings()

  const builtinImportMap = computed(() => ({
    imports: {
      ...importMap.value?.imports,
      '@vuetify/v0': `https://cdn.jsdelivr.net/npm/@vuetify/v0@${v0Version.value}/dist/index.mjs`,
      // Always available — pinia/vue-router prod builds import this at runtime to detect devtools
      '@vue/devtools-api': 'https://esm.sh/@vue/devtools-api@6',
    },
  }))

  const store = useStore({
    builtinImportMap,
    vueVersion,
    showOutput: shallowRef(false),
  })

  const isReady = shallowRef(false)
  const filesVersion = shallowRef(0)

  const aliasMap = shallowRef(new Map<string, string>())
  const extraImports = shallowRef<Record<string, string>>()
  const activePreset = shallowRef('default')
  const activeAddons = shallowRef<string[]>([])

  function mergedMainOptions () {
    const preset = PRESETS.find(p => p.id === activePreset.value)
    const result = { ...preset?.mainOptions }
    for (const id of activeAddons.value) {
      const addon = ADDONS.find(a => a.id === id)
      if (addon?.mainOptions) Object.assign(result, addon.mainOptions)
    }
    return result
  }

  function rebuildMain () {
    const file = store.files['src/main.ts']
    if (!file) return
    file.code = createMainTs(theme.isDark.value ? 'dark' : 'light', mergedMainOptions())
    compileFile(store, file)
  }

  function rebuildImportMap () {
    const preset = PRESETS.find(p => p.id === activePreset.value)
    const imports: Record<string, string> = { ...preset?.imports }
    for (const id of activeAddons.value) {
      const addon = ADDONS.find(a => a.id === id)
      if (addon?.imports) Object.assign(imports, addon.imports)
    }
    if (extraImports.value) Object.assign(imports, extraImports.value)
    store.setImportMap({ imports }, true)
  }

  onMounted(async () => {
    const hash = window.location.hash.slice(1)
    const decoded = hash ? await decodePlaygroundHash(hash) : null

    if (decoded) {
      if (decoded.settings?.preset) activePreset.value = decoded.settings.preset
      if (decoded.settings?.vue) vueVersion.value = decoded.settings.vue
      if (decoded.settings?.v0) v0Version.value = decoded.settings.v0
      if (decoded.settings?.addons) activeAddons.value = decoded.settings.addons.split(',').filter(Boolean)

      // Vuetify Play hashes (Format 4 and re-encoded Format 2/3) include infrastructure
      // files the v0 playground doesn't process. When the vuetify preset is active and
      // setup.ts has a loadStylesheet helper, inject Vuetify CSS loading into it.
      if (activePreset.value === 'vuetify') {
        const setup = decoded.files['src/setup.ts']
        if (setup && setup.includes('loadStylesheet') && !setup.includes('vuetify-labs.css')) {
          decoded.files['src/setup.ts'] = `${setup}\nloadStylesheet('https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify-labs.css')\n`
        }
        delete decoded.files['src/links.json']
        delete decoded.files['src/import-map.json']
      }

      await loadExample(decoded.files, decoded.active)
      if (decoded.imports && Object.keys(decoded.imports).length > 0) {
        extraImports.value = decoded.imports
      }
      rebuildImportMap()
    } else {
      const theme_ = theme.isDark.value ? 'dark' : 'light'
      await store.setFiles(
        {
          'src/main.ts': createMainTs(theme_),
          'src/uno.config.ts': UNO_CONFIG_TS,
          'src/App.vue': DEFAULT_CODE,
        },
        'src/main.ts',
      )
      store.files['src/main.ts']!.hidden = true
      store.files['src/uno.config.ts']!.hidden = true
      store.setActive('src/App.vue')
    }

    isReady.value = true
  })

  async function loadExample (files: Record<string, string>, activeFile?: string) {
    const aliases: Record<string, string> = {}
    const nextAliasMap = new Map<string, string>()

    const usedFlats = new Set<string>()
    for (const [path, code] of Object.entries(files)) {
      const rel = path.replace(/^src\//, '')
      const parts = rel.split('/')
      if (parts.length > 1) {
        const basename = parts.at(-1)!
        let flatPath = `src/${basename}`
        if (files[flatPath] || usedFlats.has(flatPath)) {
          const ext = basename.includes('.') ? basename.slice(basename.lastIndexOf('.')) : ''
          const name = basename.includes('.') ? basename.slice(0, basename.lastIndexOf('.')) : basename
          let counter = 2
          while (files[`src/${name}${counter}${ext}`] || usedFlats.has(`src/${name}${counter}${ext}`)) {
            counter++
          }
          flatPath = `src/${name}${counter}${ext}`
        }
        usedFlats.add(flatPath)
        aliases[flatPath] = code
        nextAliasMap.set(path, flatPath)
      }
    }

    aliasMap.value = nextAliasMap

    const theme_ = theme.isDark.value ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(theme_, mergedMainOptions()),
        'src/uno.config.ts': UNO_CONFIG_TS,
        ...files,
        ...aliases,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    for (const key of Object.keys(aliases)) {
      if (store.files[key]) store.files[key]!.hidden = true
    }

    const userFile = (activeFile && store.files[activeFile])
      ? activeFile
      : (Object.keys(files).find(f => f !== 'src/App.vue') ?? 'src/App.vue')
    store.setActive(userFile)
  }

  const updateHash = debounce(async (files: Record<string, string>, active: string | undefined) => {
    if (Object.keys(files).length === 0) return
    const settings: PlaygroundHashData['settings'] = {}
    if (vueVersion.value) settings.vue = vueVersion.value
    if (v0Version.value !== 'latest') settings.v0 = v0Version.value
    if (activePreset.value !== 'default') settings.preset = activePreset.value
    if (activeAddons.value.length > 0) settings.addons = activeAddons.value.join(',')
    const data: PlaygroundHashData = { files, active, imports: extraImports.value }
    if (Object.keys(settings).length > 0) data.settings = settings
    const hash = await encodePlaygroundHash(data)
    history.replaceState(null, '', `#${hash}`)
  }, 500)

  watch(isReady, ready => {
    if (!ready) return
    watchEffect(() => {
      // Track version/preset/addon refs so hash updates when they change
      vueVersion.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      v0Version.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      activePreset.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      activeAddons.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      const aliases = new Set(aliasMap.value.values())
      const files: Record<string, string> = {}
      for (const [path, file] of Object.entries(store.files)) {
        if (!aliases.has(path)) {
          files[path] = file.code
        }
      }
      updateHash(files, store.activeFile?.filename)
    })
  }, { once: true })

  watch(theme.isDark, isDark => {
    if (!isReady.value) return
    const file = store.files['src/main.ts']
    if (file) {
      file.code = createMainTs(isDark ? 'dark' : 'light', mergedMainOptions())
      compileFile(store, file)
    }
  })

  watch(() => store.activeFile?.code, code => {
    if (code === undefined) return
    const flatPath = aliasMap.value.get(store.activeFile.filename)
    if (flatPath && store.files[flatPath] && store.files[flatPath].code !== code) {
      store.files[flatPath].code = code
    }
  })

  async function applyPreset (id: string) {
    const preset = PRESETS.find(p => p.id === id)
    if (!preset) return

    activePreset.value = id
    activeAddons.value = []
    extraImports.value = preset.imports ?? undefined
    aliasMap.value = new Map() // presets use direct paths, no aliases

    const theme_ = theme.isDark.value ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(theme_, preset.mainOptions),
        'src/uno.config.ts': UNO_CONFIG_TS,
        ...preset.files,
      },
      'src/main.ts', // must be main.ts so the sandbox runs it (installs plugins)
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    store.setActive('src/App.vue')

    rebuildImportMap()
    filesVersion.value++
  }

  function disableAddon (id: string) {
    const addon = ADDONS.find(a => a.id === id)
    if (!addon || !activeAddons.value.includes(id)) return

    for (const filename of Object.keys(addon.files ?? {})) {
      if (store.files[filename]) store.deleteFile(filename)
    }
    const preset = PRESETS.find(p => p.id === activePreset.value)
    for (const filename of Object.keys(addon.replaceFiles ?? {})) {
      const code = preset?.files[filename]
      const file = store.files[filename]
      if (file && code) {
        file.code = code
        compileFile(store, file)
      }
    }
    activeAddons.value = activeAddons.value.filter(a => a !== id)
  }

  async function toggleAddon (id: string) {
    const addon = ADDONS.find(a => a.id === id)
    if (!addon) return

    const enabled = activeAddons.value.includes(id)

    if (enabled) {
      disableAddon(id)
    } else {
      // Disable conflicting addons first
      for (const excludeId of addon.excludes ?? []) {
        disableAddon(excludeId)
      }

      for (const [filename, code] of Object.entries(addon.files ?? {})) {
        store.addFile(filename)
        const file = store.files[filename]
        if (file) {
          file.code = code
          compileFile(store, file)
        }
      }
      for (const [filename, code] of Object.entries(addon.replaceFiles ?? {})) {
        const file = store.files[filename]
        if (file) {
          file.code = code
          compileFile(store, file)
        }
      }
      activeAddons.value = [...activeAddons.value, id]
    }

    rebuildMain()
    rebuildImportMap()
    filesVersion.value++
  }

  async function openPlayground (content: string) {
    const parsed = JSON.parse(content)
    if (!isArray(parsed) || !isObject(parsed[0])) return

    const [rawFiles, vueVer, , , rawActive] = parsed as [
      Record<string, string>, unknown, unknown, unknown, unknown,
    ]
    // Extract infrastructure files before building the src/-prefixed file map
    const linksJson = rawFiles['links.json']
    const importMapJson = rawFiles['import-map.json']
    const files: Record<string, string> = {}
    for (const [key, code] of Object.entries(rawFiles)) {
      if (key === 'import-map.json' || key === 'links.json') continue
      files[key.startsWith('src/') ? key : `src/${key}`] = code
    }

    // Parse custom imports from import-map.json
    let imports: Record<string, string> = {}
    if (importMapJson) {
      try {
        const parsed_ = JSON.parse(importMapJson)
        if (isObject(parsed_) && isObject(parsed_.imports)) {
          imports = parsed_.imports as Record<string, string>
        }
      } catch { /* ignore malformed import-map.json */ }
    }

    // Auto-resolve bare import specifiers not covered by the stored import map.
    // Vuetify Play's dependency panel adds packages at runtime but the stored
    // content only captures the template's base import map.
    const knownSpecifiers = new Set([
      ...Object.keys(imports),
      'vue', 'vue/server-renderer', '@vue/devtools-api',
      '@vuetify/v0', 'vuetify',
    ])
    const bareImportRe = /\bfrom\s+['"]([^./][^'"]*)['"]/g
    for (const code of Object.values(files)) {
      for (const match of code.matchAll(bareImportRe)) {
        const specifier = match[1]!
        const pkg = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]!
        if (!knownSpecifiers.has(pkg)) {
          imports[pkg] = `https://esm.sh/${pkg}`
          knownSpecifiers.add(pkg)
        }
      }
    }

    // Inject CSS from links.json into setup.ts
    if (linksJson) {
      try {
        const links = JSON.parse(linksJson)
        const setup = files['src/setup.ts']
        const urls = isArray(links.css) ? links.css.filter(isString) : []
        if (setup && urls.length > 0) {
          files['src/setup.ts'] = setup + '\n' + urls.map((url: string) => `loadStylesheet('${url}')`).join('\n') + '\n'
        }
      } catch { /* ignore malformed links.json */ }
    }

    // Fallback: ensure vuetify-labs.css is loaded even without links.json
    const setup = files['src/setup.ts']
    if (setup && setup.includes('loadStylesheet') && !setup.includes('vuetify-labs.css')) {
      files['src/setup.ts'] = `${setup}\nloadStylesheet('https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify-labs.css')\n`
    }

    // Set vuetify preset
    activePreset.value = 'vuetify'
    activeAddons.value = []
    extraImports.value = Object.keys(imports).length > 0 ? imports : undefined
    aliasMap.value = new Map()

    if (isString(vueVer)) vueVersion.value = vueVer

    const active = isString(rawActive)
      ? (rawActive.startsWith('src/') ? rawActive : `src/${rawActive}`)
      : undefined

    await loadExample(files, active)
    rebuildImportMap()
    filesVersion.value++
  }

  return { store, isReady, filesVersion, loadExample, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions, activePreset, applyPreset, activeAddons, toggleAddon, openPlayground }
}
