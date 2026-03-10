import { describe, expect, it } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

import { Slider } from './index'

interface MountResult {
  wrapper: ReturnType<typeof mount>
  thumbProps: (index?: number) => any
  rootProps: () => any
  rangeProps: () => any
  wait: () => Promise<void>
}

function mountSlider (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<number[]>>
  thumbCount?: number
  thumbProps?: Record<string, unknown>[]
} = {}): MountResult {
  const thumbCount = options.thumbCount ?? 1
  let capturedRootProps: any
  let capturedRangeProps: any
  const capturedThumbProps: any[] = []

  const wrapper = mount(Slider.Root, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as number[]
        },
      }),
      ...options.props,
    },
    slots: {
      default: (rootProps: any) => {
        capturedRootProps = rootProps
        const children = [
          h(Slider.Track as any, {}, () =>
            h(Slider.Range as any, {}, (rangeProps: any) => {
              capturedRangeProps = rangeProps
              return h('span', 'range')
            }),
          ),
        ]
        for (let index = 0; index < thumbCount; index++) {
          const extra = options.thumbProps?.[index] ?? {}
          children.push(
            h(Slider.Thumb as any, extra, (props: any) => {
              capturedThumbProps[index] = props
              return h('span', `thumb-${index}`)
            }),
          )
        }
        return children
      },
    },
  })

  return {
    wrapper,
    thumbProps: (index = 0) => capturedThumbProps[index],
    rootProps: () => capturedRootProps,
    rangeProps: () => capturedRangeProps,
    wait: () => nextTick(),
  }
}

