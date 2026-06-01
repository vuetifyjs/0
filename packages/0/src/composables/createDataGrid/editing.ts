/**
 * @module createDataGrid/editing
 *
 * @remarks
 * Cell editing state management. Tracks active cell, validation errors,
 * and dirty (staged but uncommitted) edits. Does not mutate source data —
 * commit fires a callback for the consumer to handle.
 *
 * When a `registry` is provided, editing state for rows that get
 * unregistered (or wiped via `clear`) is pruned automatically so consumers
 * can never observe `active` pointing at a phantom row or stale entries
 * lingering in `dirty`.
 *
 * @internal Consumed only by `createDataGrid`. This is a fully decoupled 2D
 * cell-edit primitive — it imports nothing from `createDataGrid` /
 * `createDataTable` (only `#v0/utilities`, `#v0/types`, and Vue), so it is a
 * latent composable. Promote it to a standalone `createCellEditing/`
 * composable the moment a second consumer appears (e.g. an editable
 * `createDataTable`). See `.claude/rules/composables.md` §"Sub-modules:
 * inline, private sibling, or promote".
 */

// Utilities
import { isFunction, isString, isUndefined } from '#v0/utilities'
import { onScopeDispose, shallowReactive, shallowRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { ShallowReactive, ShallowRef } from 'vue'

export interface EditableColumn {
  readonly id: string
  readonly editable?: boolean | ((item: unknown) => boolean)
  readonly validate?: (value: unknown, item?: unknown) => string | true
}

/**
 * Minimal structural type of the row registry surface that
 * `createCellEditing` subscribes to for pruning stale state.
 *
 * Compatible with the registry returned by `createDataTable` / spread onto
 * `createDataGrid`. The `on` / `off` channel is needed — handlers subscribe at
 * setup and unsubscribe on scope dispose, so a registry that outlives the
 * editing instance does not accumulate listeners. The payload arrives as
 * `unknown` and is narrowed inside the handler.
 */
export interface CellEditingRegistry {
  on: (event: string, listener: (data: unknown) => void) => void
  off: (event: string, listener: (data: unknown) => void) => void
}

export interface CellEditingOptions {
  columns: readonly EditableColumn[]
  onEdit?: (row: ID, column: string, value: unknown) => void
  lookup?: (row: ID) => unknown
  registry?: CellEditingRegistry
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
  /**
   * Map of rows that have staged (uncommitted) cell values. The outer key
   * is the row id; the inner Map is column id → staged value. Empty
   * entries are not pre-created — consumers that want to stage a value
   * insert their own per-row Map (or use the dirty Map's `set`).
   *
   * `dirty` is a consumer-managed staging area for uncommitted values;
   * `commit(value)` commits its explicit `value` argument and merely deletes
   * the matching staged entry — it does not read or auto-flush staged values.
   */
  dirty: Readonly<ShallowReactive<Map<ID, Map<string, unknown>>>>
}

/**
 * Creates cell editing state for a data grid.
 *
 * @param options Cell editing configuration including columns and commit callback
 * @returns Cell editing state and controls
 *
 * @example
 * ```ts
 * const editing = createCellEditing({
 *   columns: [{ id: 'name', editable: true }],
 *   registry: table,
 *   onEdit (row, column, value) { ... },
 * })
 *
 * editing.edit(1, 'name')
 * editing.commit('Alice')
 * ```
 */
export function createCellEditing (options: CellEditingOptions): CellEditing {
  const { columns, onEdit, lookup, registry } = options

  const columnMap = new Map<string, EditableColumn>()
  for (const col of columns) {
    columnMap.set(col.id, col)
  }

  const active = shallowRef<ActiveCell | null>(null)
  const error = shallowRef<string | null>(null)
  const dirty = shallowReactive(new Map<ID, Map<string, unknown>>())

  function edit (row: ID, column: string) {
    const col = columnMap.get(column)
    if (!col) return

    if (isFunction(col.editable)) {
      const item = lookup?.(row)
      if (isUndefined(item) || !col.editable(item)) return
    } else if (col.editable !== true) {
      return
    }
    error.value = null
    active.value = { row, column }
  }

  function commit (value: unknown) {
    const cell = active.value
    if (!cell) return

    const col = columnMap.get(cell.column)
    if (col?.validate) {
      const result = col.validate(value, lookup?.(cell.row))
      if (result !== true && isString(result) && result.length > 0) {
        error.value = result
        return
      }
    }

    // Reset v0's internal edit-state machine BEFORE invoking the consumer
    // callback. v0 owns the state machine; the consumer owns persistence.
    // A throwing `onEdit` then propagates to the consumer without leaving
    // the cell wedged in edit mode with stale active/error/dirty state.
    const entry = dirty.get(cell.row)
    if (entry) {
      entry.delete(cell.column)
      if (entry.size === 0) dirty.delete(cell.row)
    }

    error.value = null
    active.value = null

    onEdit?.(cell.row, cell.column, value)
  }

  function cancel () {
    const cell = active.value
    if (cell) {
      const entry = dirty.get(cell.row)
      if (entry) {
        entry.delete(cell.column)
        if (entry.size === 0) dirty.delete(cell.row)
      }
    }
    error.value = null
    active.value = null
  }

  function onUnregister (data: unknown) {
    const ticket = data as { id: ID }
    if (active.value?.row === ticket.id) {
      active.value = null
      error.value = null
    }
    dirty.delete(ticket.id)
  }

  function onClear () {
    active.value = null
    error.value = null
    dirty.clear()
  }

  if (registry) {
    registry.on('unregister:ticket', onUnregister)
    registry.on('clear:registry', onClear)

    onScopeDispose(() => {
      registry.off('unregister:ticket', onUnregister)
      registry.off('clear:registry', onClear)
    }, true)
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
