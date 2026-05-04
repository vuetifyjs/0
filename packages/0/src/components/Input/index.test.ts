import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Input } from './index'

// Utilities
import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { InputRootSlotProps } from './index'
import type { VueWrapper } from '@vue/test-utils'

interface MountResult {
  wrapper: VueWrapper
  props: () => InputRootSlotProps
  wait: () => Promise<void>
}

function mountInput (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<string>>
  withDescription?: boolean
  withError?: boolean
} = {}): MountResult {
  let capturedProps: any

  const wrapper = mount(Input.Root, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as string
        },
      }),
      ...options.props,
    },
    slots: {
      default: (props: any) => {
        capturedProps = props
        const children = [
          h(Input.Control as any),
        ]
        if (options.withDescription !== false) {
          children.push(h(Input.Description as any, {}, () => 'Help text'))
        }
        if (options.withError !== false) {
          children.push(h(Input.Error as any, {}, {
            default: (p: any) => p.errors.join(', '),
          }))
        }
        return children
      },
    },
  })

  return {
    wrapper,
    props: () => capturedProps,
    wait: () => nextTick(),
  }
}

describe('input', () => {
  describe('v-model binding', () => {
    it('should bind v-model to the input value', () => {
      const model = ref('hello')
      const { props } = mountInput({ model })

      expect(props().value).toBe('hello')
    })

    it('should update slot props when modelValue prop changes', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({ model })

      await wrapper.setProps({ modelValue: 'new value' })
      await wait()

      expect(props().value).toBe('new value')
    })

    it('should default to empty string', () => {
      const { props } = mountInput()

      expect(props().value).toBe('')
    })
  })

  describe('slot props', () => {
    it('should expose id', () => {
      const { props } = mountInput({ props: { id: 'test-input' } })

      expect(props().id).toBe('test-input')
    })

    it('should expose label', () => {
      const { props } = mountInput({ props: { label: 'Email' } })

      expect(props().label).toBe('Email')
    })

    it('should expose isDirty based on value content', async () => {
      const { wrapper, props, wait } = mountInput()

      expect(props().isDirty).toBe(false)

      await wrapper.setProps({ modelValue: 'text' })
      await wait()

      expect(props().isDirty).toBe(true)
    })

    it('should expose isPristine based on value changes', async () => {
      const model = ref('initial')
      const { wrapper, props, wait } = mountInput({ model })

      expect(props().isPristine).toBe(true)

      await wrapper.setProps({ modelValue: 'changed' })
      await wait()

      expect(props().isPristine).toBe(false)

      await wrapper.setProps({ modelValue: 'initial' })
      await wait()

      expect(props().isPristine).toBe(true)
    })

    it('should expose isFocused as false initially', () => {
      const { props } = mountInput()

      expect(props().isFocused).toBe(false)
    })

    it('should expose isValid as null before validation', () => {
      const { props } = mountInput()

      expect(props().isValid).toBeNull()
    })

    it('should expose validate and reset functions', () => {
      const { props } = mountInput()

      expect(typeof props().validate).toBe('function')
      expect(typeof props().reset).toBe('function')
    })
  })

  describe('data attributes', () => {
    it('should set data-state to pristine initially', () => {
      const { props } = mountInput()

      expect(props().attrs['data-state']).toBe('pristine')
    })

    it('should set data-dirty when value has content', () => {
      const model = ref('text')
      const { props } = mountInput({ model })

      expect(props().attrs['data-dirty']).toBe(true)
    })

    it('should not set data-dirty when value is empty', () => {
      const { props } = mountInput()

      expect(props().attrs['data-dirty']).toBeUndefined()
    })

    it('should set data-disabled when disabled', () => {
      const { props } = mountInput({ props: { disabled: true } })

      expect(props().attrs['data-disabled']).toBe(true)
    })

    it('should set data-readonly when readonly', () => {
      const { props } = mountInput({ props: { readonly: true } })

      expect(props().attrs['data-readonly']).toBe(true)
    })
  })

  describe('disabled state', () => {
    it('should expose isDisabled', () => {
      const { props } = mountInput({ props: { disabled: true } })

      expect(props().isDisabled).toBe(true)
    })

    it('should default to not disabled', () => {
      const { props } = mountInput()

      expect(props().isDisabled).toBe(false)
    })
  })

  describe('readonly state', () => {
    it('should expose isReadonly', () => {
      const { props } = mountInput({ props: { readonly: true } })

      expect(props().isReadonly).toBe(true)
    })

    it('should default to not readonly', () => {
      const { props } = mountInput()

      expect(props().isReadonly).toBe(false)
    })
  })

  describe('validation', () => {
    it('should validate with sync rules', async () => {
      const model = ref('')
      const { props } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      await props().validate()

      expect(props().isValid).toBe(false)
      expect(props().errors).toEqual(['Required'])
    })

    it('should pass validation when rules are satisfied', async () => {
      const model = ref('hello')
      const { props } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      await props().validate()

      expect(props().isValid).toBe(true)
      expect(props().errors).toEqual([])
    })

    it('should support multiple rules', async () => {
      const model = ref('')
      const { props } = mountInput({
        model,
        props: {
          rules: [
            (v: string) => !!v || 'Required',
            (v: string) => v.length >= 3 || 'Too short',
          ],
        },
      })

      await props().validate()

      expect(props().errors).toEqual(['Required', 'Too short'])
    })

    it('should support async rules', async () => {
      const model = ref('')
      const { props } = mountInput({
        model,
        props: {
          rules: [async (v: string) => !!v || 'Required'],
        },
      })

      await props().validate()

      expect(props().isValid).toBe(false)
      expect(props().errors).toEqual(['Required'])
    })

    it('should set data-state to invalid after failed validation', async () => {
      const model = ref('')
      const { props } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      await props().validate()

      expect(props().attrs['data-state']).toBe('invalid')
    })

    it('should set data-state to valid after passed validation', async () => {
      const model = ref('hello')
      const { props } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      await props().validate()

      expect(props().attrs['data-state']).toBe('valid')
    })
  })

  describe('reset', () => {
    it('should restore initial value', async () => {
      const model = ref('initial')
      const { wrapper, props, wait } = mountInput({ model })

      // Simulate user typing via the input element
      const input = wrapper.find('input')
      await input.setValue('changed')
      await wait()

      props().reset()
      await wait()

      expect(model.value).toBe('initial')
    })

    it('should clear validation state', async () => {
      const model = ref('')
      const { props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      await props().validate()
      expect(props().isValid).toBe(false)

      props().reset()
      await wait()

      expect(props().isValid).toBeNull()
      expect(props().errors).toEqual([])
    })

    it('should reset isPristine to true', async () => {
      const model = ref('initial')
      const { wrapper, props, wait } = mountInput({ model })

      await wrapper.setProps({ modelValue: 'changed' })
      await wait()
      expect(props().isPristine).toBe(false)

      props().reset()
      await wait()

      expect(props().isPristine).toBe(true)
    })

    it('should not re-trigger validation after reset with validateOn input', async () => {
      const model = ref('')
      function rule (v: unknown) {
        return !!v || 'Required'
      }
      const { wrapper, props, wait } = mountInput({
        model,
        props: { rules: [rule], validateOn: 'input' },
      })

      // Type something then clear to trigger validation errors
      await wrapper.setProps({ modelValue: 'hello' })
      await wait()
      await wait()
      await wrapper.setProps({ modelValue: '' })
      await wait()
      await wait()
      expect(props().errors.length).toBeGreaterThan(0)

      // Reset should clear errors and NOT re-validate
      props().reset()
      await wait()
      await wait()

      expect(props().errors.length).toBe(0)
      expect(props().isValid).toBeNull()
    })
  })

  describe('error prop', () => {
    it('should force invalid state when error is true', () => {
      const { props } = mountInput({ props: { error: true } })

      expect(props().isValid).toBe(false)
      expect(props().attrs['data-state']).toBe('invalid')
    })

    it('should not affect validation when error is false', () => {
      const { props } = mountInput({ props: { error: false } })

      expect(props().isValid).toBeNull()
    })
  })

  describe('errorMessages prop', () => {
    it('should merge string errorMessages with validation errors', async () => {
      const model = ref('')
      const { props } = mountInput({
        model,
        props: {
          errorMessages: 'Server error',
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      await props().validate()

      expect(props().errors).toEqual(['Server error', 'Required'])
    })

    it('should merge array errorMessages', () => {
      const { props } = mountInput({
        props: { errorMessages: ['Error 1', 'Error 2'] },
      })

      expect(props().errors).toEqual(['Error 1', 'Error 2'])
    })

    it('should force invalid when errorMessages are present', () => {
      const { props } = mountInput({
        props: { errorMessages: 'Server error' },
      })

      expect(props().isValid).toBe(false)
    })
  })

  describe('required prop', () => {
    it('should set required and aria-required on control', async () => {
      const { wrapper, wait } = mountInput({ props: { required: true } })

      await wait()
      const control = wrapper.find('input')

      expect(control.attributes('required')).toBeDefined()
      expect(control.attributes('aria-required')).toBeDefined()
    })

    it('should not set required when not provided', () => {
      const { wrapper } = mountInput()
      const control = wrapper.find('input')

      expect(control.attributes('required')).toBeUndefined()
      expect(control.attributes('aria-required')).toBeUndefined()
    })
  })

  describe('aria', () => {
    it('should set aria-label from label prop', () => {
      const { wrapper } = mountInput({ props: { label: 'Email' } })
      const control = wrapper.find('input')

      expect(control.attributes('aria-label')).toBe('Email')
    })

    it('should set aria-describedby when Description is mounted', async () => {
      const { wrapper, wait } = mountInput({
        props: { id: 'test' },
        withDescription: true,
      })

      await wait()
      const control = wrapper.find('input')

      expect(control.attributes('aria-describedby')).toBe('test-description')
    })

    it('should not set aria-describedby when Description is absent', async () => {
      const { wrapper, wait } = mountInput({
        props: { id: 'test' },
        withDescription: false,
        withError: false,
      })

      await wait()
      const control = wrapper.find('input')

      expect(control.attributes('aria-describedby')).toBeUndefined()
    })

    it('should set aria-errormessage when Error is mounted and has errors', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          id: 'test',
          rules: [(v: string) => !!v || 'Required'],
        },
        withError: true,
      })

      await props().validate()
      await wait()

      const control = wrapper.find('input')
      expect(control.attributes('aria-errormessage')).toBe('test-error')
    })

    it('should not set aria-errormessage when Error is absent', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          id: 'test',
          rules: [(v: string) => !!v || 'Required'],
        },
        withError: false,
      })

      await props().validate()
      await wait()

      const control = wrapper.find('input')
      expect(control.attributes('aria-errormessage')).toBeUndefined()
    })
  })

  describe('atom integration', () => {
    it('should render Root as div by default', () => {
      const { wrapper } = mountInput()

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should render Root with custom element', () => {
      const { wrapper } = mountInput({ props: { as: 'fieldset' } })

      expect(wrapper.element.tagName).toBe('FIELDSET')
    })

    it('should render Control as input by default', () => {
      const { wrapper } = mountInput()
      const control = wrapper.find('input')

      expect(control.exists()).toBe(true)
    })
  })

  describe('focus and blur', () => {
    it('should set isFocused on focus and unset on blur', async () => {
      const { wrapper, props, wait } = mountInput()
      const control = wrapper.find('input')

      await control.trigger('focus')
      await wait()

      expect(props().isFocused).toBe(true)

      await control.trigger('blur')
      await wait()

      expect(props().isFocused).toBe(false)
    })

    it('should set data-focused when focused', async () => {
      const { wrapper, props, wait } = mountInput()
      const control = wrapper.find('input')

      await control.trigger('focus')
      await wait()

      expect(props().attrs['data-focused']).toBe(true)

      await control.trigger('blur')
      await wait()

      expect(props().attrs['data-focused']).toBeUndefined()
    })

    it('should validate on blur with default validateOn', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
        },
      })

      const control = wrapper.find('input')

      // Focus then blur to trigger validation
      await control.trigger('focus')
      await wait()
      await control.trigger('blur')
      await wait()
      await flushPromises()

      expect(props().isValid).toBe(false)
      expect(props().errors).toContain('Required')
    })
  })

  describe('validateOn', () => {
    it('should validate on input when validateOn is input', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
          validateOn: 'input',
        },
      })

      // Change value to trigger input validation
      await wrapper.setProps({ modelValue: 'hello' })
      await wait()
      await flushPromises()
      await wrapper.setProps({ modelValue: '' })
      await wait()
      await flushPromises()

      expect(props().isValid).toBe(false)
      expect(props().errors).toContain('Required')
    })

    it('should not validate on blur when validateOn is submit', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
          validateOn: 'submit',
        },
      })

      const control = wrapper.find('input')

      await control.trigger('focus')
      await wait()
      await control.trigger('blur')
      await wait()

      // Should not validate since validateOn is submit
      expect(props().isValid).toBeNull()
    })

    it('should defer validation with lazy modifier until touched', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
          validateOn: 'blur lazy',
        },
      })

      const control = wrapper.find('input')

      // First blur without prior focus — not yet touched
      await control.trigger('focus')
      await wait()
      await control.trigger('blur')
      await wait()

      // After first blur, isTouched becomes true, so validation should fire
      expect(props().isValid).toBe(false)
    })

    it('should validate eagerly when invalid with eager modifier', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
          validateOn: 'blur eager',
        },
      })

      const control = wrapper.find('input')

      // First blur triggers validation (default event is blur)
      await control.trigger('focus')
      await wait()
      await control.trigger('blur')
      await wait()
      await flushPromises()

      expect(props().isValid).toBe(false)

      // Now that it's invalid, eager modifier should trigger on input changes
      await wrapper.setProps({ modelValue: 'hello' })
      await wait()
      await flushPromises()

      // Eager re-validates because isValid was false
      expect(props().isValid).toBe(true)
    })

    it('should parse lazy input modifier', async () => {
      const model = ref('initial')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => v.length >= 3 || 'Too short'],
          validateOn: 'lazy input',
        },
      })

      // Before being touched, input changes should not validate
      await wrapper.setProps({ modelValue: 'ab' })
      await wait()
      await flushPromises()

      expect(props().isValid).toBeNull()

      // Touch by focusing and blurring
      const control = wrapper.find('input')
      await control.trigger('focus')
      await wait()
      await control.trigger('blur')
      await wait()

      // Now input changes should validate since touched
      await wrapper.setProps({ modelValue: 'a' })
      await wait()
      await flushPromises()

      expect(props().isValid).toBe(false)
    })

    it('should parse eager input modifier', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
          validateOn: 'eager input',
        },
      })

      // Initial input change — eager only triggers when already invalid
      await wrapper.setProps({ modelValue: 'a' })
      await wait()

      // Not invalid yet, so eager doesn't trigger
      expect(props().isValid).toBeNull()
    })

    it('should parse submit lazy modifier', async () => {
      const model = ref('')
      const { wrapper, props, wait } = mountInput({
        model,
        props: {
          rules: [(v: string) => !!v || 'Required'],
          validateOn: 'submit lazy',
        },
      })

      const control = wrapper.find('input')

      // Blur should not validate with submit event
      await control.trigger('focus')
      await wait()
      await control.trigger('blur')
      await wait()

      expect(props().isValid).toBeNull()

      // Input changes should not validate with submit event
      await wrapper.setProps({ modelValue: 'test' })
      await wait()

      expect(props().isValid).toBeNull()
    })
  })

  describe('input control events', () => {
    it('should update model via native input event', async () => {
      const model = ref('')
      const { wrapper, wait } = mountInput({ model })

      const control = wrapper.find('input')
      const input = control.element as HTMLInputElement
      input.value = 'typed'
      await control.trigger('input')
      await wait()

      expect(model.value).toBe('typed')
    })
  })

  describe('sSR / hydration', () => {
    it('should render on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render () {
          return h(Input.Root as any, { label: 'Email' }, {
            default: () => [
              h(Input.Control as any),
              h(Input.Description as any, {}, () => 'Help'),
              h(Input.Error as any),
            ],
          })
        },
      }))

      const html = await renderToString(app)

      expect(html).toContain('input')
      expect(html).toContain('Help')
    })

    it('should render data-state="pristine" on server', async () => {
      const app = createSSRApp(defineComponent({
        render () {
          return h(Input.Root as any, {}, {
            default: () => h(Input.Control as any),
          })
        },
      }))

      const html = await renderToString(app)

      expect(html).toContain('data-state="pristine"')
    })
  })
})
