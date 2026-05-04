import { describe, expect, it } from 'vitest'

import { createSlider } from './index'

// Types
import type { SliderOptions } from './index'

function setup (options?: SliderOptions) {
  const slider = createSlider(options)
  return {
    slider,
    addThumb (value?: number) {
      return slider.register(value)
    },
  }
}

describe('createSlider', () => {
  describe('snap', () => {
    it('rounds to nearest step', () => {
      const { slider } = setup({ min: 0, max: 100, step: 10 })
      expect(slider.snap(13)).toBe(10)
      expect(slider.snap(17)).toBe(20)
      expect(slider.snap(15)).toBe(20)
    })

    it('handles decimal steps', () => {
      const { slider } = setup({ min: 0, max: 1, step: 0.1 })
      expect(slider.snap(0.34)).toBe(0.3)
      expect(slider.snap(0.36)).toBe(0.4)
    })

    it('produces exact values for common decimal steps', () => {
      const { slider } = setup({ min: 0, max: 1, step: 0.1 })
      for (let i = 0; i <= 10; i++) {
        expect(slider.snap(i * 0.1)).toBe(+(i * 0.1).toFixed(1))
      }
    })

    it('handles decimal steps with non-zero min', () => {
      const { slider } = setup({ min: 0.05, max: 1, step: 0.1 })
      expect(slider.snap(0.16)).toBe(0.15)
      expect(slider.snap(0.34)).toBe(0.35)
    })

    it('clamps to min/max', () => {
      const { slider } = setup({ min: 0, max: 100, step: 1 })
      expect(slider.snap(-10)).toBe(0)
      expect(slider.snap(110)).toBe(100)
    })
  })

  describe('fromValue', () => {
    it('converts value to percentage', () => {
      const { slider } = setup({ min: 0, max: 100 })
      expect(slider.fromValue(0)).toBe(0)
      expect(slider.fromValue(50)).toBe(50)
      expect(slider.fromValue(100)).toBe(100)
    })

    it('handles custom min/max', () => {
      const { slider } = setup({ min: 20, max: 80 })
      expect(slider.fromValue(20)).toBe(0)
      expect(slider.fromValue(50)).toBe(50)
      expect(slider.fromValue(80)).toBe(100)
    })
  })

  describe('fromPercent', () => {
    it('converts percentage to snapped value', () => {
      const { slider } = setup({ min: 0, max: 100, step: 10 })
      expect(slider.fromPercent(0)).toBe(0)
      expect(slider.fromPercent(50)).toBe(50)
      expect(slider.fromPercent(33)).toBe(30)
    })
  })

  describe('set', () => {
    it('sets value at index', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1 })
      addThumb(50)
      slider.set(0, 75)
      expect(slider.values.value).toEqual([75])
    })

    it('clamps value to min/max', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100 })
      addThumb(50)
      slider.set(0, 150)
      expect(slider.values.value).toEqual([100])
    })

    it('enforces minStepsBetweenThumbs', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      addThumb(30)
      addThumb(70)
      slider.set(0, 65)
      expect(slider.values.value[0]).toBe(60)
    })

    it('snaps to step', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 5 })
      addThumb(50)
      slider.set(0, 53)
      expect(slider.values.value).toEqual([55])
    })
  })

  describe('up / down', () => {
    it('increments by one step', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 5 })
      addThumb(50)
      slider.up(0)
      expect(slider.values.value).toEqual([55])
    })

    it('decrements by one step', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 5 })
      addThumb(50)
      slider.down(0)
      expect(slider.values.value).toEqual([45])
    })

    it('supports multiplier', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1 })
      addThumb(50)
      slider.up(0, 10)
      expect(slider.values.value).toEqual([60])
    })

    it('clamps at boundaries', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 10 })
      addThumb(100)
      slider.up(0)
      expect(slider.values.value).toEqual([100])
    })
  })

  describe('floor / ceil', () => {
    it('sets to min', () => {
      const { slider, addThumb } = setup({ min: 10, max: 90 })
      addThumb(50)
      slider.floor(0)
      expect(slider.values.value).toEqual([10])
    })

    it('sets to max', () => {
      const { slider, addThumb } = setup({ min: 10, max: 90 })
      addThumb(50)
      slider.ceil(0)
      expect(slider.values.value).toEqual([90])
    })
  })

  describe('snap with step <= 0', () => {
    it('clamps without snapping when step is 0', () => {
      const { slider } = setup({ min: 0, max: 100, step: 0 })
      expect(slider.snap(50.7)).toBe(50.7)
      expect(slider.snap(-10)).toBe(0)
      expect(slider.snap(200)).toBe(100)
    })
  })

  describe('fromValue with zero extent', () => {
    it('returns 0 when min equals max', () => {
      const { slider } = setup({ min: 50, max: 50 })
      expect(slider.fromValue(50)).toBe(0)
    })
  })

  describe('readonly mode', () => {
    it('should not change value when readonly', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, readonly: true })
      addThumb(50)
      slider.set(0, 75)
      expect(slider.values.value).toEqual([50])
    })
  })

  describe('set with following thumb constraint', () => {
    it('should constrain first thumb below following thumb gap', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      addThumb(30)
      addThumb(70)
      slider.set(0, 65)
      expect(slider.values.value[0]).toBe(60)
    })

    it('should constrain second thumb above previous thumb gap', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      addThumb(30)
      addThumb(70)
      slider.set(1, 35)
      expect(slider.values.value[1]).toBe(40)
    })
  })

  describe('apply with constraints', () => {
    it('should constrain values between adjacent thumbs', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      addThumb(0)
      addThumb(100)
      slider.apply([50, 55])
      expect(slider.values.value[0]).toBe(45)
      expect(slider.values.value[1]).toBe(60)
    })
  })

  describe('defaults', () => {
    it('uses min=0, max=100, step=1', () => {
      const { slider } = setup()
      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.step).toBe(1)
    })
  })

  describe('inverted', () => {
    it('flips percent calculation', () => {
      const { slider } = setup({ min: 0, max: 100, inverted: true })
      expect(slider.fromValue(25)).toBe(75)
      expect(slider.fromValue(0)).toBe(100)
      expect(slider.fromValue(100)).toBe(0)
    })

    it('flips fromPercent', () => {
      const { slider } = setup({ min: 0, max: 100, step: 1, inverted: true })
      expect(slider.fromPercent(75)).toBe(25)
    })
  })

  describe('register', () => {
    it('registers a thumb with initial value', () => {
      const { slider, addThumb } = setup()
      addThumb(50)
      expect(slider.values.value).toEqual([50])
    })

    it('defaults to min when no initial value', () => {
      const { slider, addThumb } = setup({ min: 10 })
      addThumb()
      expect(slider.values.value).toEqual([10])
    })

    it('registers multiple thumbs in order', () => {
      const { slider, addThumb } = setup()
      addThumb(25)
      addThumb(75)
      expect(slider.values.value).toEqual([25, 75])
    })
  })

  describe('unregister', () => {
    it('removes a thumb', () => {
      const { slider, addThumb } = setup()
      const ticket = addThumb(50)
      addThumb(75)
      slider.unregister(ticket.id)
      expect(slider.values.value).toEqual([75])
    })
  })

  describe('apply', () => {
    it('writes to existing thumb refs', () => {
      const { slider, addThumb } = setup()
      addThumb(0)
      addThumb(0)
      slider.apply([25, 75])
      expect(slider.values.value).toEqual([25, 75])
    })

    it('stores pending when no thumbs registered', () => {
      const { slider, addThumb } = setup()
      slider.apply([25, 75])
      addThumb()
      expect(slider.values.value).toEqual([25])
      addThumb()
      expect(slider.values.value).toEqual([25, 75])
    })

    it('snaps incoming values', () => {
      const { slider, addThumb } = setup({ step: 10 })
      addThumb(0)
      slider.apply([33])
      expect(slider.values.value).toEqual([30])
    })

    it('skips values beyond registered thumb count', () => {
      const { slider, addThumb } = setup()
      addThumb(0)
      // Apply 3 values but only 1 thumb registered
      slider.apply([25, 50, 75])
      expect(slider.values.value).toEqual([25])
    })

    it('handles crossover mode in apply', () => {
      const { slider, addThumb } = setup({ crossover: true })
      addThumb(0)
      addThumb(0)
      slider.apply([75, 25])
      expect(slider.values.value).toEqual([75, 25])
    })
  })

  describe('crossover', () => {
    it('should allow thumbs to cross when crossover is true', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, crossover: true })
      addThumb(30)
      addThumb(70)
      // Set first thumb past second
      slider.set(0, 90)
      expect(slider.values.value[0]).toBe(90)
    })
  })

  describe('register with object input', () => {
    it('should accept { value } object', () => {
      const { slider } = setup()
      slider.register({ value: 42 })
      expect(slider.values.value).toEqual([42])
    })
  })

  describe('selectedValues', () => {
    it('should be an alias for values', () => {
      const { slider, addThumb } = setup()
      addThumb(25)
      addThumb(75)
      expect(slider.selectedValues.value).toEqual([25, 75])
      expect(slider.selectedValues.value).toEqual(slider.values.value)
    })
  })

  describe('size', () => {
    it('should reflect the number of registered thumbs', () => {
      const { slider, addThumb } = setup()
      expect(slider.size).toBe(0)
      const ticket = addThumb(50)
      expect(slider.size).toBe(1)
      addThumb(75)
      expect(slider.size).toBe(2)
      slider.unregister(ticket.id)
      expect(slider.size).toBe(1)
    })
  })

  describe('up / down on non-existent index', () => {
    it('should fall back to min when up on out-of-bounds index', () => {
      const { slider } = setup({ min: 10, max: 100, step: 5 })
      // No thumb registered at index 0
      slider.up(0)
      // No crash, no value change (no thumb exists)
      expect(slider.values.value).toEqual([])
    })

    it('should fall back to min when down on out-of-bounds index', () => {
      const { slider } = setup({ min: 10, max: 100, step: 5 })
      slider.down(0)
      expect(slider.values.value).toEqual([])
    })

    it('should no-op set on non-existent thumb index', () => {
      const { slider } = setup({ min: 0, max: 100 })
      slider.set(5, 50)
      expect(slider.values.value).toEqual([])
    })
  })

  describe('onboard', () => {
    it('should batch-register multiple thumbs', () => {
      const { slider } = setup()
      slider.onboard([{ value: 25 }, { value: 50 }, { value: 75 }] as any)
      expect(slider.values.value).toEqual([25, 50, 75])
      expect(slider.size).toBe(3)
    })

    it('should snap values during onboard', () => {
      const { slider } = setup({ step: 10 })
      slider.onboard([{ value: 13 }, { value: 47 }] as any)
      expect(slider.values.value).toEqual([10, 50])
    })
  })

  describe('disabled model registration', () => {
    it('should ensure thumb is selected even when model is disabled', () => {
      const { slider } = setup({ disabled: true })
      const ticket = slider.register(50)
      // Even with disabled model, thumb should be selected for visibility
      expect(slider.values.value).toEqual([50])
      expect(ticket).toBeDefined()
    })
  })
})
