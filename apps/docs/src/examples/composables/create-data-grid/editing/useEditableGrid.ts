import { computed, nextTick, ref, shallowRef, useTemplateRef } from 'vue'

import {
  createDataGrid,
  createTimeline,
  useClickOutside,
  useHotkey,
  useToggleScope,
} from '@vuetify/v0'
import type { ID, TimelineTicket } from '@vuetify/v0'

import { columns } from './columns'
import { products } from './data'
import type { Product } from './data'

interface EditEntry {
  row: ID
  column: string
  from: unknown
  to: unknown
}

export function useEditableGrid () {
  const input = ref('')
  const original = shallowRef('')
  const editRef = useTemplateRef<HTMLInputElement[]>('edit-input')
  const canRedo = shallowRef(false)

  const timeline = createTimeline<TimelineTicket<EditEntry>>({
    size: 50,
    reactive: true,
  })

  function applyValue (row: ID, column: string, value: unknown) {
    const item = grid.get(row)?.value
    if (!item) return
    const coerced = column === 'price' || column === 'quantity' ? Number(value) : value
    grid.upsert(row, { value: { ...item, [column]: coerced } })
  }

  const grid = createDataGrid<Product>({
    editing: {
      onEdit (row, column, value, item) {
        const from = item ? item[column as keyof typeof item] : undefined
        timeline.register({ value: { row, column, from, to: value } })
        applyValue(row, column, value)
        canRedo.value = false
      },
    },
  })

  grid.columns.onboard(columns)
  grid.onboard(products.map(value => ({ id: value.id, value })))

  const history = computed(() => timeline.values().toReversed())
  const editedCells = computed(
    () => new Set(timeline.values().map(t => `${t.value.row}:${t.value.column}`)),
  )

  function cellKey (row: ID, column: string) {
    return `${row}:${column}`
  }

  function isEditing (row: ID, column: string) {
    const cell = grid.editing.active.value
    return cell?.row === row && cell?.column === column
  }

  function isEdited (row: ID, column: string) {
    return editedCells.value.has(cellKey(row, column))
  }

  function isEditable (column: string) {
    return grid.columns.get(column)?.editable === true
  }

  function isSortable (column: string) {
    const col = grid.columns.get(column)
    return col?.sortable === true || col?.sort !== undefined
  }

  function onEdit (row: ID, column: string, value: unknown) {
    if (!isEditable(column)) return

    grid.editing.edit(row, column)
    input.value = String(value ?? '')
    original.value = input.value

    nextTick(() => {
      const el = editRef.value?.[0]
      el?.focus()
      el?.select()
    })
  }

  function onCommit () {
    // Opened-then-left-unchanged shouldn't register an edit — just close.
    if (input.value === original.value) return onCancel()
    grid.editing.commit(input.value)
  }

  function onCancel () {
    grid.editing.cancel()
  }

  function onUndo () {
    const ticket = timeline.undo()
    if (!ticket) return
    applyValue(ticket.value.row, ticket.value.column, ticket.value.from)
    canRedo.value = true
  }

  function onRedo () {
    const ticket = timeline.redo()
    if (!ticket) return
    applyValue(ticket.value.row, ticket.value.column, ticket.value.to)
  }

  function onClear () {
    timeline.clear()
    canRedo.value = false
  }

  // `active-cell` sits inside v-for, so the template ref resolves to an array;
  // useClickOutside needs the element itself, hence the `[0]` getter.
  const cell = useTemplateRef<HTMLTableCellElement[]>('active-cell')

  useToggleScope(
    () => !!grid.editing.active.value,
    () => {
      useClickOutside(() => cell.value?.[0], () => onCommit())
      useHotkey('escape', () => onCancel(), { inputs: true })
    },
  )

  useHotkey('ctrl+z', () => onUndo())
  useHotkey('ctrl+shift+z', () => onRedo())
  useHotkey('ctrl+y', () => onRedo())

  function money (value: unknown) {
    return `$${Number(value).toFixed(2)}`
  }

  const total = computed(() => grid.allItems.value.reduce((sum, p) => sum + p.price * p.quantity, 0))
  const low = computed(() => grid.allItems.value.filter(p => p.quantity < 50).length)

  return {
    grid,
    timeline,
    input,
    canRedo,
    history,
    editedCells,
    isEditing,
    isEdited,
    isEditable,
    isSortable,
    onEdit,
    onCommit,
    onUndo,
    onRedo,
    onClear,
    money,
    total,
    low,
  }
}
