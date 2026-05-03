import { describe, expect, it, vi } from 'vitest'

import { createNumberField } from './index'

// Utilities
import { ref, shallowRef } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return { ...actual, provide: vi.fn(), inject: vi.fn() }
})

function setup (options: Parameters<typeof createNumberField>[0] = {}) {
  return createNumberField(options)
}

describe('createNumberField', () => {
  describe('value', () => {
    it('defaults to null', () => {
      const field = setup()
      expect(field.value.value).toBeNull()
    })

    it('accepts initial value', () => {
      const value = ref<number | null>(42)
      const field = setup({ value })
      expect(field.value.value).toBe(42)
    })

    it('accepts external ref', () => {
      const value = ref<number | null>(10)
      const field = setup({ value })
      value.value = 20
      expect(field.value.value).toBe(20)
    })
  })

  describe('increment / decrement', () => {
    it('increments by step', () => {
      const field = setup({ value: ref(10), min: 0, max: 100, step: 5 })
      field.increment()
      expect(field.value.value).toBe(15)
    })

    it('decrements by step', () => {
      const field = setup({ value: ref(10), min: 0, max: 100, step: 5 })
      field.decrement()
      expect(field.value.value).toBe(5)
    })

    it('supports multiplier', () => {
      const field = setup({ value: ref(50), min: 0, max: 100, step: 1 })
      field.increment(10)
      expect(field.value.value).toBe(60)
      field.decrement(5)
      expect(field.value.value).toBe(55)
    })

    it('clamps at max', () => {
      const field = setup({ value: ref(98), min: 0, max: 100, step: 5 })
      field.increment()
      expect(field.value.value).toBe(100)
    })

    it('clamps at min', () => {
      const field = setup({ value: ref(2), min: 0, max: 100, step: 5 })
      field.decrement()
      expect(field.value.value).toBe(0)
    })

    it('no-ops when disabled', () => {
      const field = setup({ value: ref(10), disabled: true })
      field.increment()
      expect(field.value.value).toBe(10)
      field.decrement()
      expect(field.value.value).toBe(10)
    })

    it('no-ops when readonly', () => {
      const field = setup({ value: ref(10), readonly: true })
      field.increment()
      expect(field.value.value).toBe(10)
      field.decrement()
      expect(field.value.value).toBe(10)
    })

    it('initializes from null using clamped 0', () => {
      const field = setup({ min: 0, max: 100, step: 1 })
      expect(field.value.value).toBeNull()
      field.increment()
      expect(field.value.value).toBe(0)
    })

    it('initializes from null clamped to min when min > 0', () => {
      const field = setup({ min: 10, max: 100, step: 1 })
      field.increment()
      expect(field.value.value).toBe(10)
    })

    it('initializes from null clamped to max when max < 0', () => {
      const field = setup({ min: -100, max: -10, step: 1 })
      field.increment()
      expect(field.value.value).toBe(-10)
    })
  })

  describe('canIncrement / canDecrement', () => {
    it('returns true when within range', () => {
      const field = setup({ value: ref(50), min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(true)
      expect(field.canDecrement.value).toBe(true)
    })

    it('returns false at max', () => {
      const field = setup({ value: ref(100), min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(false)
    })

    it('returns false at min', () => {
      const field = setup({ value: ref(0), min: 0, max: 100 })
      expect(field.canDecrement.value).toBe(false)
    })

    it('returns true for null value', () => {
      const field = setup({ min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(true)
      expect(field.canDecrement.value).toBe(true)
    })

    it('updates reactively', () => {
      const value = ref<number | null>(99)
      const field = setup({ value, min: 0, max: 100, step: 1 })
      expect(field.canIncrement.value).toBe(true)
      value.value = 100
      expect(field.canIncrement.value).toBe(false)
    })
  })

  describe('floor / ceil', () => {
    it('sets value to min', () => {
      const field = setup({ value: ref(50), min: 0, max: 100 })
      field.floor()
      expect(field.value.value).toBe(0)
    })

    it('sets value to max', () => {
      const field = setup({ value: ref(50), min: 0, max: 100 })
      field.ceil()
      expect(field.value.value).toBe(100)
    })

    it('no-ops when disabled', () => {
      const field = setup({ value: ref(50), min: 0, max: 100, disabled: true })
      field.floor()
      expect(field.value.value).toBe(50)
      field.ceil()
      expect(field.value.value).toBe(50)
    })

    it('no-ops when readonly', () => {
      const field = setup({ value: ref(50), min: 0, max: 100, readonly: true })
      field.floor()
      expect(field.value.value).toBe(50)
      field.ceil()
      expect(field.value.value).toBe(50)
    })
  })

  describe('formatValue / parse', () => {
    it('formats with default locale', () => {
      const field = setup()
      expect(field.formatValue(1234.5)).toBe('1,234.5')
    })

    it('formats with currency', () => {
      const field = setup({
        locale: 'en-US',
        format: { style: 'currency', currency: 'USD' },
      })
      expect(field.formatValue(42.5)).toBe('$42.50')
    })

    it('parses formatted number', () => {
      const field = setup({ locale: 'en-US' })
      expect(field.parse('1,234.5')).toBe(1234.5)
    })

    it('parses empty string to null', () => {
      const field = setup()
      expect(field.parse('')).toBeNull()
    })

    it('parses invalid string to null', () => {
      const field = setup()
      expect(field.parse('abc')).toBeNull()
    })

    it('parses negative numbers', () => {
      const field = setup({ locale: 'en-US' })
      expect(field.parse('-42')).toBe(-42)
    })
  })

  describe('display', () => {
    it('formats value reactively', () => {
      const value = ref<number | null>(1234)
      const field = setup({ value, locale: 'en-US' })
      expect(field.display.value).toBe('1,234')
    })

    it('returns empty string for null', () => {
      const field = setup()
      expect(field.display.value).toBe('')
    })

    it('updates when value changes', () => {
      const value = ref<number | null>(10)
      const field = setup({ value, locale: 'en-US' })
      expect(field.display.value).toBe('10')
      value.value = 2000
      expect(field.display.value).toBe('2,000')
    })
  })

  describe('commit', () => {
    it('snaps value', () => {
      const value = ref<number | null>(13)
      const field = setup({ value, min: 0, max: 100, step: 5 })
      field.commit()
      expect(field.value.value).toBe(15)
    })

    it('clamps value by default', () => {
      const value = ref<number | null>(150)
      const field = setup({ value, min: 0, max: 100, step: 1 })
      field.commit()
      expect(field.value.value).toBe(100)
    })

    it('skips clamping when clamp is false', () => {
      const value = ref<number | null>(150)
      const field = setup({ value, min: 0, max: 100, step: 1, clamp: false })
      field.commit()
      expect(field.value.value).toBe(150)
    })

    it('no-ops for null value', () => {
      const field = setup({ min: 0, max: 100 })
      field.commit()
      expect(field.value.value).toBeNull()
    })
  })

  describe('numeric context', () => {
    it('exposes numeric properties', () => {
      const field = setup({ min: 0, max: 100, step: 5 })
      expect(field.numeric.min).toBe(0)
      expect(field.numeric.max).toBe(100)
      expect(field.numeric.step).toBe(5)
    })

    it('exposes snap', () => {
      const field = setup({ min: 0, max: 100, step: 10 })
      expect(field.numeric.snap(13)).toBe(10)
    })
  })

  describe('input context', () => {
    it('exposes input state', () => {
      const field = setup()
      expect(field.input.isDirty.value).toBe(false)
      expect(field.input.isFocused.value).toBe(false)
      expect(field.input.isPristine.value).toBe(true)
    })

    it('tracks disabled reactively', () => {
      const disabled = shallowRef(false)
      const field = setup({ disabled })
      expect(field.input.isDisabled.value).toBe(false)
      disabled.value = true
      expect(field.input.isDisabled.value).toBe(true)
    })

    it('tracks readonly reactively', () => {
      const readonly = shallowRef(false)
      const field = setup({ readonly })
      expect(field.input.isReadonly.value).toBe(false)
      readonly.value = true
      expect(field.input.isReadonly.value).toBe(true)
    })

    it('dirty returns true for non-null value', () => {
      const value = ref<number | null>(null)
      const field = setup({ value })
      expect(field.input.isDirty.value).toBe(false)
      value.value = 0
      expect(field.input.isDirty.value).toBe(true)
    })

    it('uses Object.is for pristine equality', () => {
      const value = ref<number | null>(null)
      const field = setup({ value })
      expect(field.input.isPristine.value).toBe(true)
      value.value = 0
      expect(field.input.isPristine.value).toBe(false)
      value.value = null
      expect(field.input.isPristine.value).toBe(true)
    })
  })
})
