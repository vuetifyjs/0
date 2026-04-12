/**
 * @module createDataGrid/editing
 *
 * @remarks
 * Cell editing state management. Tracks active cell, validation errors,
 * and dirty (uncommitted) edits. Does not mutate source data — commit
 * fires a callback for the consumer to handle.
 */

// Utilities
import { isFunction } from '#v0/utilities'
import { ref, shallowRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Ref, ShallowRef } from 'vue'

export interface EditableColumn {
  readonly key: string
  readonly editable?: boolean | ((item: unknown) => boolean)
  readonly validate?: (value: unknown, item?: unknown) => string | true
}

export interface CellEditingOptions {
  columns: readonly EditableColumn[]
  onEdit?: (row: ID, column: string, value: unknown) => void
  lookup?: (row: ID) => unknown
}

export interface ActiveCell {
  row: ID
  column: string
}

export interface CellEditing {
  active: Readonly<ShallowRef<ActiveCell | null>>
  edit: (row: ID, column: string) => void
  commit: (value: unknown) => void
  cancel: () => void
  error: Readonly<ShallowRef<string | null>>
  dirty: Readonly<Ref<Map<ID, Map<string, unknown>>>>
}

/**
 * Creates cell editing state for a data grid.
 *
 * @param options Cell editing configuration including columns and commit callback
 * @returns Cell editing state and controls
 */
export function createCellEditing (options: CellEditingOptions): CellEditing {
  const { columns, onEdit, lookup } = options

  const columnMap = new Map<string, EditableColumn>()
  for (const col of columns) {
    columnMap.set(col.key, col)
  }

  const active = shallowRef<ActiveCell | null>(null)
  const error = shallowRef<string | null>(null)
  const dirty = ref(new Map<ID, Map<string, unknown>>())

  function edit (row: ID, column: string) {
    const col = columnMap.get(column)
    if (!col) return

    if (isFunction(col.editable)) {
      const item = lookup?.(row)
      if (!col.editable(item)) return
    } else if (col.editable !== true) {
      return
    }
    error.value = null
    active.value = { row, column }
    if (!dirty.value.has(row)) {
      dirty.value.set(row, new Map())
    }
  }

  function commit (value: unknown) {
    const cell = active.value
    if (!cell) return

    const col = columnMap.get(cell.column)
    if (col?.validate) {
      const item = lookup?.(cell.row)
      const result = col.validate(value, item)
      if (result !== true) {
        error.value = result
        return
      }
    }

    onEdit?.(cell.row, cell.column, value)

    // Clear dirty entry for this cell
    const entry = dirty.value.get(cell.row)
    if (entry) {
      entry.delete(cell.column)
      if (entry.size === 0) dirty.value.delete(cell.row)
    }

    error.value = null
    active.value = null
  }

  function cancel () {
    error.value = null
    active.value = null
  }

  return {
    active,
    edit,
    commit,
    cancel,
    error,
    dirty,
  }
}
