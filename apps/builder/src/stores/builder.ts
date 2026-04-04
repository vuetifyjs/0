// Framework
import { createGroup, createSingle, createStep } from '@vuetify/v0'

// Utilities
import { defineStore } from 'pinia'
import { computed, toRef } from 'vue'

// Types
import type { DependencyGraph, Feature, Intent, ResolvedSet } from '@/data/types'

import dependencyGraph from '@/data/dependencies.json'
import { buildCatalog } from '@/data/features'
import { toPlaygroundUrl } from '@/engine/manifest'
import { resolve } from '@/engine/resolve'

export const useBuilderStore = defineStore('builder', () => {
  const catalog = buildCatalog()
  const graph = dependencyGraph as DependencyGraph

  // Intent — single select for project type
  const intent = createSingle()
  intent.onboard([
    { id: 'spa', value: 'spa' },
    { id: 'component-library', value: 'component-library' },
    { id: 'design-system', value: 'design-system' },
    { id: 'admin-dashboard', value: 'admin-dashboard' },
    { id: 'content-site', value: 'content-site' },
    { id: 'mobile-first', value: 'mobile-first' },
  ])

  // Feature selection — multi-select group
  const features = createGroup()
  features.onboard(catalog.map(f => ({ id: f.id, value: f.id })))

  // Wizard stepper
  const stepper = createStep()

  // Mode — single select (guided vs free)
  const mode = createSingle({ mandatory: 'force' })
  mode.onboard([
    { id: 'guided', value: 'guided' },
    { id: 'free', value: 'free' },
  ])
  mode.select('guided')

  // Derived
  const selectedIds = toRef(() => features.selectedIds)

  const resolved = computed<ResolvedSet>(() => {
    return resolve([...features.selectedIds] as string[], graph)
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

  const selectedCount = toRef(() => features.selectedIds.size)

  // Actions
  function toggle (id: string) {
    features.toggle(id)
  }

  function select (id: string) {
    features.select(id)
  }

  function deselect (id: string) {
    features.unselect(id)
  }

  function isSelected (id: string): boolean {
    return features.selectedIds.has(id)
  }

  function reset () {
    if (intent.selectedId.value) {
      intent.unselect(intent.selectedId.value)
    }
    features.unselectAll()
    stepper.first()
  }

  function setIntent (value: Intent) {
    intent.select(value)
    features.unselectAll()
    for (const id of getRecommendations(value)) {
      if (features.has(id)) {
        features.select(id)
      }
    }
  }

  function initSteps (stepIds: string[]) {
    stepper.reset()
    stepper.onboard(stepIds.map(id => ({ id, value: id })))
    stepper.first()
  }

  async function openInPlayground () {
    const url = await toPlaygroundUrl(
      {
        intent: intent.selectedValue.value as string | undefined,
        features: [...features.selectedIds] as string[],
        resolved: resolved.value.autoIncluded,
        adapters: {},
      },
      'https://v0play.vuetifyjs.com',
    )
    window.open(url, '_blank')
  }

  return {
    // Raw composables
    intent,
    features,
    stepper,
    mode,

    // Data
    catalog,

    // Derived
    selectedIds,
    selectedCount,
    resolved,
    categories,

    // Actions
    toggle,
    select,
    deselect,
    isSelected,
    reset,
    setIntent,
    initSteps,
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
