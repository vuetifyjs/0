/**
 * @module createNumberField
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-number-field
 *
 * @remarks
 * Orchestrator composable that composes createInput + createNumeric + Intl.NumberFormat.
 * Manages a numeric value with formatting, parsing, stepping, and field state.
 */

// Composables
import { createInput } from '#v0/composables/createInput'
import { createNumeric } from '#v0/composables/createNumeric'

// Utilities
import { clamp, isNull } from '#v0/utilities'
import { ref, toRef, toValue } from 'vue'

// Types
import type { InputContext, InputOptions } from '#v0/composables/createInput'
import type { NumericContext, NumericOptions } from '#v0/composables/createNumeric'
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface NumberFieldOptions extends NumericOptions {
  /** Value source — defaults to ref(null). */
  value?: Ref<number | null>
  /** BCP 47 locale tag. @default 'en-US' */
  locale?: string
  /** Intl.NumberFormat options. */
  format?: Intl.NumberFormatOptions
  /** Whether commit() clamps to min/max. @default true */
  clamp?: boolean
  /** Disabled state. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Readonly state. */
  readonly?: MaybeRefOrGetter<boolean>
  /** Unique identifier. */
  id?: InputOptions<number | null>['id']
  /** Display label. */
  label?: string
  /** Form field name. */
  name?: string
  /** Validation rules. */
  rules?: InputOptions<number | null>['rules']
  /** Manual error state override — forces invalid. */
  error?: InputOptions<number | null>['error']
  /** Manual error messages — merged with rule-based errors. */
  errorMessages?: InputOptions<number | null>['errorMessages']
}

export interface NumberFieldContext {
  /** The numeric value (null when empty). */
  value: Ref<number | null>
  /** Formatted display string (empty for null). */
  display: Readonly<Ref<string>>
  /** Whether the value can be incremented. */
  canIncrement: Readonly<Ref<boolean>>
  /** Whether the value can be decremented. */
  canDecrement: Readonly<Ref<boolean>>
  /** The underlying numeric context. */
  numeric: NumericContext
  /** The underlying input context. */
  input: InputContext<number | null>
  /** Increment value by step * multiplier. */
  increment: (multiplier?: number) => void
  /** Decrement value by step * multiplier. */
  decrement: (multiplier?: number) => void
  /** Set value to min. */
  floor: () => void
  /** Set value to max. */
  ceil: () => void
  /** Format a number using Intl.NumberFormat. */
  formatValue: (value: number) => string
  /** Parse locale-formatted text to a number or null. */
  parse: (text: string) => number | null
  /** Snap and optionally clamp the current value. */
  commit: () => void
}

export function createNumberField (options: NumberFieldOptions = {}): NumberFieldContext {
  const {
    value = ref<number | null>(null),
    locale = 'en-US',
    format: formatOptions,
    clamp: shouldClamp = true,
    disabled = false,
    readonly: _readonly = false,
    min,
    max,
    step,
    leap,
    wrap,
    id,
    label,
    name,
    rules,
    error,
    errorMessages,
  } = options

  const numeric = createNumeric({ min, max, step, leap, wrap })

  const input = createInput<number | null>({
    value,
    id,
    label,
    name,
    disabled,
    readonly: _readonly,
    rules,
    error,
    errorMessages,
    dirty: v => !isNull(v),
    equals: (a, b) => Object.is(a, b),
  })

  const formatter = new Intl.NumberFormat(locale, formatOptions)

  // Build locale-aware stripping regex from formatToParts
  const parts = formatter.formatToParts(12_345.6)
  const literals = new Set<string>()
  for (const part of parts) {
    if (part.type === 'group' || part.type === 'currency' || part.type === 'literal') {
      literals.add(part.value)
    }
  }

  const display = toRef(() => {
    return isNull(value.value) ? '' : formatter.format(value.value)
  })

  const canIncrement = toRef(() => {
    return isNull(value.value) || numeric.canUp(value.value)
  })

  const canDecrement = toRef(() => {
    return isNull(value.value) || numeric.canDown(value.value)
  })

  function isLocked (): boolean {
    return toValue(disabled) || toValue(_readonly)
  }

  function initialize (): number {
    return clamp(0, numeric.min, numeric.max)
  }

  function increment (multiplier?: number): void {
    if (isLocked()) return
    if (isNull(value.value)) {
      value.value = initialize()
      return
    }
    value.value = numeric.up(value.value, multiplier)
  }

  function decrement (multiplier?: number): void {
    if (isLocked()) return
    if (isNull(value.value)) {
      value.value = initialize()
      return
    }
    value.value = numeric.down(value.value, multiplier)
  }

  function floor (): void {
    if (isLocked()) return
    value.value = numeric.floor()
  }

  function ceil (): void {
    if (isLocked()) return
    value.value = numeric.ceil()
  }

  function formatValue (v: number): string {
    return formatter.format(v)
  }

  function parse (text: string): number | null {
    if (text.trim() === '') return null

    let cleaned = text
    for (const literal of literals) {
      cleaned = cleaned.split(literal).join('')
    }

    // Find the decimal separator from formatToParts
    const decimalPart = parts.find(p => p.type === 'decimal')
    if (decimalPart && decimalPart.value !== '.') {
      cleaned = cleaned.replace(decimalPart.value, '.')
    }

    cleaned = cleaned.trim()
    const result = Number(cleaned)
    return Number.isNaN(result) ? null : result
  }

  function commit (): void {
    if (isNull(value.value)) return
    let result = numeric.snap(value.value)
    if (!shouldClamp && (value.value < numeric.min || value.value > numeric.max)) {
      result = value.value
    }
    value.value = result
  }

  return {
    value,
    display,
    canIncrement,
    canDecrement,
    numeric,
    input,
    increment,
    decrement,
    floor,
    ceil,
    formatValue,
    parse,
    commit,
  }
}
