import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, nextTick, provide, ref } from 'vue'

// Types
import type { DataTableColumn, DataTableOptions } from './index'

import { createDataTable, createDataTableContext, useDataTable, ServerAdapter, VirtualAdapter } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

type User = {
  id: number
  name: string
  email: string
  department: string
  salary: number
  active: boolean
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', department: 'Engineering', salary: 120_000, active: true },
  { id: 2, name: 'Bob', email: 'bob@test.com', department: 'Design', salary: 95_000, active: true },
  { id: 3, name: 'Carol', email: 'carol@test.com', department: 'Engineering', salary: 110_000, active: false },
  { id: 4, name: 'Dan', email: 'dan@test.com', department: 'Marketing', salary: 85_000, active: true },
  { id: 5, name: 'Eve', email: 'eve@test.com', department: 'Design', salary: 105_000, active: true },
]

const columns: DataTableColumn<User>[] = [
  { key: 'name', title: 'Name', sortable: true, filterable: true },
  { key: 'email', title: 'Email', sortable: true, filterable: true },
  { key: 'department', title: 'Dept', sortable: true },
  { key: 'salary', title: 'Salary', sortable: true, sort: (a, b) => Number(a) - Number(b) },
  { key: 'active', title: 'Status' },
]

function createTable (overrides: Partial<DataTableOptions<User>> = {}) {
  return createDataTable<User>({
    items: users,
    columns,
    ...overrides,
  })
}

