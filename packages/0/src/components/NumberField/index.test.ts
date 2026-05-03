import { describe, expect, it } from 'vitest'

import { NumberField } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

// Types
import type { NumberFieldRootSlotProps } from './index'
import type { VueWrapper } from '@vue/test-utils'

interface MountResult {
  wrapper: VueWrapper
  rootProps: () => NumberFieldRootSlotProps
  controlEl: () => ReturnType<VueWrapper['find']>
  incrementEl: () => ReturnType<VueWrapper['find']>
  decrementEl: () => ReturnType<VueWrapper['find']>
  wait: () => Promise<void>
}

function mountNumberField (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<number | null>>
  withIncrement?: boolean
  withDecrement?: boolean
  withDescription?: boolean
  withError?: boolean
} = {}): MountResult {
  let capturedRootProps: any

  let wrapper: VueWrapper

  const props: Record<string, unknown> = {
    ...(options.model && {
      'modelValue': options.model.value,
      'onUpdate:modelValue': (v: unknown) => {
        options.model!.value = v as number | null
        wrapper.setProps({ modelValue: v })
      },
    }),
    ...options.props,
  }

  wrapper = mount(NumberField.Root, {
    props,
    slots: {
      default: (rootProps: any) => {
        capturedRootProps = rootProps
        const children: any[] = []

        if (options.withDecrement !== false) {
          children.push(
            h(NumberField.Decrement as any, {}, () => '-'),
          )
        }

        children.push(h(NumberField.Control as any))

        if (options.withIncrement !== false) {
          children.push(
            h(NumberField.Increment as any, {}, () => '+'),
          )
        }

        if (options.withDescription) {
          children.push(
            h(NumberField.Description as any, {}, () => 'Help text'),
          )
        }

        if (options.withError) {
          children.push(
            h(NumberField.Error as any, {}, {
              default: (p: any) => p.errors.join(', '),
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
    controlEl: () => wrapper.find('[role="spinbutton"]'),
    incrementEl: () => wrapper.find('[aria-label="NumberField.increment"]'),
    decrementEl: () => wrapper.find('[aria-label="NumberField.decrement"]'),
    wait: () => nextTick(),
  }
}

describe('number-field', () => {
  describe('rendering', () => {
    it('should render root element', () => {
      const { wrapper } = mountNumberField()
      expect(wrapper.element).toBeTruthy()
    })

    it('should export compound components', () => {
      expect(NumberField.Root).toBeDefined()
      expect(NumberField.Control).toBeDefined()
      expect(NumberField.Increment).toBeDefined()
      expect(NumberField.Decrement).toBeDefined()
      expect(NumberField.Scrub).toBeDefined()
      expect(NumberField.Description).toBeDefined()
      expect(NumberField.Error).toBeDefined()
    })

    it('should render control with role=spinbutton', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().exists()).toBe(true)
      expect(controlEl().attributes('role')).toBe('spinbutton')
    })

    it('should render control with type=text', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('type')).toBe('text')
    })

    it('should render control with inputmode=decimal', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('inputmode')).toBe('decimal')
    })
  })

  describe('v-model', () => {
    it('should display null model as empty string', async () => {
      const model = ref<number | null>(null)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('value')).toBe('')
    })

    it('should display numeric model value', async () => {
      const model = ref<number | null>(42)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('value')).toBe('42')
    })

    it('should expose value in slot props', async () => {
      const model = ref<number | null>(25)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().value).toBe(25)
    })

    it('should expose null value in slot props', async () => {
      const model = ref<number | null>(null)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().value).toBeNull()
    })
  })

  describe('increment/decrement', () => {
    it('should increment on increment button click', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10, step: 1 },
      })
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(6)
    })

    it('should decrement on decrement button click', async () => {
      const model = ref<number | null>(5)
      const { decrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10, step: 1 },
      })
      await wait()

      await decrementEl().trigger('pointerdown', { button: 0 })
      await decrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(4)
    })

    it('should initialize from null on increment', async () => {
      const model = ref<number | null>(null)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(0)
    })

    it('should initialize from null on decrement', async () => {
      const model = ref<number | null>(null)
      const { decrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()

      await decrementEl().trigger('pointerdown', { button: 0 })
      await decrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(0)
    })

    it('should update display when incrementing while focused', async () => {
      const model = ref<number | null>(5)
      const { rootProps, controlEl, incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10, step: 1 },
      })
      await wait()

      await controlEl().trigger('focus')
      await wait()
      expect(rootProps().isFocused).toBe(true)

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()

      expect(model.value).toBe(6)
      expect(rootProps().value).toBe(6)
      expect(rootProps().display).toBe('6')
    })

    it('should preserve incremented value after blur', async () => {
      const model = ref<number | null>(5)
      const { controlEl, incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10, step: 1 },
      })
      await wait()

      await controlEl().trigger('focus')
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      await wait()

      await controlEl().trigger('blur')
      await wait()

      expect(model.value).toBe(6)
    })

    it('should respect step size', async () => {
      const model = ref<number | null>(10)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100, step: 5 },
      })
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(15)
    })
  })

  describe('min/max boundaries', () => {
    it('should not increment past max', async () => {
      const model = ref<number | null>(10)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10 },
      })
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(10)
    })

    it('should not decrement past min', async () => {
      const model = ref<number | null>(0)
      const { decrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10 },
      })
      await wait()

      await decrementEl().trigger('pointerdown', { button: 0 })
      await decrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(0)
    })

    it('should expose canIncrement as false at max', async () => {
      const model = ref<number | null>(100)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()
      expect(rootProps().canIncrement).toBe(false)
    })

    it('should expose canDecrement as false at min', async () => {
      const model = ref<number | null>(0)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()
      expect(rootProps().canDecrement).toBe(false)
    })

    it('should expose canIncrement as true when below max', async () => {
      const model = ref<number | null>(50)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()
      expect(rootProps().canIncrement).toBe(true)
    })

    it('should expose canDecrement as true when above min', async () => {
      const model = ref<number | null>(50)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()
      expect(rootProps().canDecrement).toBe(true)
    })
  })

  describe('keyboard handling', () => {
    it('should increment on ArrowUp', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10, step: 1 },
      })
      await wait()

      await controlEl().trigger('focus')
      await controlEl().trigger('keydown', { key: 'ArrowUp' })
      await wait()
      expect(model.value).toBe(6)
    })

    it('should decrement on ArrowDown', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10, step: 1 },
      })
      await wait()

      await controlEl().trigger('focus')
      await controlEl().trigger('keydown', { key: 'ArrowDown' })
      await wait()
      expect(model.value).toBe(4)
    })

    it('should go to min on Home', async () => {
      const model = ref<number | null>(50)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()

      await controlEl().trigger('focus')
      await controlEl().trigger('keydown', { key: 'Home' })
      await wait()
      expect(model.value).toBe(0)
    })

    it('should go to max on End', async () => {
      const model = ref<number | null>(50)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()

      await controlEl().trigger('focus')
      await controlEl().trigger('keydown', { key: 'End' })
      await wait()
      expect(model.value).toBe(100)
    })

    it('should increment by 10 on Shift+ArrowUp', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100, step: 1 },
      })
      await wait()

      await controlEl().trigger('focus')
      await controlEl().trigger('keydown', { key: 'ArrowUp', shiftKey: true })
      await wait()
      expect(model.value).toBe(15)
    })

    it('should decrement by 10 on Shift+ArrowDown', async () => {
      const model = ref<number | null>(50)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 100, step: 1 },
      })
      await wait()

      await controlEl().trigger('focus')
      await controlEl().trigger('keydown', { key: 'ArrowDown', shiftKey: true })
      await wait()
      expect(model.value).toBe(40)
    })
  })

  describe('disabled state', () => {
    it('should set data-disabled on root when disabled', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(rootProps().attrs['data-disabled']).toBe(true)
    })

    it('should expose isDisabled in slot props', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(rootProps().isDisabled).toBe(true)
    })

    it('should set disabled attribute on control', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(controlEl().attributes('disabled')).toBeDefined()
    })

    it('should disable increment button when disabled', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { disabled: true, min: 0, max: 10 },
      })
      await wait()
      expect(incrementEl().attributes('disabled')).toBeDefined()
    })

    it('should disable decrement button when disabled', async () => {
      const model = ref<number | null>(5)
      const { decrementEl, wait } = mountNumberField({
        model,
        props: { disabled: true, min: 0, max: 10 },
      })
      await wait()
      expect(decrementEl().attributes('disabled')).toBeDefined()
    })

    it('should not increment when disabled', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { disabled: true, min: 0, max: 10 },
      })
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(5)
    })

    it('should not respond to keyboard when disabled', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { disabled: true, min: 0, max: 10 },
      })
      await wait()

      await controlEl().trigger('keydown', { key: 'ArrowUp' })
      await wait()
      expect(model.value).toBe(5)
    })
  })

  describe('readonly state', () => {
    it('should set data-readonly on root when readonly', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(rootProps().attrs['data-readonly']).toBe(true)
    })

    it('should expose isReadonly in slot props', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(rootProps().isReadonly).toBe(true)
    })

    it('should set readonly attribute on control', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { readonly: true },
      })
      await wait()
      expect(controlEl().attributes('readonly')).toBeDefined()
    })

    it('should not increment when readonly', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { readonly: true, min: 0, max: 10 },
      })
      await wait()

      await incrementEl().trigger('pointerdown', { button: 0 })
      await incrementEl().trigger('pointerup')
      await wait()
      expect(model.value).toBe(5)
    })
  })

  describe('aRIA attributes', () => {
    it('should set aria-valuenow on control', async () => {
      const model = ref<number | null>(42)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('aria-valuenow')).toBe('42')
    })

    it('should not set aria-valuenow when value is null', async () => {
      const model = ref<number | null>(null)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('aria-valuenow')).toBeUndefined()
    })

    it('should set aria-valuemin when min is finite', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { min: 0 },
      })
      await wait()
      expect(controlEl().attributes('aria-valuemin')).toBe('0')
    })

    it('should set aria-valuemax when max is finite', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { max: 100 },
      })
      await wait()
      expect(controlEl().attributes('aria-valuemax')).toBe('100')
    })

    it('should set aria-label from label prop', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { label: 'Quantity' },
      })
      await wait()
      expect(controlEl().attributes('aria-label')).toBe('Quantity')
    })

    it('should set aria-required when required', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { required: true },
      })
      await wait()
      expect(controlEl().attributes('aria-required')).toBe('true')
    })

    it('should set autocomplete=off', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('autocomplete')).toBe('off')
    })

    it('should set spellcheck=false', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({ model })
      await wait()
      expect(controlEl().attributes('spellcheck')).toBe('false')
    })

    it('should set increment button aria-label', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({ model })
      await wait()
      expect(incrementEl().attributes('aria-label')).toBeDefined()
    })

    it('should set decrement button aria-label', async () => {
      const model = ref<number | null>(5)
      const { decrementEl, wait } = mountNumberField({ model })
      await wait()
      expect(decrementEl().attributes('aria-label')).toBeDefined()
    })

    it('should set increment button tabindex=-1', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({ model })
      await wait()
      expect(incrementEl().attributes('tabindex')).toBe('-1')
    })

    it('should set decrement button tabindex=-1', async () => {
      const model = ref<number | null>(5)
      const { decrementEl, wait } = mountNumberField({ model })
      await wait()
      expect(decrementEl().attributes('tabindex')).toBe('-1')
    })

    it('should set increment button type=button', async () => {
      const model = ref<number | null>(5)
      const { incrementEl, wait } = mountNumberField({ model })
      await wait()
      expect(incrementEl().attributes('type')).toBe('button')
    })

    it('should set decrement button type=button', async () => {
      const model = ref<number | null>(5)
      const { decrementEl, wait } = mountNumberField({ model })
      await wait()
      expect(decrementEl().attributes('type')).toBe('button')
    })
  })

  describe('data attributes', () => {
    it('should set data-state on root', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().attrs['data-state']).toBeDefined()
    })

    it('should not set data-disabled when not disabled', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().attrs['data-disabled']).toBeUndefined()
    })

    it('should not set data-readonly when not readonly', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().attrs['data-readonly']).toBeUndefined()
    })

    it('should set data-dirty when value is not null', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().attrs['data-dirty']).toBe(true)
    })

    it('should not set data-dirty when value is null', async () => {
      const model = ref<number | null>(null)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().attrs['data-dirty']).toBeUndefined()
    })
  })

  describe('slot props', () => {
    it('should expose display string', async () => {
      const model = ref<number | null>(42)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().display).toBe('42')
    })

    it('should expose empty display for null', async () => {
      const model = ref<number | null>(null)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().display).toBe('')
    })

    it('should expose id', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({
        model,
        props: { id: 'my-field' },
      })
      await wait()
      expect(rootProps().id).toBe('my-field')
    })

    it('should expose isFocused', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().isFocused).toBe(false)
    })

    it('should expose isPristine', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().isPristine).toBe(true)
    })

    it('should expose errors as empty array initially', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().errors).toEqual([])
    })

    it('should expose isValid as null initially', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(rootProps().isValid).toBeNull()
    })

    it('should expose validate function', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(typeof rootProps().validate).toBe('function')
    })

    it('should expose reset function', async () => {
      const model = ref<number | null>(5)
      const { rootProps, wait } = mountNumberField({ model })
      await wait()
      expect(typeof rootProps().reset).toBe('function')
    })
  })

  describe('description sub-component', () => {
    it('should set aria-describedby on control when description is present', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        withDescription: true,
      })
      await wait()
      expect(controlEl().attributes('aria-describedby')).toBeDefined()
    })

    it('should not set aria-describedby when no description', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        withDescription: false,
      })
      await wait()
      expect(controlEl().attributes('aria-describedby')).toBeUndefined()
    })
  })

  describe('increment button disabled at boundary', () => {
    it('should disable increment button at max', async () => {
      const model = ref<number | null>(10)
      const { incrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10 },
      })
      await wait()
      expect(incrementEl().attributes('disabled')).toBeDefined()
      expect(incrementEl().attributes('data-disabled')).toBe('true')
    })

    it('should disable decrement button at min', async () => {
      const model = ref<number | null>(0)
      const { decrementEl, wait } = mountNumberField({
        model,
        props: { min: 0, max: 10 },
      })
      await wait()
      expect(decrementEl().attributes('disabled')).toBeDefined()
      expect(decrementEl().attributes('data-disabled')).toBe('true')
    })
  })

  describe('name and form props', () => {
    it('should set name attribute on control', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { name: 'quantity' },
      })
      await wait()
      expect(controlEl().attributes('name')).toBe('quantity')
    })

    it('should set form attribute on control', async () => {
      const model = ref<number | null>(5)
      const { controlEl, wait } = mountNumberField({
        model,
        props: { form: 'my-form' },
      })
      await wait()
      expect(controlEl().attributes('form')).toBe('my-form')
    })
  })
})
