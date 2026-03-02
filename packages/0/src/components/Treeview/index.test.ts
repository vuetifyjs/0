import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Treeview } from './index'

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
      it('should toggle on Enter key', async () => {
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
        await activator.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(itemProps.isOpen).toBe(!initial)
      })

      it('should toggle on Space key', async () => {
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
        await activator.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(itemProps.isOpen).toBe(!initial)
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
        expect(typeof slotProps.attrs.onKeydown).toBe('function')
        expect(slotProps.attrs.tabindex).toBe(0)
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
        expect(slotProps.attrs.role).toBe('checkbox')
        expect(typeof slotProps.attrs.onClick).toBe('function')
        expect(typeof slotProps.attrs.onKeydown).toBe('function')
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
