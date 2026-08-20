// Framework
import { createContext, createGroup, useStorage } from '@vuetify/v0'

// Utilities
import { filterNav } from '@/utilities/nav'
import { computed, onMounted, toRef, toValue, watch } from 'vue'

// Types
import type { NavItem } from '@/stores/app'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

const LEVELS = [1, 2, 3] as const
export type Level = (typeof LEVELS)[number]

export interface LevelFilterContext {
  levels: typeof LEVELS
  selectedLevels: Set<Level>
  hasChanges: Readonly<Ref<boolean>>
  toggle: (level: Level) => void
  isSelected: (level: Level) => boolean
  clear: () => void
  filteredNav: ComputedRef<NavItem[]>
}

const [useLevelFilterContext, provideLevelFilterContext] = createContext<LevelFilterContext>('docs:level-filter')

export { useLevelFilterContext }

export function createLevelFilter (nav: MaybeRefOrGetter<NavItem[]>) {
  const storage = useStorage()
  const group = createGroup()

  group.onboard(LEVELS.map(level => ({ id: level, value: level })))

  onMounted(() => {
    const stored = storage.get<Level[]>('levelFilter', [])
    if (stored.value.length > 0) group.select(stored.value)
  })

  watch(group.selectedIds, ids => storage.set('levelFilter', [...ids]))

  const filteredNav = computed(() => {
    const items = toValue(nav)
    if (group.selectedIds.size === 0) return items
    const levels = group.selectedIds as Set<number>
    return filterNav(items, item => !!item.level && levels.has(item.level))
  })

  const hasChanges = toRef(() => group.selectedIds.size > 0)

  function clear () {
    group.unselectAll()
  }

  const context: LevelFilterContext = {
    levels: LEVELS,
    selectedLevels: group.selectedIds as Set<Level>,
    hasChanges,
    toggle: group.toggle as (level: Level) => void,
    isSelected: (level: Level) => group.selectedIds.has(level),
    clear,
    filteredNav,
  }

  return {
    ...context,
    provide: () => provideLevelFilterContext(context),
  }
}
