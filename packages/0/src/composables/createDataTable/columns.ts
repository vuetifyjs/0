/**
 * @module createDataTable/columns
 *
 * @remarks
 * Utilities for resolving recursive column definitions into flat leaf
 * columns and 2D header grids. Used by createDataTable for header
 * rendering and by createDataGrid for column layout.
 */

export interface ColumnNode {
  readonly key: string
  readonly title?: string
  readonly children?: readonly ColumnNode[]
}

export interface InternalHeader {
  key: string
  title: string
  colspan: number
  rowspan: number
  depth: number
}

/**
 * Recursively extract leaf columns (those without children).
 *
 * @param columns Column tree to extract leaves from
 * @returns Flat array of leaf columns
 */
export function extractLeaves<T extends ColumnNode> (columns: readonly T[]): T[] {
  const leaves: T[] = []
  for (const col of columns) {
    if (col.children?.length) {
      leaves.push(...extractLeaves(col.children as readonly T[]))
    } else {
      leaves.push(col)
    }
  }
  return leaves
}

/**
 * Compute the maximum nesting depth of a column tree (0 = flat).
 *
 * @param columns Column tree to measure
 * @returns Maximum nesting depth
 */
export function computeDepth (columns: readonly ColumnNode[]): number {
  let max = 0
  for (const col of columns) {
    if (col.children?.length) {
      max = Math.max(max, 1 + computeDepth(col.children))
    }
  }
  return max
}

/**
 * Resolve a recursive column tree into a 2D header grid.
 *
 * Each cell has colspan (number of leaf descendants) and rowspan
 * (how many rows a leaf spans when it doesn't fill all depth levels).
 *
 * @param columns Column tree to resolve
 * @returns 2D array of header cells with colspan/rowspan
 */
export function resolveHeaders (columns: readonly ColumnNode[]): InternalHeader[][] {
  if (columns.length === 0) return []

  const maxDepth = computeDepth(columns)
  const rows: InternalHeader[][] = Array.from({ length: maxDepth + 1 }, () => [])

  function walk (cols: readonly ColumnNode[], depth: number) {
    for (const col of cols) {
      if (col.children?.length) {
        const leaves = extractLeaves(col.children)
        rows[depth].push({
          key: col.key,
          title: col.title ?? '',
          colspan: leaves.length,
          rowspan: 1,
          depth,
        })
        walk(col.children, depth + 1)
      } else {
        rows[depth].push({
          key: col.key,
          title: col.title ?? '',
          colspan: 1,
          rowspan: maxDepth - depth + 1,
          depth,
        })
      }
    }
  }

  walk(columns, 0)
  return rows
}
