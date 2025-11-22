import { describe, it, expect, vi } from 'vitest'
import { nextTick, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createForm, createFormContext, provideForm, useForm, defaultForm } from './index'
import type { FormTicket, FormContext } from './index'

describe('createForm', () => {
  describe('validateOn functionality', () => {
    it('should default to submit validation only', () => {
      const form = createForm()
      expect(form.validateOn).toBe('submit')
    })

    it('should accept custom validateOn option', () => {
      const form = createForm({ validateOn: 'change' })
      expect(form.validateOn).toBe('change')
    })

    it('should support multiple triggers', () => {
      const form = createForm({ validateOn: 'submit change' })
      expect(form.validateOn).toBe('submit change')
    })

    it('should validate on submit when validateOn includes submit', async () => {
      const form = createForm({ validateOn: 'submit' })
      const mockRule = vi.fn().mockResolvedValue('Error message')

      const field = form.register({
        id: 'test',
        rules: [mockRule],
        value: 'test-value',
      })

      await form.submit()

      expect(mockRule).toHaveBeenCalledWith('test-value')
      expect(field.errors.value).toEqual(['Error message'])
    })

    it('should not validate on submit when validateOn does not include submit', async () => {
      const form = createForm({ validateOn: 'change' })
      const mockRule = vi.fn().mockResolvedValue('Error message')

      form.register({
        id: 'test',
        rules: [mockRule],
        value: 'test-value',
      })

      const result = await form.submit()

      expect(mockRule).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should validate on change when validateOn includes change', async () => {
      const form = createForm({ validateOn: 'change' })
      const mockRule = vi.fn().mockResolvedValue(true)

      const field = form.register({
        id: 'test',
        rules: [mockRule],
        value: 'initial',
      })

      field.value = 'changed'
      expect(form.isValidating.value).toBe(true)
      await nextTick()

      expect(mockRule).toHaveBeenCalledWith('changed')
    })

    it('should not validate on change when validateOn does not include change', async () => {
      const form = createForm({ validateOn: 'submit' })
      const mockRule = vi.fn().mockResolvedValue(true)

      const field = form.register({
        id: 'test',
        rules: [mockRule],
        value: 'initial',
      })

      field.value = 'changed'
      await nextTick()

      expect(mockRule).not.toHaveBeenCalled()
    })

    it('should support field-level validateOn override', async () => {
      const form = createForm({ validateOn: 'submit' })
      const mockRule = vi.fn().mockResolvedValue(true)

      const field = form.register({
        id: 'test',
        rules: [mockRule],
        value: 'initial',
        validateOn: 'change',
      })

      field.value = 'changed'
      await nextTick()

      expect(mockRule).toHaveBeenCalledWith('changed')
      expect(field.validateOn).toBe('change')
    })

    it('should support custom string triggers', () => {
      const form = createForm({ validateOn: 'blur focus custom' })
      expect(form.validateOn).toBe('blur focus custom')
    })

    it('should be case insensitive', async () => {
      const form = createForm({ validateOn: 'SUBMIT Change' })
      const mockRule = vi.fn().mockResolvedValue(true)

      const field = form.register({
        id: 'test',
        rules: [mockRule],
        value: 'initial',
      })

      field.value = 'changed'
      await nextTick()

      expect(mockRule).toHaveBeenCalledWith('changed')
    })

    it('should correctly compute isValid and isValidating', async () => {
      const form = createForm({ validateOn: 'submit' })
      const mockRule = vi.fn().mockResolvedValue(true)

      form.register({
        id: 'test',
        rules: [mockRule],
        value: 'test-value',
      })

      const submitPromise = form.submit()

      await nextTick()
      expect(form.isValidating.value).toBe(true)

      await submitPromise

      expect(form.isValid.value).toBe(true)
      expect(form.isValidating.value).toBe(false)
    })
  })

  describe('validations', () => {
    it('should successfully validate when no rules are provided', async () => {
      const form = createForm({ validateOn: 'submit' })
      const ticket = form.register({
        id: 'test',
        value: 'test-value',
      })

      await ticket.validate()

      expect(ticket.isValid.value).toBe(true)
      expect(ticket.errors.value).toEqual([])
      expect(form.isValid.value).toBe(true)
    })

    it('should fail validation when a rule returns an error message', async () => {
      const form = createForm({ validateOn: 'submit' })
      const ticket = form.register({
        id: 'test',
        value: 'test-value',
        rules: [
          value => value === 'valid-value' || 'Invalid value provided',
        ],
      })

      await ticket.validate()

      expect(ticket.isValid.value).toBe(false)
      expect(ticket.errors.value).toEqual(['Invalid value provided'])
      expect(form.isValid.value).toBe(false)
    })
  })

  describe('isValid computation', () => {
    it('should return null when no fields are registered', () => {
      const form = createForm()
      expect(form.isValid.value).toBe(null)
    })

    it('should return null when fields have not been validated', () => {
      const form = createForm()
      form.register({
        id: 'field1',
        value: 'test',
        rules: [v => v.length > 0 || 'Required'],
      })

      expect(form.isValid.value).toBe(null)
    })

    it('should return true when all fields are valid', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })
      const field2 = form.register({
        id: 'field2',
        value: 'also valid',
        rules: [v => v.length > 3 || 'Min 3 chars'],
      })

      await field1.validate()
      await field2.validate()

      expect(form.isValid.value).toBe(true)
    })

    it('should return false when any field is invalid', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })
      const field2 = form.register({
        id: 'field2',
        value: '',
        rules: [v => v.length > 0 || 'Required'],
      })

      await field1.validate()
      await field2.validate()

      expect(form.isValid.value).toBe(false)
    })

    it('should return null when some fields are validated and some are not', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })
      form.register({
        id: 'field2',
        value: 'not validated',
        rules: [v => v.length > 0 || 'Required'],
      })

      await field1.validate()

      expect(form.isValid.value).toBe(null)
    })
  })

  describe('isPristine tracking', () => {
    it('should be pristine initially', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      expect(field.isPristine.value).toBe(true)
    })

    it('should be non-pristine after value change', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'

      expect(field.isPristine.value).toBe(false)
    })

    it('should be pristine again after reset', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.reset()
      expect(field.isPristine.value).toBe(true)
      expect(field.value).toBe('initial')
    })

    it('should be pristine when value is changed back to initial', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.value = 'initial'
      expect(field.isPristine.value).toBe(true)
    })
  })

  describe('async validation', () => {
    it('should handle async validation rules', async () => {
      const form = createForm()
      async function asyncRule (v: string) {
        await new Promise(resolve => setTimeout(resolve, 10))
        return v.length > 5 || 'Must be longer than 5 characters'
      }

      const field = form.register({
        id: 'test',
        value: 'short',
        rules: [asyncRule],
      })

      await field.validate()

      expect(field.isValid.value).toBe(false)
      expect(field.errors.value).toEqual(['Must be longer than 5 characters'])
    })

    it('should handle mixed sync and async rules', async () => {
      const form = createForm()
      function syncRule (v: string) {
        return v.length > 0 || 'Required'
      }
      async function asyncRule (v: string) {
        await new Promise(resolve => setTimeout(resolve, 10))
        return v.length > 5 || 'Must be longer than 5 characters'
      }

      const field = form.register({
        id: 'test',
        value: 'test',
        rules: [syncRule, asyncRule],
      })

      await field.validate()

      expect(field.isValid.value).toBe(false)
      expect(field.errors.value).toEqual(['Must be longer than 5 characters'])
    })

    it('should track isValidating state during async validation', async () => {
      const form = createForm()
      async function asyncRule (_v: string) {
        await new Promise(resolve => setTimeout(resolve, 50))
        return true as const
      }

      const field = form.register({
        id: 'test',
        value: 'test',
        rules: [asyncRule],
      })

      expect(field.isValidating.value).toBe(false)

      const validatePromise = field.validate()
      await nextTick()

      expect(field.isValidating.value).toBe(true)

      await validatePromise

      expect(field.isValidating.value).toBe(false)
    })
  })

  describe('silent validation', () => {
    it('should not update errors when silent is true', async () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: '',
        rules: [v => v.length > 0 || 'Required'],
      })

      const result = await field.validate(true)

      expect(result).toBe(false)
      expect(field.errors.value).toEqual([])
      expect(field.isValid.value).toBe(null)
    })

    it('should not update isValid when silent is true', async () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })

      const result = await field.validate(true)

      expect(result).toBe(true)
      expect(field.errors.value).toEqual([])
      expect(field.isValid.value).toBe(null)
    })
  })

  describe('form reset', () => {
    it('should reset all fields when form.reset() is called', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'initial1',
        rules: [v => v.length > 0 || 'Required'],
      })
      const field2 = form.register({
        id: 'field2',
        value: 'initial2',
        rules: [v => v.length > 0 || 'Required'],
      })

      field1.value = 'changed1'
      field2.value = 'changed2'
      await field1.validate()
      await field2.validate()

      form.reset()

      expect(field1.value).toBe('initial1')
      expect(field2.value).toBe('initial2')
      expect(field1.isPristine.value).toBe(true)
      expect(field2.isPristine.value).toBe(true)
      expect(field1.isValid.value).toBe(null)
      expect(field2.isValid.value).toBe(null)
      expect(field1.errors.value).toEqual([])
      expect(field2.errors.value).toEqual([])
    })
  })

  describe('multiple validation rules', () => {
    it('should collect all error messages from failing rules', async () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'ab',
        rules: [
          v => v.length > 3 || 'Must be longer than 3 characters',
          v => v.length < 10 || 'Must be shorter than 10 characters',
          v => /^[a-z]+$/.test(v) || 'Must contain only lowercase letters',
        ],
      })

      await field.validate()

      expect(field.isValid.value).toBe(false)
      expect(field.errors.value).toEqual(['Must be longer than 3 characters'])
    })

    it('should return true when all rules pass', async () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'valid',
        rules: [
          v => v.length > 3 || 'Must be longer than 3 characters',
          v => v.length < 10 || 'Must be shorter than 10 characters',
          v => /^[a-z]+$/.test(v) || 'Must contain only lowercase letters',
        ],
      })

      await field.validate()

      expect(field.isValid.value).toBe(true)
      expect(field.errors.value).toEqual([])
    })
  })

  describe('validateOn change mode', () => {
    it('should trigger validation on value change', async () => {
      const form = createForm({ validateOn: 'change' })
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [v => v.length > 10 || 'Must be longer than 10 characters'],
      })

      field.value = 'short'
      await vi.waitFor(() => {
        expect(field.isValid.value).toBe(false)
      })
      expect(field.errors.value).toEqual(['Must be longer than 10 characters'])
    })

    it('should update validation on subsequent changes', async () => {
      const form = createForm({ validateOn: 'change' })
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [v => v.length > 10 || 'Must be longer than 10 characters'],
      })

      field.value = 'short'
      await vi.waitFor(() => {
        expect(field.isValid.value).toBe(false)
      })

      field.value = 'long enough value'
      await vi.waitFor(() => {
        expect(field.isValid.value).toBe(true)
      })
      expect(field.errors.value).toEqual([])
    })
  })

  describe('combined validation modes', () => {
    it('should validate on both submit and change', async () => {
      const form = createForm({ validateOn: 'submit change' })
      const mockRule = vi.fn(v => v.length > 5 || 'Too short')

      const field = form.register({
        id: 'test',
        value: 'test',
        rules: [mockRule],
      })

      // Should validate on change
      field.value = 'new'
      await nextTick()
      expect(mockRule).toHaveBeenCalledWith('new')

      mockRule.mockClear()

      // Should also validate on submit
      await form.submit()
      expect(mockRule).toHaveBeenCalledWith('new')
    })
  })

  describe('disabled fields', () => {
    it('should register disabled fields', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'test',
        disabled: true,
        rules: [],
      })

      expect(field.disabled).toBe(true)
    })

    it('should default to enabled when disabled is not specified', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'test',
        rules: [],
      })

      expect(field.disabled).toBe(false)
    })
  })
})

