import { describe, expect, it, vi } from 'vitest'

import { DataGrid } from './index'

// Utilities
import { isUndefined } from '#v0/utilities'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

function mountRoot (
  slot: (props: any) => any,
  rootProps: Record<string, unknown> = {},
  columns?: Record<string, unknown>[],
) {
  let context: any
  const wrapper = mount(DataGrid.Root, {
    props: rootProps,
    slots: {
      default: (props: any) => {
        context = props.context
        if (columns && context.columns.size === 0) {
          context.columns.onboard(columns)
        }
        return slot(props)
      },
    },
  })
  return { wrapper, get context () {
    return context
  } }
}

const resizableColumns = [
  { id: 'name', size: 50, minSize: 10, maxSize: 90, resizable: true },
  { id: 'email', size: 50, minSize: 10, maxSize: 90, resizable: true },
]

describe('dataGrid', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as renderless by default (context provider only)', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h('div', { class: 'content' }, 'Content'),
          },
        })

        expect(wrapper.find('.content').exists()).toBe(true)
        expect(wrapper.find('.content').text()).toBe('Content')
      })

      it('should provide context to descendants', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.exists()).toBe(true)
      })

      it('should expose context via slot props', () => {
        let slotProps: any

        mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(slotProps.context).toBeDefined()
        expect(typeof slotProps.context.onboard).toBe('function')
        expect(typeof slotProps.context.register).toBe('function')
        expect(typeof slotProps.context.rank).toBe('function')
      })

      it('should filter through v-model:search', async () => {
        const users = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ]
        let slotProps: any

        const Host = defineComponent({
          data: () => ({ query: '' }),
          render () {
            return h(DataGrid.Root as any, {
              'search': this.query,
              'onUpdate:search': (value: string) => {
                this.query = value
              },
            }, () =>
              h(DataGrid.Table, {}, () => [
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Column, { id: 'name', filterable: true }),
                  ),
                ),
                h(DataGrid.Body as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return users.map(user =>
                      h(DataGrid.Row, { key: user.id, id: user.id, value: user }),
                    )
                  },
                }),
              ]),
            )
          },
        })

        const wrapper = mount(Host)
        await nextTick()
        expect(slotProps.items).toHaveLength(2)

        wrapper.setData({ query: 'alice' })
        await nextTick()
        expect(slotProps.items.map((item: { name: string }) => item.name)).toEqual(['Alice'])
      })

      it('should update the parent search model when context.search is called', async () => {
        let context: any

        const Host = defineComponent({
          data: () => ({ query: '' }),
          render () {
            return h(DataGrid.Root as any, {
              'search': this.query,
              'onUpdate:search': (value: string) => {
                this.query = value
              },
            }, {
              default: (props: any) => {
                context = props.context
                return h('div')
              },
            })
          },
        })

        const wrapper = mount(Host)
        await nextTick()

        context.search('x')
        await nextTick()
        expect(wrapper.vm.query).toBe('x')
      })
    })

    describe('context provision', () => {
      it('should provide context with default namespace', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.exists()).toBe(true)
      })

      it('should provide context with custom namespace', () => {
        const wrapper = mount(DataGrid.Root, {
          props: {
            namespace: 'v0:custom-grid',
          },
          slots: {
            default: () => h(DataGrid.Table, { namespace: 'v0:custom-grid' }),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.exists()).toBe(true)
      })
    })
  })

  describe('table', () => {
    describe('rendering', () => {
      it('should render as table by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.element.tagName).toBe('TABLE')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, { as: 'div' }),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.element.tagName).toBe('DIV')
      })

      it('should set role=table attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.attributes('role')).toBe('table')
      })

      it('should omit aria-rowcount when the full table is in the DOM', async () => {
        const empty = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table),
          },
        })

        expect(empty.findComponent(DataGrid.Table as any).attributes('aria-rowcount')).toBeUndefined()

        const users = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ]

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () => [
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
                ),
                h(DataGrid.Body as any, {}, () =>
                  users.map(u =>
                    h(DataGrid.Row, { id: u.id, value: u }, () =>
                      h(DataGrid.Cell, { column: 'name' }, () => u.name),
                    ),
                  ),
                ),
              ]),
          },
        })

        await nextTick()

        expect(wrapper.findComponent(DataGrid.Table as any).attributes('aria-rowcount')).toBeUndefined()
      })

      it('should expose role=table via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { renderless: true }, {
                default: (props: any) => {
                  slotProps = props
                  return h('div', { class: 'custom-grid', ...props.attrs }, 'Grid')
                },
              }),
          },
        })

        expect(wrapper.find('table').exists()).toBe(false)
        expect(wrapper.find('.custom-grid').attributes('role')).toBe('table')
        expect(slotProps.attrs.role).toBe('table')
      })
    })
  })

  describe('header', () => {
    describe('rendering', () => {
      it('should render as thead by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Header)),
          },
        })

        const header = wrapper.findComponent(DataGrid.Header as any)
        expect(header.element.tagName).toBe('THEAD')
      })

      it('should omit role on native thead', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Header)),
          },
        })

        const header = wrapper.findComponent(DataGrid.Header as any)
        expect(header.attributes('role')).toBeUndefined()
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, { as: 'div' }, () => h(DataGrid.Header, { as: 'div' })),
          },
        })

        const header = wrapper.findComponent(DataGrid.Header as any)
        expect(header.element.tagName).toBe('DIV')
        expect(header.attributes('role')).toBe('rowgroup')
      })

      it('should expose role=rowgroup via slot attrs when renderless and as is not thead', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { as: 'div', renderless: true }, {
                  default: (props: any) => {
                    slotProps = props
                    return h('div', { class: 'custom-header', ...props.attrs }, 'Header')
                  },
                }),
              ),
          },
        })

        expect(wrapper.find('thead').exists()).toBe(false)
        expect(wrapper.find('.custom-header').attributes('role')).toBe('rowgroup')
        expect(slotProps.attrs.role).toBe('rowgroup')
      })

      it('should set aria-rowindex to 1 on a single header row', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
                ),
              ),
          },
        })

        expect(wrapper.find('thead [role="row"]').attributes('aria-rowindex')).toBe('1')
      })

      it('should set aria-rowindex 1 and 2 on two header rows', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () => [
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'group' }, () => 'Group')),
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
                ]),
              ),
          },
        })

        const rows = wrapper.findAll('thead [role="row"]')
        expect(rows[0]!.attributes('aria-rowindex')).toBe('1')
        expect(rows[1]!.attributes('aria-rowindex')).toBe('2')
      })

      it('should prefer :index over the auto header row index', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, { index: 9 }, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
                ),
              ),
          },
        })

        expect(wrapper.find('thead [role="row"]').attributes('aria-rowindex')).toBe('9')
      })

      it('should recompute header aria-rowindex after a sibling unmounts', async () => {
        const Host = defineComponent({
          data: () => ({ extra: true }),
          render () {
            return h(DataGrid.Root, null, {
              default: () =>
                h(DataGrid.Table, {}, () =>
                  h(DataGrid.Header, {}, () => [
                    this.extra
                      ? h(DataGrid.Row, { key: 'a' }, () => h(DataGrid.Column, { id: 'a' }, () => 'A'))
                      : null,
                    h(DataGrid.Row, { key: 'b' }, () => h(DataGrid.Column, { id: 'b' }, () => 'B')),
                  ]),
                ),
            })
          },
        })

        const wrapper = mount(Host)
        await nextTick()

        let rows = wrapper.findAll('thead [role="row"]')
        expect(rows[0]!.attributes('aria-rowindex')).toBe('1')
        expect(rows[1]!.attributes('aria-rowindex')).toBe('2')

        await wrapper.setData({ extra: false })
        await nextTick()

        rows = wrapper.findAll('thead [role="row"]')
        expect(rows).toHaveLength(1)
        expect(rows[0]!.attributes('aria-rowindex')).toBe('1')
        expect(rows[0]!.text()).toBe('B')
      })
    })
  })

  describe('body', () => {
    describe('rendering', () => {
      it('should render as tbody by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Body as any)),
          },
        })

        const body = wrapper.findComponent(DataGrid.Body as any)
        expect(body.element.tagName).toBe('TBODY')
      })

      it('should omit role on native tbody', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Body as any)),
          },
        })

        const body = wrapper.findComponent(DataGrid.Body as any)
        expect(body.attributes('role')).toBeUndefined()
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, { as: 'div' }, () => h(DataGrid.Body as any, { as: 'div' })),
          },
        })

        const body = wrapper.findComponent(DataGrid.Body as any)
        expect(body.element.tagName).toBe('DIV')
        expect(body.attributes('role')).toBe('rowgroup')
      })

      it('should expose role=rowgroup via slot attrs when renderless and as is not tbody', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body as any, { as: 'div', renderless: true }, {
                  default: (props: any) => {
                    slotProps = props
                    return h('div', { class: 'custom-body', ...props.attrs }, 'Body')
                  },
                }),
              ),
          },
        })

        expect(wrapper.find('tbody').exists()).toBe(false)
        expect(wrapper.find('.custom-body').attributes('role')).toBe('rowgroup')
        expect(slotProps.attrs.role).toBe('rowgroup')
      })

      it('should expose rank in Body slot props', async () => {
        let slotProps: any

        mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('tr')
                  },
                }),
              ),
          },
        })

        await nextTick()

        expect(typeof slotProps.rank).toBe('function')
      })

      it('should expose row order on Body orderedItems after rows.move', async () => {
        const users = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Carol' },
        ]
        let bodyProps: any

        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body as any, {}, {
              default: (props: any) => {
                bodyProps = props
                const rows = props.orderedItems.length > 0 ? props.orderedItems : users
                return rows.map((u: any) =>
                  h(DataGrid.Row, { id: u.id, value: u, key: u.id }, () =>
                    h(DataGrid.Cell, { column: 'name' }, () => u.name),
                  ),
                )
              },
            }),
          ),
        )

        await nextTick()

        context.rows.move(3, 0)
        await nextTick()

        expect(bodyProps.orderedItems[0].id).toBe(3)
        expect(wrapper.findAll('tr')[0]!.text()).toContain('Carol')
      })

      it('should expose rank on Body and order by orderedItems after rows.move', async () => {
        const users = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Carol' },
        ]
        let ranked: { id: number, name: string }[] | undefined

        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body as any, {}, {
              default: ({ rank }: any) => {
                ranked = rank(users)
                return ranked!.map((u: any) =>
                  h(DataGrid.Row, { id: u.id, value: u, key: u.id }, () =>
                    h(DataGrid.Cell, { column: 'name' }, () => u.name),
                  ),
                )
              },
            }),
          ),
        )

        await nextTick()

        expect(typeof ranked).not.toBe('undefined')
        expect(ranked!.map(u => u.id)).toEqual([1, 2, 3])

        context.rows.move(3, 0)
        await nextTick()

        expect(ranked![0]!.id).toBe(3)
        expect(wrapper.findAll('tr')[0]!.text()).toContain('Carol')
      })
    })
  })

  describe('row', () => {
    describe('rendering', () => {
      it('should render as tr by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, () => h(DataGrid.Row)),
              ),
          },
        })

        const row = wrapper.findComponent(DataGrid.Row as any)
        expect(row.element.tagName).toBe('TR')
      })

      it('should set role=row attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, () => h(DataGrid.Row)),
              ),
          },
        })

        const row = wrapper.findComponent(DataGrid.Row as any)
        expect(row.attributes('role')).toBe('row')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body as any, { as: 'div' }, () => h(DataGrid.Row, { as: 'div' })),
              ),
          },
        })

        const row = wrapper.findComponent(DataGrid.Row as any)
        expect(row.element.tagName).toBe('DIV')
        expect(row.attributes('role')).toBe('row')
      })

      it('should expose role=row and id via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body as any, { as: 'div' }, () =>
                  h(DataGrid.Row, { id: 7, renderless: true }, {
                    default: (props: any) => {
                      slotProps = props
                      return h('div', { class: 'custom-row', ...props.attrs }, 'Row')
                    },
                  }),
                ),
              ),
          },
        })

        expect(wrapper.find('tr').exists()).toBe(false)
        expect(wrapper.find('.custom-row').attributes('role')).toBe('row')
        expect(slotProps.id).toBe(7)
        expect(slotProps.isResizable).toBe(false)
        expect(slotProps.attrs.role).toBe('row')
      })

      it('should not apply v-show on a renderless row', async () => {
        using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const users = Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
        }))

        const { wrapper } = mountRoot(
          () =>
            h(DataGrid.Table, { as: 'div' }, () => [
              h(DataGrid.Header, { as: 'div' }, () =>
                h(DataGrid.Row, { as: 'div' }, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
              ),
              h(DataGrid.Body as any, { as: 'div' }, () =>
                users.map(u =>
                  h(DataGrid.Row, {
                    id: u.id,
                    value: u,
                    renderless: true,
                  }, {
                    default: (props: any) => h('div', { class: 'custom-row', ...props.attrs }, u.name),
                  }),
                ),
              ),
            ]),
          { pagination: { itemsPerPage: 1 } },
        )

        await nextTick()

        const custom = wrapper.findAll('.custom-row')
        expect(custom).toHaveLength(3)
        expect((custom[0]!.element as HTMLElement).style.display).not.toBe('none')
        expect((custom[1]!.element as HTMLElement).style.display).not.toBe('none')
        expect((custom[2]!.element as HTMLElement).style.display).not.toBe('none')
        expect(warn.mock.calls.some(args => String(args[0]).includes('Runtime directive'))).toBe(false)
      })
    })

    describe('selection and expansion', () => {
      const users = [
        { id: 1, name: 'Alice', email: 'alice@test.com' },
        { id: 2, name: 'Bob', email: 'bob@test.com' },
      ]

      function mountDataRow (rowProps: Record<string, unknown> = {}, slot?: (props: any) => any) {
        const mounted = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body as any, {}, () =>
              h(DataGrid.Row, { id: 1, ...rowProps }, slot
                ? { default: slot }
                : () => h('td', 'Alice')),
            ),
          ),
        )
        mounted.context.onboard(users.map(u => ({ id: u.id, value: u })))
        return mounted
      }

      it('should toggle selection when a selectable row is clicked', async () => {
        const { wrapper } = mountDataRow({ selectable: true })

        await nextTick()
        const row = wrapper.findComponent(DataGrid.Row as any)
        expect(row.attributes('aria-selected')).toBe('false')

        await row.trigger('click')
        expect(row.attributes('aria-selected')).toBe('true')

        await row.trigger('click')
        expect(row.attributes('aria-selected')).toBe('false')
      })

      it('should not toggle selection when a non-selectable row is clicked', async () => {
        let slotProps: any

        const { wrapper } = mountDataRow({}, (props: any) => {
          slotProps = props
          return h('td', 'Alice')
        })

        await nextTick()
        await wrapper.findComponent(DataGrid.Row as any).trigger('click')
        expect(slotProps.isSelected).toBe(false)
      })

      it('should have aria-selected attribute when id is provided and selectable', async () => {
        const { wrapper } = mountDataRow({ selectable: true })

        await nextTick()

        const row = wrapper.findComponent(DataGrid.Row as any)
        expect(row.attributes('aria-selected')).toBe('false')
      })

      it('should omit aria-selected when id is provided without selectable', async () => {
        const { wrapper } = mountDataRow()

        await nextTick()

        const row = wrapper.findComponent(DataGrid.Row as any)
        expect(row.attributes('aria-selected')).toBeUndefined()
      })

      it('should toggle expansion and set data-expanded', async () => {
        let slotProps: any

        const { wrapper } = mountDataRow({}, (props: any) => {
          slotProps = props
          return h('td')
        })

        await nextTick()
        expect(slotProps.isExpanded).toBe(false)
        expect(wrapper.findComponent(DataGrid.Row as any).attributes('data-expanded')).toBeUndefined()

        slotProps.toggleExpansion()
        await nextTick()
        expect(slotProps.isExpanded).toBe(true)
        expect(wrapper.findComponent(DataGrid.Row as any).attributes('data-expanded')).toBe('true')

        slotProps.toggleExpansion()
        await nextTick()
        expect(slotProps.isExpanded).toBe(false)
        expect(wrapper.findComponent(DataGrid.Row as any).attributes('data-expanded')).toBeUndefined()
      })
    })
  })

  describe('column', () => {
    describe('rendering', () => {
      it('should render as th by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, {}, () => 'Name')),
                ),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.element.tagName).toBe('TH')
        expect(column.attributes('scope')).toBe('col')
      })

      it('should set role=columnheader attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, {}, () => 'Name')),
                ),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.attributes('role')).toBe('columnheader')
      })

      it('should render content in slot', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Column, {}, () => 'Column Title')),
                ),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.text()).toBe('Column Title')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Column, { as: 'div' }, () => 'Name'),
                  ),
                ),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.element.tagName).toBe('DIV')
        expect(column.attributes('role')).toBe('columnheader')
        expect(column.attributes('scope')).toBeUndefined()
      })

      it('should expose role=columnheader via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Column, { as: 'div', renderless: true }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('div', { class: 'custom-column', ...props.attrs }, 'Name')
                      },
                    }),
                  ),
                ),
              ),
          },
        })

        expect(wrapper.find('th').exists()).toBe(false)
        expect(wrapper.find('.custom-column').attributes('role')).toBe('columnheader')
        expect(slotProps.attrs.role).toBe('columnheader')
        expect(slotProps.attrs.scope).toBeUndefined()
        expect(slotProps.isSortable).toBe(false)
        expect(slotProps.direction).toBe('none')
        expect(slotProps.priority).toBe(-1)
        expect(slotProps.isPinned).toBe(false)
        expect(slotProps.pinPosition).toBe(false)
        expect(slotProps.size).toBe(0)
      })

      it('should expose scope=col via slot attrs when renderless and as is th', () => {
        let slotProps: any

        mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Column, { renderless: true }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('th', { class: 'custom-column', ...props.attrs }, 'Name')
                      },
                    }),
                  ),
                ),
              ),
          },
        })

        expect(slotProps.attrs.scope).toBe('col')
        expect(slotProps.attrs.role).toBe('columnheader')
        expect(slotProps.direction).toBe('none')
        expect(slotProps.priority).toBe(-1)
        expect(slotProps.isPinned).toBe(false)
        expect(slotProps.pinPosition).toBe(false)
        expect(slotProps.size).toBe(0)
      })

      it('should support colspan and rowspan attributes', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Column, { colspan: 2, rowspan: 3 }, () => 'Name'),
                  ),
                ),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.attributes('colspan')).toBe('2')
        expect(column.attributes('rowspan')).toBe('3')
        expect(column.attributes('scope')).toBe('colgroup')
      })

      it('should use aria-colspan on non-th hosts', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Column, { as: 'div', colspan: 2 }, () => 'Name'),
                  ),
                ),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.attributes('colspan')).toBeUndefined()
        expect(column.attributes('aria-colspan')).toBe('2')
        expect(column.attributes('scope')).toBeUndefined()
      })

      it('should fall back to Atom when used outside a row', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
              ),
          },
        })

        const column = wrapper.findComponent(DataGrid.Column as any)
        expect(column.element.tagName).toBe('TH')
        expect(column.attributes('role')).toBe('columnheader')
        expect(column.attributes('data-panel-index')).toBeUndefined()
      })
    })

    describe('sort and pin', () => {
      it('should expose sort direction and aria-sort through the cycle', async () => {
        let slotProps: any
        const { context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Header, {}, () =>
              h(DataGrid.Row, {}, () =>
                h(DataGrid.Column, { id: 'name', sortable: true }, {
                  default: (props: any) => {
                    slotProps = props
                    return 'Name'
                  },
                }),
              ),
            ),
          ),
        )

        await nextTick()

        expect(slotProps.isSortable).toBe(true)
        expect(slotProps.direction).toBe('none')
        expect(slotProps.priority).toBe(-1)
        expect(slotProps.attrs['aria-sort']).toBe('none')
        expect(slotProps.attrs['data-direction']).toBeUndefined()
        expect(typeof slotProps.toggle).toBe('function')

        context.sort.toggle('name')
        await nextTick()

        expect(slotProps.direction).toBe('asc')
        expect(slotProps.priority).toBe(0)
        expect(slotProps.attrs['aria-sort']).toBe('ascending')
        expect(slotProps.attrs['data-direction']).toBe('asc')

        context.sort.toggle('name')
        await nextTick()

        expect(slotProps.direction).toBe('desc')
        expect(slotProps.priority).toBe(0)
        expect(slotProps.attrs['aria-sort']).toBe('descending')
        expect(slotProps.attrs['data-direction']).toBe('desc')

        context.sort.toggle('name')
        await nextTick()

        expect(slotProps.direction).toBe('none')
        expect(slotProps.priority).toBe(-1)
        expect(slotProps.attrs['aria-sort']).toBe('none')
      })

      it('should update isSortable when the sortable prop flips after mount', async () => {
        let slotProps: any

        const Host = defineComponent({
          data: () => ({ sortable: false }),
          render () {
            return h(DataGrid.Root as any, {}, () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Column, { id: 'name', sortable: this.sortable }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('span', 'Name')
                      },
                    }),
                  ),
                ),
              ),
            )
          },
        })

        const wrapper = mount(Host)
        await nextTick()
        expect(slotProps.isSortable).toBe(false)
        expect(slotProps.attrs['aria-sort']).toBeUndefined()

        slotProps.toggle()
        await nextTick()
        expect(slotProps.direction).toBe('none')

        wrapper.setData({ sortable: true })
        await nextTick()
        expect(slotProps.isSortable).toBe(true)
        expect(slotProps.attrs['aria-sort']).toBe('none')

        slotProps.toggle()
        await nextTick()
        expect(slotProps.direction).toBe('asc')
        expect(slotProps.attrs['aria-sort']).toBe('ascending')
      })

      it('should expose left and right pin positions from column tickets', async () => {
        let nameProps: any
        let emailProps: any
        mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Header, {}, () =>
              h(DataGrid.Row, {}, () => [
                h(DataGrid.Column, { id: 'name', pinned: 'left' }, {
                  default: (props: any) => {
                    nameProps = props
                    return 'Name'
                  },
                }),
                h(DataGrid.Column, { id: 'email', pinned: 'right' }, {
                  default: (props: any) => {
                    emailProps = props
                    return 'Email'
                  },
                }),
              ]),
            ),
          ),
        )

        await nextTick()

        expect(nameProps.isPinned).toBe(true)
        expect(nameProps.pinPosition).toBe('left')
        expect(emailProps.isPinned).toBe(true)
        expect(emailProps.pinPosition).toBe('right')
      })
    })
  })

  describe('cell', () => {
    describe('rendering', () => {
      it('should render as td by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Cell, {}, () => 'Value')),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.element.tagName).toBe('TD')
      })

      it('should set role=cell attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Cell, {}, () => 'Value')),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.attributes('role')).toBe('cell')
      })

      it('should render content in slot', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Cell, {}, () => 'Cell Content')),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.text()).toBe('Cell Content')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body as any, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Cell, { as: 'div' }, () => 'Value'),
                  ),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.element.tagName).toBe('DIV')
        expect(cell.attributes('role')).toBe('cell')
      })

      it('should set aria-colindex on non-td cells in display order', async () => {
        const { wrapper } = mountRoot(
          () =>
            h(DataGrid.Table, { as: 'div' }, () =>
              h(DataGrid.Body as any, { as: 'div' }, () =>
                h(DataGrid.Row, { as: 'div' }, () => [
                  h(DataGrid.Cell, { as: 'div', column: 'name' }, () => 'A'),
                  h(DataGrid.Cell, { as: 'div', column: 'email' }, () => 'B'),
                ]),
              ),
            ),
          {},
          [
            { id: 'name' },
            { id: 'email' },
          ],
        )

        await nextTick()

        const cells = wrapper.findAll('[role="cell"]')
        expect(cells[0]!.attributes('aria-colindex')).toBe('1')
        expect(cells[1]!.attributes('aria-colindex')).toBe('2')
      })

      it('should apply layout size as flex-basis on the cell host', async () => {
        const { wrapper } = mountRoot(
          () =>
            h(DataGrid.Table, { as: 'div' }, () =>
              h(DataGrid.Body as any, { as: 'div' }, () =>
                h(DataGrid.Row, { as: 'div', class: 'flex' }, () =>
                  h(DataGrid.Cell, { as: 'div', column: 'name' }, () => 'A'),
                ),
              ),
            ),
          {},
          [{ id: 'name', size: 40 }],
        )

        await nextTick()

        const cell = wrapper.find('[role="cell"]')
        const style = cell.attributes('style') ?? ''
        expect(style).toContain('width: 40%')
        expect(style.includes('flex-basis: 40%') || style.includes('flex: 0 0 40%')).toBe(true)
      })

      it('should expose role=cell via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body as any, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Cell, { renderless: true }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('div', { class: 'custom-cell', ...props.attrs }, 'Value')
                      },
                    }),
                  ),
                ),
              ),
          },
        })

        expect(wrapper.find('td').exists()).toBe(false)
        expect(wrapper.find('.custom-cell').attributes('role')).toBe('cell')
        expect(slotProps.attrs.role).toBe('cell')
        expect(slotProps.isEditing).toBe(false)
        expect(slotProps.rowSpan).toBe(1)
      })

      it('should support colspan on native td', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body as any, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Cell, { colspan: 3 }, {
                      default: (props: any) => {
                        slotProps = props
                        return 'Empty'
                      },
                    }),
                  ),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.attributes('colspan')).toBe('3')
        expect(cell.attributes('aria-colspan')).toBeUndefined()
        expect(slotProps.attrs.colspan).toBe(3)
        expect(slotProps.attrs['aria-colspan']).toBeUndefined()
      })

      it('should use aria-colspan on non-td hosts', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body as any, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Cell, { as: 'div', colspan: 3 }, {
                      default: (props: any) => {
                        slotProps = props
                        return 'Empty'
                      },
                    }),
                  ),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.attributes('colspan')).toBeUndefined()
        expect(cell.attributes('aria-colspan')).toBe('3')
        expect(slotProps.attrs.colspan).toBeUndefined()
        expect(slotProps.attrs['aria-colspan']).toBe(3)
      })
    })

    describe('editing and spans', () => {
      it('should expose isEditing when the active cell matches', async () => {
        let slotProps: any
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body as any, {}, () =>
              h(DataGrid.Row, { id: 1 }, () =>
                h(DataGrid.Cell, { column: 'name' }, {
                  default: (props: any) => {
                    slotProps = props
                    return 'Alice'
                  },
                }),
              ),
            ),
          ),
        )

        context.columns.onboard([
          { id: 'name', editable: true },
        ])
        context.onboard([
          { id: 1, value: { id: 1, name: 'Alice' } },
        ])
        await nextTick()

        expect(slotProps.isEditing).toBe(false)

        context.editing.edit(1, 'name')
        await nextTick()

        expect(slotProps.isEditing).toBe(true)
        expect(wrapper.find('[role="cell"]').exists()).toBe(true)
      })

      it('should resolve isEditing from a generated row ticket when :id is omitted', async () => {
        let cellProps: any
        let rowProps: any
        const item = { name: 'Alice' }
        const { context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body as any, {}, () =>
              h(DataGrid.Row, { value: item }, {
                default: (props: any) => {
                  rowProps = props
                  return h(DataGrid.Cell, { column: 'name' }, {
                    default: (p: any) => {
                      cellProps = p
                      return 'Alice'
                    },
                  })
                },
              }),
            ),
          ),
        {},
        [{ id: 'name', editable: true }],
        )

        await nextTick()

        expect(rowProps.id).toBeDefined()
        expect(cellProps.isEditing).toBe(false)

        context.editing.edit(rowProps.id, 'name')
        await nextTick()

        expect(cellProps.isEditing).toBe(true)
      })

      it('should apply rowspan and hide covered cells', async () => {
        let firstProps: any
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body as any, {}, () => [
              h(DataGrid.Row, { id: 1 }, () =>
                h(DataGrid.Cell, { column: 'dept' }, {
                  default: (props: any) => {
                    firstProps = props
                    return 'Eng'
                  },
                }),
              ),
              h(DataGrid.Row, { id: 2 }, () =>
                h(DataGrid.Cell, { column: 'dept' }, () => 'Eng'),
              ),
            ]),
          ),
        {
          rowSpanning: (_item: unknown, column: string) => column === 'dept' ? 2 : 1,
        },
        )

        context.columns.onboard([{ id: 'dept' }])
        context.onboard([
          { id: 1, value: { id: 1, dept: 'Eng' } },
          { id: 2, value: { id: 2, dept: 'Eng' } },
        ])
        await nextTick()

        expect(firstProps.rowSpan).toBe(2)
        expect(firstProps.attrs.rowspan).toBe(2)

        const cells = wrapper.findAll('[role="cell"]')
        expect(cells).toHaveLength(1)
        expect(cells[0]!.attributes('rowspan')).toBe('2')
      })
    })
  })

  describe('layout', () => {
    describe('resize API', () => {
      it('should resize column via layout.resize', async () => {
        let context: any

        mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table)
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, minSize: 10, maxSize: 90, resizable: true },
          { id: 'email', size: 50, minSize: 10, maxSize: 90, resizable: true },
        ])

        await nextTick()

        const nameBefore = context.layout.columns.value.find((c: any) => c.id === 'name')
        const emailBefore = context.layout.columns.value.find((c: any) => c.id === 'email')

        expect(nameBefore.size).toBe(50)
        expect(emailBefore.size).toBe(50)

        context.layout.resize('name', 10)
        await nextTick()

        const nameAfter = context.layout.columns.value.find((c: any) => c.id === 'name')
        const emailAfter = context.layout.columns.value.find((c: any) => c.id === 'email')

        expect(nameAfter.size).toBe(60)
        expect(emailAfter.size).toBe(40)
      })

      it('should distribute sizes via layout.distribute', async () => {
        let context: any

        mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table)
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, minSize: 10, maxSize: 90, resizable: true },
          { id: 'email', size: 50, minSize: 10, maxSize: 90, resizable: true },
        ])

        await nextTick()

        context.layout.distribute([70, 30])
        await nextTick()

        const nameCol = context.layout.columns.value.find((c: any) => c.id === 'name')
        const emailCol = context.layout.columns.value.find((c: any) => c.id === 'email')

        expect(nameCol.size).toBe(70)
        expect(emailCol.size).toBe(30)
      })

      it('should respect minSize and maxSize constraints', async () => {
        let context: any

        mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table)
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, minSize: 30, maxSize: 70, resizable: true },
          { id: 'email', size: 50, minSize: 30, maxSize: 70, resizable: true },
        ])

        await nextTick()

        context.layout.resize('name', 50)
        await nextTick()

        const nameCol = context.layout.columns.value.find((c: any) => c.id === 'name')
        expect(nameCol.size).toBeLessThanOrEqual(70)
      })
    })

    describe('column slot props', () => {
      it('should expose size from layout', async () => {
        let slotProps: any

        mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              if (props.context.columns.size === 0) {
                props.context.columns.onboard([
                  { id: 'name', size: 60, resizable: true },
                  { id: 'email', size: 40, resizable: true },
                ])
              }
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Column, { id: 'name' }, {
                      default: (p: any) => {
                        slotProps = p
                        return 'Name'
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
        expect(slotProps.size).toBe(60)
        expect(slotProps.isResizable).toBe(true)
      })
    })

    describe('splitter composition', () => {
      it('should render resizable row as Splitter.Root', async () => {
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        // The resizable row should have data-orientation="horizontal" from Splitter.Root
        const row = wrapper.find('[role="row"]')
        expect(row.attributes('data-orientation')).toBe('horizontal')
      })

      it('should render Handle with role=separator', async () => {
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const handle = wrapper.find('[role="separator"]')
        expect(handle.exists()).toBe(true)
        expect(handle.attributes('aria-orientation')).toBe('vertical')
      })

      it('should expose isResizable in row slot props', async () => {
        let rowSlotProps: any

        mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { as: 'div' }, () =>
                  h(DataGrid.Row, { resizable: true, as: 'div' }, {
                    default: (p: any) => {
                      rowSlotProps = p
                      return 'Row Content'
                    },
                  }),
                ),
              ),
          },
        })

        await nextTick()

        expect(rowSlotProps).toBeDefined()
        expect(rowSlotProps.isResizable).toBe(true)
      })

      it('should keep a custom as on a resizable row instead of forcing div', async () => {
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'section', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const row = wrapper.find('[role="row"]')
        expect(row.element.tagName).toBe('SECTION')
        expect(row.attributes('data-orientation')).toBe('horizontal')
      })

      it('should compose Column as Splitter.Panel and keep a custom as', async () => {
        let slotProps: any
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name', as: 'span' }, {
                  default: (props: any) => {
                    slotProps = props
                    return 'Name'
                  },
                }),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        [
          { id: 'name', size: 60, minSize: 10, maxSize: 80, resizable: true },
          { id: 'email', size: 40, minSize: 20, resizable: false },
        ],
        )

        await nextTick()

        const panels = wrapper.findAll('[data-panel-index]')
        expect(panels).toHaveLength(2)
        expect(panels[0]!.element.tagName).toBe('SPAN')
        expect(panels[0]!.attributes('role')).toBe('columnheader')
        expect(slotProps.isResizable).toBe(true)
        expect(slotProps.size).toBe(60)
        expect(slotProps.minSize).toBe(10)
        expect(slotProps.maxSize).toBe(80)
      })

      it('should sync Splitter layout to context.layout.distribute', async () => {
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const row = wrapper.findComponent(DataGrid.Row as any)
        const splitter = row.findComponent({ name: 'SplitterRoot' })
        expect(splitter.exists()).toBe(true)
        expect(wrapper.findAll('[data-panel-index]')).toHaveLength(2)

        splitter.vm.distribute([70, 30])
        await nextTick()

        const nameCol = context.layout.columns.value.find((c: any) => c.id === 'name')
        const emailCol = context.layout.columns.value.find((c: any) => c.id === 'email')
        expect(nameCol.size).toBe(70)
        expect(emailCol.size).toBe(30)
      })

      it('should permute Splitter layout into registry order when columns are pinned', async () => {
        const { wrapper, context } = mountRoot(
          () =>
            h(DataGrid.Table, { as: 'div' }, () =>
              h(DataGrid.Header, { as: 'div' }, () =>
                h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                  h(DataGrid.Column, { id: 'c' }, () => 'C'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'a' }, () => 'A'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'b' }, () => 'B'),
                ]),
              ),
            ),
          {},
          [
            { id: 'a', size: 40, minSize: 5, maxSize: 90, resizable: true },
            { id: 'b', size: 30, minSize: 5, maxSize: 90, resizable: true },
            { id: 'c', size: 30, minSize: 5, maxSize: 90, resizable: true },
          ],
        )

        await nextTick()
        context.layout.pin('c', 'left')
        await nextTick()

        expect(context.layout.columns.value.map((c: any) => c.id)).toEqual(['c', 'a', 'b'])

        const row = wrapper.findComponent(DataGrid.Row as any)
        const splitter = row.findComponent({ name: 'SplitterRoot' })
        expect(splitter.exists()).toBe(true)
        expect(wrapper.findAll('[data-panel-index]')).toHaveLength(3)

        splitter.vm.distribute([10, 20, 70])
        await nextTick()

        function size (id: string) {
          return context.layout.columns.value.find((c: any) => c.id === id).size
        }

        expect(size('c')).toBe(10)
        expect(size('a')).toBe(20)
        expect(size('b')).toBe(70)
      })

      it('should sync Splitter layout after a column is hidden', async () => {
        const { wrapper, context } = mountRoot(
          () =>
            h(DataGrid.Table, { as: 'div' }, () =>
              h(DataGrid.Header, { as: 'div' }, () =>
                h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                  h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'email' }, () => 'Email'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'status' }, () => 'Status'),
                ]),
              ),
            ),
          {},
          [
            { id: 'name', size: 40, minSize: 5, maxSize: 90, resizable: true },
            { id: 'email', size: 30, minSize: 5, maxSize: 90, resizable: true },
            { id: 'status', size: 30, minSize: 5, maxSize: 90, resizable: true },
          ],
        )

        await nextTick()
        context.layout.hide('email')
        await nextTick()

        expect(context.layout.columns.value.map((c: any) => c.id)).toEqual(['name', 'status'])
        expect(wrapper.findAll('[data-panel-index]')).toHaveLength(3)

        const row = wrapper.findComponent(DataGrid.Row as any)
        const splitter = row.findComponent({ name: 'SplitterRoot' })
        expect(splitter.exists()).toBe(true)

        splitter.vm.distribute([40, 20, 40])
        await nextTick()

        function column (id: string) {
          return context.layout.all.value.find((c: any) => c.id === id)
        }

        const nameCol = column('name')
        const emailCol = column('email')
        const statusCol = column('status')

        expect(isUndefined(nameCol)).toBe(false)
        expect(isUndefined(emailCol)).toBe(false)
        expect(isUndefined(statusCol)).toBe(false)
        expect(nameCol.size).toBe(50)
        expect(emailCol.size).toBe(30)
        expect(statusCol.size).toBe(50)
      })

      it('should ignore Splitter layout whose length does not match mounted panels', async () => {
        const { wrapper, context } = mountRoot(
          () =>
            h(DataGrid.Table, { as: 'div' }, () =>
              h(DataGrid.Header, { as: 'div' }, () =>
                h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                  h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'email' }, () => 'Email'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'status' }, () => 'Status'),
                ]),
              ),
            ),
          {},
          [
            { id: 'name', size: 40, minSize: 5, maxSize: 90, resizable: true },
            { id: 'email', size: 30, minSize: 5, maxSize: 90, resizable: true },
            { id: 'status', size: 30, minSize: 5, maxSize: 90, resizable: true },
          ],
        )

        await nextTick()
        context.layout.hide('email')
        await nextTick()

        expect(wrapper.findAll('[data-panel-index]')).toHaveLength(3)

        const row = wrapper.findComponent(DataGrid.Row as any)
        const splitter = row.findComponent({ name: 'SplitterRoot' })
        splitter.vm.distribute([50, 50])
        await nextTick()

        function column (id: string) {
          return context.layout.all.value.find((c: any) => c.id === id)
        }

        expect(column('name').size).toBe(40)
        expect(column('email').size).toBe(30)
        expect(column('status').size).toBe(30)
      })

      it('should resize columns from Handle keyboard interaction', async () => {
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const handle = wrapper.findComponent({ name: 'SplitterHandle' })
        expect(handle.exists()).toBe(true)
        await handle.trigger('keydown', { key: 'ArrowRight' })
        await nextTick()

        const nameCol = context.layout.columns.value.find((c: any) => c.id === 'name')
        const emailCol = context.layout.columns.value.find((c: any) => c.id === 'email')
        expect(nameCol.size).toBeGreaterThan(50)
        expect(emailCol.size).toBeLessThan(50)
        expect(nameCol.size + emailCol.size).toBe(100)
      })

      it('should pass Handle label, disabled, and slot props through Splitter.Handle', async () => {
        let handleProps: any
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle, { label: 'Resize name', disabled: true }, {
                  default: (props: any) => {
                    handleProps = props
                    return h('div', { class: 'custom-handle', ...props.attrs })
                  },
                }),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const handle = wrapper.find('[role="separator"]')
        expect(handle.exists()).toBe(true)
        expect(handle.attributes('aria-label')).toBe('Resize name')
        expect(handle.attributes('aria-disabled')).toBe('true')
        expect(handleProps.isDisabled).toBe(true)
        expect(handleProps.isDragging).toBe(false)
        expect(handleProps.state).toBe('inactive')
        expect(handleProps.attrs.role).toBe('separator')
      })

      it('should render Handle without a wrapper when renderless', async () => {
        let handleProps: any
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle, { renderless: true, label: 'Resize name' }, {
                  default: (props: any) => {
                    handleProps = props
                    return h('button', { class: 'custom-handle', ...props.attrs }, '|')
                  },
                }),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const handle = wrapper.find('.custom-handle')
        expect(handle.exists()).toBe(true)
        expect(handle.element.tagName).toBe('BUTTON')
        expect(handle.attributes('role')).toBe('separator')
        expect(handle.attributes('aria-label')).toBe('Resize name')
        expect(handleProps.attrs.role).toBe('separator')
      })

      it('should fall back to the locale resize handle label', async () => {
        const { wrapper } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div', class: 'flex' }, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
        )

        await nextTick()

        const handle = wrapper.find('[role="separator"]')
        expect(handle.attributes('aria-label')).toBe('Resize column')
      })
    })
  })

  describe('integration', () => {
    it('should work as a complete grid structure', () => {
      const wrapper = mount(DataGrid.Root, {
        slots: {
          default: () =>
            h(DataGrid.Table, {}, () => [
              h(DataGrid.Header, {}, () =>
                h(DataGrid.Row, {}, () => [
                  h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                  h(DataGrid.Column, { id: 'email' }, () => 'Email'),
                ]),
              ),
              h(DataGrid.Body as any, {}, () =>
                h(DataGrid.Row, { id: 1 }, () => [
                  h(DataGrid.Cell, { column: 'name' }, () => 'John'),
                  h(DataGrid.Cell, { column: 'email' }, () => 'john@example.com'),
                ]),
              ),
            ]),
        },
      })

      expect(wrapper.findComponent(DataGrid.Table as any).exists()).toBe(true)
      expect(wrapper.findComponent(DataGrid.Header as any).exists()).toBe(true)
      expect(wrapper.findComponent(DataGrid.Body as any).exists()).toBe(true)
      expect(wrapper.findAllComponents(DataGrid.Row as any)).toHaveLength(2)
      expect(wrapper.findAllComponents(DataGrid.Column as any)).toHaveLength(2)
      expect(wrapper.findAllComponents(DataGrid.Cell as any)).toHaveLength(2)
    })

    it('should allow data registration via context', async () => {
      interface User {
        id: number
        name: string
      }

      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]

      let context: any

      mount(DataGrid.Root, {
        slots: {
          default: (props: any) => {
            context = props.context
            return h(DataGrid.Table)
          },
        },
      })

      expect(context).toBeDefined()

      context.onboard(users.map(u => ({ id: u.id, value: u })))

      await nextTick()

      expect(context.size).toBe(2)
    })

    it('should allow column resize via layout API', async () => {
      const { context } = mountRoot(
        () =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Header, {}, () =>
              h(DataGrid.Row, {}, () => [
                h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                h(DataGrid.Column, { id: 'email' }, () => 'Email'),
              ]),
            ),
          ),
        {},
        resizableColumns,
      )

      await nextTick()

      const nameCol = context.layout.columns.value.find((c: any) => c.id === 'name')
      const emailCol = context.layout.columns.value.find((c: any) => c.id === 'email')

      expect(nameCol.size).toBe(50)
      expect(emailCol.size).toBe(50)

      context.layout.resize('name', 10)
      await nextTick()

      const updatedNameCol = context.layout.columns.value.find((c: any) => c.id === 'name')
      const updatedEmailCol = context.layout.columns.value.find((c: any) => c.id === 'email')

      expect(updatedNameCol.size).toBe(60)
      expect(updatedEmailCol.size).toBe(40)
    })

    it('should register columns and rows on mount without Init', async () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]

      const { context } = mountRoot(() =>
        h(DataGrid.Table, {}, () => [
          h(DataGrid.Header, {}, () =>
            h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
          ),
          h(DataGrid.Body as any, {}, () =>
            users.map(u =>
              h(DataGrid.Row, { id: u.id, value: u }, () =>
                h(DataGrid.Cell, { column: 'name' }, () => u.name),
              ),
            ),
          ),
        ]),
      )

      await nextTick()

      expect(context.columns.has('name')).toBe(true)
      expect(context.size).toBe(2)
      expect(context.items.value).toHaveLength(2)
    })

    it('should expose pinPosition from layout.pin', async () => {
      let slotProps: any
      const { context } = mountRoot(() =>
        h(DataGrid.Table, {}, () =>
          h(DataGrid.Header, {}, () =>
            h(DataGrid.Row, {}, () =>
              h(DataGrid.Column, { id: 'name' }, {
                default: (props: any) => {
                  slotProps = props
                  return 'Name'
                },
              }),
            ),
          ),
        ),
      )

      await nextTick()

      expect(slotProps.pinPosition).toBe(false)
      expect(slotProps.isPinned).toBe(false)

      context.layout.pin('name', 'left')
      await nextTick()

      expect(slotProps.pinPosition).toBe('left')
      expect(slotProps.isPinned).toBe(true)
    })

    it('should not mount Handle outside a resizable Row', () => {
      const wrapper = mount(DataGrid.Root, {
        slots: {
          default: () =>
            h(DataGrid.Table, {}, () =>
              h(DataGrid.Header, {}, () =>
                h(DataGrid.Row, {}, () => [
                  h(DataGrid.Column, { id: 'name' }, () => 'Name'),
                  h(DataGrid.Handle),
                  h(DataGrid.Column, { id: 'email' }, () => 'Email'),
                ]),
              ),
            ),
        },
      })

      expect(wrapper.find('[role="separator"]').exists()).toBe(false)
    })

    it('should keep off-page rows registered when paginated', async () => {
      const users = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
      }))

      const { wrapper, context } = mountRoot(
        () =>
          h(DataGrid.Table, {}, () => [
            h(DataGrid.Header, {}, () =>
              h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
            ),
            h(DataGrid.Body as any, {}, () =>
              users.map(u =>
                h(DataGrid.Row, { id: u.id, value: u }, () =>
                  h(DataGrid.Cell, { column: 'name' }, () => u.name),
                ),
              ),
            ),
          ]),
        { pagination: { itemsPerPage: 2 } },
      )

      await nextTick()

      expect(context.items.value).toHaveLength(2)
      expect(context.size).toBe(5)
      expect(wrapper.findComponent(DataGrid.Table as any).attributes('aria-rowcount')).toBe('6')

      const dataRows = wrapper.findAllComponents(DataGrid.Row as any).filter(row => row.props('value'))
      expect(dataRows).toHaveLength(5)
      expect((dataRows[0]!.element as HTMLElement).style.display).not.toBe('none')
      expect((dataRows[1]!.element as HTMLElement).style.display).not.toBe('none')
      expect((dataRows[2]!.element as HTMLElement).style.display).toBe('none')
      expect((dataRows[3]!.element as HTMLElement).style.display).toBe('none')
      expect((dataRows[4]!.element as HTMLElement).style.display).toBe('none')
    })

    it('should auto-set aria-rowindex from orderedItems without :index on page 2', async () => {
      const users = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
      }))
      let bodyProps: any

      const { wrapper, context } = mountRoot(
        () =>
          h(DataGrid.Table, {}, () => [
            h(DataGrid.Header, {}, () =>
              h(DataGrid.Row, {}, () => h(DataGrid.Column, { id: 'name' }, () => 'Name')),
            ),
            h(DataGrid.Body as any, {}, {
              default: (props: any) => {
                bodyProps = props
                return props.rank(users).map((u: any) =>
                  h(DataGrid.Row, {
                    id: u.id,
                    value: u,
                    key: u.id,
                  }, () =>
                    h(DataGrid.Cell, { column: 'name' }, () => u.name),
                  ),
                )
              },
            }),
          ]),
        { pagination: { itemsPerPage: 2 } },
      )

      await nextTick()
      context.pagination.next()
      await nextTick()

      expect(bodyProps.headerRows).toBe(1)
      expect(bodyProps.rowStart).toBe(4)
      expect(wrapper.findComponent(DataGrid.Table as any).attributes('aria-rowcount')).toBe('6')

      expect(wrapper.find('thead [role="row"]').attributes('aria-rowindex')).toBe('1')

      const rows = wrapper.findAll('tbody [role="row"]')
      expect(rows[2]!.text()).toContain('User 3')
      expect(rows[3]!.text()).toContain('User 4')
      expect(rows[2]!.attributes('aria-rowindex')).toBe('4')
      expect(rows[3]!.attributes('aria-rowindex')).toBe('5')
      expect((rows[2]!.element as HTMLElement).style.display).not.toBe('none')
      expect((rows[3]!.element as HTMLElement).style.display).not.toBe('none')
    })

    it('should upsert a child-registered row when :value is replaced', async () => {
      let body: any
      let context: any

      const Host = defineComponent({
        data: () => ({
          rows: [
            { id: 1, name: 'Bob' },
            { id: 2, name: 'Carol' },
          ] as { id: number, name: string }[],
        }),
        render () {
          return h(DataGrid.Root as any, {}, {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () => [
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () =>
                    h(DataGrid.Column, { id: 'name', filterable: true }),
                  ),
                ),
                h(DataGrid.Body as any, {}, {
                  default: (slot: any) => {
                    body = slot
                    return this.rows.map(user =>
                      h(DataGrid.Row, { key: user.id, id: user.id, value: user }, () =>
                        h(DataGrid.Cell, { column: 'name' }, () => user.name),
                      ),
                    )
                  },
                }),
              ])
            },
          })
        },
      })

      const wrapper = mount(Host)
      await nextTick()

      context.search('alice')
      await nextTick()
      expect(body.items).toHaveLength(0)

      wrapper.setData({
        rows: [
          { id: 1, name: 'Alice Cooper' },
          { id: 2, name: 'Carol' },
        ],
      })
      await nextTick()
      expect(body.items.map((item: { name: string }) => item.name)).toEqual(['Alice Cooper'])
      expect(context.get(1)?.value).toEqual({ id: 1, name: 'Alice Cooper' })
    })

    it('should show Empty when no rows are registered', () => {
      const wrapper = mount(DataGrid.Root, {
        slots: {
          default: () =>
            h(DataGrid.Table, {}, () =>
              h(DataGrid.Body as any, {}, () =>
                h(DataGrid.Empty, {}, () => 'No data'),
              ),
            ),
        },
      })

      const empty = wrapper.findComponent(DataGrid.Empty as any)
      expect(empty.exists()).toBe(true)
      expect(empty.text()).toBe('No data')
    })

    it('should not render Empty when items exist', async () => {
      const wrapper = mount(DataGrid.Root, {
        slots: {
          default: ({ context }: any) => {
            if (context.size === 0) {
              context.onboard([{ id: 1, value: { id: 1, name: 'Alice' } }])
            }
            return h(DataGrid.Table, {}, () =>
              h(DataGrid.Body as any, {}, () =>
                h(DataGrid.Empty, {}, () => 'No data'),
              ),
            )
          },
        },
      })

      await nextTick()

      expect(wrapper.text()).not.toContain('No data')
    })

    it('should not coerce a resizable row default as from tr to div', async () => {
      const { wrapper } = mountRoot(() =>
        h(DataGrid.Table, { as: 'div' }, () =>
          h(DataGrid.Header, { as: 'div' }, () =>
            h(DataGrid.Row, { resizable: true }, () => [
              h(DataGrid.Column, { id: 'name' }, () => 'Name'),
              h(DataGrid.Handle),
              h(DataGrid.Column, { id: 'email' }, () => 'Email'),
            ]),
          ),
        ),
      {},
      resizableColumns,
      )

      await nextTick()

      const row = wrapper.find('[role="row"]')
      expect(row.element.tagName).toBe('TR')
    })
  })
})
