import { isPlaygroundThemeId, sanitizePlaygroundThemes } from '@vuetify/play'

// Framework
import { IN_BROWSER, isArray, isObject, useTheme, useTimer } from '@vuetify/v0'

// Composables
import { readPlaygroundIdFromUrl, useOnePlaygrounds, usePlaygroundRouteId } from '@/composables/useOnePlaygrounds'
import { decodePlaygroundHash, encodePlaygroundHash, isFileRecord, parseVuetifyPlayTuple } from '@/composables/usePlayground'
import { usePlaygroundSettings } from '@/composables/usePlaygroundSettings'

// Data
import { createMainTs, createVuetifyTs, REPL_BUILTIN_FILES, REPL_TSCONFIG, REPL_TYPESCRIPT_VERSION, UNO_CONFIG_TS, vuetifyEsmUrl } from '@/data/playground-defaults'
import { ADDONS, DEFAULT_APP, PRESETS } from '@/data/presets'
import { parseRegistryQuery, resolveRegistryExample } from '@/data/registry'
import { parseVuetifyExampleQuery, resolveVuetifyExample } from '@/data/vuetify-examples'

// Utilities
import { compileFile, useStore } from '@vue/repl/core'
import { computed, onMounted, shallowRef, watch, watchEffect } from 'vue'

// Types
import type { PlaygroundHashData, PlaygroundThemeDefinition } from '@/composables/usePlayground'
import type { RegistryExampleRef } from '@/data/registry'
import type { VuetifyExampleRef } from '@/data/vuetify-examples'
import type { ShallowRef } from 'vue'

/** Last docs/Vuetify example loaded into the REPL — Open dialog highlights it. */
export type ActiveExample =
  | { source: 'v0', item: string, type: string, example: string }
  | { source: 'vuetify', path: string, id: string }

