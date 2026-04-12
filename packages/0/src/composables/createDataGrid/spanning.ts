/**
 * @module createDataGrid/spanning
 *
 * @remarks
 * Computes a row span map from visible items. For each cell, determines
 * rowSpan and whether it's hidden (covered by a span from a previous row).
 * Spans do not cross page boundaries.
 */

// Utilities
import { computed } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { ComputedRef, Ref } from 'vue'

export interface SpanEntry {
  rowSpan: number
  hidden: boolean
}

export interface RowSpanningOptions<T = Record<string, unknown>> {
  items: Ref<readonly T[]> | ComputedRef<readonly T[]>
  columns: readonly string[]
  itemKey?: string
  rowSpanning?: (item: T, column: string) => number
}

/**
 * Computes a row span map from visible items.
 *
 * @param options Row spanning configuration
 * @returns A computed map of item ID to column to SpanEntry
 */
export function createRowSpanning<T extends Record<string, unknown>> (
  options: RowSpanningOptions<T>,
): ComputedRef<Map<ID, Map<string, SpanEntry>>> {
  const { items, columns, itemKey = 'id', rowSpanning } = options

  return computed(() => {
    const result = new Map<ID, Map<string, SpanEntry>>()

    if (!rowSpanning) return result

    const list = items.value

    // Track which cells are covered by a span from a previous row
    // covered[colIndex] = number of remaining rows to skip
    const covered = Array.from<number>({ length: columns.length }).fill(0)

    for (let row = 0; row < list.length; row++) {
      const item = list[row]
      const id = item[itemKey] as ID
      const cells = new Map<string, SpanEntry>()

      for (const [col, column] of columns.entries()) {
        if (covered[col] > 0) {
          cells.set(column, { rowSpan: 1, hidden: true })
          covered[col]--
        } else {
          const span = Math.min(
            Math.max(1, rowSpanning(item, column)),
            list.length - row, // clamp to remaining rows
          )
          cells.set(column, { rowSpan: span, hidden: false })
          if (span > 1) {
            covered[col] = span - 1
          }
        }
      }

      result.set(id, cells)
    }

    return result
  })
}
