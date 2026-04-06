/**
 * @module useRovingFocus
 *
 * @see https://0.vuetifyjs.com/composables/system/use-roving-focus
 *
 * @remarks
 * Roving tabindex composable for keyboard navigation within composite widgets.
 *
 * Key features:
 * - Arrow key navigation with orientation support
 * - Grid mode for 2D navigation (data tables, calendars)
 * - Automatic disabled item skipping
 * - Optional circular navigation
 * - Home/End key support (row-scoped in grid mode)
 * - Auto-attaches keydown listener when target is provided
 *
 * Perfect for toolbars, menus, tree items, grids, and other composite widgets.
 */

// Composables
import { createFocusTraversal } from '#v0/composables/createFocusTraversal'
import { useEventListener } from '#v0/composables/useEventListener'

// Utilities
import { isUndefined } from '#v0/utilities'
import { nextTick, toValue } from 'vue'

// Types
import type { TraversalItem } from '#v0/composables/createFocusTraversal'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

export interface RovingItem extends TraversalItem {
  el?: MaybeRefOrGetter<HTMLElement | null | undefined>
}

export interface RovingFocusOptions {
  target?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** Arrow key mapping. Ignored when `columns` is set (grid uses all 4 arrows). */
  orientation?: 'horizontal' | 'vertical' | 'both'
  circular?: boolean
  /**
   * Column count for grid navigation. When set, items are treated as a 2D grid
   * in row-major order: Left/Right step ±1, Up/Down step ±columns,
   * Home/End go to row start/end, Ctrl+Home/End go to first/last overall.
   */
  columns?: MaybeRefOrGetter<number>
  onFocus?: (id: ID) => void
}

export interface RovingFocusReturn {
  focusedId: ShallowRef<ID | undefined>
  isTabbable: (id: ID) => boolean
  focus: (id: ID) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  onKeydown: (e: KeyboardEvent) => void
}

export function useRovingFocus (
  items: () => RovingItem[],
  options: RovingFocusOptions = {},
): RovingFocusReturn {
  const {
    orientation,
    circular,
    columns,
    onFocus,
    target,
  } = options

  function applyFocus (id: ID) {
    const item = items().find(i => i.id === id)
    if (!item?.el) return false

    onFocus?.(id)

    nextTick(() => {
      const el = toValue(item.el)
      el?.focus()
    })

    return true
  }

  const traversal = createFocusTraversal(
    items,
    id => applyFocus(id),
    { orientation, circular, columns },
  )

  function focus (id: ID) {
    const prev = traversal.activeId.value
    traversal.activeId.value = id
    if (!applyFocus(id)) {
      traversal.activeId.value = prev
    }
  }

  function enabled () {
    return items().filter(item => !toValue(item.disabled))
  }

  function isTabbable (id: ID): boolean {
    if (!isUndefined(traversal.activeId.value)) return traversal.activeId.value === id

    const list = enabled()
    return list.length > 0 && list[0]?.id === id
  }

  if (target) {
    useEventListener(target, 'keydown', traversal.onKeydown)
  }

  return {
    focusedId: traversal.activeId,
    isTabbable,
    focus,
    next: traversal.next,
    prev: traversal.prev,
    first: traversal.first,
    last: traversal.last,
    onKeydown: traversal.onKeydown,
  }
}
