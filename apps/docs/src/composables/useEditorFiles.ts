// Composables
import { decodeEditorHash } from '@/composables/editorLink'

// Utilities
import { onMounted, shallowRef, watch } from 'vue'

// Types
import type { ReplStore } from '@vue/repl'

import { createMainTs, DEFAULT_CODE, UNO_CONFIG_TS } from '@/data/editor-defaults'

export function useEditorFiles (store: ReplStore, isDark: () => boolean) {
  const isReady = shallowRef(false)
  const fileTreeKey = shallowRef(0)

  // Map nested file paths to their flat alias paths (e.g. src/dir/Foo.vue → src/Foo.vue)
  // so edits to nested files propagate to the alias the REPL uses for imports
  const aliasMap = shallowRef(new Map<string, string>())

  onMounted(async () => {
    const hash = window.location.hash.slice(1)
    const decoded = hash ? await decodeEditorHash(hash) : null

    if (decoded) {
      await loadExample(decoded)
    } else {
      const theme = isDark() ? 'dark' : 'light'
      await store.setFiles(
        {
          'src/main.ts': createMainTs(theme),
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

  async function loadExample (files: Record<string, string>) {
    // Create hidden flat aliases for nested files so the REPL's runtime
    // import resolution works. The REPL resolves all `./X` as `src/X`,
    // so `src/dir/Foo.vue` needs a hidden `src/Foo.vue` alias.
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

    const theme = isDark() ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(theme),
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

    // Activate the first user file, not the generated App.vue wrapper
    const userFile = Object.keys(files).find(f => f !== 'src/App.vue') ?? 'src/App.vue'
    store.setActive(userFile)
    fileTreeKey.value++
  }

  // Sync edits from nested files to their flat aliases
  watch(() => store.activeFile?.code, code => {
    if (code === undefined) return
    const flatPath = aliasMap.value.get(store.activeFile.filename)
    if (flatPath && store.files[flatPath] && store.files[flatPath].code !== code) {
      store.files[flatPath].code = code
    }
  })

  return { isReady, fileTreeKey, loadExample }
}
