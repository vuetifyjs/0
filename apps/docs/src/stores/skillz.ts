// Composables
import { useAskSheet } from '@/composables/useAskSheet'
import { useDiscovery } from '@/composables/useDiscovery'
import { useSearch } from '@/composables/useSearch'
import { useSettings } from '@/composables/useSettings'

// Utilities
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'

// Types
import type { DiscoveryStepConfig, DiscoveryTourTicket } from '@/composables/useDiscovery'
import type { SkillMeta } from '@/types/skill'

// Stores
import { useAppStore } from '@/stores/app'

/** Composables passed to defineTour for handler creation */
export interface TourComposables {
  app: ReturnType<typeof useAppStore>
  search: ReturnType<typeof useSearch>
  settings: ReturnType<typeof useSettings>
  sheet: ReturnType<typeof useAskSheet>
}

/** Tour definition returned by defineTour() */
interface TourDefinition {
  tour: SkillMeta
  steps: string[]
  handlers?: Record<string, DiscoveryStepConfig>
}

/** SkillMeta with derived path for dynamic import */
export interface SkillItem extends SkillMeta {
  /** Path for dynamic import, e.g. 'beginner/using-the-docs' */
  path: string
}

// Glob all tour JSON files at build time (eager - metadata needed immediately)
const tourModules = import.meta.glob<SkillMeta>(
  '@/skillz/tours/**/index.json',
  { eager: true, import: 'default' },
)

// Glob all tour handler files (lazy - loaded on demand)
const tourHandlers = import.meta.glob<{ defineTour: (composables: TourComposables) => TourDefinition }>(
  '@/skillz/tours/**/index.ts',
)

// Transform to SkillItem array with derived paths
const allTours: SkillItem[] = Object.entries(tourModules).map(([filePath, meta]) => ({
  ...meta,
  path: filePath.match(/tours\/(.+)\/index\.json/)?.[1] ?? '',
})).toSorted((a, b) => a.order - b.order)

export const useSkillzStore = defineStore('skillz', () => {
  const discovery = useDiscovery()
  const router = useRouter()

  // Composables for tour handlers (called in setup context)
  const composables: TourComposables = {
    app: useAppStore(),
    search: useSearch(),
    settings: useSettings(),
    sheet: useAskSheet(),
  }

  // Available skills (populated from glob)
  const items = shallowRef<SkillItem[]>(allTours)

  // Active tour state
  const active = shallowRef<SkillItem | null>(null)
  const activeTicket = shallowRef<DiscoveryTourTicket | null>(null)

  async function start (itemOrPath: SkillItem | string) {
    // Resolve to SkillItem
    const item = typeof itemOrPath === 'string'
      ? items.value.find(i => i.path === itemOrPath)
      : itemOrPath

    if (!item) return

    // Clean up previous tour if any
    if (activeTicket.value) {
      activeTicket.value.unregister()
      activeTicket.value = null
    }

    // Find and load the tour definition
    const handlerPath = Object.keys(tourHandlers).find(p => p.includes(item.path))
    if (!handlerPath || !tourHandlers[handlerPath]) return

    const module = await tourHandlers[handlerPath]()
    const { steps, handlers } = module.defineTour(composables)

    // Register tour with discovery (store has access to discovery from setup)
    const ticket = discovery.register({
      type: 'tour',
      id: item.id,
      steps,
      handlers,
    }) as DiscoveryTourTicket

    active.value = item
    activeTicket.value = ticket

    await router.push(item.startRoute)
    discovery.start(item.id)
  }

  function stop () {
    if (active.value) {
      discovery.stop()
      active.value = null

      if (activeTicket.value) {
        activeTicket.value.unregister()
        activeTicket.value = null
      }
    }
  }

  function complete () {
    if (active.value) {
      discovery.complete()
      active.value = null

      if (activeTicket.value) {
        activeTicket.value.unregister()
        activeTicket.value = null
      }
    }
  }

  return {
    // State
    items,
    active,

    // Actions
    start,
    stop,
    complete,
  }
})
