/**
 * @module KanbanColumn
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * Registers one column on the board and bridges its items through v-model.
 * The bound array is the column's item list: external changes (push, splice,
 * replace) reconcile into the column's sortable, and board moves write the new
 * order back. Item identity is the value itself, so values must be unique
 * across the board — use objects or unique ids.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useKanbanRoot } from './KanbanRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { isUndefined, useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { KanbanBoardColumn, KanbanOrientation } from './KanbanRoot.vue'
  import type { Ref } from 'vue'

  export interface KanbanColumnContext {
    /** The registered column ticket */
    ticket: KanbanBoardColumn
    /** The column's item values, in board order */
    model: Readonly<Ref<readonly unknown[]>>
    /** Axis the column's items flow along */
    orientation: Readonly<Ref<KanbanOrientation>>
    /** Whether moves into, out of, and within this column are blocked */
    isDisabled: Readonly<Ref<boolean>>
  }

  export const [useKanbanColumn, provideKanbanColumn] = createContext<KanbanColumnContext>({ suffix: 'column' })

  export interface KanbanColumnProps<T = unknown> extends AtomProps {
    /** Column id, used in `move` payloads. Auto-generated when omitted. */
    id?: ID
    /** The column's own data */
    value?: unknown
    /** Accessible name; also used in announcements */
    label?: string
    /** Block moves into, out of, and within this column */
    disabled?: boolean
    /**
     * Veto incoming cross-column moves. Synchronous; return false to reject.
     * Same-column reorders bypass it.
     */
    accept?: (value: T, from: ID, index: number) => boolean
    /** Namespace for context injection from Kanban.Root */
    namespace?: string
  }

  export interface KanbanColumnSlotProps<T = unknown> {
    /** Column id */
    id: ID
    /** The column's item values, in board order */
    items: T[]
    /** Whether the column is disabled */
    isDisabled: boolean
    /** Attributes to bind to the column element */
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-disabled': boolean
      'data-disabled': true | undefined
    }
  }
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'KanbanColumn', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: KanbanColumnSlotProps<T>) => any
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    value,
    label,
    disabled = false,
    accept,
    namespace = 'v0:kanban',
  } = defineProps<KanbanColumnProps<T>>()

  const model = defineModel<T[]>({ default: () => [] })

  defineEmits<{
    'update:model-value': [value: T[]]
  }>()

  const root = useKanbanRoot(namespace)

  const ticket = root.kanban.columns.register({
    id,
    value,
    label: () => label,
    disabled: () => disabled,
    accept: (item, from, index) => isUndefined(accept) || accept(item.value as T, from, index),
  })

  const isDisabled = toRef(() => root.isDisabled.value || disabled)

  let syncing = false

  function same (a: readonly unknown[], b: readonly unknown[]) {
    return a.length === b.length && a.every((item, index) => item === b[index])
  }

  function find (item: unknown) {
    return ticket.items.browse(item)?.[0]
  }

  function reconcile (list: readonly T[]) {
    syncing = true

    try {
      const wanted = new Set<unknown>(list)

      for (const entry of ticket.items.values()) {
        if (!wanted.has(entry.value)) ticket.items.unregister(entry.id)
      }

      for (const item of list) {
        if (isUndefined(find(item))) ticket.items.register({ value: item })
      }

      if (same(ticket.items.values().map(entry => entry.value), list)) return

      const ids = list.map(item => find(item)).filter(entry => !isUndefined(entry))
      ticket.items.reorder(ids)

      // reorder is a no-op while the column is disabled; the bound array still wins.
      if (same(ticket.items.values().map(entry => entry.value), list)) return

      ticket.items.offboard([...ticket.items.keys()])
      ticket.items.onboard(list.map(item => ({ value: item })))
    } finally {
      syncing = false
    }
  }

  function commit () {
    if (syncing) return
    const next = ticket.items.values().map(entry => entry.value as T)
    if (same(next, model.value)) return
    model.value = next
  }

  ticket.items.on('register:ticket', commit)
  ticket.items.on('unregister:ticket', commit)
  ticket.items.on('move:ticket', commit)
  ticket.items.on('reindex:registry', commit)

  watch(() => [...model.value], reconcile, { immediate: true })

  watch(() => value, next => {
    root.kanban.columns.upsert(ticket.id, { value: next })
  })

  provideKanbanColumn(namespace, {
    ticket,
    model: toRef(() => model.value),
    orientation: toRef(() => root.orientation.value === 'horizontal' ? 'vertical' : 'horizontal'),
    isDisabled,
  })

  onBeforeUnmount(() => {
    ticket.unregister()
  })

  const slotProps = toRef((): KanbanColumnSlotProps<T> => ({
    id: ticket.id,
    items: model.value,
    isDisabled: isDisabled.value,
    attrs: {
      'role': 'group',
      'aria-label': label,
      'aria-disabled': isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
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
