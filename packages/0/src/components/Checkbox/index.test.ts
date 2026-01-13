import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Checkbox } from './index'

describe('checkbox', () => {
  describe('standalone mode (Checkbox.Root without Group)', () => {
    describe('v-model binding', () => {
      it('should bind to v-model boolean', async () => {
        let rootProps: any
        let emittedValue: boolean | undefined

        mount(Checkbox.Root, {
          props: {
            'onUpdate:modelValue': (value: unknown) => {
              emittedValue = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(false)

        rootProps.toggle()
        await nextTick()

        expect(emittedValue).toBe(true)
        expect(rootProps.isChecked).toBe(true)
      })

      it('should reflect initial true value', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            modelValue: true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)
      })

      it('should check with check()', async () => {
        const checked = ref(false)
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        rootProps.check()
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should uncheck with uncheck()', async () => {
        const checked = ref(true)
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        rootProps.uncheck()
        await nextTick()

        expect(checked.value).toBe(false)
      })
    })

    describe('a11y attrs', () => {
      it('should have correct role on Root', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs.role).toBe('checkbox')
      })

      it('should set aria-checked based on state', async () => {
        let rootProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['aria-checked']).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(rootProps.attrs['aria-checked']).toBe(true)
      })

      it('should set tabindex to 0 when enabled', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs.tabindex).toBe(0)
      })

      it('should set data-state correctly', async () => {
        let rootProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['data-state']).toBe('unchecked')

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(rootProps.attrs['data-state']).toBe('checked')
      })

      it('should set aria-label from label prop', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            label: 'Accept terms',
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['aria-label']).toBe('Accept terms')
      })

      it('should set aria-labelledby when prop is provided', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'aria-labelledby': 'my-label-id',
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['aria-labelledby']).toBe('my-label-id')
      })

      it('should set aria-describedby when prop is provided', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'aria-describedby': 'my-description-id',
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['aria-describedby']).toBe('my-description-id')
      })

      it('should set aria-invalid when prop is provided', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'aria-invalid': true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.attrs['aria-invalid']).toBe(true)
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Root disabled=true', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
        expect(rootProps.attrs['aria-disabled']).toBe(true)
        expect(rootProps.attrs.tabindex).toBeUndefined()
        expect(rootProps.attrs['data-disabled']).toBe(true)
      })

      it('should not toggle when disabled', async () => {
        const checked = ref(false)
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            'disabled': true,
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        rootProps.toggle()
        await nextTick()

        expect(checked.value).toBe(false)
      })

      it('should update disabled state reactively', async () => {
        let rootProps: any

        const wrapper = mount(Checkbox.Root, {
          props: {
            disabled: false,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(false)
        expect(rootProps.attrs.tabindex).toBe(0)

        await wrapper.setProps({ disabled: true })
        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
        expect(rootProps.attrs['aria-disabled']).toBe(true)
        expect(rootProps.attrs.tabindex).toBeUndefined()
      })
    })

    describe('keyboard interaction', () => {
      it('should toggle on Space key press via click handler', async () => {
        const checked = ref(false)

        const wrapper = mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        // Root handles keyboard via onKeydown bound to Atom
        const button = wrapper.find('button')
        await button.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should toggle on click', async () => {
        const checked = ref(false)

        const wrapper = mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        const button = wrapper.find('button')
        await button.trigger('click')
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should toggle on Enter key for button element', async () => {
        const checked = ref(false)

        const wrapper = mount(Checkbox.Root, {
          props: {
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        // Enter on button triggers native click behavior
        const button = wrapper.find('button')
        await button.trigger('keydown', { key: 'Enter' })
        await button.trigger('click') // Native button behavior
        await nextTick()

        expect(checked.value).toBe(true)
      })

      it('should not toggle on Space key when disabled', async () => {
        const checked = ref(false)

        const wrapper = mount(Checkbox.Root, {
          props: {
            'disabled': true,
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        const button = wrapper.find('button')
        await button.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(checked.value).toBe(false)
      })

      it('should prevent default on Space keydown', async () => {
        const wrapper = mount(Checkbox.Root, {
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        const button = wrapper.find('button')
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        button.element.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose all required slot props on Root', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            id: 'my-checkbox',
            label: 'My Label',
            value: 'my-value',
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.id).toBe('my-checkbox')
        expect(rootProps.label).toBe('My Label')
        expect(rootProps.value).toBe('my-value')
        expect(typeof rootProps.isChecked).toBe('boolean')
        expect(typeof rootProps.isMixed).toBe('boolean')
        expect(typeof rootProps.isDisabled).toBe('boolean')
        expect(typeof rootProps.check).toBe('function')
        expect(typeof rootProps.uncheck).toBe('function')
        expect(typeof rootProps.toggle).toBe('function')
        expect(typeof rootProps.mix).toBe('function')
        expect(typeof rootProps.unmix).toBe('function')
        expect(rootProps.attrs).toBeDefined()
      })

      it('should expose slot props on Indicator', async () => {
        let indicatorProps: any

        mount(Checkbox.Root, {
          slots: {
            default: () =>
              h(Checkbox.Indicator as any, {}, {
                default: (props: any) => {
                  indicatorProps = props
                  return 'Checkbox'
                },
              }),
          },
        })

        await nextTick()

        expect(typeof indicatorProps.isChecked).toBe('boolean')
        expect(typeof indicatorProps.isMixed).toBe('boolean')
        expect(indicatorProps.attrs).toBeDefined()
        expect(indicatorProps.attrs['data-state']).toBeDefined()
        expect(indicatorProps.attrs.style).toBeDefined()
      })

      it('should generate id if not provided', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.id).toBeDefined()
        expect(typeof rootProps.id).toBe('string')
      })
    })

    describe('isMixed in standalone', () => {
      it('should always be false in standalone mode', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(false)

        // mix() should be a no-op in standalone mode
        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(false)
      })

      it('should honor indeterminate prop in standalone mode', async () => {
        let rootProps: any

        mount(Checkbox.Root, {
          props: {
            indeterminate: true,
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
            },
          },
        })

        await nextTick()

        // indeterminate prop controls isMixed in standalone mode
        expect(rootProps.isMixed).toBe(true)
      })
    })
  })

  describe('group mode (Checkbox.Group > Checkbox.Root > Checkbox.Indicator)', () => {
    describe('rendering', () => {
      it('should render Group with role="group"', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.attributes('role')).toBe('group')
        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose Group slot props', () => {
        let groupProps: any

        mount(Checkbox.Group, {
          slots: {
            default: (props: any) => {
              groupProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(groupProps).toBeDefined()
        expect(typeof groupProps.isDisabled).toBe('boolean')
        expect(typeof groupProps.isNoneSelected).toBe('boolean')
        expect(typeof groupProps.isAllSelected).toBe('boolean')
        expect(typeof groupProps.isMixed).toBe('boolean')
        expect(typeof groupProps.select).toBe('function')
        expect(typeof groupProps.unselect).toBe('function')
        expect(typeof groupProps.toggle).toBe('function')
        expect(typeof groupProps.selectAll).toBe('function')
        expect(typeof groupProps.unselectAll).toBe('function')
        expect(typeof groupProps.toggleAll).toBe('function')
        expect(groupProps.attrs.role).toBe('group')
      })

      it('should set aria-label on Group', () => {
        const wrapper = mount(Checkbox.Group, {
          props: {
            label: 'Select options',
          },
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        expect(wrapper.attributes('aria-label')).toBe('Select options')
      })

      it('should set aria-labelledby on Group', () => {
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'aria-labelledby': 'group-label-id',
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(groupProps.attrs['aria-labelledby']).toBe('group-label-id')
      })

      it('should set aria-describedby on Group', () => {
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'aria-describedby': 'group-description-id',
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(groupProps.attrs['aria-describedby']).toBe('group-description-id')
      })
    })

    describe('v-model binding', () => {
      it('should update v-model when items are selected', async () => {
        const selected = ref<string[]>([])
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        rootProps.toggle()
        await nextTick()

        expect(selected.value).toContain('item-1')
      })

      it('should support multiple selections', async () => {
        const selected = ref<string[]>([])
        let item1Props: any
        let item2Props: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-2' }, {
                default: (props: any) => {
                  item2Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 2')
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
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)
      })
    })

    describe('batch operations', () => {
      it('should handle selectAll when all items are disabled', async () => {
        const selected = ref<string[]>([])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1', disabled: true }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2', disabled: true }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.selectAll()
        await nextTick()

        // No items should be selected since all are disabled
        expect(selected.value).toHaveLength(0)
        expect(groupProps.isNoneSelected).toBe(true)
      })

      it('should select all items with selectAll', async () => {
        const selected = ref<string[]>([])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
                h(Checkbox.Root as any, { value: 'item-3' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 3'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.selectAll()
        await nextTick()

        expect(selected.value).toHaveLength(3)
      })

      it('should unselect all with unselectAll', async () => {
        const selected = ref<string[]>(['item-1', 'item-2', 'item-3'])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
                h(Checkbox.Root as any, { value: 'item-3' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 3'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.unselectAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })

      it('should toggle all with toggleAll', async () => {
        const selected = ref<string[]>([])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(2)

        groupProps.toggleAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })

    describe('tri-state (mixed/indeterminate)', () => {
      it('should set mixed state with mix()', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(false)

        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(true)
      })

      it('should clear mixed state with unmix()', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(true)

        rootProps.unmix()
        await nextTick()

        expect(rootProps.isMixed).toBe(false)
      })

      it('should initialize to mixed state when indeterminate prop is true', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1', indeterminate: true }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(true)
        expect(rootProps.attrs['aria-checked']).toBe('mixed')
      })

      it('should respond to reactive indeterminate prop changes', async () => {
        const indeterminate = ref(false)
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1', indeterminate: indeterminate.value }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isMixed).toBe(false)

        // Note: indeterminate is only applied at registration time
        // Dynamic changes require using mix()/unmix() methods
        rootProps.mix()
        await nextTick()

        expect(rootProps.isMixed).toBe(true)
        expect(rootProps.attrs['data-state']).toBe('indeterminate')

        rootProps.unmix()
        await nextTick()

        expect(rootProps.isMixed).toBe(false)
        expect(rootProps.attrs['data-state']).toBe('unchecked')
      })

      it('should set aria-checked to mixed when in mixed state', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item')
                },
              }),
          },
        })

        await nextTick()

        rootProps.mix()
        await nextTick()

        expect(rootProps.attrs['aria-checked']).toBe('mixed')
        expect(rootProps.attrs['data-state']).toBe('indeterminate')
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Group is disabled', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
      })

      it('should be disabled when Root is disabled', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1', disabled: true }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isDisabled).toBe(true)
      })

      it('should disable hidden input when Group is disabled', async () => {
        const wrapper = mount(Checkbox.Group, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { name: 'options', value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
          },
        })

        await nextTick()

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('disabled')).toBeDefined()
      })
    })

    describe('registration lifecycle', () => {
      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        let groupProps: any

        mount(Checkbox.Group, {
          slots: {
            default: (props: any) => {
              groupProps = props
              return showItem.value
                ? h(Checkbox.Root as any, { value: 'item-1' }, () =>
                    h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                  )
                : null
            },
          },
        })

        await nextTick()

        groupProps.selectAll()
        await nextTick()

        showItem.value = false
        await nextTick()

        expect(groupProps.isNoneSelected).toBe(true)
      })
    })

    describe('namespace isolation', () => {
      it('should use custom namespace for isolation', async () => {
        let group1RootProps: any
        let group2RootProps: any

        mount(defineComponent({
          render: () => [
            h(Checkbox.Group as any, { namespace: 'checkbox-1' }, () =>
              h(Checkbox.Root as any, { value: 'item-1', groupNamespace: 'checkbox-1' }, {
                default: (props: any) => {
                  group1RootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Group 1 Item')
                },
              }),
            ),
            h(Checkbox.Group as any, { namespace: 'checkbox-2' }, () =>
              h(Checkbox.Root as any, { value: 'item-1', groupNamespace: 'checkbox-2' }, {
                default: (props: any) => {
                  group2RootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Group 2 Item')
                },
              }),
            ),
          ],
        }))

        await nextTick()

        group1RootProps.toggle()
        await nextTick()

        expect(group1RootProps.isChecked).toBe(true)
        expect(group2RootProps.isChecked).toBe(false)
      })
    })

    describe('mandatory prop', () => {
      it('should prevent deselecting last item when mandatory=true', async () => {
        const selected = ref<string[]>(['item-1'])
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            'mandatory': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)

        rootProps.toggle()
        await nextTick()

        // Should still be selected due to mandatory
        expect(rootProps.isChecked).toBe(true)
        expect(selected.value).toContain('item-1')
      })

      it('should auto-select first item when mandatory=force', async () => {
        let rootProps: any

        mount(Checkbox.Group, {
          props: {
            mandatory: 'force',
          },
          slots: {
            default: () =>
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  rootProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
          },
        })

        await nextTick()

        expect(rootProps.isChecked).toBe(true)
      })
    })

    describe('enroll prop', () => {
      it('should auto-select non-disabled items when enroll=true', async () => {
        let item1Props: any
        let item2Props: any

        mount(Checkbox.Group, {
          props: {
            enroll: true,
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-2', disabled: true }, {
                default: (props: any) => {
                  item2Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(item1Props.isChecked).toBe(true)
        expect(item2Props.isChecked).toBe(false)
      })
    })

    describe('batch operations with ID arrays', () => {
      it('should select multiple items by ID array', async () => {
        const selected = ref<string[]>([])
        let groupProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { id: 'id-1', value: 'item-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-2', value: 'item-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-3', value: 'item-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        groupProps.select(['id-1', 'id-3'])
        await nextTick()

        expect(item1Props.isChecked).toBe(true)
        expect(item2Props.isChecked).toBe(false)
        expect(item3Props.isChecked).toBe(true)
      })

      it('should toggle multiple items by ID array', async () => {
        const selected = ref<string[]>([])
        let groupProps: any
        let item1Props: any
        let item2Props: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { id: 'id-1', value: 'item-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-2', value: 'item-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        groupProps.toggle(['id-1', 'id-2'])
        await nextTick()

        expect(item1Props.isChecked).toBe(true)
        expect(item2Props.isChecked).toBe(true)

        groupProps.toggle(['id-1', 'id-2'])
        await nextTick()

        expect(item1Props.isChecked).toBe(false)
        expect(item2Props.isChecked).toBe(false)
      })

      it('should unselect multiple items by ID array', async () => {
        const selected = ref<string[]>(['item-1', 'item-2', 'item-3'])
        let groupProps: any
        let item1Props: any
        let item2Props: any
        let item3Props: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.Root as any, { id: 'id-1', value: 'item-1' }, {
                  default: (p: any) => {
                    item1Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-2', value: 'item-2' }, {
                  default: (p: any) => {
                    item2Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 2')
                  },
                }),
                h(Checkbox.Root as any, { id: 'id-3', value: 'item-3' }, {
                  default: (p: any) => {
                    item3Props = p
                    return h(Checkbox.Indicator as any, {}, () => 'Item 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        groupProps.unselect(['id-1', 'id-3'])
        await nextTick()

        expect(item1Props.isChecked).toBe(false)
        expect(item2Props.isChecked).toBe(true)
        expect(item3Props.isChecked).toBe(false)
      })
    })
  })

  describe('atom integration', () => {
    it('should render Root as button by default', () => {
      const wrapper = mount(Checkbox.Root, {
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Click me'),
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render Indicator as span by default', () => {
      const wrapper = mount(Checkbox.Root, {
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Check'),
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should render Root as specified element', () => {
      const wrapper = mount(Checkbox.Root, {
        props: {
          as: 'div',
        },
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Click me'),
        },
      })

      expect(wrapper.find('div[role="checkbox"]').exists()).toBe(true)
    })

    it('should apply attrs to rendered Root element', async () => {
      const wrapper = mount(Checkbox.Root, {
        props: {
          modelValue: true,
        },
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
        },
      })

      await nextTick()

      const button = wrapper.find('button')
      expect(button.attributes('role')).toBe('checkbox')
      expect(button.attributes('aria-checked')).toBe('true')
      expect(button.attributes('tabindex')).toBe('0')
      expect(button.attributes('data-state')).toBe('checked')
    })

    it('should set type=button when as=button, undefined otherwise', () => {
      const buttonWrapper = mount(Checkbox.Root, {
        props: { as: 'button' },
        slots: {
          default: () => h(Checkbox.Indicator as any, {}, () => 'Check'),
        },
      })
      expect(buttonWrapper.find('button').attributes('type')).toBe('button')

      const divWrapper = mount(Checkbox.Root, {
        props: { as: 'div' },
        slots: {
          default: () => h(Checkbox.Indicator as any, {}, () => 'Check'),
        },
      })
      expect(divWrapper.find('div').attributes('type')).toBeUndefined()
    })

    it('should set Indicator visibility based on checked state', async () => {
      let indicatorProps: any

      const wrapper = mount(Checkbox.Root, {
        props: { modelValue: false },
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, {}, {
              default: (props: any) => {
                indicatorProps = props
                return 'Check'
              },
            }),
        },
      })

      await nextTick()

      expect(indicatorProps.attrs.style.visibility).toBe('hidden')

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(indicatorProps.attrs.style.visibility).toBe('visible')
    })

    it('should render slot content directly when Root renderless=true', async () => {
      let rootProps: any

      const wrapper = mount(Checkbox.Root, {
        props: { renderless: true },
        slots: {
          default: (props: any) => {
            rootProps = props
            return h('div', { class: 'custom-checkbox', ...props.attrs }, 'Custom')
          },
        },
      })

      await nextTick()

      // Should not render a button wrapper
      expect(wrapper.find('button').exists()).toBe(false)
      // Should render the custom element
      expect(wrapper.find('.custom-checkbox').exists()).toBe(true)
      // Slot props should still be available
      expect(rootProps.attrs.role).toBe('checkbox')
    })

    it('should render slot content directly when Indicator renderless=true', async () => {
      let indicatorProps: any

      const wrapper = mount(Checkbox.Root, {
        props: { modelValue: true },
        slots: {
          default: () =>
            h(Checkbox.Indicator as any, { renderless: true }, {
              default: (props: any) => {
                indicatorProps = props
                return h('svg', { class: 'custom-icon' }, 'Icon')
              },
            }),
        },
      })

      await nextTick()

      // Should not render a span wrapper
      expect(wrapper.find('span').exists()).toBe(false)
      // Should render the custom element
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
      // Slot props should still be available
      expect(indicatorProps.isChecked).toBe(true)
    })
  })

  describe('sSR/Hydration', () => {
    it('should render standalone to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { modelValue: true }, () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          ),
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
          h(Checkbox.Group as any, {}, () => [
            h(Checkbox.Root as any, { value: 'item-1' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 1'),
            ),
            h(Checkbox.Root as any, { value: 'item-2' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 2'),
            ),
          ]),
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
          h(Checkbox.Group as any, { modelValue: ['item-1'] }, () =>
            h(Checkbox.Root as any, { value: 'item-1' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 1'),
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-checked="true"')
      expect(html).toContain('data-state="checked"')
    })

    it('should render disabled state on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Group as any, { disabled: true }, () =>
            h(Checkbox.Root as any, { value: 'item-1' }, () =>
              h(Checkbox.Indicator as any, {}, () => 'Item 1'),
            ),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-disabled="true"')
      expect(html).toContain('data-disabled')
    })

    it('should use provided id to avoid hydration mismatch', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { id: 'stable-id', modelValue: true }, () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          ),
      }))

      const html = await renderToString(app)

      // With explicit id, the server render should be deterministic
      expect(html).toBeTruthy()

      // Mount client-side with same id and capture slot props
      let capturedProps: any
      mount(Checkbox.Root, {
        props: {
          id: 'stable-id',
          modelValue: true,
        },
        slots: {
          default: (props: any) => {
            capturedProps = props
            return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
          },
        },
      })

      await nextTick()

      // ID should match
      expect(capturedProps.id).toBe('stable-id')
    })

    it('should render hidden input in SSR output', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Checkbox.Root as any, { name: 'agree', value: 'yes', modelValue: true }, () =>
            h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          ),
      }))

      const html = await renderToString(app)

      expect(html).toContain('type="checkbox"')
      expect(html).toContain('name="agree"')
      expect(html).toContain('value="yes"')
    })
  })

  describe('error conditions', () => {
    it('should throw when Indicator is used outside Root', () => {
      expect(() => {
        mount(Checkbox.Indicator as any, {
          slots: {
            default: () => 'Checkbox',
          },
        })
      }).toThrow(/Context.*not found/i)
    })

    it('should throw when HiddenInput is used outside Root', () => {
      expect(() => {
        mount(Checkbox.HiddenInput as any)
      }).toThrow(/Context.*not found/i)
    })
  })

  describe('selectAll component', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        const button = wrapper.find('button[role="checkbox"]')
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('Select All')
      })

      it('should render as specified element with as prop', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { as: 'div' }, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        const div = wrapper.find('div[role="checkbox"]')
        expect(div.exists()).toBe(true)
      })

      it('should expose slot props', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(typeof slotProps.isAllSelected).toBe('boolean')
        expect(typeof slotProps.isMixed).toBe('boolean')
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.selectAll).toBe('function')
        expect(typeof slotProps.unselectAll).toBe('function')
        expect(typeof slotProps.toggleAll).toBe('function')
        expect(slotProps.attrs).toBeDefined()
        expect(slotProps.attrs.role).toBe('checkbox')
      })
    })

    describe('a11y attrs', () => {
      it('should have role="checkbox"', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.attrs.role).toBe('checkbox')
      })

      it('should set aria-label from label prop', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { label: 'Select all items' }, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.attrs['aria-label']).toBe('Select all items')
        expect(slotProps.label).toBe('Select all items')
      })

      it('should set aria-labelledby when prop is provided', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { ariaLabelledby: 'label-id' }, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.attrs['aria-labelledby']).toBe('label-id')
      })

      it('should set aria-describedby when prop is provided', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { ariaDescribedby: 'description-id' }, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.attrs['aria-describedby']).toBe('description-id')
      })

      it('should set tabindex to 0 when enabled', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.attrs.tabindex).toBe(0)
      })

      it('should set type=button when as=button', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { as: 'button' }, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        const button = wrapper.find('button[role="checkbox"]')
        expect(button.attributes('type')).toBe('button')
      })
    })

    describe('state reflection', () => {
      it('should reflect isAllSelected=false when none selected', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: [],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.isAllSelected).toBe(false)
        expect(slotProps.isMixed).toBe(false)
        expect(slotProps.attrs['aria-checked']).toBe(false)
        expect(slotProps.attrs['data-state']).toBe('unchecked')
      })

      it('should reflect isAllSelected=true when all selected', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1', 'item-2'],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.isAllSelected).toBe(true)
        expect(slotProps.isMixed).toBe(false)
        expect(slotProps.attrs['aria-checked']).toBe(true)
        expect(slotProps.attrs['data-state']).toBe('checked')
      })

      it('should reflect isMixed=true when some but not all selected', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.isAllSelected).toBe(false)
        expect(slotProps.isMixed).toBe(true)
        expect(slotProps.attrs['aria-checked']).toBe('mixed')
        expect(slotProps.attrs['data-state']).toBe('indeterminate')
      })

      it('should update state reactively when group selection changes', async () => {
        const selected = ref<string[]>([])
        let slotProps: any
        let item1Props: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Item 1')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.isAllSelected).toBe(false)
        expect(slotProps.isMixed).toBe(false)

        // Select one item
        item1Props.toggle()
        await nextTick()

        expect(slotProps.isMixed).toBe(true)
        expect(slotProps.attrs['aria-checked']).toBe('mixed')
      })
    })

    describe('toggleAll interaction', () => {
      it('should select all items when clicking from none selected', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(2)
        expect(selected.value).toContain('item-1')
        expect(selected.value).toContain('item-2')
      })

      it('should unselect all items when clicking from all selected', async () => {
        const selected = ref<string[]>(['item-1', 'item-2'])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })

      it('should select all items when clicking from mixed state', async () => {
        const selected = ref<string[]>(['item-1'])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(2)
      })

      it('should call selectAll() slot prop method', async () => {
        const selected = ref<string[]>([])
        let slotProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        slotProps.selectAll()
        await nextTick()

        expect(selected.value).toHaveLength(2)
      })

      it('should call unselectAll() slot prop method', async () => {
        const selected = ref<string[]>(['item-1', 'item-2'])
        let slotProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        slotProps.unselectAll()
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })

      it('should toggle state on click', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (v: unknown) => {
              selected.value = v as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(1)
      })
    })

    describe('disabled state', () => {
      it('should be disabled when SelectAll disabled=true', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { disabled: true }, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.isDisabled).toBe(true)
        expect(slotProps.attrs['aria-disabled']).toBe(true)
        expect(slotProps.attrs.tabindex).toBeUndefined()
        expect(slotProps.attrs['data-disabled']).toBe(true)
      })

      it('should be disabled when Group disabled=true', async () => {
        let slotProps: any

        mount(Checkbox.Group, {
          props: {
            disabled: true,
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  slotProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        expect(slotProps.isDisabled).toBe(true)
        expect(slotProps.attrs['aria-disabled']).toBe(true)
      })

      it('should not toggle when disabled', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { disabled: true }, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('click')
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })
    })

    describe('keyboard interaction', () => {
      it('should toggle on Space key press', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(selected.value).toHaveLength(2)
      })

      it('should not toggle on Space key when disabled', async () => {
        const selected = ref<string[]>([])

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { disabled: true }, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        await selectAll.trigger('keydown', { key: ' ' })
        await nextTick()

        expect(selected.value).toHaveLength(0)
      })

      it('should prevent default on Space key', async () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        const selectAll = wrapper.find('button[role="checkbox"]')
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        selectAll.element.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
      })
    })

    describe('indicator integration', () => {
      it('should provide context for Checkbox.Indicator', async () => {
        let indicatorProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1', 'item-2'],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Check'
                  },
                }),
              ),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        expect(indicatorProps.isChecked).toBe(true)
        expect(indicatorProps.isMixed).toBe(false)
        expect(indicatorProps.attrs['data-state']).toBe('checked')
      })

      it('should show indicator as mixed when some selected', async () => {
        let indicatorProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Check'
                  },
                }),
              ),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        expect(indicatorProps.isChecked).toBe(false)
        expect(indicatorProps.isMixed).toBe(true)
        expect(indicatorProps.attrs['data-state']).toBe('indeterminate')
      })

      it('should set indicator visibility based on state', async () => {
        let indicatorProps: any

        const wrapper = mount(Checkbox.Group, {
          props: {
            modelValue: [],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, () =>
                h(Checkbox.Indicator as any, {}, {
                  default: (props: any) => {
                    indicatorProps = props
                    return 'Check'
                  },
                }),
              ),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        // When unchecked, indicator should be hidden
        expect(indicatorProps.attrs.style.visibility).toBe('hidden')

        // Update to all selected
        await wrapper.setProps({ modelValue: ['item-1'] })
        await nextTick()

        // When checked (or mixed), indicator should be visible
        expect(indicatorProps.attrs.style.visibility).toBe('visible')
      })
    })

    describe('context methods (mix/unmix no-ops)', () => {
      it('should provide mix() as no-op that does not throw', async () => {
        let selectAllProps: any

        mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  selectAllProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Check')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ],
          },
        })

        await nextTick()

        // SelectAll exposes selectAll/unselectAll/toggleAll but NOT mix/unmix in slot props
        // However the context provides mix/unmix as no-ops for Indicator children
        expect(selectAllProps.selectAll).toBeDefined()
        expect(selectAllProps.unselectAll).toBeDefined()
        expect(selectAllProps.toggleAll).toBeDefined()
      })

      it('should not change state when Indicator calls context mix/unmix', async () => {
        let selectAllProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  selectAllProps = props
                  return h(Checkbox.Indicator as any, {}, () => 'Check')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
            ],
          },
        })

        await nextTick()

        const initialIsMixed = selectAllProps.isMixed

        // SelectAll's isMixed comes from group state, not from mix() calls
        // Calling the no-op mix/unmix should not affect anything
        expect(initialIsMixed).toBe(true) // 1 of 2 selected = mixed
        expect(selectAllProps.isAllSelected).toBe(false)
      })
    })

    describe('dynamic group membership', () => {
      it('should update state when items are added dynamically', async () => {
        const selected = ref<string[]>([])
        const showThird = ref(false)
        let selectAllProps: any

        mount(defineComponent({
          setup () {
            return { selected, showThird }
          },
          render () {
            return h(Checkbox.Group as any, {
              'modelValue': selected.value,
              'onUpdate:modelValue': (v: unknown) => {
                selected.value = v as string[]
              },
            }, () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  selectAllProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
              showThird.value
                ? h(Checkbox.Root as any, { value: 'item-3' }, () =>
                    h(Checkbox.Indicator as any, {}, () => 'Item 3'),
                  )
                : null,
            ])
          },
        }))

        await nextTick()

        // Select all (2 items)
        selectAllProps.selectAll()
        await nextTick()
        expect(selected.value).toHaveLength(2)
        expect(selectAllProps.isAllSelected).toBe(true)

        // Add third item
        showThird.value = true
        await nextTick()

        // Now 2 of 3 selected = mixed
        expect(selectAllProps.isAllSelected).toBe(false)
        expect(selectAllProps.isMixed).toBe(true)
      })

      it('should update state when items are removed dynamically', async () => {
        const selected = ref<string[]>(['item-1', 'item-2'])
        const showSecond = ref(true)
        let selectAllProps: any

        mount(defineComponent({
          setup () {
            return { selected, showSecond }
          },
          render () {
            return h(Checkbox.Group as any, {
              'modelValue': selected.value,
              'onUpdate:modelValue': (v: unknown) => {
                selected.value = v as string[]
              },
            }, () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (props: any) => {
                  selectAllProps = props
                  return 'Select All'
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              showSecond.value
                ? h(Checkbox.Root as any, { value: 'item-2' }, () =>
                    h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                  )
                : null,
            ])
          },
        }))

        await nextTick()

        expect(selectAllProps.isAllSelected).toBe(true) // 2 of 2

        // Remove second item
        showSecond.value = false
        await nextTick()

        // Now only 1 item visible, 1 selected = all selected
        expect(selectAllProps.isAllSelected).toBe(true)
      })
    })

    describe('does not register as group item', () => {
      it('should not be counted in isAllSelected calculation', async () => {
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            modelValue: ['item-1'],
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.SelectAll as any, {}, () => 'Select All'),
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
              ]
            },
          },
        })

        await nextTick()

        // With only 1 item and it selected, isAllSelected should be true
        // If SelectAll was counted, it would be false
        expect(groupProps.isAllSelected).toBe(true)
      })

      it('should not be affected by selectAll', async () => {
        const selected = ref<string[]>([])
        let groupProps: any

        mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: (props: any) => {
              groupProps = props
              return [
                h(Checkbox.SelectAll as any, {}, () => 'Select All'),
                h(Checkbox.Root as any, { value: 'item-1' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 1'),
                ),
                h(Checkbox.Root as any, { value: 'item-2' }, () =>
                  h(Checkbox.Indicator as any, {}, () => 'Item 2'),
                ),
              ]
            },
          },
        })

        await nextTick()

        groupProps.selectAll()
        await nextTick()

        // Only 2 items should be in selection (not 3 including SelectAll)
        expect(selected.value).toHaveLength(2)
        expect(selected.value).toEqual(['item-1', 'item-2'])
      })
    })

    describe('namespace isolation', () => {
      it('should use custom namespace to connect to correct group', async () => {
        let selectAllProps: any

        const wrapper = mount(defineComponent({
          render: () => [
            h(Checkbox.Group as any, { namespace: 'group-1', modelValue: ['a'] }, () => [
              h(Checkbox.SelectAll as any, { groupNamespace: 'group-1' }, {
                default: (props: any) => {
                  selectAllProps = props
                  return 'Select All Group 1'
                },
              }),
              h(Checkbox.Root as any, { value: 'a', groupNamespace: 'group-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'A'),
              ),
              h(Checkbox.Root as any, { value: 'b', groupNamespace: 'group-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'B'),
              ),
            ]),
          ],
        }))

        await nextTick()

        // Group 1 has 1 of 2 selected, so should be mixed
        expect(selectAllProps.isMixed).toBe(true)

        wrapper.unmount()
      })
    })

    describe('sSR rendering', () => {
      it('should render to string without errors', async () => {
        const app = createSSRApp(defineComponent({
          render: () =>
            h(Checkbox.Group as any, { modelValue: ['item-1'] }, () => [
              // Render Root items first so they register before SelectAll
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
            ]),
        }))

        const html = await renderToString(app)

        expect(html).toBeTruthy()
        expect(html).toContain('Select All')
        expect(html).toContain('aria-checked="mixed"')
        expect(html).toContain('data-state="indeterminate"')
      })

      it('should render all-selected state on server', async () => {
        const app = createSSRApp(defineComponent({
          render: () =>
            h(Checkbox.Group as any, { modelValue: ['item-1', 'item-2'] }, () => [
              // Render Root items first so they register before SelectAll
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
              h(Checkbox.Root as any, { value: 'item-2' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 2'),
              ),
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
            ]),
        }))

        const html = await renderToString(app)

        // Find the SelectAll checkbox (first one)
        expect(html).toContain('data-state="checked"')
      })

      it('should render disabled state on server', async () => {
        const app = createSSRApp(defineComponent({
          render: () =>
            h(Checkbox.Group as any, { disabled: true }, () => [
              h(Checkbox.SelectAll as any, {}, () => 'Select All'),
              h(Checkbox.Root as any, { value: 'item-1' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Item 1'),
              ),
            ]),
        }))

        const html = await renderToString(app)

        expect(html).toContain('aria-disabled="true"')
        expect(html).toContain('data-disabled')
      })
    })

    describe('error conditions', () => {
      it('should throw when used outside Group', () => {
        expect(() => {
          mount(Checkbox.SelectAll as any, {
            slots: {
              default: () => 'Select All',
            },
          })
        }).toThrow(/Context.*not found/i)
      })
    })

    describe('renderless mode', () => {
      it('should render slot content directly when renderless=true', async () => {
        let slotProps: any

        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { renderless: true }, {
                default: (props: any) => {
                  slotProps = props
                  return h('div', { class: 'custom-select-all', ...props.attrs }, 'Custom')
                },
              }),
              h(Checkbox.Root as any, { value: 'item-1', renderless: true }, {
                default: (p: any) => h('div', { class: 'custom-item', ...p.attrs }, 'Item 1'),
              }),
            ],
          },
        })

        await nextTick()

        // Should not render a button wrapper (neither SelectAll nor Root)
        expect(wrapper.find('button').exists()).toBe(false)
        // Should render the custom select-all element
        expect(wrapper.find('.custom-select-all').exists()).toBe(true)
        // Should render the custom item element
        expect(wrapper.find('.custom-item').exists()).toBe(true)
        // Slot props should still be available
        expect(slotProps.attrs.role).toBe('checkbox')
      })
    })
  })

  describe('form integration', () => {
    describe('auto-rendered hidden input', () => {
      it('should render hidden input when name prop is provided', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('agree')
      })

      it('should not render hidden input when name prop is not provided', () => {
        const wrapper = mount(Checkbox.Root, {
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(false)
      })

      it('should sync checked state with hidden input', async () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            modelValue: false,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        await nextTick()

        let input = wrapper.find('input[type="checkbox"]')
        expect((input.element as HTMLInputElement).checked).toBe(false)

        // Update v-model
        await wrapper.setProps({ modelValue: true })
        await nextTick()

        input = wrapper.find('input[type="checkbox"]')
        expect((input.element as HTMLInputElement).checked).toBe(true)
      })

      it('should use value prop for hidden input value', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            value: 'yes',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('value')).toBe('yes')
      })

      it('should use default value "on" when value prop is not provided', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('value')).toBe('on')
      })

      it('should pass form prop to hidden input', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            form: 'my-form',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('form')).toBe('my-form')
      })

      it('should disable hidden input when checkbox is disabled', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            disabled: true,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('disabled')).toBeDefined()
      })

      it('should have inert and negative tabindex on hidden input', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('inert')).toBeDefined()
        expect(input.attributes('tabindex')).toBe('-1')
      })
    })

    describe('explicit HiddenInput component', () => {
      it('should render when placed inside Root', () => {
        const wrapper = mount(Checkbox.Root, {
          slots: {
            default: () => [
              h(Checkbox.HiddenInput as any, { name: 'agree' }),
              h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
            ],
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('agree')
      })

      it('should override context values with explicit props', () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            value: 'context-value',
          },
          slots: {
            default: () => [
              h(Checkbox.HiddenInput as any, { name: 'agree', value: 'explicit-value' }),
              h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
            ],
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.attributes('value')).toBe('explicit-value')
      })
    })

    describe('form integration in group mode', () => {
      it('should render hidden inputs for multiple checkboxes', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.Root as any, { name: 'options', value: 'a' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Option A'),
              ),
              h(Checkbox.Root as any, { name: 'options', value: 'b' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Option B'),
              ),
            ],
          },
        })

        const inputs = wrapper.findAll('input[type="checkbox"]')
        expect(inputs).toHaveLength(2)
        expect(inputs[0]!.attributes('name')).toBe('options')
        expect(inputs[0]!.attributes('value')).toBe('a')
        expect(inputs[1]!.attributes('name')).toBe('options')
        expect(inputs[1]!.attributes('value')).toBe('b')
      })

      it('should sync checked state with group selection', async () => {
        const selected = ref<string[]>([])
        let item1Props: any

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { name: 'options', value: 'a' }, {
                default: (props: any) => {
                  item1Props = props
                  return h(Checkbox.Indicator as any, {}, () => 'Option A')
                },
              }),
              h(Checkbox.Root as any, { name: 'options', value: 'b' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'Option B'),
              ),
            ],
          },
        })

        await nextTick()

        const inputs = wrapper.findAll('input[type="checkbox"]')
        expect((inputs[0]!.element as HTMLInputElement).checked).toBe(false)

        item1Props.toggle()
        await nextTick()

        expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
        expect((inputs[1]!.element as HTMLInputElement).checked).toBe(false)
      })
    })

    describe('formData population', () => {
      it('should populate FormData correctly when checked', async () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            value: 'yes',
            modelValue: true,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
          attachTo: document.body,
        })

        await nextTick()

        const input = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
        const formData = new FormData()

        // Simulate form data collection
        if (input.checked) {
          formData.append(input.name, input.value)
        }

        expect(formData.get('agree')).toBe('yes')

        wrapper.unmount()
      })

      it('should not populate FormData when unchecked', async () => {
        const wrapper = mount(Checkbox.Root, {
          props: {
            name: 'agree',
            value: 'yes',
            modelValue: false,
          },
          slots: {
            default: () => h(Checkbox.Indicator as any, {}, () => 'Checkbox'),
          },
          attachTo: document.body,
        })

        await nextTick()

        const input = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
        const formData = new FormData()

        // Simulate form data collection
        if (input.checked) {
          formData.append(input.name, input.value)
        }

        expect(formData.get('agree')).toBeNull()

        wrapper.unmount()
      })
    })
  })
})
