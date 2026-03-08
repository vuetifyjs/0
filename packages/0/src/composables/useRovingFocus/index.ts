/**
 * @module useRovingFocus
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
import { useEventListener } from '#v0/composables/useEventListener'

// Utilities
import { isUndefined } from '#v0/utilities'
// Framework
import { nextTick, shallowRef, toValue } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

export interface RovingItem {
  id: ID
  el?: MaybeRefOrGetter<HTMLElement | null | undefined>
  disabled?: MaybeRefOrGetter<boolean>
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

function mod (length: number, index: number) {
  return ((index % length) + length) % length
}

export function useRovingFocus (
  items: () => RovingItem[],
  options: RovingFocusOptions = {},
): RovingFocusReturn {
  const {
    orientation = 'vertical',
    circular = false,
    columns: _columns,
    onFocus,
    target,
  } = options

  const focusedId = shallowRef<ID | undefined>()

  function enabled () {
    return items().filter(item => !toValue(item.disabled))
  }

  function indexOf (id: ID) {
    return items().findIndex(item => item.id === id)
  }

  function step (stride: number) {
    const all = items()
    const length = all.length
    if (!length) return

    const current = isUndefined(focusedId.value)
      ? -1
      : indexOf(focusedId.value)

    const direction = stride > 0 ? 1 : -1
    const absStride = Math.abs(stride)
    let index = current + stride
    // Max attempts: for stride=1 check all items, for larger strides check proportionally
    const maxHops = Math.ceil(length / absStride)
    let hops = 0

    if (circular) {
      index = mod(length, index)
    } else if (index < 0 || index >= length) {
      return
    }

    while (hops < maxHops) {
      const item = all[index]
      if (item && !toValue(item.disabled)) {
        focus(item.id)
        return
      }
      hops++
      index = circular
        ? mod(length, index + stride)
        : index + (direction * absStride)
      if (!circular && (index < 0 || index >= length)) return
    }
  }

  function focus (id: ID) {
    focusedId.value = id
    onFocus?.(id)

    const item = items().find(i => i.id === id)
    if (!item?.el) return

    nextTick(() => {
      const el = toValue(item.el)
      el?.focus()
    })
  }

  function next () {
    step(1)
  }

  function prev () {
    step(-1)
  }

  function first () {
    const list = enabled()
    if (list.length > 0) focus(list[0]!.id)
  }

  function last () {
    const list = enabled()
    if (list.length > 0) focus(list.at(-1)!.id)
  }

  /** Focus first non-disabled item in the current row (grid mode) */
  function rowFirst () {
    const cols = toValue(_columns) ?? 0
    if (!cols) return first()

    const all = items()
    const current = isUndefined(focusedId.value) ? 0 : indexOf(focusedId.value)
    const rowStart = current - (current % cols)
    const rowEnd = Math.min(rowStart + cols, all.length)

    for (let i = rowStart; i < rowEnd; i++) {
      const item = all[i]
      if (item && !toValue(item.disabled)) {
        focus(item.id)
        return
      }
    }
  }

  /** Focus last non-disabled item in the current row (grid mode) */
  function rowLast () {
    const cols = toValue(_columns) ?? 0
    if (!cols) return last()

    const all = items()
    const current = isUndefined(focusedId.value) ? 0 : indexOf(focusedId.value)
    const rowStart = current - (current % cols)
    const rowEnd = Math.min(rowStart + cols, all.length)

    for (let i = rowEnd - 1; i >= rowStart; i--) {
      const item = all[i]
      if (item && !toValue(item.disabled)) {
        focus(item.id)
        return
      }
    }
  }

  function isTabbable (id: ID): boolean {
    if (focusedId.value != null) return focusedId.value === id

    const list = enabled()
    return list.length > 0 && list[0]?.id === id
  }

  function onKeydown (e: KeyboardEvent) {
    const cols = toValue(_columns)

    // Grid mode: all 4 arrows have distinct meanings
    if (cols) {
      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault()
          step(1)
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          step(-1)
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          step(cols)
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          step(-cols)
          break
        }
        case 'Home': {
          e.preventDefault()
          if (e.ctrlKey) first()
          else rowFirst()
          break
        }
        case 'End': {
          e.preventDefault()
          if (e.ctrlKey) last()
          else rowLast()
          break
        }
      }
      return
    }

    // Linear mode: orientation determines arrow mapping
    const prevKeys: string[] = []
    const nextKeys: string[] = []

    if (orientation === 'vertical' || orientation === 'both') {
      prevKeys.push('ArrowUp')
      nextKeys.push('ArrowDown')
    }

    if (orientation === 'horizontal' || orientation === 'both') {
      prevKeys.push('ArrowLeft')
      nextKeys.push('ArrowRight')
    }

    if (prevKeys.includes(e.key)) {
      e.preventDefault()
      prev()
    } else if (nextKeys.includes(e.key)) {
      e.preventDefault()
      next()
    } else if (e.key === 'Home') {
      e.preventDefault()
      first()
    } else if (e.key === 'End') {
      e.preventDefault()
      last()
    }
  }

  if (target) {
    useEventListener(target, 'keydown', onKeydown)
  }

  return {
    focusedId,
    isTabbable,
    focus,
    next,
    prev,
    first,
    last,
    onKeydown,
  }
}
