/**
 * @module KanbanRoot
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * Root of the Kanban compound. Creates a `createKanban` board and a
 * pointer-only `useDragDrop` context, provides both to Column / List / Item,
 * and owns the keyboard move model: an Item is picked up with Space or Enter,
 * moved one slot (or one column) per arrow key, dropped with Space or Enter,
 * and returned to its origin with Escape. Every committed move emits `move`
 * and writes back through each Column's v-model. Announcements land in the
 * Kanban.LiveRegion when one is mounted.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createKanban } from '#v0/composables/createKanban'
  import { PointerAdapter, useDragDrop } from '#v0/composables/useDragDrop'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { clamp, isNull, isNumber, isString, isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, shallowReadonly, shallowRef, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { KanbanColumnTicket, KanbanColumnTicketInput, KanbanContext } from '#v0/composables/createKanban'
  import type { SortableTicket, SortableTicketInput } from '#v0/composables/createSortable'
  import type { DragDropContext } from '#v0/composables/useDragDrop'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  export type KanbanOrientation = 'horizontal' | 'vertical'

  export type KanbanDirection = 'up' | 'down' | 'first' | 'last' | 'prev' | 'next'

  export interface KanbanColumnInput extends KanbanColumnTicketInput<SortableTicketInput> {
    /** Column name used in announcements */
    label?: MaybeRefOrGetter<string | undefined>
  }

  export type KanbanBoardColumn = KanbanColumnTicket<SortableTicketInput, KanbanColumnInput>

  export interface KanbanDrag {
    type: 'item'
    value: {
      value: unknown
      readonly label: string | undefined
    }
  }

  export interface KanbanMovePayload {
    /** The moved item's value, as bound on Kanban.Item */
    value: unknown
    /** Source column id */
    from: ID
    /** Destination column id */
    to: ID
    /** Index in the source column before the move */
    fromIndex: number
    /** Index in the destination column after the move */
    toIndex: number
  }

  export interface KanbanGrab {
    /** The picked-up item's value */
    value: unknown
    /** Accessible name of the item */
    label: string | undefined
    /** Column the item was picked up from */
    column: ID
    /** Index the item was picked up from */
    index: number
  }

  export interface KanbanRootContext {
    /** The underlying board */
    kanban: KanbanContext<SortableTicketInput, KanbanColumnInput>
    /** Pointer drag-and-drop context */
    dnd: DragDropContext<KanbanDrag>
    /** Layout axis columns flow along; items flow along the other */
    orientation: Readonly<Ref<KanbanOrientation>>
    /** Whether the whole board is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Keyboard pick-up in progress, or null */
    grabbed: Readonly<ShallowRef<KanbanGrab | null>>
    /** Item value that should take focus after it re-renders */
    pending: ShallowRef<unknown>
    /** Latest announcement for Kanban.LiveRegion */
    message: Readonly<ShallowRef<string>>
    /** Id of the mounted Kanban.Instructions element, if any */
    instructions: ShallowRef<string | undefined>
    /** Find the column and ticket that hold an item value */
    locate: (value: unknown) => { column: KanbanBoardColumn, ticket: SortableTicket } | undefined
    /** Move an item to a column at an index. Returns false when gated or rejected. */
    move: (value: unknown, to: ID, index: number, label?: string) => boolean
    /** Move an item and announce where it landed (pointer drops) */
    place: (value: unknown, to: ID, index: number, label?: string) => boolean
    /** Pick an item up for keyboard moving */
    grab: (value: unknown, label?: string) => void
    /** Move the picked-up item one step */
    shift: (direction: KanbanDirection) => void
    /** Drop the picked-up item where it is */
    drop: () => void
    /** Return the picked-up item to where it was picked up */
    cancel: () => void
    /** Write a message to the live region */
    announce: (text: string) => void
  }

  export const [useKanbanRoot, provideKanbanRoot] = createContext<KanbanRootContext>()

  export interface KanbanRootProps extends AtomProps {
    /** Disable every move on the board */
    disabled?: boolean
    /** Axis the columns flow along (default: 'horizontal') */
    orientation?: KanbanOrientation
    /** Accessible name for the board */
    label?: string
    /** Namespace for context provision */
    namespace?: string
  }

  export type KanbanRootEmits = {
    /** An item changed position. Fires once per committed move. */
    move: [payload: KanbanMovePayload]
  }

  export interface KanbanRootSlotProps {
    /** Whether the board is disabled */
    isDisabled: boolean
    /** Whether an item is picked up by keyboard or dragged by pointer */
    isMoving: boolean
    /** Attributes to bind to the board element */
    attrs: {
      'role': 'group'
      'aria-label': string
      'aria-disabled': boolean
      'data-disabled': true | undefined
      'data-orientation': KanbanOrientation
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'KanbanRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: KanbanRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    disabled = false,
    orientation = 'horizontal',
    label,
    namespace = 'v0:kanban',
  } = defineProps<KanbanRootProps>()

  const emit = defineEmits<KanbanRootEmits>()

  const locale = useLocale()

  const kanban = createKanban<SortableTicketInput, KanbanColumnInput>({
    disabled: () => disabled,
  })

  const dnd = useDragDrop<KanbanDrag>({
    adapters: [new PointerAdapter({ threshold: 4 })],
  })

  const grabbed = shallowRef<KanbanGrab | null>(null)
  const pending = shallowRef<unknown>()
  const message = shallowRef('')
  const instructions = shallowRef<string>()
  const isDisabled = toRef(() => disabled)

  function name (value: unknown, label?: string) {
    if (label) return label
    if (isString(value) || isNumber(value)) return String(value)
    return locale.ti('Kanban.item') ?? 'Item'
  }

  function title (column: KanbanBoardColumn) {
    return toValue(column.label) ?? String(column.id)
  }

  function announce (text: string) {
    message.value = ''
    nextTick(() => {
      message.value = text
    })
  }

  function locate (value: unknown) {
    for (const column of kanban.columns.values()) {
      const id = column.items.browse(value)?.[0]
      if (isUndefined(id)) continue
      const ticket = column.items.get(id)
      if (ticket) return { column, ticket }
    }
    return undefined
  }

  function move (value: unknown, to: ID, index: number, label?: string) {
    const at = locate(value)
    if (!at) return false

    const from = at.column.id
    const fromIndex = at.ticket.index
    const moved = kanban.transfer(at.ticket.id, to, index)

    if (!moved) {
      announce(locale.ti('Kanban.rejected', { item: name(value, label) }) ?? `${name(value, label)} cannot move there`)
      return false
    }

    if (from === to && moved.index === fromIndex) return true

    emit('move', { value, from, to, fromIndex, toIndex: moved.index })

    return true
  }

  function position (value: unknown) {
    const at = locate(value)
    if (!at) return undefined
    return {
      column: title(at.column),
      position: at.ticket.index + 1,
      size: at.column.items.size,
    }
  }

  function grab (value: unknown, label?: string) {
    const at = locate(value)
    if (!at || disabled) return

    grabbed.value = { value, label, column: at.column.id, index: at.ticket.index }

    const item = name(value, label)
    const now = position(value)
    const fallback = `${item} picked up in ${now?.column}, position ${now?.position} of ${now?.size}. Use the arrow keys to move, Space or Enter to drop, Escape to cancel.`
    announce(locale.ti('Kanban.grabbed', { item, ...now }) ?? fallback)
  }

  function shift (direction: KanbanDirection) {
    const grab = grabbed.value
    if (isNull(grab)) return

    const at = locate(grab.value)
    if (!at) return

    const index = at.ticket.index
    const last = at.column.items.size - 1
    let column = at.column
    let target = index

    switch (direction) {
      case 'up': {
        target = index - 1
        break
      }
      case 'down': {
        target = index + 1
        break
      }
      case 'first': {
        target = 0
        break
      }
      case 'last': {
        target = last
        break
      }
      case 'prev':
      case 'next': {
        const columns = kanban.columns.values()
        const next = columns[columns.indexOf(at.column) + (direction === 'next' ? 1 : -1)]
        if (!next) return
        column = next
        target = clamp(index, 0, next.items.size)
        break
      }
    }

    if (column === at.column && (target < 0 || target > last || target === index)) return

    if (!move(grab.value, column.id, target, grab.label)) return

    pending.value = grab.value

    const item = name(grab.value, grab.label)
    const now = position(grab.value)
    const fallback = `${item} moved to ${now?.column}, position ${now?.position} of ${now?.size}`
    announce(locale.ti('Kanban.moved', { item, ...now }) ?? fallback)
  }

  function settle (value: unknown, label?: string) {
    const item = name(value, label)
    const at = position(value)
    const fallback = `${item} dropped in ${at?.column}, position ${at?.position} of ${at?.size}`
    announce(locale.ti('Kanban.dropped', { item, ...at }) ?? fallback)
  }

  function drop () {
    const grab = grabbed.value
    if (isNull(grab)) return

    grabbed.value = null
    settle(grab.value, grab.label)
  }

  function place (value: unknown, to: ID, index: number, label?: string) {
    if (!move(value, to, index, label)) return false
    settle(value, label)
    return true
  }

  function cancel () {
    const grab = grabbed.value
    if (isNull(grab)) return

    grabbed.value = null

    const at = locate(grab.value)
    if (at && (at.column.id !== grab.column || at.ticket.index !== grab.index)) {
      move(grab.value, grab.column, grab.index, grab.label)
      pending.value = grab.value
    }

    const item = name(grab.value, grab.label)
    const origin = kanban.columns.get(grab.column)
    const fallback = `Move cancelled. ${item} returned to ${origin ? title(origin) : 'its column'}`
    announce(locale.ti('Kanban.cancelled', { item, column: origin ? title(origin) : '' }) ?? fallback)
  }

  provideKanbanRoot(namespace, {
    kanban,
    dnd,
    orientation: toRef(() => orientation),
    isDisabled,
    grabbed: shallowReadonly(grabbed),
    pending,
    message: shallowReadonly(message),
    instructions,
    locate,
    move,
    place,
    grab,
    shift,
    drop,
    cancel,
    announce,
  })

  const slotProps = toRef((): KanbanRootSlotProps => ({
    isDisabled: isDisabled.value,
    isMoving: !isNull(grabbed.value) || dnd.isDragging.value,
    attrs: {
      'role': 'group',
      'aria-label': label ?? locale.ti('Kanban.label') ?? 'Board',
      'aria-disabled': isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'data-orientation': orientation,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
