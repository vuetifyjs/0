import { describe, expect, it } from 'vitest'

import { createFormSchema } from './index'

describe('createFormSchema', () => {
  describe('initial state', () => {
    it('should apply default values to value refs', () => {
      const schema = createFormSchema({
        name: { default: 'Alice' },
        age:  { default: 30 },
      })

      expect(schema.values.name.value).toBe('Alice')
      expect(schema.values.age.value).toBe(30)
    })

    it('should default to null when no default is provided', () => {
      const schema = createFormSchema({ email: {} })

      expect(schema.values.email.value).toBeNull()
    })

    it('should expose isValid as null before any validation', () => {
      const schema = createFormSchema({ x: { rules: [v => !!v || 'Required'] } })

      expect(schema.isValid.value).toBeNull()
    })
  })

  describe('fields bindings', () => {
    it('should have modelValue matching the current ref value', () => {
      const schema = createFormSchema({ name: { default: 'Bob' } })

      expect(schema.fields.name.modelValue).toBe('Bob')
    })

    it('should update the ref when onUpdate:modelValue is called', () => {
      const schema = createFormSchema({ name: { default: '' } })

      schema.fields.name['onUpdate:modelValue']('Charlie')

      expect(schema.values.name.value).toBe('Charlie')
      expect(schema.fields.name.modelValue).toBe('Charlie')
    })

    it('should expose an errorMessages ref per field', () => {
      const schema = createFormSchema({ email: { rules: [v => !!v || 'Required'] } })

      expect(schema.fields.email.errorMessages.value).toEqual([])
    })
  })

  describe('submit and validation', () => {
    it('should return true when all fields pass validation', async () => {
      const schema = createFormSchema({
        name: { default: 'Alice', rules: [v => !!v || 'Required'] },
      })

      const ok = await schema.submit()

      expect(ok).toBe(true)
      expect(schema.isValid.value).toBe(true)
    })

    it('should return false when a field fails validation', async () => {
      const schema = createFormSchema({
        name: { default: '', rules: [v => !!v || 'Required'] },
      })

      const ok = await schema.submit()

      expect(ok).toBe(false)
      expect(schema.isValid.value).toBe(false)
    })

    it('should populate errorMessages on the failing field', async () => {
      const schema = createFormSchema({
        email: { default: '', rules: [v => !!v || 'Email is required'] },
      })

      await schema.submit()

      expect(schema.fields.email.errorMessages.value).toContain('Email is required')
    })

    it('should handle multiple rules per field', async () => {
      const schema = createFormSchema({
        age: {
          default: 5,
          rules: [
            v => Number(v) >= 0  || 'Must be non-negative',
            v => Number(v) >= 18 || 'Must be 18 or older',
          ],
        },
      })

      await schema.submit()

      expect(schema.fields.age.errorMessages.value).toContain('Must be 18 or older')
    })

    it('should validate multiple fields independently', async () => {
      const schema = createFormSchema({
        username: { default: 'alice', rules: [v => !!v || 'Required'] },
        email:    { default: '',      rules: [v => !!v || 'Required'] },
      })

      const ok = await schema.submit()

      expect(ok).toBe(false)
      expect(schema.fields.username.errorMessages.value).toEqual([])
      expect(schema.fields.email.errorMessages.value).toContain('Required')
    })
  })

  describe('reset', () => {
    it('should restore fields to their defaults after mutation', async () => {
      const schema = createFormSchema({
        name: { default: 'Alice', rules: [v => !!v || 'Required'] },
      })

      schema.fields.name['onUpdate:modelValue']('Bob')
      await schema.submit()

      schema.reset()

      expect(schema.values.name.value).toBe('Alice')
      expect(schema.fields.name.errorMessages.value).toEqual([])
      expect(schema.isValid.value).toBeNull()
    })

    it('should restore null when field had no default', () => {
      const schema = createFormSchema({ x: {} })

      schema.fields.x['onUpdate:modelValue']('something')
      schema.reset()

      expect(schema.values.x.value).toBeNull()
    })
  })
})