describe('createFormContext and useForm registration', () => {
  it('should register field when useForm is called in child', async () => {
    const [useMyForm, provideMyForm, myForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form',
      validateOn: 'submit',
    })

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h(Child)
      },
    })

    const Child = defineComponent({
      setup () {
        useMyForm({
          value: '',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    mount(Parent)

    expect(myForm.size).toBe(1)

    const result = await myForm.submit()
    expect(result).toBe(false)
  })

  it('should unregister field when component unmounts', async () => {
    const [useMyForm, provideMyForm, myForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-2',
    })

    const Child = defineComponent({
      setup () {
        useMyForm({
          value: 'test',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    const Parent = defineComponent({
      props: ['showChild'],
      setup (props) {
        provideMyForm()
        return () => props.showChild ? h(Child) : null
      },
    })

    const wrapper = mount(Parent, {
      props: { showChild: true },
    })

    expect(myForm.size).toBe(1)

    await wrapper.setProps({ showChild: false })
    await nextTick()

    expect(myForm.size).toBe(0)
  })

  it('should validate all registered fields on submit', async () => {
    const [useMyForm, provideMyForm, myForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-3',
      validateOn: 'submit',
    })

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h('div', [h(ChildA), h(ChildB)])
      },
    })

    const ChildA = defineComponent({
      setup () {
        useMyForm({
          id: 'field-a',
          value: 'valid',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    const ChildB = defineComponent({
      setup () {
        useMyForm({
          id: 'field-b',
          value: '',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    mount(Parent)

    expect(myForm.size).toBe(2)

    const result = await myForm.submit()
    expect(result).toBe(false)
    expect(myForm.isValid.value).toBe(false)
  })

  it('should reset all registered fields', async () => {
    const [useMyForm, provideMyForm, myForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-4',
    })

    let field: ReturnType<typeof useMyForm>

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h(Child)
      },
    })

    const Child = defineComponent({
      setup () {
        field = useMyForm({
          value: 'initial',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    mount(Parent)

    field!.value = 'changed'
    await field!.validate()

    expect(field!.value).toBe('changed')
    expect(field!.isPristine.value).toBe(false)

    myForm.reset()

    expect(field!.value).toBe('initial')
    expect(field!.isPristine.value).toBe(true)
    expect(field!.isValid.value).toBe(null)
  })

  it('should inherit validateOn from form', () => {
    const [useMyForm, provideMyForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-5',
      validateOn: 'change',
    })

    let field: ReturnType<typeof useMyForm>

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h(Child)
      },
    })

    const Child = defineComponent({
      setup () {
        field = useMyForm({
          value: 'test',
          rules: [],
        })
        return () => null
      },
    })

    mount(Parent)

    expect(field!.validateOn).toBe('change')
  })

  it('should allow field-level validateOn override', () => {
    const [useMyForm, provideMyForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-6',
      validateOn: 'submit',
    })

    let field: ReturnType<typeof useMyForm>

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h(Child)
      },
    })

    const Child = defineComponent({
      setup () {
        field = useMyForm({
          value: 'test',
          validateOn: 'change',
          rules: [],
        })
        return () => null
      },
    })

    mount(Parent)

    expect(field!.validateOn).toBe('change')
  })

  it('should work with deeply nested components', async () => {
    const [useMyForm, provideMyForm, myForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-7',
    })

    let field: ReturnType<typeof useMyForm>

    const GrandChild = defineComponent({
      setup () {
        field = useMyForm({
          value: '',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    const Child = defineComponent({
      setup () {
        return () => h(GrandChild)
      },
    })

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h(Child)
      },
    })

    mount(Parent)

    expect(myForm.size).toBe(1)

    const result = await myForm.submit()
    expect(result).toBe(false)
    expect(field!.errors.value).toEqual(['Required'])
  })

  it('should compute form isValid from registered fields', async () => {
    const [useMyForm, provideMyForm, myForm] = createFormContext<FormTicket, FormContext>({
      namespace: 'test-form-8',
    })

    const Parent = defineComponent({
      setup () {
        provideMyForm()
        return () => h(Child)
      },
    })

    const Child = defineComponent({
      setup () {
        useMyForm({
          value: 'valid',
          rules: [v => v.length > 0 || 'Required'],
        })
        return () => null
      },
    })

    mount(Parent)

    expect(myForm.isValid.value).toBe(null)

    await myForm.submit()
    expect(myForm.isValid.value).toBe(true)
  })
})

describe('default form exports', () => {
  it('should export useForm, provideForm, and defaultForm', () => {
    expect(useForm).toBeDefined()
    expect(provideForm).toBeDefined()
    expect(defaultForm).toBeDefined()
  })
})