describe('createDataTable', () => {
  describe('search', () => {
    it('updates query ref', () => {
      const table = createTable()
      expect(table.query.value).toBe('')
      table.search('alice')
      expect(table.query.value).toBe('alice')
    })

    it('filters items by search query', () => {
      const table = createTable()
      table.search('alice')
      expect(table.filteredItems.value.length).toBe(1)
      expect((table.filteredItems.value[0] as User).name).toBe('Alice')
    })

    it('clears filter when search is empty', () => {
      const table = createTable()
      table.search('alice')
      expect(table.filteredItems.value.length).toBe(1)
      table.search('')
      expect(table.filteredItems.value.length).toBe(5)
    })
  })

  describe('sort', () => {
    it('cycles none → asc → desc → none', () => {
      const table = createTable()
      expect(table.sort.direction('name')).toBe('none')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('none')
    })

    it('firstSortOrder desc reverses cycle', () => {
      const table = createTable({ firstSortOrder: 'desc' })

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('none')
    })

    it('mandate prevents clearing sort', () => {
      const table = createTable({ mandate: true })

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')
    })

    it('sortMultiple allows multi-column sort', () => {
      const table = createTable({ sortMultiple: true })

      table.sort.toggle('name')
      table.sort.toggle('department')

      expect(table.sort.columns.value).toEqual([
        { key: 'name', direction: 'asc' },
        { key: 'department', direction: 'asc' },
      ])
    })

    it('single sort clears previous column', () => {
      const table = createTable()

      table.sort.toggle('name')
      table.sort.toggle('department')

      expect(table.sort.columns.value.length).toBe(1)
      expect(table.sort.columns.value[0]!.key).toBe('department')
    })

    it('direction() returns current sort direction', () => {
      const table = createTable()
      expect(table.sort.direction('name')).toBe('none')
      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')
    })

    it('priority() returns sort order index', () => {
      const table = createTable({ sortMultiple: true })

      table.sort.toggle('name')
      table.sort.toggle('department')

      expect(table.sort.priority('name')).toBe(0)
      expect(table.sort.priority('department')).toBe(1)
      expect(table.sort.priority('email')).toBe(-1)
    })

    it('reset() clears all sort state', () => {
      const table = createTable({ sortMultiple: true })

      table.sort.toggle('name')
      table.sort.toggle('department')
      table.sort.reset()

      expect(table.sort.columns.value.length).toBe(0)
      expect(table.sort.direction('name')).toBe('none')
      expect(table.sort.direction('department')).toBe('none')
    })

    it('toggle non-sortable column is a no-op', () => {
      const table = createTable()
      table.sort.toggle('active')
      expect(table.sort.columns.value.length).toBe(0)
    })

    it('sorts items by column ascending', () => {
      const table = createTable()
      table.sort.toggle('name')
      const names = table.sortedItems.value.map(i => (i as User).name)
      expect(names).toEqual(['Alice', 'Bob', 'Carol', 'Dan', 'Eve'])
    })

    it('sorts items by column descending', () => {
      const table = createTable()
      table.sort.toggle('name')
      table.sort.toggle('name')
      const names = table.sortedItems.value.map(i => (i as User).name)
      expect(names).toEqual(['Eve', 'Dan', 'Carol', 'Bob', 'Alice'])
    })

    it('uses custom sort comparator', () => {
      const table = createTable()
      table.sort.toggle('salary')
      const salaries = table.sortedItems.value.map(i => (i as User).salary)
      expect(salaries).toEqual([85_000, 95_000, 105_000, 110_000, 120_000])
    })
  })

  describe('selection', () => {
    it('toggle/select/unselect', () => {
      const table = createTable()

      table.selection.select(1)
      expect(table.selection.isSelected(1)).toBe(true)

      table.selection.unselect(1)
      expect(table.selection.isSelected(1)).toBe(false)

      table.selection.toggle(1)
      expect(table.selection.isSelected(1)).toBe(true)

      table.selection.toggle(1)
      expect(table.selection.isSelected(1)).toBe(false)
    })

    it('single strategy clears before select', () => {
      const table = createTable({ selectStrategy: 'single' })

      table.selection.select(1)
      table.selection.select(2)

      expect(table.selection.isSelected(1)).toBe(false)
      expect(table.selection.isSelected(2)).toBe(true)
      expect(table.selection.selectedIds.size).toBe(1)
    })

    it('page strategy scope is visible items', () => {
      const table = createTable({
        selectStrategy: 'page',
        pagination: { itemsPerPage: 2 },
      })

      table.selection.selectAll()
      // Only the 2 visible items selected
      expect(table.selection.selectedIds.size).toBe(2)
    })

    it('all strategy scope is filtered items', () => {
      const table = createTable({ selectStrategy: 'all' })

      table.selection.selectAll()
      expect(table.selection.selectedIds.size).toBe(5)
    })

    it('itemSelectable disables rows', () => {
      const table = createTable({ itemSelectable: 'active' })

      // Carol (id 3) has active: false
      table.selection.select(3)
      expect(table.selection.isSelected(3)).toBe(false)
      expect(table.selection.isSelectable(3)).toBe(false)
      expect(table.selection.isSelectable(1)).toBe(true)
    })

    it('isAllSelected and isMixed', () => {
      const table = createTable({ selectStrategy: 'all' })

      expect(table.selection.isAllSelected.value).toBe(false)
      expect(table.selection.isMixed.value).toBe(false)

      table.selection.select(1)
      expect(table.selection.isAllSelected.value).toBe(false)
      expect(table.selection.isMixed.value).toBe(true)

      table.selection.selectAll()
      expect(table.selection.isAllSelected.value).toBe(true)
      expect(table.selection.isMixed.value).toBe(false)
    })

    it('toggleAll selects then unselects', () => {
      const table = createTable({ selectStrategy: 'all' })

      table.selection.toggleAll()
      expect(table.selection.isAllSelected.value).toBe(true)

      table.selection.toggleAll()
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('unselectAll clears all selections', () => {
      const table = createTable({ selectStrategy: 'all' })

      table.selection.selectAll()
      table.selection.unselectAll()
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('toggleAll is no-op for single strategy', () => {
      const table = createTable({ selectStrategy: 'single' })

      table.selection.toggleAll()
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('itemSelectable excludes from selectAll', () => {
      const table = createTable({
        selectStrategy: 'all',
        itemSelectable: 'active',
      })

      table.selection.selectAll()
      // Carol (id 3) has active: false, should be excluded
      expect(table.selection.isSelected(3)).toBe(false)
      expect(table.selection.selectedIds.size).toBe(4)
      expect(table.selection.isAllSelected.value).toBe(true)
    })
  })

  describe('expansion', () => {
    it('toggle/expand/collapse', () => {
      const table = createTable()

      table.expansion.expand(1)
      expect(table.expansion.isExpanded(1)).toBe(true)

      table.expansion.collapse(1)
      expect(table.expansion.isExpanded(1)).toBe(false)

      table.expansion.toggle(1)
      expect(table.expansion.isExpanded(1)).toBe(true)

      table.expansion.toggle(1)
      expect(table.expansion.isExpanded(1)).toBe(false)
    })

    it('expandMultiple false limits to single expansion', () => {
      const table = createTable({ expandMultiple: false })

      table.expansion.expand(1)
      table.expansion.expand(2)

      expect(table.expansion.isExpanded(1)).toBe(false)
      expect(table.expansion.isExpanded(2)).toBe(true)
    })

    it('expandAll expands all visible items', () => {
      const table = createTable()

      table.expansion.expandAll()
      expect(table.expansion.expandedIds.size).toBe(5)
    })

    it('collapseAll clears all expanded', () => {
      const table = createTable()

      table.expansion.expandAll()
      table.expansion.collapseAll()
      expect(table.expansion.expandedIds.size).toBe(0)
    })

    it('expandAll is no-op when expandMultiple is false', () => {
      const table = createTable({ expandMultiple: false })

      table.expansion.expandAll()
      expect(table.expansion.expandedIds.size).toBe(0)
    })
  })

  describe('grouping', () => {
    it('groups computed from groupBy column', () => {
      const table = createTable({ groupBy: 'department' })
      const groups = table.grouping.groups.value

      expect(groups.length).toBe(3)
      const keys = groups.map(g => g.key)
      expect(keys).toContain('Engineering')
      expect(keys).toContain('Design')
      expect(keys).toContain('Marketing')
    })

    it('group items contain correct members', () => {
      const table = createTable({ groupBy: 'department' })
      const eng = table.grouping.groups.value.find(g => g.key === 'Engineering')!

      expect(eng.items.length).toBe(2)
      expect(eng.value).toBe('Engineering')
    })

    it('toggle/open/close', () => {
      const table = createTable({ groupBy: 'department' })

      expect(table.grouping.isOpen('Engineering')).toBe(false)

      table.grouping.open('Engineering')
      expect(table.grouping.isOpen('Engineering')).toBe(true)

      table.grouping.close('Engineering')
      expect(table.grouping.isOpen('Engineering')).toBe(false)

      table.grouping.toggle('Engineering')
      expect(table.grouping.isOpen('Engineering')).toBe(true)

      table.grouping.toggle('Engineering')
      expect(table.grouping.isOpen('Engineering')).toBe(false)
    })

    it('openAll/closeAll', () => {
      const table = createTable({ groupBy: 'department' })

      table.grouping.openAll()
      expect(table.grouping.isOpen('Engineering')).toBe(true)
      expect(table.grouping.isOpen('Design')).toBe(true)
      expect(table.grouping.isOpen('Marketing')).toBe(true)

      table.grouping.closeAll()
      expect(table.grouping.isOpen('Engineering')).toBe(false)
      expect(table.grouping.isOpen('Design')).toBe(false)
      expect(table.grouping.isOpen('Marketing')).toBe(false)
    })

    it('enroll auto-opens groups', () => {
      const table = createTable({ groupBy: 'department', enroll: true })

      expect(table.grouping.isOpen('Engineering')).toBe(true)
      expect(table.grouping.isOpen('Design')).toBe(true)
      expect(table.grouping.isOpen('Marketing')).toBe(true)
    })

    it('no groupBy returns empty groups', () => {
      const table = createTable()
      expect(table.grouping.groups.value.length).toBe(0)
    })
  })

  describe('adapters', () => {
    describe('clientAdapter', () => {
      it('filter → sort → paginate pipeline', () => {
        const table = createTable({
          pagination: { itemsPerPage: 2 },
        })

        expect(table.allItems.value.length).toBe(5)
        expect(table.items.value.length).toBe(2)

        table.sort.toggle('name')
        expect((table.items.value[0] as User).name).toBe('Alice')
        expect((table.items.value[1] as User).name).toBe('Bob')
      })

      it('resets page on search change', async () => {
        const table = createTable({
          pagination: { itemsPerPage: 2 },
        })

        table.pagination.next()
        expect(table.pagination.page.value).toBe(2)

        table.search('alice')
        await nextTick()
        expect(table.pagination.page.value).toBe(1)
      })

      it('resets page on sort change', async () => {
        const table = createTable({
          pagination: { itemsPerPage: 2 },
        })

        table.pagination.next()
        expect(table.pagination.page.value).toBe(2)

        table.sort.toggle('name')
        await nextTick()
        expect(table.pagination.page.value).toBe(1)
      })

      it('custom column filter is invoked per column', () => {
        const table = createTable({
          columns: [
            {
              key: 'name',
              title: 'Name',
              filterable: true,
              filter: (value, query) => String(value).toLowerCase().startsWith(query),
            },
            { key: 'email', title: 'Email' },
            { key: 'department', title: 'Dept' },
            { key: 'salary', title: 'Salary' },
            { key: 'active', title: 'Status' },
          ],
        })

        // Query is lowercased by adapter; custom filter receives ('Alice', 'al')
        table.search('Al')
        const names = table.filteredItems.value.map(i => (i as User).name)
        expect(names).toEqual(['Alice'])
      })
    })

    describe('serverAdapter', () => {
      it('items pass through unchanged', () => {
        const table = createTable({
          adapter: new ServerAdapter<User>({ total: 100 }),
        })

        expect(table.items.value.length).toBe(5)
        expect(table.allItems.value.length).toBe(5)
      })

      it('total/loading/error from options', () => {
        const table = createTable({
          adapter: new ServerAdapter<User>({
            total: 100,
            loading: true,
            error: new Error('fail'),
          }),
        })

        expect(table.total.value).toBe(100)
        expect(table.loading.value).toBe(true)
        expect(table.error.value).toBeInstanceOf(Error)
      })

      it('reactive total/loading/error', () => {
        const total = ref(100)
        const loading = ref(false)

        const table = createTable({
          adapter: new ServerAdapter<User>({ total, loading }),
        })

        expect(table.total.value).toBe(100)
        expect(table.loading.value).toBe(false)

        total.value = 200
        loading.value = true
        expect(table.total.value).toBe(200)
        expect(table.loading.value).toBe(true)
      })

      it('resets page on search change', async () => {
        const table = createTable({
          adapter: new ServerAdapter<User>({ total: 100 }),
          pagination: { itemsPerPage: 10 },
        })

        table.pagination.next()
        expect(table.pagination.page.value).toBe(2)

        table.search('test')
        await nextTick()
        expect(table.pagination.page.value).toBe(1)
      })
    })

    describe('virtualAdapter', () => {
      it('filter → sort, no pagination slice', () => {
        const table = createTable({
          adapter: new VirtualAdapter<User>(),
        })

        expect(table.items.value.length).toBe(5)
        expect(table.sortedItems.value.length).toBe(5)
      })

      it('all sorted items returned as items', () => {
        const table = createTable({
          adapter: new VirtualAdapter<User>(),
        })

        table.sort.toggle('name')
        // items === sortedItems for virtual
        expect(table.items.value).toEqual(table.sortedItems.value)
      })

      it('filters items client-side', () => {
        const table = createTable({
          adapter: new VirtualAdapter<User>(),
        })

        table.search('alice')
        expect(table.items.value.length).toBe(1)
      })
    })
  })

  describe('edge cases', () => {
    it('itemValue defaults to id', () => {
      const table = createTable()
      table.selection.select(1)
      expect(table.selection.isSelected(1)).toBe(true)
    })

    it('rowId throws on non-string/number itemValue', () => {
      type BadItem = { id: number, data: object }
      const table = createDataTable<BadItem>({
        items: [{ id: 1, data: { foo: 'bar' } }],
        columns: [{ key: 'id', title: 'ID' }],
        itemValue: 'data' as never,
        selectStrategy: 'all',
      })

      // rowId is called internally when selectAll iterates items
      expect(() => table.selection.selectAll()).toThrow('[v0:data-table]')
    })

    it('reactive items source updates pipeline', () => {
      const items = ref([...users])
      const table = createTable({ items })

      expect(table.allItems.value.length).toBe(5)

      items.value = [...users, { id: 6, name: 'Frank', email: 'frank@test.com', department: 'Sales', salary: 90_000, active: true }]
      expect(table.allItems.value.length).toBe(6)
    })

    it('columns are accessible on context', () => {
      const table = createTable()
      expect(table.columns.length).toBe(5)
      expect(table.columns[0]!.key).toBe('name')
    })

    it('loading defaults to false', () => {
      const table = createTable()
      expect(table.loading.value).toBe(false)
    })

    it('error defaults to null', () => {
      const table = createTable()
      expect(table.error.value).toBeNull()
    })

    it('total reflects filtered/sorted item count', () => {
      const table = createTable()
      expect(table.total.value).toBe(5)

      table.search('alice')
      expect(table.total.value).toBe(1)
    })
  })
})

describe('createDataTableContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns trinity tuple', () => {
    const trinity = createDataTableContext({
      items: users,
      columns,
    })

    expect(trinity).toHaveLength(3)
    const [use, prov, ctx] = trinity
    expect(typeof use).toBe('function')
    expect(typeof prov).toBe('function')
    expect(ctx).toBeDefined()
    expect(ctx.items).toBeDefined()
    expect(ctx.sort).toBeDefined()
  })

  it('provideDataTable calls Vue provide', () => {
    const [, provideDataTable, context] = createDataTableContext({
      items: users,
      columns,
    })

    provideDataTable()
    expect(mockProvide).toHaveBeenCalledWith('v0:data-table', context)
  })

  it('useDataTable calls Vue inject', () => {
    const fakeContext = { items: ref([]) }
    mockInject.mockReturnValue(fakeContext)

    const result = useDataTable()
    expect(mockInject).toHaveBeenCalledWith('v0:data-table', undefined)
    expect(result).toBe(fakeContext)
  })

  it('custom namespace', () => {
    const [, provideDataTable, context] = createDataTableContext({
      namespace: 'custom:table',
      items: users,
      columns,
    })

    provideDataTable()
    expect(mockProvide).toHaveBeenCalledWith('custom:table', context)
  })
})

describe('useDataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useDataTable()).toThrow(
      'Context "v0:data-table" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
