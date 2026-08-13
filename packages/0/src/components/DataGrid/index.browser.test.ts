import { describe, expect, it } from 'vitest'

import { DataGrid } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

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
              props.context.columns.onboard([
                { id: 'name', size: 60, resizable: true },
                { id: 'email', size: 40, resizable: true },
              ])
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
