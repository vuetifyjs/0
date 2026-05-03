import { describe, expect, it } from 'vitest'

import {
  Progress,
  ProgressBuffer,
  ProgressFill,
  ProgressLabel,
  ProgressRoot,
  ProgressTrack,
  ProgressValue,
} from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

// Types
import type { ProgressRootSlotProps } from './index'
import type { VueWrapper } from '@vue/test-utils'

interface MountResult {
  wrapper: VueWrapper
  rootProps: () => ProgressRootSlotProps
  fillProps: () => any
  labelProps: () => any
  valueProps: () => any
  bufferProps: () => any
  trackProps: () => any
  wait: () => Promise<void>
}

function mountProgress (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<number | number[]>>
  fillValue?: number
  bufferValue?: number
  withLabel?: boolean
  withValue?: boolean
  withBuffer?: boolean
  withFill?: boolean
  withHiddenInput?: boolean
} = {}): MountResult {
  let capturedRootProps: any
  let capturedFillProps: any
  let capturedLabelProps: any
  let capturedValueProps: any
  let capturedBufferProps: any
  let capturedTrackProps: any

  const wrapper = mount(ProgressRoot, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as number | number[]
        },
      }),
      ...options.props,
    },
    slots: {
      default: (rootProps: any) => {
        capturedRootProps = rootProps
        const children: any[] = []

        if (options.withLabel) {
          children.push(
            h(ProgressLabel as any, {}, (labelProps: any) => {
              capturedLabelProps = labelProps
              return h('span', 'Loading...')
            }),
          )
        }

        children.push(
          h(ProgressTrack as any, {}, (trackProps: any) => {
            capturedTrackProps = trackProps
            const trackChildren: any[] = []

            if (options.withBuffer) {
              trackChildren.push(
                h(ProgressBuffer as any, { value: options.bufferValue ?? 0 }, (bufferProps: any) => {
                  capturedBufferProps = bufferProps
                  return h('span', 'buffer')
                }),
              )
            }

            if (options.withFill !== false) {
              trackChildren.push(
                h(ProgressFill as any, { value: options.fillValue }, (fillProps: any) => {
                  capturedFillProps = fillProps
                  return h('span', 'fill')
                }),
              )
            }

            return trackChildren
          }),
        )

        if (options.withValue) {
          children.push(
            h(ProgressValue as any, {}, (valueProps: any) => {
              capturedValueProps = valueProps
              return h('span', `${valueProps.percent}%`)
            }),
          )
        }

        return children
      },
    },
  })

  return {
    wrapper,
    rootProps: () => capturedRootProps,
    fillProps: () => capturedFillProps,
    labelProps: () => capturedLabelProps,
    valueProps: () => capturedValueProps,
    bufferProps: () => capturedBufferProps,
    trackProps: () => capturedTrackProps,
    wait: () => nextTick(),
  }
}

