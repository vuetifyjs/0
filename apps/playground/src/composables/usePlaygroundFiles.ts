// Framework
import { isArray, useTheme, useTimer } from '@vuetify/v0'

// Composables
import { decodePlaygroundHash, encodePlaygroundHash, parseVuetifyPlayTuple } from '@/composables/usePlayground'
import { usePlaygroundSettings } from '@/composables/usePlaygroundSettings'

// Data
import { createMainTs, UNO_CONFIG_TS } from '@/data/playground-defaults'
import { ADDONS, DEFAULT_APP, PRESETS } from '@/data/presets'

// Utilities
import { compileFile, useStore } from '@vue/repl/core'
import { computed, onMounted, shallowRef, watch, watchEffect } from 'vue'

// Types
import type { PlaygroundHashData } from '@/composables/usePlayground'

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
          'src/App.vue': DEFAULT_APP,
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

  const { start: scheduleHash } = useTimer(async () => {
    const aliases = new Set(aliasMap.value.values())
    const files: Record<string, string> = {}
    for (const [path, file] of Object.entries(store.files)) {
      if (!aliases.has(path)) {
        files[path] = file.code
      }
    }
    if (Object.keys(files).length === 0) return
    const active = store.activeFile?.filename
    const settings: PlaygroundHashData['settings'] = {}
    if (vueVersion.value) settings.vue = vueVersion.value
    if (v0Version.value !== 'latest') settings.v0 = v0Version.value
    if (activePreset.value !== 'default') settings.preset = activePreset.value
    if (activeAddons.value.length > 0) settings.addons = activeAddons.value.join(',')
    const data: PlaygroundHashData = { files, active, imports: extraImports.value }
    if (Object.keys(settings).length > 0) data.settings = settings
    const hash = await encodePlaygroundHash(data)
    history.replaceState(null, '', `#${hash}`)
  }, { duration: 500 })

  watch(isReady, ready => {
    if (!ready) return
    watchEffect(() => {
      // Track version/preset/addon refs so hash updates when they change
      vueVersion.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      v0Version.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      activePreset.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      activeAddons.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      for (const file of Object.values(store.files)) {
        file.code // eslint-disable-line @typescript-eslint/no-unused-expressions
      }
      store.activeFile?.filename // eslint-disable-line @typescript-eslint/no-unused-expressions
      scheduleHash()
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
    try {
      const parsed = JSON.parse(content)
      if (!isArray(parsed)) return

      const result = parseVuetifyPlayTuple(parsed)
      if (!result) return

      const { files, imports, active, vue } = result

      // Detect preset: vuetify template has 'vuetify' in the import map and setup.ts;
      // v0 template uses @vuetify/v0 with createThemePlugin in main.ts
      const isVuetifyPreset = 'vuetify' in imports || !!files['src/vuetify.ts'] || !!files['src/setup.ts']
      activePreset.value = isVuetifyPreset ? 'vuetify' : 'default'
      activeAddons.value = []
      extraImports.value = Object.keys(imports).length > 0 ? imports : undefined
      aliasMap.value = new Map()

      if (vue) vueVersion.value = vue

      await loadExample(files, active)
      rebuildImportMap()
      filesVersion.value++
    } catch { /* ignore malformed content */ }
  }

  return { store, isReady, filesVersion, loadExample, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions, activePreset, applyPreset, activeAddons, toggleAddon, openPlayground }
}
