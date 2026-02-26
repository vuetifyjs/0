import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Group } from './index'

describe('group', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Group.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        // GroupRoot is renderless - slot content is the root
        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Group.Root, {
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
        expect(typeof slotProps.toggleAll).toBe('function')
        expect(slotProps.attrs['aria-multiselectable']).toBe(true)
      })
    })

    describe('v-model binding', () => {
      it('should update v-model when items are selected', async () => {
        const selected = ref<string[]>([])

        let itemProps: any

        mount(Group.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        // Select the item
        itemProps.select()
        await nextTick()

        expect(selected.value).toContain('item-1')
      })

      it('should support multiple selections', async () => {
        const selected = ref<string[]>([])

        let item1Props: any
        let item2Props: any

        mount(Group.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h('div', 'Item 1')
                },
              }),
              h(Group.Item as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return h('div', 'Item 2')
                },
              }),
            ],
          },
        })

        await nextTick()

        item1Props.select()
        item2Props.select()
        await nextTick()

        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should reflect initial model value', async () => {
        const selected = ref<string[]>(['item-1'])

        let itemProps: any

        mount(Group.Root, {
          props: {
            modelValue: selected.value,
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

    describe('batch operations', () => {
      it('should select all items with selectAll', async () => {
        const selected = ref<string[]>([])

        let rootProps: any

        mount(Group.Root, {
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
                h(Group.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Group.Item as any, { value: 'item-2' }, () => 'Item 2'),
                h(Group.Item as any, { value: 'item-3' }, () => 'Item 3'),
              ]
            },
          },
        })

        await nextTick()

        rootProps.selectAll()
        await nextTick()

        expect(selected.value).toHaveLength(3)
        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
        expect(selected.value).toContain('item-3')
      })

      it('should unselect all items with unselectAll', async () => {
        const selected = ref<string[]>(['item-1', 'item-2', 'item-3'])

        let rootProps: any

        mount(Group.Root, {
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
                h(Group.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Group.Item as any, { value: 'item-2' }, () => 'Item 2'),
                h(Group.Item as any, { value: 'item-3' }, () => 'Item 3'),
              ]
            },
          },
        })

        await nextTick()

        rootProps.unselectAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })

      it('should toggle all with toggleAll', async () => {
        const selected = ref<string[]>([])

        let rootProps: any

        mount(Group.Root, {
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
                h(Group.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Group.Item as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        // Toggle to select all
        rootProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(2)

        // Toggle to unselect all
        rootProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })

    describe('selection state indicators', () => {
      it('should report isNoneSelected when nothing is selected', async () => {
        let rootProps: any

        mount(Group.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Group.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Group.Item as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        expect(rootProps.isNoneSelected).toBe(true)
        expect(rootProps.isAllSelected).toBe(false)
      })

      it('should report isAllSelected when all items are selected', async () => {
        let rootProps: any

        mount(Group.Root, {
          props: {
            modelValue: ['item-1', 'item-2'],
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Group.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Group.Item as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        expect(rootProps.isAllSelected).toBe(true)
        expect(rootProps.isNoneSelected).toBe(false)
      })

      it('should report isMixed when some items are selected', async () => {
        let rootProps: any

        mount(Group.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Group.Item as any, { value: 'item-1' }, () => 'Item 1'),
                h(Group.Item as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(true)
        expect(rootProps.isAllSelected).toBe(false)
        expect(rootProps.isNoneSelected).toBe(false)
      })
    })

    describe('disabled prop', () => {
      it('should disable all items when root is disabled', async () => {
        let itemProps: any

        mount(Group.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

        mount(Group.Root, {
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

    describe('mandatory prop', () => {
      it('should prevent deselecting last item when mandatory=true', async () => {
        const selected = ref<string[]>(['item-1'])

        let itemProps: any

        mount(Group.Root, {
          props: {
            'mandatory': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        // Try to unselect the only selected item
        itemProps.unselect()
        await nextTick()

        // Should still be selected
        expect(selected.value).toContain('item-1')
      })

      it('should auto-select first item when mandatory=force', async () => {
        const selected = ref<string[]>([])

        let itemProps: any

        mount(Group.Root, {
          props: {
            'mandatory': 'force',
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

    describe('enroll prop', () => {
      it('should auto-select items on registration when enroll=true', async () => {
        const selected = ref<string[]>([])

        let itemProps: any

        mount(Group.Root, {
          props: {
            'enroll': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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
  })

  describe('item', () => {
    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { id: 'my-id', value: 'my-value', label: 'My Label' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.id).toBe('my-id')
        expect(itemProps.label).toBe('My Label')
        expect(itemProps.value).toBe('my-value')
        expect(typeof itemProps.isSelected).toBe('boolean')
        expect(typeof itemProps.isMixed).toBe('boolean')
        expect(typeof itemProps.isDisabled).toBe('boolean')
        expect(typeof itemProps.select).toBe('function')
        expect(typeof itemProps.unselect).toBe('function')
        expect(typeof itemProps.toggle).toBe('function')
        expect(typeof itemProps.mix).toBe('function')
        expect(typeof itemProps.unmix).toBe('function')
      })

      it('should expose correct attrs', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.attrs.role).toBe('checkbox')
        expect(typeof itemProps.attrs['aria-checked']).toBeDefined()
        expect(typeof itemProps.attrs['aria-disabled']).toBe('boolean')
      })
    })

    describe('selection', () => {
      it('should select item with select()', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

      it('should unselect item with unselect()', async () => {
        let itemProps: any

        mount(Group.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(true)

        itemProps.unselect()
        await nextTick()

        expect(itemProps.isSelected).toBe(false)
      })

      it('should toggle item with toggle()', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

    describe('tri-state (mixed/indeterminate)', () => {
      it('should set mixed state with mix()', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isMixed).toBe(false)

        itemProps.mix()
        await nextTick()

        expect(itemProps.isMixed).toBe(true)
      })

      it('should clear mixed state with unmix()', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        itemProps.mix()
        await nextTick()

        expect(itemProps.isMixed).toBe(true)

        itemProps.unmix()
        await nextTick()

        expect(itemProps.isMixed).toBe(false)
      })

      it('should set aria-checked to mixed when in mixed state', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        itemProps.mix()
        await nextTick()

        expect(itemProps.attrs['aria-checked']).toBe('mixed')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when item disabled=true', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
        expect(itemProps.attrs['aria-disabled']).toBe(true)
      })

      it('should be disabled when root is disabled', async () => {
        let itemProps: any

        mount(Group.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

      it('should be disabled when both root and item are disabled', async () => {
        let itemProps: any

        mount(Group.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1', disabled: true }, {
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
      it('should register with parent on mount', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        // Item registered and has slot props
        expect(itemProps).toBeDefined()
        expect(itemProps.value).toBe('item-1')
      })

      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        let rootProps: any

        mount(Group.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return showItem.value
                ? h(Group.Item as any, { value: 'item-1' }, () => 'Item 1')
                : null
            },
          },
        })

        await nextTick()

        // Select the item
        rootProps.selectAll()
        await nextTick()

        showItem.value = false
        await nextTick()

        // After unmounting, the selection should be cleared
        expect(rootProps.isNoneSelected).toBe(true)
      })

      it('should generate ID if not provided', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
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

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { id: 'custom-id', value: 'item-1' }, {
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
    })

    describe('data attributes', () => {
      it('should set data-selected when selected', async () => {
        let itemProps: any

        mount(Group.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.attrs['data-selected']).toBe(true)
      })

      it('should set data-disabled when disabled', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.attrs['data-disabled']).toBe(true)
      })

      it('should set data-mixed when in mixed state', async () => {
        let itemProps: any

        mount(Group.Root, {
          slots: {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return h('div', 'Item')
                },
              }),
          },
        })

        await nextTick()

        itemProps.mix()
        await nextTick()

        expect(itemProps.attrs['data-mixed']).toBe(true)
      })
    })
  })

  describe('integration', () => {
    it('should work with multiple items', async () => {
      const selected = ref<string[]>([])

      let rootProps: any
      let item1Props: any
      let item2Props: any
      let item3Props: any

      mount(Group.Root, {
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
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h('div', 'Item 1')
                },
              }),
              h(Group.Item as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return h('div', 'Item 2')
                },
              }),
              h(Group.Item as any, { value: 'item-3' }, {
                default: (props: any) => {
                  item3Props = props
                  return h('div', 'Item 3')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      // Initially none selected
      expect(rootProps.isNoneSelected).toBe(true)

      // Select first item
      item1Props.select()
      await nextTick()

      expect(rootProps.isMixed).toBe(true)
      expect(item1Props.isSelected).toBe(true)
      expect(item2Props.isSelected).toBe(false)

      // Select all
      rootProps.selectAll()
      await nextTick()

      expect(rootProps.isAllSelected).toBe(true)
      expect(item1Props.isSelected).toBe(true)
      expect(item2Props.isSelected).toBe(true)
      expect(item3Props.isSelected).toBe(true)

      // Unselect all
      rootProps.unselectAll()
      await nextTick()

      expect(rootProps.isNoneSelected).toBe(true)
    })

    it('should use custom namespace for isolation', async () => {
      let group1ItemProps: any
      let group2ItemProps: any

      mount(defineComponent({
        render: () => [
          h(Group.Root as any, { namespace: 'group-1' }, () =>
            h(Group.Item as any, { value: 'item-1', namespace: 'group-1' }, {
              default: (props: any) => {
                group1ItemProps = props
                return h('div', 'Group 1 Item')
              },
            }),
          ),
          h(Group.Root as any, { namespace: 'group-2' }, () =>
            h(Group.Item as any, { value: 'item-1', namespace: 'group-2' }, {
              default: (props: any) => {
                group2ItemProps = props
                return h('div', 'Group 2 Item')
              },
            }),
          ),
        ],
      }))

      await nextTick()

      // Select in group 1
      group1ItemProps.select()
      await nextTick()

      // Only group 1 item should be selected
      expect(group1ItemProps.isSelected).toBe(true)
      expect(group2ItemProps.isSelected).toBe(false)
    })

    it('should skip disabled items in selectAll', async () => {
      const selected = ref<string[]>([])

      let rootProps: any
      let item1Props: any
      let item2Props: any

      mount(Group.Root, {
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
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h('div', 'Item 1')
                },
              }),
              h(Group.Item as any, { value: 'item-2', disabled: true }, {
                default: (props: any) => {
                  item2Props = props
                  return h('div', 'Item 2')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      rootProps.selectAll()
      await nextTick()

      expect(item1Props.isSelected).toBe(true)
      expect(item2Props.isSelected).toBe(false)
    })
  })

  describe('sSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Group.Root as any, {}, {
            default: () => [
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
              h(Group.Item as any, { value: 'item-2' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 2'),
              }),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Item 1')
      expect(html).toContain('Item 2')
      expect(html).toContain('role="checkbox"')
    })

    it('should render selected state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Group.Root as any, { modelValue: ['item-1'] }, {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-checked="true"')
      expect(html).toContain('data-selected="true"')
    })

    it('should render disabled state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Group.Root as any, { disabled: true }, {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-disabled="true"')
      expect(html).toContain('data-disabled="true"')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Group.Root as any, {}, {
            default: () =>
              h(Group.Item as any, { value: 'item-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Item 1'),
              }),
          }),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      expect(wrapper.text()).toContain('Item 1')

      wrapper.unmount()
    })
  })

  describe('edge cases', () => {
    it('should handle rapid selection changes', async () => {
      let itemProps: any

      mount(Group.Root, {
        slots: {
          default: () =>
            h(Group.Item as any, { value: 'item-1' }, {
              default: (props: any) => {
                itemProps = props
                return h('div', 'Item')
              },
            }),
        },
      })

      await nextTick()

      // Rapid toggling
      itemProps.toggle()
      itemProps.toggle()
      itemProps.toggle()
      itemProps.toggle()
      await nextTick()

      // Should end up unselected (even number of toggles)
      expect(itemProps.isSelected).toBe(false)
    })

    it('should handle items without value', async () => {
      let itemProps: any

      mount(Group.Root, {
        slots: {
          default: () =>
            h(Group.Item as any, {}, {
              default: (props: any) => {
                itemProps = props
                return h('div', 'Item')
              },
            }),
        },
      })

      await nextTick()

      expect(itemProps.value).toBeUndefined()
      expect(itemProps.id).toBeDefined()
    })

    it('should handle empty group', () => {
      let rootProps: any

      mount(Group.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return h('div', 'Empty group')
          },
        },
      })

      expect(rootProps.isNoneSelected).toBe(true)
      // With no items, isAllSelected is false (nothing to select)
      expect(rootProps.isAllSelected).toBe(false)
    })
  })
})
