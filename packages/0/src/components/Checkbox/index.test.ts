import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref, type Ref } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'

import { Checkbox } from './index'

// ============================================================================
// Test Helpers
// ============================================================================

interface MountResult<T = any> {
  wrapper: VueWrapper
  props: () => T
  wait: () => Promise<void>
}

interface MountGroupResult<T = any, G = any> extends MountResult<T> {
  groupProps: () => G
}

/**
 * Mount a standalone Checkbox.Root with slot prop capture
 */
function mountCheckbox (options: {
  props?: Record<string, unknown>
  model?: Ref<boolean>
} = {}): MountResult {
  let capturedProps: any

  const wrapper = mount(Checkbox.Root, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as boolean
        },
      }),
      ...options.props,
    },
    slots: {
      default: (props: any) => {
        capturedProps = props
        return h(Checkbox.Indicator as any, {}, () => 'Checkbox')
      },
    },
  })

  return {
    wrapper,
    props: () => capturedProps,
    wait: () => nextTick(),
  }
}

/**
 * Mount a Checkbox.Group with items and slot prop capture
 */
function mountGroup (options: {
  props?: Record<string, unknown>
  model?: Ref<string[]>
  items?: Array<{ value: string, id?: string, disabled?: boolean, indeterminate?: boolean }>
  withSelectAll?: boolean
} = {}): MountGroupResult & { itemProps: (key: string) => any, selectAllProps?: () => any } {
  const items = options.items ?? [{ value: 'item-1' }, { value: 'item-2' }]
  let groupProps: any
  let selectAllProps: any
  const itemProps: Record<string, any> = {}

  const wrapper = mount(Checkbox.Group, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as string[]
        },
      }),
      ...options.props,
    },
    slots: {
      default: (props: any) => {
        groupProps = props
        const children = items.map(item =>
          h(Checkbox.Root as any, {
            value: item.value,
            id: item.id,
            disabled: item.disabled,
            indeterminate: item.indeterminate,
          }, {
            default: (p: any) => {
              itemProps[item.value] = p
              return h(Checkbox.Indicator as any, {}, () => item.value)
            },
          }),
        )
        if (options.withSelectAll) {
          children.unshift(
            h(Checkbox.SelectAll as any, {}, {
              default: (p: any) => {
                selectAllProps = p
                return h(Checkbox.Indicator as any, {}, () => 'Select All')
              },
            }),
          )
        }
        return children
      },
    },
  })

  return {
    wrapper,
    props: () => itemProps['item-1'],
    groupProps: () => groupProps,
    itemProps: (key: string) => itemProps[key],
    selectAllProps: options.withSelectAll ? () => selectAllProps : undefined,
    wait: () => nextTick(),
  }
}

/**
 * Mount a SelectAll within a Group
 */
