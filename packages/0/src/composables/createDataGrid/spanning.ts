/**
 * @module createDataGrid/spanning
 *
 * @remarks
 * Computes a row span map from visible items. For each cell, determines
 * rowSpan and whether it's hidden (covered by a span from a previous row).
 * Spans do not cross page boundaries. Each row is addressed by a key: either a
 * `key(item, index)` projection (the grid passes the registry ticket id) or,
 * absent that, the row's `itemKey` value. Rows whose resolved key is
 * `undefined` cannot be addressed in the resulting map and are skipped.
 *
 * @internal Consumed only by `createDataGrid`. Fully decoupled (items ref +
 * columns + key + span fn — no grid/table types), so it is a latent composable.
 * Promote it to a standalone `createRowSpanning/` composable on a second
 * consumer. See `.claude/rules/composables.md` §"Sub-modules: inline, private
 * sibling, or promote".
 */

// Utilities
import { isNaN, isUndefined } from '#v0/utilities'
import { computed, toValue } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

export interface SpanEntry {
  rowSpan: number
  hidden: boolean
}

/**
 * Options for {@link createRowSpanning}.
 *
 * @template T Row value type.
 *
 * @example
 * ```ts
 * const options: RowSpanningOptions<Holding> = {
 *   items: computed(() => grid.items.value),
 *   columns: ['group', 'ticker', 'value'],
 *   span: (item, column) => column === 'group' ? 3 : 1,
 * }
 * ```
 */
export interface RowSpanningOptions<T = Record<string, unknown>> {
  items: Ref<readonly T[]> | ComputedRef<readonly T[]>
  columns: MaybeRefOrGetter<readonly string[]>
  /**
   * Projects the row key from its item and index. Takes precedence over
   * `itemKey` — the grid passes the registry ticket id so the span map shares
   * identity with the rest of the grid. Rows whose projected key is
   * `undefined` are skipped, since their spans can't be addressed.
   */
  key?: (item: T, index: number) => ID | undefined
  /**
   * Property used to identify each row in the span map when `key` is absent.
   * Rows whose value for this key is `undefined` are skipped, since their
   * spans can't be addressed.
   */
  itemKey?: string
  /**
   * Resolves the row span for a cell. Return a value < 1 (or `NaN`) to span a
   * single row. When absent, no spans are produced.
   */
  span?: (item: T, column: string) => number
}

/**
 * Computes a row span map from visible items.
 *
 * @param options Row spanning configuration
 * @returns A computed map of item ID to column to SpanEntry
 *
 * @example
 * ```ts
 * const spans = createRowSpanning({
 *   items: computed(() => grid.items.value),
 *   columns: ['group', 'ticker', 'value'],
 *   span: (item, column) => column === 'group' ? 3 : 1,
 * })
 *
 * spans.value.get(id)?.get('group') // { rowSpan: 3, hidden: false }
 * ```
 */
export function createRowSpanning<T extends Record<string, unknown>> (
  options: RowSpanningOptions<T>,
): ComputedRef<Map<ID, Map<string, SpanEntry>>> {
  const { items, columns, key, itemKey = 'id', span } = options

  return computed(() => {
    const result = new Map<ID, Map<string, SpanEntry>>()

    if (!span) return result

    const list = items.value
    const resolved = toValue(columns)

    // Track which cells are covered by a span from a previous row
    // covered[colIndex] = number of remaining rows to skip
    const covered = Array.from<number>({ length: resolved.length }).fill(0)

    for (let row = 0; row < list.length; row++) {
      const item = list[row]
      const id = key ? key(item, row) : item[itemKey] as ID

      // A row that can't be identified gets no span entry, and must not
      // participate as a coverage source — skip before computing spans.
      if (isUndefined(id)) continue

      const cells = new Map<string, SpanEntry>()

      for (const [col, column] of resolved.entries()) {
        if (covered[col] > 0) {
          cells.set(column, { rowSpan: 1, hidden: true })
          covered[col]--
        } else {
          const raw = span(item, column)
          const rowSpan = Math.min(
            Math.max(1, isNaN(raw) ? 1 : raw),
            list.length - row, // clamp to remaining rows
          )
          cells.set(column, { rowSpan, hidden: false })
          if (rowSpan > 1) {
            covered[col] = rowSpan - 1
          }
        }
      }

      result.set(id, cells)
    }

    return result
  })
}
