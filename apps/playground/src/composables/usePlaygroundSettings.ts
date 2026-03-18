// Utilities
import { useVueImportMap } from '@vue/repl/core'
import { shallowRef } from 'vue'

// Data
import { fetchNpmVersions } from '@/utilities/npm'

export function usePlaygroundSettings () {
  const { importMap, vueVersion } = useVueImportMap({
    runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
  })

  const v0Version = shallowRef('latest')

  const vueVersions = shallowRef<string[]>([])
  const v0Versions = shallowRef<string[]>([])

  const fetching = shallowRef(false)
  let fetched = false

  async function fetchVersions () {
    if (fetched) return
    fetched = true
    fetching.value = true
    try {
      const [vue, v0] = await Promise.all([
        fetchNpmVersions('vue', '3.2.0', false),
        fetchNpmVersions('@vuetify/v0', '0.1.0', true),
      ])
      vueVersions.value = vue
      v0Versions.value = v0
    } catch {
      fetched = false
    } finally {
      fetching.value = false
    }
  }

  return { importMap, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions }
}
