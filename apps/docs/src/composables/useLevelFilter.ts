// Framework
import { createContext, createGroup, useStorage } from '@vuetify/v0'

// Utilities
import { computed, onMounted, toValue, watch } from 'vue'

// Types
import type { NavItem } from '@/stores/app'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

const LEVELS = [1, 2, 3] as const
export type Level = (typeof LEVELS)[number]

export interface LevelFilterContext {
  levels: typeof LEVELS
  selectedLevels: Set<Level>
  toggle: (level: Level) => void
  isSelected: (level: Level) => boolean
  filteredNav: ComputedRef<NavItem[]>
}

const [useLevelFilterContext, provideLevelFilterContext] = createContext<LevelFilterContext>('docs:level-filter')

export { useLevelFilterContext }

export function createLevelFilter (nav: MaybeRefOrGetter<NavItem[]>) {
  const storage = useStorage()
  const group = createGroup<any>()

  group.onboard(LEVELS.map(level => ({ id: level, value: level })))

  onMounted(() => {
    const stored = storage.get<Level[]>('levelFilter', [])
    if (stored.value.length > 0) group.select(stored.value)
  })

  watch(group.selectedIds, ids => storage.set('levelFilter', [...ids]))

  const filteredNav = computed(() => {
    const items = toValue(nav)
    if (group.selectedIds.size === 0) return items
    return filterNavByLevel(items, group.selectedIds)
  })

  const context: LevelFilterContext = {
    levels: LEVELS,
    selectedLevels: group.selectedIds,
    toggle: group.toggle,
    isSelected: (level: Level) => group.selectedIds.has(level),
    filteredNav,
  }

  return {
    ...context,
    provide: () => provideLevelFilterContext(context),
  }
}

function filterNavByLevel (items: NavItem[], levels: Set<number>): NavItem[] {
  const filtered = items
    .map(item => {
      if ('divider' in item) return item
      if ('children' in item && item.children) {
        const childFiltered = filterNavByLevel(item.children, levels)
        if (childFiltered.length === 0) return null
        return { ...item, children: childFiltered }
      }
      if ('to' in item) {
        // Pages without level hidden when filtering
        if (!item.level) return null
        if (!levels.has(item.level)) return null
      }
      return item
    })
    .filter((item): item is NavItem => item !== null)

  // Remove orphaned dividers (leading, trailing, consecutive)
  return filtered.filter((item, i, arr) => {
    if (!('divider' in item)) return true
    const prev = arr[i - 1]
    const next = arr[i + 1]
    if (!prev || !next) return false
    if ('divider' in prev || 'divider' in next) return false
    return true
  })
}
