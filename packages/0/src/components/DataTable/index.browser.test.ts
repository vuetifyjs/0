import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { DataTable } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const testUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' },
  { id: 3, name: 'Carol', email: 'carol@test.com' },
]

const testColumns = [
  { id: 'name', title: 'Name', sortable: true },
  { id: 'email', title: 'Email', filterable: true },
]

describe('data-table', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render children in default slot', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h('div', { class: 'test-child' }, 'Child content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.find('.test-child').text()).toBe('Child content')
      })

      it('should expose context in slot props', () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(slotProps.context).toBeDefined()
        expect(typeof slotProps.context.columns).toBe('object')
        expect(typeof slotProps.context.onboard).toBe('function')
        expect(typeof slotProps.context.search).toBe('function')
        expect(typeof slotProps.context.sort).toBe('object')
        expect(typeof slotProps.context.pagination).toBe('object')
        expect(typeof slotProps.context.selection).toBe('object')
        expect(typeof slotProps.context.expansion).toBe('object')
      })
    })

    describe('context provision', () => {
      it('should provide context with default namespace', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.exists()).toBe(true)
      })

      it('should provide context with custom namespace', () => {
        const wrapper = mount(DataTable.Root, {
          props: {
            namespace: 'v0:custom-table',
          },
          slots: {
            default: () => h(DataTable.Table, { namespace: 'v0:custom-table' }),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.exists()).toBe(true)
      })
    })
  })

  describe('table', () => {
    describe('rendering', () => {
      it('should render as table by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.element.tagName).toBe('TABLE')
      })

      it('should have role="table" attribute', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.attributes('role')).toBe('table')
      })

      it('should have aria-rowcount attribute', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.attributes('aria-rowcount')).toBeDefined()
      })
    })
  })

  describe('head', () => {
    describe('rendering', () => {
      it('should render as thead by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () => h(DataTable.Head)),
          },
        })

        const head = wrapper.findComponent(DataTable.Head as any)
        expect(head.element.tagName).toBe('THEAD')
      })

      it('should expose headers in slot props', () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Head, {}, {
                default: (props: any) => {
                  slotProps = props
                  return h('tr')
                },
              }),
            ),
          },
        })

        expect(slotProps).toBeDefined()
        expect(Array.isArray(slotProps.headers)).toBe(true)
      })
    })
  })

  describe('header-row', () => {
    describe('rendering', () => {
      it('should render as tr by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Head, {}, () => h(DataTable.HeaderRow)),
            ),
          },
        })

        const headerRow = wrapper.findComponent(DataTable.HeaderRow as any)
        expect(headerRow.element.tagName).toBe('TR')
      })
    })
  })

  describe('header-cell', () => {
    describe('rendering', () => {
      it('should render as th by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Head, {}, () =>
                h(DataTable.HeaderRow, {}, () => h(DataTable.HeaderCell)),
              ),
            ),
          },
        })

        const headerCell = wrapper.findComponent(DataTable.HeaderCell as any)
        expect(headerCell.element.tagName).toBe('TH')
      })

      it('should have role="columnheader" attribute', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Head, {}, () =>
                h(DataTable.HeaderRow, {}, () => h(DataTable.HeaderCell)),
              ),
            ),
          },
        })

        const headerCell = wrapper.findComponent(DataTable.HeaderCell as any)
        expect(headerCell.attributes('role')).toBe('columnheader')
        expect(headerCell.attributes('scope')).toBe('col')
      })

      it('should expose sort state when column-id is provided', async () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Head, {}, () =>
                  h(DataTable.HeaderRow, {}, () =>
                    h(DataTable.HeaderCell, { columnId: 'name' }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('span', 'Name')
                      },
                    }),
                  ),
                ),
              )
            },
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(slotProps.isSortable).toBe(true)
        expect(slotProps.sortDirection).toBe('none')
        expect(slotProps.sortPriority).toBe(-1)
        expect(typeof slotProps.toggleSort).toBe('function')
      })

      it('should toggle sort when toggleSort is called', async () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Head, {}, () =>
                  h(DataTable.HeaderRow, {}, () =>
                    h(DataTable.HeaderCell, { columnId: 'name' }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('span', 'Name')
                      },
                    }),
                  ),
                ),
              )
            },
          },
        })

        await nextTick()
        expect(slotProps.sortDirection).toBe('none')

        slotProps.toggleSort()
        await nextTick()
        expect(slotProps.sortDirection).toBe('asc')

        slotProps.toggleSort()
        await nextTick()
        expect(slotProps.sortDirection).toBe('desc')
      })

      it('should have aria-sort attribute when sortable', async () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Head, {}, () =>
                  h(DataTable.HeaderRow, {}, () =>
                    h(DataTable.HeaderCell, { columnId: 'name' }, () => 'Name'),
                  ),
                ),
              )
            },
          },
        })

        await nextTick()

        const headerCell = wrapper.findComponent(DataTable.HeaderCell as any)
        expect(headerCell.attributes('aria-sort')).toBe('none')
      })
    })
  })

  describe('body', () => {
    describe('rendering', () => {
      it('should render as tbody by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () => h(DataTable.Body)),
          },
        })

        const body = wrapper.findComponent(DataTable.Body as any)
        expect(body.element.tagName).toBe('TBODY')
      })

      it('should expose items in slot props', async () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('tr')
                  },
                }),
              )
            },
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(Array.isArray(slotProps.items)).toBe(true)
        expect(slotProps.items).toHaveLength(3)
        expect(slotProps.isEmpty).toBe(false)
      })

      it('should set isEmpty when no items', () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, {
                default: (props: any) => {
                  slotProps = props
                  return h('tr')
                },
              }),
            ),
          },
        })

        expect(slotProps.isEmpty).toBe(true)
      })
    })
  })

  describe('row', () => {
    describe('rendering', () => {
      it('should render as tr by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () => h(DataTable.Row)),
            ),
          },
        })

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.element.tagName).toBe('TR')
      })

      it('should have role="row" attribute', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () => h(DataTable.Row)),
            ),
          },
        })

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('role')).toBe('row')
      })

      it('should expose selection state when row-id is provided', async () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body, {}, () =>
                  h(DataTable.Row, { rowId: 1 }, {
                    default: (props: any) => {
                      slotProps = props
                      return h('td')
                    },
                  }),
                ),
              )
            },
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(slotProps.isSelected).toBe(false)
        expect(slotProps.isSelectable).toBe(true)
        expect(slotProps.isExpanded).toBe(false)
        expect(typeof slotProps.toggleSelection).toBe('function')
        expect(typeof slotProps.toggleExpansion).toBe('function')
      })

      it('should toggle selection when toggleSelection is called', async () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body, {}, () =>
                  h(DataTable.Row, { rowId: 1 }, {
                    default: (props: any) => {
                      slotProps = props
                      return h('td')
                    },
                  }),
                ),
              )
            },
          },
        })

        await nextTick()
        expect(slotProps.isSelected).toBe(false)

        slotProps.toggleSelection()
        await nextTick()
        expect(slotProps.isSelected).toBe(true)

        slotProps.toggleSelection()
        await nextTick()
        expect(slotProps.isSelected).toBe(false)
      })

      it('should have aria-selected attribute when row-id is provided', async () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body, {}, () =>
                  h(DataTable.Row, { rowId: 1 }),
                ),
              )
            },
          },
        })

        await nextTick()

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('aria-selected')).toBe('false')
      })
    })
  })

  describe('cell', () => {
    describe('rendering', () => {
      it('should render as td by default', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () =>
                h(DataTable.Row, {}, () => h(DataTable.Cell)),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.element.tagName).toBe('TD')
      })

      it('should have role="cell" attribute', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () =>
                h(DataTable.Row, {}, () => h(DataTable.Cell)),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.attributes('role')).toBe('cell')
      })

      it('should support colspan attribute', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () =>
                h(DataTable.Row, {}, () => h(DataTable.Cell, { colspan: 3 })),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.attributes('colspan')).toBe('3')
      })
    })
  })

  describe('empty', () => {
    describe('rendering', () => {
      it('should render when items is empty', () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () => h(DataTable.Empty, {}, () => 'No data')),
            ),
          },
        })

        const empty = wrapper.findComponent(DataTable.Empty as any)
        expect(empty.exists()).toBe(true)
        expect(empty.text()).toBe('No data')
      })

      it('should not render when items exist', async () => {
        const wrapper = mount(DataTable.Root, {
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body, {}, () => h(DataTable.Empty, {}, () => 'No data')),
              )
            },
          },
        })

        await nextTick()

        // Component instance exists but renders nothing when items exist
        expect(wrapper.text()).not.toContain('No data')
      })

      it('should expose isLoading in slot props', () => {
        let slotProps: any

        mount(DataTable.Root, {
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body, {}, () =>
                h(DataTable.Empty, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('span', 'No data')
                  },
                }),
              ),
            ),
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isLoading).toBe('boolean')
      })
    })
  })

  describe('integration', () => {
    it('should work as complete table with data', async () => {
      const wrapper = mount(DataTable.Root, {
        slots: {
          default: ({ context }: any) => {
            context.columns.onboard(testColumns)
            context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
            return h(DataTable.Table, {}, () => [
              h(DataTable.Head, {}, () =>
                h(DataTable.HeaderRow, {}, () =>
                  testColumns.map(col =>
                    h(DataTable.HeaderCell, { key: col.id, columnId: col.id }, () => col.title),
                  ),
                ),
              ),
              h(DataTable.Body, {}, {
                default: ({ items }: any) =>
                  items.map((item: User) =>
                    h(DataTable.Row, { key: item.id, rowId: item.id }, () => [
                      h(DataTable.Cell, { key: 'name' }, () => item.name),
                      h(DataTable.Cell, { key: 'email' }, () => item.email),
                    ]),
                  ),
              }),
            ])
          },
        },
      })

      await nextTick()

      expect(wrapper.findComponent(DataTable.Table as any).exists()).toBe(true)
      expect(wrapper.findComponent(DataTable.Head as any).exists()).toBe(true)
      expect(wrapper.findComponent(DataTable.Body as any).exists()).toBe(true)

      const rows = wrapper.findAllComponents(DataTable.Row as any)
      expect(rows).toHaveLength(3)

      const cells = wrapper.findAllComponents(DataTable.Cell as any)
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(DataTable.Root as any, {}, () =>
            h(DataTable.Table as any, {}, () => [
              h(DataTable.Head as any, {}, () =>
                h(DataTable.HeaderRow as any, {}, () =>
                  h(DataTable.HeaderCell as any, {}, () => 'Name'),
                ),
              ),
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Cell as any, {}, () => 'Alice'),
                ),
              ),
            ]),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('<table')
      expect(html).toContain('<thead')
      expect(html).toContain('<tbody')
      expect(html).toContain('Name')
      expect(html).toContain('Alice')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(DataTable.Root as any, {}, () =>
            h(DataTable.Table as any, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Cell as any, {}, () => 'Test'),
                ),
              ),
            ),
          ),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      expect(wrapper.findComponent(DataTable.Table as any).exists()).toBe(true)
      expect(wrapper.findComponent(DataTable.Cell as any).text()).toBe('Test')

      wrapper.unmount()
    })
  })
})