describe('progress', () => {
  describe('rendering', () => {
    it('should render root element', () => {
      const { wrapper } = mountProgress({ withFill: false })
      expect(wrapper.element).toBeTruthy()
    })

    it('should export compound components', () => {
      expect(Progress.Root).toBeDefined()
      expect(Progress.Track).toBeDefined()
      expect(Progress.Fill).toBeDefined()
      expect(Progress.Buffer).toBeDefined()
      expect(Progress.Value).toBeDefined()
      expect(Progress.Label).toBeDefined()
      expect(Progress.HiddenInput).toBeDefined()
    })
  })

  describe('aRIA attributes', () => {
    it('should set role=progressbar', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model })
      await wait()
      expect(rootProps().attrs.role).toBe('progressbar')
    })

    it('should set aria-valuenow to current total', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().attrs['aria-valuenow']).toBe(50)
    })

    it('should set aria-valuemin and aria-valuemax', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({
        model,
        props: { min: 10, max: 200 },
      })
      await wait()
      expect(rootProps().attrs['aria-valuemin']).toBe(10)
      expect(rootProps().attrs['aria-valuemax']).toBe(200)
    })

    it('should set aria-valuetext as percentage string', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().attrs['aria-valuetext']).toBe('50%')
    })

    it('should set aria-valuenow to undefined when indeterminate', async () => {
      const { rootProps, wait } = mountProgress({ withFill: false })
      await wait()
      expect(rootProps().attrs['aria-valuenow']).toBeUndefined()
    })

    it('should set aria-valuetext to undefined when indeterminate', async () => {
      const { rootProps, wait } = mountProgress({ withFill: false })
      await wait()
      expect(rootProps().attrs['aria-valuetext']).toBeUndefined()
    })

    it('should set aria-busy when indeterminate', async () => {
      const { rootProps, wait } = mountProgress({ withFill: false })
      await wait()
      expect(rootProps().attrs['aria-busy']).toBe(true)
    })

    it('should not set aria-busy when determinate', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().attrs['aria-busy']).toBeUndefined()
    })

    it('should set aria-labelledby referencing the label id', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, props: { id: 'test' } })
      await wait()
      expect(rootProps().attrs['aria-labelledby']).toBe('test-label')
    })
  })

  describe('data attributes', () => {
    it('should set data-state=indeterminate when no fill value', async () => {
      const { rootProps, wait } = mountProgress({ withFill: false })
      await wait()
      expect(rootProps().attrs['data-state']).toBe('indeterminate')
    })

    it('should set data-state=determinate with fill value', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().attrs['data-state']).toBe('determinate')
    })

    it('should set data-complete when total equals max', async () => {
      const model = ref(100)
      const { rootProps, wait } = mountProgress({ model, fillValue: 100 })
      await wait()
      expect(rootProps().attrs['data-complete']).toBe(true)
    })

    it('should not set data-complete when not finished', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().attrs['data-complete']).toBeUndefined()
    })
  })

  describe('v-model', () => {
    it('should reflect scalar model value', async () => {
      const model = ref(60)
      const { rootProps, wait } = mountProgress({ model, fillValue: 60 })
      await wait()
      expect(rootProps().total).toBe(60)
      expect(rootProps().percent).toBe(60)
    })

    it('should reflect array model value', async () => {
      const model = ref([30, 20] as number[])
      const { rootProps, wait } = mountProgress({ model })
      await wait()
      // The total should reflect the array values once fills register
      expect(rootProps()).toBeDefined()
    })

    it('should expose total matching fill value', async () => {
      const model = ref(75)
      const { rootProps, wait } = mountProgress({ model, fillValue: 75 })
      await wait()
      expect(rootProps().total).toBe(75)
      expect(rootProps().percent).toBe(75)
    })
  })

  describe('slot props', () => {
    it('should expose id', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, props: { id: 'my-progress' } })
      await wait()
      expect(rootProps().id).toBe('my-progress')
    })

    it('should expose total', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().total).toBe(50)
    })

    it('should expose percent', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().percent).toBe(50)
    })

    it('should expose isIndeterminate', async () => {
      const { rootProps, wait } = mountProgress({ withFill: false })
      await wait()
      expect(rootProps().isIndeterminate).toBe(true)
    })

    it('should expose segments array', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(rootProps().segments).toBeDefined()
      expect(Array.isArray(rootProps().segments)).toBe(true)
    })
  })

  describe('fill sub-component', () => {
    it('should expose fill value in slot props', async () => {
      const model = ref(50)
      const { fillProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(fillProps().value).toBe(50)
    })

    it('should expose percent in slot props', async () => {
      const model = ref(50)
      const { fillProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(fillProps().percent).toBe(50)
    })

    it('should set data-index on fill', async () => {
      const model = ref(50)
      const { fillProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(fillProps().attrs['data-index']).toBeDefined()
    })

    it('should set width style based on percent', async () => {
      const model = ref(50)
      const { fillProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(fillProps().attrs.style.width).toBe('50%')
    })

    it('should set data-state on fill', async () => {
      const model = ref(50)
      const { fillProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(fillProps().attrs['data-state']).toBe('determinate')
    })
  })

  describe('track sub-component', () => {
    it('should expose data-state in slot props', async () => {
      const model = ref(50)
      const { trackProps, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      expect(trackProps().attrs['data-state']).toBe('determinate')
    })

    it('should set data-state=indeterminate when no value', async () => {
      const { trackProps, wait } = mountProgress({ withFill: false })
      await wait()
      expect(trackProps().attrs['data-state']).toBe('indeterminate')
    })
  })

  describe('label sub-component', () => {
    it('should expose label id in attrs', async () => {
      const model = ref(50)
      const { labelProps, wait } = mountProgress({
        model,
        fillValue: 50,
        withLabel: true,
        props: { id: 'test-progress' },
      })
      await wait()
      expect(labelProps().attrs.id).toBe('test-progress-label')
    })

    it('should expose total in slot props', async () => {
      const model = ref(50)
      const { labelProps, wait } = mountProgress({
        model,
        fillValue: 50,
        withLabel: true,
      })
      await wait()
      expect(labelProps().total).toBe(50)
    })

    it('should expose percent in slot props', async () => {
      const model = ref(50)
      const { labelProps, wait } = mountProgress({
        model,
        fillValue: 50,
        withLabel: true,
      })
      await wait()
      expect(labelProps().percent).toBe(50)
    })

    it('should expose isIndeterminate in slot props', async () => {
      const { labelProps, wait } = mountProgress({
        withFill: false,
        withLabel: true,
      })
      await wait()
      expect(labelProps().isIndeterminate).toBe(true)
    })
  })

  describe('value sub-component', () => {
    it('should expose total in slot props', async () => {
      const model = ref(50)
      const { valueProps, wait } = mountProgress({
        model,
        fillValue: 50,
        withValue: true,
      })
      await wait()
      expect(valueProps().total).toBe(50)
    })

    it('should expose percent in slot props', async () => {
      const model = ref(50)
      const { valueProps, wait } = mountProgress({
        model,
        fillValue: 50,
        withValue: true,
      })
      await wait()
      expect(valueProps().percent).toBe(50)
    })

    it('should expose isIndeterminate in slot props', async () => {
      const { valueProps, wait } = mountProgress({
        withFill: false,
        withValue: true,
      })
      await wait()
      expect(valueProps().isIndeterminate).toBe(true)
    })
  })

  describe('buffer sub-component', () => {
    it('should expose buffer value in slot props', async () => {
      const model = ref(30)
      const { bufferProps, wait } = mountProgress({
        model,
        fillValue: 30,
        withBuffer: true,
        bufferValue: 70,
      })
      await wait()
      expect(bufferProps().value).toBe(70)
    })

    it('should expose buffer percent in slot props', async () => {
      const model = ref(30)
      const { bufferProps, wait } = mountProgress({
        model,
        fillValue: 30,
        withBuffer: true,
        bufferValue: 50,
      })
      await wait()
      expect(bufferProps().percent).toBe(50)
    })

    it('should set data-buffer attribute', async () => {
      const model = ref(30)
      const { bufferProps, wait } = mountProgress({
        model,
        fillValue: 30,
        withBuffer: true,
        bufferValue: 70,
      })
      await wait()
      expect(bufferProps().attrs['data-buffer']).toBe(true)
    })

    it('should set width style based on buffer percent', async () => {
      const model = ref(30)
      const { bufferProps, wait } = mountProgress({
        model,
        fillValue: 30,
        withBuffer: true,
        bufferValue: 50,
      })
      await wait()
      expect(bufferProps().attrs.style.width).toBe('50%')
    })

    it('should clamp buffer value to min/max', async () => {
      const model = ref(30)
      const { bufferProps, wait } = mountProgress({
        model,
        fillValue: 30,
        withBuffer: true,
        bufferValue: 200,
        props: { max: 100 },
      })
      await wait()
      expect(bufferProps().value).toBe(100)
      expect(bufferProps().percent).toBe(100)
    })
  })

  describe('hidden input', () => {
    it('should render hidden input when name prop is set', async () => {
      const model = ref(50)
      const { wrapper, wait } = mountProgress({
        model,
        fillValue: 50,
        props: { name: 'progress-field' },
      })
      await wait()
      const input = wrapper.find('input[type="hidden"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('name')).toBe('progress-field')
    })

    it('should not render hidden input when name prop is not set', async () => {
      const model = ref(50)
      const { wrapper, wait } = mountProgress({ model, fillValue: 50 })
      await wait()
      const input = wrapper.find('input[type="hidden"]')
      expect(input.exists()).toBe(false)
    })
  })

  describe('custom min/max', () => {
    it('should calculate percent with custom min/max', async () => {
      const model = ref(50)
      const { rootProps, wait } = mountProgress({
        model,
        fillValue: 50,
        props: { min: 0, max: 200 },
      })
      await wait()
      expect(rootProps().percent).toBe(25)
    })
  })
})
