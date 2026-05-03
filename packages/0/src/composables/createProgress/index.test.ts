import { describe, expect, it } from 'vitest'

import { createProgress } from './index'

// Utilities
import { shallowRef, toValue } from 'vue'

// Types
import type { ProgressOptions } from './index'

function setup (options?: ProgressOptions) {
  return createProgress(options)
}

describe('createProgress', () => {
  describe('defaults', () => {
    it('should create with default min and max', () => {
      const progress = setup()
      expect(progress.min).toBe(0)
      expect(progress.max).toBe(100)
    })

    it('should start with zero total when no segments or value', () => {
      const progress = setup()
      // No segments, no initial value — isIndeterminate
      expect(progress.isIndeterminate.value).toBe(true)
    })

    it('should use initial value when provided and no segments', () => {
      const progress = setup({ value: 40 })
      expect(progress.total.value).toBe(40)
      expect(progress.percent.value).toBe(40)
      expect(progress.isIndeterminate.value).toBe(false)
    })
  })

  describe('registration', () => {
    it('should register a segment', () => {
      const progress = setup()
      const ticket = progress.register()
      expect(ticket).toBeDefined()
      expect(progress.segments.value.length).toBe(1)
    })

    it('should register multiple segments', () => {
      const progress = setup()
      progress.register()
      progress.register()
      progress.register()
      expect(progress.segments.value.length).toBe(3)
    })

    it('should register with a reactive value', () => {
      const progress = setup()
      const val = shallowRef(25)
      progress.register({ value: val })
      expect(progress.total.value).toBe(25)
    })

    it('should assign an id to registered segment', () => {
      const progress = setup()
      const ticket = progress.register()
      expect(ticket.id).toBeDefined()
    })
  })

  describe('total', () => {
    it('should sum all segment values', () => {
      const progress = setup()
      progress.register({ value: shallowRef(30) })
      progress.register({ value: shallowRef(20) })
      expect(progress.total.value).toBe(50)
    })

    it('should clamp total to max', () => {
      const progress = setup({ max: 100 })
      progress.register({ value: shallowRef(60) })
      progress.register({ value: shallowRef(60) })
      expect(progress.total.value).toBe(100)
    })

    it('should clamp total to min', () => {
      const progress = setup({ min: 0 })
      progress.register({ value: shallowRef(-10) })
      expect(progress.total.value).toBe(0)
    })

    it('should update reactively when segment value changes', () => {
      const progress = setup()
      const val = shallowRef(10)
      progress.register({ value: val })
      expect(progress.total.value).toBe(10)

      val.value = 50
      expect(progress.total.value).toBe(50)
    })

    it('should treat null/undefined segment values as zero', () => {
      const progress = setup()
      progress.register({ value: shallowRef(0) })
      expect(progress.total.value).toBe(0)
    })
  })

  describe('percent', () => {
    it('should calculate percentage from total', () => {
      const progress = setup({ min: 0, max: 100 })
      progress.register({ value: shallowRef(50) })
      expect(progress.percent.value).toBe(50)
    })

    it('should handle custom min/max', () => {
      const progress = setup({ min: 20, max: 80 })
      progress.register({ value: shallowRef(50) })
      expect(progress.percent.value).toBe(50)
    })

    it('should return 0 when extent is zero', () => {
      const progress = setup({ min: 50, max: 50 })
      progress.register({ value: shallowRef(50) })
      expect(progress.percent.value).toBe(0)
    })

    it('should return 100 when total equals max', () => {
      const progress = setup({ min: 0, max: 100 })
      progress.register({ value: shallowRef(100) })
      expect(progress.percent.value).toBe(100)
    })

    it('should return 0 when total equals min', () => {
      const progress = setup({ min: 0, max: 100 })
      progress.register({ value: shallowRef(0) })
      expect(progress.percent.value).toBe(0)
    })
  })

  describe('isIndeterminate', () => {
    it('should be true when no segments and no initial value', () => {
      const progress = setup()
      expect(progress.isIndeterminate.value).toBe(true)
    })

    it('should be false when initial value is provided', () => {
      const progress = setup({ value: 0 })
      expect(progress.isIndeterminate.value).toBe(false)
    })

    it('should be true when all segment values are zero', () => {
      const progress = setup()
      progress.register({ value: shallowRef(0) })
      expect(progress.isIndeterminate.value).toBe(true)
    })

    it('should be false when any segment has a positive value', () => {
      const progress = setup()
      progress.register({ value: shallowRef(0) })
      progress.register({ value: shallowRef(10) })
      expect(progress.isIndeterminate.value).toBe(false)
    })

    it('should update when segment value changes from zero', () => {
      const progress = setup()
      const val = shallowRef(0)
      progress.register({ value: val })
      expect(progress.isIndeterminate.value).toBe(true)

      val.value = 5
      expect(progress.isIndeterminate.value).toBe(false)
    })
  })

  describe('fromValue', () => {
    it('should convert value to percentage', () => {
      const progress = setup({ min: 0, max: 100 })
      expect(progress.fromValue(50)).toBe(50)
    })

    it('should clamp value before converting', () => {
      const progress = setup({ min: 0, max: 100 })
      expect(progress.fromValue(150)).toBe(100)
      expect(progress.fromValue(-10)).toBe(0)
    })

    it('should return 0 when extent is zero', () => {
      const progress = setup({ min: 50, max: 50 })
      expect(progress.fromValue(50)).toBe(0)
    })
  })

  describe('apply', () => {
    it('should apply values to existing segments', () => {
      const progress = setup({ min: 0, max: 100 })
      const val = shallowRef(0)
      progress.register({ value: val })
      progress.apply([75])
      expect(toValue(val)).toBe(75)
    })

    it('should clamp applied values', () => {
      const progress = setup({ min: 0, max: 100 })
      const val = shallowRef(0)
      progress.register({ value: val })
      progress.apply([200])
      expect(toValue(val)).toBe(100)
    })

    it('should store pending values when no segments exist', () => {
      const progress = setup({ min: 0, max: 100 })
      progress.apply([60])
      // Register after apply — should pick up the pending value
      const ticket = progress.register()
      expect(toValue(ticket.value)).toBe(60)
    })

    it('should apply to multiple segments', () => {
      const progress = setup({ min: 0, max: 100 })
      const val1 = shallowRef(0)
      const val2 = shallowRef(0)
      progress.register({ value: val1 })
      progress.register({ value: val2 })
      progress.apply([30, 20])
      expect(toValue(val1)).toBe(30)
      expect(toValue(val2)).toBe(20)
    })
  })

  describe('segments ordering', () => {
    it('should sort segments by index', () => {
      const progress = setup()
      progress.register({ value: shallowRef(10) })
      progress.register({ value: shallowRef(20) })
      progress.register({ value: shallowRef(30) })

      const segments = progress.segments.value
      for (let index = 1; index < segments.length; index++) {
        expect(segments[index].index).toBeGreaterThanOrEqual(segments[index - 1].index)
      }
    })
  })
})
