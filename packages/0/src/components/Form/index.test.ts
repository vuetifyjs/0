import { describe, expect, it } from 'vitest'

// Composables
import { useForm } from '#v0/composables/createForm'
import { createValidation } from '#v0/composables/createValidation'

import { Form } from './index'

// Utilities
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, shallowRef, toValue } from 'vue'

const FailingField = defineComponent({
  setup () {
    const value = shallowRef('')
    createValidation({
      value,
      rules: [(v: unknown) => v === 'valid' ? true : 'Error'],
    })
    return () => h('input')
  },
})

describe('form', () => {
  describe('rendering', () => {
    it('should render as form element by default', () => {
      const wrapper = mount(Form)
      expect(wrapper.element.tagName).toBe('FORM')
    })

    it('should render as custom element when as prop is provided', () => {
      const wrapper = mount(Form, {
        props: { as: 'div' },
      })
      expect(wrapper.element.tagName).toBe('DIV')
    })
  })

  describe('context provision', () => {
    it('should provide form context consumable via useForm()', () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm()
          return () => h('span')
        },
      })

      mount(Form, {
        slots: { default: () => h(Child) },
      })

      expect(injected).toBeDefined()
      expect(typeof injected!.submit).toBe('function')
      expect(typeof injected!.reset).toBe('function')
    })

    it('should provide context with custom namespace', () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm('custom:form')
          return () => h('span')
        },
      })

      mount(Form, {
        props: { namespace: 'custom:form' },
        slots: { default: () => h(Child) },
      })

      expect(injected).toBeDefined()
    })

    it('should not inject with mismatched namespace', () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm('other:form')
          return () => h('span')
        },
      })

      mount(Form, {
        slots: { default: () => h(Child) },
      })

      expect(injected).toBeUndefined()
    })
  })

  describe('events', () => {
    it('should emit submit with valid:true when no fields registered', async () => {
      const wrapper = mount(Form)
      await wrapper.trigger('submit')
      const emitted = wrapper.emitted('submit')
      expect(emitted).toHaveLength(1)
      expect(emitted![0]).toEqual([{ valid: true }])
    })

    it('should emit submit with valid:false when a field has failing validation', async () => {
      const wrapper = mount(Form, {
        slots: { default: () => h(FailingField) },
      })
      await wrapper.trigger('submit')
      await flushPromises()
      const emitted = wrapper.emitted('submit')
      expect(emitted).toHaveLength(1)
      expect(emitted![0]).toEqual([{ valid: false }])
    })

    it('should emit reset and reset field validations on native reset', async () => {
      let injected: ReturnType<typeof useForm>

      const Field = defineComponent({
        setup () {
          injected = useForm()
          const value = shallowRef('')
          createValidation({
            value,
            rules: [(v: unknown) => v === 'valid' ? true : 'Error'],
          })
          return () => h('input')
        },
      })

      const wrapper = mount(Form, {
        slots: { default: () => h(Field) },
      })

      // Submit to trigger validation (will fail, isValid becomes false)
      await wrapper.trigger('submit')
      await flushPromises()
      expect(injected!.isValid.value).toBe(false)

      // Reset should clear validation state back to null
      await wrapper.trigger('reset')
      await nextTick()

      expect(wrapper.emitted('reset')).toHaveLength(1)
      expect(injected!.isValid.value).toBeNull()
    })

    it('should call preventDefault on native submit', async () => {
      const wrapper = mount(Form)
      const event = new Event('submit', { bubbles: true, cancelable: true })
      wrapper.element.dispatchEvent(event)
      await nextTick()
      expect(event.defaultPrevented).toBe(true)
    })

    it('should call preventDefault on native reset', async () => {
      const wrapper = mount(Form)
      const event = new Event('reset', { bubbles: true, cancelable: true })
      wrapper.element.dispatchEvent(event)
      await nextTick()
      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('v-model', () => {
    it('should default to null (unvalidated)', () => {
      const model = shallowRef<boolean | null>(null)
      mount(Form, {
        props: {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: boolean | null) => {
            model.value = v
          },
        },
      })
      expect(model.value).toBeNull()
    })

    it('should reflect false after failed submission', async () => {
      const model = shallowRef<boolean | null>(null)
      const wrapper = mount(Form, {
        props: {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: boolean | null) => {
            model.value = v
          },
        },
        slots: { default: () => h(FailingField) },
      })
      await wrapper.trigger('submit')
      await flushPromises()
      await nextTick()
      expect(model.value).toBe(false)
    })

    it('should reflect true after successful submission', async () => {
      const PassingField = defineComponent({
        setup () {
          const value = shallowRef('valid')
          createValidation({
            value,
            rules: [(v: unknown) => v === 'valid' ? true : 'Error'],
          })
          return () => h('input')
        },
      })

      const model = shallowRef<boolean | null>(null)
      const wrapper = mount(Form, {
        props: {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: boolean | null) => {
            model.value = v
          },
        },
        slots: { default: () => h(PassingField) },
      })
      await wrapper.trigger('submit')
      await flushPromises()
      await nextTick()
      expect(model.value).toBe(true)
    })
  })

  describe('props', () => {
    it('should propagate disabled prop to form.disabled', () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm()
          return () => h('span')
        },
      })

      mount(Form, {
        props: { disabled: true },
        slots: { default: () => h(Child) },
      })

      expect(toValue(injected!.disabled)).toBe(true)
    })

    it('should propagate readonly prop to form.readonly', () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm()
          return () => h('span')
        },
      })

      mount(Form, {
        props: { readonly: true },
        slots: { default: () => h(Child) },
      })

      expect(toValue(injected!.readonly)).toBe(true)
    })

    it('should update form.disabled when prop changes', async () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm()
          return () => h('span')
        },
      })

      const wrapper = mount(Form, {
        props: { disabled: false },
        slots: { default: () => h(Child) },
      })

      expect(toValue(injected!.disabled)).toBe(false)

      await wrapper.setProps({ disabled: true })
      await nextTick()

      expect(toValue(injected!.disabled)).toBe(true)
    })

    it('should update form.readonly when prop changes', async () => {
      let injected: ReturnType<typeof useForm>

      const Child = defineComponent({
        setup () {
          injected = useForm()
          return () => h('span')
        },
      })

      const wrapper = mount(Form, {
        props: { readonly: false },
        slots: { default: () => h(Child) },
      })

      expect(toValue(injected!.readonly)).toBe(false)

      await wrapper.setProps({ readonly: true })
      await nextTick()

      expect(toValue(injected!.readonly)).toBe(true)
    })
  })

  describe('slot props', () => {
    it('should expose isValid, isValidating, isDisabled, isReadonly, submit, reset', () => {
      let slot: any

      mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot).toBeDefined()
      expect('isValid' in slot).toBe(true)
      expect('isValidating' in slot).toBe(true)
      expect('isDisabled' in slot).toBe(true)
      expect('isReadonly' in slot).toBe(true)
      expect(typeof slot.submit).toBe('function')
      expect(typeof slot.reset).toBe('function')
    })

    it('should expose null isValid when no fields registered', () => {
      let slot: any

      mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot.isValid).toBeNull()
    })

    it('should expose isDisabled from disabled prop', () => {
      let slot: any

      mount(Form, {
        props: { disabled: true },
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot.isDisabled).toBe(true)
    })

    it('should expose isReadonly from readonly prop', () => {
      let slot: any

      mount(Form, {
        props: { readonly: true },
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot.isReadonly).toBe(true)
    })

    it('should expose isDisabled as false by default', () => {
      let slot: any

      mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot.isDisabled).toBe(false)
    })

    it('should expose isReadonly as false by default', () => {
      let slot: any

      mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot.isReadonly).toBe(false)
    })

    it('should expose isValidating as false when idle', () => {
      let slot: any

      mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      expect(slot.isValidating).toBe(false)
    })

    it('should expose isValid as false after failed submission', async () => {
      let slot: any

      const wrapper = mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h(FailingField)
          },
        },
      })

      await wrapper.trigger('submit')
      await flushPromises()
      await nextTick()

      expect(slot.isValid).toBe(false)
    })

    it('should expose isValid as true after successful submission', async () => {
      const PassingField = defineComponent({
        setup () {
          const value = shallowRef('valid')
          createValidation({
            value,
            rules: [(v: unknown) => v === 'valid' ? true : 'Error'],
          })
          return () => h('input')
        },
      })

      let slot: any

      const wrapper = mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h(PassingField)
          },
        },
      })

      await wrapper.trigger('submit')
      await flushPromises()
      await nextTick()

      expect(slot.isValid).toBe(true)
    })

    it('should allow submit via slot prop function', async () => {
      let slot: any

      mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h('div')
          },
        },
      })

      const result = await slot.submit()
      await flushPromises()

      expect(result).toBe(true)
    })

    it('should allow reset via slot prop function', async () => {
      let injected: ReturnType<typeof useForm>

      const Field = defineComponent({
        setup () {
          injected = useForm()
          const value = shallowRef('')
          createValidation({
            value,
            rules: [(v: unknown) => v === 'valid' ? true : 'Error'],
          })
          return () => h('input')
        },
      })

      let slot: any

      const wrapper = mount(Form, {
        slots: {
          default: (props: any) => {
            slot = props
            return h(Field)
          },
        },
      })

      await wrapper.trigger('submit')
      await flushPromises()
      expect(injected!.isValid.value).toBe(false)

      slot.reset()
      await nextTick()

      expect(injected!.isValid.value).toBeNull()
    })
  })
})
