/**
 * @module createFocusTraversal
 *
 * @remarks
 * Internal factory for keyboard-driven traversal of ordered item lists.
 * Encapsulates stride-based navigation, disabled-item skipping, circular/bounded
 * movement, grid row scoping, and key-to-action mapping shared by
 * useRovingFocus and useVirtualFocus.
 *
 * Not exported from the package barrel — consumed only by sibling composables.
 *
 * @example
 * ```ts
 * import { createFocusTraversal } from '#v0/composables/createFocusTraversal'
 *
 * const items = () => [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
 * const traversal = createFocusTraversal(items, id => console.log(id))
 * traversal.next()
 * ```
 */

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isUndefined } from '#v0/utilities'
import { shallowRef, toValue } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

export interface TraversalItem {
  id: ID
  disabled?: MaybeRefOrGetter<boolean>
}

export interface TraversalOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'
  circular?: boolean
  columns?: MaybeRefOrGetter<number>
}

export interface TraversalReturn {
  activeId: ShallowRef<ID | undefined>
  step: (stride: number) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  onKeydown: (e: KeyboardEvent) => void
}

function mod (length: number, index: number) {
  return ((index % length) + length) % length
}

function isRtl (e: KeyboardEvent): boolean {
  if (!IN_BROWSER) return false
  const el = e.currentTarget as HTMLElement | null
  return el ? getComputedStyle(el).direction === 'rtl' : false
}

export function createFocusTraversal (
  items: () => TraversalItem[],
  activate: (id: ID) => void,
  options: TraversalOptions = {},
): TraversalReturn {
  const {
    orientation = 'vertical',
    circular = false,
    columns: _columns,
  } = options

  const activeId = shallowRef<ID | undefined>()

  function enabled () {
    return items().filter(item => !toValue(item.disabled))
  }

  function indexOf (id: ID) {
    return items().findIndex(item => item.id === id)
  }

  function go (id: ID) {
    activeId.value = id
    activate(id)
  }

  function step (stride: number) {
    const all = items()
    const length = all.length
    if (!length) return

    const current = isUndefined(activeId.value)
      ? -1
      : indexOf(activeId.value)

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
        go(item.id)
        return
      }
      hops++
      index = circular
        ? mod(length, index + stride)
        : index + (direction * absStride)
      if (!circular && (index < 0 || index >= length)) return
    }
  }

  function next () {
    step(1)
  }

  function prev () {
    step(-1)
  }

  function first () {
    const list = enabled()
    if (list.length > 0) go(list[0]!.id)
  }

  function last () {
    const list = enabled()
    if (list.length > 0) go(list.at(-1)!.id)
  }

  /** Focus first non-disabled item in the current row (grid mode) */
  function rowFirst () {
    const cols = toValue(_columns) ?? 0
    if (!cols) return first()

    const all = items()
    const current = isUndefined(activeId.value) ? 0 : indexOf(activeId.value)
    const rowStart = current - (current % cols)
    const rowEnd = Math.min(rowStart + cols, all.length)

    for (let i = rowStart; i < rowEnd; i++) {
      const item = all[i]
      if (item && !toValue(item.disabled)) {
        go(item.id)
        return
      }
    }
  }

  /** Focus last non-disabled item in the current row (grid mode) */
  function rowLast () {
    const cols = toValue(_columns) ?? 0
    if (!cols) return last()

    const all = items()
    const current = isUndefined(activeId.value) ? 0 : indexOf(activeId.value)
    const rowStart = current - (current % cols)
    const rowEnd = Math.min(rowStart + cols, all.length)

    for (let i = rowEnd - 1; i >= rowStart; i--) {
      const item = all[i]
      if (item && !toValue(item.disabled)) {
        go(item.id)
        return
      }
    }
  }

  function onKeydown (e: KeyboardEvent) {
    const cols = toValue(_columns)
    const rtl = isRtl(e)

    // Grid mode: all 4 arrows have distinct meanings
    if (cols) {
      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault()
          step(rtl ? -1 : 1)
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          step(rtl ? 1 : -1)
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
      prevKeys.push(rtl ? 'ArrowRight' : 'ArrowLeft')
      nextKeys.push(rtl ? 'ArrowLeft' : 'ArrowRight')
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

  return {
    activeId,
    step,
    next,
    prev,
    first,
    last,
    onKeydown,
  }
}
