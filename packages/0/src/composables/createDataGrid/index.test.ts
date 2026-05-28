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

function onboard<T extends { id: number }> (
  grid: { onboard: (inputs: { id: number, value: T }[]) => unknown },
  values: T[],
) {
  grid.onboard(values.map(value => ({ id: value.id, value })))
}

describe('createDataGrid', () => {
  it('should create a grid with data table pipeline', () => {
    const grid = createDataGrid({
      columns: [
        { id: 'name', title: 'Name', sortable: true, filterable: true, size: 30 },
        { id: 'email', title: 'Email', filterable: true, size: 40 },
        { id: 'age', title: 'Age', sortable: true, size: 30 },
      ],
    })

    onboard(grid, items)

    expect(grid.items.value).toHaveLength(4)
    expect(grid.layout.columns.value).toHaveLength(3)
  })

  it('should filter items via search', () => {
    const grid = createDataGrid({
      columns: [
        { id: 'name', filterable: true, size: 50 },
        { id: 'email', filterable: true, size: 50 },
      ],
    })

    onboard(grid, items)

    grid.search('alice')
    expect(grid.items.value).toHaveLength(1)
    expect(grid.items.value[0].name).toBe('Alice')
  })

  it('should sort through the table pipeline', () => {
    const grid = createDataGrid({
      columns: [
        { id: 'name', sortable: true, size: 50 },
        { id: 'age', sortable: true, size: 50 },
      ],
    })

    onboard(grid, items)

    grid.sort.toggle('age')
    expect(grid.items.value[0].name).toBe('Bob') // age 25
    expect(grid.items.value[3].name).toBe('Carol') // age 35
  })

  describe('row registry', () => {
    it('should onboard rows via the inherited registry surface', () => {
      const grid = createDataGrid({
        columns: [{ id: 'name', size: 100 }],
      })

      expect(grid.items.value).toHaveLength(0)

      grid.onboard(items.map(value => ({ id: value.id, value })))

      expect(grid.size).toBe(4)
      expect(grid.items.value).toHaveLength(4)
    })

    it('should register a single row and expose it through the pipeline', () => {
      const grid = createDataGrid({
        columns: [{ id: 'name', size: 100 }],
      })

      const ticket = grid.register({ id: items[0].id, value: items[0] })

      expect(ticket.id).toBe(items[0].id)
      expect(grid.size).toBe(1)
      expect(grid.items.value[0].name).toBe('Alice')
    })

    it('should remove a row via unregister', () => {
      const grid = createDataGrid({
        columns: [{ id: 'name', size: 100 }],
      })

      onboard(grid, items)
      grid.unregister(2)

      expect(grid.size).toBe(3)
      expect(grid.items.value.find(item => item.id === 2)).toBeUndefined()
    })

    it('should clear all rows', () => {
      const grid = createDataGrid({
        columns: [{ id: 'name', size: 100 }],
      })

      onboard(grid, items)
      grid.clear()

      expect(grid.size).toBe(0)
      expect(grid.items.value).toHaveLength(0)
    })
  })

  describe('column layout', () => {
    it('should initialize with correct sizes', () => {
      const grid = createDataGrid({
        columns: [
          { id: 'name', size: 40 },
          { id: 'email', size: 60 },
        ],
      })

      onboard(grid, items)

      expect(grid.layout.columns.value[0].size).toBe(40)
      expect(grid.layout.columns.value[1].size).toBe(60)
    })

    it('should support nested columns', () => {
      const grid = createDataGrid({
        columns: [
          { id: 'name', title: 'Name', size: 30 },
          {
            id: 'contact',
            title: 'Contact',
            children: [
              { id: 'email', title: 'Email', size: 40 },
              { id: 'age', title: 'Age', size: 30 },
            ],
          },
        ],
      })

      onboard(grid, items)

      // Layout should have leaf columns only
      expect(grid.layout.columns.value).toHaveLength(3)

      // Headers should be 2D
      expect(grid.headers.value).toHaveLength(2)
      expect(grid.headers.value[0][0].rowspan).toBe(2) // name spans 2 rows
      expect(grid.headers.value[0][1].colspan).toBe(2) // contact spans 2 cols
    })
  })

  describe('cell editing', () => {
    it('should commit an edit through the edit lifecycle', () => {
      const onEdit = vi.fn()
      const grid = createDataGrid({
        columns: [
          { id: 'name', size: 50, editable: true },
          { id: 'email', size: 50 },
        ],
        editing: { onEdit },
      })

      onboard(grid, items)

      grid.editing.edit(1, 'name')
      expect(grid.editing.active.value).toEqual({ row: 1, column: 'name' })

      grid.editing.commit('Alicia')
      expect(onEdit).toHaveBeenCalledWith(1, 'name', 'Alicia', items[0])
      expect(grid.editing.active.value).toBeNull()
    })

    it('should reject bad values via validation', () => {
      const grid = createDataGrid({
        columns: [
          {
            id: 'email',
            size: 100,
            editable: true,
            validate: v => (typeof v === 'string' && v.includes('@')) || 'Invalid email',
          },
        ],
        editing: {},
      })

      onboard(grid, items)

      grid.editing.edit(1, 'email')
      grid.editing.commit('not-email')
      expect(grid.editing.error.value).toBe('Invalid email')
      expect(grid.editing.active.value).not.toBeNull()
    })
  })

  describe('row spanning', () => {
    it('should compute a span map', () => {
      const grid = createDataGrid({
        columns: [
          { id: 'dept', size: 50 },
          { id: 'name', size: 50 },
        ],
        rowSpanning: (item, column) => {
          if (column === 'dept' && (item.dept === 'Eng' || item.dept === 'Sales')) return 2
          return 1
        },
      })

      onboard(grid, items)

      const spans = grid.spans.value
      expect(spans.get(1)?.get('dept')?.rowSpan).toBe(2)
      expect(spans.get(2)?.get('dept')?.hidden).toBe(true)
      expect(spans.get(3)?.get('dept')?.rowSpan).toBe(2)
      expect(spans.get(4)?.get('dept')?.hidden).toBe(true)
    })
  })
})
