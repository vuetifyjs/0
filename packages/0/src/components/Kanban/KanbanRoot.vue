/**
 * @module KanbanRoot
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * Root of the Kanban compound. Creates a `createKanban` board and a
 * pointer-only `useDragDrop` context, provides both to Column / List / Item,
 * and owns the keyboard move model. Space or Enter picks an Item up; arrow
 * keys then move a virtual drop target — skipping columns that are disabled
 * or whose `accept` refuses the item — without touching the board. Space or
 * Enter commits one move to the target; Escape discards it. Each committed
 * move emits `move` once and writes back through each Column's v-model.
 * Announcements land in the Kanban.LiveRegion when one is mounted.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createKanban } from '#v0/composables/createKanban'
  import { PointerAdapter, useDragDrop } from '#v0/composables/useDragDrop'
  import { useLocale } from '#v0/composables/useLocale'
  import { useLogger } from '#v0/composables/useLogger'

  // Utilities
  import { clamp, isNull, isNumber, isString, isThenable, isUndefined } from '#v0/utilities'
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

  export interface KanbanPosition {
    /** Column id */
    column: ID
    /** Index within the column */
    index: number
  }

  export interface KanbanGrab {
    /** The picked-up item's value */
    value: unknown
    /** Accessible name of the item */
    label: string | undefined
    /** Where the item currently sits on the board */
    origin: KanbanPosition
    /** Where a drop would land it — the index it would have after the move */
    target: KanbanPosition
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
    /** Pending keyboard drop target, or null when it equals the origin */
    preview: Readonly<Ref<KanbanPosition | null>>
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
    /** Move the drop target one step */
    shift: (direction: KanbanDirection) => void
    /** Commit the picked-up item to its drop target */
    drop: () => void
    /** Discard the drop target; the board is not touched */
    cancel: () => void
    /** Re-read the picked-up item's position after an external board change */
    sync: () => void
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
    /** An item changed position. Fires once per committed drop. */
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
  const logger = useLogger()

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

  const preview = toRef((): KanbanPosition | null => {
    const grab = grabbed.value
    if (isNull(grab)) return null
    const { origin, target } = grab
    if (origin.column === target.column && origin.index === target.index) return null
    return target
  })

  function name (value: unknown, label?: string) {
    if (label) return label
    if (isString(value) || isNumber(value)) return String(value)
    return locale.ti('Kanban.item') ?? 'Item'
  }

  function title (column: KanbanBoardColumn | undefined) {
    if (!column) return ''
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

  function reject (value: unknown, label?: string) {
    const item = name(value, label)
    announce(locale.ti('Kanban.rejected', { item }) ?? `${item} cannot move there`)
  }

  function move (value: unknown, to: ID, index: number, label?: string) {
    const at = locate(value)
    if (!at) return false

    const from = at.column.id
    const fromIndex = at.ticket.index
    const moved = kanban.transfer(at.ticket.id, to, index)

    if (!moved) {
      reject(value, label)
      return false
    }

    if (from === to && moved.index === fromIndex) return true

    emit('move', { value, from, to, fromIndex, toIndex: moved.index })

    return true
  }

  function settle (value: unknown, label?: string) {
    const item = name(value, label)
    const at = locate(value)
    const column = title(at?.column)
    const position = (at?.ticket.index ?? 0) + 1
    const size = at?.column.items.size ?? 0
    const fallback = `${item} dropped in ${column}, position ${position} of ${size}`
    announce(locale.ti('Kanban.dropped', { item, column, position, size }) ?? fallback)
  }

  function place (value: unknown, to: ID, index: number, label?: string) {
    if (!move(value, to, index, label)) return false
    settle(value, label)
    return true
  }

  /** Highest index the item could take in `column` — one past the end unless it already lives there. */
  function capacity (column: KanbanBoardColumn, home: ID) {
    return column.id === home ? column.items.size - 1 : column.items.size
  }

  /** Mirrors transfer's gates so the keyboard target never rests where a drop would be refused. */
  function admits (column: KanbanBoardColumn, from: KanbanBoardColumn, ticket: SortableTicket, index: number) {
    if (column.id === from.id) return true
    if (disabled || toValue(column.disabled) || toValue(from.disabled) || toValue(ticket.disabled)) return false
    if (isUndefined(column.accept)) return true

    try {
      const result: unknown = column.accept(ticket, from.id, index)
      return !isThenable(result) && Boolean(result)
    } catch (error) {
      logger.error('accept predicate threw; treating as reject', error)
      return false
    }
  }

  function over (grab: KanbanGrab, column: KanbanBoardColumn) {
    const item = name(grab.value, grab.label)
    const position = grab.target.index + 1
    const size = capacity(column, grab.origin.column) + 1
    const fallback = `${item} over ${title(column)}, position ${position} of ${size}`
    announce(locale.ti('Kanban.over', { item, column: title(column), position, size }) ?? fallback)
  }

  function grab (value: unknown, label?: string) {
    const at = locate(value)
    if (!at || disabled) return

    const origin = { column: at.column.id, index: at.ticket.index }
    grabbed.value = { value, label, origin, target: origin }

    const item = name(value, label)
    const column = title(at.column)
    const position = origin.index + 1
    const size = at.column.items.size
    const fallback = `${item} picked up in ${column}, position ${position} of ${size}. Use the arrow keys to move, Space or Enter to drop, Escape to cancel.`
    announce(locale.ti('Kanban.grabbed', { item, column, position, size }) ?? fallback)
  }

  function shift (direction: KanbanDirection) {
    const grab = grabbed.value
    if (isNull(grab)) return

    const at = locate(grab.value)
    if (!at) {
      grabbed.value = null
      return
    }

    const column = kanban.columns.get(grab.target.column) ?? at.column
    const current = grab.target.index
    const max = capacity(column, at.column.id)
    let target: KanbanPosition | undefined
    let destination = column

    if (direction === 'prev' || direction === 'next') {
      const columns = kanban.columns.values()
      const step = direction === 'next' ? 1 : -1

      for (let index = columns.indexOf(column) + step; index >= 0 && index < columns.length; index += step) {
        const candidate = columns[index]!
        const slot = clamp(current, 0, capacity(candidate, at.column.id))
        if (!admits(candidate, at.column, at.ticket, slot)) continue
        target = { column: candidate.id, index: slot }
        destination = candidate
        break
      }

      if (!target) {
        if (columns[columns.indexOf(column) + step]) reject(grab.value, grab.label)
        return
      }
    } else {
      const slots: Record<typeof direction, number> = {
        up: current - 1,
        down: current + 1,
        first: 0,
        last: max,
      }
      const slot = slots[direction]

      if (slot < 0 || slot > max || slot === current) return

      if (!admits(column, at.column, at.ticket, slot)) {
        reject(grab.value, grab.label)
        return
      }

      target = { column: column.id, index: slot }
    }

    const next = { ...grab, target }
    grabbed.value = next
    over(next, destination)
  }

  function drop () {
    const grab = grabbed.value
    if (isNull(grab)) return

    const moving = !isNull(preview.value)
    grabbed.value = null

    if (moving) {
      if (!move(grab.value, grab.target.column, grab.target.index, grab.label)) return
      pending.value = grab.value
    }

    settle(grab.value, grab.label)
  }

  function cancel () {
    const grab = grabbed.value
    if (isNull(grab)) return

    grabbed.value = null

    const item = name(grab.value, grab.label)
    const column = title(kanban.columns.get(grab.origin.column))
    const fallback = `Move cancelled. ${item} stays in ${column}`
    announce(locale.ti('Kanban.cancelled', { item, column }) ?? fallback)
  }

  function sync () {
    const grab = grabbed.value
    if (isNull(grab)) return

    const at = locate(grab.value)
    if (!at) {
      grabbed.value = null
      return
    }

    const origin = { column: at.column.id, index: at.ticket.index }
    const column = kanban.columns.get(grab.target.column)
    const target = column
      ? { column: column.id, index: clamp(grab.target.index, 0, capacity(column, origin.column)) }
      : origin

    if (
      origin.column === grab.origin.column
      && origin.index === grab.origin.index
      && target.column === grab.target.column
      && target.index === grab.target.index
    ) return

    grabbed.value = { ...grab, origin, target }
  }

  provideKanbanRoot(namespace, {
    kanban,
    dnd,
    orientation: toRef(() => orientation),
    isDisabled,
    grabbed: shallowReadonly(grabbed),
    preview,
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
    sync,
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
