/**
 * @module useVirtualFocus
 *
 * @see https://0.vuetifyjs.com/composables/system/use-virtual-focus
 *
 * @remarks
 * Virtual focus composable for aria-activedescendant keyboard navigation.
 * DOM focus stays on a control element while a virtual cursor highlights
 * items in a list.
 *
 * Key features:
 * - Arrow key navigation with orientation support
 * - Grid mode for 2D navigation
 * - Automatic disabled item skipping
 * - Optional circular navigation
 * - Home/End key support (row-scoped in grid mode)
 * - Auto-attaches keydown listener when target is provided
 * - Sets aria-activedescendant and data-highlighted attributes
 *
 * Perfect for comboboxes, autocompletes, listboxes, and other widgets
 * where DOM focus must remain on the control element.
 */

// Composables
import { createFocusTraversal } from '#v0/composables/createFocusTraversal'
import { useEventListener } from '#v0/composables/useEventListener'

// Utilities
import { onScopeDispose, toValue } from 'vue'

// Types
import type { TraversalItem } from '#v0/composables/createFocusTraversal'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

export interface VirtualFocusItem extends TraversalItem {
  el?: MaybeRefOrGetter<HTMLElement | null | undefined>
}

export interface VirtualFocusOptions {
  /** Element that retains DOM focus and receives aria-activedescendant */
  control: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** Element to attach keydown listener to (defaults to control) */
  target?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** Arrow key mapping. Ignored when `columns` is set (grid uses all 4 arrows). */
  orientation?: 'horizontal' | 'vertical' | 'both'
  circular?: boolean
  /**
   * Column count for grid navigation. When set, items are treated as a 2D grid
   * in row-major order: Left/Right step +/-1, Up/Down step +/-columns,
   * Home/End go to row start/end, Ctrl+Home/End go to first/last overall.
   */
  columns?: MaybeRefOrGetter<number>
  onHighlight?: (id: ID) => void
}

export interface VirtualFocusReturn {
  highlightedId: ShallowRef<ID | undefined>
  highlight: (id: ID) => void
  clear: () => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  onKeydown: (e: KeyboardEvent) => void
}

export function useVirtualFocus (
  items: () => VirtualFocusItem[],
  options: VirtualFocusOptions,
): VirtualFocusReturn {
  const {
    control,
    target,
    orientation,
    circular,
    columns,
    onHighlight,
  } = options

  let previousEl: HTMLElement | null = null

  function applyHighlight (id: ID) {
    const item = items().find(i => i.id === id)
    if (!item?.el) return false

    const el = toValue(item.el)
    if (!el) return false

    const controlEl = toValue(control)

    if (controlEl) {
      const itemId = el.getAttribute('id')
      if (itemId) {
        controlEl.setAttribute('aria-activedescendant', itemId)
      }
    }

    if (previousEl) {
      delete previousEl.dataset.highlighted
    }
    el.dataset.highlighted = ''
    previousEl = el

    el.scrollIntoView({ block: 'nearest' })

    onHighlight?.(id)

    return true
  }

  const traversal = createFocusTraversal(
    items,
    id => applyHighlight(id),
    { orientation, circular, columns },
  )

  function highlight (id: ID) {
    const prev = traversal.activeId.value
    traversal.activeId.value = id
    if (!applyHighlight(id)) {
      traversal.activeId.value = prev
    }
  }

  function clear () {
    traversal.activeId.value = undefined

    const controlEl = toValue(control)
    if (controlEl) {
      controlEl.removeAttribute('aria-activedescendant')
    }

    if (previousEl) {
      delete previousEl.dataset.highlighted
      previousEl = null
    }
  }

  const listener = target ?? control
  if (listener) {
    useEventListener(listener, 'keydown', traversal.onKeydown)
  }

  onScopeDispose(() => {
    clear()
  })

  return {
    highlightedId: traversal.activeId,
    highlight,
    clear,
    next: traversal.next,
    prev: traversal.prev,
    first: traversal.first,
    last: traversal.last,
    onKeydown: traversal.onKeydown,
  }
}
