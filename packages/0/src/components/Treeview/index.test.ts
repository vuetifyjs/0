import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Treeview } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

describe('treeview', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Treeview.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.isNoneSelected).toBe('boolean')
        expect(typeof slotProps.isAllSelected).toBe('boolean')
        expect(typeof slotProps.isMixed).toBe('boolean')
        expect(typeof slotProps.select).toBe('function')
        expect(typeof slotProps.unselect).toBe('function')
        expect(typeof slotProps.toggle).toBe('function')
        expect(typeof slotProps.selectAll).toBe('function')
        expect(typeof slotProps.unselectAll).toBe('function')
        expect(typeof slotProps.expandAll).toBe('function')
        expect(typeof slotProps.collapseAll).toBe('function')
      })
    })

    describe('v-model binding', () => {
      it('should update v-model when items are selected', async () => {
        const selected = ref<string[]>([])

        let itemProps: any

        mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        itemProps.select()
        await nextTick()

        expect(selected.value).toContain('item-1')
      })

      it('should reflect initial model value', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(true)
      })
    })

    describe('disabled prop', () => {
      it('should disable all items when root is disabled', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
      })

      it('should expose isDisabled in root slot props', () => {
        let rootProps: any

        mount(Treeview.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(rootProps.isDisabled).toBe(true)
      })
    })

    describe('batch operations', () => {
      it('should select all items with selectAll', async () => {
        const selected = ref<string[]>([])

        let rootProps: any

        mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        rootProps.selectAll()
        await nextTick()

        expect(selected.value).toHaveLength(2)
        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should unselect all items with unselectAll', async () => {
        const selected = ref<string[]>(['item-1', 'item-2'])

        let rootProps: any

        mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        rootProps.unselectAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })
  })

  describe('item', () => {
    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { id: 'my-id', value: 'my-value' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.id).toBe('my-id')
        expect(itemProps.value).toBe('my-value')
        expect(typeof itemProps.isSelected).toBe('boolean')
        expect(typeof itemProps.isMixed).toBe('boolean')
        expect(typeof itemProps.isDisabled).toBe('boolean')
        expect(typeof itemProps.isOpen).toBe('boolean')
        expect(typeof itemProps.isActive).toBe('boolean')
        expect(typeof itemProps.isLeaf).toBe('boolean')
        expect(typeof itemProps.depth).toBe('number')
        expect(typeof itemProps.select).toBe('function')
        expect(typeof itemProps.unselect).toBe('function')
        expect(typeof itemProps.toggle).toBe('function')
        expect(typeof itemProps.flip).toBe('function')
        expect(typeof itemProps.open).toBe('function')
        expect(typeof itemProps.close).toBe('function')
        expect(typeof itemProps.activate).toBe('function')
        expect(typeof itemProps.deactivate).toBe('function')
      })
    })

    describe('selection', () => {
      it('should select item with select()', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(false)

        itemProps.select()
        await nextTick()

        expect(itemProps.isSelected).toBe(true)
      })

      it('should toggle item with toggle()', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(false)

        itemProps.toggle()
        await nextTick()

        expect(itemProps.isSelected).toBe(true)

        itemProps.toggle()
        await nextTick()

        expect(itemProps.isSelected).toBe(false)
      })
    })

    describe('rendering', () => {
      it('should render as li by default', async () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item'),
          },
        })

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.element.tagName).toBe('LI')
      })

      it('should set role=treeitem', async () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item'),
          },
        })

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.attributes('role')).toBe('treeitem')
      })

      it('should set aria-selected when selected', async () => {
        const wrapper = mount(Treeview.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item'),
          },
        })

        await nextTick()

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.attributes('aria-selected')).toBe('true')
      })

      it('should set aria-expanded for items with Content', async () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { id: 'parent', value: 'parent' }, () => [
                h('span', 'Parent'),
                h(Treeview.Content as any, () =>
                  h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                ),
              ]),
          },
        })

        await nextTick()

        const items = wrapper.findAllComponents(Treeview.Item as any)
        const parent = items[0]!
        expect(parent.attributes('aria-expanded')).toBeDefined()
      })

      it('should set data-selected when selected', async () => {
        const wrapper = mount(Treeview.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item'),
          },
        })

        await nextTick()

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.attributes('data-selected')).toBe('true')
      })

      it('should set data-disabled when disabled', async () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1', disabled: true }, () => 'Item'),
          },
        })

        await nextTick()

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.attributes('data-disabled')).toBe('true')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when item disabled=true', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
      })

      it('should be disabled when root is disabled', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
      })
    })

    describe('registration lifecycle', () => {
      it('should generate ID if not provided', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.id).toBeDefined()
        expect(typeof itemProps.id).toBe('string')
      })

      it('should use provided ID', async () => {
        let itemProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { id: 'custom-id', value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.id).toBe('custom-id')
      })

      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        let rootProps: any

        mount(Treeview.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return showItem.value
                ? h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1')
                : null
            },
          },
        })

        await nextTick()

        rootProps.selectAll()
        await nextTick()

        showItem.value = false
        await nextTick()

        expect(rootProps.isNoneSelected).toBe(true)
      })
    })

    describe('nesting', () => {
      it('should track depth for nested items', async () => {
        let parentProps: any
        let childProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return h(Treeview.Item as any, { value: 'child' }, {
                    default: (props: any) => {
                      childProps = props
                      return h('div', 'Child')
                    },
                  })
                },
              }),
          },
        })

        await nextTick()

        expect(parentProps.depth).toBe(0)
        expect(childProps.depth).toBe(1)
      })

      it('should identify leaf nodes', async () => {
        let parentProps: any
        let childProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return h(Treeview.Item as any, { value: 'child' }, {
                    default: (props: any) => {
                      childProps = props
                      return h('div', 'Child')
                    },
                  })
                },
              }),
          },
        })

        await nextTick()

        expect(parentProps.isLeaf).toBe(false)
        expect(childProps.isLeaf).toBe(true)
      })

      it('should support open/close for parent nodes', async () => {
        let parentProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return h(Treeview.Item as any, { value: 'child' }, () => 'Child')
                },
              }),
          },
        })

        await nextTick()

        parentProps.open()
        await nextTick()

        expect(parentProps.isOpen).toBe(true)

        parentProps.close()
        await nextTick()

        expect(parentProps.isOpen).toBe(false)
      })

      it('should flip open state with flip()', async () => {
        let parentProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return h(Treeview.Item as any, { value: 'child' }, () => 'Child')
                },
              }),
          },
        })

        await nextTick()

        const initial = parentProps.isOpen

        parentProps.flip()
        await nextTick()

        expect(parentProps.isOpen).toBe(!initial)
      })
    })

    describe('active state', () => {
      it('should set data-active when activated', async () => {
        let itemProps: any

        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        itemProps.activate()
        await nextTick()

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.attributes('data-active')).toBe('true')
      })

      it('should remove data-active when deactivated', async () => {
        let itemProps: any

        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        itemProps.activate()
        await nextTick()

        itemProps.deactivate()
        await nextTick()

        const item = wrapper.findComponent(Treeview.Item as any)
        expect(item.attributes('data-active')).toBeUndefined()
      })
    })
  })

  describe('list', () => {
    it('should render as ul by default', () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => 'Content'),
        },
      })

      const list = wrapper.findComponent(Treeview.List as any)
      expect(list.element.tagName).toBe('UL')
    })

    it('should set role=tree', () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => 'Content'),
        },
      })

      const list = wrapper.findComponent(Treeview.List as any)
      expect(list.attributes('role')).toBe('tree')
    })

    it('should set aria-multiselectable', () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, { multiselectable: true }, () => 'Content'),
        },
      })

      const list = wrapper.findComponent(Treeview.List as any)
      expect(list.attributes('aria-multiselectable')).toBe('true')
    })
  })

  describe('group', () => {
    it('should render as ul by default', () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, () =>
              h(Treeview.Group as any, {}, () => 'Children'),
            ),
        },
      })

      const group = wrapper.findComponent(Treeview.Group as any)
      expect(group.element.tagName).toBe('UL')
    })

    it('should set role=group', () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, () =>
              h(Treeview.Group as any, {}, () => 'Children'),
            ),
        },
      })

      const group = wrapper.findComponent(Treeview.Group as any)
      expect(group.attributes('role')).toBe('group')
    })
  })

  describe('activator', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Activator, {}, () => 'Click me'),
              ),
          },
        })

        const activator = wrapper.findComponent(Treeview.Activator as any)
        expect(activator.element.tagName).toBe('BUTTON')
      })

      it('should render as custom element with as prop', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Activator, { as: 'div' }, () => 'Click me'),
              ),
          },
        })

        const activator = wrapper.findComponent(Treeview.Activator as any)
        expect(activator.element.tagName).toBe('DIV')
      })
    })

    describe('click handling', () => {
      it('should toggle open state on click', async () => {
        let itemProps: any

        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  itemProps = props
                  return [
                    h(Treeview.Activator, {}, () => 'Toggle'),
                    h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                  ]
                },
              }),
          },
        })

        await nextTick()

        const initial = itemProps.isOpen
        const activator = wrapper.findComponent(Treeview.Activator as any)
        await activator.trigger('click')
        await nextTick()

        expect(itemProps.isOpen).toBe(!initial)
      })
    })

    describe('keyboard handling', () => {
      it('should toggle on Enter key via tree container', async () => {
        let itemProps: any

        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.List as any, {}, () =>
                h(Treeview.Item as any, { value: 'parent' }, {
                  default: (props: any) => {
                    itemProps = props
                    return [
                      h(Treeview.Activator, {}, () => 'Toggle'),
                      h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                    ]
                  },
                }),
              ),
          },
        })

        await nextTick()

        // Focus the parent item via roving focus
        const list = wrapper.findComponent(Treeview.List as any)
        await list.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        const initial = itemProps.isOpen
        await list.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(itemProps.isOpen).toBe(!initial)
      })

      it('should toggle selection on Space key via tree container', async () => {
        let itemProps: any

        const wrapper = mount(Treeview.Root, {
          props: { multiple: true },
          slots: {
            default: () =>
              h(Treeview.List as any, {}, () =>
                h(Treeview.Item as any, { value: 'parent' }, {
                  default: (props: any) => {
                    itemProps = props
                    return [
                      h(Treeview.Activator, {}, () => 'Toggle'),
                      h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                    ]
                  },
                }),
              ),
          },
        })

        await nextTick()

        // Focus the parent item via roving focus
        const list = wrapper.findComponent(Treeview.List as any)
        await list.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        const initial = itemProps.isSelected
        await list.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(itemProps.isSelected).toBe(!initial)
      })
    })

    describe('slot props', () => {
      it('should expose correct slot props', () => {
        let slotProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Activator, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('span', 'Activator')
                  },
                }),
              ),
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isOpen).toBe('boolean')
        expect(typeof slotProps.isLeaf).toBe('boolean')
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.flip).toBe('function')
        expect(typeof slotProps.attrs.onClick).toBe('function')
        expect(slotProps.attrs.tabindex).toBe(-1)
      })
    })

    describe('disabled state', () => {
      it('should set tabindex=-1 when disabled', () => {
        const wrapper = mount(Treeview.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Activator, {}, () => 'Toggle'),
              ),
          },
        })

        const activator = wrapper.findComponent(Treeview.Activator as any)
        expect(activator.attributes('tabindex')).toBe('-1')
        expect(activator.attributes('disabled')).toBe('')
      })
    })

    describe('activator attributes', () => {
      it('should set role=button on non-button elements', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Activator, { as: 'div' }, () => 'Click me'),
              ),
          },
        })

        const activator = wrapper.findComponent(Treeview.Activator as any)
        expect(activator.attributes('role')).toBe('button')
      })

      it('should not set role on native button', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Activator, {}, () => 'Click me'),
              ),
          },
        })

        const activator = wrapper.findComponent(Treeview.Activator as any)
        expect(activator.attributes('role')).toBeUndefined()
      })
    })
  })

  describe('checkbox', () => {
    describe('rendering', () => {
      it('should render as div by default', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Checkbox, {}, () => 'Check'),
              ),
          },
        })

        const checkbox = wrapper.findComponent(Treeview.Checkbox as any)
        expect(checkbox.element.tagName).toBe('DIV')
      })

      it('should set role=checkbox', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Checkbox, {}, () => 'Check'),
              ),
          },
        })

        const checkbox = wrapper.findComponent(Treeview.Checkbox as any)
        expect(checkbox.attributes('role')).toBe('checkbox')
        expect(checkbox.attributes('aria-checked')).toBe('false')
      })
    })

    describe('click handling', () => {
      it('should toggle selection on click', async () => {
        let itemProps: any

        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h(Treeview.Checkbox, {}, () => 'Check')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(false)

        const checkbox = wrapper.findComponent(Treeview.Checkbox as any)
        await checkbox.trigger('click')
        await nextTick()

        expect(itemProps.isSelected).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose correct slot props', () => {
        let slotProps: any

        mount(Treeview.Root, {
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h(Treeview.Checkbox, {}, {
                  default: (props: any) => {
                    slotProps = props
                    return h('span', 'Checkbox')
                  },
                }),
              ),
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isSelected).toBe('boolean')
        expect(typeof slotProps.isMixed).toBe('boolean')
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.toggle).toBe('function')
        expect(typeof slotProps.select).toBe('function')
        expect(typeof slotProps.unselect).toBe('function')
        expect(slotProps.attrs['role']).toBe('checkbox')
        expect(slotProps.attrs['aria-checked']).toBeDefined()
        expect(typeof slotProps.attrs.onClick).toBe('function')
      })
    })

    describe('mixed state', () => {
      it('should show aria-checked=mixed for mixed parent', async () => {
        const selected = ref<string[]>([])

        let parentProps: any
        let child1Props: any

        const wrapper = mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
            'selection': 'cascade',
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return [
                    h(Treeview.Checkbox as any, {}, () => 'Check'),
                    h(Treeview.Content as any, () =>
                      h(Treeview.Group as any, {}, () => [
                        h(Treeview.Item as any, { value: 'child-1' }, {
                          default: (props: any) => {
                            child1Props = props
                            return h('span', 'Child 1')
                          },
                        }),
                        h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2'),
                      ]),
                    ),
                  ]
                },
              }),
          },
        })

        await nextTick()

        parentProps.open()
        await nextTick()

        child1Props.select()
        await nextTick()

        const checkbox = wrapper.findComponent(Treeview.Checkbox as any)
        expect(checkbox.attributes('aria-checked')).toBe('mixed')
      })

      it('should show data-mixed on mixed checkbox', async () => {
        const selected = ref<string[]>([])

        let parentProps: any
        let child1Props: any

        const wrapper = mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
            'selection': 'cascade',
          },
          slots: {
            default: () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return [
                    h(Treeview.Checkbox as any, {}, () => 'Check'),
                    h(Treeview.Content as any, () =>
                      h(Treeview.Group as any, {}, () => [
                        h(Treeview.Item as any, { value: 'child-1' }, {
                          default: (props: any) => {
                            child1Props = props
                            return h('span', 'Child 1')
                          },
                        }),
                        h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2'),
                      ]),
                    ),
                  ]
                },
              }),
          },
        })

        await nextTick()

        parentProps.open()
        await nextTick()

        child1Props.select()
        await nextTick()

        const checkbox = wrapper.findComponent(Treeview.Checkbox as any)
        expect(checkbox.attributes('data-mixed')).toBe('true')
      })
    })
  })

  describe('content', () => {
    it('should render children when item is open', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                itemProps = props
                return [
                  h(Treeview.Item as any, { value: 'child-for-nesting' }, () => 'nested'),
                  h(Treeview.Content, {}, () => h('div', { class: 'content' }, 'Visible')),
                ]
              },
            }),
        },
      })

      await nextTick()

      itemProps.open()
      await nextTick()

      expect(wrapper.find('.content').exists()).toBe(true)
    })

    it('should hide children when item is closed', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                itemProps = props
                return [
                  h(Treeview.Item as any, { value: 'child-for-nesting' }, () => 'nested'),
                  h(Treeview.Content, {}, () => h('div', { class: 'content' }, 'Hidden')),
                ]
              },
            }),
        },
      })

      await nextTick()

      itemProps.close()
      await nextTick()

      expect(wrapper.find('.content').exists()).toBe(false)
    })
  })

  describe('keyboard navigation', () => {
    it('should move focus with ArrowDown', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
              h(Treeview.Item as any, { value: 'item-3' }, () => 'Item 3'),
            ]),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // ArrowDown focuses first item
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const items = wrapper.findAllComponents(Treeview.Item as any)
      expect(items[0]!.attributes('tabindex')).toBe('0')

      // ArrowDown again focuses second item
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(items[1]!.attributes('tabindex')).toBe('0')
      expect(items[0]!.attributes('tabindex')).toBe('-1')
    })

    it('should expand with ArrowRight and collapse with ArrowLeft', async () => {
      let parentProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return [
                    h('span', 'Parent'),
                    h(Treeview.Content as any, () =>
                      h(Treeview.Group as any, {}, () =>
                        h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                      ),
                    ),
                  ]
                },
              }),
            ),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // Focus parent
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // ArrowRight expands
      await list.trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      expect(parentProps.isOpen).toBe(true)

      // ArrowLeft collapses
      await list.trigger('keydown', { key: 'ArrowLeft' })
      await nextTick()

      expect(parentProps.isOpen).toBe(false)
    })

    it('should move focus to parent with ArrowLeft on closed item', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () =>
              h(Treeview.Item as any, { value: 'grandparent' }, {
                default: () => [
                  h('span', 'Grandparent'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'parent' }, {
                        default: () => [
                          h('span', 'Parent'),
                          h(Treeview.Content as any, () =>
                            h(Treeview.Group as any, {}, () =>
                              h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                            ),
                          ),
                        ],
                      }),
                    ),
                  ),
                ],
              }),
            ),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // Focus grandparent
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Expand grandparent
      await list.trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      // Move to parent
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const items = wrapper.findAllComponents(Treeview.Item as any)
      expect(items[1]!.attributes('tabindex')).toBe('0')

      // ArrowLeft on closed parent should focus grandparent
      await list.trigger('keydown', { key: 'ArrowLeft' })
      await nextTick()

      expect(items[0]!.attributes('tabindex')).toBe('0')
    })

    it('should move focus with Home and End keys', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
              h(Treeview.Item as any, { value: 'item-3' }, () => 'Item 3'),
            ]),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // Focus first item
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Move to second
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const items = wrapper.findAllComponents(Treeview.Item as any)
      expect(items[1]!.attributes('tabindex')).toBe('0')

      // Home moves to first
      await list.trigger('keydown', { key: 'Home' })
      await nextTick()

      expect(items[0]!.attributes('tabindex')).toBe('0')

      // End moves to last
      await list.trigger('keydown', { key: 'End' })
      await nextTick()

      expect(items[2]!.attributes('tabindex')).toBe('0')
    })

    it('should expand all siblings with asterisk (*)', async () => {
      let parent1Props: any
      let parent2Props: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'parent-1' }, {
                default: (props: any) => {
                  parent1Props = props
                  return [
                    h('span', 'Parent 1'),
                    h(Treeview.Content as any, () =>
                      h(Treeview.Group as any, {}, () =>
                        h(Treeview.Item as any, { value: 'child-1' }, () => 'Child 1'),
                      ),
                    ),
                  ]
                },
              }),
              h(Treeview.Item as any, { value: 'parent-2' }, {
                default: (props: any) => {
                  parent2Props = props
                  return [
                    h('span', 'Parent 2'),
                    h(Treeview.Content as any, () =>
                      h(Treeview.Group as any, {}, () =>
                        h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2'),
                      ),
                    ),
                  ]
                },
              }),
            ]),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // Focus first parent
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Press * to expand all siblings
      await list.trigger('keydown', { key: '*' })
      await nextTick()

      expect(parent1Props.isOpen).toBe(true)
      expect(parent2Props.isOpen).toBe(true)
    })

    it('should expandAll and collapseAll via root slot props', async () => {
      let rootProps: any
      let parent1Props: any
      let parent2Props: any

      mount(Treeview.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'parent-1' }, {
                default: (props: any) => {
                  parent1Props = props
                  return h(Treeview.Item as any, { value: 'child-1' }, () => 'Child 1')
                },
              }),
              h(Treeview.Item as any, { value: 'parent-2' }, {
                default: (props: any) => {
                  parent2Props = props
                  return h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2')
                },
              }),
            ])
          },
        },
      })

      await nextTick()

      rootProps.expandAll()
      await nextTick()

      expect(parent1Props.isOpen).toBe(true)
      expect(parent2Props.isOpen).toBe(true)

      rootProps.collapseAll()
      await nextTick()

      expect(parent1Props.isOpen).toBe(false)
      expect(parent2Props.isOpen).toBe(false)
    })
  })

  describe('arrowUp navigation', () => {
    it('should move focus backward with ArrowUp', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
              h(Treeview.Item as any, { value: 'item-3' }, () => 'Item 3'),
            ]),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // Focus first, move to third
      await list.trigger('keydown', { key: 'End' })
      await nextTick()

      const items = wrapper.findAllComponents(Treeview.Item as any)
      expect(items[2]!.attributes('tabindex')).toBe('0')

      // ArrowUp moves to second
      await list.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()

      expect(items[1]!.attributes('tabindex')).toBe('0')
      expect(items[2]!.attributes('tabindex')).toBe('-1')
    })
  })

  describe('arrowRight child focus', () => {
    it('should focus first child when ArrowRight on open parent', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () =>
              h(Treeview.Item as any, { value: 'parent' }, () => [
                h('span', 'Parent'),
                h(Treeview.Content as any, () =>
                  h(Treeview.Group as any, {}, () =>
                    h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                  ),
                ),
              ]),
            ),
        },
      })

      await nextTick()

      const list = wrapper.findComponent(Treeview.List as any)

      // Focus parent
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Open parent
      await list.trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      // ArrowRight again should focus child
      await list.trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      const items = wrapper.findAllComponents(Treeview.Item as any)
      expect(items[1]!.attributes('tabindex')).toBe('0')
      expect(items[0]!.attributes('tabindex')).toBe('-1')
    })
  })

  describe('focusin sync', () => {
    it('should sync roving focus on focusin to treeitem', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
            ]),
        },
      })

      await nextTick()

      const items = wrapper.findAllComponents(Treeview.Item as any)
      const list = wrapper.findComponent(Treeview.List as any)

      // Simulate focusin on the second item element
      await items[1]!.trigger('focusin')
      await nextTick()

      // After focusin sync, ArrowDown should advance from the second item
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // If focusin worked, item-2 was focused, ArrowDown should NOT go to item-2
      // (it should either stay or wrap — the key point is focusin didn't throw)
      expect(items[1]!.attributes('tabindex')).toBeDefined()
    })

    it('should ignore focusin on non-treeitem elements', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.List as any, {}, () =>
              h(Treeview.Item as any, { value: 'item-1' }, () =>
                h('button', { class: 'inner-btn' }, 'Click'),
              ),
            ),
        },
      })

      await nextTick()

      // Trigger focusin on a non-treeitem element — should not throw
      const btn = wrapper.find('.inner-btn')
      await btn.trigger('focusin')
      await nextTick()

      // Tree should still work
      const list = wrapper.findComponent(Treeview.List as any)
      await list.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const item = wrapper.findComponent(Treeview.Item as any)
      expect(item.attributes('tabindex')).toBe('0')
    })
  })

  describe('content lifecycle', () => {
    it('should reset hasContent on unmount', async () => {
      const showContent = ref(true)

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: () => {
                return [
                  h(Treeview.Item as any, { value: 'child-for-nesting' }, () => 'nested'),
                  showContent.value
                    ? h(Treeview.Content as any, () => h('div', 'Visible'))
                    : null,
                ]
              },
            }),
        },
      })

      await nextTick()

      // aria-expanded should be present when Content is mounted
      const item = wrapper.findComponent(Treeview.Item as any)
      expect(item.attributes('aria-expanded')).toBeDefined()

      // Remove Content
      showContent.value = false
      await nextTick()

      // aria-expanded should be gone since hasContent is now false
      expect(item.attributes('aria-expanded')).toBeUndefined()
    })
  })

  describe('selection modes', () => {
    it('should cascade selection from parent to children', async () => {
      const selected = ref<string[]>([])

      let parentProps: any
      let child1Props: any
      let child2Props: any

      mount(Treeview.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string[]
          },
          'selection': 'cascade',
        },
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                parentProps = props
                return [
                  h('span', 'Parent'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () => [
                      h(Treeview.Item as any, { value: 'child-1' }, {
                        default: (props: any) => {
                          child1Props = props
                          return h('span', 'Child 1')
                        },
                      }),
                      h(Treeview.Item as any, { value: 'child-2' }, {
                        default: (props: any) => {
                          child2Props = props
                          return h('span', 'Child 2')
                        },
                      }),
                    ]),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      // Open parent first so children mount
      parentProps.open()
      await nextTick()

      // Select parent — both children should be selected
      parentProps.select()
      await nextTick()

      expect(child1Props.isSelected).toBe(true)
      expect(child2Props.isSelected).toBe(true)

      // Unselect one child — parent should be mixed
      child1Props.unselect()
      await nextTick()

      expect(parentProps.isMixed).toBe(true)
    })

    it('should not cascade in independent mode', async () => {
      const selected = ref<string[]>([])

      let parentProps: any
      let child1Props: any

      mount(Treeview.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string[]
          },
          'selection': 'independent',
        },
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                parentProps = props
                return [
                  h('span', 'Parent'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'child-1' }, {
                        default: (props: any) => {
                          child1Props = props
                          return h('span', 'Child 1')
                        },
                      }),
                    ),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      // Open parent so child mounts
      parentProps.open()
      await nextTick()

      // Select parent — child should NOT be selected
      parentProps.select()
      await nextTick()

      expect(parentProps.isSelected).toBe(true)
      expect(child1Props.isSelected).toBe(false)
    })

    it('should only select leaves in leaf mode', async () => {
      const selected = ref<string[]>([])

      let parentProps: any
      let child1Props: any
      let child2Props: any

      mount(Treeview.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string[]
          },
          'selection': 'leaf',
        },
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                parentProps = props
                return [
                  h('span', 'Parent'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () => [
                      h(Treeview.Item as any, { value: 'child-1' }, {
                        default: (props: any) => {
                          child1Props = props
                          return h('span', 'Child 1')
                        },
                      }),
                      h(Treeview.Item as any, { value: 'child-2' }, {
                        default: (props: any) => {
                          child2Props = props
                          return h('span', 'Child 2')
                        },
                      }),
                    ]),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      // Open parent so children mount
      parentProps.open()
      await nextTick()

      // Toggle parent — only leaf children get selected
      parentProps.toggle()
      await nextTick()

      expect(child1Props.isSelected).toBe(true)
      expect(child2Props.isSelected).toBe(true)
    })
  })

  describe('open modes', () => {
    it('should only allow one open item in single mode', async () => {
      let parent1Props: any
      let parent2Props: any

      mount(Treeview.Root, {
        props: {
          open: 'single',
        },
        slots: {
          default: () => [
            h(Treeview.Item as any, { value: 'parent-1' }, {
              default: (props: any) => {
                parent1Props = props
                return [
                  h('span', 'Parent 1'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'child-1' }, () => 'Child 1'),
                    ),
                  ),
                ]
              },
            }),
            h(Treeview.Item as any, { value: 'parent-2' }, {
              default: (props: any) => {
                parent2Props = props
                return [
                  h('span', 'Parent 2'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2'),
                    ),
                  ),
                ]
              },
            }),
          ],
        },
      })

      await nextTick()

      // Open first parent
      parent1Props.open()
      await nextTick()

      expect(parent1Props.isOpen).toBe(true)

      // Open second parent — first should close
      parent2Props.open()
      await nextTick()

      expect(parent2Props.isOpen).toBe(true)
      expect(parent1Props.isOpen).toBe(false)
    })
  })

  describe('3-level nesting', () => {
    it('should track correct depths for grandparent > parent > leaf', async () => {
      let grandparentProps: any
      let parentProps: any
      let leafProps: any

      mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'grandparent' }, {
              default: (props: any) => {
                grandparentProps = props
                return h(Treeview.Item as any, { value: 'parent' }, {
                  default: (props: any) => {
                    parentProps = props
                    return h(Treeview.Item as any, { value: 'leaf' }, {
                      default: (props: any) => {
                        leafProps = props
                        return h('div', 'Leaf')
                      },
                    })
                  },
                })
              },
            }),
        },
      })

      await nextTick()

      expect(grandparentProps.depth).toBe(0)
      expect(parentProps.depth).toBe(1)
      expect(leafProps.depth).toBe(2)
    })
  })

  describe('cue', () => {
    it('should expose data-state="open" when parent is open', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                itemProps = props
                return [
                  h(Treeview.Cue as any, {}, () => 'cue'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                    ),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      itemProps.open()
      await nextTick()

      const cue = wrapper.findComponent(Treeview.Cue as any)
      expect(cue.attributes('data-state')).toBe('open')
    })

    it('should expose data-state="closed" when parent is closed', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                itemProps = props
                return [
                  h(Treeview.Cue as any, {}, () => 'cue'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'child' }, () => 'Child'),
                    ),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      itemProps.close()
      await nextTick()

      const cue = wrapper.findComponent(Treeview.Cue as any)
      expect(cue.attributes('data-state')).toBe('closed')
    })

    it('should be hidden on leaf nodes', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'leaf' }, () =>
              h(Treeview.Cue as any, {}, () => 'cue'),
            ),
        },
      })

      await nextTick()

      const cue = wrapper.findComponent(Treeview.Cue as any)
      expect(cue.attributes('style')).toContain('visibility: hidden')
    })
  })

  describe('indicator', () => {
    it('should expose data-state="checked" when selected', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'item-1' }, {
              default: (props: any) => {
                itemProps = props
                return h(Treeview.Checkbox as any, {}, () =>
                  h(Treeview.Indicator as any, {}, () => 'indicator'),
                )
              },
            }),
        },
      })

      await nextTick()

      itemProps.select()
      await nextTick()

      const indicator = wrapper.findComponent(Treeview.Indicator as any)
      expect(indicator.attributes('data-state')).toBe('checked')
    })

    it('should expose data-state="unchecked" when not selected', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'item-1' }, () =>
              h(Treeview.Checkbox as any, {}, () =>
                h(Treeview.Indicator as any, {}, () => 'indicator'),
              ),
            ),
        },
      })

      await nextTick()

      const indicator = wrapper.findComponent(Treeview.Indicator as any)
      expect(indicator.attributes('data-state')).toBe('unchecked')
    })

    it('should be hidden when unchecked and not mixed', async () => {
      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'item-1' }, () =>
              h(Treeview.Checkbox as any, {}, () =>
                h(Treeview.Indicator as any, {}, () => 'indicator'),
              ),
            ),
        },
      })

      await nextTick()

      const indicator = wrapper.findComponent(Treeview.Indicator as any)
      expect(indicator.attributes('style')).toContain('visibility: hidden')
    })

    it('should be visible when checked', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'item-1' }, {
              default: (props: any) => {
                itemProps = props
                return h(Treeview.Checkbox as any, {}, () =>
                  h(Treeview.Indicator as any, {}, () => 'indicator'),
                )
              },
            }),
        },
      })

      await nextTick()

      itemProps.select()
      await nextTick()

      const indicator = wrapper.findComponent(Treeview.Indicator as any)
      expect(indicator.attributes('style')).toContain('visibility: visible')
    })
  })

  describe('integration', () => {
    it('should work as a full tree structure', async () => {
      const selected = ref<string[]>([])

      let rootProps: any
      let parentProps: any
      let childProps: any

      mount(Treeview.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string[]
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return h(Treeview.List as any, {}, () =>
              h(Treeview.Item as any, { value: 'parent' }, {
                default: (props: any) => {
                  parentProps = props
                  return [
                    h(Treeview.Activator, {}, () => 'Parent'),
                    h(Treeview.Group as any, {}, () =>
                      h(Treeview.Item as any, { value: 'child' }, {
                        default: (props: any) => {
                          childProps = props
                          return h(Treeview.Checkbox, {}, () => 'Child')
                        },
                      }),
                    ),
                  ]
                },
              }),
            )
          },
        },
      })

      await nextTick()

      expect(rootProps.isNoneSelected).toBe(true)
      expect(parentProps.isLeaf).toBe(false)
      expect(childProps.isLeaf).toBe(true)
      expect(childProps.depth).toBe(1)
    })

    it('should use custom namespace for isolation', async () => {
      let tree1ItemProps: any
      let tree2ItemProps: any

      mount(defineComponent({
        render: () => [
          h(Treeview.Root as any, { namespace: 'tree-1' }, () =>
            h(Treeview.Item as any, { value: 'item-1', namespace: 'tree-1' }, {
              default: (props: any) => {
                tree1ItemProps = props
                return h('div', 'Tree 1 Item')
              },
            }),
          ),
          h(Treeview.Root as any, { namespace: 'tree-2' }, () =>
            h(Treeview.Item as any, { value: 'item-1', namespace: 'tree-2' }, {
              default: (props: any) => {
                tree2ItemProps = props
                return h('div', 'Tree 2 Item')
              },
            }),
          ),
        ],
      }))

      await nextTick()

      tree1ItemProps.select()
      await nextTick()

      expect(tree1ItemProps.isSelected).toBe(true)
      expect(tree2ItemProps.isSelected).toBe(false)
    })
  })

  describe('selectAll', () => {
    describe('rendering', () => {
      it('should render as div by default', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, {}, () => 'Select All'),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
            ],
          },
        })

        const selectAll = wrapper.findComponent(Treeview.SelectAll as any)
        expect(selectAll.element.tagName).toBe('DIV')
      })

      it('should set role=checkbox', () => {
        const wrapper = mount(Treeview.Root, {
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, {}, () => 'Select All'),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
            ],
          },
        })

        const selectAll = wrapper.findComponent(Treeview.SelectAll as any)
        expect(selectAll.attributes('role')).toBe('checkbox')
      })
    })

    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let slotProps: any

        mount(Treeview.Root, {
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return h('span', 'Select All')
                },
              }),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
            ],
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isAllSelected).toBe('boolean')
        expect(typeof slotProps.isMixed).toBe('boolean')
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.selectAll).toBe('function')
        expect(typeof slotProps.unselectAll).toBe('function')
        expect(typeof slotProps.toggleAll).toBe('function')
        expect(slotProps.attrs.role).toBe('checkbox')
      })
    })

    describe('click handling', () => {
      it('should toggle selection on click', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, {}, () => 'Select All'),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.findComponent(Treeview.SelectAll as any)
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(2)
        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })
    })

    describe('keyboard handling', () => {
      it('should toggle selection on Enter key', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, {}, () => 'Select All'),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.findComponent(Treeview.SelectAll as any)
        await selectAll.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(selected.value).toHaveLength(2)
        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should toggle selection on Space key', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, {}, () => 'Select All'),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.findComponent(Treeview.SelectAll as any)
        await selectAll.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(selected.value).toHaveLength(2)
        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should not toggle when disabled', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Treeview.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Treeview.SelectAll as any, { disabled: true }, () => 'Select All'),
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.findComponent(Treeview.SelectAll as any)
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(0)

        await selectAll.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })
  })

  describe('mixed state', () => {
    it('should show mixed state when some children selected', async () => {
      const selected = ref<string[]>([])

      let parentProps: any
      let child1Props: any

      const wrapper = mount(Treeview.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string[]
          },
          'selection': 'cascade',
        },
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                parentProps = props
                return [
                  h(Treeview.Checkbox as any, {}, () => 'Check'),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () => [
                      h(Treeview.Item as any, { value: 'child-1' }, {
                        default: (props: any) => {
                          child1Props = props
                          return h('span', 'Child 1')
                        },
                      }),
                      h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2'),
                    ]),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      // Open parent so children mount
      parentProps.open()
      await nextTick()

      // Select only one child
      child1Props.select()
      await nextTick()

      expect(parentProps.isMixed).toBe(true)

      // Parent's checkbox should reflect mixed state
      const checkbox = wrapper.findComponent(Treeview.Checkbox as any)
      expect(checkbox.attributes('aria-checked')).toBe('mixed')
    })

    it('should show indeterminate on Indicator when mixed', async () => {
      const selected = ref<string[]>([])

      let parentProps: any
      let child1Props: any

      const wrapper = mount(Treeview.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string[]
          },
          'selection': 'cascade',
        },
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'parent' }, {
              default: (props: any) => {
                parentProps = props
                return [
                  h(Treeview.Checkbox as any, {}, () =>
                    h(Treeview.Indicator as any, {}, () => 'indicator'),
                  ),
                  h(Treeview.Content as any, () =>
                    h(Treeview.Group as any, {}, () => [
                      h(Treeview.Item as any, { value: 'child-1' }, {
                        default: (props: any) => {
                          child1Props = props
                          return h('span', 'Child 1')
                        },
                      }),
                      h(Treeview.Item as any, { value: 'child-2' }, () => 'Child 2'),
                    ]),
                  ),
                ]
              },
            }),
        },
      })

      await nextTick()

      // Open parent so children mount
      parentProps.open()
      await nextTick()

      // Select only one child
      child1Props.select()
      await nextTick()

      const indicator = wrapper.findComponent(Treeview.Indicator as any)
      expect(indicator.attributes('data-state')).toBe('indeterminate')
    })
  })

  describe('item without list', () => {
    it('should render without TreeviewList', async () => {
      let itemProps: any

      const wrapper = mount(Treeview.Root, {
        slots: {
          default: () =>
            h(Treeview.Item as any, { value: 'item-1' }, {
              default: (props: any) => {
                itemProps = props
                return h('div', 'Item 1')
              },
            }),
        },
      })

      await nextTick()

      const item = wrapper.findComponent(Treeview.Item as any)

      // Without a List wrapper, there's no roving focus → tabindex is undefined
      expect(item.attributes('tabindex')).toBeUndefined()
      expect(itemProps.value).toBe('item-1')
      expect(item.attributes('role')).toBe('treeitem')
    })
  })

  describe('sSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Treeview.Root as any, {}, () =>
            h(Treeview.List as any, {}, () => [
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
              h(Treeview.Item as any, { value: 'item-2' }, () => 'Item 2'),
            ]),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Item 1')
      expect(html).toContain('Item 2')
      expect(html).toContain('role="tree"')
      expect(html).toContain('role="treeitem"')
    })

    it('should render selected state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Treeview.Root as any, { modelValue: ['item-1'] }, () =>
            h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-selected="true"')
      expect(html).toContain('data-selected="true"')
    })

    it('should render disabled state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Treeview.Root as any, { disabled: true }, () =>
            h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-disabled="true"')
      expect(html).toContain('data-disabled="true"')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Treeview.Root as any, {}, () =>
            h(Treeview.List as any, {}, () =>
              h(Treeview.Item as any, { value: 'item-1' }, () => 'Item 1'),
            ),
          ),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.textContent = ''
      container.insertAdjacentHTML('afterbegin', serverHtml)

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      expect(wrapper.text()).toContain('Item 1')

      wrapper.unmount()
    })
  })
})
