import { describe, expect, it } from 'vitest'

import { createNumeric } from './index'

// Types
import type { NumericOptions } from './index'

function setup (options?: NumericOptions) {
  return createNumeric(options)
}

describe('createNumeric', () => {
  describe('snap', () => {
    it('rounds to nearest step', () => {
      const n = setup({ min: 0, max: 100, step: 10 })
      expect(n.snap(13)).toBe(10)
      expect(n.snap(17)).toBe(20)
      expect(n.snap(15)).toBe(20)
    })

    it('handles decimal steps', () => {
      const n = setup({ min: 0, max: 1, step: 0.1 })
      expect(n.snap(0.34)).toBe(0.3)
      expect(n.snap(0.36)).toBe(0.4)
    })

    it('produces exact values for common decimal steps', () => {
      const n = setup({ min: 0, max: 1, step: 0.1 })
      for (let i = 0; i <= 10; i++) {
        expect(n.snap(i * 0.1)).toBe(+(i * 0.1).toFixed(1))
      }
    })

    it('handles decimal steps with non-zero min', () => {
      const n = setup({ min: 0.05, max: 1, step: 0.1 })
      expect(n.snap(0.16)).toBe(0.15)
      expect(n.snap(0.34)).toBe(0.35)
    })

    it('clamps to min/max', () => {
      const n = setup({ min: 0, max: 100, step: 1 })
      expect(n.snap(-10)).toBe(0)
      expect(n.snap(110)).toBe(100)
    })

    it('clamps without snapping when step is 0', () => {
      const n = setup({ min: 0, max: 100, step: 0 })
      expect(n.snap(50.7)).toBe(50.7)
      expect(n.snap(-10)).toBe(0)
      expect(n.snap(200)).toBe(100)
    })

    it('should return min for NaN and Infinity', () => {
      const n = setup({ min: 0, max: 100, step: 10 })
      expect(n.snap(Number.NaN)).toBe(0)
      expect(n.snap(Infinity)).toBe(0)
      expect(n.snap(-Infinity)).toBe(0)
    })
  })

  describe('fromValue', () => {
    it('converts value to percentage', () => {
      const n = setup({ min: 0, max: 100 })
      expect(n.fromValue(0)).toBe(0)
      expect(n.fromValue(50)).toBe(50)
      expect(n.fromValue(100)).toBe(100)
    })

    it('handles custom min/max', () => {
      const n = setup({ min: 20, max: 80 })
      expect(n.fromValue(20)).toBe(0)
      expect(n.fromValue(50)).toBe(50)
      expect(n.fromValue(80)).toBe(100)
    })

    it('returns 0 when min equals max', () => {
      const n = setup({ min: 50, max: 50 })
      expect(n.fromValue(50)).toBe(0)
    })
  })

  describe('fromPercent', () => {
    it('converts percentage to snapped value', () => {
      const n = setup({ min: 0, max: 100, step: 10 })
      expect(n.fromPercent(0)).toBe(0)
      expect(n.fromPercent(50)).toBe(50)
      expect(n.fromPercent(33)).toBe(30)
    })
  })

  describe('up / down', () => {
    it('increments by one step', () => {
      const n = setup({ min: 0, max: 100, step: 5 })
      expect(n.up(50)).toBe(55)
    })

    it('decrements by one step', () => {
      const n = setup({ min: 0, max: 100, step: 5 })
      expect(n.down(50)).toBe(45)
    })

    it('supports multiplier', () => {
      const n = setup({ min: 0, max: 100, step: 1 })
      expect(n.up(50, 10)).toBe(60)
      expect(n.down(50, 10)).toBe(40)
    })

    it('clamps at boundaries', () => {
      const n = setup({ min: 0, max: 100, step: 10 })
      expect(n.up(100)).toBe(100)
      expect(n.down(0)).toBe(0)
    })
  })

  describe('floor / ceil', () => {
    it('returns min', () => {
      const n = setup({ min: 10, max: 90 })
      expect(n.floor()).toBe(10)
    })

    it('returns max', () => {
      const n = setup({ min: 10, max: 90 })
      expect(n.ceil()).toBe(90)
    })
  })

  describe('canUp / canDown', () => {
    it('returns false at boundaries', () => {
      const n = setup({ min: 0, max: 100 })
      expect(n.canUp(100)).toBe(false)
      expect(n.canDown(0)).toBe(false)
    })

    it('returns true within range', () => {
      const n = setup({ min: 0, max: 100 })
      expect(n.canUp(50)).toBe(true)
      expect(n.canDown(50)).toBe(true)
    })
  })

  describe('wrap', () => {
    it('wraps up from max to min', () => {
      const n = setup({ min: 0, max: 100, step: 10, wrap: true })
      expect(n.up(100)).toBe(0)
    })

    it('wraps down from min to max', () => {
      const n = setup({ min: 0, max: 100, step: 10, wrap: true })
      expect(n.down(0)).toBe(100)
    })

    it('canUp/canDown always true when wrapping', () => {
      const n = setup({ min: 0, max: 100, wrap: true })
      expect(n.canUp(100)).toBe(true)
      expect(n.canDown(0)).toBe(true)
    })
  })

  describe('leap', () => {
    it('defaults to step * 10', () => {
      const n = setup({ step: 5 })
      expect(n.leap).toBe(50)
    })

    it('accepts custom leap', () => {
      const n = setup({ step: 1, leap: 25 })
      expect(n.leap).toBe(25)
    })
  })

  describe('defaults', () => {
    it('uses min=-Infinity, max=Infinity, step=1', () => {
      const n = setup()
      expect(n.min).toBe(-Infinity)
      expect(n.max).toBe(Infinity)
      expect(n.step).toBe(1)
      expect(n.wrap).toBe(false)
    })
  })

  describe('infinite bounds', () => {
    it('snap returns value unchanged with default bounds', () => {
      const n = setup()
      expect(n.snap(42)).toBe(42)
      expect(n.snap(-100)).toBe(-100)
    })

    it('snap clamps with one finite bound', () => {
      const n = setup({ min: 0 })
      expect(n.snap(42)).toBe(42)
      expect(n.snap(-5)).toBe(0)
    })

    it('snap still aligns to step when only max is infinite', () => {
      const n = setup({ min: 0, step: 5 })
      expect(n.snap(47)).toBe(45)
      expect(n.snap(48)).toBe(50)
      expect(n.snap(0)).toBe(0)
    })

    it('snap skips alignment when min is infinite', () => {
      const n = setup({ max: 100, step: 5 })
      expect(n.snap(47)).toBe(47)
      expect(n.snap(110)).toBe(100)
    })

    it('fromValue returns 0 with infinite extent', () => {
      const n = setup()
      expect(n.fromValue(50)).toBe(0)
    })

    it('fromPercent returns snapped 0 with infinite extent', () => {
      const n = setup()
      expect(n.fromPercent(50)).toBe(0)
    })

    it('up/down work with default bounds', () => {
      const n = setup()
      expect(n.up(50)).toBe(51)
      expect(n.down(50)).toBe(49)
    })
  })

  describe('wrap near boundary', () => {
    it('clamps to max before wrapping on next call', () => {
      const n = setup({ min: 0, max: 100, step: 10, wrap: true })
      expect(n.up(95)).toBe(100)
      expect(n.up(100)).toBe(0)
    })
  })
})
