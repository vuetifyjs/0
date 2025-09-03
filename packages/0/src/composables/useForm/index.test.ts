import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useForm } from './index'

describe('useForm validateOn functionality', () => {
  it('should default to submit validation only', () => {
    const form = useForm()
    expect(form.validateOn).toBe('submit')
  })

  it('should accept custom validateOn option', () => {
    const form = useForm({ validateOn: 'change' })
    expect(form.validateOn).toBe('change')
  })

  it('should support multiple triggers', () => {
    const form = useForm({ validateOn: 'submit change' })
    expect(form.validateOn).toBe('submit change')
  })

  it('should validate on submit when validateOn includes submit', async () => {
    const form = useForm({ validateOn: 'submit' })
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
    const form = useForm({ validateOn: 'change' })
    const mockRule = vi.fn().mockResolvedValue('Error message')

    form.register({
      id: 'test',
      rules: [mockRule],
      value: 'test-value',
    })

    const result = await form.submit()

    expect(mockRule).not.toHaveBeenCalled()
    // Should return true since no validation was performed and field is in initial state
    expect(result).toBe(false) // false because isValid is null initially
  })

  it('should validate on change when validateOn includes change', async () => {
    const form = useForm({ validateOn: 'change' })
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

  it('should not validate on change when validateOn does not include change', async () => {
    const form = useForm({ validateOn: 'submit' })
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
    const form = useForm({ validateOn: 'submit' })
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
    const form = useForm({ validateOn: 'blur focus custom' })
    expect(form.validateOn).toBe('blur focus custom')
  })

  it('should be case insensitive', async () => {
    const form = useForm({ validateOn: 'SUBMIT Change' })
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
})
