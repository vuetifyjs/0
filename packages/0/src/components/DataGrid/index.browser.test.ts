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

  describe('resizeHandle', () => {
    describe('rendering', () => {
      it('should render as div by default', async () => {
        let context: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name' }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, resizable: true },
          { id: 'email', size: 50, resizable: true },
        ])

        await nextTick()

        const handle = wrapper.findComponent(DataGrid.ResizeHandle as any)
        expect(handle.exists()).toBe(true)
        expect(handle.element.tagName).toBe('DIV')
      })

      it('should set role=separator attribute', async () => {
        let context: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name' }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, resizable: true },
          { id: 'email', size: 50, resizable: true },
        ])

        await nextTick()

        const handle = wrapper.findComponent(DataGrid.ResizeHandle as any)
        expect(handle.attributes('role')).toBe('separator')
      })

      it('should not render content when column is not resizable', async () => {
        let context: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name' }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, resizable: false },
          { id: 'email', size: 50, resizable: true },
        ])

        await nextTick()

        const handles = wrapper.findAll('[role="separator"]')
        expect(handles).toHaveLength(0)
      })
    })

    describe('accessibility', () => {
      it('should have aria-orientation set to vertical', async () => {
        let context: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name' }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, resizable: true },
          { id: 'email', size: 50, resizable: true },
        ])

        await nextTick()

        const handle = wrapper.findComponent(DataGrid.ResizeHandle as any)
        expect(handle.attributes('aria-orientation')).toBe('vertical')
      })

      it('should have aria-valuenow reflecting column size', async () => {
        let context: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name' }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 60, resizable: true },
          { id: 'email', size: 40, resizable: true },
        ])

        await nextTick()

        const handle = wrapper.findComponent(DataGrid.ResizeHandle as any)
        expect(handle.attributes('aria-valuenow')).toBe('60')
      })

      it('should have aria-disabled when disabled prop is true', async () => {
        let context: any

        const wrapper = mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name', disabled: true }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 50, resizable: true },
          { id: 'email', size: 50, resizable: true },
        ])

        await nextTick()

        const handle = wrapper.findComponent(DataGrid.ResizeHandle as any)
        expect(handle.attributes('aria-disabled')).toBe('true')
      })
    })

    describe('slot props', () => {
      it('should expose isDragging, isResizable, state, size, minSize, maxSize', async () => {
        let context: any
        let slotProps: any

        mount(DataGrid.Root, {
          slots: {
            default: (props: any) => {
              context = props.context
              return h(DataGrid.Table, {}, () =>
                h(DataGrid.Header, {}, () =>
                  h(DataGrid.Row, {}, () => [
                    h(DataGrid.Column, { column: 'name' }, () => 'Name'),
                    h(DataGrid.ResizeHandle, { column: 'name' }, {
                      default: (props: any) => {
                        slotProps = props
                        return 'handle'
                      },
                    }),
                    h(DataGrid.Column, { column: 'email' }, () => 'Email'),
                  ]),
                ),
              )
            },
          },
        })

        context.columns.onboard([
          { id: 'name', size: 60, minSize: 10, maxSize: 90, resizable: true },
          { id: 'email', size: 40, minSize: 10, maxSize: 90, resizable: true },
        ])

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(slotProps.isDragging).toBe(false)
        expect(slotProps.isResizable).toBe(true)
        expect(slotProps.state).toBe('inactive')
        expect(slotProps.size).toBe(60)
        expect(slotProps.minSize).toBe(10)
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
                  h(DataGrid.ResizeHandle, { column: 'name' }),
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
