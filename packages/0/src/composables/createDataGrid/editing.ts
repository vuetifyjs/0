/**
 * @module createDataGrid/editing
 *
 * @remarks
 * Cell editing state management. Tracks active cell, validation errors,
 * and dirty (uncommitted) edits. Does not mutate source data — commit
 * fires a callback for the consumer to handle.
 */

// Utilities
import { isString } from '#v0/utilities'
import { ref, shallowRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Ref, ShallowRef } from 'vue'

export interface EditableColumn {
  readonly key: string
  readonly editable?: boolean | ((item: unknown) => boolean)
  readonly validate?: (value: unknown, item?: unknown) => boolean | string
}

export interface CellEditingOptions {
  columns: readonly EditableColumn[]
  onEdit?: (row: ID, column: string, value: unknown) => void
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

export function createCellEditing (options: CellEditingOptions): CellEditing {
  const { columns, onEdit } = options

  const columnMap = new Map<string, EditableColumn>()
  for (const col of columns) {
    columnMap.set(col.key, col)
  }

  const active = shallowRef<ActiveCell | null>(null)
  const error = shallowRef<string | null>(null)
  const dirty = ref(new Map<ID, Map<string, unknown>>())

  function edit (row: ID, column: string) {
    const col = columnMap.get(column)
    if (!col || col.editable === false || col.editable === undefined) {
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
      const result = col.validate(value)
      if (isString(result)) {
        error.value = result
        return
      }
    }

    onEdit?.(cell.row, cell.column, value)

    // Clear dirty entry for this cell
    const rowDirty = dirty.value.get(cell.row)
    if (rowDirty) {
      rowDirty.delete(cell.column)
      if (rowDirty.size === 0) dirty.value.delete(cell.row)
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
