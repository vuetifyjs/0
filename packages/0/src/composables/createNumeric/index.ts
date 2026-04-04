/**
 * @module createNumeric
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-numeric
 *
 * @remarks
 * Pure numeric math primitive. No reactivity, no registry, no DOM events.
 * Provides clamp, snap, step, and percentage conversion for bounded numeric values.
 *
 * Used by createSlider, createNumberField, and other numeric composables.
 * Handles floating-point precision correction internally.
 */

// Utilities
import { clamp } from '#v0/utilities'

function decimalPlaces (n: number): number {
  const s = String(n)
  const dot = s.indexOf('.')
  return dot === -1 ? 0 : s.length - dot - 1
}

export interface NumericOptions {
  /** Minimum value. @default -Infinity */
  min?: number
  /** Maximum value. @default Infinity */
  max?: number
  /** Step increment for Arrow keys. @default 1 */
  step?: number
  /** Large step for PageUp/PageDown. @default step * 10 */
  leap?: number
  /** Circular wrapping (max+step → min). @default false */
  wrap?: boolean
}

export interface NumericContext {
  min: number
  max: number
  step: number
  leap: number
  wrap: boolean
  snap: (value: number) => number
  fromValue: (value: number) => number
  fromPercent: (percent: number) => number
  up: (value: number, multiplier?: number) => number
  down: (value: number, multiplier?: number) => number
  floor: () => number
  ceil: () => number
  canUp: (value: number) => boolean
  canDown: (value: number) => boolean
}

export function createNumeric (options: NumericOptions = {}): NumericContext {
  const {
    min = -Infinity,
    max = Infinity,
    step = 1,
    leap = step * 10,
    wrap = false,
  } = options

  const extent = max - min
  const decimals = Math.max(
    decimalPlaces(step),
    Number.isFinite(min) ? decimalPlaces(min) : 0,
  )

  function snap (value: number): number {
    if (step <= 0 || !Number.isFinite(min) || !Number.isFinite(max)) return clamp(value, min, max)
    const clamped = clamp(value, min, max)
    const steps = Math.round((clamped - min) / step)
    const result = min + steps * step
    return clamp(decimals > 0 ? +result.toFixed(decimals) : result, min, max)
  }

  function fromValue (value: number): number {
    if (!Number.isFinite(extent)) return 0
    if (extent === 0) return 0
    return ((value - min) / extent) * 100
  }

  function fromPercent (percent: number): number {
    if (!Number.isFinite(extent)) return snap(0)
    return snap(min + (percent / 100) * extent)
  }

  function up (value: number, multiplier = 1): number {
    const result = snap(value + step * multiplier)
    if (wrap && result === value && value >= max) return min
    return result
  }

  function down (value: number, multiplier = 1): number {
    const result = snap(value - step * multiplier)
    if (wrap && result === value && value <= min) return max
    return result
  }

  function floor (): number {
    return min
  }

  function ceil (): number {
    return max
  }

  function canUp (value: number): boolean {
    return wrap || value < max
  }

  function canDown (value: number): boolean {
    return wrap || value > min
  }

  return {
    min, max, step, leap, wrap,
    snap, fromValue, fromPercent, up, down, floor, ceil, canUp, canDown,
  }
}
