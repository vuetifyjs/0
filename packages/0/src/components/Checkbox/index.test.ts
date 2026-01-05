import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Checkbox } from './index'

describe('checkbox', () => {
  describe('standalone mode (CheckboxIndicator without Root)', () => {
    describe('v-model binding', () => {
      it('should bind to v-model boolean', async () => {
        let slotProps: any
        let emittedValue: boolean | undefined

        mount(Checkbox.Indicator, {
          props: {
            'onUpdate:modelValue': (value: unknown) => {
              emittedValue = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.isChecked).toBe(false)

        slotProps.toggle()
        await nextTick()

        expect(emittedValue).toBe(true)
        expect(slotProps.isChecked).toBe(true)
      })

      it('should reflect initial true value', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          props: {
            modelValue: true,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.isChecked).toBe(true)
      })

      it('should check with check()', async () => {
        const checked = ref(false)

        let slotProps: any

        mount(Checkbox.Indicator, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        slotProps.check()
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should uncheck with uncheck()', async () => {
        const checked = ref(true)

        let slotProps: any

        mount(Checkbox.Indicator, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        slotProps.uncheck()
        await nextTick()

        expect(checked.value).toBe(false)
      })
    })

    describe('a11y attrs', () => {
      it('should have correct role', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.attrs.role).toBe('checkbox')
      })

      it('should set aria-checked based on state', async () => {
        let slotProps: any

        const wrapper = mount(Checkbox.Indicator, {
          props: {
            modelValue: false,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.attrs['aria-checked']).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(slotProps.attrs['aria-checked']).toBe(true)
      })

      it('should set tabindex to 0 when enabled', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.attrs.tabindex).toBe(0)
      })

      it('should set data-state correctly', async () => {
        let slotProps: any

        const wrapper = mount(Checkbox.Indicator, {
          props: {
            modelValue: false,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.attrs['data-state']).toBe('unchecked')

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(slotProps.attrs['data-state']).toBe('checked')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when disabled=true', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          props: {
            disabled: true,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.isDisabled).toBe(true)
        expect(slotProps.attrs['aria-disabled']).toBe(true)
        expect(slotProps.attrs.tabindex).toBeUndefined()
        expect(slotProps.attrs['data-disabled']).toBe('')
      })

      it('should not toggle when disabled', async () => {
        const checked = ref(false)

        let slotProps: any

        mount(Checkbox.Indicator, {
          props: {
            'disabled': true,
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        slotProps.toggle()
        await nextTick()

        expect(checked.value).toBe(false)
      })
    })

    describe('slot props', () => {
      it('should expose all required slot props', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          props: {
            id: 'my-checkbox',
            label: 'My Label',
            value: 'my-value',
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.id).toBe('my-checkbox')
        expect(slotProps.label).toBe('My Label')
        expect(slotProps.value).toBe('my-value')
        expect(typeof slotProps.isChecked).toBe('boolean')
        expect(typeof slotProps.isMixed).toBe('boolean')
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.check).toBe('function')
        expect(typeof slotProps.uncheck).toBe('function')
        expect(typeof slotProps.toggle).toBe('function')
        expect(typeof slotProps.mix).toBe('function')
        expect(typeof slotProps.unmix).toBe('function')
      })

      it('should generate id if not provided', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.id).toBeDefined()
        expect(typeof slotProps.id).toBe('string')
      })
    })

    describe('isMixed in standalone', () => {
      it('should always be false in standalone mode', async () => {
        let slotProps: any

        mount(Checkbox.Indicator, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return 'Checkbox'
            },
          },
        })

        await nextTick()

        expect(slotProps.isMixed).toBe(false)

        // mix() should be a no-op in standalone mode
        slotProps.mix()
        await nextTick()

        expect(slotProps.isMixed).toBe(false)
      })
    })
  })

  describe('group mode (CheckboxIndicator within Root)', () => {
    describe('rendering', () => {
      it('should render Root as renderless', () => {
        const wrapper = mount(Checkbox.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose Root slot props', () => {
        let slotProps: any

        mount(Checkbox.Root, {
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

        mount(Checkbox.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item 1'
                },
              }),
          },
        })

        await nextTick()

        itemProps.toggle()
        await nextTick()

        expect(selected.value).toContain('item-1')
      })

      it('should support multiple selections', async () => {
        const selected = ref<string[]>([])

        let item1Props: any
        let item2Props: any

        mount(Checkbox.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return 'Item 1'
                },
              }),
              h(Checkbox.Indicator as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return 'Item 2'
                },
              }),
            ],
          },
        })

        await nextTick()

        item1Props.toggle()
        item2Props.toggle()
        await nextTick()

        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should reflect initial model value', async () => {
        let itemProps: any

        mount(Checkbox.Root, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item 1'
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isChecked).toBe(true)
      })
    })

    describe('batch operations', () => {
      it('should select all items with selectAll', async () => {
        const selected = ref<string[]>([])

        let rootProps: any

        mount(Checkbox.Root, {
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
                h(Checkbox.Indicator as any, { value: 'item-1' }, () => 'Item 1'),
                h(Checkbox.Indicator as any, { value: 'item-2' }, () => 'Item 2'),
                h(Checkbox.Indicator as any, { value: 'item-3' }, () => 'Item 3'),
              ]
            },
          },
        })

        await nextTick()

        rootProps.selectAll()
        await nextTick()

        expect(selected.value).toHaveLength(3)
      })

      it('should unselect all with unselectAll', async () => {
        const selected = ref<string[]>(['item-1', 'item-2', 'item-3'])

        let rootProps: any

        mount(Checkbox.Root, {
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
                h(Checkbox.Indicator as any, { value: 'item-1' }, () => 'Item 1'),
                h(Checkbox.Indicator as any, { value: 'item-2' }, () => 'Item 2'),
                h(Checkbox.Indicator as any, { value: 'item-3' }, () => 'Item 3'),
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

        mount(Checkbox.Root, {
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
                h(Checkbox.Indicator as any, { value: 'item-1' }, () => 'Item 1'),
                h(Checkbox.Indicator as any, { value: 'item-2' }, () => 'Item 2'),
              ]
            },
          },
        })

        await nextTick()

        rootProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(2)

        rootProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })

    describe('tri-state (mixed/indeterminate)', () => {
      it('should set mixed state with mix()', async () => {
        let itemProps: any

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item'
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

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item'
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

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item'
                },
              }),
          },
        })

        await nextTick()

        itemProps.mix()
        await nextTick()

        expect(itemProps.attrs['aria-checked']).toBe('mixed')
        expect(itemProps.attrs['data-state']).toBe('indeterminate')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when root is disabled', async () => {
        let itemProps: any

        mount(Checkbox.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item 1'
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
      })

      it('should be disabled when item is disabled', async () => {
        let itemProps: any

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return 'Item 1'
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
      })
    })

    describe('registration lifecycle', () => {
      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return showItem.value
                ? h(Checkbox.Indicator as any, { value: 'item-1' }, () => 'Item 1')
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

    describe('namespace isolation', () => {
      it('should use custom namespace for isolation', async () => {
        let group1ItemProps: any
        let group2ItemProps: any

        mount(defineComponent({
          render: () => [
            h(Checkbox.Root as any, { namespace: 'checkbox-1' }, () =>
              h(Checkbox.Indicator as any, { value: 'item-1', namespace: 'checkbox-1' }, {
                default: (props: any) => {
                  group1ItemProps = props
                  return 'Group 1 Item'
                },
              }),
            ),
            h(Checkbox.Root as any, { namespace: 'checkbox-2' }, () =>
              h(Checkbox.Indicator as any, { value: 'item-1', namespace: 'checkbox-2' }, {
                default: (props: any) => {
                  group2ItemProps = props
                  return 'Group 2 Item'
                },
              }),
            ),
          ],
        }))

        await nextTick()

        group1ItemProps.toggle()
        await nextTick()

        expect(group1ItemProps.isChecked).toBe(true)
        expect(group2ItemProps.isChecked).toBe(false)
      })
    })
  })

  describe('atom integration', () => {
    it('should render as button by default', () => {
      const wrapper = mount(Checkbox.Indicator, {
        slots: {
          default: () => 'Click me',
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render as specified element', () => {
      const wrapper = mount(Checkbox.Indicator, {
        props: {
          as: 'div',
        },
        slots: {
          default: () => 'Click me',
        },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should apply attrs to rendered element', async () => {
      const wrapper = mount(Checkbox.Indicator, {
        props: {
          modelValue: true,
        },
        slots: {
          default: () => 'Checkbox',
        },
      })

      await nextTick()

      const button = wrapper.find('button')
      expect(button.attributes('role')).toBe('checkbox')
      expect(button.attributes('aria-checked')).toBe('true')
      expect(button.attributes('tabindex')).toBe('0')
      expect(button.attributes('data-state')).toBe('checked')
    })
  })

  describe('sSR/Hydration', () => {
    it('should render standalone to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Indicator as any, { modelValue: true }, {
            default: () => 'Checkbox',
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('role="checkbox"')
      expect(html).toContain('aria-checked="true"')
      expect(html).toContain('data-state="checked"')
    })

    it('should render group to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, {}, {
            default: () => [
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: () => 'Item 1',
              }),
              h(Checkbox.Indicator as any, { value: 'item-2' }, {
                default: () => 'Item 2',
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
          h(Checkbox.Root as any, { modelValue: ['item-1'] }, {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: () => 'Item 1',
              }),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-checked="true"')
      expect(html).toContain('data-state="checked"')
    })

    it('should render disabled state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { disabled: true }, {
            default: () =>
              h(Checkbox.Indicator as any, { value: 'item-1' }, {
                default: () => 'Item 1',
              }),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-disabled="true"')
      expect(html).toContain('data-disabled')
    })
  })
})
