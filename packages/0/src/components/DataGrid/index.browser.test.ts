import { describe, expect, it } from 'vitest'

import { DataGrid } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

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

      it('should set role=grid attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table),
          },
        })

        const table = wrapper.findComponent(DataGrid.Table as any)
        expect(table.attributes('role')).toBe('grid')
      })

      it('should expose role=grid via slot attrs when renderless', () => {
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
        expect(wrapper.find('.custom-grid').attributes('role')).toBe('grid')
        expect(slotProps.attrs.role).toBe('grid')
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

      it('should set role=rowgroup attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Header)),
          },
        })

        const header = wrapper.findComponent(DataGrid.Header as any)
        expect(header.attributes('role')).toBe('rowgroup')
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

      it('should expose role=rowgroup via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { renderless: true }, {
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
    })
  })

  describe('body', () => {
    describe('rendering', () => {
      it('should render as tbody by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Body)),
          },
        })

        const body = wrapper.findComponent(DataGrid.Body as any)
        expect(body.element.tagName).toBe('TBODY')
      })

      it('should set role=rowgroup attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, {}, () => h(DataGrid.Body)),
          },
        })

        const body = wrapper.findComponent(DataGrid.Body as any)
        expect(body.attributes('role')).toBe('rowgroup')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () => h(DataGrid.Table, { as: 'div' }, () => h(DataGrid.Body, { as: 'div' })),
          },
        })

        const body = wrapper.findComponent(DataGrid.Body as any)
        expect(body.element.tagName).toBe('DIV')
        expect(body.attributes('role')).toBe('rowgroup')
      })

      it('should expose role=rowgroup via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body, { renderless: true }, {
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
    })
  })

  describe('row', () => {
    describe('rendering', () => {
      it('should render as tr by default', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body, {}, () => h(DataGrid.Row)),
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
                h(DataGrid.Body, {}, () => h(DataGrid.Row)),
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
                h(DataGrid.Body, { as: 'div' }, () => h(DataGrid.Row, { as: 'div' })),
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
                h(DataGrid.Body, { as: 'div' }, () =>
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
      })

      it('should expose role=columnheader via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Header, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Column, { renderless: true }, {
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
        expect(slotProps.attrs.scope).toBe('col')
        expect(slotProps.isSortable).toBe(false)
        expect(slotProps.isSorted).toBe(false)
        expect(slotProps.sortDirection).toBeUndefined()
        expect(slotProps.isPinned).toBe(false)
        expect(slotProps.pinPosition).toBe(false)
        expect(slotProps.size).toBe(0)
      })

      it('should fall back to Atom when used outside a row', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
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
                h(DataGrid.Column, { column: 'name' }, {
                  default: (props: any) => {
                    slotProps = props
                    return 'Name'
                  },
                }),
              ),
            ),
          ),
        )

        context.columns.onboard([
          { id: 'name', sortable: true, size: 50 },
          { id: 'email', size: 50 },
        ])
        await nextTick()

        expect(slotProps.isSortable).toBe(true)
        expect(slotProps.isSorted).toBe(false)
        expect(slotProps.sortDirection).toBeUndefined()
        expect(slotProps.attrs['aria-sort']).toBe('none')
        expect(typeof slotProps.toggleSort).toBe('function')

        context.sort.toggle('name')
        await nextTick()

        expect(slotProps.isSorted).toBe(true)
        expect(slotProps.sortDirection).toBe('asc')
        expect(slotProps.attrs['aria-sort']).toBe('ascending')

        context.sort.toggle('name')
        await nextTick()

        expect(slotProps.isSorted).toBe(true)
        expect(slotProps.sortDirection).toBe('desc')
        expect(slotProps.attrs['aria-sort']).toBe('descending')

        context.sort.toggle('name')
        await nextTick()

        expect(slotProps.isSorted).toBe(false)
        expect(slotProps.sortDirection).toBeUndefined()
        expect(slotProps.attrs['aria-sort']).toBe('none')
      })

      it('should expose left and right pin positions from column tickets', async () => {
        let nameProps: any
        let emailProps: any
        const { context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Header, {}, () =>
              h(DataGrid.Row, {}, () => [
                h(DataGrid.Column, { column: 'name' }, {
                  default: (props: any) => {
                    nameProps = props
                    return 'Name'
                  },
                }),
                h(DataGrid.Column, { column: 'email' }, {
                  default: (props: any) => {
                    emailProps = props
                    return 'Email'
                  },
                }),
              ]),
            ),
          ),
        )

        context.columns.onboard([
          { id: 'name', size: 50, pinned: 'left' },
          { id: 'email', size: 50, pinned: 'right' },
        ])
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
                h(DataGrid.Body, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Cell, {}, () => 'Value')),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.element.tagName).toBe('TD')
      })

      it('should set role=gridcell attribute', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body, {}, () =>
                  h(DataGrid.Row, {}, () => h(DataGrid.Cell, {}, () => 'Value')),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.attributes('role')).toBe('gridcell')
      })

      it('should render content in slot', () => {
        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, {}, () =>
                h(DataGrid.Body, {}, () =>
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
                h(DataGrid.Body, { as: 'div' }, () =>
                  h(DataGrid.Row, { as: 'div' }, () =>
                    h(DataGrid.Cell, { as: 'div' }, () => 'Value'),
                  ),
                ),
              ),
          },
        })

        const cell = wrapper.findComponent(DataGrid.Cell as any)
        expect(cell.element.tagName).toBe('DIV')
        expect(cell.attributes('role')).toBe('gridcell')
      })

      it('should expose role=gridcell via slot attrs when renderless', () => {
        let slotProps: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: () =>
              h(DataGrid.Table, { as: 'div' }, () =>
                h(DataGrid.Body, { as: 'div' }, () =>
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
        expect(wrapper.find('.custom-cell').attributes('role')).toBe('gridcell')
        expect(slotProps.attrs.role).toBe('gridcell')
        expect(slotProps.isEditing).toBe(false)
        expect(slotProps.rowSpan).toBe(1)
      })
    })

    describe('editing and spans', () => {
      it('should expose isEditing when the active cell matches', async () => {
        let slotProps: any
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body, {}, () =>
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
        expect(wrapper.find('[role="gridcell"]').exists()).toBe(true)
      })

      it('should apply rowspan and hide covered cells', async () => {
        let firstProps: any
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, {}, () =>
            h(DataGrid.Body, {}, () => [
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

        const cells = wrapper.findAll('[role="gridcell"]')
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
                    h(DataGrid.Column, { column: 'name' }, {
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
                  h(DataGrid.Row, { resizable: true }, {
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
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name', as: 'span' }, {
                  default: (props: any) => {
                    slotProps = props
                    return 'Name'
                  },
                }),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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

      it('should resize columns from Handle keyboard interaction', async () => {
        const { wrapper, context } = mountRoot(() =>
          h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle, { label: 'Resize name', disabled: true }, {
                  default: (props: any) => {
                    handleProps = props
                    return h('div', { class: 'custom-handle', ...props.attrs })
                  },
                }),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle, { renderless: true, label: 'Resize name' }, {
                  default: (props: any) => {
                    handleProps = props
                    return h('button', { class: 'custom-handle', ...props.attrs }, '|')
                  },
                }),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
              h(DataGrid.Row, { resizable: true, class: 'flex' }, () => [
                h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                h(DataGrid.Handle),
                h(DataGrid.Column, { column: 'email' }, () => 'Email'),
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
                  h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                  h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                ]),
              ),
              h(DataGrid.Body, {}, () =>
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
      let context: any

      mount(DataGrid.Root, {
        slots: {
          default: (props: any) => {
            context = props.context
            return h(DataGrid.Table, {}, () =>
              h(DataGrid.Header, {}, () =>
                h(DataGrid.Row, {}, () => [
                  h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                  h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                ]),
              ),
            )
          },
        },
      })

      context.columns.onboard([
        { id: 'name', size: 50, minSize: 10, maxSize: 90, resizable: true },
        { id: 'email', size: 50, minSize: 10, maxSize: 90, resizable: true },
      ])

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
  })
})