export function usePlaygroundFiles () {
  const theme = useTheme()
  const one = useOnePlaygrounds()
  const routeId = usePlaygroundRouteId()

  const {
    importMap,
    vueVersion,
    v0Version,
    vuetifyVersion,
    vuetifyNightly,
    vueVersions,
    v0Versions,
    vuetifyVersions,
    vuetifyNightlyVersions,
    fetching,
    fetchVersions,
  } = usePlaygroundSettings()

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
    // Pin the worker's TypeScript so it doesn't float to typescript@latest (TS 7
    // native port), which breaks lib .d.ts loading — see REPL_TYPESCRIPT_VERSION.
    typescriptVersion: shallowRef(REPL_TYPESCRIPT_VERSION),
    showOutput: shallowRef(false),
  })

  const isReady = shallowRef(false)
  const filesVersion = shallowRef(0)
  /** Set when a registry deep-link or browser open fails. */
  const loadError = shallowRef<string>()
  /** Which Open-gallery example is currently in the editor (if any). */
  const activeExample: ShallowRef<ActiveExample | undefined> = shallowRef()

  const aliasMap = shallowRef(new Map<string, string>())
  const extraImports = shallowRef<Record<string, string>>()
  const activePreset = shallowRef('default')
  const activeAddons = shallowRef<string[]>([])
  const extraThemes = shallowRef<Record<string, PlaygroundThemeDefinition>>()
  const extraDefault = shallowRef<string>()

  function mergedMainOptions () {
    const preset = PRESETS.find(p => p.id === activePreset.value)
    const result = { ...preset?.mainOptions }
    for (const id of activeAddons.value) {
      const addon = ADDONS.find(a => a.id === id)
      if (addon?.mainOptions) Object.assign(result, addon.mainOptions)
    }
    return result
  }

  function applyIncomingTheme (data?: Pick<PlaygroundHashData, 'theme' | 'themes' | 'settings'>) {
    const raw = data?.theme ?? (data?.settings as { theme?: string } | undefined)?.theme
    const id = raw && isPlaygroundThemeId(raw) ? raw : undefined
    extraDefault.value = id
    extraThemes.value = sanitizePlaygroundThemes(
      data?.themes ?? (data?.settings as { themes?: Record<string, PlaygroundThemeDefinition> } | undefined)?.themes,
    )
  }

  function clearIncomingTheme () {
    extraDefault.value = undefined
    extraThemes.value = undefined
  }

  function sandboxThemeId (isDark: boolean): string {
    const extra = extraThemes.value
    const selected = extraDefault.value
    if (selected && extra?.[selected]?.dark === isDark) {
      return selected
    }
    if (extra) {
      const match = Object.entries(extra).find(([, def]) => def.dark === isDark)
      if (match) return match[0]
    }
    return isDark ? 'dark' : 'light'
  }

  function syncHostTheme (id: string | undefined, themes?: Record<string, PlaygroundThemeDefinition>) {
    if (!id) return
    const dark = themes?.[id]?.dark ?? id === 'dark'
    theme.select(dark ? 'dark' : 'light')
  }

  function mainTs (defaultTheme?: string) {
    const id = defaultTheme ?? sandboxThemeId(theme.isDark.value)
    return createMainTs(id, mergedMainOptions(), vuetifyVersion.value, vuetifyNightly.value, extraThemes.value)
  }

  function rebuildMain () {
    const file = store.files['src/main.ts']
    if (!file) return
    file.code = mainTs()
    compileFile(store, file)
  }

  function rebuildImportMap () {
    const preset = PRESETS.find(p => p.id === activePreset.value)
    const imports: Record<string, string> = { ...preset?.imports }
    // Override vuetify import with versioned URL when vuetify preset is active
    // Use @vuetify/nightly package when nightly mode is enabled
    if (activePreset.value === 'vuetify') {
      imports.vuetify = vuetifyEsmUrl(vuetifyVersion.value, vuetifyNightly.value)
    }
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
    // Canonical `/playgrounds/:id` (via route) or legacy `?playground=<id>` (via URL).
    // Route-provided ID takes precedence; both win over bare hash so reload rebinds autosave.
    const oneId = routeId.value || readPlaygroundIdFromUrl()
    // Hash-only share links are self-contained. Short deep-links use query params
    // with an empty hash: v0 registry (`?example=`) or Vuetify docs (`?vuetify=`).
    const search = (!oneId && !decoded) ? new URLSearchParams(window.location.search) : null
    const vuetifyRef = search ? parseVuetifyExampleQuery(search) : null
    const registryRef = search && !vuetifyRef ? parseRegistryQuery(search) : null
    const themeQuery = search?.get('theme') ?? undefined

    if (oneId) {
      one.pauseAutosave()
      try {
        const playground = await one.fetchById(oneId)
        if (playground?.content) {
          one.setCurrent(playground.id, playground.title || 'Untitled', {
            favorite: playground.favorite ?? false,
            pinned: playground.pinned ?? false,
            locked: playground.locked ?? false,
            visibility: playground.visibility ?? 'public',
          }, { owner: playground.owner?.id })
          one.markSynced(playground.content)
          await openPlayground(playground.content)
        } else {
          // Stale / private / missing — drop the param and fall back.
          one.clearCurrent()
          await (decoded ? loadFromDecoded(decoded) : seedDefault())
        }
      } catch {
        one.clearCurrent()
        await (decoded ? loadFromDecoded(decoded) : seedDefault())
      } finally {
        one.resumeAutosave()
      }
    } else if (decoded) {
      await loadFromDecoded(decoded)
    } else if (vuetifyRef) {
      try {
        await openVuetifyExample(vuetifyRef, { clearSearch: true })
      } catch (error) {
        loadError.value = error instanceof Error ? error.message : String(error)
        clearRegistrySearch()
        await resetToDefault()
      }
    } else if (registryRef) {
      try {
        await openRegistryExample(registryRef, { clearSearch: true, theme: themeQuery })
      } catch (error) {
        loadError.value = error instanceof Error ? error.message : String(error)
        // Drop ?example= so a later hash rewrite / reload does not re-hit a
        // broken deep-link, and so hash-only shares stay the share surface.
        clearRegistrySearch()
        await resetToDefault()
      }
    } else {
      await seedDefault()
    }

    isReady.value = true
  })

  async function loadFromDecoded (decoded: PlaygroundHashData) {
    if (decoded.settings?.preset) activePreset.value = decoded.settings.preset
    if (decoded.settings?.vue) vueVersion.value = decoded.settings.vue
    if (decoded.settings?.v0) v0Version.value = decoded.settings.v0
    if (decoded.settings?.vuetify) vuetifyVersion.value = decoded.settings.vuetify
    if (decoded.settings?.vuetifyNightly) vuetifyNightly.value = decoded.settings.vuetifyNightly
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

    // Pre-declare Vuetify's cascade-layer order so it is established before any
    // other style enters the cascade. createVuetify() synchronously injects
    // <style>@layer vuetify-utilities{…}</style>, while the vuetify-labs.css
    // <link> is appended async — without this preamble vuetify-utilities ends
    // up declared before vuetify-components and components beat helpers.
    if (decoded.files['src/setup.ts']?.includes('vuetify-labs.css')) {
      decoded.files['src/setup.ts'] = `document.head.insertAdjacentHTML('afterbegin', '<style>@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;</style>')\n${decoded.files['src/setup.ts']}`
    }

    applyIncomingTheme(decoded)
    syncHostTheme(decoded.theme, decoded.themes)
    await loadExample(decoded.files, decoded.active)
    if (decoded.imports && Object.keys(decoded.imports).length > 0) {
      extraImports.value = decoded.imports
    }
    rebuildImportMap()
  }

  async function seedDefault () {
    await store.setFiles(
      {
        'src/main.ts': mainTs(),
        'src/uno.config.ts': UNO_CONFIG_TS,
        'src/App.vue': DEFAULT_APP,
        'tsconfig.json': REPL_TSCONFIG,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    store.files['tsconfig.json']!.hidden = true
    store.setActive('src/App.vue')
  }

  /** Clear preset/import state then seed the default v0 playground. */
  async function resetToDefault () {
    one.clearCurrent()
    activeExample.value = undefined
    activePreset.value = 'default'
    activeAddons.value = []
    extraImports.value = undefined
    aliasMap.value = new Map()
    clearIncomingTheme()
    rebuildImportMap()
    await seedDefault()
    filesVersion.value++
  }

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

    const options = mergedMainOptions()
    const theme_ = extraDefault.value ?? (theme.isDark.value ? 'dark' : 'light')
    // Ensure bare-specifier imports (vuetify, pinia, …) are on the map before
    // compile. setFiles calls applyBuiltinImportMap which can drop them, so
    // callers still rebuildImportMap() after loadExample — and we seed here too.
    rebuildImportMap()
    await store.setFiles(
      {
        'src/main.ts': mainTs(theme_),
        'src/uno.config.ts': UNO_CONFIG_TS,
        'tsconfig.json': REPL_TSCONFIG,
        ...(options.vuetify ? { 'src/vuetify.ts': createVuetifyTs(theme.isDark.value ? 'dark' : 'light') } : {}),
        ...files,
        ...aliases,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    store.files['tsconfig.json']!.hidden = true
    for (const key of Object.keys(aliases)) {
      if (store.files[key]) store.files[key]!.hidden = true
    }

    const userFile = (activeFile && store.files[activeFile])
      ? activeFile
      : (Object.keys(files).find(f => f !== 'src/App.vue') ?? 'src/App.vue')
    store.setActive(userFile)
  }

  /**
   * Share / One save payload — same shape as the URL hash body (pre-compress).
   * Skips alias flats and REPL builtins so re-open re-seeds infrastructure.
   */
  function buildShareData (): PlaygroundHashData | null {
    const aliases = new Set(aliasMap.value.values())
    const files: Record<string, string> = {}
    for (const [path, file] of Object.entries(store.files)) {
      if (aliases.has(path) || REPL_BUILTIN_FILES.includes(path as typeof REPL_BUILTIN_FILES[number])) continue
      files[path] = file.code
    }
    if (Object.keys(files).length === 0) return null

    const active = store.activeFile?.filename
    const settings: PlaygroundHashData['settings'] = {}
    if (vueVersion.value) settings.vue = vueVersion.value
    if (v0Version.value !== 'latest') settings.v0 = v0Version.value
    if (vuetifyVersion.value !== 'latest') settings.vuetify = vuetifyVersion.value
    if (vuetifyNightly.value) settings.vuetifyNightly = true
    if (activePreset.value !== 'default') settings.preset = activePreset.value
    if (activeAddons.value.length > 0) settings.addons = activeAddons.value.join(',')

    const data: PlaygroundHashData = { files, active, imports: extraImports.value }
    if (Object.keys(settings).length > 0) data.settings = settings
    if (extraDefault.value) data.theme = extraDefault.value
    if (extraThemes.value) data.themes = extraThemes.value
    return data
  }

  /** JSON content for Vuetify One `playground.content`. */
  function snapshotContent (): string {
    const data = buildShareData()
    if (!data) throw new Error('Nothing to save')
    return JSON.stringify(data)
  }

  const { start: scheduleHash } = useTimer(async () => {
    const data = buildShareData()
    if (!data) return
    const hash = await encodePlaygroundHash(data)
    // Keep path + query (`?playground=`) — only rewrite the content hash.
    const url = new URL(window.location.href)
    history.replaceState(null, '', `${url.pathname}${url.search}#${hash}`)
  }, { duration: 500 })

  watch(isReady, ready => {
    if (!ready) return
    watchEffect(() => {
      // Track version/preset/addon refs so hash updates when they change
      vueVersion.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      v0Version.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      vuetifyVersion.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      vuetifyNightly.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      activePreset.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      activeAddons.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      for (const file of Object.values(store.files)) {
        file.code // eslint-disable-line @typescript-eslint/no-unused-expressions
      }
      store.activeFile?.filename // eslint-disable-line @typescript-eslint/no-unused-expressions
      scheduleHash()
      // Once saved / opened from One, keep the remote snapshot in sync (play-style).
      one.currentId.value // eslint-disable-line @typescript-eslint/no-unused-expressions
      const data = buildShareData()
      one.scheduleAutosave(data ? JSON.stringify(data) : undefined)
    })
  }, { once: true })

  watch(theme.isDark, isDark => {
    if (!isReady.value) return
    const mode = isDark ? 'dark' : 'light'
    extraDefault.value = sandboxThemeId(isDark)
    const main = store.files['src/main.ts']
    if (main) {
      main.code = mainTs(extraDefault.value)
      compileFile(store, main)
    }
    // Keep sandbox Vuetify theme aligned with the host chrome toggle.
    const vuetify = store.files['src/vuetify.ts']
    if (vuetify) {
      vuetify.code = createVuetifyTs(mode)
      compileFile(store, vuetify)
    }
  })

  // Rebuild main and import map when Vuetify version changes (nightly toggle or version select)
  watch([vuetifyVersion, vuetifyNightly], () => {
    if (!isReady.value || activePreset.value !== 'vuetify') return
    rebuildMain()
    rebuildImportMap()
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

    one.clearCurrent()
    activeExample.value = undefined
    activePreset.value = id
    activeAddons.value = []
    extraImports.value = preset.imports ?? undefined
    aliasMap.value = new Map() // presets use direct paths, no aliases
    clearIncomingTheme()

    // Import map must include bare `vuetify` *before* setFiles compiles main/vuetify.ts.
    // setFiles re-applies builtins, so rebuild again after to keep preset imports.
    rebuildImportMap()

    const theme_ = theme.isDark.value ? 'dark' : 'light'
    const options = preset.mainOptions
    await store.setFiles(
      {
        'src/main.ts': createMainTs(theme_, options, vuetifyVersion.value, vuetifyNightly.value),
        'src/uno.config.ts': UNO_CONFIG_TS,
        'tsconfig.json': REPL_TSCONFIG,
        ...(options?.vuetify ? { 'src/vuetify.ts': createVuetifyTs(theme_) } : {}),
        ...preset.files,
      },
      'src/main.ts', // must be main.ts so the sandbox runs it (installs plugins)
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    store.files['tsconfig.json']!.hidden = true
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

  /**
   * Load a Vuetify One `content` blob (or any saved JSON payload).
   * Supports v0play share objects, Vuetify Play tuples, and legacy file maps.
   */
  async function openPlayground (content: string) {
    try {
      loadError.value = undefined
      const parsed: unknown = JSON.parse(content)

      // v0play native: { files, active?, imports?, settings? }
      if (
        isObject(parsed)
        && 'files' in parsed
        && isFileRecord((parsed as { files: unknown }).files)
      ) {
        const data = parsed as PlaygroundHashData
        activeExample.value = undefined
        activePreset.value = data.settings?.preset ?? 'default'
        activeAddons.value = data.settings?.addons
          ? data.settings.addons.split(',').filter(Boolean)
          : []
        extraImports.value = data.imports
        aliasMap.value = new Map()
        if (data.settings?.vue) vueVersion.value = data.settings.vue
        if (data.settings?.v0) v0Version.value = data.settings.v0
        if (data.settings?.vuetify) vuetifyVersion.value = data.settings.vuetify
        if (data.settings?.vuetifyNightly) vuetifyNightly.value = data.settings.vuetifyNightly
        applyIncomingTheme(data)
        syncHostTheme(data.theme, data.themes)

        await loadExample(data.files, data.active)
        rebuildImportMap()
        filesVersion.value++
        return
      }

      // Vuetify Play tuple
      if (isArray(parsed)) {
        const result = parseVuetifyPlayTuple(parsed)
        if (!result) return

        const { files, imports, active, vue, preset } = result

        // Preset from parseVuetifyPlayTuple — single source for tuple→preset.
        activeExample.value = undefined
        activePreset.value = preset
        activeAddons.value = []
        extraImports.value = Object.keys(imports).length > 0 ? imports : undefined
        aliasMap.value = new Map()
        clearIncomingTheme()

        if (vue) vueVersion.value = vue

        await loadExample(files, active)
        rebuildImportMap()
        filesVersion.value++
        return
      }

      // Legacy plain file map
      if (isFileRecord(parsed)) {
        activeExample.value = undefined
        activePreset.value = 'default'
        activeAddons.value = []
        extraImports.value = undefined
        aliasMap.value = new Map()
        clearIncomingTheme()
        await loadExample(parsed)
        rebuildImportMap()
        filesVersion.value++
      }
    } catch { /* ignore malformed content */ }
  }

  function clearRegistrySearch () {
    if (!IN_BROWSER) return
    const url = new URL(window.location.href)
    url.searchParams.delete('example')
    url.searchParams.delete('item')
    url.searchParams.delete('registry')
    url.searchParams.delete('vuetify')
    url.searchParams.delete('source')
    url.searchParams.delete('theme')
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  /**
   * Load a docs registry example into the REPL.
   * Optionally strip `?example=` / `?item=` from the URL so the subsequent
   * hash write is the share surface (self-contained, no registry dependency).
   */
  async function openRegistryExample (
    ref: RegistryExampleRef,
    options: { clearSearch?: boolean, theme?: string } = {},
  ) {
    loadError.value = undefined
    const resolved = await resolveRegistryExample(ref)

    one.clearCurrent()
    activePreset.value = 'default'
    activeAddons.value = []
    extraImports.value = resolved.imports
    aliasMap.value = new Map()
    applyIncomingTheme(options.theme ? { theme: options.theme } : undefined)
    syncHostTheme(options.theme)

    await loadExample(resolved.files, resolved.active)
    rebuildImportMap()
    filesVersion.value++

    activeExample.value = {
      source: 'v0',
      item: resolved.meta.item.name,
      type: resolved.meta.item.type,
      example: resolved.meta.example.id,
    }

    if (options.clearSearch) clearRegistrySearch()
  }

  /**
   * Load a public Vuetify 4 docs example (raw git) into the REPL with the
   * Vuetify preset. Share hash is rewritten by the existing scheduleHash path.
   */
  async function openVuetifyExample (
    ref: VuetifyExampleRef,
    options: { clearSearch?: boolean } = {},
  ) {
    loadError.value = undefined
    // Fetch first so a network/path failure never leaves the UI on the Vuetify
    // preset with default (or half-loaded) files.
    const resolved = await resolveVuetifyExample(ref)

    one.clearCurrent()
    const preset = PRESETS.find(p => p.id === 'vuetify')
    activePreset.value = 'vuetify'
    activeAddons.value = []
    extraImports.value = preset?.imports ?? undefined
    aliasMap.value = new Map()
    clearIncomingTheme()

    try {
      // Map first (bare `vuetify` → labs CDN), then compile main + vuetify.ts + App.
      rebuildImportMap()
      await loadExample(resolved.files, resolved.active)
      rebuildImportMap()
      filesVersion.value++
      const id = ref.path.replace(/\.vue$/i, '').split('/').pop() ?? ref.path
      activeExample.value = { source: 'vuetify', path: ref.path, id }
    } catch (error) {
      await resetToDefault()
      throw error
    }

    if (options.clearSearch) clearRegistrySearch()
  }

  return {
    store,
    isReady,
    filesVersion,
    loadError,
    loadExample,
    vueVersion,
    v0Version,
    vuetifyVersion,
    vuetifyNightly,
    vueVersions,
    v0Versions,
    vuetifyVersions,
    vuetifyNightlyVersions,
    fetching,
    fetchVersions,
    activePreset,
    applyPreset,
    activeAddons,
    toggleAddon,
    openPlayground,
    openRegistryExample,
    openVuetifyExample,
    activeExample,
    snapshotContent,
  }
}
