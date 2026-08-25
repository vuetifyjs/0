import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { DataTable, useDataTableRoot } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, onMounted } from 'vue'

interface User extends Record<string, unknown> {
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

function mountRoot (options: { props?: Record<string, unknown>, slots?: any } = {}) {
  return mount(DataTable.Root as any, options)
}

describe('data-table', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render children in default slot', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h('div', { class: 'test-child' }, 'Child content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.find('.test-child').text()).toBe('Child content')
      })

      it('should expose context in slot props', () => {
        let slotProps: any

        mountRoot({
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
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.exists()).toBe(true)
      })

      it('should provide context with custom namespace', () => {
        const wrapper = mountRoot({
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

    describe('registration', () => {
      it('should derive items from mounted Row children', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: () =>
              h(DataTable.Table, {}, () => [
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    testColumns.map(col =>
                      h(DataTable.Column, { key: col.id, id: col.id, sortable: col.sortable, filterable: col.filterable }),
                    ),
                  ),
                ),
                h(DataTable.Body as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return testUsers.map(user =>
                      h(DataTable.Row as any, { key: user.id, id: user.id, value: user }),
                    )
                  },
                }),
              ]),
          },
        })

        await nextTick()

        expect(slotProps.isEmpty).toBe(false)
        expect(slotProps.items).toHaveLength(3)
        expect(slotProps.items[0].name).toBe('Alice')
      })

      it('should unregister rows when they unmount', async () => {
        let slotProps: any

        const Host = defineComponent({
          data: () => ({ rows: testUsers as User[] }),
          render () {
            return h(DataTable.Root as any, {}, () =>
              h(DataTable.Body as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return this.rows.map(user =>
                    h(DataTable.Row as any, { key: user.id, id: user.id, value: user }),
                  )
                },
              }),
            )
          },
        })

        const wrapper = mount(Host)
        await nextTick()
        expect(slotProps.items).toHaveLength(3)

        wrapper.setData({ rows: [testUsers[0]] })
        await nextTick()
        expect(slotProps.items).toHaveLength(1)
      })

      it('should unregister columns when they unmount', async () => {
        let context: any

        const Host = defineComponent({
          data: () => ({ columns: testColumns as { id: string, title: string }[] }),
          render () {
            return h(DataTable.Root as any, {}, {
              default: (props: any) => {
                context = props.context
                return this.columns.map(col =>
                  h(DataTable.Column, { key: col.id, id: col.id }),
                )
              },
            })
          },
        })

        const wrapper = mount(Host)
        await nextTick()
        expect(context.columns.size).toBe(2)

        wrapper.setData({ columns: [testColumns[0]] })
        await nextTick()
        expect(context.columns.size).toBe(1)
        expect(context.columns.has('name')).toBe(true)
        expect(context.columns.has('email')).toBe(false)
      })

      it('should filter through v-model:search', async () => {
        let slotProps: any

        const Host = defineComponent({
          data: () => ({ query: '' }),
          render () {
            return h(DataTable.Root as any, {
              'search': this.query,
              'onUpdate:search': (value: string) => {
                this.query = value
              },
            }, () =>
              h(DataTable.Table, {}, () => [
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    testColumns.map(col =>
                      h(DataTable.Column, {
                        key: col.id,
                        id: col.id,
                        sortable: col.sortable,
                        filterable: col.filterable,
                      }),
                    ),
                  ),
                ),
                h(DataTable.Body as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return testUsers.map(user =>
                      h(DataTable.Row as any, { key: user.id, id: user.id, value: user }),
                    )
                  },
                }),
              ]),
            )
          },
        })

        const wrapper = mount(Host)
        await nextTick()
        expect(slotProps.items).toHaveLength(3)

        wrapper.setData({ query: 'alice' })
        await nextTick()
        expect(slotProps.items.map((item: User) => item.name)).toEqual(['Alice'])
      })

      it('should onboard columns and rows after mount', async () => {
        let slotProps: any

        const Init = defineComponent({
          setup () {
            const context = useDataTableRoot('v0:data-table')
            onMounted(() => {
              context.columns.onboard(testColumns)
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })) as any)
            })
            return () => null
          },
        })

        mountRoot({
          slots: {
            default: () => [
              h(Init),
              h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('tr')
                  },
                }),
              ),
            ],
          },
        })

        expect(slotProps.isEmpty).toBe(true)

        await nextTick()

        expect(slotProps.isEmpty).toBe(false)
        expect(slotProps.items).toHaveLength(3)
      })
    })
  })

  describe('table', () => {
    describe('rendering', () => {
      it('should render as table by default', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.element.tagName).toBe('TABLE')
      })

      it('should have role="table" attribute', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.attributes('role')).toBe('table')
      })

      it('should omit aria-rowcount when the full table is in the DOM', async () => {
        const empty = mountRoot({
          slots: {
            default: () => h(DataTable.Table),
          },
        })

        expect(empty.findComponent(DataTable.Table as any).attributes('aria-rowcount')).toBeUndefined()

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table)
            },
          },
        })

        await nextTick()

        expect(wrapper.findComponent(DataTable.Table as any).attributes('aria-rowcount')).toBeUndefined()
      })

      it('should set aria-rowcount to header rows plus total when the page is truncated', async () => {
        const wrapper = mountRoot({
          props: { pagination: { itemsPerPage: 2 } },
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table)
            },
          },
        })

        await nextTick()

        expect(wrapper.findComponent(DataTable.Table as any).attributes('aria-rowcount')).toBe('4')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, { as: 'div' }),
          },
        })

        const table = wrapper.findComponent(DataTable.Table as any)
        expect(table.element.tagName).toBe('DIV')
        expect(table.attributes('role')).toBe('table')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, { renderless: true }, () =>
              h('div', { class: 'custom-table' }, 'content'),
            ),
          },
        })

        expect(wrapper.find('.custom-table').exists()).toBe(true)
        expect(wrapper.find('table').exists()).toBe(false)
      })
    })
  })

  describe('header', () => {
    describe('rendering', () => {
      it('should render as thead by default', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () => h(DataTable.Header)),
          },
        })

        const header = wrapper.findComponent(DataTable.Header as any)
        expect(header.element.tagName).toBe('THEAD')
      })

      it('should expose headers in slot props', () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, {
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

      it('should populate headers from a parent and children column tree', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard([
                { id: 'name', title: 'Name' },
                {
                  id: 'contact',
                  title: 'Contact',
                  children: [
                    { id: 'email', title: 'Email' },
                    { id: 'phone', title: 'Phone' },
                  ],
                },
              ])
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, {
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

        expect(slotProps.headers).toHaveLength(2)
        expect(slotProps.headers[0].find((header: any) => header.id === 'contact').colspan).toBe(2)
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () => h(DataTable.Header, { as: 'div' })),
          },
        })

        const header = wrapper.findComponent(DataTable.Header as any)
        expect(header.element.tagName).toBe('DIV')
        expect(header.attributes('role')).toBe('rowgroup')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, { renderless: true }, () =>
                h('tr', { class: 'custom-head' }),
              ),
            ),
          },
        })

        expect(wrapper.find('.custom-head').exists()).toBe(true)
        expect(wrapper.find('thead').exists()).toBe(false)
      })

      it('should resolve context with custom namespace', () => {
        let slotProps: any

        mountRoot({
          props: { namespace: 'v0:custom-table' },
          slots: {
            default: () => h(DataTable.Table, { namespace: 'v0:custom-table' }, () =>
              h(DataTable.Header, { namespace: 'v0:custom-table' }, {
                default: (props: any) => {
                  slotProps = props
                  return h('tr')
                },
              }),
            ),
          },
        })

        expect(Array.isArray(slotProps.headers)).toBe(true)
      })
    })
  })

  describe('column', () => {
    describe('rendering', () => {
      it('should render as th by default', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Column)),
              ),
            ),
          },
        })

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.element.tagName).toBe('TH')
      })

      it('should have role="columnheader" attribute', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Column)),
              ),
            ),
          },
        })

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.attributes('role')).toBe('columnheader')
        expect(column.attributes('scope')).toBe('col')
      })

      it('should expose sort state when id is provided', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    h(DataTable.Column, { id: 'name' }, {
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
        expect(slotProps.direction).toBe('none')
        expect(slotProps.priority).toBe(-1)
        expect(typeof slotProps.toggle).toBe('function')
      })

      it('should toggle sort when toggle is called', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    h(DataTable.Column, { id: 'name' }, {
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
        expect(slotProps.direction).toBe('none')

        slotProps.toggle()
        await nextTick()
        expect(slotProps.direction).toBe('asc')

        slotProps.toggle()
        await nextTick()
        expect(slotProps.direction).toBe('desc')
      })

      it('should reorder items when a child-registered column toggles sort', async () => {
        let column: any
        let body: any

        mountRoot({
          slots: {
            default: () =>
              h(DataTable.Table, {}, () => [
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    testColumns.map(col =>
                      h(DataTable.Column, {
                        key: col.id,
                        id: col.id,
                        sortable: col.sortable,
                        filterable: col.filterable,
                      }, {
                        default: (props: any) => {
                          if (col.id === 'name') column = props
                          return h('button', { onClick: props.toggle }, col.title)
                        },
                      }),
                    ),
                  ),
                ),
                h(DataTable.Body as any, {}, {
                  default: (props: any) => {
                    body = props
                    return testUsers.map(user =>
                      h(DataTable.Row as any, { key: user.id, id: user.id, value: user }),
                    )
                  },
                }),
              ]),
          },
        })

        await nextTick()

        expect(column.isSortable).toBe(true)
        expect(body.items.map((item: User) => item.name)).toEqual(['Alice', 'Bob', 'Carol'])
        expect(body.sortedItems.map((item: User) => item.name)).toEqual(['Alice', 'Bob', 'Carol'])

        column.toggle()
        await nextTick()
        expect(column.direction).toBe('asc')
        expect(body.sortedItems.map((item: User) => item.name)).toEqual(['Alice', 'Bob', 'Carol'])

        column.toggle()
        await nextTick()
        expect(column.direction).toBe('desc')
        expect(body.sortedItems.map((item: User) => item.name)).toEqual(['Carol', 'Bob', 'Alice'])
      })

      it('should have aria-sort attribute when sortable', async () => {
        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    h(DataTable.Column, { id: 'name' }, () => 'Name'),
                  ),
                ),
              )
            },
          },
        })

        await nextTick()

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.attributes('aria-sort')).toBe('none')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Column, { as: 'div' })),
              ),
            ),
          },
        })

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.element.tagName).toBe('DIV')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Column, { renderless: true }, () =>
                    h('div', { class: 'custom-header-cell' }, 'Name'),
                  ),
                ),
              ),
            ),
          },
        })

        expect(wrapper.find('.custom-header-cell').exists()).toBe(true)
      })

      it('should expose inert sort state when id is omitted', () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Column, {}, {
                    default: (props: any) => {
                      slotProps = props
                      return h('span', 'Name')
                    },
                  }),
                ),
              ),
            ),
          },
        })

        expect(slotProps.isSortable).toBe(false)
        expect(slotProps.direction).toBe('none')
        expect(slotProps.priority).toBe(-1)

        slotProps.toggle()
        expect(slotProps.direction).toBe('none')
      })

      it('should omit aria-sort and ignore toggle when column is not sortable', async () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    h(DataTable.Column, { id: 'email' }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('span', 'Email')
                      },
                    }),
                  ),
                ),
              )
            },
          },
        })

        await nextTick()

        expect(slotProps.isSortable).toBe(false)
        expect(wrapper.findComponent(DataTable.Column as any).attributes('aria-sort')).toBeUndefined()

        slotProps.toggle()
        await nextTick()
        expect(slotProps.direction).toBe('none')
      })

      it('should set aria-sort to ascending and descending when toggled', async () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    h(DataTable.Column, { id: 'name' }, {
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

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.attributes('aria-sort')).toBe('none')

        slotProps.toggle()
        await nextTick()
        expect(column.attributes('aria-sort')).toBe('ascending')

        slotProps.toggle()
        await nextTick()
        expect(column.attributes('aria-sort')).toBe('descending')
      })

      it('should support colspan and rowspan attributes', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Column, { colspan: 2, rowspan: 3 }, () => 'Name'),
                ),
              ),
            ),
          },
        })

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.attributes('colspan')).toBe('2')
        expect(column.attributes('rowspan')).toBe('3')
        expect(column.attributes('scope')).toBe('colgroup')
      })

      it('should cycle data-direction and priority through none, asc, and desc', async () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, {}, () =>
                h(DataTable.Header, {}, () =>
                  h(DataTable.Row as any, {}, () =>
                    h(DataTable.Column, { id: 'name' }, {
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

        const column = wrapper.findComponent(DataTable.Column as any)
        expect(column.attributes('data-direction')).toBeUndefined()
        expect(slotProps.priority).toBe(-1)

        slotProps.toggle()
        await nextTick()
        expect(column.attributes('data-direction')).toBe('asc')
        expect(slotProps.priority).toBe(0)

        slotProps.toggle()
        await nextTick()
        expect(column.attributes('data-direction')).toBe('desc')
        expect(slotProps.priority).toBe(0)

        slotProps.toggle()
        await nextTick()
        expect(column.attributes('data-direction')).toBeUndefined()
        expect(slotProps.priority).toBe(-1)
      })

      it('should resolve sort state with custom namespace', async () => {
        let slotProps: any

        mountRoot({
          props: { namespace: 'v0:custom-table' },
          slots: {
            default: ({ context }: any) => {
              context.columns.onboard(testColumns)
              return h(DataTable.Table, { namespace: 'v0:custom-table' }, () =>
                h(DataTable.Header, { namespace: 'v0:custom-table' }, () =>
                  h(DataTable.Row as any, { namespace: 'v0:custom-table' }, () =>
                    h(DataTable.Column, { namespace: 'v0:custom-table', id: 'name' }, {
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

        expect(slotProps.isSortable).toBe(true)
        expect(slotProps.direction).toBe('none')
      })
    })
  })

  describe('body', () => {
    describe('rendering', () => {
      it('should render as tbody by default', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () => h(DataTable.Body as any)),
          },
        })

        const body = wrapper.findComponent(DataTable.Body as any)
        expect(body.element.tagName).toBe('TBODY')
      })

      it('should expose items in slot props', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, {
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
        expect(slotProps.sortedItems).toHaveLength(3)
        expect(typeof slotProps.rank).toBe('function')
        expect(slotProps.isEmpty).toBe(false)
      })

      it('should set isEmpty when no items', () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, {
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

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () => h(DataTable.Body as any, { as: 'div' })),
          },
        })

        const body = wrapper.findComponent(DataTable.Body as any)
        expect(body.element.tagName).toBe('DIV')
        expect(body.attributes('role')).toBe('rowgroup')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, { renderless: true }, () =>
                h('tr', { class: 'custom-body' }),
              ),
            ),
          },
        })

        expect(wrapper.find('.custom-body').exists()).toBe(true)
        expect(wrapper.find('tbody').exists()).toBe(false)
      })

      it('should resolve items with custom namespace', async () => {
        let slotProps: any

        mountRoot({
          props: { namespace: 'v0:custom-table' },
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, { namespace: 'v0:custom-table' }, () =>
                h(DataTable.Body as any, { namespace: 'v0:custom-table' }, {
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

        expect(slotProps.items).toHaveLength(3)
        expect(slotProps.isEmpty).toBe(false)
      })

      it('should expose the current page of items through the pipeline', async () => {
        let slotProps: any
        let table: any

        const wrapper = mountRoot({
          props: { pagination: { itemsPerPage: 2 } },
          slots: {
            default: ({ context }: any) => {
              table = context
              context.columns.onboard(testColumns)
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return [
                      ...props.items.map((item: User, i: number) =>
                        h(DataTable.Row as any, { key: item.id, id: item.id, index: props.rowStart + i }, () =>
                          h(DataTable.Cell, {}, () => item.name),
                        ),
                      ),
                      h(DataTable.Empty, {}, () => 'No data'),
                    ]
                  },
                }),
              )
            },
          },
        })

        await nextTick()

        expect(slotProps.items).toHaveLength(2)
        expect(slotProps.items[0].name).toBe('Alice')
        expect(slotProps.rowStart).toBe(2)
        expect(wrapper.text()).not.toContain('No data')
        expect(wrapper.findComponent(DataTable.Row as any).attributes('aria-rowindex')).toBe('2')

        table.search('carol@test.com')
        await nextTick()
        expect(slotProps.items).toHaveLength(1)
        expect(slotProps.items[0].name).toBe('Carol')

        table.search('')
        await nextTick()
        table.sort.toggle('name')
        await nextTick()
        table.sort.toggle('name')
        await nextTick()

        const cells = wrapper.findAllComponents(DataTable.Cell as any)
        expect(cells[0].text()).toBe('Carol')
        expect(slotProps.items.map((item: User) => item.name)).toEqual(['Carol', 'Bob'])
      })
    })
  })

  describe('row', () => {
    describe('rendering', () => {
      it('should render as tr by default', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () => h(DataTable.Row)),
            ),
          },
        })

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.element.tagName).toBe('TR')
      })

      it('should have role="row" attribute', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () => h(DataTable.Row)),
            ),
          },
        })

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('role')).toBe('row')
      })

      it('should expose selection state when id is provided', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1 }, {
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
        expect(slotProps.id).toBe(1)
        expect(slotProps.value).toEqual(testUsers[0])
      })

      it('should toggle selection when toggleSelection is called', async () => {
        let slotProps: any

        mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1 }, {
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

      it('should toggle selection when a selectable row is clicked', async () => {
        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1, selectable: true }, () => h('td', 'Alice')),
                ),
              )
            },
          },
        })

        await nextTick()
        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('aria-selected')).toBe('false')

        await row.trigger('click')
        expect(row.attributes('aria-selected')).toBe('true')

        await row.trigger('click')
        expect(row.attributes('aria-selected')).toBe('false')
      })

      it('should not toggle selection when a non-selectable row is clicked', async () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, {
                  default: () =>
                    h(DataTable.Row as any, { id: 1 }, {
                      default: (props: any) => {
                        slotProps = props
                        return h('td', 'Alice')
                      },
                    }),
                }),
              )
            },
          },
        })

        await nextTick()
        await wrapper.findComponent(DataTable.Row as any).trigger('click')
        expect(slotProps.isSelected).toBe(false)
      })

      it('should have aria-selected attribute when id is provided and selectable', async () => {
        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1, selectable: true }),
                ),
              )
            },
          },
        })

        await nextTick()

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('aria-selected')).toBe('false')
      })

      it('should omit aria-selected when id is provided without selectable', async () => {
        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1 }),
                ),
              )
            },
          },
        })

        await nextTick()

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('aria-selected')).toBeUndefined()
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () => h(DataTable.Row as any, { as: 'div' })),
            ),
          },
        })

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.element.tagName).toBe('DIV')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, { renderless: true }, () =>
                  h('div', { class: 'custom-row' }),
                ),
              ),
            ),
          },
        })

        expect(wrapper.find('.custom-row').exists()).toBe(true)
      })

      it('should expose inert selection state when id is omitted', () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('td')
                  },
                }),
              ),
            ),
          },
        })

        expect(slotProps.isSelected).toBe(false)
        expect(slotProps.isSelectable).toBe(false)
        expect(slotProps.isExpanded).toBe(false)
        expect(wrapper.findComponent(DataTable.Row as any).attributes('aria-selected')).toBeUndefined()

        slotProps.toggleSelection()
        slotProps.toggleExpansion()
        expect(slotProps.isSelected).toBe(false)
        expect(slotProps.isExpanded).toBe(false)
      })

      it('should toggle expansion and set data-expanded', async () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1 }, {
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
        expect(slotProps.isExpanded).toBe(false)
        expect(wrapper.findComponent(DataTable.Row as any).attributes('data-expanded')).toBeUndefined()

        slotProps.toggleExpansion()
        await nextTick()
        expect(slotProps.isExpanded).toBe(true)
        expect(wrapper.findComponent(DataTable.Row as any).attributes('data-expanded')).toBe('true')

        slotProps.toggleExpansion()
        await nextTick()
        expect(slotProps.isExpanded).toBe(false)
        expect(wrapper.findComponent(DataTable.Row as any).attributes('data-expanded')).toBeUndefined()
      })

      it('should set aria-selected and data-selected when selected', async () => {
        let slotProps: any

        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () =>
                  h(DataTable.Row as any, { id: 1, selectable: true }, {
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

        const row = wrapper.findComponent(DataTable.Row as any)
        expect(row.attributes('aria-selected')).toBe('false')
        expect(row.attributes('data-selected')).toBeUndefined()

        slotProps.toggleSelection()
        await nextTick()
        expect(row.attributes('aria-selected')).toBe('true')
        expect(row.attributes('data-selected')).toBe('true')

        slotProps.toggleSelection()
        await nextTick()
        expect(row.attributes('aria-selected')).toBe('false')
        expect(row.attributes('data-selected')).toBeUndefined()
      })

      it('should resolve selection state with custom namespace', async () => {
        let slotProps: any

        mountRoot({
          props: { namespace: 'v0:custom-table' },
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, { namespace: 'v0:custom-table' }, () =>
                h(DataTable.Body as any, { namespace: 'v0:custom-table' }, () =>
                  h(DataTable.Row as any, { namespace: 'v0:custom-table', id: 1 }, {
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

        expect(slotProps.isSelectable).toBe(true)
        expect(slotProps.isSelected).toBe(false)
      })
    })
  })

  describe('cell', () => {
    describe('rendering', () => {
      it('should render as td by default', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Cell)),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.element.tagName).toBe('TD')
      })

      it('should have role="cell" attribute', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Cell)),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.attributes('role')).toBe('cell')
      })

      it('should support colspan attribute', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Cell, { colspan: 3 })),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.attributes('colspan')).toBe('3')
      })

      it('should support rowspan attribute', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Cell, { rowspan: 3 })),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.attributes('rowspan')).toBe('3')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () => h(DataTable.Cell, { as: 'div' })),
              ),
            ),
          },
        })

        const cell = wrapper.findComponent(DataTable.Cell as any)
        expect(cell.element.tagName).toBe('DIV')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Cell, { renderless: true }, () =>
                    h('div', { class: 'custom-cell' }, 'Alice'),
                  ),
                ),
              ),
            ),
          },
        })

        expect(wrapper.find('.custom-cell').exists()).toBe(true)
      })
    })
  })

  describe('empty', () => {
    describe('rendering', () => {
      it('should render when items is empty', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () => h(DataTable.Empty, {}, () => 'No data')),
            ),
          },
        })

        const empty = wrapper.findComponent(DataTable.Empty as any)
        expect(empty.exists()).toBe(true)
        expect(empty.text()).toBe('No data')
      })

      it('should not render when items exist', async () => {
        const wrapper = mountRoot({
          slots: {
            default: ({ context }: any) => {
              context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
              return h(DataTable.Table, {}, () =>
                h(DataTable.Body as any, {}, () => h(DataTable.Empty, {}, () => 'No data')),
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

        mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
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
        expect(slotProps.columnCount).toBe(0)
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () => h(DataTable.Empty, { as: 'div' }, () => 'No data')),
            ),
          },
        })

        const empty = wrapper.findComponent(DataTable.Empty as any)
        expect(empty.element.tagName).toBe('DIV')
        expect(empty.attributes('role')).toBe('row')
        expect(empty.text()).toBe('No data')
      })

      it('should support renderless mode', () => {
        const wrapper = mountRoot({
          slots: {
            default: () => h(DataTable.Table, {}, () =>
              h(DataTable.Body as any, {}, () =>
                h(DataTable.Empty, { renderless: true }, () =>
                  h('div', { class: 'custom-empty' }, 'No data'),
                ),
              ),
            ),
          },
        })

        expect(wrapper.find('.custom-empty').exists()).toBe(true)
        expect(wrapper.find('.custom-empty').text()).toBe('No data')
      })

      it('should resolve empty state with custom namespace', () => {
        let slotProps: any

        const wrapper = mountRoot({
          props: { namespace: 'v0:custom-table' },
          slots: {
            default: () => h(DataTable.Table, { namespace: 'v0:custom-table' }, () =>
              h(DataTable.Body as any, { namespace: 'v0:custom-table' }, () =>
                h(DataTable.Empty, { namespace: 'v0:custom-table' }, {
                  default: (props: any) => {
                    slotProps = props
                    return h('span', 'No data')
                  },
                }),
              ),
            ),
          },
        })

        expect(wrapper.text()).toContain('No data')
        expect(typeof slotProps.isLoading).toBe('boolean')
      })
    })
  })

  describe('integration', () => {
    it('should work as complete table with data', async () => {
      const wrapper = mountRoot({
        slots: {
          default: ({ context }: any) => {
            context.columns.onboard(testColumns)
            context.onboard(testUsers.map(u => ({ id: u.id, value: u })))
            return h(DataTable.Table, {}, () => [
              h(DataTable.Header, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  testColumns.map(col =>
                    h(DataTable.Column, { key: col.id, id: col.id }, () => col.title),
                  ),
                ),
              ),
              h(DataTable.Body as any, {}, {
                default: ({ items }: any) =>
                  items.map((item: User) =>
                    h(DataTable.Row as any, { key: item.id, id: item.id }, () => [
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
      expect(wrapper.findComponent(DataTable.Header as any).exists()).toBe(true)
      expect(wrapper.findComponent(DataTable.Body as any).exists()).toBe(true)

      const rows = wrapper.findAllComponents(DataTable.Row as any)
      expect(rows).toHaveLength(4)

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
              h(DataTable.Header as any, {}, () =>
                h(DataTable.Row as any, {}, () =>
                  h(DataTable.Column as any, {}, () => 'Name'),
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
