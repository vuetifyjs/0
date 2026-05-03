import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Switch } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref, type Ref } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'

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
 * Mount a standalone Switch.Root with slot prop capture
 */
function mountSwitch (options: {
  props?: Record<string, unknown>
  model?: Ref<boolean>
} = {}): MountResult {
  let capturedProps: any

  const wrapper = mount(Switch.Root, {
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
        return h(Switch.Track as any, {}, () =>
          h(Switch.Thumb as any),
        )
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
 * Mount a Switch.Group with items and slot prop capture
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

  const wrapper = mount(Switch.Group, {
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
          h(Switch.Root as any, {
            value: item.value,
            id: item.id,
            disabled: item.disabled,
            indeterminate: item.indeterminate,
          }, {
            default: (p: any) => {
              itemProps[item.value] = p
              return h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              )
            },
          }),
        )
        if (options.withSelectAll) {
          children.unshift(
            h(Switch.SelectAll as any, {}, {
              default: (p: any) => {
                selectAllProps = p
                return h(Switch.Track as any, {}, () =>
                  h(Switch.Thumb as any),
                )
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
  const itemProps: Record<string, any> = {}

  const wrapper = mount(Switch.Group, {
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
        h(Switch.SelectAll as any, options.props, {
          default: (props: any) => {
            selectAllProps = props
            return h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
            )
          },
        }),
        ...items.map(item =>
          h(Switch.Root as any, { value: item.value, disabled: item.disabled }, {
            default: (p: any) => {
              itemProps[item.value] = p
              return h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              )
            },
          }),
        ),
      ],
    },
  })

  return {
    wrapper,
    props: () => selectAllProps,
    itemProps: (key: string) => itemProps[key],
    wait: () => nextTick(),
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('switch', () => {
  describe('standalone mode', () => {
    describe('v-model binding', () => {
      it('should bind to v-model boolean', async () => {
        let rootProps: any
        let emittedValue: boolean | undefined

        mount(Switch.Root, {
          props: {
            'onUpdate:modelValue': (value: unknown) => {
              emittedValue = value as boolean
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              )
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
        const { props, wait } = mountSwitch({ props: { modelValue: true } })
        await wait()
        expect(props().isChecked).toBe(true)
      })

      it.each([
        ['select', false, true],
        ['unselect', true, false],
        ['toggle', false, true],
      ] as const)('should %s correctly', async (method, initial, expected) => {
        const model = ref(initial)
        const { props, wait } = mountSwitch({ model })
        await wait()

        props()[method]()
        await wait()
        expect(model.value).toBe(expected)
      })
    })

    describe('accessibility', () => {
      it.each([
        ['role', {}, 'switch'],
        ['tabindex', {}, 0],
        ['data-state', { modelValue: false }, 'unchecked'],
        ['data-state', { modelValue: true }, 'checked'],
        ['aria-checked', { modelValue: false }, false],
        ['aria-checked', { modelValue: true }, true],
        ['aria-label', { label: 'Dark mode' }, 'Dark mode'],
        ['aria-labelledby', { 'aria-labelledby': 'my-label' }, 'my-label'],
        ['aria-describedby', { 'aria-describedby': 'my-desc' }, 'my-desc'],
        ['aria-invalid', { 'aria-invalid': true }, true],
      ] as const)('should set %s correctly', async (attr, inputProps, expected) => {
        const { props, wait } = mountSwitch({ props: inputProps })
        await wait()
        expect(props().attrs[attr]).toBe(expected)
      })

      it('should update aria-checked reactively', async () => {
        const { wrapper, props, wait } = mountSwitch({ props: { modelValue: false } })
        await wait()
        expect(props().attrs['aria-checked']).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await wait()
        expect(props().attrs['aria-checked']).toBe(true)
      })
    })

    describe('disabled state', () => {
      it('should apply disabled attrs', async () => {
        const { props, wait } = mountSwitch({ props: { disabled: true } })
        await wait()

        expect(props().isDisabled).toBe(true)
        expect(props().attrs['aria-disabled']).toBe(true)
        expect(props().attrs.tabindex).toBeUndefined()
        expect(props().attrs['data-disabled']).toBe(true)
      })

      it('should not toggle when disabled', async () => {
        const model = ref(false)
        const { props, wait } = mountSwitch({ model, props: { disabled: true } })
        await wait()

        props().toggle()
        await wait()
        expect(model.value).toBe(false)
      })

      it('should update disabled state reactively', async () => {
        const { wrapper, props, wait } = mountSwitch({ props: { disabled: false } })
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
        const { wrapper, wait } = mountSwitch({ model })
        await wait()

        const button = wrapper.find('button')
        await (trigger === 'click' ? button.trigger('click') : button.trigger('keydown', { key: trigger }))
        await wait()
        expect(model.value).toBe(expected)
      })

      it('should not toggle on Space when disabled', async () => {
        const model = ref(false)
        const { wrapper, wait } = mountSwitch({ model, props: { disabled: true } })
        await wait()

        await wrapper.find('button').trigger('keydown', { key: ' ' })
        await wait()
        expect(model.value).toBe(false)
      })

      it('should prevent default on Space keydown', async () => {
        const { wrapper, wait } = mountSwitch()
        await wait()

        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
        wrapper.find('button').element.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose all required slot props', async () => {
        const { props, wait } = mountSwitch({
          props: { id: 'my-switch', label: 'My Label', value: 'my-value' },
        })
        await wait()

        expect(props().id).toBe('my-switch')
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
        const { props, wait } = mountSwitch()
        await wait()

        expect(props().id).toBeDefined()
        expect(typeof props().id).toBe('string')
      })
    })

    describe('indeterminate state', () => {
      it('should be false by default in standalone', async () => {
        const { props, wait } = mountSwitch()
        await wait()
        expect(props().isMixed).toBe(false)
      })

      it('should honor indeterminate prop', async () => {
        const { props, wait } = mountSwitch({ props: { indeterminate: true } })
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

        mount(Switch.Group, {
          slots: {
            default: (props: any) => {
              groupProps = props
              return showItem.value
                ? h(Switch.Root as any, { value: 'item-1' }, () =>
                    h(Switch.Track as any, {}, () =>
                      h(Switch.Thumb as any),
                    ),
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

  describe('track and thumb', () => {
    it('should render Track with data-state', async () => {
      const { wrapper, wait } = mountSwitch({ props: { modelValue: true } })
      await wait()

      const track = wrapper.find('span[data-state]')
      expect(track.exists()).toBe(true)
      expect(track.attributes('data-state')).toBe('checked')
    })

    it('should render Thumb with visibility hidden when unchecked', async () => {
      const { wrapper, wait } = mountSwitch({ props: { modelValue: false } })
      await wait()

      const thumb = wrapper.findAll('span[data-state]').find(
        el => el.attributes('style')?.includes('visibility'),
      )
      expect(thumb).toBeDefined()
      expect(thumb!.attributes('style')).toContain('hidden')
    })

    it('should render Thumb with visibility visible when checked', async () => {
      const { wrapper, wait } = mountSwitch({ props: { modelValue: true } })
      await wait()

      const thumb = wrapper.findAll('span[data-state]').find(
        el => el.attributes('style')?.includes('visibility'),
      )
      expect(thumb).toBeDefined()
      expect(thumb!.attributes('style')).toContain('visible')
    })

    it('should throw when Track used outside Root', () => {
      expect(() => {
        mount(Switch.Track)
      }).toThrow()
    })

    it('should throw when Thumb used outside Root', () => {
      expect(() => {
        mount(Switch.Thumb)
      }).toThrow()
    })
  })

  describe('atom integration', () => {
    it('should render Root as button by default', () => {
      const wrapper = mount(Switch.Root as any, {
        slots: {
          default: () => h(Switch.Track as any, {}, () =>
            h(Switch.Thumb as any),
          ),
        },
      })
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render Root as specified element', () => {
      const wrapper = mount(Switch.Root, {
        props: { as: 'div' },
        slots: {
          default: () => h(Switch.Track as any, {}, () =>
            h(Switch.Thumb as any),
          ),
        },
      })
      expect(wrapper.find('div[role="switch"]').exists()).toBe(true)
    })

    it('should set type=button only when as=button', () => {
      const buttonWrapper = mount(Switch.Root, {
        props: { as: 'button' },
        slots: {
          default: () => h(Switch.Track as any, {}, () =>
            h(Switch.Thumb as any),
          ),
        },
      })
      expect(buttonWrapper.find('button').attributes('type')).toBe('button')

      const divWrapper = mount(Switch.Root, {
        props: { as: 'div' },
        slots: {
          default: () => h(Switch.Track as any, {}, () =>
            h(Switch.Thumb as any),
          ),
        },
      })
      expect(divWrapper.find('div').attributes('type')).toBeUndefined()
    })

    it('should render slot content directly when renderless=true', async () => {
      let capturedProps: any
      const wrapper = mount(Switch.Root, {
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
      expect(capturedProps.attrs.role).toBe('switch')
    })
  })

  describe('sSR / Hydration', () => {
    it.each([
      ['standalone', { modelValue: true }, ['role="switch"', 'aria-checked="true"', 'data-state="checked"']],
      ['group', {}, ['role="switch"']],
      ['disabled', { disabled: true }, ['aria-disabled="true"', 'data-disabled']],
    ])('should render %s to string without errors', async (mode, props, expected) => {
      const component = mode === 'standalone'
        ? () => h(Switch.Root as any, props, () =>
            h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
            ),
          )
        : () => h(Switch.Group as any, props, () =>
            h(Switch.Root as any, { value: 'a' }, () =>
              h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              ),
            ),
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
        render: () => h(Switch.Root as any, { id: 'stable-id' }, () =>
          h(Switch.Track as any, {}, () =>
            h(Switch.Thumb as any),
          ),
        ),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()

      let capturedId: string
      mount(Switch.Root, {
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

  describe('selectAll component', () => {
    describe('rendering and a11y', () => {
      it.each([
        ['role', 'switch'],
        ['tabindex', 0],
      ] as const)('should set %s correctly', async (attr, expected) => {
        const { props, wait } = mountSelectAll()
        await wait()
        expect(props().attrs[attr]).toBe(expected)
      })

      it('should set aria-label from label prop', async () => {
        const { props, wait } = mountSelectAll({ props: { label: 'Toggle All' } })
        await wait()
        expect(props().attrs['aria-label']).toBe('Toggle All')
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
            return h(Switch.Group as any, {
              'modelValue': model.value,
              'onUpdate:modelValue': (v: unknown) => {
                model.value = v as string[]
              },
            }, () => [
              h(Switch.SelectAll as any, {}, {
                default: (p: any) => {
                  selectAllProps = p
                  return h(Switch.Track as any, {}, () =>
                    h(Switch.Thumb as any),
                  )
                },
              }),
              h(Switch.Root as any, { value: 'a' }, () =>
                h(Switch.Track as any, {}, () =>
                  h(Switch.Thumb as any),
                ),
              ),
              h(Switch.Root as any, { value: 'b' }, () =>
                h(Switch.Track as any, {}, () =>
                  h(Switch.Thumb as any),
                ),
              ),
              showThird.value
                ? h(Switch.Root as any, { value: 'c' }, () =>
                    h(Switch.Track as any, {}, () =>
                      h(Switch.Thumb as any),
                    ),
                  )
                : null,
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
        expect(model.value).toHaveLength(2)
      })
    })

    describe('sSR rendering', () => {
      it('should render to string without errors', async () => {
        const app = createSSRApp(defineComponent({
          render: () => h(Switch.Group as any, {}, () => [
            h(Switch.SelectAll as any, {}, () =>
              h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              ),
            ),
            h(Switch.Root as any, { value: 'a' }, () =>
              h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              ),
            ),
          ]),
        }))

        const html = await renderToString(app)
        expect(html).toContain('role="switch"')
      })
    })
  })

  describe('form integration', () => {
    describe('auto-rendered hidden input', () => {
      it('should render when name prop is provided', () => {
        const wrapper = mount(Switch.Root, {
          props: { name: 'notifications' },
          slots: {
            default: () => h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
            ),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('name')).toBe('notifications')
      })

      it.each([
        ['value', { name: 'notify', value: 'yes' }, 'yes'],
        ['default value', { name: 'notify' }, 'on'],
        ['form', { name: 'notify', form: 'my-form' }, 'my-form'],
      ])('should set %s correctly', (_, props, expected) => {
        const wrapper = mount(Switch.Root, {
          props,
          slots: {
            default: () => h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
            ),
          },
        })

        const input = wrapper.find('input[type="checkbox"]')
        const attr = Object.keys(props).find(k => k !== 'name') || 'value'
        expect(input.attributes(attr === 'value' ? 'value' : attr)).toBe(expected)
      })

      it('should be disabled when switch is disabled', () => {
        const wrapper = mount(Switch.Root, {
          props: { name: 'notify', disabled: true },
          slots: {
            default: () => h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
            ),
          },
        })

        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      })

      it('should have inert and negative tabindex', () => {
        const wrapper = mount(Switch.Root, {
          props: { name: 'notify' },
          slots: {
            default: () => h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
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
        const wrapper = mount(Switch.Root, {
          slots: {
            default: () => [
              h(Switch.HiddenInput as any, { name: 'notify' }),
              h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              ),
            ],
          },
        })

        expect(wrapper.find('input[name="notify"]').exists()).toBe(true)
      })

      it('should override context values with explicit props', () => {
        const wrapper = mount(Switch.Root, {
          props: { value: 'context-value' },
          slots: {
            default: () => [
              h(Switch.HiddenInput as any, { name: 'notify', value: 'explicit' }),
              h(Switch.Track as any, {}, () =>
                h(Switch.Thumb as any),
              ),
            ],
          },
        })

        expect(wrapper.find('input').attributes('value')).toBe('explicit')
      })
    })

    describe('form integration in group mode', () => {
      it('should render hidden inputs for multiple switches', () => {
        const wrapper = mount(Switch.Group, {
          slots: {
            default: () => [
              h(Switch.Root as any, { name: 'opts', value: 'a' }, () =>
                h(Switch.Track as any, {}, () =>
                  h(Switch.Thumb as any),
                ),
              ),
              h(Switch.Root as any, { name: 'opts', value: 'b' }, () =>
                h(Switch.Track as any, {}, () =>
                  h(Switch.Thumb as any),
                ),
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

        const wrapper = mount(Switch.Group, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: unknown) => {
              model.value = v as string[]
            },
          },
          slots: {
            default: () => [
              h(Switch.Root as any, { name: 'opts', value: 'a' }, {
                default: (p: any) => {
                  itemProps = p
                  return h(Switch.Track as any, {}, () =>
                    h(Switch.Thumb as any),
                  )
                },
              }),
              h(Switch.Root as any, { name: 'opts', value: 'b' }, () =>
                h(Switch.Track as any, {}, () =>
                  h(Switch.Thumb as any),
                ),
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
        const wrapper = mount(Switch.Root, {
          props: { name: 'notify', value: 'yes', modelValue: checked },
          slots: {
            default: () => h(Switch.Track as any, {}, () =>
              h(Switch.Thumb as any),
            ),
          },
          attachTo: document.body,
        })

        await nextTick()
        const input = wrapper.find('input').element as HTMLInputElement
        const formData = new FormData()
        if (input.checked) formData.append(input.name, input.value)

        expect(formData.get('notify')).toBe(expected)
        wrapper.unmount()
      })
    })
  })
})

// Additional coverage tests
describe('additional coverage', () => {
  describe('group mode select/unselect', () => {
    it('should call ticket.select in group mode', async () => {
      const model = ref<string[]>([])
      const { itemProps, wait } = mountGroup({ model })
      await wait()
      itemProps('item-1').select()
      await wait()
      expect(model.value).toContain('item-1')
    })

    it('should call ticket.unselect in group mode', async () => {
      const model = ref<string[]>(['item-1'])
      const { itemProps, wait } = mountGroup({ model })
      await wait()
      itemProps('item-1').unselect()
      await wait()
      expect(model.value).not.toContain('item-1')
    })
  })

  describe('selectAll keydown when disabled', () => {
    it('should not toggle on Space when selectAll is disabled via prop', async () => {
      const model = ref<string[]>([])
      const { wrapper, wait } = mountSelectAll({ model, props: { disabled: true } })
      await wait()
      await wrapper.find('button').trigger('keydown', { key: ' ' })
      await wait()
      expect(model.value).toHaveLength(0)
    })

    it('should prevent default on Space even when disabled', async () => {
      const { wrapper, wait } = mountSelectAll({ props: { disabled: true } })
      await wait()
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
      wrapper.find('button').element.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('value serialization', () => {
    it('should serialize null/undefined value as "on"', () => {
      const wrapper = mount(Switch.Root, {
        props: { name: 'notify', value: undefined },
        slots: { default: () => h(Switch.Track as any, {}, () => h(Switch.Thumb as any)) },
      })
      expect(wrapper.find('input').attributes('value')).toBe('on')
    })

    it('should serialize object value as JSON', () => {
      const wrapper = mount(Switch.Root, {
        props: { name: 'data', value: { foo: 'bar' } },
        slots: { default: () => h(Switch.Track as any, {}, () => h(Switch.Thumb as any)) },
      })
      expect(wrapper.find('input').attributes('value')).toBe('{"foo":"bar"}')
    })
  })

  describe('standalone select/unselect methods', () => {
    it('should select in standalone mode', async () => {
      const model = ref(false)
      const { props, wait } = mountSwitch({ model })
      await wait()
      props().select()
      await wait()
      expect(model.value).toBe(true)
    })

    it('should unselect in standalone mode', async () => {
      const model = ref(true)
      const { props, wait } = mountSwitch({ model })
      await wait()
      props().unselect()
      await wait()
      expect(model.value).toBe(false)
    })

    it('should not select when disabled', async () => {
      const model = ref(false)
      const { props, wait } = mountSwitch({ model, props: { disabled: true } })
      await wait()
      props().select()
      await wait()
      expect(model.value).toBe(false)
    })

    it('should not unselect when disabled', async () => {
      const model = ref(true)
      const { props, wait } = mountSwitch({ model, props: { disabled: true } })
      await wait()
      props().unselect()
      await wait()
      expect(model.value).toBe(true)
    })
  })

  describe('keyboard edge cases', () => {
    it('should ignore non-space keydown events', async () => {
      const model = ref(false)
      const { wrapper, wait } = mountSwitch({ model })
      await wait()
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      await wait()
      expect(model.value).toBe(false)
    })
  })

  describe('standalone mix/unmix no-ops', () => {
    it('should not throw when calling mix() in standalone mode', async () => {
      const { props, wait } = mountSwitch()
      await wait()
      expect(() => props().mix()).not.toThrow()
    })

    it('should not throw when calling unmix() in standalone mode', async () => {
      const { props, wait } = mountSwitch()
      await wait()
      expect(() => props().unmix()).not.toThrow()
    })
  })

  describe('aRIA attributes with specific states', () => {
    it('should set data-state to indeterminate when mixed', async () => {
      const { itemProps, wait } = mountGroup({
        items: [{ value: 'item-1', indeterminate: true }],
      })
      await wait()
      expect(itemProps('item-1').attrs['data-state']).toBe('indeterminate')
    })

    it('should set aria-checked to mixed when indeterminate', async () => {
      const { itemProps, wait } = mountGroup({
        items: [{ value: 'item-1', indeterminate: true }],
      })
      await wait()
      expect(itemProps('item-1').attrs['aria-checked']).toBe('mixed')
    })

    it('should set data-disabled when disabled', async () => {
      const { props, wait } = mountSwitch({ props: { disabled: true } })
      await wait()
      expect(props().attrs['data-disabled']).toBe(true)
    })
  })

  describe('hidden input form validation integration', () => {
    it('should handle null value in hidden input', () => {
      const wrapper = mount(Switch.Root, {
        props: { name: 'field', value: null as unknown as string },
        slots: { default: () => h(Switch.Track as any, {}, () => h(Switch.Thumb as any)) },
      })
      // isNullOrUndefined(null) returns true => 'on'
      expect(wrapper.find('input').attributes('value')).toBe('on')
    })
  })

  describe('selectAll keyboard edge cases', () => {
    it('should ignore non-space keydown on selectAll', async () => {
      const model = ref<string[]>([])
      const { wrapper, wait } = mountSelectAll({ model })
      await wait()
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      await wait()
      expect(model.value).toHaveLength(0)
    })
  })

  describe('selectAll data-state and disabled rendering', () => {
    it('should set data-state to checked when all selected', async () => {
      const model = ref<string[]>(['item-1', 'item-2'])
      const { props, wait } = mountSelectAll({ model })
      await wait()
      expect(props().attrs['data-state']).toBe('checked')
    })

    it('should set data-state to indeterminate when partially selected', async () => {
      const model = ref<string[]>(['item-1'])
      const { props, wait } = mountSelectAll({ model })
      await wait()
      expect(props().attrs['data-state']).toBe('indeterminate')
    })

    it('should set data-state to unchecked when none selected', async () => {
      const model = ref<string[]>([])
      const { props, wait } = mountSelectAll({ model })
      await wait()
      expect(props().attrs['data-state']).toBe('unchecked')
    })

    it('should set data-disabled when disabled', async () => {
      const { props, wait } = mountSelectAll({ props: { disabled: true } })
      await wait()
      expect(props().attrs['data-disabled']).toBe(true)
    })
  })
})
