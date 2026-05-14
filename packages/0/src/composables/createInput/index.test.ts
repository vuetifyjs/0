import { describe, expect, it, vi } from 'vitest'

import { createInput } from './index'

// Utilities
import { nextTick, ref, shallowRef } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return { ...actual, provide: vi.fn(), inject: vi.fn() }
})

describe('createInput', () => {
  describe('field state', () => {
    it('should expose value ref', () => {
      const value = ref('hello')
      const input = createInput({ value })
      expect(input.value.value).toBe('hello')
    })

    it('should generate ARIA IDs', () => {
      const input = createInput({ value: ref(''), id: 'email' })
      expect(input.descriptionId).toBe('email-description')
      expect(input.errorId).toBe('email-error')
    })

    it('should track disabled state', () => {
      const disabled = shallowRef(false)
      const input = createInput({ value: ref(''), disabled })
      expect(input.isDisabled.value).toBe(false)
      disabled.value = true
      expect(input.isDisabled.value).toBe(true)
    })

    it('should track readonly state', () => {
      const readonly = shallowRef(false)
      const input = createInput({ value: ref(''), readonly })
      expect(input.isReadonly.value).toBe(false)
      readonly.value = true
      expect(input.isReadonly.value).toBe(true)
    })

    it('should track focused state', () => {
      const input = createInput({ value: ref('') })
      expect(input.isFocused.value).toBe(false)
      input.isFocused.value = true
      expect(input.isFocused.value).toBe(true)
    })

    it('should track touched state', () => {
      const input = createInput({ value: ref('') })
      expect(input.isTouched.value).toBe(false)
      input.isTouched.value = true
      expect(input.isTouched.value).toBe(true)
    })
  })

  describe('dirty', () => {
    it('should use default dirty check for strings', () => {
      const value = ref('')
      const input = createInput({ value })
      expect(input.isDirty.value).toBe(false)
      value.value = 'hello'
      expect(input.isDirty.value).toBe(true)
    })

    it('should use custom dirty predicate', () => {
      const value = ref<number | null>(null)
      const input = createInput({
        value,
        dirty: v => v !== null,
      })
      expect(input.isDirty.value).toBe(false)
      value.value = 42
      expect(input.isDirty.value).toBe(true)
    })
  })

  describe('pristine', () => {
    it('should start pristine', () => {
      const input = createInput({ value: ref('initial') })
      expect(input.isPristine.value).toBe(true)
    })

    it('should become not pristine when value changes', () => {
      const value = ref('initial')
      const input = createInput({ value })
      value.value = 'changed'
      expect(input.isPristine.value).toBe(false)
    })

    it('should become pristine again if value returns to initial', () => {
      const value = ref('initial')
      const input = createInput({ value })
      value.value = 'changed'
      expect(input.isPristine.value).toBe(false)
      value.value = 'initial'
      expect(input.isPristine.value).toBe(true)
    })

    it('should use custom equals for pristine check', () => {
      const value = ref<number | null>(null)
      const input = createInput({
        value,
        equals: (a, b) => Object.is(a, b),
      })
      expect(input.isPristine.value).toBe(true)
      value.value = 0
      expect(input.isPristine.value).toBe(false)
    })
  })

  describe('validation', () => {
    it('should start unvalidated (null)', () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
      })
      expect(input.isValid.value).toBeNull()
    })

    it('should validate to false with errors', async () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
      })
      const result = await input.validate()
      expect(result).toBe(false)
      expect(input.errors.value).toContain('Required')
      expect(input.isValid.value).toBe(false)
    })

    it('should validate to true when passing', async () => {
      const input = createInput({
        value: ref('hello'),
        rules: [v => !!v || 'Required'],
      })
      const result = await input.validate()
      expect(result).toBe(true)
      expect(input.errors.value).toEqual([])
      expect(input.isValid.value).toBe(true)
    })

    it('should merge manual error messages', async () => {
      const input = createInput({
        value: ref('hello'),
        errorMessages: 'Server error',
      })
      expect(input.errors.value).toContain('Server error')
    })

    it('should force invalid via error prop', () => {
      const input = createInput({
        value: ref('hello'),
        error: true,
      })
      expect(input.isValid.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset value to initial', async () => {
      const value = ref('initial')
      const input = createInput({ value, rules: [v => !!v || 'Required'] })
      value.value = 'changed'
      await input.validate()
      input.reset()
      await nextTick()
      expect(value.value).toBe('initial')
      expect(input.isPristine.value).toBe(true)
      expect(input.isTouched.value).toBe(false)
      expect(input.isValid.value).toBeNull()
    })
  })

  describe('state', () => {
    it('should return pristine when unvalidated', () => {
      const input = createInput({ value: ref('') })
      expect(input.state.value).toBe('pristine')
    })

    it('should return valid after passing validation', async () => {
      const input = createInput({
        value: ref('hello'),
        rules: [v => !!v || 'Required'],
      })
      await input.validate()
      expect(input.state.value).toBe('valid')
    })

    it('should return invalid after failing validation', async () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
      })
      await input.validate()
      expect(input.state.value).toBe('invalid')
    })
  })

  describe('generic types', () => {
    it('should work with number | null', () => {
      const value = ref<number | null>(null)
      const input = createInput({
        value,
        dirty: v => v !== null,
      })
      expect(input.value.value).toBeNull()
      value.value = 42
      expect(input.isDirty.value).toBe(true)
    })
  })

  describe('async validation', () => {
    it('should track isValidating during async rules', async () => {
      const input = createInput({
        value: ref(''),
        rules: [async v => {
          await new Promise(r => setTimeout(r, 10))
          return !!v || 'Required'
        }],
      })
      const promise = input.validate()
      expect(input.isValidating.value).toBe(true)
      await promise
      expect(input.isValidating.value).toBe(false)
    })
  })

  describe('multiple rules', () => {
    it('should accumulate errors from multiple rules', async () => {
      const input = createInput({
        value: ref(''),
        rules: [
          v => !!v || 'Required',
          v => (v as string).length >= 3 || 'Too short',
        ],
      })
      await input.validate()
      expect(input.errors.value).toContain('Required')
      expect(input.errors.value).toContain('Too short')
    })

    it('should merge manual and rule-based errors', async () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
        errorMessages: 'Server error',
      })
      await input.validate()
      expect(input.errors.value).toContain('Server error')
      expect(input.errors.value).toContain('Required')
    })
  })

  describe('reactive errorMessages', () => {
    it('should update errors when errorMessages ref changes', () => {
      const messages = ref<string | undefined>(undefined)
      const input = createInput({
        value: ref('hello'),
        errorMessages: () => messages.value,
      })
      expect(input.errors.value).toEqual([])
      messages.value = 'Server error'
      expect(input.errors.value).toContain('Server error')
    })
  })
})
