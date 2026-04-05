// Framework
import { createGroup, createSingle, createStep, useStorage } from '@vuetify/v0'

// Utilities
import { defineStore } from 'pinia'
import { computed, shallowRef, toRef, watch } from 'vue'

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

  // Category order for guided wizard
  const categoryOrder = [
    'foundation',
    'selection',
    'forms',
    'data',
    'plugins',
    'system',
    'registration',
    'reactivity',
    'semantic',
  ]

  // Wizard stepper — initialized with steps immediately
  const stepper = createStep()

  // Build and populate steps based on available categories
  function buildSteps (): string[] {
    const cats = new Map<string, Feature[]>()
    for (const feature of catalog) {
      const list = cats.get(feature.category) ?? []
      list.push(feature)
      cats.set(feature.category, list)
    }
    return ['intent', ...categoryOrder.filter(c => cats.has(c)), 'review']
  }

  const wizardSteps = buildSteps()
  stepper.onboard(wizardSteps.map(id => ({ id, value: id })))
  stepper.first()

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

  // Guided question flow state (exposed for AppBar breadcrumbs)
  // -1 = intent step, 0+ = question index, >= questionCount = review
  const questionIndex = shallowRef(-1)
  const questionCount = shallowRef(0)

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
    return features.selected(id)
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

  // Persistence
  const storage = useStorage()
  const savedIntent = storage.get<string>('builder:intent', '')
  const savedFeatures = storage.get<string[]>('builder:features', [])

  // Restore saved state
  if (savedIntent.value) {
    setIntent(savedIntent.value as Intent)
  } else if (savedFeatures.value.length > 0) {
    for (const id of savedFeatures.value) {
      if (features.has(id)) {
        features.select(id)
      }
    }
  }

  // Watch and persist
  watch(() => intent.selectedId.value, id => {
    storage.set('builder:intent', id ?? '')
  })

  watch(selectedIds, ids => {
    storage.set('builder:features', [...ids])
  }, { deep: true })

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

    // Guided question flow
    questionIndex,
    questionCount,

    // Actions
    toggle,
    select,
    deselect,
    isSelected,
    reset,
    setIntent,
    wizardSteps,
    openInPlayground,
  }
})

function getRecommendations (intent: Intent): string[] {
  // Only select differentiating features — foundation composables
  // like createContext/createTrinity auto-include as dependencies
  const presets: Record<Intent, string[]> = {
    'spa': ['createSelection', 'createSingle', 'useTheme', 'useStorage', 'useBreakpoints'],
    'component-library': ['createRegistry', 'createSelection', 'createGroup', 'useTheme'],
    'design-system': ['createRegistry', 'createSelection', 'createGroup', 'useTheme', 'useLocale', 'useBreakpoints'],
    'admin-dashboard': ['createDataTable', 'createForm', 'createSelection', 'useTheme', 'useStorage', 'useBreakpoints', 'usePermissions'],
    'content-site': ['useTheme', 'useBreakpoints', 'useIntersectionObserver', 'useStorage'],
    'mobile-first': ['createSelection', 'useTheme', 'useBreakpoints', 'useStorage', 'useEventListener'],
  }

  return presets[intent] ?? ['useTheme']
}
