/**
 * The reorder engine behind `Md1List.Reorder`: the lists: controls page's
 * reorder handle, which "allows dragging the item to other locations within
 * the list". The page shows a pointer drag; Material Design 1 adds the
 * keyboard path its notes ask for (move up and down on the handle) and a
 * polite announcement of every move.
 *
 * The order is the consumer's `v-model:order` array. `createSortable` holds
 * it as tickets and performs the move; the new array is written back, and
 * the consumer's `v-for` over it moves the rows. `useDragDrop` with only the
 * pointer adapter carries the mouse and touch drag; its keyboard adapter
 * nudges a point by pixels, which is not "one position up", so the handle
 * owns its keys instead (v0's Kanban does the same).
 */

// Framework
import { clamp, createSortable, isUndefined, PointerAdapter, useDragDrop } from '@vuetify/v0'

// Utilities
import { nextTick, shallowRef, toRef, watch } from 'vue'

// Types
import type { DragDropContext, DropIndicator, ID, LocaleContext } from '@vuetify/v0'
import type { Ref } from 'vue'

export interface Md1ListDrag {
  type: 'md1-list-item'
  value: unknown
}

export interface Md1ListReorder {
  /** The drag-and-drop context the handles register on. */
  dnd: DragDropContext<Md1ListDrag>
  /** Zero-based position of a value in the order, -1 when it is not in it. */
  index: (value: unknown) => number
  /** Number of rows in the order. */
  size: Readonly<Ref<number>>
  /** The value under a pointer drag, undefined otherwise. */
  dragging: Readonly<Ref<unknown>>
  /** How far the pointer has moved the dragged row along the column, in px. */
  offset: Readonly<Ref<number>>
  /** Where a pointer drop would land, null when it would not move anything. */
  indicator: Readonly<Ref<DropIndicator | null>>
  /** Move a value to a position and announce it. Returns false when nothing moved. */
  move: (value: unknown, to: number, name: string) => boolean
  /** The polite live region's text. */
  message: Readonly<Ref<string>>
}

export interface Md1ListReorderOptions {
  order: Ref<unknown[] | undefined>
  el: () => HTMLElement | null
  locale: LocaleContext
  /** The name of a value for announcements, from its handle. */
  name: (value: unknown) => string
}

export function createMd1ListReorder (options: Md1ListReorderOptions): Md1ListReorder {
  const { order, el, locale, name } = options

  const sortable = createSortable()
  const message = shallowRef('')

  function find (value: unknown): ID | undefined {
    return sortable.browse(value)?.[0]
  }

  // The bound array wins: rebuild the tickets whenever it changes from outside.
  watch(() => [...(order.value ?? [])], list => {
    sortable.clear()
    sortable.onboard(list.map(value => ({ value })))
  }, { immediate: true })

  // Read from the bound array, not the tickets, so a row's position is reactive.
  function index (value: unknown): number {
    return order.value?.indexOf(value) ?? -1
  }

  // Cleared first so the same sentence twice in a row is announced twice.
  function announce (text: string) {
    message.value = ''
    nextTick(() => {
      message.value = text
    })
  }

  function move (value: unknown, to: number, label: string): boolean {
    const id = find(value)

    if (isUndefined(id)) return false

    const from = sortable.get(id)!.index
    const target = clamp(to, 0, sortable.size - 1)

    if (target === from) return false

    sortable.move(id, target)
    order.value = sortable.values().map(ticket => ticket.value)

    const position = target + 1
    const size = sortable.size

    announce(locale.ti('Md1.reordered', { item: label, position, size }) ?? `${label} moved to position ${position} of ${size}`)

    return true
  }

  const dnd = useDragDrop<Md1ListDrag>({
    adapters: [new PointerAdapter({ threshold: 4 })],
  })

  const zone = dnd.zones.register({
    el,
    accept: ['md1-list-item'],
    orientation: 'vertical',
    onDrop (drag, position) {
      const from = index(drag.value)

      if (from === -1 || isUndefined(position.index)) return

      // A slot is a gap between rows; the gaps after the row's own one are one further down.
      const slot = clamp(position.index, 0, sortable.size)

      move(drag.value, slot > from ? slot - 1 : slot, name(drag.value))
    },
  })

  const dragging = toRef(() => dnd.active.value?.via === 'pointer' ? dnd.active.value.value : undefined)
  const offset = toRef(() => isUndefined(dragging.value) ? 0 : (dnd.active.value?.delta.y ?? 0))

  return {
    dnd,
    index,
    size: toRef(() => order.value?.length ?? 0),
    dragging,
    offset,
    indicator: zone.indicator,
    move,
    message,
  }
}
