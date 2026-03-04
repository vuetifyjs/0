/**
 * @module createSlider
 *
 * @remarks
 * Composable for managing slider state: value math, step snapping,
 * percentage conversion, and multi-thumb value operations.
 *
 * Designed for single-thumb, range, and multi-thumb sliders.
 * Also reusable for color picker tracks, media scrubbers,
 * gradient editors, and other 1D value-on-track controls.
 */

// Utilities
import { clamp } from '#v0/utilities'
import { ref, toRef, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface SliderOptions {
  /** Minimum value (default: 0) */
  min?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Step increment (default: 1) */
  step?: number
  /** Whether the slider is disabled */
  disabled?: MaybeRefOrGetter<boolean>
  /** Slider orientation */
  orientation?: MaybeRefOrGetter<'horizontal' | 'vertical'>
  /** Flip the percent axis */
  inverted?: MaybeRefOrGetter<boolean>
  /** Minimum steps required between adjacent thumbs (default: 0) */
  minStepsBetweenThumbs?: number
  /** Allow thumbs to pass through each other (default: false) */
  crossover?: boolean
}

export interface SliderContext {
  /** All thumb values */
  values: Ref<number[]>
  /** Minimum value */
  readonly min: number
  /** Maximum value */
  readonly max: number
  /** Step increment */
  readonly step: number
  /** Minimum steps between thumbs */
  readonly minStepsBetweenThumbs: number
  /** Whether thumbs can pass through each other */
  readonly crossover: boolean
  /** Whether disabled */
  disabled: Ref<boolean>
  /** Orientation */
  orientation: Ref<'horizontal' | 'vertical'>
  /** Whether inverted */
  inverted: Ref<boolean>
  /** Round value to nearest step, clamped to min/max */
  snap: (value: number) => number
  /** Convert value to 0-100 percentage (respects inverted) */
  percent: (value: number) => number
  /** Convert 0-100 percentage to snapped value (respects inverted) */
  fromPercent: (percent: number) => number
  /** Set value at thumb index with constraints */
  setValue: (index: number, value: number) => void
  /** Increment thumb value by step x multiplier */
  stepUp: (index: number, multiplier?: number) => void
  /** Decrement thumb value by step x multiplier */
  stepDown: (index: number, multiplier?: number) => void
  /** Set thumb to minimum value */
  setToMin: (index: number) => void
  /** Set thumb to maximum value */
  setToMax: (index: number) => void
}

/**
 * Creates slider state with value math, step snapping, and multi-thumb support.
 *
 * @param options Slider configuration.
 * @returns Slider context with values, math functions, and thumb operations.
 *
 * @example
 * ```ts
 * const slider = createSlider({ min: 0, max: 100, step: 5 })
 * slider.values.value = [50]
 * slider.stepUp(0)     // [55]
 * slider.percent(50)   // 50
 * ```
 */
export function createSlider (options: SliderOptions = {}): SliderContext {
  const {
    min = 0,
    max = 100,
    step = 1,
    disabled: disabledProp = false,
    orientation: orientationProp = 'horizontal',
    inverted: invertedProp = false,
    minStepsBetweenThumbs = 0,
    crossover = false,
  } = options

  const values = ref<number[]>([])
  const disabled = toRef(() => toValue(disabledProp))
  const orientation = toRef(() => toValue(orientationProp))
  const inverted = toRef(() => toValue(invertedProp))

  const range = max - min

  function snap (value: number): number {
    if (step <= 0) return clamp(value, min, max)
    const clamped = clamp(value, min, max)
    const steps = Math.round((clamped - min) / step)
    return clamp(min + steps * step, min, max)
  }

  function percent (value: number): number {
    if (range === 0) return 0
    const p = ((value - min) / range) * 100
    return inverted.value ? 100 - p : p
  }

  function fromPercent (p: number): number {
    const adjusted = inverted.value ? 100 - p : p
    return snap(min + (adjusted / 100) * range)
  }

  function setValue (index: number, value: number): void {
    const snapped = snap(value)
    const next = [...values.value]

    let constrained = snapped

    // Enforce minimum distance between adjacent thumbs (skip when crossover)
    if (!crossover) {
      const gap = minStepsBetweenThumbs * step
      const prev = next[index - 1]
      const following = next[index + 1]

      if (index > 0 && prev !== undefined) {
        constrained = Math.max(constrained, prev + gap)
      }
      if (index < next.length - 1 && following !== undefined) {
        constrained = Math.min(constrained, following - gap)
      }
    }

    constrained = clamp(constrained, min, max)
    next[index] = constrained
    values.value = next
  }

  function stepUp (index: number, multiplier = 1): void {
    setValue(index, (values.value[index] ?? min) + step * multiplier)
  }

  function stepDown (index: number, multiplier = 1): void {
    setValue(index, (values.value[index] ?? min) - step * multiplier)
  }

  function setToMin (index: number): void {
    setValue(index, min)
  }

  function setToMax (index: number): void {
    setValue(index, max)
  }

  return {
    values,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    crossover,
    disabled,
    orientation,
    inverted,
    snap,
    percent,
    fromPercent,
    setValue,
    stepUp,
    stepDown,
    setToMin,
    setToMax,
  }
}
