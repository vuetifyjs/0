import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, nextTick, provide, ref } from 'vue'

// Types
import type { DataTableColumn, DataTableOptions } from './index'

import { createDataTable, createDataTableContext, useDataTable, ServerDataTableAdapter, VirtualDataTableAdapter } from './index'

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
    it('should update query ref', () => {
      const table = createTable()
      expect(table.query.value).toBe('')
      table.search('alice')
      expect(table.query.value).toBe('alice')
    })

    it('should filter items by search query', () => {
      const table = createTable()
      table.search('alice')
      expect(table.filteredItems.value.length).toBe(1)
      expect((table.filteredItems.value[0] as User).name).toBe('Alice')
    })

    it('should clear filter when search is empty', () => {
      const table = createTable()
      table.search('alice')
      expect(table.filteredItems.value.length).toBe(1)
      table.search('')
      expect(table.filteredItems.value.length).toBe(5)
    })
  })

  describe('sort', () => {
    it('should cycle none → asc → desc → none', () => {
      const table = createTable()
      expect(table.sort.direction('name')).toBe('none')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('none')
    })

    it('should reverse cycle when firstSortOrder is desc', () => {
      const table = createTable({ firstSortOrder: 'desc' })

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('none')
    })

    it('should prevent clearing sort under mandate', () => {
      const table = createTable({ mandate: true })

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')

      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')
    })

    it('should allow multi-column sort via sortMultiple', () => {
      const table = createTable({ sortMultiple: true })

      table.sort.toggle('name')
      table.sort.toggle('department')

      expect(table.sort.columns.value).toEqual([
        { key: 'name', direction: 'asc' },
        { key: 'department', direction: 'asc' },
      ])
    })

    it('should clear previous column on single sort', () => {
      const table = createTable()

      table.sort.toggle('name')
      table.sort.toggle('department')

      expect(table.sort.columns.value.length).toBe(1)
      expect(table.sort.columns.value[0]!.key).toBe('department')
    })

    it('should return current sort direction from direction()', () => {
      const table = createTable()
      expect(table.sort.direction('name')).toBe('none')
      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')
    })

    it('should return sort order index from priority()', () => {
      const table = createTable({ sortMultiple: true })

      table.sort.toggle('name')
      table.sort.toggle('department')

      expect(table.sort.priority('name')).toBe(0)
      expect(table.sort.priority('department')).toBe(1)
      expect(table.sort.priority('email')).toBe(-1)
    })

    it('should clear all sort state via reset()', () => {
      const table = createTable({ sortMultiple: true })

      table.sort.toggle('name')
      table.sort.toggle('department')
      table.sort.reset()

      expect(table.sort.columns.value.length).toBe(0)
      expect(table.sort.direction('name')).toBe('none')
      expect(table.sort.direction('department')).toBe('none')
    })

    it('should treat toggle on non-sortable column as a no-op', () => {
      const table = createTable()
      table.sort.toggle('active')
      expect(table.sort.columns.value.length).toBe(0)
    })

    it('should sort null and undefined values consistently', () => {
      const items = [
        { id: 1, name: null, email: '', department: '', salary: 0, active: true },
        { id: 2, name: 'Bob', email: '', department: '', salary: 0, active: true },
        { id: 3, name: undefined, email: '', department: '', salary: 0, active: true },
        { id: 4, name: 'Alice', email: '', department: '', salary: 0, active: true },
      ] as unknown as User[]

      const table = createTable({ items })
      table.sort.toggle('name')
      const names = table.sortedItems.value.map(i => (i as User).name)
      // Non-null values sorted first, null/undefined grouped at end
      expect(names).toEqual(['Alice', 'Bob', null, undefined])
    })

    it('should sort items by column ascending', () => {
      const table = createTable()
      table.sort.toggle('name')
      const names = table.sortedItems.value.map(i => (i as User).name)
      expect(names).toEqual(['Alice', 'Bob', 'Carol', 'Dan', 'Eve'])
    })

    it('should sort items by column descending', () => {
      const table = createTable()
      table.sort.toggle('name')
      table.sort.toggle('name')
      const names = table.sortedItems.value.map(i => (i as User).name)
      expect(names).toEqual(['Eve', 'Dan', 'Carol', 'Bob', 'Alice'])
    })

    it('should use custom sort comparator', () => {
      const table = createTable()
      table.sort.toggle('salary')
      const salaries = table.sortedItems.value.map(i => (i as User).salary)
      expect(salaries).toEqual([85_000, 95_000, 105_000, 110_000, 120_000])
    })
  })

  describe('selection', () => {
    it('should expose toggle/select/unselect', () => {
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

    it('should clear before select with single strategy', () => {
      const table = createTable({ selectStrategy: 'single' })

      table.selection.select(1)
      table.selection.select(2)

      expect(table.selection.isSelected(1)).toBe(false)
      expect(table.selection.isSelected(2)).toBe(true)
      expect(table.selection.selectedIds.size).toBe(1)
    })

    it('should scope page strategy to visible items', () => {
      const table = createTable({
        selectStrategy: 'page',
        pagination: { itemsPerPage: 2 },
      })

      table.selection.selectAll()
      // Only the 2 visible items selected
      expect(table.selection.selectedIds.size).toBe(2)
    })

    it('should treat single-strategy selectAll as a no-op', () => {
      const table = createTable({ selectStrategy: 'single' })

      table.selection.selectAll()
      // Single mode → scopeItems is empty array → no items get selected
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('should scope all-strategy to filtered items', () => {
      const table = createTable({ selectStrategy: 'all' })

      table.selection.selectAll()
      expect(table.selection.selectedIds.size).toBe(5)
    })

    it('should disable rows via itemSelectable', () => {
      const table = createTable({ itemSelectable: 'active' })

      // Carol (id 3) has active: false
      table.selection.select(3)
      expect(table.selection.isSelected(3)).toBe(false)
      expect(table.selection.isSelectable(3)).toBe(false)
      expect(table.selection.isSelectable(1)).toBe(true)
    })

    it('should expose isAllSelected and isMixed', () => {
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

    it('should select then unselect via toggleAll', () => {
      const table = createTable({ selectStrategy: 'all' })

      table.selection.toggleAll()
      expect(table.selection.isAllSelected.value).toBe(true)

      table.selection.toggleAll()
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('should clear all selections via unselectAll', () => {
      const table = createTable({ selectStrategy: 'all' })

      table.selection.selectAll()
      table.selection.unselectAll()
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('should be no-op for toggleAll under single strategy', () => {
      const table = createTable({ selectStrategy: 'single' })

      table.selection.toggleAll()
      expect(table.selection.selectedIds.size).toBe(0)
    })

    it('should exclude from selectAll via itemSelectable', () => {
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
    it('should expose toggle/expand/collapse', () => {
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

    it('should limit to single expansion when expandMultiple is false', () => {
      const table = createTable({ expandMultiple: false })

      table.expansion.expand(1)
      table.expansion.expand(2)

      expect(table.expansion.isExpanded(1)).toBe(false)
      expect(table.expansion.isExpanded(2)).toBe(true)
    })

    it('should expand all visible items via expandAll', () => {
      const table = createTable()

      table.expansion.expandAll()
      expect(table.expansion.expandedIds.size).toBe(5)
    })

    it('should clear all expanded via collapseAll', () => {
      const table = createTable()

      table.expansion.expandAll()
      table.expansion.collapseAll()
      expect(table.expansion.expandedIds.size).toBe(0)
    })

    it('should be no-op for expandAll when expandMultiple is false', () => {
      const table = createTable({ expandMultiple: false })

      table.expansion.expandAll()
      expect(table.expansion.expandedIds.size).toBe(0)
    })
  })

  describe('grouping', () => {
    it('should compute groups from groupBy column', () => {
      const table = createTable({ groupBy: 'department' })
      const groups = table.grouping.groups.value

      expect(groups.length).toBe(3)
      const keys = groups.map(g => g.key)
      expect(keys).toContain('Engineering')
      expect(keys).toContain('Design')
      expect(keys).toContain('Marketing')
    })

    it('should put correct members in group items', () => {
      const table = createTable({ groupBy: 'department' })
      const eng = table.grouping.groups.value.find(g => g.key === 'Engineering')!

      expect(eng.items.length).toBe(2)
      expect(eng.value).toBe('Engineering')
    })

    it('should expose toggle/open/close', () => {
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

    it('should expose openAll/closeAll', () => {
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

    it('should auto-open groups via openAll', () => {
      const table = createTable({ groupBy: 'department', openAll: true })

      expect(table.grouping.isOpen('Engineering')).toBe(true)
      expect(table.grouping.isOpen('Design')).toBe(true)
      expect(table.grouping.isOpen('Marketing')).toBe(true)
    })

    it('should return empty groups when no groupBy', () => {
      const table = createTable()
      expect(table.grouping.groups.value.length).toBe(0)
    })
  })

  describe('adapters', () => {
    describe('clientAdapter', () => {
      it('should run filter → sort → paginate pipeline', () => {
        const table = createTable({
          pagination: { itemsPerPage: 2 },
        })

        expect(table.allItems.value.length).toBe(5)
        expect(table.items.value.length).toBe(2)

        table.sort.toggle('name')
        expect((table.items.value[0] as User).name).toBe('Alice')
        expect((table.items.value[1] as User).name).toBe('Bob')
      })

      it('should reset page on search change', async () => {
        const table = createTable({
          pagination: { itemsPerPage: 2 },
        })

        table.pagination.next()
        expect(table.pagination.page.value).toBe(2)

        table.search('alice')
        await nextTick()
        expect(table.pagination.page.value).toBe(1)
      })

      it('should reset page on sort change', async () => {
        const table = createTable({
          pagination: { itemsPerPage: 2 },
        })

        table.pagination.next()
        expect(table.pagination.page.value).toBe(2)

        table.sort.toggle('name')
        await nextTick()
        expect(table.pagination.page.value).toBe(1)
      })

      it('should invoke custom column filter per column', () => {
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
      it('should pass items through unchanged', () => {
        const table = createTable({
          adapter: new ServerDataTableAdapter<User>({ total: 100 }),
        })

        expect(table.items.value.length).toBe(5)
        expect(table.allItems.value.length).toBe(5)
      })

      it('should default loading=false and error=null when omitted', () => {
        const table = createTable({
          adapter: new ServerDataTableAdapter<User>({ total: 100 }),
        })

        expect(table.loading.value).toBe(false)
        expect(table.error.value).toBeNull()
      })

      it('should derive total/loading/error from options', () => {
        const table = createTable({
          adapter: new ServerDataTableAdapter<User>({
            total: 100,
            loading: true,
            error: new Error('fail'),
          }),
        })

        expect(table.total.value).toBe(100)
        expect(table.loading.value).toBe(true)
        expect(table.error.value).toBeInstanceOf(Error)
      })

      it('should expose reactive total/loading/error', () => {
        const total = ref(100)
        const loading = ref(false)

        const table = createTable({
          adapter: new ServerDataTableAdapter<User>({ total, loading }),
        })

        expect(table.total.value).toBe(100)
        expect(table.loading.value).toBe(false)

        total.value = 200
        loading.value = true
        expect(table.total.value).toBe(200)
        expect(table.loading.value).toBe(true)
      })

      it('should reset page on search change', async () => {
        const table = createTable({
          adapter: new ServerDataTableAdapter<User>({ total: 100 }),
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
      it('should run filter → sort with no pagination slice', () => {
        const table = createTable({
          adapter: new VirtualDataTableAdapter<User>(),
        })

        expect(table.items.value.length).toBe(5)
        expect(table.sortedItems.value.length).toBe(5)
      })

      it('should return all sorted items as items', () => {
        const table = createTable({
          adapter: new VirtualDataTableAdapter<User>(),
        })

        table.sort.toggle('name')
        // items === sortedItems for virtual
        expect(table.items.value).toEqual(table.sortedItems.value)
      })

      it('should filter items client-side', () => {
        const table = createTable({
          adapter: new VirtualDataTableAdapter<User>(),
        })

        table.search('alice')
        expect(table.items.value.length).toBe(1)
      })
    })
  })

  describe('openAll with async items', () => {
    it('should auto-open groups when items arrive', async () => {
      const items = ref<User[]>([])
      const table = createTable({ items, groupBy: 'department', openAll: true })
      expect(table.grouping.groups.value.length).toBe(0)
      items.value = [...users]
      await nextTick()
      expect(table.grouping.groups.value.length).toBe(3)
      expect(table.grouping.isOpen('Engineering')).toBe(true)
      expect(table.grouping.isOpen('Design')).toBe(true)
    })

    it('should ignore empty watcher updates before items arrive', async () => {
      const items = ref<User[]>([])
      const table = createTable({ items, groupBy: 'department', openAll: true })

      // Trigger watch with still-empty items (should be no-op via line 581)
      items.value = []
      await nextTick()
      expect(table.grouping.groups.value.length).toBe(0)

      // Now provide actual items
      items.value = [...users]
      await nextTick()
      expect(table.grouping.groups.value.length).toBe(3)
      expect(table.grouping.isOpen('Engineering')).toBe(true)
    })
  })

  describe('locale resolution', () => {
    it('should use initialLocale when no locale plugin is available', () => {
      const table = createTable({ locale: 'de-DE' })

      // The locale should be used by the adapter for sorting
      // Verify the table works with the provided locale
      table.sort.toggle('name')
      expect(table.sortedItems.value.length).toBe(5)
    })
  })

  describe('mandate with firstSortOrder desc', () => {
    it('should cycle desc then asc then desc with mandate', () => {
      const table = createTable({ mandate: true, firstSortOrder: 'desc' })
      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')
      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('asc')
      table.sort.toggle('name')
      expect(table.sort.direction('name')).toBe('desc')
    })
  })

  describe('selection with empty selectable scope', () => {
    it('should handle isAllSelected and isMixed with no selectable items', () => {
      const table = createTable({
        selectStrategy: 'all',
        items: [{ id: 1, name: 'Alice', email: 'a@t.com', department: 'Eng', salary: 100_000, active: false }],
        itemSelectable: 'active',
      })
      expect(table.selection.isAllSelected.value).toBe(false)
      expect(table.selection.isMixed.value).toBe(false)
    })
  })

  describe('recursive columns', () => {
    it('should use leaf columns for the data pipeline', () => {
      const table = createDataTable({
        items: [
          { id: 1, name: 'Alice', email: 'a@b.com', phone: '555' },
          { id: 2, name: 'Bob', email: 'b@b.com', phone: '666' },
        ],
        columns: [
          { key: 'name', title: 'Name', sortable: true, filterable: true },
          {
            key: 'contact',
            title: 'Contact',
            children: [
              { key: 'email', title: 'Email', filterable: true },
              { key: 'phone', title: 'Phone' },
            ],
          },
        ],
      })

      expect(table.leaves).toHaveLength(3)
      expect(table.leaves.map(c => c.key)).toEqual(['name', 'email', 'phone'])

      table.search('a@b')
      expect(table.items.value).toHaveLength(1)
      expect(table.items.value[0]!.name).toBe('Alice')
    })

    it('should expose resolved 2D headers', () => {
      const table = createDataTable({
        items: [],
        columns: [
          { key: 'name', title: 'Name' },
          {
            key: 'contact',
            title: 'Contact',
            children: [
              { key: 'email', title: 'Email' },
              { key: 'phone', title: 'Phone' },
            ],
          },
        ],
      })

      expect(table.headers.value).toHaveLength(2)
      expect(table.headers.value[0]).toHaveLength(2)
      expect(table.headers.value[1]).toHaveLength(2)
      expect(table.headers.value[0]![0]!.rowspan).toBe(2)
      expect(table.headers.value[0]![1]!.colspan).toBe(2)
    })

    it('should produce single header row for flat columns', () => {
      const table = createDataTable({
        items: [],
        columns: [
          { key: 'name', title: 'Name' },
          { key: 'email', title: 'Email' },
        ],
      })

      expect(table.headers.value).toHaveLength(1)
      expect(table.headers.value[0]).toHaveLength(2)
    })
  })

  describe('edge cases', () => {
    it('should default itemValue to id', () => {
      const table = createTable()
      table.selection.select(1)
      expect(table.selection.isSelected(1)).toBe(true)
    })

    it('should throw from rowId on non-string/number itemValue', () => {
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

    it('should update pipeline when reactive items source changes', () => {
      const items = ref([...users])
      const table = createTable({ items })

      expect(table.allItems.value.length).toBe(5)

      items.value = [...users, { id: 6, name: 'Frank', email: 'frank@test.com', department: 'Sales', salary: 90_000, active: true }]
      expect(table.allItems.value.length).toBe(6)
    })

    it('should make columns accessible on context', () => {
      const table = createTable()
      expect(table.columns.length).toBe(5)
      expect(table.columns[0]!.key).toBe('name')
    })

    it('should default loading to false', () => {
      const table = createTable()
      expect(table.loading.value).toBe(false)
    })

    it('should default error to null', () => {
      const table = createTable()
      expect(table.error.value).toBeNull()
    })

    it('should reflect filtered/sorted item count in total', () => {
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

  it('should return trinity tuple', () => {
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

  it('should call Vue provide from provideDataTable', () => {
    const [, provideDataTable, context] = createDataTableContext({
      items: users,
      columns,
    })

    provideDataTable()
    expect(mockProvide).toHaveBeenCalledWith('v0:data-table', context)
  })

  it('should call Vue inject from useDataTable', () => {
    const fakeContext = { items: ref([]) }
    mockInject.mockReturnValue(fakeContext)

    const result = useDataTable()
    expect(mockInject).toHaveBeenCalledWith('v0:data-table', undefined)
    expect(result).toBe(fakeContext)
  })

  it('should support custom namespace', () => {
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
