import { describe, expect, it } from 'vitest'

import { createSlider } from './index'

describe('createSlider', () => {
  describe('snap', () => {
    it('rounds to nearest step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10 })
      expect(slider.snap(13)).toBe(10)
      expect(slider.snap(17)).toBe(20)
      expect(slider.snap(15)).toBe(20) // round half up
    })

    it('handles decimal steps', () => {
      const slider = createSlider({ min: 0, max: 1, step: 0.1 })
      expect(slider.snap(0.34)).toBeCloseTo(0.3)
      expect(slider.snap(0.36)).toBeCloseTo(0.4)
    })

    it('clamps to min/max', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1 })
      expect(slider.snap(-10)).toBe(0)
      expect(slider.snap(110)).toBe(100)
    })
  })

  describe('percent', () => {
    it('converts value to percentage', () => {
      const slider = createSlider({ min: 0, max: 100 })
      expect(slider.percent(0)).toBe(0)
      expect(slider.percent(50)).toBe(50)
      expect(slider.percent(100)).toBe(100)
    })

    it('handles custom min/max', () => {
      const slider = createSlider({ min: 20, max: 80 })
      expect(slider.percent(20)).toBe(0)
      expect(slider.percent(50)).toBe(50)
      expect(slider.percent(80)).toBe(100)
    })
  })

  describe('fromPercent', () => {
    it('converts percentage to snapped value', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10 })
      expect(slider.fromPercent(0)).toBe(0)
      expect(slider.fromPercent(50)).toBe(50)
      expect(slider.fromPercent(33)).toBe(30)
    })
  })

  describe('setValue', () => {
    it('sets value at index', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1 })
      slider.values.value = [50]
      slider.setValue(0, 75)
      expect(slider.values.value).toEqual([75])
    })

    it('clamps value to min/max', () => {
      const slider = createSlider({ min: 0, max: 100 })
      slider.values.value = [50]
      slider.setValue(0, 150)
      expect(slider.values.value).toEqual([100])
    })

    it('enforces minStepsBetweenThumbs', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      slider.values.value = [30, 70]
      slider.setValue(0, 65) // would be too close to thumb 1 at 70
      expect(slider.values.value[0]).toBe(60) // clamped to 70 - 10
    })

    it('snaps to step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 5 })
      slider.values.value = [50]
      slider.setValue(0, 53)
      expect(slider.values.value).toEqual([55])
    })
  })

  describe('stepUp / stepDown', () => {
    it('increments by one step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 5 })
      slider.values.value = [50]
      slider.stepUp(0)
      expect(slider.values.value).toEqual([55])
    })

    it('decrements by one step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 5 })
      slider.values.value = [50]
      slider.stepDown(0)
      expect(slider.values.value).toEqual([45])
    })

    it('supports multiplier', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1 })
      slider.values.value = [50]
      slider.stepUp(0, 10)
      expect(slider.values.value).toEqual([60])
    })

    it('clamps at boundaries', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10 })
      slider.values.value = [100]
      slider.stepUp(0)
      expect(slider.values.value).toEqual([100])
    })
  })

  describe('setToMin / setToMax', () => {
    it('sets to min', () => {
      const slider = createSlider({ min: 10, max: 90 })
      slider.values.value = [50]
      slider.setToMin(0)
      expect(slider.values.value).toEqual([10])
    })

    it('sets to max', () => {
      const slider = createSlider({ min: 10, max: 90 })
      slider.values.value = [50]
      slider.setToMax(0)
      expect(slider.values.value).toEqual([90])
    })
  })

  describe('defaults', () => {
    it('uses min=0, max=100, step=1', () => {
      const slider = createSlider()
      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.step).toBe(1)
    })
  })

  describe('inverted', () => {
    it('flips percent calculation', () => {
      const slider = createSlider({ min: 0, max: 100, inverted: true })
      expect(slider.percent(25)).toBe(75)
      expect(slider.percent(0)).toBe(100)
      expect(slider.percent(100)).toBe(0)
    })

    it('flips fromPercent', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1, inverted: true })
      expect(slider.fromPercent(75)).toBe(25)
    })
  })
})
