import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { InputRootSlotProps } from './index'
import type { VueWrapper } from '@vue/test-utils'

import { Input } from './index'

// ============================================================================
// Test Helpers
// ============================================================================

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

// ============================================================================
// Tests
// ============================================================================

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
