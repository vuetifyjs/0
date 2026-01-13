import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref, type Ref } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'

import { Radio } from './index'

// ============================================================================
// Test Helpers
// ============================================================================

interface MountGroupResult<T = any, G = any> {
  wrapper: VueWrapper
  props: () => T
  groupProps: () => G
  itemProps: (key: string) => any
  wait: () => Promise<void>
}

/**
 * Mount a Radio.Group with items and slot prop capture
 */
function mountGroup (options: {
  props?: Record<string, unknown>
  model?: Ref<string | undefined>
  items?: Array<{ value: string, id?: string, disabled?: boolean }>
} = {}): MountGroupResult {
  const items = options.items ?? [{ value: 'item-1' }, { value: 'item-2' }]
  let groupProps: any
  const itemProps: Record<string, any> = {}

  const wrapper = mount(Radio.Group, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as string | undefined
        },
      }),
      ...options.props,
    },
    slots: {
      default: (props: any) => {
        groupProps = props
        return items.map(item =>
          h(Radio.Root as any, {
            value: item.value,
            id: item.id,
            disabled: item.disabled,
          }, {
            default: (p: any) => {
              itemProps[item.value] = p
              return h(Radio.Indicator as any, {}, () => item.value)
            },
          }),
        )
      },
    },
  })

  return {
    wrapper,
    props: () => itemProps['item-1'],
    groupProps: () => groupProps,
    itemProps: (key: string) => itemProps[key],
    wait: () => nextTick(),
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('radio', () => {
  describe('group mode', () => {
    describe('rendering', () => {
      it('should render Group with role="radiogroup"', () => {
        const { wrapper } = mountGroup()
        expect(wrapper.attributes('role')).toBe('radiogroup')
      })

      it.each([
        ['aria-label', { label: 'Options' }, 'Options'],
        ['aria-labelledby', { 'aria-labelledby': 'label-id' }, 'label-id'],
        ['aria-describedby', { 'aria-describedby': 'desc-id' }, 'desc-id'],
        ['aria-required', { 'aria-required': true }, true],
      ] as const)('should set %s on Group', async (attr, inputProps, expected) => {
        const { groupProps, wait } = mountGroup({ props: inputProps })
        await wait()
        expect(groupProps().attrs[attr]).toBe(expected)
      })

      it('should expose Group slot props', async () => {
        const { groupProps, wait } = mountGroup()
        await wait()

        expect(typeof groupProps().isDisabled).toBe('boolean')
        expect(typeof groupProps().isNoneSelected).toBe('boolean')
      })

      it('should render Root with role="radio"', async () => {
        const { wrapper, wait } = mountGroup()
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        expect(radios).toHaveLength(2)
      })

      it('should handle empty group gracefully', async () => {
        const { groupProps, wait, wrapper } = mountGroup({ items: [] })
        await wait()

        expect(groupProps().isNoneSelected).toBe(true)
        expect(wrapper.findAll('[role="radio"]')).toHaveLength(0)
      })
    })

    describe('v-model binding', () => {
      it('should update v-model when item is selected', async () => {
        const model = ref<string | undefined>(undefined)
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        itemProps('item-1').select()
        await wait()
        expect(model.value).toBe('item-1')
      })

      it('should support single selection only', async () => {
        const model = ref<string | undefined>(undefined)
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        itemProps('item-1').select()
        await wait()
        expect(model.value).toBe('item-1')

        itemProps('item-2').select()
        await wait()
        expect(model.value).toBe('item-2')
        expect(itemProps('item-1').isChecked).toBe(false)
      })

      it('should reflect initial model value', async () => {
        const { itemProps, wait } = mountGroup({ props: { modelValue: 'item-1' } })
        await wait()
        expect(itemProps('item-1').isChecked).toBe(true)
        expect(itemProps('item-2').isChecked).toBe(false)
      })
    })

    describe('a11y attrs', () => {
      it.each([
        ['role', 'radio'],
        ['data-state', 'unchecked'],
        ['aria-checked', false],
      ] as const)('should set %s correctly on unselected radio', async (attr, expected) => {
        const { itemProps, wait } = mountGroup()
        await wait()
        expect(itemProps('item-1').attrs[attr]).toBe(expected)
      })

      it.each([
        ['data-state', 'checked'],
        ['aria-checked', true],
      ] as const)('should set %s correctly on selected radio', async (attr, expected) => {
        const { itemProps, wait } = mountGroup({ props: { modelValue: 'item-1' } })
        await wait()
        expect(itemProps('item-1').attrs[attr]).toBe(expected)
      })

      it('should update aria-checked reactively', async () => {
        const model = ref<string | undefined>(undefined)
        const { itemProps, wait } = mountGroup({ model })
        await wait()
        expect(itemProps('item-1').attrs['aria-checked']).toBe(false)

        itemProps('item-1').select()
        await wait()
        expect(itemProps('item-1').attrs['aria-checked']).toBe(true)
      })

      it('should set aria-invalid when prop is provided', async () => {
        let capturedProps: any
        mount(Radio.Group, {
          slots: {
            default: () => h(Radio.Root as any, { 'value': 'a', 'aria-invalid': true }, {
              default: (p: any) => {
                capturedProps = p
                return h(Radio.Indicator as any, {}, () => '●')
              },
            }),
          },
        })
        await nextTick()
        expect(capturedProps.attrs['aria-invalid']).toBe(true)
      })

      it('should not set aria-invalid when prop is false', async () => {
        let capturedProps: any
        mount(Radio.Group, {
          slots: {
            default: () => h(Radio.Root as any, { 'value': 'a', 'aria-invalid': false }, {
              default: (p: any) => {
                capturedProps = p
                return h(Radio.Indicator as any, {}, () => '●')
              },
            }),
          },
        })
        await nextTick()
        expect(capturedProps.attrs['aria-invalid']).toBeUndefined()
      })
    })

    describe('disabled state', () => {
      it('should disable items when Group is disabled', async () => {
        const { itemProps, wait } = mountGroup({ props: { disabled: true } })
        await wait()
        expect(itemProps('item-1').isDisabled).toBe(true)
      })

      it('should disable individual items', async () => {
        const { itemProps, wait } = mountGroup({
          items: [
            { value: 'item-1', disabled: true },
            { value: 'item-2' },
          ],
        })
        await wait()

        expect(itemProps('item-1').isDisabled).toBe(true)
        expect(itemProps('item-2').isDisabled).toBe(false)
      })

      it('should not select when disabled', async () => {
        const model = ref<string | undefined>(undefined)
        const { itemProps, wait } = mountGroup({
          model,
          items: [{ value: 'item-1', disabled: true }],
        })
        await wait()

        itemProps('item-1').select()
        await wait()
        expect(model.value).toBeUndefined()
      })

      it('should apply disabled attrs', async () => {
        const { itemProps, wait } = mountGroup({
          items: [{ value: 'item-1', disabled: true }],
        })
        await wait()

        expect(itemProps('item-1').attrs['aria-disabled']).toBe(true)
        expect(itemProps('item-1').attrs.tabindex).toBe(-1)
        expect(itemProps('item-1').attrs['data-disabled']).toBe(true)
      })
    })

    describe('registration lifecycle', () => {
      it('should unregister from parent on unmount', async () => {
        const showItem = ref(true)
        let groupProps: any

        mount(Radio.Group, {
          slots: {
            default: (props: any) => {
              groupProps = props
              return showItem.value
                ? h(Radio.Root as any, { value: 'item-1' }, () =>
                    h(Radio.Indicator as any, {}, () => 'Item'),
                  )
                : null
            },
          },
        })

        await nextTick()
        expect(groupProps.isNoneSelected).toBe(true)

        showItem.value = false
        await nextTick()
        expect(groupProps.isNoneSelected).toBe(true)
      })

      it('should handle dynamic item addition', async () => {
        const items = ref(['item-1'])
        const model = ref<string | undefined>(undefined)
        const itemPropsMap: Record<string, any> = {}

        mount(Radio.Group, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: unknown) => {
              model.value = v as string | undefined
            },
          },
          slots: {
            default: () => items.value.map(item =>
              h(Radio.Root as any, { key: item, value: item }, {
                default: (p: any) => {
                  itemPropsMap[item] = p
                  return h(Radio.Indicator as any, {}, () => item)
                },
              }),
            ),
          },
        })

        await nextTick()
        expect(Object.keys(itemPropsMap)).toHaveLength(1)

        // Add new item
        items.value = ['item-1', 'item-2']
        await nextTick()
        expect(Object.keys(itemPropsMap)).toHaveLength(2)

        // Select new item
        itemPropsMap['item-2'].select()
        await nextTick()
        expect(model.value).toBe('item-2')
      })

      it('should preserve selection when unrelated item is removed', async () => {
        const items = ref(['item-1', 'item-2', 'item-3'])
        const model = ref<string | undefined>('item-2')
        const itemPropsMap: Record<string, any> = {}

        mount(Radio.Group, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: unknown) => {
              model.value = v as string | undefined
            },
          },
          slots: {
            default: () => items.value.map(item =>
              h(Radio.Root as any, { key: item, value: item }, {
                default: (p: any) => {
                  itemPropsMap[item] = p
                  return h(Radio.Indicator as any, {}, () => item)
                },
              }),
            ),
          },
        })

        await nextTick()
        expect(itemPropsMap['item-2'].isChecked).toBe(true)

        // Remove item-3 (not selected)
        items.value = ['item-1', 'item-2']
        await nextTick()
        expect(model.value).toBe('item-2')
        expect(itemPropsMap['item-2'].isChecked).toBe(true)
      })
    })

    describe('namespace isolation', () => {
      it('should isolate groups with different namespaces', async () => {
        let group1Props: any
        let group2Props: any

        mount(defineComponent({
          render: () => [
            h(Radio.Group as any, { namespace: 'ns-1' }, () =>
              h(Radio.Root as any, { value: 'a', groupNamespace: 'ns-1' }, {
                default: (p: any) => {
                  group1Props = p
                  return 'A'
                },
              }),
            ),
            h(Radio.Group as any, { namespace: 'ns-2' }, () =>
              h(Radio.Root as any, { value: 'b', groupNamespace: 'ns-2' }, {
                default: (p: any) => {
                  group2Props = p
                  return 'B'
                },
              }),
            ),
          ],
        }))

        await nextTick()
        group1Props.select()
        await nextTick()

        expect(group1Props.isChecked).toBe(true)
        expect(group2Props.isChecked).toBe(false)
      })
    })

    describe('mandatory prop', () => {
      it('should auto-select first item when mandatory=force', async () => {
        const { itemProps, wait } = mountGroup({
          props: { mandatory: 'force' },
          items: [{ value: 'item-1' }],
        })
        await wait()
        expect(itemProps('item-1').isChecked).toBe(true)
      })

      it('should not deselect when re-selecting same item (radio is inherently mandatory)', async () => {
        const model = ref<string | undefined>('item-1')
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        // Radio only exposes select(), not toggle/unselect - re-selecting is a no-op
        itemProps('item-1').select()
        await wait()
        expect(model.value).toBe('item-1')
        expect(itemProps('item-1').isChecked).toBe(true)
      })
    })

    describe('tabindex management', () => {
      it('should only make selected radio tabbable', async () => {
        const model = ref<string | undefined>('item-2')
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        expect(itemProps('item-1').attrs.tabindex).toBe(-1)
        expect(itemProps('item-2').attrs.tabindex).toBe(0)
      })

      it('should make first radio tabbable when none selected', async () => {
        const model = ref<string | undefined>(undefined)
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        expect(itemProps('item-1').attrs.tabindex).toBe(0)
        expect(itemProps('item-2').attrs.tabindex).toBe(-1)
      })
    })

    describe('keyboard interaction', () => {
      it('should select on Space key', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('keydown', { key: ' ' })
        await wait()
        expect(model.value).toBe('item-1')
      })

      it('should select on click', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('click')
        await wait()
        expect(model.value).toBe('item-1')
      })

      it('should prevent default on Space keydown', async () => {
        const { wrapper, wait } = mountGroup()
        await wait()

        const radio = wrapper.find('[role="radio"]')
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        radio.element.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(true)
      })

      it('should navigate to next radio on ArrowRight', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('keydown', { key: 'ArrowRight' })
        await wait()
        expect(model.value).toBe('item-2')
      })

      it('should navigate to previous radio on ArrowLeft', async () => {
        const model = ref<string | undefined>('item-2')
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[1]!.trigger('keydown', { key: 'ArrowLeft' })
        await wait()
        expect(model.value).toBe('item-1')
      })

      it('should navigate using ArrowUp and ArrowDown', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('keydown', { key: 'ArrowDown' })
        await wait()
        expect(model.value).toBe('item-2')

        await radios[1]!.trigger('keydown', { key: 'ArrowUp' })
        await wait()
        expect(model.value).toBe('item-1')
      })

      it('should wrap from last to first on ArrowRight at end', async () => {
        const model = ref<string | undefined>('item-2')
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[1]!.trigger('keydown', { key: 'ArrowRight' })
        await wait()
        expect(model.value).toBe('item-1')
      })

      it('should wrap from first to last on ArrowLeft at start', async () => {
        const model = ref<string | undefined>('item-1')
        const { wrapper, wait } = mountGroup({ model })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('keydown', { key: 'ArrowLeft' })
        await wait()
        expect(model.value).toBe('item-2')
      })

      it('should skip disabled items during arrow navigation', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper, wait } = mountGroup({
          model,
          items: [
            { value: 'item-1' },
            { value: 'item-2', disabled: true },
            { value: 'item-3' },
          ],
        })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('keydown', { key: 'ArrowRight' })
        await wait()
        expect(model.value).toBe('item-3') // Skips disabled item-2
      })

      it('should prevent default on arrow keys', async () => {
        const { wrapper, wait } = mountGroup()
        await wait()

        const radio = wrapper.find('[role="radio"]')
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
        radio.element.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(true)
      })

      it('should not navigate when all items are disabled', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper, wait } = mountGroup({
          model,
          items: [
            { value: 'item-1', disabled: true },
            { value: 'item-2', disabled: true },
          ],
        })
        await wait()

        const radios = wrapper.findAll('[role="radio"]')
        await radios[0]!.trigger('keydown', { key: 'ArrowRight' })
        await wait()
        expect(model.value).toBeUndefined()
      })
    })

    describe('slot props', () => {
      it('should expose all required slot props', async () => {
        const { itemProps, wait } = mountGroup({
          items: [{ value: 'item-1', id: 'my-radio' }],
        })
        await wait()

        const props = itemProps('item-1')
        expect(props.id).toBe('my-radio')
        expect(props.value).toBe('item-1')
        expect(typeof props.isChecked).toBe('boolean')
        expect(typeof props.isDisabled).toBe('boolean')
        expect(typeof props.select).toBe('function')
        expect(props.attrs).toBeDefined()
      })

      it('should generate id if not provided', async () => {
        const { itemProps, wait } = mountGroup()
        await wait()

        expect(itemProps('item-1').id).toBeDefined()
        expect(typeof itemProps('item-1').id).toBe('string')
      })
    })
  })

  describe('atom integration', () => {
    it('should render Root as button by default', () => {
      const wrapper = mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { value: 'a' }, () =>
            h(Radio.Indicator as any, {}, () => '●'),
          ),
        },
      })
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render Indicator as span by default', () => {
      const wrapper = mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { value: 'a' }, () =>
            h(Radio.Indicator as any, {}, () => '●'),
          ),
        },
      })
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should render Root as specified element', () => {
      const wrapper = mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { value: 'a', as: 'div' }, () =>
            h(Radio.Indicator as any, {}, () => '●'),
          ),
        },
      })
      expect(wrapper.find('div[role="radio"]').exists()).toBe(true)
    })

    it('should set type=button only when as=button', () => {
      const buttonWrapper = mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { value: 'a', as: 'button' }, () =>
            h(Radio.Indicator as any, {}, () => '●'),
          ),
        },
      })
      expect(buttonWrapper.find('button').attributes('type')).toBe('button')

      const divWrapper = mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { value: 'a', as: 'div' }, () =>
            h(Radio.Indicator as any, {}, () => '●'),
          ),
        },
      })
      expect(divWrapper.find('div').attributes('type')).toBeUndefined()
    })

    it('should render slot content directly when renderless=true', async () => {
      let capturedProps: any
      const wrapper = mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { value: 'a', renderless: true }, {
            default: (props: any) => {
              capturedProps = props
              return h('div', { class: 'custom', ...props.attrs }, 'Custom')
            },
          }),
        },
      })
      await nextTick()

      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(capturedProps.attrs.role).toBe('radio')
    })

    it('should render Indicator slot content directly when renderless=true', async () => {
      let indicatorProps: any
      const wrapper = mount(Radio.Group, {
        props: { modelValue: 'a' },
        slots: {
          default: () => h(Radio.Root as any, { value: 'a' }, () =>
            h(Radio.Indicator as any, { renderless: true }, {
              default: (props: any) => {
                indicatorProps = props
                return h('svg', { class: 'custom-indicator', ...props.attrs }, 'check')
              },
            }),
          ),
        },
      })
      await nextTick()

      expect(wrapper.find('span').exists()).toBe(false)
      expect(wrapper.find('.custom-indicator').exists()).toBe(true)
      expect(indicatorProps.attrs['data-state']).toBe('checked')
    })
  })

  describe('ssr/hydration', () => {
    it.each([
      ['group', {}, ['role="radiogroup"', 'role="radio"']],
      ['disabled', { disabled: true }, ['aria-disabled="true"', 'data-disabled']],
    ])('should render %s to string without errors', async (_, props, expected) => {
      function component () {
        return h(Radio.Group as any, props, () =>
          h(Radio.Root as any, { value: 'a' }, () => h(Radio.Indicator as any, {}, () => 'A')),
        )
      }

      const app = createSSRApp(defineComponent({ render: component }))
      const html = await renderToString(app)

      expect(html).toBeTruthy()
      for (const exp of expected) {
        expect(html).toContain(exp)
      }
    })

    it('should use provided id for deterministic SSR', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Radio.Group as any, {}, () =>
          h(Radio.Root as any, { id: 'stable-id', value: 'a' }, () =>
            h(Radio.Indicator as any, {}, () => '●'),
          ),
        ),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()

      // Client should match
      let capturedId: string
      mount(Radio.Group, {
        slots: {
          default: () => h(Radio.Root as any, { id: 'stable-id', value: 'a' }, {
            default: (p: any) => {
              capturedId = p.id
              return '●'
            },
          }),
        },
      })
      await nextTick()
      expect(capturedId!).toBe('stable-id')
    })
  })

  describe('error conditions', () => {
    it('should throw when Indicator used outside Root', () => {
      expect(() => {
        mount(Radio.Indicator)
      }).toThrow()
    })

    it('should throw when Root used outside Group', () => {
      expect(() => {
        mount(Radio.Root, {
          props: { value: 'a' },
          slots: { default: () => h(Radio.Indicator as any, {}, () => '●') },
        })
      }).toThrow()
    })
  })

  describe('form integration', () => {
    describe('auto-rendered hidden input', () => {
      it('should render when name prop is provided on Group', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice' },
          slots: {
            default: () => h(Radio.Root as any, { value: 'a' }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('choice')
      })

      it('should set value correctly', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice' },
          slots: {
            default: () => h(Radio.Root as any, { value: 'yes' }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.attributes('value')).toBe('yes')
      })

      it('should be disabled when radio is disabled', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice', disabled: true },
          slots: {
            default: () => h(Radio.Root as any, { value: 'a' }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      })

      it('should have inert and negative tabindex', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice' },
          slots: {
            default: () => h(Radio.Root as any, { value: 'a' }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        const input = wrapper.find('input')
        expect(input.attributes('inert')).toBeDefined()
        expect(input.attributes('tabindex')).toBe('-1')
      })
    })

    describe('explicit HiddenInput component', () => {
      it('should render when placed inside Root', () => {
        const wrapper = mount(Radio.Group, {
          slots: {
            default: () => h(Radio.Root as any, { value: 'a' }, () => [
              h(Radio.HiddenInput as any, { name: 'choice' }),
              h(Radio.Indicator as any, {}, () => '●'),
            ]),
          },
        })

        expect(wrapper.find('input[name="choice"]').exists()).toBe(true)
      })

      it('should override context values with explicit props', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'group-name' },
          slots: {
            default: () => h(Radio.Root as any, { value: 'context-value' }, () => [
              h(Radio.HiddenInput as any, { name: 'explicit', value: 'override' }),
              h(Radio.Indicator as any, {}, () => '●'),
            ]),
          },
        })

        const input = wrapper.find('input[name="explicit"]')
        expect(input.attributes('value')).toBe('override')
      })

      it('should serialize object values as JSON for form submission', () => {
        const objectValue = { id: 123, label: 'Option A' }
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice' },
          slots: {
            default: () => h(Radio.Root as any, { value: objectValue }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.attributes('value')).toBe(JSON.stringify(objectValue))
      })

      it('should serialize number values as strings', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice' },
          slots: {
            default: () => h(Radio.Root as any, { value: 42 }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.attributes('value')).toBe('42')
      })

      it('should use default value "on" when no value provided', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice' },
          slots: {
            default: () => h(Radio.Root as any, {}, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.attributes('value')).toBe('on')
      })

      it('should associate with form via form attribute', () => {
        const wrapper = mount(Radio.Group, {
          slots: {
            default: () => h(Radio.Root as any, { value: 'a', form: 'my-form' }, () => [
              h(Radio.HiddenInput as any, { name: 'choice' }),
              h(Radio.Indicator as any, {}, () => '●'),
            ]),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.attributes('form')).toBe('my-form')
      })

      it('should allow HiddenInput to override form attribute', () => {
        const wrapper = mount(Radio.Group, {
          slots: {
            default: () => h(Radio.Root as any, { value: 'a', form: 'root-form' }, () => [
              h(Radio.HiddenInput as any, { name: 'choice', form: 'explicit-form' }),
              h(Radio.Indicator as any, {}, () => '●'),
            ]),
          },
        })

        const input = wrapper.find('input[type="radio"]')
        expect(input.attributes('form')).toBe('explicit-form')
      })
    })

    describe('form integration in group mode', () => {
      it('should render hidden inputs for multiple radios', () => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'opts' },
          slots: {
            default: () => [
              h(Radio.Root as any, { value: 'a' }, () =>
                h(Radio.Indicator as any, {}, () => 'A'),
              ),
              h(Radio.Root as any, { value: 'b' }, () =>
                h(Radio.Indicator as any, {}, () => 'B'),
              ),
            ],
          },
        })

        const inputs = wrapper.findAll('input[type="radio"]')
        expect(inputs).toHaveLength(2)
        expect(inputs[0]!.attributes('value')).toBe('a')
        expect(inputs[1]!.attributes('value')).toBe('b')
        expect(inputs[0]!.attributes('name')).toBe('opts')
        expect(inputs[1]!.attributes('name')).toBe('opts')
      })

      it('should sync checked state with group selection', async () => {
        const model = ref<string | undefined>(undefined)
        let itemProps: any

        const wrapper = mount(Radio.Group, {
          props: {
            'name': 'opts',
            'modelValue': model.value,
            'onUpdate:modelValue': (v: unknown) => {
              model.value = v as string | undefined
            },
          },
          slots: {
            default: () => [
              h(Radio.Root as any, { value: 'a' }, {
                default: (p: any) => {
                  itemProps = p
                  return h(Radio.Indicator as any, {}, () => 'A')
                },
              }),
              h(Radio.Root as any, { value: 'b' }, () =>
                h(Radio.Indicator as any, {}, () => 'B'),
              ),
            ],
          },
          attachTo: document.body,
        })

        await nextTick()
        itemProps.select()
        await nextTick()

        const inputs = wrapper.findAll('input[type="radio"]')
        expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
        expect((inputs[1]!.element as HTMLInputElement).checked).toBe(false)

        wrapper.unmount()
      })
    })

    describe('formData population', () => {
      it.each([
        ['populate when checked', 'a', 'a'],
        ['not populate when unchecked', undefined, null],
      ])('should %s', async (_, selected, expected) => {
        const wrapper = mount(Radio.Group, {
          props: { name: 'choice', modelValue: selected },
          slots: {
            default: () => h(Radio.Root as any, { value: 'a' }, () =>
              h(Radio.Indicator as any, {}, () => '●'),
            ),
          },
          attachTo: document.body,
        })

        await nextTick()
        const input = wrapper.find('input').element as HTMLInputElement
        const formData = new FormData()
        if (input.checked) formData.append(input.name, input.value)

        expect(formData.get('choice')).toBe(expected)
        wrapper.unmount()
      })
    })
  })
})
