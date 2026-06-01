import { describe, expect, it, vi } from 'vitest'

import { createDataGrid, ServerGridAdapter } from './index'

// Utilities
import { nextTick, shallowRef } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const items = [
  { id: 1, name: 'Alice', email: 'alice@test.com', age: 30, dept: 'Eng' },
  { id: 2, name: 'Bob', email: 'bob@test.com', age: 25, dept: 'Eng' },
  { id: 3, name: 'Carol', email: 'carol@test.com', age: 35, dept: 'Sales' },
  { id: 4, name: 'Dave', email: 'dave@test.com', age: 28, dept: 'Sales' },
]

function onboard<T extends { id: number }> (
  grid: { onboard: (inputs: { id: number, value: T }[]) => unknown },
  values: T[],
) {
  grid.onboard(values.map(value => ({ id: value.id, value })))
}

describe('createDataGrid', () => {
  it('should create a grid with data table pipeline', () => {
    const grid = createDataGrid()

    grid.columns.onboard([
      { id: 'name', title: 'Name', sortable: true, filterable: true, size: 30 },
      { id: 'email', title: 'Email', filterable: true, size: 40 },
      { id: 'age', title: 'Age', sortable: true, size: 30 },
    ])

    onboard(grid, items)

    expect(grid.items.value).toHaveLength(4)
    expect(grid.layout.columns.value).toHaveLength(3)
  })

  it('should filter items via search', () => {
    const grid = createDataGrid()

    grid.columns.onboard([
      { id: 'name', filterable: true, size: 50 },
      { id: 'email', filterable: true, size: 50 },
    ])

    onboard(grid, items)

    grid.search('alice')
    expect(grid.items.value).toHaveLength(1)
    expect(grid.items.value[0].name).toBe('Alice')
  })

  it('should sort through the table pipeline', () => {
    const grid = createDataGrid()

    grid.columns.onboard([
      { id: 'name', sortable: true, size: 50 },
      { id: 'age', sortable: true, size: 50 },
    ])

    onboard(grid, items)

    grid.sort.toggle('age')
    expect(grid.items.value[0].name).toBe('Bob') // age 25
    expect(grid.items.value[3].name).toBe('Carol') // age 35
  })

  describe('row registry', () => {
    it('should onboard rows via the inherited registry surface', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      expect(grid.items.value).toHaveLength(0)

      grid.onboard(items.map(value => ({ id: value.id, value })))

      expect(grid.size).toBe(4)
      expect(grid.items.value).toHaveLength(4)
    })

    it('should register a single row and expose it through the pipeline', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      const ticket = grid.register({ id: items[0].id, value: items[0] })

      expect(ticket.id).toBe(items[0].id)
      expect(grid.size).toBe(1)
      expect(grid.items.value[0].name).toBe('Alice')
    })

    it('should remove a row via unregister', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)
      grid.unregister(2)

      expect(grid.size).toBe(3)
      expect(grid.items.value.find(item => item.id === 2)).toBeUndefined()
    })

    it('should clear all rows', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)
      grid.clear()

      expect(grid.size).toBe(0)
      expect(grid.items.value).toHaveLength(0)
    })

    it('should not throw when reset is called on a grid with no rows', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      // No rows onboarded — sortable.size is 0, so reset's reorder is skipped.
      expect(() => grid.rows.reset()).not.toThrow()
      expect(grid.rows.order.value).toEqual([])
    })
  })

  describe('column layout', () => {
    it('should initialize with correct sizes', () => {
      const grid = createDataGrid()

      grid.columns.onboard([
        { id: 'name', size: 40 },
        { id: 'email', size: 60 },
      ])

      onboard(grid, items)

      expect(grid.layout.columns.value[0].size).toBe(40)
      expect(grid.layout.columns.value[1].size).toBe(60)
    })

    it('should support nested columns', () => {
      const grid = createDataGrid()

      grid.columns.onboard([
        { id: 'name', title: 'Name', size: 30 },
        {
          id: 'contact',
          title: 'Contact',
          children: [
            { id: 'email', title: 'Email', size: 40 },
            { id: 'age', title: 'Age', size: 30 },
          ],
        },
      ])

      onboard(grid, items)

      // Layout should have leaf columns only
      expect(grid.layout.columns.value).toHaveLength(3)

      // Headers should be 2D
      expect(grid.headers.value).toHaveLength(2)
      expect(grid.headers.value[0][0].rowspan).toBe(2) // name spans 2 rows
      expect(grid.headers.value[0][1].colspan).toBe(2) // contact spans 2 cols
    })

    it('should expose hidden columns through all and toggle visibility', () => {
      const grid = createDataGrid()

      grid.columns.onboard([
        { id: 'name', size: 50 },
        { id: 'email', size: 50 },
      ])

      onboard(grid, items)

      grid.layout.hide('email')
      expect(grid.layout.columns.value.map(col => col.id)).toEqual(['name'])
      expect(grid.layout.all.value.map(col => col.id)).toEqual(['name', 'email'])
      expect(grid.layout.all.value.find(col => col.id === 'email')?.visible).toBe(false)

      grid.layout.toggle('email')
      expect(grid.layout.columns.value.map(col => col.id)).toEqual(['name', 'email'])
    })
  })

  describe('cell editing', () => {
    it('should commit an edit through the edit lifecycle', () => {
      const onEdit = vi.fn()
      const grid = createDataGrid({
        editing: { onEdit },
      })

      grid.columns.onboard([
        { id: 'name', size: 50, editable: true },
        { id: 'email', size: 50 },
      ])

      onboard(grid, items)

      grid.editing.edit(1, 'name')
      expect(grid.editing.active.value).toEqual({ row: 1, column: 'name' })

      grid.editing.commit('Alicia')
      expect(onEdit).toHaveBeenCalledWith(1, 'name', 'Alicia', items[0])
      expect(grid.editing.active.value).toBeNull()
    })

    it('should reject bad values via validation', () => {
      const grid = createDataGrid({
        editing: {},
      })

      grid.columns.onboard([
        {
          id: 'email',
          size: 100,
          editable: true,
          validate: v => (typeof v === 'string' && v.includes('@')) || 'Invalid email',
        },
      ])

      onboard(grid, items)

      grid.editing.edit(1, 'email')
      grid.editing.commit('not-email')
      expect(grid.editing.error.value).toBe('Invalid email')
      expect(grid.editing.active.value).not.toBeNull()
    })

    it('should make a column editable when onboarded after construction', () => {
      // Editing reads the live column registry leaves, so a column onboarded
      // after the grid (and its editing instance) was built must become
      // editable — proving the editable-bypass is fixed and editing is reactive.
      const onEdit = vi.fn()
      const grid = createDataGrid({
        editing: { onEdit },
      })

      onboard(grid, items)

      // No editable column yet — edit is a no-op.
      grid.editing.edit(1, 'name')
      expect(grid.editing.active.value).toBeNull()

      grid.columns.onboard([{ id: 'name', size: 100, editable: true }])

      grid.editing.edit(1, 'name')
      expect(grid.editing.active.value).toEqual({ row: 1, column: 'name' })

      grid.editing.commit('Alicia')
      expect(onEdit).toHaveBeenCalledWith(1, 'name', 'Alicia', items[0])
      expect(grid.editing.active.value).toBeNull()
    })
  })

  describe('inherited table options', () => {
    // The factory forwards every inherited DataTableOption via the rest spread,
    // so options like groupBy are no longer silently dropped.
    it('should forward groupBy to the underlying data table', () => {
      const grid = createDataGrid({
        groupBy: 'dept',
      })

      grid.columns.onboard([
        { id: 'name', size: 50 },
        { id: 'dept', size: 50 },
      ])

      onboard(grid, items)

      const groups = grid.grouping.groups.value
      expect(groups.map(group => group.key).toSorted()).toEqual(['Eng', 'Sales'])
    })

    it('should leave grouping empty when groupBy is not forwarded', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)

      expect(grid.grouping.groups.value).toHaveLength(0)
    })
  })

  describe('row ordering', () => {
    it('should expose registered row ids on rows.order in registration order', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)

      expect(grid.rows.order.value).toEqual([1, 2, 3, 4])
    })

    it('should reorder rows when rows.move is called with an id', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)

      grid.rows.move(1, 2)

      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])
      expect(grid.items.value.map(item => item.id)).toEqual([2, 3, 1, 4])
    })

    it('should restore natural registration order on rows.reset', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)

      grid.rows.move(1, 2)
      grid.rows.reset()

      expect(grid.rows.order.value).toEqual([1, 2, 3, 4])
      expect(grid.items.value.map(item => item.id)).toEqual([1, 2, 3, 4])
    })

    it('should reset row order when sort changes by default', () => {
      const grid = createDataGrid()

      grid.columns.onboard([
        { id: 'name', sortable: true, size: 50 },
        { id: 'age', sortable: true, size: 50 },
      ])

      onboard(grid, items)
      grid.rows.move(1, 2)
      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])

      grid.sort.toggle('age')

      expect(grid.rows.order.value).toEqual([1, 2, 3, 4])
      expect(grid.items.value[0].name).toBe('Bob') // sort applied, not user order
    })

    it('should keep row order across sort changes when preserveRowOrder is set', () => {
      const grid = createDataGrid({
        preserveRowOrder: true,
      })

      grid.columns.onboard([
        { id: 'name', sortable: true, size: 50 },
        { id: 'age', sortable: true, size: 50 },
      ])

      onboard(grid, items)
      grid.rows.move(1, 2)
      grid.sort.toggle('age')

      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])
    })

    it('should react to a preserveRowOrder ref toggling the sort-reset watcher', async () => {
      const preserve = shallowRef(false)
      const grid = createDataGrid({
        preserveRowOrder: preserve,
      })

      grid.columns.onboard([
        { id: 'name', sortable: true, size: 50 },
        { id: 'age', sortable: true, size: 50 },
      ])

      onboard(grid, items)

      // preserve=false: the watcher is active, so a sort resets the manual move.
      grid.rows.move(1, 2)
      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])
      grid.sort.toggle('age')
      expect(grid.rows.order.value).toEqual([1, 2, 3, 4])

      // Flip to true: useToggleScope tears the watcher down, so the manual
      // order now survives a subsequent sort change.
      preserve.value = true
      await nextTick()

      // A move with the age sort active anchors to the sorted order
      // (Bob 25, Dave 28, Alice 30, Carol 35 → [2, 4, 1, 3]); moving id 1 to
      // its existing index 2 leaves that order intact.
      grid.rows.move(1, 2)
      expect(grid.rows.order.value).toEqual([2, 4, 1, 3])

      // Toggling sort no longer resets the manual order — the watcher is gone.
      grid.sort.toggle('age')
      expect(grid.rows.order.value).toEqual([2, 4, 1, 3])
    })

    it('should re-arm sort-reset when preserveRowOrder toggles back to false', async () => {
      const preserve = shallowRef(false)
      const grid = createDataGrid({
        preserveRowOrder: preserve,
      })

      grid.columns.onboard([
        { id: 'name', sortable: true, size: 50 },
        { id: 'age', sortable: true, size: 50 },
      ])

      onboard(grid, items)

      // Flip to true: useToggleScope tears down the sort-reset watcher.
      preserve.value = true
      await nextTick()

      grid.rows.move(1, 2)
      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])
      grid.sort.toggle('age')
      // Manual order survives — the watcher is torn down.
      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])

      // Flip back to false: useToggleScope re-enters and re-arms the watcher.
      preserve.value = false
      await nextTick()

      grid.rows.move(4, 0)
      expect(grid.rows.order.value).toEqual([4, 2, 3, 1])
      grid.sort.toggle('age')
      // The re-armed watcher now resets the manual order on the next sort change.
      expect(grid.rows.order.value).toEqual([1, 2, 3, 4])
    })

    it('should append late-registered rows at the end of rows.order', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)
      grid.rows.move(1, 2)
      expect(grid.rows.order.value).toEqual([2, 3, 1, 4])

      grid.register({ id: 5, value: { id: 5, name: 'Eve', email: 'eve@test.com', age: 22, dept: 'Eng' } })

      expect(grid.rows.order.value).toEqual([2, 3, 1, 4, 5])
    })

    it('should drop unregistered rows from rows.order', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)
      grid.rows.move(1, 2)

      grid.unregister(3)

      expect(grid.rows.order.value).toEqual([2, 1, 4])
    })

    it('should empty rows.order when clear is called', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)
      grid.rows.move(1, 2)

      grid.clear()

      expect(grid.rows.order.value).toEqual([])
    })
  })

  describe('row ordering — regression', () => {
    // b1: ordering must key off the registry ticket id, not value.id.
    it('should reorder by ticket id when it differs from value.id', () => {
      const grid = createDataGrid<{ id: number, name: string }>()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      // Ticket ids deliberately diverge from value.id.
      grid.register({ id: 100, value: { id: 1, name: 'Alice' } })
      grid.register({ id: 200, value: { id: 2, name: 'Bob' } })
      grid.register({ id: 300, value: { id: 3, name: 'Carol' } })

      grid.rows.move(100, 2)

      expect(grid.rows.order.value).toEqual([200, 300, 100])
      expect(grid.items.value.map(item => item.name)).toEqual(['Bob', 'Carol', 'Alice'])
    })

    // b1: rows with no `id` field at all must still reorder.
    it('should reorder rows whose values have no id field', () => {
      const grid = createDataGrid<{ name: string }>()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      const a = grid.register({ value: { name: 'Alice' } })
      const b = grid.register({ value: { name: 'Bob' } })
      const c = grid.register({ value: { name: 'Carol' } })

      expect(grid.items.value.map(item => item.name)).toEqual(['Alice', 'Bob', 'Carol'])

      grid.rows.move(a.id, 2)

      expect(grid.rows.order.value).toEqual([b.id, c.id, a.id])
      expect(grid.items.value.map(item => item.name)).toEqual(['Bob', 'Carol', 'Alice'])
    })

    // b2: a second consecutive move must recompute the ordered projection.
    it('should recompute items on a second consecutive move', () => {
      const grid = createDataGrid()

      grid.columns.onboard([{ id: 'name', size: 100 }])

      onboard(grid, items)

      const a = grid.items.value.map(item => item.id)
      expect(a).toEqual([1, 2, 3, 4])

      grid.rows.move(1, 2)
      const b = grid.items.value.map(item => item.id)
      expect(b).toEqual([2, 3, 1, 4])

      grid.rows.move(4, 0)
      const c = grid.items.value.map(item => item.id)
      expect(c).toEqual([4, 2, 3, 1])
      expect(c).not.toEqual(b)
    })

    // b4: a manual move after a sort must preserve the active sort order.
    it('should preserve the active sort when moving a row', () => {
      const grid = createDataGrid({
        preserveRowOrder: true,
      })

      grid.columns.onboard([
        { id: 'name', sortable: true, size: 50 },
        { id: 'age', sortable: true, size: 50 },
      ])

      onboard(grid, items)

      grid.sort.toggle('age')
      // Sorted by age asc: Bob(25), Dave(28), Alice(30), Carol(35) → ids [2, 4, 1, 3]
      const sorted = grid.items.value.map(item => item.id)
      expect(sorted).toEqual([2, 4, 1, 3])

      grid.rows.move(3, 0)

      const result = grid.items.value.map(item => item.id)
      expect(result[0]).toBe(3)
      // Remaining rows stay in the sorted order, not registration order.
      expect(result).toEqual([3, 2, 4, 1])
    })

    // b3: server-adapter pages past page 1 must not be empty. The server adapter
    // is handed exactly one page worth of rows (page 2) while `total` reports the
    // full server count; the grid must surface those rows rather than re-slicing
    // into emptiness.
    it('should surface server-adapter page-2 rows instead of an empty slice', () => {
      const page2 = Array.from({ length: 25 }, (_, i) => {
        const n = 26 + i
        return { id: n, name: `User ${n}`, age: 20 + (i % 10), dept: 'Eng' }
      })

      const grid = createDataGrid<{ id: number, name: string, age: number, dept: string }>({
        adapter: new ServerGridAdapter({ total: 100 }),
        pagination: { itemsPerPage: 25 },
      })

      grid.columns.onboard([{ id: 'name', sortable: true, size: 100 }])

      onboard(grid, page2)

      grid.pagination.next()
      expect(grid.pagination.page.value).toBe(2)

      // The server already paginated: 25 rows for page 2, total reported as 100.
      expect(grid.items.value.length).toBe(25)

      // With a manual reorder active (dirty), the grid must order the page in
      // place — `total` (100) exceeds the local sorted slice (25), so it must
      // not re-slice by the global page window into emptiness.
      grid.rows.move(50, 0)
      const ordered = grid.items.value
      expect(ordered.length).toBe(25)
      expect(ordered[0]!.id).toBe(50)
    })
  })

  describe('row spanning', () => {
    it('should compute a span map', () => {
      const grid = createDataGrid({
        rowSpanning: (item, column) => {
          if (column === 'dept' && (item.dept === 'Eng' || item.dept === 'Sales')) return 2
          return 1
        },
      })

      grid.columns.onboard([
        { id: 'dept', size: 50 },
        { id: 'name', size: 50 },
      ])

      onboard(grid, items)

      const spans = grid.spans.value
      expect(spans.get(1)?.get('dept')?.rowSpan).toBe(2)
      expect(spans.get(2)?.get('dept')?.hidden).toBe(true)
      expect(spans.get(3)?.get('dept')?.rowSpan).toBe(2)
      expect(spans.get(4)?.get('dept')?.hidden).toBe(true)
    })
  })
})
