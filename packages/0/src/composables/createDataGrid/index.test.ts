import { describe, expect, it, vi } from 'vitest'

import { createDataGrid } from './index'

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

describe('createDataGrid', () => {
  it('creates a grid with data table pipeline', () => {
    const grid = createDataGrid({
      items,
      columns: [
        { key: 'name', title: 'Name', sortable: true, filterable: true, size: 30 },
        { key: 'email', title: 'Email', filterable: true, size: 40 },
        { key: 'age', title: 'Age', sortable: true, size: 30 },
      ],
    })

    expect(grid.items.value).toHaveLength(4)
    expect(grid.layout.columns.value).toHaveLength(3)
  })

  it('search filters items', () => {
    const grid = createDataGrid({
      items,
      columns: [
        { key: 'name', filterable: true, size: 50 },
        { key: 'email', filterable: true, size: 50 },
      ],
    })

    grid.search('alice')
    expect(grid.items.value).toHaveLength(1)
    expect(grid.items.value[0].name).toBe('Alice')
  })

  it('sort works through the table pipeline', () => {
    const grid = createDataGrid({
      items,
      columns: [
        { key: 'name', sortable: true, size: 50 },
        { key: 'age', sortable: true, size: 50 },
      ],
    })

    grid.sort.toggle('age')
    expect(grid.items.value[0].name).toBe('Bob') // age 25
    expect(grid.items.value[3].name).toBe('Carol') // age 35
  })

  describe('column layout', () => {
    it('initializes with correct sizes', () => {
      const grid = createDataGrid({
        items,
        columns: [
          { key: 'name', size: 40 },
          { key: 'email', size: 60 },
        ],
      })

      expect(grid.layout.columns.value[0].size).toBe(40)
      expect(grid.layout.columns.value[1].size).toBe(60)
    })

    it('supports nested columns', () => {
      const grid = createDataGrid({
        items,
        columns: [
          { key: 'name', title: 'Name', size: 30 },
          {
            key: 'contact',
            title: 'Contact',
            children: [
              { key: 'email', title: 'Email', size: 40 },
              { key: 'age', title: 'Age', size: 30 },
            ],
          },
        ],
      })

      // Layout should have leaf columns only
      expect(grid.layout.columns.value).toHaveLength(3)

      // Headers should be 2D
      expect(grid.headers.value).toHaveLength(2)
      expect(grid.headers.value[0][0].rowspan).toBe(2) // name spans 2 rows
      expect(grid.headers.value[0][1].colspan).toBe(2) // contact spans 2 cols
    })
  })

  describe('cell editing', () => {
    it('edit and commit lifecycle', () => {
      const onEdit = vi.fn()
      const grid = createDataGrid({
        items,
        columns: [
          { key: 'name', size: 50, editable: true },
          { key: 'email', size: 50 },
        ],
        editing: { onEdit },
      })

      grid.editing.edit(1, 'name')
      expect(grid.editing.active.value).toEqual({ row: 1, column: 'name' })

      grid.editing.commit('Alicia')
      expect(onEdit).toHaveBeenCalledWith(1, 'name', 'Alicia', items[0])
      expect(grid.editing.active.value).toBeNull()
    })

    it('validation rejects bad values', () => {
      const grid = createDataGrid({
        items,
        columns: [
          {
            key: 'email',
            size: 100,
            editable: true,
            validate: v => (typeof v === 'string' && v.includes('@')) || 'Invalid email',
          },
        ],
        editing: {},
      })

      grid.editing.edit(1, 'email')
      grid.editing.commit('not-email')
      expect(grid.editing.error.value).toBe('Invalid email')
      expect(grid.editing.active.value).not.toBeNull()
    })
  })

  describe('row spanning', () => {
    it('computes span map', () => {
      const grid = createDataGrid({
        items,
        columns: [
          { key: 'dept', size: 50 },
          { key: 'name', size: 50 },
        ],
        rowSpanning: (item, column) => {
          if (column === 'dept' && (item.dept === 'Eng' || item.dept === 'Sales')) return 2
          return 1
        },
      })

      const spans = grid.spans.value
      expect(spans.get(1)?.get('dept')?.rowSpan).toBe(2)
      expect(spans.get(2)?.get('dept')?.hidden).toBe(true)
      expect(spans.get(3)?.get('dept')?.rowSpan).toBe(2)
      expect(spans.get(4)?.get('dept')?.hidden).toBe(true)
    })
  })
})
