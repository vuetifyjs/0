// Framework
import { debounce, useTheme } from '@vuetify/v0'

// Composables
import { decodePlaygroundHash, encodePlaygroundHash } from '@/composables/usePlaygroundLink'

// Utilities
import { useStore, useVueImportMap } from '@vue/repl'
import { computed, onMounted, shallowRef, watch, watchEffect } from 'vue'

// Data
import { createMainTs, DEFAULT_CODE, INFRASTRUCTURE_FILES, UNO_CONFIG_TS } from '@/data/playground-defaults'

export function usePlaygroundFiles () {
  const theme = useTheme()

  const { importMap, vueVersion } = useVueImportMap({
    runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
  })

  const builtinImportMap = computed(() => ({
    imports: {
      ...importMap.value?.imports,
      '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@latest/dist/index.mjs',
    },
  }))

  const store = useStore({
    builtinImportMap,
    vueVersion,
    showOutput: shallowRef(false),
  })

  const isReady = shallowRef(false)

  const aliasMap = shallowRef(new Map<string, string>())

  onMounted(async () => {
    const hash = window.location.hash.slice(1)
    const decoded = hash ? await decodePlaygroundHash(hash) : null

    if (decoded) {
      await loadExample(decoded.files, decoded.active)
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

    for (const [path, code] of Object.entries(files)) {
      const rel = path.replace(/^src\//, '')
      const parts = rel.split('/')
      if (parts.length > 1) {
        const flatPath = `src/${parts.at(-1)}`
        if (!files[flatPath]) {
          aliases[flatPath] = code
          nextAliasMap.set(path, flatPath)
        }
      }
    }

    aliasMap.value = nextAliasMap

    const theme_ = theme.isDark.value ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(theme_),
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
    const hash = await encodePlaygroundHash({ files, active })
    history.replaceState(null, '', `#${hash}`)
  }, 500)

  watch(isReady, ready => {
    if (!ready) return
    watchEffect(() => {
      const files: Record<string, string> = {}
      for (const [path, file] of Object.entries(store.files)) {
        if (!INFRASTRUCTURE_FILES.has(path) && !file.hidden) {
          files[path] = file.code
        }
      }
      updateHash(files, store.activeFile?.filename)
    })
  }, { once: true })

  watch(() => store.activeFile?.code, code => {
    if (code === undefined) return
    const flatPath = aliasMap.value.get(store.activeFile.filename)
    if (flatPath && store.files[flatPath] && store.files[flatPath].code !== code) {
      store.files[flatPath].code = code
    }
  })

  return { store, isReady, loadExample }
}