describe('slider', () => {
  describe('rendering', () => {
    it('should render root with horizontal orientation by default', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({ model })
      await wait()
      expect(rootProps().attrs['data-orientation']).toBe('horizontal')
    })

    it('should render root with vertical orientation', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(rootProps().attrs['data-orientation']).toBe('vertical')
    })

    it('should render disabled data attribute', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(rootProps().attrs['data-disabled']).toBe(true)
    })

    it('should not render data-disabled when enabled', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({ model })
      await wait()
      expect(rootProps().attrs['data-disabled']).toBeUndefined()
    })
  })

  describe('v-model', () => {
    it('should sync single value', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().value).toBe(50)
      expect(model.value).toEqual([50])
    })

    it('should sync range values', async () => {
      const model = ref([25, 75])
      const { thumbProps, wait } = mountSlider({ model, thumbCount: 2 })
      await wait()
      expect(thumbProps(0).value).toBe(25)
      expect(thumbProps(1).value).toBe(75)
    })

    it('should update model on keyboard interaction', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()

      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([51])
    })

    it('should reflect external model changes', async () => {
      const model = ref([50])
      const { wrapper, thumbProps, wait } = mountSlider({ model })
      await wait()

      await wrapper.setProps({ modelValue: [75] })
      await wait()
      expect(thumbProps().value).toBe(75)
    })
  })

  describe('thumb ARIA', () => {
    it('should set role="slider"', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().attrs.role).toBe('slider')
    })

    it('should set aria-valuenow to current value', async () => {
      const model = ref([42])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().attrs['aria-valuenow']).toBe(42)
    })

    it('should set aria-valuemin and aria-valuemax', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { min: 10, max: 200 },
      })
      await wait()
      expect(thumbProps().attrs['aria-valuemin']).toBe(10)
      expect(thumbProps().attrs['aria-valuemax']).toBe(200)
    })

    it('should set tabindex to 0 when enabled', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().attrs.tabindex).toBe(0)
    })

    it('should set tabindex to -1 when disabled', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(thumbProps().attrs.tabindex).toBe(-1)
    })

    it('should set aria-orientation', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(thumbProps().attrs['aria-orientation']).toBe('vertical')
    })

    it('should set aria-disabled when disabled', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(thumbProps().attrs['aria-disabled']).toBe(true)
    })

    it('should set aria-label from prop', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        thumbProps: [{ ariaLabel: 'Volume' }],
      })
      await wait()
      expect(thumbProps().attrs['aria-label']).toBe('Volume')
    })

    it('should set data-state to idle by default', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().attrs['data-state']).toBe('idle')
    })

    it('should set data-disabled on thumb when disabled', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(thumbProps().attrs['data-disabled']).toBe(true)
    })

    it('should set positioning style', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().attrs.style.left).toBe('50%')
    })

    it('should use bottom for vertical orientation', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(thumbProps().attrs.style.bottom).toBe('50%')
    })
  })

  describe('keyboard navigation', () => {
    it('should increment on ArrowRight', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 5 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([55])
    })

    it('should decrement on ArrowLeft', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 5 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' })
      await wait()
      expect(model.value).toEqual([45])
    })

    it('should increment on ArrowUp', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowUp' })
      await wait()
      expect(model.value).toEqual([51])
    })

    it('should decrement on ArrowDown', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowDown' })
      await wait()
      expect(model.value).toEqual([49])
    })

    it('should go to min on Home', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'Home' })
      await wait()
      expect(model.value).toEqual([0])
    })

    it('should go to max on End', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'End' })
      await wait()
      expect(model.value).toEqual([100])
    })

    it('should jump 10x step on PageUp', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'PageUp' })
      await wait()
      expect(model.value).toEqual([60])
    })

    it('should jump 10x step on PageDown', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'PageDown' })
      await wait()
      expect(model.value).toEqual([40])
    })

    it('should not exceed max', async () => {
      const model = ref([95])
      const { wrapper, wait } = mountSlider({ model, props: { step: 10 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([100])
    })

    it('should not go below min', async () => {
      const model = ref([5])
      const { wrapper, wait } = mountSlider({ model, props: { step: 10 } })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' })
      await wait()
      expect(model.value).toEqual([0])
    })

    it('should not respond when disabled', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([50])
    })

    it('should prevent default on handled keys', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      })
      wrapper.find('[role="slider"]').element.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('inverted mode', () => {
    it('should invert ArrowRight to decrement', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 5, inverted: true },
      })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([45])
    })

    it('should invert ArrowLeft to increment', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 5, inverted: true },
      })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' })
      await wait()
      expect(model.value).toEqual([55])
    })

    it('should not invert ArrowUp/ArrowDown', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 1, inverted: true },
      })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowUp' })
      await wait()
      expect(model.value).toEqual([51])
    })

    it('should invert percent positioning', async () => {
      const model = ref([25])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { inverted: true },
      })
      await wait()
      expect(thumbProps().percent).toBe(75)
    })
  })

  describe('range mode', () => {
    it('should render two thumbs', async () => {
      const model = ref([25, 75])
      const { wrapper, wait } = mountSlider({ model, thumbCount: 2 })
      await wait()
      expect(wrapper.findAll('[role="slider"]')).toHaveLength(2)
    })

    it('should move thumbs independently', async () => {
      const model = ref([25, 75])
      const { wrapper, wait } = mountSlider({
        model,
        thumbCount: 2,
        props: { step: 5 },
      })
      await wait()

      const thumbs = wrapper.findAll('[role="slider"]')
      await thumbs[0]!.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([30, 75])
    })

    it('should enforce minStepsBetweenThumbs', async () => {
      const model = ref([45, 55])
      const { wrapper, wait } = mountSlider({
        model,
        thumbCount: 2,
        props: { step: 5, minStepsBetweenThumbs: 2 },
      })
      await wait()

      // Try to push first thumb past the constraint
      const thumbs = wrapper.findAll('[role="slider"]')
      await thumbs[0]!.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      // minStepsBetweenThumbs=2 * step=5 = 10 gap, 55-10=45, so thumb stays at 45
      expect(model.value[0]).toBeLessThanOrEqual(model.value[1]! - 10)
    })

    it('should expose range start and end', async () => {
      const model = ref([25, 75])
      const { rangeProps, wait } = mountSlider({ model, thumbCount: 2 })
      await wait()
      expect(rangeProps().start).toBe(25)
      expect(rangeProps().end).toBe(75)
    })

    it('should set range start to 0 for single thumb', async () => {
      const model = ref([50])
      const { rangeProps, wait } = mountSlider({ model })
      await wait()
      expect(rangeProps().start).toBe(0)
      expect(rangeProps().end).toBe(50)
    })
  })

  describe('vertical orientation', () => {
    it('should set data-orientation on root', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(rootProps().attrs['data-orientation']).toBe('vertical')
    })

    it('should set data-orientation on track and range', async () => {
      const model = ref([50])
      const { rangeProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(rangeProps().attrs['data-orientation']).toBe('vertical')
    })

    it('should use bottom positioning for thumb', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(thumbProps().attrs.style.bottom).toBe('50%')
      expect(thumbProps().attrs.style.left).toBeUndefined()
    })

    it('should use height for range style in vertical', async () => {
      const model = ref([50])
      const { rangeProps, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()
      expect(rangeProps().attrs.style.height).toBeDefined()
      expect(rangeProps().attrs.style.bottom).toBeDefined()
    })
  })

  describe('slot props', () => {
    it('should expose root slot props', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()

      expect(rootProps().values).toEqual([50])
      expect(rootProps().min).toBe(0)
      expect(rootProps().max).toBe(100)
      expect(rootProps().isDisabled).toBe(false)
      expect(rootProps().orientation).toBe('horizontal')
    })

    it('should expose thumb slot props', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()

      expect(thumbProps().index).toBe(0)
      expect(thumbProps().value).toBe(50)
      expect(thumbProps().percent).toBe(50)
      expect(thumbProps().isDragging).toBe(false)
      expect(thumbProps().attrs).toBeDefined()
    })

    it('should expose range slot props', async () => {
      const model = ref([50])
      const { rangeProps, wait } = mountSlider({ model })
      await wait()

      expect(typeof rangeProps().start).toBe('number')
      expect(typeof rangeProps().end).toBe('number')
      expect(rangeProps().attrs).toBeDefined()
    })
  })

  describe('hidden input', () => {
    it('should render hidden inputs when name is provided', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { name: 'volume' },
      })
      await wait()

      const inputs = wrapper.findAll('input[type="hidden"]')
      expect(inputs).toHaveLength(1)
      expect(inputs[0]!.attributes('name')).toBe('volume')
    })

    it('should render one hidden input per thumb', async () => {
      const model = ref([25, 75])
      const { wrapper, wait } = mountSlider({
        model,
        thumbCount: 2,
        props: { name: 'range' },
      })
      await wait()

      const inputs = wrapper.findAll('input[type="hidden"]')
      expect(inputs).toHaveLength(2)
    })

    it('should set value on hidden input', async () => {
      const model = ref([42])
      const { wrapper, wait } = mountSlider({
        model,
        props: { name: 'slider' },
      })
      await wait()

      const input = wrapper.find('input[type="hidden"]')
      expect(input.attributes('value')).toBe('42')
    })

    it('should not render hidden inputs without name', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      expect(wrapper.findAll('input[type="hidden"]')).toHaveLength(0)
    })

    it('should set disabled on hidden input when slider is disabled', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { name: 'slider', disabled: true },
      })
      await wait()

      expect(wrapper.find('input[type="hidden"]').attributes('disabled')).toBeDefined()
    })
  })

  describe('readonly', () => {
    it('should render data-readonly on root', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(rootProps().attrs['data-readonly']).toBe(true)
      expect(rootProps().isReadonly).toBe(true)
    })

    it('should not render data-readonly when writable', async () => {
      const model = ref([50])
      const { rootProps, wait } = mountSlider({ model })
      await wait()
      expect(rootProps().attrs['data-readonly']).toBeUndefined()
    })

    it('should set aria-readonly on thumb', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(thumbProps().attrs['aria-readonly']).toBe(true)
    })

    it('should keep tabindex 0 when readonly', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(thumbProps().attrs.tabindex).toBe(0)
    })

    it('should not respond to keyboard when readonly', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([50])
    })

    it('should block track clicks when readonly', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()

      // Track pointerdown should be blocked
      const track = wrapper.find('[data-orientation="horizontal"]')
      track.element.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }))
      await wait()
      expect(model.value).toEqual([50])
    })

    it('should render data-readonly on thumb', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(thumbProps().attrs['data-readonly']).toBe(true)
    })
  })

  describe('start/end events', () => {
    it('should emit start and end events', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      // Dispatch a real PointerEvent on the thumb element
      const thumb = wrapper.find('[role="slider"]')
      thumb.element.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }))
      await wait()

      const emitted = wrapper.emitted()
      expect(emitted.start).toBeDefined()
      expect(emitted.start![0]).toEqual([[50]])

      // Simulate pointerup on document
      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      await wait()

      expect(emitted.end).toBeDefined()
      expect(emitted.end![0]).toEqual([[50]])
    })

    it('should not emit start when readonly', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { readonly: true },
      })
      await wait()

      const thumb = wrapper.find('[role="slider"]')
      thumb.element.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }))
      await wait()

      expect(wrapper.emitted().start).toBeUndefined()
    })
  })
})
