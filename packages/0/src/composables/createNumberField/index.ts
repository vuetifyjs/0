/**
 * @module createNumberField
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-number-field
 *
 * @remarks
 * Orchestrator composable that composes createInput + createNumeric + Intl.NumberFormat.
 * Manages a numeric value with formatting, parsing, stepping, and field state.
 *
 * @example
 * ```ts
 * import { createNumberField } from '@vuetify/v0'
 *
 * const field = createNumberField({ min: 0, max: 100, step: 5 })
 * field.increment()
 * console.log(field.value.value) // 5
 * ```
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
  /**
   * When to write typed input into `value`. `'change'` (default) only
   * writes on `commit()` (blur/Enter). `'input'` also writes on every
   * keystroke via `write()`, without clamping or snapping — clamping
   * mid-type would jump a value like `1` to `min` before the user finishes
   * typing `15`. Clamping/snapping still happens on the next `commit()`.
   *
   * @default 'change'
   *
   * @example
   * ```ts
   * const field = createNumberField({ min: 10, max: 100, commitOn: 'input' })
   * field.write('1')
   * field.value.value // 1 — no jump to min while typing
   * ```
   */
  commitOn?: 'input' | 'change'
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
  /**
   * Form injection key. Must match the parent Form's `namespace`.
   *
   * @default 'v0:form'
   */
  formNamespace?: string
  /**
   * Whether required. When true, a presence rule is registered so Form
   * submit fails on empty values even with `novalidate`.
   */
  required?: boolean
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
  /** Snap and optionally clamp the current value. Pass `next` to avoid reading the stale model on the same tick as a write. */
  commit: (next?: number | null) => void
  /** When typed input is written into `value` — see {@link NumberFieldOptions.commitOn}. */
  readonly commitOn: 'input' | 'change'
  /**
   * Parse `text` and write it straight into `value`, without clamping or
   * snapping. Used by `commitOn: 'input'` consumers to get per-keystroke
   * updates without the min/max jump `commit()` would cause mid-type.
   *
   * @example
   * ```ts
   * const field = createNumberField({ min: 10, max: 100 })
   * field.write('1')
   * field.value.value // 1 — clamped only on the next commit()
   * ```
   */
  write: (text: string) => void
}

export function createNumberField (options: NumberFieldOptions = {}): NumberFieldContext {
  const {
    value = ref<number | null>(null),
    locale = 'en-US',
    format: formatOptions,
    clamp: shouldClamp = true,
    commitOn = 'change',
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
    formNamespace,
    required,
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
    formNamespace,
    required,
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
    if (isNull(value.value) || !Number.isFinite(value.value)) {
      value.value = initialize()
      return
    }
    value.value = numeric.up(value.value, multiplier)
  }

  function decrement (multiplier?: number): void {
    if (isLocked()) return
    if (isNull(value.value) || !Number.isFinite(value.value)) {
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

  function commit (next?: number | null): void {
    if (isLocked()) return
    // Use the provided value when available — avoids reading a stale model on
    // the same tick as a write (parent-bound v-model hasn't round-tripped yet).
    const val = arguments.length === 0 ? value.value : next as number | null
    if (isNull(val)) return
    if (!shouldClamp && (val < numeric.min || val > numeric.max)) {
      // Snap to nearest step without clamping to [min, max]
      if (numeric.step > 0 && Number.isFinite(numeric.min)) {
        const steps = Math.round((val - numeric.min) / numeric.step)
        value.value = numeric.min + steps * numeric.step
      }
      return
    }
    value.value = numeric.snap(val)
  }

  function write (text: string): void {
    if (isLocked()) return
    value.value = parse(text)
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
    commitOn,
    write,
  }
}