function mountSelectAll (options: {
  props?: Record<string, unknown>
  groupProps?: Record<string, unknown>
  model?: Ref<string[]>
  items?: Array<{ value: string, disabled?: boolean }>
} = {}) {
  const items = options.items ?? [{ value: 'item-1' }, { value: 'item-2' }]
  let selectAllProps: any
  let indicatorProps: any
  const itemProps: Record<string, any> = {}

  const wrapper = mount(Checkbox.Group, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as string[]
        },
      }),
      ...options.groupProps,
    },
    slots: {
      default: () => [
        h(Checkbox.SelectAll as any, options.props, {
          default: (props: any) => {
            selectAllProps = props
            return h(Checkbox.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return 'Check'
              },
            })
          },
        }),
        ...items.map(item =>
          h(Checkbox.Root as any, { value: item.value, disabled: item.disabled }, {
            default: (p: any) => {
              itemProps[item.value] = p
              return h(Checkbox.Indicator as any, {}, () => item.value)
            },
          }),
        ),
      ],
    },
  })

  // Create getters that always return current captured props
  const itemPropsGetters: Record<string, () => any> = {}
  for (const item of items) {
    itemPropsGetters[item.value] = () => itemProps[item.value]
  }

  return {
    wrapper,
    props: () => selectAllProps,
    indicatorProps: () => indicatorProps,
    itemProps: itemPropsGetters,
    wait: () => nextTick(),
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('checkbox', () => {
  describe('standalone mode', () => {
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
        const { props, wait } = mountCheckbox({ props: { modelValue: true } })
        await wait()
        expect(props().isChecked).toBe(true)
      })

      it.each([
        ['select', false, true],
        ['unselect', true, false],
        ['toggle', false, true],
      ] as const)('should %s correctly', async (method, initial, expected) => {
        const model = ref(initial)
        const { props, wait } = mountCheckbox({ model })
        await wait()

        props()[method]()
        await wait()
        expect(model.value).toBe(expected)
      })
    })

    describe('accessibility', () => {
      it.each([
        ['role', {}, 'checkbox'],
        ['tabindex', {}, 0],
        ['data-state', { modelValue: false }, 'unchecked'],
        ['data-state', { modelValue: true }, 'checked'],
        ['aria-checked', { modelValue: false }, false],
        ['aria-checked', { modelValue: true }, true],
        ['aria-label', { label: 'Accept terms' }, 'Accept terms'],
        ['aria-labelledby', { 'aria-labelledby': 'my-label' }, 'my-label'],
        ['aria-describedby', { 'aria-describedby': 'my-desc' }, 'my-desc'],
        ['aria-invalid', { 'aria-invalid': true }, true],
      ] as const)('should set %s correctly', async (attr, inputProps, expected) => {
        const { props, wait } = mountCheckbox({ props: inputProps })
        await wait()
        expect(props().attrs[attr]).toBe(expected)
      })

      it('should update aria-checked reactively', async () => {
        const { wrapper, props, wait } = mountCheckbox({ props: { modelValue: false } })
        await wait()
        expect(props().attrs['aria-checked']).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await wait()
        expect(props().attrs['aria-checked']).toBe(true)
      })
    })

    describe('disabled state', () => {
      it('should apply disabled attrs', async () => {
        const { props, wait } = mountCheckbox({ props: { disabled: true } })
        await wait()

        expect(props().isDisabled).toBe(true)
        expect(props().attrs['aria-disabled']).toBe(true)
        expect(props().attrs.tabindex).toBeUndefined()
        expect(props().attrs['data-disabled']).toBe(true)
      })

      it('should not toggle when disabled', async () => {
        const model = ref(false)
        const { props, wait } = mountCheckbox({ model, props: { disabled: true } })
        await wait()

        props().toggle()
        await wait()
        expect(model.value).toBe(false)
      })

      it('should update disabled state reactively', async () => {
        const { wrapper, props, wait } = mountCheckbox({ props: { disabled: false } })
        await wait()
        expect(props().isDisabled).toBe(false)

        await wrapper.setProps({ disabled: true })
        await wait()
        expect(props().isDisabled).toBe(true)
        expect(props().attrs.tabindex).toBeUndefined()
      })
    })

    describe('keyboard interaction', () => {
      it.each([
        ['Space', ' ', true],
        ['click', 'click', true],
      ])('should toggle on %s', async (_, trigger, expected) => {
        const model = ref(false)
        const { wrapper, wait } = mountCheckbox({ model })
        await wait()

        const button = wrapper.find('button')
        await (trigger === 'click' ? button.trigger('click') : button.trigger('keydown', { key: trigger }))
        await wait()
        expect(model.value).toBe(expected)
      })

      it('should not toggle on Space when disabled', async () => {
        const model = ref(false)
        const { wrapper, wait } = mountCheckbox({ model, props: { disabled: true } })
        await wait()

        await wrapper.find('button').trigger('keydown', { key: ' ' })
        await wait()
        expect(model.value).toBe(false)
      })

      it('should prevent default on Space keydown', async () => {
        const { wrapper, wait } = mountCheckbox()
        await wait()

        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        wrapper.find('button').element.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose all required slot props', async () => {
        const { props, wait } = mountCheckbox({
          props: { id: 'my-checkbox', label: 'My Label', value: 'my-value' },
        })
        await wait()

        expect(props().id).toBe('my-checkbox')
        expect(props().label).toBe('My Label')
        expect(props().value).toBe('my-value')
        expect(typeof props().isChecked).toBe('boolean')
        expect(typeof props().isMixed).toBe('boolean')
        expect(typeof props().isDisabled).toBe('boolean')
        expect(typeof props().select).toBe('function')
        expect(typeof props().unselect).toBe('function')
        expect(typeof props().toggle).toBe('function')
        expect(props().attrs).toBeDefined()
      })

      it('should generate id if not provided', async () => {
        const { props, wait } = mountCheckbox()
        await wait()

        expect(props().id).toBeDefined()
        expect(typeof props().id).toBe('string')
      })
    })

    describe('indeterminate state', () => {
      it('should be false by default in standalone', async () => {
        const { props, wait } = mountCheckbox()
        await wait()
        expect(props().isMixed).toBe(false)
      })

      it('should honor indeterminate prop', async () => {
        const { props, wait } = mountCheckbox({ props: { indeterminate: true } })
        await wait()
        expect(props().isMixed).toBe(true)
      })
    })
  })

  describe('group mode', () => {
    describe('rendering', () => {
      it('should render Group with role="group"', () => {
        const { wrapper } = mountGroup()
        expect(wrapper.attributes('role')).toBe('group')
      })

      it.each([
        ['aria-label', { label: 'Options' }, 'Options'],
        ['aria-labelledby', { 'aria-labelledby': 'label-id' }, 'label-id'],
        ['aria-describedby', { 'aria-describedby': 'desc-id' }, 'desc-id'],
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
        expect(typeof groupProps().isAllSelected).toBe('boolean')
        expect(typeof groupProps().isMixed).toBe('boolean')
        expect(typeof groupProps().selectAll).toBe('function')
        expect(typeof groupProps().unselectAll).toBe('function')
        expect(typeof groupProps().toggleAll).toBe('function')
      })
    })

    describe('v-model binding', () => {
      it('should update v-model when items are selected', async () => {
        const model = ref<string[]>([])
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        itemProps('item-1').toggle()
        await wait()
        expect(model.value).toContain('item-1')
      })

      it('should support multiple selections', async () => {
        const model = ref<string[]>([])
        const { itemProps, wait } = mountGroup({ model })
        await wait()

        itemProps('item-1').toggle()
        itemProps('item-2').toggle()
        await wait()
        expect(model.value).toEqual(expect.arrayContaining(['item-1', 'item-2']))
      })

      it('should reflect initial model value', async () => {
        const { itemProps, wait } = mountGroup({ props: { modelValue: ['item-1'] } })
        await wait()
        expect(itemProps('item-1').isChecked).toBe(true)
      })
    })

    describe('batch operations', () => {
      it.each([
        ['selectAll', [], 2],
        ['unselectAll', ['item-1', 'item-2'], 0],
        ['toggleAll', [], 2],
      ] as const)('should %s correctly', async (method, initial, expectedLength) => {
        const model = ref<string[]>([...initial])
        const { groupProps, wait } = mountGroup({ model })
        await wait()

        groupProps()[method]()
        await wait()
        expect(model.value).toHaveLength(expectedLength)
      })

      it('should toggle all back to none', async () => {
        const model = ref<string[]>([])
        const { groupProps, wait } = mountGroup({ model })
        await wait()

        groupProps().toggleAll()
        await wait()
        expect(model.value).toHaveLength(2)

        groupProps().toggleAll()
        await wait()
        expect(model.value).toHaveLength(0)
      })

      it('should skip disabled items in selectAll', async () => {
        const model = ref<string[]>([])
        const { groupProps, wait } = mountGroup({
          model,
          items: [
            { value: 'item-1' },
            { value: 'item-2', disabled: true },
          ],
        })
        await wait()

        groupProps().selectAll()
        await wait()
        expect(model.value).toEqual(['item-1'])
      })
    })

    describe('tri-state (mixed/indeterminate)', () => {
      it('should set mixed state with mix()', async () => {
        const { itemProps, wait } = mountGroup()
        await wait()

        expect(itemProps('item-1').isMixed).toBe(false)
        itemProps('item-1').mix()
        await wait()
        expect(itemProps('item-1').isMixed).toBe(true)
      })

      it('should clear mixed state with unmix()', async () => {
        const { itemProps, wait } = mountGroup()
        await wait()

        itemProps('item-1').mix()
        await wait()
        itemProps('item-1').unmix()
        await wait()
        expect(itemProps('item-1').isMixed).toBe(false)
      })

      it('should initialize to mixed when indeterminate=true', async () => {
        const { itemProps, wait } = mountGroup({
          items: [{ value: 'item-1', indeterminate: true }],
        })
        await wait()

        expect(itemProps('item-1').isMixed).toBe(true)
        expect(itemProps('item-1').attrs['aria-checked']).toBe('mixed')
      })

      it('should set aria-checked to mixed', async () => {
        const { itemProps, wait } = mountGroup()
        await wait()

        itemProps('item-1').mix()
        await wait()
        expect(itemProps('item-1').attrs['aria-checked']).toBe('mixed')
        expect(itemProps('item-1').attrs['data-state']).toBe('indeterminate')
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
                    h(Checkbox.Indicator as any, {}, () => 'Item'),
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
      it('should isolate groups with different namespaces', async () => {
        let group1Props: any
        let group2Props: any

        mount(defineComponent({
          render: () => [
            h(Checkbox.Group as any, { namespace: 'ns-1' }, () =>
              h(Checkbox.Root as any, { value: 'a', groupNamespace: 'ns-1' }, {
                default: (p: any) => {
                  group1Props = p
                  return 'A'
                },
              }),
            ),
            h(Checkbox.Group as any, { namespace: 'ns-2' }, () =>
              h(Checkbox.Root as any, { value: 'b', groupNamespace: 'ns-2' }, {
                default: (p: any) => {
                  group2Props = p
                  return 'B'
                },
              }),
            ),
          ],
        }))

        await nextTick()
        group1Props.toggle()
        await nextTick()

        expect(group1Props.isChecked).toBe(true)
        expect(group2Props.isChecked).toBe(false)
      })
    })

    describe('mandatory prop', () => {
      it('should prevent deselecting last item when mandatory=true', async () => {
        const model = ref<string[]>(['item-1'])
        const { itemProps, wait } = mountGroup({
          model,
          props: { mandatory: true },
          items: [{ value: 'item-1' }],
        })
        await wait()

        itemProps('item-1').toggle()
        await wait()
        expect(model.value).toContain('item-1')
      })

      it('should auto-select first item when mandatory=force', async () => {
        const { itemProps, wait } = mountGroup({
          props: { mandatory: 'force' },
          items: [{ value: 'item-1' }],
        })
        await wait()
        expect(itemProps('item-1').isChecked).toBe(true)
      })
    })

    describe('enroll prop', () => {
      it('should auto-select non-disabled items when enroll=true', async () => {
        const { itemProps, wait } = mountGroup({
          props: { enroll: true },
          items: [
            { value: 'item-1' },
            { value: 'item-2', disabled: true },
          ],
        })
        await wait()

        expect(itemProps('item-1').isChecked).toBe(true)
        expect(itemProps('item-2').isChecked).toBe(false)
      })
    })

    describe('batch operations with ID arrays', () => {
      it.each([
        ['select', ['id-1', 'id-3'], { 'item-1': true, 'item-2': false, 'item-3': true }],
        ['toggle', ['id-1', 'id-2'], { 'item-1': true, 'item-2': true, 'item-3': false }],
      ] as const)('should %s multiple items by ID array', async (method, ids, expected) => {
        const model = ref<string[]>([])
        const { groupProps, itemProps, wait } = mountGroup({
          model,
          items: [
            { value: 'item-1', id: 'id-1' },
            { value: 'item-2', id: 'id-2' },
            { value: 'item-3', id: 'id-3' },
          ],
        })
        await wait()

        groupProps()[method](ids)
        await wait()

        for (const [value, isChecked] of Object.entries(expected)) {
          expect(itemProps(value).isChecked).toBe(isChecked)
        }
      })

      it('should unselect multiple items by ID array', async () => {
        const model = ref<string[]>(['item-1', 'item-2', 'item-3'])
        const { groupProps, itemProps, wait } = mountGroup({
          model,
          items: [
            { value: 'item-1', id: 'id-1' },
            { value: 'item-2', id: 'id-2' },
            { value: 'item-3', id: 'id-3' },
          ],
        })
        await wait()

        groupProps().unselect(['id-1', 'id-3'])
        await wait()

        expect(itemProps('item-1').isChecked).toBe(false)
        expect(itemProps('item-2').isChecked).toBe(true)
        expect(itemProps('item-3').isChecked).toBe(false)
      })
    })
  })

  describe('atom integration', () => {
    it.each([
      ['Root', 'button', Checkbox.Root, 'button'],
      ['Indicator', 'span', Checkbox.Root, 'span'],
    ])('should render %s as %s by default', (_, element, Component) => {
      const wrapper = mount(Component as any, {
        slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
      })
      expect(wrapper.find(element).exists()).toBe(true)
    })

    it('should render Root as specified element', () => {
      const wrapper = mount(Checkbox.Root, {
        props: { as: 'div' },
        slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
      })
      expect(wrapper.find('div[role="checkbox"]').exists()).toBe(true)
    })

    it('should set type=button only when as=button', () => {
      const buttonWrapper = mount(Checkbox.Root, {
        props: { as: 'button' },
        slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
      })
      expect(buttonWrapper.find('button').attributes('type')).toBe('button')

      const divWrapper = mount(Checkbox.Root, {
        props: { as: 'div' },
        slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
      })
      expect(divWrapper.find('div').attributes('type')).toBeUndefined()
    })

    it('should render slot content directly when renderless=true', async () => {
      let capturedProps: any
      const wrapper = mount(Checkbox.Root, {
        props: { renderless: true },
        slots: {
          default: (props: any) => {
            capturedProps = props
            return h('div', { class: 'custom', ...props.attrs }, 'Custom')
          },
        },
      })
      await nextTick()

      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(capturedProps.attrs.role).toBe('checkbox')
    })
  })

  describe('sSR / Hydration', () => {
    it.each([
      ['standalone', { modelValue: true }, ['role="checkbox"', 'aria-checked="true"', 'data-state="checked"']],
      ['group', {}, ['role="checkbox"']],
      ['disabled', { disabled: true }, ['aria-disabled="true"', 'data-disabled']],
    ])('should render %s to string without errors', async (mode, props, expected) => {
      const component = mode === 'standalone'
        ? () => h(Checkbox.Root as any, props, () => h(Checkbox.Indicator as any, {}, () => 'X'))
        : () => h(Checkbox.Group as any, props, () =>
            h(Checkbox.Root as any, { value: 'a' }, () => h(Checkbox.Indicator as any, {}, () => 'A')),
          )

      const app = createSSRApp(defineComponent({ render: component }))
      const html = await renderToString(app)

      expect(html).toBeTruthy()
      for (const exp of expected) {
        expect(html).toContain(exp)
      }
    })

    it('should use provided id for deterministic SSR', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Checkbox.Root as any, { id: 'stable-id' }, () =>
          h(Checkbox.Indicator as any, {}, () => 'X'),
        ),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()

      // Client should match
      let capturedId: string
      mount(Checkbox.Root, {
        props: { id: 'stable-id' },
        slots: {
          default: (p: any) => {
            capturedId = p.id
            return 'X'
          },
        },
      })
      await nextTick()
      expect(capturedId!).toBe('stable-id')
    })
  })

  describe('error conditions', () => {
    it('should throw when Indicator used outside Root', () => {
      expect(() => {
        mount(Checkbox.Indicator)
      }).toThrow()
    })

    it('should work in standalone mode without Group', async () => {
      const model = ref(false)
      const { props, wait } = mountCheckbox({ model })
      await wait()

      props().toggle()
      await wait()
      expect(model.value).toBe(true)
    })
  })

  describe('selectAll component', () => {
    describe('rendering and a11y', () => {
      it.each([
        ['role', 'checkbox'],
        ['tabindex', 0],
      ] as const)('should set %s correctly', async (attr, expected) => {
        const { props, wait } = mountSelectAll()
        await wait()
        expect(props().attrs[attr]).toBe(expected)
      })

      it('should set aria-label from label prop', async () => {
        const { props, wait } = mountSelectAll({ props: { label: 'Select All' } })
        await wait()
        expect(props().attrs['aria-label']).toBe('Select All')
      })
    })

    describe('state reflection', () => {
      it.each([
        ['none selected', [], { isAllSelected: false, isMixed: false }],
        ['some selected', ['item-1'], { isAllSelected: false, isMixed: true }],
        ['all selected', ['item-1', 'item-2'], { isAllSelected: true, isMixed: false }],
      ] as const)('should reflect %s state', async (_, initial, expected) => {
        const model = ref<string[]>([...initial])
        const { props, wait } = mountSelectAll({ model })
        await wait()

        expect(props().isAllSelected).toBe(expected.isAllSelected)
        expect(props().isMixed).toBe(expected.isMixed)
      })

      it('should show indicator based on state', async () => {
        const model = ref<string[]>([])
        const { wrapper, indicatorProps, wait } = mountSelectAll({ model })
        await wait()

        expect(indicatorProps().attrs.style.visibility).toBe('hidden')

        // Use setProps to trigger reactive update
        await wrapper.setProps({ modelValue: ['item-1', 'item-2'] })
        await wait()
        expect(indicatorProps().attrs.style.visibility).toBe('visible')
      })
    })

    describe('toggleAll interaction', () => {
      it('should select all on click when none selected', async () => {
        const model = ref<string[]>([])
        const { wrapper, wait } = mountSelectAll({ model })
        await wait()

        await wrapper.find('button').trigger('click')
        await wait()
        expect(model.value).toHaveLength(2)
      })

      it('should unselect all on click when all selected', async () => {
        const model = ref<string[]>(['item-1', 'item-2'])
        const { wrapper, wait } = mountSelectAll({ model })
        await wait()

        await wrapper.find('button').trigger('click')
        await wait()
        expect(model.value).toHaveLength(0)
      })

      it('should toggle on Space key', async () => {
        const model = ref<string[]>([])
        const { wrapper, wait } = mountSelectAll({ model })
        await wait()

        await wrapper.find('button').trigger('keydown', { key: ' ' })
        await wait()
        expect(model.value).toHaveLength(2)
      })
    })

    describe('disabled state', () => {
      it('should be disabled when Group is disabled', async () => {
        const { props, wait } = mountSelectAll({ groupProps: { disabled: true } })
        await wait()

        expect(props().isDisabled).toBe(true)
        expect(props().attrs['aria-disabled']).toBe(true)
        expect(props().attrs.tabindex).toBeUndefined()
      })

      it('should be disabled when prop is set', async () => {
        const { props, wait } = mountSelectAll({ props: { disabled: true } })
        await wait()
        expect(props().isDisabled).toBe(true)
      })

      it('should not toggle when disabled', async () => {
        const model = ref<string[]>([])
        const { wrapper, wait } = mountSelectAll({ model, props: { disabled: true } })
        await wait()

        await wrapper.find('button').trigger('click')
        await wait()
        expect(model.value).toHaveLength(0)
      })
    })

    describe('dynamic group membership', () => {
      it('should update state when items are added', async () => {
        const model = ref<string[]>([])
        const showThird = ref(false)
        let selectAllProps: any

        mount(defineComponent({
          setup: () => ({ model, showThird }),
          render () {
            return h(Checkbox.Group as any, {
              'modelValue': model.value,
              'onUpdate:modelValue': (v: unknown) => {
                model.value = v as string[]
              },
            }, () => [
              h(Checkbox.SelectAll as any, {}, {
                default: (p: any) => {
                  selectAllProps = p
                  return 'All'
                },
              }),
              h(Checkbox.Root as any, { value: 'a' }, () => 'A'),
              h(Checkbox.Root as any, { value: 'b' }, () => 'B'),
              showThird.value ? h(Checkbox.Root as any, { value: 'c' }, () => 'C') : null,
            ])
          },
        }))

        await nextTick()
        selectAllProps.selectAll()
        await nextTick()
        expect(selectAllProps.isAllSelected).toBe(true)

        showThird.value = true
        await nextTick()
        expect(selectAllProps.isAllSelected).toBe(false)
        expect(selectAllProps.isMixed).toBe(true)
      })
    })

    describe('does not register as group item', () => {
      it('should not be counted in selection', async () => {
        const model = ref<string[]>([])
        const { props, wait } = mountSelectAll({ model })
        await wait()

        props().selectAll()
        await wait()
        // Only the 2 Root items, not SelectAll itself
        expect(model.value).toHaveLength(2)
      })
    })

    describe('sSR rendering', () => {
      it('should render to string without errors', async () => {
        const app = createSSRApp(defineComponent({
          render: () => h(Checkbox.Group as any, {}, () => [
            h(Checkbox.SelectAll as any, {}, () =>
              h(Checkbox.Indicator as any, {}, () => 'All'),
            ),
            h(Checkbox.Root as any, { value: 'a' }, () => 'A'),
          ]),
        }))

        const html = await renderToString(app)
        expect(html).toContain('role="checkbox"')
      })
    })

    describe('renderless mode', () => {
      it('should render slot content directly', async () => {
        let capturedProps: any

        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.SelectAll as any, { renderless: true }, {
                default: (p: any) => {
                  capturedProps = p
                  return h('div', { class: 'custom', ...p.attrs }, 'Custom')
                },
              }),
              h(Checkbox.Root as any, { value: 'a' }, () => 'A'),
            ],
          },
        })

        await nextTick()
        expect(wrapper.find('.custom').exists()).toBe(true)
        expect(capturedProps.attrs.role).toBe('checkbox')
      })
    })
  })

  describe('form integration', () => {
    describe('auto-rendered hidden input', () => {
      it('should render when name prop is provided', () => {
        const wrapper = mount(Checkbox.Root, {
          props: { name: 'agree' },
          slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('agree')
      })

      it.each([
        ['value', { name: 'agree', value: 'yes' }, 'yes'],
        ['default value', { name: 'agree' }, 'on'],
        ['form', { name: 'agree', form: 'my-form' }, 'my-form'],
      ])('should set %s correctly', (_, props, expected) => {
        const wrapper = mount(Checkbox.Root, {
          props,
          slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
        })

        const input = wrapper.find('input[type="checkbox"]')
        const attr = Object.keys(props).find(k => k !== 'name') || 'value'
        expect(input.attributes(attr === 'value' ? 'value' : attr)).toBe(expected)
      })

      it('should be disabled when checkbox is disabled', () => {
        const wrapper = mount(Checkbox.Root, {
          props: { name: 'agree', disabled: true },
          slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
        })

        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      })

      it('should have inert and negative tabindex', () => {
        const wrapper = mount(Checkbox.Root, {
          props: { name: 'agree' },
          slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
        })

        const input = wrapper.find('input')
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
              h(Checkbox.Indicator as any, {}, () => 'X'),
            ],
          },
        })

        expect(wrapper.find('input[name="agree"]').exists()).toBe(true)
      })

      it('should override context values with explicit props', () => {
        const wrapper = mount(Checkbox.Root, {
          props: { value: 'context-value' },
          slots: {
            default: () => [
              h(Checkbox.HiddenInput as any, { name: 'agree', value: 'explicit' }),
              h(Checkbox.Indicator as any, {}, () => 'X'),
            ],
          },
        })

        expect(wrapper.find('input').attributes('value')).toBe('explicit')
      })
    })

    describe('form integration in group mode', () => {
      it('should render hidden inputs for multiple checkboxes', () => {
        const wrapper = mount(Checkbox.Group, {
          slots: {
            default: () => [
              h(Checkbox.Root as any, { name: 'opts', value: 'a' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'A'),
              ),
              h(Checkbox.Root as any, { name: 'opts', value: 'b' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'B'),
              ),
            ],
          },
        })

        const inputs = wrapper.findAll('input[type="checkbox"]')
        expect(inputs).toHaveLength(2)
        expect(inputs[0]!.attributes('value')).toBe('a')
        expect(inputs[1]!.attributes('value')).toBe('b')
      })

      it('should sync checked state with group selection', async () => {
        const model = ref<string[]>([])
        let itemProps: any

        const wrapper = mount(Checkbox.Group, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: unknown) => {
              model.value = v as string[]
            },
          },
          slots: {
            default: () => [
              h(Checkbox.Root as any, { name: 'opts', value: 'a' }, {
                default: (p: any) => {
                  itemProps = p
                  return h(Checkbox.Indicator as any, {}, () => 'A')
                },
              }),
              h(Checkbox.Root as any, { name: 'opts', value: 'b' }, () =>
                h(Checkbox.Indicator as any, {}, () => 'B'),
              ),
            ],
          },
          attachTo: document.body,
        })

        await nextTick()
        itemProps.toggle()
        await nextTick()

        const inputs = wrapper.findAll('input[type="checkbox"]')
        expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true)
        expect((inputs[1]!.element as HTMLInputElement).checked).toBe(false)

        wrapper.unmount()
      })
    })

    describe('formData population', () => {
      it.each([
        ['populate when checked', true, 'yes'],
        ['not populate when unchecked', false, null],
      ])('should %s', async (_, checked, expected) => {
        const wrapper = mount(Checkbox.Root, {
          props: { name: 'agree', value: 'yes', modelValue: checked },
          slots: { default: () => h(Checkbox.Indicator as any, {}, () => 'X') },
          attachTo: document.body,
        })

        await nextTick()
        const input = wrapper.find('input').element as HTMLInputElement
        const formData = new FormData()
        if (input.checked) formData.append(input.name, input.value)

        expect(formData.get('agree')).toBe(expected)
        wrapper.unmount()
      })
    })
  })
})
