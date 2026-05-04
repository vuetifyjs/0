import { describe, expect, it } from 'vitest'

import { Slider } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

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

    it('should not emit start when disabled', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()

      const thumb = wrapper.find('[role="slider"]')
      thumb.element.dispatchEvent(new PointerEvent('pointerdown', { button: 0, bubbles: true }))
      await wait()

      expect(wrapper.emitted().start).toBeUndefined()
    })

    it('should not emit start on non-primary button', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      const thumb = wrapper.find('[role="slider"]')
      thumb.element.dispatchEvent(new PointerEvent('pointerdown', { button: 2, bubbles: true }))
      await wait()

      expect(wrapper.emitted().start).toBeUndefined()
    })
  })

  describe('track click-to-position', () => {
    it('should move nearest thumb on track pointerdown', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      const track = wrapper.findComponent(Slider.Track as any)
      const trackEl = track.element as HTMLElement

      // Mock getBoundingClientRect for the track
      trackEl.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        width: 200,
        height: 20,
        top: 0,
        right: 200,
        bottom: 20,
        left: 0,
        toJSON () {},
      })

      trackEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 40,
        clientY: 10,
        bubbles: true,
      }))
      await wait()

      // 40/200 = 20% -> value should be 20 (snapped to step)
      expect(model.value[0]).toBe(20)
    })

    it('should select nearest thumb in range mode', async () => {
      const model = ref([20, 80])
      const { wrapper, wait } = mountSlider({ model, thumbCount: 2 })
      await wait()

      const track = wrapper.findComponent(Slider.Track as any)
      const trackEl = track.element as HTMLElement

      trackEl.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        top: 0,
        right: 100,
        bottom: 20,
        left: 0,
        toJSON () {},
      })

      // Click at 75% — closer to thumb at 80
      trackEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 75,
        clientY: 10,
        bubbles: true,
      }))
      await wait()

      expect(model.value[0]).toBe(20) // first thumb unchanged
      expect(model.value[1]).toBe(75) // second thumb moved
    })

    it('should not respond to track click when disabled', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()

      const track = wrapper.findComponent(Slider.Track as any)
      const trackEl = track.element as HTMLElement

      trackEl.getBoundingClientRect = () => ({
        x: 0, y: 0, width: 100, height: 20,
        top: 0, right: 100, bottom: 20, left: 0,
        toJSON () {},
      })

      trackEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 20,
        clientY: 10,
        bubbles: true,
      }))
      await wait()

      expect(model.value).toEqual([50])
    })

    it('should ignore non-primary button on track', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      const track = wrapper.findComponent(Slider.Track as any)
      const trackEl = track.element as HTMLElement

      trackEl.getBoundingClientRect = () => ({
        x: 0, y: 0, width: 100, height: 20,
        top: 0, right: 100, bottom: 20, left: 0,
        toJSON () {},
      })

      trackEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 2,
        clientX: 20,
        clientY: 10,
        bubbles: true,
      }))
      await wait()

      expect(model.value).toEqual([50])
    })

    it('should handle vertical track click', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      await wait()

      const track = wrapper.findComponent(Slider.Track as any)
      const trackEl = track.element as HTMLElement

      trackEl.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        width: 20,
        height: 200,
        top: 0,
        right: 20,
        bottom: 200,
        left: 0,
        toJSON () {},
      })

      // Click at clientY=40 in a 200px tall track: bottom-relative = (200-40)/200 = 80%
      trackEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 10,
        clientY: 40,
        bubbles: true,
      }))
      await wait()

      expect(model.value[0]).toBe(80)
    })
  })

  describe('drag interaction', () => {
    it('should update value on pointermove during drag', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      const track = wrapper.findComponent(Slider.Track as any)
      const trackEl = track.element as HTMLElement

      trackEl.getBoundingClientRect = () => ({
        x: 0, y: 0, width: 100, height: 20,
        top: 0, right: 100, bottom: 20, left: 0,
        toJSON () {},
      })

      // Start drag via thumb pointerdown
      const thumb = wrapper.find('[role="slider"]')
      thumb.element.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 50,
        clientY: 10,
        bubbles: true,
      }))
      await wait()

      // Move pointer
      document.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 70,
        clientY: 10,
        bubbles: true,
      }))
      await wait()

      // End drag
      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      await wait()

      expect(wrapper.emitted().end).toBeDefined()
    })
  })

  describe('shift+arrow keyboard shortcut', () => {
    it('should increment by 10x step on Shift+ArrowRight', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()

      await wrapper.find('[role="slider"]').trigger('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
      })
      await wait()
      expect(model.value).toEqual([60])
    })

    it('should decrement by 10x step on Shift+ArrowLeft', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()

      await wrapper.find('[role="slider"]').trigger('keydown', {
        key: 'ArrowLeft',
        shiftKey: true,
      })
      await wait()
      expect(model.value).toEqual([40])
    })

    it('should increment by 10x step on Shift+ArrowUp', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()

      await wrapper.find('[role="slider"]').trigger('keydown', {
        key: 'ArrowUp',
        shiftKey: true,
      })
      await wait()
      expect(model.value).toEqual([60])
    })

    it('should decrement by 10x step on Shift+ArrowDown', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model, props: { step: 1 } })
      await wait()

      await wrapper.find('[role="slider"]').trigger('keydown', {
        key: 'ArrowDown',
        shiftKey: true,
      })
      await wait()
      expect(model.value).toEqual([40])
    })

    it('should invert Shift+Arrow direction when inverted', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 1, inverted: true },
      })
      await wait()

      await wrapper.find('[role="slider"]').trigger('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
      })
      await wait()
      // Inverted: ArrowRight = down, so 50 - 10 = 40
      expect(model.value).toEqual([40])
    })

    it('should invert Shift+ArrowLeft direction when inverted', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 1, inverted: true },
      })
      await wait()

      await wrapper.find('[role="slider"]').trigger('keydown', {
        key: 'ArrowLeft',
        shiftKey: true,
      })
      await wait()
      // Inverted: ArrowLeft = up, so 50 + 10 = 60
      expect(model.value).toEqual([60])
    })
  })

  describe('thumb ARIA for multi-thumb', () => {
    it('should constrain aria-valuemin/max per thumb', async () => {
      const model = ref([25, 75])
      const { thumbProps, wait } = mountSlider({ model, thumbCount: 2 })
      await wait()

      // First thumb: min=0, max constrained by second thumb value (75)
      expect(thumbProps(0).attrs['aria-valuemin']).toBe(0)
      expect(thumbProps(0).attrs['aria-valuemax']).toBe(75)

      // Second thumb: min constrained by first thumb value (25), max=100
      expect(thumbProps(1).attrs['aria-valuemin']).toBe(25)
      expect(thumbProps(1).attrs['aria-valuemax']).toBe(100)
    })

    it('should not constrain when crossover is enabled', async () => {
      const model = ref([25, 75])
      const { thumbProps, wait } = mountSlider({
        model,
        thumbCount: 2,
        props: { crossover: true },
      })
      await wait()

      expect(thumbProps(0).attrs['aria-valuemin']).toBe(0)
      expect(thumbProps(0).attrs['aria-valuemax']).toBe(100)
      expect(thumbProps(1).attrs['aria-valuemin']).toBe(0)
      expect(thumbProps(1).attrs['aria-valuemax']).toBe(100)
    })
  })

  describe('thumb unmount', () => {
    it('should unregister thumb on unmount', async () => {
      const show = ref(true)
      const model = ref([25, 75])

      const wrapper = mount(Slider.Root, {
        props: {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: unknown) => {
            model.value = v as number[]
          },
        },
        slots: {
          default: () => {
            const children = [
              h(Slider.Track as any, {}, () =>
                h(Slider.Range as any),
              ),
              h(Slider.Thumb as any),
            ]
            if (show.value) {
              children.push(h(Slider.Thumb as any))
            }
            return children
          },
        },
      })
      await nextTick()

      expect(wrapper.findAll('[role="slider"]')).toHaveLength(2)

      show.value = false
      await nextTick()
      await nextTick()

      expect(wrapper.findAll('[role="slider"]')).toHaveLength(1)
    })
  })

  describe('unhandled key', () => {
    it('should not prevent default on unhandled keys', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      })
      wrapper.find('[role="slider"]').element.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe('aria-valuetext', () => {
    it('should set aria-valuetext when provided', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        thumbProps: [{ ariaValuetext: '50%' }],
      })
      await wait()
      expect(thumbProps().attrs['aria-valuetext']).toBe('50%')
    })

    it('should not set aria-valuetext when not provided', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({ model })
      await wait()
      expect(thumbProps().attrs['aria-valuetext']).toBeUndefined()
    })
  })
})
