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
    it('should default to null', () => {
      const field = setup()
      expect(field.value.value).toBeNull()
    })

    it('should accept initial value', () => {
      const value = ref<number | null>(42)
      const field = setup({ value })
      expect(field.value.value).toBe(42)
    })

    it('should accept external ref', () => {
      const value = ref<number | null>(10)
      const field = setup({ value })
      value.value = 20
      expect(field.value.value).toBe(20)
    })
  })

  describe('increment / decrement', () => {
    it('should increment by step', () => {
      const field = setup({ value: ref(10), min: 0, max: 100, step: 5 })
      field.increment()
      expect(field.value.value).toBe(15)
    })

    it('should decrement by step', () => {
      const field = setup({ value: ref(10), min: 0, max: 100, step: 5 })
      field.decrement()
      expect(field.value.value).toBe(5)
    })

    it('should support multiplier', () => {
      const field = setup({ value: ref(50), min: 0, max: 100, step: 1 })
      field.increment(10)
      expect(field.value.value).toBe(60)
      field.decrement(5)
      expect(field.value.value).toBe(55)
    })

    it('should clamp at max', () => {
      const field = setup({ value: ref(98), min: 0, max: 100, step: 5 })
      field.increment()
      expect(field.value.value).toBe(100)
    })

    it('should clamp at min', () => {
      const field = setup({ value: ref(2), min: 0, max: 100, step: 5 })
      field.decrement()
      expect(field.value.value).toBe(0)
    })

    it('should no-op when disabled', () => {
      const field = setup({ value: ref(10), disabled: true })
      field.increment()
      expect(field.value.value).toBe(10)
      field.decrement()
      expect(field.value.value).toBe(10)
    })

    it('should no-op when readonly', () => {
      const field = setup({ value: ref(10), readonly: true })
      field.increment()
      expect(field.value.value).toBe(10)
      field.decrement()
      expect(field.value.value).toBe(10)
    })

    it('should initialize from null using clamped 0', () => {
      const field = setup({ min: 0, max: 100, step: 1 })
      expect(field.value.value).toBeNull()
      field.increment()
      expect(field.value.value).toBe(0)
    })

    it('should initialize from null clamped to min when min > 0', () => {
      const field = setup({ min: 10, max: 100, step: 1 })
      field.increment()
      expect(field.value.value).toBe(10)
    })

    it('should initialize from null clamped to max when max < 0', () => {
      const field = setup({ min: -100, max: -10, step: 1 })
      field.increment()
      expect(field.value.value).toBe(-10)
    })

    // Regression: a NaN/Infinity-valued ref used to flow into numeric.up/down,
    // which silently snapped to min via snap()'s !Number.isFinite early-return —
    // user expected a step forward but got a teleport to min. Use a range where
    // initialize() (clamp(0, min, max)) and snap-to-min disagree: with min=-5
    // initialize returns 0, the old behaviour returned -5.
    it('should re-initialize when value is NaN', () => {
      const value = ref<number | null>(Number.NaN)
      const field = setup({ value, min: -5, max: 100, step: 1 })
      field.increment()
      expect(field.value.value).toBe(0)
    })

    it('should re-initialize when value is Infinity', () => {
      const value = ref<number | null>(Number.POSITIVE_INFINITY)
      const field = setup({ value, min: -5, max: 100, step: 1 })
      field.decrement()
      expect(field.value.value).toBe(0)
    })
  })

  describe('canIncrement / canDecrement', () => {
    it('should return true when within range', () => {
      const field = setup({ value: ref(50), min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(true)
      expect(field.canDecrement.value).toBe(true)
    })

    it('should return false at max', () => {
      const field = setup({ value: ref(100), min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(false)
    })

    it('should return false at min', () => {
      const field = setup({ value: ref(0), min: 0, max: 100 })
      expect(field.canDecrement.value).toBe(false)
    })

    it('should return true for null value', () => {
      const field = setup({ min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(true)
      expect(field.canDecrement.value).toBe(true)
    })

    it('should update reactively', () => {
      const value = ref<number | null>(99)
      const field = setup({ value, min: 0, max: 100, step: 1 })
      expect(field.canIncrement.value).toBe(true)
      value.value = 100
      expect(field.canIncrement.value).toBe(false)
    })
  })

  describe('floor / ceil', () => {
    it('should set value to min', () => {
      const field = setup({ value: ref(50), min: 0, max: 100 })
      field.floor()
      expect(field.value.value).toBe(0)
    })

    it('should set value to max', () => {
      const field = setup({ value: ref(50), min: 0, max: 100 })
      field.ceil()
      expect(field.value.value).toBe(100)
    })

    it('should no-op when disabled', () => {
      const field = setup({ value: ref(50), min: 0, max: 100, disabled: true })
      field.floor()
      expect(field.value.value).toBe(50)
      field.ceil()
      expect(field.value.value).toBe(50)
    })

    it('should no-op when readonly', () => {
      const field = setup({ value: ref(50), min: 0, max: 100, readonly: true })
      field.floor()
      expect(field.value.value).toBe(50)
      field.ceil()
      expect(field.value.value).toBe(50)
    })
  })

  describe('formatValue / parse', () => {
    it('should format with default locale', () => {
      const field = setup()
      expect(field.formatValue(1234.5)).toBe('1,234.5')
    })

    it('should format with currency', () => {
      const field = setup({
        locale: 'en-US',
        format: { style: 'currency', currency: 'USD' },
      })
      expect(field.formatValue(42.5)).toBe('$42.50')
    })

    it('should parse formatted number', () => {
      const field = setup({ locale: 'en-US' })
      expect(field.parse('1,234.5')).toBe(1234.5)
    })

    it('should parse empty string to null', () => {
      const field = setup()
      expect(field.parse('')).toBeNull()
    })

    it('should parse invalid string to null', () => {
      const field = setup()
      expect(field.parse('abc')).toBeNull()
    })

    it('should parse negative numbers', () => {
      const field = setup({ locale: 'en-US' })
      expect(field.parse('-42')).toBe(-42)
    })

    it('should parse comma decimal separator for locales like de-DE', () => {
      const field = setup({ locale: 'de-DE' })
      // de-DE uses ',' as decimal separator and '.' as thousands separator
      expect(field.parse('1.234,5')).toBe(1234.5)
    })
  })

  describe('display', () => {
    it('should format value reactively', () => {
      const value = ref<number | null>(1234)
      const field = setup({ value, locale: 'en-US' })
      expect(field.display.value).toBe('1,234')
    })

    it('should return empty string for null', () => {
      const field = setup()
      expect(field.display.value).toBe('')
    })

    it('should update when value changes', () => {
      const value = ref<number | null>(10)
      const field = setup({ value, locale: 'en-US' })
      expect(field.display.value).toBe('10')
      value.value = 2000
      expect(field.display.value).toBe('2,000')
    })
  })

  describe('commit', () => {
    it('should snap value', () => {
      const value = ref<number | null>(13)
      const field = setup({ value, min: 0, max: 100, step: 5 })
      field.commit()
      expect(field.value.value).toBe(15)
    })

    it('should clamp value by default', () => {
      const value = ref<number | null>(150)
      const field = setup({ value, min: 0, max: 100, step: 1 })
      field.commit()
      expect(field.value.value).toBe(100)
    })

    it('should skip clamping when clamp is false', () => {
      const value = ref<number | null>(150)
      const field = setup({ value, min: 0, max: 100, step: 1, clamp: false })
      field.commit()
      expect(field.value.value).toBe(150)
    })

    it('should no-op for null value', () => {
      const field = setup({ min: 0, max: 100 })
      field.commit()
      expect(field.value.value).toBeNull()
    })
  })

  describe('numeric context', () => {
    it('should expose numeric properties', () => {
      const field = setup({ min: 0, max: 100, step: 5 })
      expect(field.numeric.min).toBe(0)
      expect(field.numeric.max).toBe(100)
      expect(field.numeric.step).toBe(5)
    })

    it('should expose snap', () => {
      const field = setup({ min: 0, max: 100, step: 10 })
      expect(field.numeric.snap(13)).toBe(10)
    })
  })

  describe('input context', () => {
    it('should expose input state', () => {
      const field = setup()
      expect(field.input.isDirty.value).toBe(false)
      expect(field.input.isFocused.value).toBe(false)
      expect(field.input.isPristine.value).toBe(true)
    })

    it('should track disabled reactively', () => {
      const disabled = shallowRef(false)
      const field = setup({ disabled })
      expect(field.input.isDisabled.value).toBe(false)
      disabled.value = true
      expect(field.input.isDisabled.value).toBe(true)
    })

    it('should track readonly reactively', () => {
      const readonly = shallowRef(false)
      const field = setup({ readonly })
      expect(field.input.isReadonly.value).toBe(false)
      readonly.value = true
      expect(field.input.isReadonly.value).toBe(true)
    })

    it('should return true from dirty for non-null value', () => {
      const value = ref<number | null>(null)
      const field = setup({ value })
      expect(field.input.isDirty.value).toBe(false)
      value.value = 0
      expect(field.input.isDirty.value).toBe(true)
    })

    it('should use Object.is for pristine equality', () => {
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
