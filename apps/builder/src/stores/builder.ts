// Utilities
import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

// Types
import type { DependencyGraph, Feature, Intent, ResolvedSet } from '@/data/types'

import dependencyGraph from '@/data/dependencies.json'
import { buildCatalog } from '@/data/features'
import { toPlaygroundUrl } from '@/engine/manifest'
import { resolve } from '@/engine/resolve'

export const useBuilderStore = defineStore('builder', () => {
  const catalog = buildCatalog()
  const graph = dependencyGraph as DependencyGraph

  // State
  const intent = shallowRef<Intent | null>(null)
  const selected = shallowRef(new Set<string>())
  const mode = shallowRef<'guided' | 'free'>('guided')
  const step = shallowRef(0)

  // Derived
  const resolved = computed<ResolvedSet>(() => {
    return resolve([...selected.value], graph)
  })

  const categories = computed(() => {
    const cats = new Map<string, Feature[]>()
    for (const feature of catalog) {
      const list = cats.get(feature.category) ?? []
      list.push(feature)
      cats.set(feature.category, list)
    }
    return cats
  })

  // Actions
  function toggle (id: string) {
    const next = new Set(selected.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selected.value = next
  }

  function select (id: string) {
    const next = new Set(selected.value)
    next.add(id)
    selected.value = next
  }

  function deselect (id: string) {
    const next = new Set(selected.value)
    next.delete(id)
    selected.value = next
  }

  function reset () {
    intent.value = null
    selected.value = new Set()
    step.value = 0
  }

  function setIntent (value: Intent) {
    intent.value = value
    selected.value = new Set(getRecommendations(value))
  }

  async function openInPlayground () {
    const url = await toPlaygroundUrl(
      {
        intent: intent.value ?? undefined,
        features: [...selected.value],
        resolved: resolved.value.autoIncluded,
        adapters: {},
      },
      'https://v0play.vuetifyjs.com',
    )
    window.open(url, '_blank')
  }

  return {
    catalog,
    intent,
    selected,
    mode,
    step,
    resolved,
    categories,
    toggle,
    select,
    deselect,
    reset,
    setIntent,
    openInPlayground,
  }
})

function getRecommendations (intent: Intent): string[] {
  const base = ['createContext', 'createTrinity', 'useTheme']

  const presets: Record<Intent, string[]> = {
    'spa': [...base, 'createSelection', 'createSingle', 'useStorage', 'useBreakpoints'],
    'component-library': [...base, 'createRegistry', 'createSelection', 'createGroup'],
    'design-system': [...base, 'createRegistry', 'createSelection', 'createGroup', 'useLocale', 'useBreakpoints'],
    'admin-dashboard': [...base, 'createDataTable', 'createForm', 'createSelection', 'useStorage', 'useBreakpoints', 'usePermissions'],
    'content-site': [...base, 'useBreakpoints', 'useIntersectionObserver', 'useStorage'],
    'mobile-first': [...base, 'createSelection', 'useBreakpoints', 'useStorage', 'useEventListener'],
  }

  return presets[intent] ?? base
}
