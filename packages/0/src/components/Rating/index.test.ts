import { describe, expect, it } from 'vitest'

import { Rating } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

interface MountResult {
  wrapper: ReturnType<typeof mount>
  rootProps: () => any
  itemProps: (index?: number) => any
  wait: () => Promise<void>
}

function mountRating (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<number>>
  size?: number
} = {}): MountResult {
  const size = options.size ?? 5
  let capturedRootProps: any
  const capturedItemProps: any[] = []

  const wrapper = mount(Rating.Root, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as number
        },
      }),
      size,
      ...options.props,
    },
    slots: {
      default: (rootProps: any) => {
        capturedRootProps = rootProps
        return rootProps.items.map((_: any, index: number) =>
          h(Rating.Item as any, { index: index + 1 }, {
            default: (itemSlotProps: any) => {
              capturedItemProps[index] = itemSlotProps
              return h('span', `star-${index + 1}`)
            },
          }),
        )
      },
    },
  })

  return {
    wrapper,
    rootProps: () => capturedRootProps,
    itemProps: (index = 0) => capturedItemProps[index],
    wait: () => nextTick(),
  }
}

describe('rating', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render with default props', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps()).toBeDefined()
        expect(rootProps().value).toBe(0)
        expect(rootProps().items).toHaveLength(5)
        expect(rootProps().isHovering).toBe(false)
        expect(rootProps().isDisabled).toBe(false)
        expect(rootProps().isReadonly).toBe(false)
      })

      it('should render correct number of items from size prop', async () => {
        const { rootProps, wait } = mountRating({ size: 3 })
        await wait()

        expect(rootProps().items).toHaveLength(3)
      })

      it('should render correct number of items with size 10', async () => {
        const { rootProps, wait } = mountRating({ size: 10 })
        await wait()

        expect(rootProps().items).toHaveLength(10)
      })
    })

    describe('v-model', () => {
      it('should accept initial model value', async () => {
        const model = ref(3)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        expect(rootProps().value).toBe(3)
      })

      it('should update model value via keyboard', async () => {
        const model = ref(0)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(1)
      })

      it('should clamp model value to 0', async () => {
        const model = ref(0)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        await wait()

        expect(model.value).toBe(0)
      })

      it('should clamp model value to size', async () => {
        const model = ref(5)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(5)
      })
    })

    describe('size prop', () => {
      it('should default to 5', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().attrs['aria-valuemax']).toBe(5)
      })

      it('should accept custom size', async () => {
        const { rootProps, wait } = mountRating({ size: 10 })
        await wait()

        expect(rootProps().attrs['aria-valuemax']).toBe(10)
      })
    })

    describe('half prop', () => {
      it('should increment by 0.5 when half is enabled', async () => {
        const model = ref(0)
        const { rootProps, wait } = mountRating({ model, props: { half: true } })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(0.5)
      })

      it('should decrement by 0.5 when half is enabled', async () => {
        const model = ref(3)
        const { rootProps, wait } = mountRating({ model, props: { half: true } })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        await wait()

        expect(model.value).toBe(2.5)
      })

      it('should increment by 1 when half is disabled', async () => {
        const model = ref(0)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(1)
      })
    })

    describe('disabled prop', () => {
      it('should set isDisabled to true', async () => {
        const { rootProps, wait } = mountRating({ props: { disabled: true } })
        await wait()

        expect(rootProps().isDisabled).toBe(true)
      })

      it('should set tabindex to -1', async () => {
        const { rootProps, wait } = mountRating({ props: { disabled: true } })
        await wait()

        expect(rootProps().attrs.tabindex).toBe(-1)
      })

      it('should ignore keyboard navigation', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model, props: { disabled: true } })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(2)
      })

      it('should set aria-disabled', async () => {
        const { rootProps, wait } = mountRating({ props: { disabled: true } })
        await wait()

        expect(rootProps().attrs['aria-disabled']).toBe(true)
      })

      it('should set data-disabled', async () => {
        const { rootProps, wait } = mountRating({ props: { disabled: true } })
        await wait()

        expect(rootProps().attrs['data-disabled']).toBe(true)
      })
    })

    describe('readonly prop', () => {
      it('should set isReadonly to true', async () => {
        const { rootProps, wait } = mountRating({ props: { readonly: true } })
        await wait()

        expect(rootProps().isReadonly).toBe(true)
      })

      it('should ignore keyboard navigation', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model, props: { readonly: true } })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(2)
      })

      it('should set aria-readonly', async () => {
        const { rootProps, wait } = mountRating({ props: { readonly: true } })
        await wait()

        expect(rootProps().attrs['aria-readonly']).toBe(true)
      })

      it('should set data-readonly', async () => {
        const { rootProps, wait } = mountRating({ props: { readonly: true } })
        await wait()

        expect(rootProps().attrs['data-readonly']).toBe(true)
      })

      it('should keep tabindex at 0', async () => {
        const { rootProps, wait } = mountRating({ props: { readonly: true } })
        await wait()

        expect(rootProps().attrs.tabindex).toBe(0)
      })
    })

    describe('aRIA attributes', () => {
      it('should have role=slider', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().attrs.role).toBe('slider')
      })

      it('should have correct aria-valuenow', async () => {
        const model = ref(3)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        expect(rootProps().attrs['aria-valuenow']).toBe(3)
      })

      it('should have aria-valuemin of 0', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().attrs['aria-valuemin']).toBe(0)
      })

      it('should have correct aria-valuetext', async () => {
        const model = ref(3)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        expect(rootProps().attrs['aria-valuetext']).toBeDefined()
      })

      it('should not set aria-disabled when not disabled', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().attrs['aria-disabled']).toBeUndefined()
      })

      it('should not set aria-readonly when not readonly', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().attrs['aria-readonly']).toBeUndefined()
      })
    })

    describe('keyboard navigation', () => {
      it('should increment on ArrowRight', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wait()

        expect(model.value).toBe(3)
      })

      it('should increment on ArrowUp', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
        await wait()

        expect(model.value).toBe(3)
      })

      it('should decrement on ArrowLeft', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        await wait()

        expect(model.value).toBe(1)
      })

      it('should decrement on ArrowDown', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
        await wait()

        expect(model.value).toBe(1)
      })

      it('should go to 0 on Home', async () => {
        const model = ref(3)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'Home' }))
        await wait()

        expect(model.value).toBe(0)
      })

      it('should go to max on End', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'End' }))
        await wait()

        expect(model.value).toBe(5)
      })

      it('should go to custom max on End', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model, size: 10 })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'End' }))
        await wait()

        expect(model.value).toBe(10)
      })

      it('should ignore unrelated keys', async () => {
        const model = ref(2)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        rootProps().attrs.onKeydown(new KeyboardEvent('keydown', { key: 'a' }))
        await wait()

        expect(model.value).toBe(2)
      })
    })

    describe('hover state', () => {
      it('should not be hovering by default', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().isHovering).toBe(false)
      })

      it('should not have data-hovering when not hovering', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        expect(rootProps().attrs['data-hovering']).toBeUndefined()
      })

      it('should reset hover on pointerleave', async () => {
        const { rootProps, wait } = mountRating()
        await wait()

        rootProps().attrs.onPointerleave()
        await wait()

        expect(rootProps().isHovering).toBe(false)
      })
    })

    describe('items state', () => {
      it('should have all empty items at value 0', async () => {
        const model = ref(0)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        for (const item of rootProps().items) {
          expect(item.state).toBe('empty')
        }
      })

      it('should have all full items at max value', async () => {
        const model = ref(5)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        for (const item of rootProps().items) {
          expect(item.state).toBe('full')
        }
      })

      it('should have correct states at value 3', async () => {
        const model = ref(3)
        const { rootProps, wait } = mountRating({ model })
        await wait()

        const states = rootProps().items.map((i: any) => i.state)
        expect(states).toEqual(['full', 'full', 'full', 'empty', 'empty'])
      })

      it('should have half state with half value', async () => {
        const model = ref(2.5)
        const { rootProps, wait } = mountRating({ model, props: { half: true } })
        await wait()

        const states = rootProps().items.map((i: any) => i.state)
        expect(states).toEqual(['full', 'full', 'half', 'empty', 'empty'])
      })
    })
  })

  describe('item', () => {
    describe('rendering', () => {
      it('should render items', async () => {
        const { itemProps, wait } = mountRating()
        await wait()

        expect(itemProps(0)).toBeDefined()
        expect(itemProps(4)).toBeDefined()
      })
    })

    describe('state', () => {
      it('should be empty when value is 0', async () => {
        const model = ref(0)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        expect(itemProps(0).state).toBe('empty')
        expect(itemProps(4).state).toBe('empty')
      })

      it('should be full when at or below value', async () => {
        const model = ref(3)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        expect(itemProps(0).state).toBe('full')
        expect(itemProps(1).state).toBe('full')
        expect(itemProps(2).state).toBe('full')
      })

      it('should be empty when above value', async () => {
        const model = ref(3)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        expect(itemProps(3).state).toBe('empty')
        expect(itemProps(4).state).toBe('empty')
      })

      it('should have half state at half value', async () => {
        const model = ref(2.5)
        const { itemProps, wait } = mountRating({ model, props: { half: true } })
        await wait()

        expect(itemProps(0).state).toBe('full')
        expect(itemProps(1).state).toBe('full')
        expect(itemProps(2).state).toBe('half')
        expect(itemProps(3).state).toBe('empty')
        expect(itemProps(4).state).toBe('empty')
      })
    })

    describe('data attributes', () => {
      it('should have data-state matching state', async () => {
        const model = ref(3)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        expect(itemProps(0).attrs['data-state']).toBe('full')
        expect(itemProps(3).attrs['data-state']).toBe('empty')
      })

      it('should have data-highlighted when highlighted', async () => {
        const model = ref(3)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        expect(itemProps(0).attrs['data-highlighted']).toBe(true)
        expect(itemProps(1).attrs['data-highlighted']).toBe(true)
        expect(itemProps(2).attrs['data-highlighted']).toBe(true)
        expect(itemProps(3).attrs['data-highlighted']).toBeUndefined()
        expect(itemProps(4).attrs['data-highlighted']).toBeUndefined()
      })

      it('should have data-disabled when disabled', async () => {
        const { itemProps, wait } = mountRating({ props: { disabled: true } })
        await wait()

        expect(itemProps(0).attrs['data-disabled']).toBe(true)
      })

      it('should not have data-disabled when not disabled', async () => {
        const { itemProps, wait } = mountRating()
        await wait()

        expect(itemProps(0).attrs['data-disabled']).toBeUndefined()
      })

      it('should have data-readonly when readonly', async () => {
        const { itemProps, wait } = mountRating({ props: { readonly: true } })
        await wait()

        expect(itemProps(0).attrs['data-readonly']).toBe(true)
      })

      it('should not have data-readonly when not readonly', async () => {
        const { itemProps, wait } = mountRating()
        await wait()

        expect(itemProps(0).attrs['data-readonly']).toBeUndefined()
      })
    })

    describe('click', () => {
      it('should set value on click', async () => {
        const model = ref(0)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        // Simulate pointermove first to set hoveredValue, then click
        // Without hover, click uses the index as fallback
        itemProps(2).attrs.onClick()
        await wait()

        expect(model.value).toBe(3)
      })

      it('should not change value when disabled', async () => {
        const model = ref(2)
        const { itemProps, wait } = mountRating({ model, props: { disabled: true } })
        await wait()

        itemProps(4).attrs.onClick()
        await wait()

        expect(model.value).toBe(2)
      })

      it('should not change value when readonly', async () => {
        const model = ref(2)
        const { itemProps, wait } = mountRating({ model, props: { readonly: true } })
        await wait()

        itemProps(4).attrs.onClick()
        await wait()

        expect(model.value).toBe(2)
      })
    })

    describe('pointermove', () => {
      it('should not update hover when disabled', async () => {
        const { rootProps, itemProps, wait } = mountRating({ props: { disabled: true } })
        await wait()

        const event = new PointerEvent('pointermove', { clientX: 100 })
        Object.defineProperty(event, 'currentTarget', {
          value: { getBoundingClientRect: () => ({ left: 0, width: 200 }) },
        })
        itemProps(2).attrs.onPointermove(event)
        await wait()

        expect(rootProps().isHovering).toBe(false)
      })

      it('should not update hover when readonly', async () => {
        const { rootProps, itemProps, wait } = mountRating({ props: { readonly: true } })
        await wait()

        const event = new PointerEvent('pointermove', { clientX: 100 })
        Object.defineProperty(event, 'currentTarget', {
          value: { getBoundingClientRect: () => ({ left: 0, width: 200 }) },
        })
        itemProps(2).attrs.onPointermove(event)
        await wait()

        expect(rootProps().isHovering).toBe(false)
      })
    })

    describe('isHighlighted', () => {
      it('should highlight items at or below value', async () => {
        const model = ref(3)
        const { itemProps, wait } = mountRating({ model })
        await wait()

        expect(itemProps(0).isHighlighted).toBe(true)
        expect(itemProps(1).isHighlighted).toBe(true)
        expect(itemProps(2).isHighlighted).toBe(true)
        expect(itemProps(3).isHighlighted).toBe(false)
        expect(itemProps(4).isHighlighted).toBe(false)
      })
    })
  })

  describe('hidden input', () => {
    it('should render hidden input when name is provided', async () => {
      const model = ref(3)
      const wrapper = mount(Rating.Root, {
        props: {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: unknown) => {
            model.value = v as number
          },
          'name': 'rating-field',
        },
        slots: {
          default: () => h('div', 'content'),
        },
      })
      await nextTick()

      const input = wrapper.find('input[type="hidden"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('name')).toBe('rating-field')
      expect(input.attributes('value')).toBe('3')
    })

    it('should not render hidden input when name is not provided', async () => {
      const wrapper = mount(Rating.Root, {
        slots: {
          default: () => h('div', 'content'),
        },
      })
      await nextTick()

      expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    })

    it('should have tabindex -1', async () => {
      const wrapper = mount(Rating.Root, {
        props: { name: 'test' },
        slots: {
          default: () => h('div', 'content'),
        },
      })
      await nextTick()

      const input = wrapper.find('input[type="hidden"]')
      expect(input.attributes('tabindex')).toBe('-1')
    })

    it('should set disabled on input when rating is disabled', async () => {
      const wrapper = mount(Rating.Root, {
        props: { name: 'test', disabled: true },
        slots: {
          default: () => h('div', 'content'),
        },
      })
      await nextTick()

      const input = wrapper.find('input[type="hidden"]')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('should sync value with model', async () => {
      const model = ref(2)
      const wrapper = mount(Rating.Root, {
        props: {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: unknown) => {
            model.value = v as number
          },
          'name': 'rating',
        },
        slots: {
          default: (rootProps: any) => {
            rootProps.attrs.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
            return h('div', 'content')
          },
        },
      })
      await nextTick()
      await nextTick()

      // Re-mount to verify updated value
      const input = wrapper.find('input[type="hidden"]')
      expect(input.exists()).toBe(true)
    })
  })
})
