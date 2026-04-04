# NumberField Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a headless NumberField component with createNumeric and createInput foundation primitives.

**Architecture:** Three composables (createNumeric, createInput, createNumberField) and one compound component (NumberField). createNumeric extracts pure math from createSlider. createInput extracts field state from InputRoot. createNumberField orchestrates both with Intl.NumberFormat.

**Tech Stack:** Vue 3, TypeScript, Vitest, UnoCSS (docs examples)

**Spec:** `docs/superpowers/specs/2026-04-04-number-field-design.md`

---

## PR1: Foundation Primitives

### Task 1: createNumeric — tests

**Files:**
- Create: `packages/0/src/composables/createNumeric/index.test.ts`

- [ ] **Step 1: Write tests for snap**

```ts
import { describe, expect, it } from 'vitest'

import type { NumericOptions } from './index'

import { createNumeric } from './index'

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
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/0/src/composables/createNumeric/index.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Commit test file**

```bash
git add packages/0/src/composables/createNumeric/index.test.ts
git commit -m "test(createNumeric): add tests for pure numeric math primitive"
```

---

### Task 2: createNumeric — implementation

**Files:**
- Create: `packages/0/src/composables/createNumeric/index.ts`
- Modify: `packages/0/src/composables/index.ts`

- [ ] **Step 1: Implement createNumeric**

```ts
/**
 * @module createNumeric
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

/**
 * Configuration options for createNumeric.
 */
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

/**
 * Context returned by {@link createNumeric}.
 *
 * Pure functions for bounded numeric math. No reactivity or state mutation.
 */
export interface NumericContext {
  readonly min: number
  readonly max: number
  readonly step: number
  readonly leap: number
  readonly wrap: boolean

  /** Snap value to nearest step, clamped to [min, max]. */
  snap: (value: number) => number
  /** Value → 0–100 percentage. */
  fromValue: (value: number) => number
  /** 0–100 percentage → snapped value. */
  fromPercent: (percent: number) => number
  /** Increment by step × multiplier. */
  up: (value: number, multiplier?: number) => number
  /** Decrement by step × multiplier. */
  down: (value: number, multiplier?: number) => number
  /** Return min value. */
  floor: () => number
  /** Return max value. */
  ceil: () => number
  /** Whether value can increment (false at max unless wrap). */
  canUp: (value: number) => boolean
  /** Whether value can decrement (false at min unless wrap). */
  canDown: (value: number) => boolean
}

/**
 * Creates a pure numeric math context.
 *
 * @param options Numeric configuration.
 * @returns Numeric context with snap, step, and percentage functions.
 *
 * @example
 * ```ts
 * import { createNumeric } from '@vuetify/v0'
 *
 * const numeric = createNumeric({ min: 0, max: 100, step: 5 })
 * numeric.snap(47)    // 45
 * numeric.up(50)      // 55
 * numeric.down(50)    // 45
 * numeric.floor()     // 0
 * numeric.ceil()      // 100
 * ```
 */
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
    if (step <= 0) return clamp(value, min, max)
    const clamped = clamp(value, min, max)
    const steps = Math.round((clamped - min) / step)
    const result = min + steps * step
    return clamp(decimals > 0 ? +result.toFixed(decimals) : result, min, max)
  }

  function fromValue (value: number): number {
    if (extent === 0) return 0
    return ((value - min) / extent) * 100
  }

  function fromPercent (percent: number): number {
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
    min,
    max,
    step,
    leap,
    wrap,
    snap,
    fromValue,
    fromPercent,
    up,
    down,
    floor,
    ceil,
    canUp,
    canDown,
  }
}
```

- [ ] **Step 2: Add barrel export**

Add to `packages/0/src/composables/index.ts` (alphabetical, after `createModel`):

```ts
export * from './createNumeric'
```

- [ ] **Step 3: Run tests**

Run: `pnpm vitest run packages/0/src/composables/createNumeric/index.test.ts`
Expected: ALL PASS

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/0/src/composables/createNumeric/index.ts packages/0/src/composables/index.ts
git commit -m "feat(createNumeric): add pure numeric math primitive"
```

---

### Task 3: Refactor createSlider to use createNumeric

**Files:**
- Modify: `packages/0/src/composables/createSlider/index.ts`

- [ ] **Step 1: Import createNumeric and delegate math**

In `packages/0/src/composables/createSlider/index.ts`, replace the inline `decimalPlaces` function and inline math with createNumeric delegation.

Changes:
1. Add import: `import { createNumeric } from '#v0/composables/createNumeric'`
2. Remove the local `decimalPlaces` function (lines 28-32)
3. Inside `createSlider()`, after destructuring options, create a numeric context:

```ts
const numeric = createNumeric({ min, max, step })
```

4. Replace the inline `snap` function body:

```ts
function snap (value: number): number {
  return numeric.snap(value)
}
```

5. Replace `fromValue` — note it must still respect `inverted` which is slider-specific:

```ts
function fromValue (value: number): number {
  const p = numeric.fromValue(value)
  return inverted.value ? 100 - p : p
}
```

6. Replace `fromPercent`:

```ts
function fromPercent (p: number): number {
  const adjusted = inverted.value ? 100 - p : p
  return numeric.fromPercent(adjusted)
}
```

7. Remove the local `extent` and `decimals` variables (now owned by createNumeric).

- [ ] **Step 2: Run existing slider tests**

Run: `pnpm vitest run packages/0/src/composables/createSlider/index.test.ts`
Expected: ALL PASS — behavior unchanged

- [ ] **Step 3: Run full test suite**

Run: `pnpm test:run`
Expected: ALL PASS

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/0/src/composables/createSlider/index.ts
git commit -m "refactor(createSlider): delegate math to createNumeric"
```

---

### Task 4: createInput — tests

**Files:**
- Create: `packages/0/src/composables/createInput/index.test.ts`

- [ ] **Step 1: Write tests for createInput**

```ts
import { describe, expect, it, vi } from 'vitest'
import { inject, nextTick, ref, shallowRef } from 'vue'

import { createInput } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return { ...actual, provide: vi.fn(), inject: vi.fn() }
})

describe('createInput', () => {
  describe('field state', () => {
    it('exposes value ref', () => {
      const value = ref('hello')
      const input = createInput({ value })
      expect(input.value.value).toBe('hello')
    })

    it('generates ARIA IDs', () => {
      const input = createInput({ value: ref(''), id: 'email' })
      expect(input.descriptionId).toBe('email-description')
      expect(input.errorId).toBe('email-error')
    })

    it('tracks disabled state', () => {
      const disabled = shallowRef(false)
      const input = createInput({ value: ref(''), disabled })
      expect(input.isDisabled.value).toBe(false)
      disabled.value = true
      expect(input.isDisabled.value).toBe(true)
    })

    it('tracks readonly state', () => {
      const readonly = shallowRef(false)
      const input = createInput({ value: ref(''), readonly })
      expect(input.isReadonly.value).toBe(false)
      readonly.value = true
      expect(input.isReadonly.value).toBe(true)
    })

    it('tracks focused state', () => {
      const input = createInput({ value: ref('') })
      expect(input.isFocused.value).toBe(false)
      input.isFocused.value = true
      expect(input.isFocused.value).toBe(true)
    })

    it('tracks touched state', () => {
      const input = createInput({ value: ref('') })
      expect(input.isTouched.value).toBe(false)
      input.isTouched.value = true
      expect(input.isTouched.value).toBe(true)
    })
  })

  describe('dirty', () => {
    it('uses default dirty check for strings', () => {
      const value = ref('')
      const input = createInput({ value })
      expect(input.isDirty.value).toBe(false)
      value.value = 'hello'
      expect(input.isDirty.value).toBe(true)
    })

    it('uses custom dirty predicate', () => {
      const value = ref<number | null>(null)
      const input = createInput({
        value,
        dirty: v => v !== null,
      })
      expect(input.isDirty.value).toBe(false)
      value.value = 42
      expect(input.isDirty.value).toBe(true)
    })
  })

  describe('pristine', () => {
    it('starts pristine', () => {
      const input = createInput({ value: ref('initial') })
      expect(input.isPristine.value).toBe(true)
    })

    it('becomes not pristine when value changes', () => {
      const value = ref('initial')
      const input = createInput({ value })
      value.value = 'changed'
      expect(input.isPristine.value).toBe(false)
    })

    it('becomes pristine again if value returns to initial', () => {
      const value = ref('initial')
      const input = createInput({ value })
      value.value = 'changed'
      expect(input.isPristine.value).toBe(false)
      value.value = 'initial'
      expect(input.isPristine.value).toBe(true)
    })

    it('uses custom equals for pristine check', () => {
      const value = ref<number | null>(null)
      const input = createInput({
        value,
        equals: (a, b) => Object.is(a, b),
      })
      expect(input.isPristine.value).toBe(true)
      value.value = 0
      expect(input.isPristine.value).toBe(false)
    })
  })

  describe('validation', () => {
    it('starts unvalidated (null)', () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
      })
      expect(input.isValid.value).toBeNull()
    })

    it('validates to false with errors', async () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
      })
      const result = await input.validate()
      expect(result).toBe(false)
      expect(input.errors.value).toContain('Required')
      expect(input.isValid.value).toBe(false)
    })

    it('validates to true when passing', async () => {
      const input = createInput({
        value: ref('hello'),
        rules: [v => !!v || 'Required'],
      })
      const result = await input.validate()
      expect(result).toBe(true)
      expect(input.errors.value).toEqual([])
      expect(input.isValid.value).toBe(true)
    })

    it('merges manual error messages', async () => {
      const input = createInput({
        value: ref('hello'),
        errorMessages: 'Server error',
      })
      expect(input.errors.value).toContain('Server error')
    })

    it('error prop forces invalid', () => {
      const input = createInput({
        value: ref('hello'),
        error: true,
      })
      expect(input.isValid.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('resets value to initial', async () => {
      const value = ref('initial')
      const input = createInput({ value, rules: [v => !!v || 'Required'] })
      value.value = 'changed'
      await input.validate()
      input.reset()
      await nextTick()
      expect(value.value).toBe('initial')
      expect(input.isPristine.value).toBe(true)
      expect(input.isTouched.value).toBe(false)
      expect(input.isValid.value).toBeNull()
    })
  })

  describe('state', () => {
    it('returns pristine when unvalidated', () => {
      const input = createInput({ value: ref('') })
      expect(input.state.value).toBe('pristine')
    })

    it('returns valid after passing validation', async () => {
      const input = createInput({
        value: ref('hello'),
        rules: [v => !!v || 'Required'],
      })
      await input.validate()
      expect(input.state.value).toBe('valid')
    })

    it('returns invalid after failing validation', async () => {
      const input = createInput({
        value: ref(''),
        rules: [v => !!v || 'Required'],
      })
      await input.validate()
      expect(input.state.value).toBe('invalid')
    })
  })

  describe('generic types', () => {
    it('works with number | null', () => {
      const value = ref<number | null>(null)
      const input = createInput({
        value,
        dirty: v => v !== null,
      })
      expect(input.value.value).toBeNull()
      value.value = 42
      expect(input.isDirty.value).toBe(true)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/0/src/composables/createInput/index.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Commit test file**

```bash
git add packages/0/src/composables/createInput/index.test.ts
git commit -m "test(createInput): add tests for shared form field primitive"
```

---

### Task 5: createInput — implementation

**Files:**
- Create: `packages/0/src/composables/createInput/index.ts`
- Modify: `packages/0/src/composables/index.ts`

- [ ] **Step 1: Implement createInput**

```ts
/**
 * @module createInput
 *
 * @remarks
 * Shared form field primitive. Owns validation, field state, and ARIA IDs.
 * Extracted from InputRoot.vue — consumed by Input, NumberField, Select, Combobox.
 *
 * No event handling — composables never bind DOM events. Components call
 * validate() and write isFocused/isTouched when they choose.
 */

// Composables
import { createValidation } from '#v0/composables/createValidation'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Utilities
import { isNull } from '#v0/utilities'
import { computed, nextTick, shallowRef, toRef, toValue, useId } from 'vue'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'
import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
import type { ID, MaybeArray } from '#v0/types'
import type { MaybeRefOrGetter, Readonly, Ref, ShallowRef } from 'vue'

/** Visual state of the input for styling purposes. */
export type InputState = 'pristine' | 'valid' | 'invalid'

export interface InputOptions<T = string> {
  /** Value source — caller owns this ref. */
  value: Ref<T>
  /** Unique identifier (auto-generated if omitted). */
  id?: ID
  /** Display label. */
  label?: string
  /** Form field name. */
  name?: string
  /** Associate with form by ID. */
  form?: string
  /** Whether required. */
  required?: boolean
  /** Disabled state. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Readonly state. */
  readonly?: MaybeRefOrGetter<boolean>
  /** Validation rules. */
  rules?: (FormValidationRule | RuleAlias | StandardSchemaV1)[]
  /** Manual error state override — forces invalid. */
  error?: MaybeRefOrGetter<boolean>
  /** Manual error messages — merged with rule-based errors. */
  errorMessages?: MaybeRefOrGetter<MaybeArray<string> | undefined>
  /** Predicate for "has content". @default (string) v => v.length > 0 */
  dirty?: (value: T) => boolean
  /** Equality check for pristine tracking. @default === */
  equals?: (a: T, b: T) => boolean
}

export interface InputContext<T = string> {
  readonly id: ID
  readonly label?: string
  readonly name?: string
  readonly form?: string
  readonly required?: boolean

  // ARIA IDs
  readonly descriptionId: string
  readonly errorId: string
  hasDescription: ShallowRef<boolean>
  hasError: ShallowRef<boolean>

  // Value
  value: Ref<T>

  // Field state
  isDirty: Readonly<Ref<boolean>>
  isFocused: ShallowRef<boolean>
  isDisabled: Readonly<Ref<boolean>>
  isReadonly: Readonly<Ref<boolean>>
  isPristine: Readonly<Ref<boolean>>
  isTouched: ShallowRef<boolean>

  // Validation
  errors: Readonly<Ref<string[]>>
  isValid: Readonly<Ref<boolean | null>>
  isValidating: Readonly<Ref<boolean>>
  validate: () => Promise<boolean>
  reset: () => void

  // Derived
  state: Readonly<Ref<InputState>>
}

/**
 * Creates a shared form field context.
 *
 * @param options Input configuration.
 * @returns Input context with validation, field state, and ARIA IDs.
 *
 * @example
 * ```ts
 * import { createInput } from '@vuetify/v0'
 * import { ref } from 'vue'
 *
 * const value = ref('')
 * const input = createInput({ value, rules: [v => !!v || 'Required'] })
 * await input.validate()
 * ```
 */
export function createInput<T = string> (options: InputOptions<T>): InputContext<T> {
  const {
    value,
    id = useId()!,
    label,
    name,
    form,
    required,
    disabled = false,
    readonly: readonlyProp = false,
    rules = [],
    error = false,
    errorMessages,
    dirty: dirtyFn,
    equals = (a: T, b: T) => a === b,
  } = options

  const validation = createValidation({ rules, value })

  const initialValue = value.value
  const isFocused = shallowRef(false)
  const isTouched = shallowRef(false)
  const hasDescription = shallowRef(false)
  const hasError = shallowRef(false)

  const isDisabled = toRef(() => toValue(disabled))
  const isReadonly = toRef(() => toValue(readonlyProp))
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  const isDirty = toRef(() => {
    if (dirtyFn) return dirtyFn(value.value)
    // Default: non-empty string check for string values
    return typeof value.value === 'string' ? value.value.length > 0 : value.value != null
  })

  const isPristine = toRef(() => equals(value.value, initialValue))

  const errors = computed(() => {
    const manual = toValue(errorMessages)
    const manualArr = manual ? toArray(manual) : []
    return [...manualArr, ...validation.errors.value]
  })

  const isValid = toRef((): boolean | null => {
    if (toValue(error)) return false
    if (errors.value.length > 0 && validation.errors.value.length === 0) return false
    return validation.isValid.value
  })

  const state = toRef((): InputState => {
    if (isValid.value === false) return 'invalid'
    if (isValid.value === true) return 'valid'
    return 'pristine'
  })

  function validate () {
    return validation.validate()
  }

  function reset () {
    value.value = initialValue
    isTouched.value = false
    validation.reset()
  }

  return {
    id,
    label,
    name,
    form,
    required,
    descriptionId,
    errorId,
    hasDescription,
    hasError,
    value,
    isDirty,
    isFocused,
    isDisabled,
    isReadonly,
    isPristine,
    isTouched,
    errors,
    isValid,
    isValidating: validation.isValidating,
    validate,
    reset,
    state,
  }
}
```

- [ ] **Step 2: Add barrel export**

Add to `packages/0/src/composables/index.ts` (alphabetical, after `createGroup`):

```ts
export * from './createInput'
```

- [ ] **Step 3: Run tests**

Run: `pnpm vitest run packages/0/src/composables/createInput/index.test.ts`
Expected: ALL PASS

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/0/src/composables/createInput/index.ts packages/0/src/composables/index.ts
git commit -m "feat(createInput): add shared form field primitive"
```

---

### Task 6: Refactor InputRoot to use createInput

**Files:**
- Modify: `packages/0/src/components/Input/InputRoot.vue`

- [ ] **Step 1: Refactor InputRoot to compose createInput**

Replace the inline validation/field state logic in InputRoot.vue with createInput. The component keeps:
- `defineProps`, `defineModel`, `defineEmits`, `defineSlots`
- `provideInputRoot(namespace, context)`
- `slotProps` computation
- Template rendering
- `validateOn` parsing and the `watch` triggers (event policy stays in component)

The component delegates to createInput:
- All validation setup (createValidation)
- Field state (isDirty, isPristine, isFocused, isDisabled, isReadonly)
- ARIA IDs (descriptionId, errorId)
- errors, isValid, isValidating
- validate(), reset()

Key changes in `<script setup>`:

```ts
import { createInput } from '#v0/composables/createInput'

// Replace lines 206-268 (validation setup, watchers, etc.) with:
const input = createInput({
  value: model,
  id,
  label,
  name,
  form,
  required,
  disabled,
  readonly: _readonly,
  rules,
  error,
  errorMessages,
})

// Keep validateOn parsing and watch triggers
const parsed = toRef(() => parseValidateOn(validateOn))

function shouldValidate (trigger: ValidateEvent): boolean {
  const { event, modifier } = parsed.value
  if (event === 'submit') return false
  if (modifier === 'lazy' && !input.isTouched.value) return false
  if (modifier === 'eager' && input.isValid.value === false) return true
  return trigger === event
}

watch(input.isFocused, val => {
  if (val) return
  input.isTouched.value = true
  if (shouldValidate('blur')) input.validate()
})

watch(model, () => {
  if (shouldValidate('input')) input.validate()
})

// Provide the input context as the root context
// Map InputRootContext shape from InputContext
const context: InputRootContext = {
  id: input.id,
  label,
  name,
  type,
  form,
  required,
  descriptionId: input.descriptionId,
  errorId: input.errorId,
  hasDescription: input.hasDescription,
  hasError: input.hasError,
  value: model,
  isDirty: input.isDirty,
  isFocused: input.isFocused,
  isDisabled: input.isDisabled,
  isReadonly: input.isReadonly,
  errors: input.errors,
  isValid: input.isValid,
  isPristine: input.isPristine,
  isValidating: input.isValidating,
  validate: input.validate,
  reset: input.reset,
}
```

Note: `InputRootContext` still has `type` which is Input-specific. That's fine — it stays on the component's context, not on createInput.

- [ ] **Step 2: Run existing Input tests**

Run: `pnpm vitest run packages/0/src/components/Input/index.test.ts`
Expected: ALL PASS — behavior unchanged

- [ ] **Step 3: Run full test suite**

Run: `pnpm test:run`
Expected: ALL PASS

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/0/src/components/Input/InputRoot.vue
git commit -m "refactor(Input): delegate field state to createInput"
```

---

### Task 7: PR1 maturity.json + final verification

**Files:**
- Modify: `packages/0/src/maturity.json`

- [ ] **Step 1: Add maturity entries for new composables**

Add to the `"composables"` section in `packages/0/src/maturity.json`:

```json
"createInput": {
  "level": "preview",
  "since": "0.2.0",
  "category": "forms"
},
"createNumeric": {
  "level": "preview",
  "since": "0.2.0",
  "category": "forms"
},
```

- [ ] **Step 2: Run full verification**

```bash
pnpm lint:fix && pnpm typecheck && pnpm test:run
```

Expected: ALL PASS

- [ ] **Step 3: Commit**

```bash
git add packages/0/src/maturity.json
git commit -m "chore: add createInput and createNumeric to maturity.json"
```

- [ ] **Step 4: Verify PR1 is complete**

Checklist:
- [ ] createNumeric composable with tests
- [ ] createInput composable with tests
- [ ] createSlider refactored to use createNumeric
- [ ] InputRoot refactored to use createInput
- [ ] All existing tests pass unchanged
- [ ] Barrel exports added
- [ ] maturity.json updated
- [ ] Build succeeds: `pnpm build:0`

---

## PR2: NumberField Feature

### Task 8: createNumberField — tests

**Files:**
- Create: `packages/0/src/composables/createNumberField/index.test.ts`

- [ ] **Step 1: Write tests for createNumberField**

```ts
import { describe, expect, it, vi } from 'vitest'
import { inject, ref } from 'vue'

import { createNumberField } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return { ...actual, provide: vi.fn(), inject: vi.fn() }
})

describe('createNumberField', () => {
  describe('value', () => {
    it('accepts initial value', () => {
      const value = ref<number | null>(42)
      const field = createNumberField({ value })
      expect(field.value.value).toBe(42)
    })

    it('defaults to null', () => {
      const field = createNumberField()
      expect(field.value.value).toBeNull()
    })
  })

  describe('increment / decrement', () => {
    it('increments by step', () => {
      const value = ref<number | null>(10)
      const field = createNumberField({ value, min: 0, max: 100, step: 5 })
      field.increment()
      expect(value.value).toBe(15)
    })

    it('decrements by step', () => {
      const value = ref<number | null>(10)
      const field = createNumberField({ value, min: 0, max: 100, step: 5 })
      field.decrement()
      expect(value.value).toBe(5)
    })

    it('supports multiplier', () => {
      const value = ref<number | null>(50)
      const field = createNumberField({ value, min: 0, max: 100, step: 1 })
      field.increment(10)
      expect(value.value).toBe(60)
    })

    it('clamps at max', () => {
      const value = ref<number | null>(95)
      const field = createNumberField({ value, min: 0, max: 100, step: 10 })
      field.increment()
      expect(value.value).toBe(100)
    })

    it('clamps at min', () => {
      const value = ref<number | null>(5)
      const field = createNumberField({ value, min: 0, max: 100, step: 10 })
      field.decrement()
      expect(value.value).toBe(0)
    })

    it('no-ops when disabled', () => {
      const value = ref<number | null>(50)
      const field = createNumberField({ value, disabled: true })
      field.increment()
      expect(value.value).toBe(50)
    })

    it('no-ops when readonly', () => {
      const value = ref<number | null>(50)
      const field = createNumberField({ value, readonly: true })
      field.increment()
      expect(value.value).toBe(50)
    })

    it('initializes from null to clamped 0', () => {
      const value = ref<number | null>(null)
      const field = createNumberField({ value, min: 0, max: 100 })
      field.increment()
      expect(value.value).toBe(1)
    })
  })

  describe('canIncrement / canDecrement', () => {
    it('false at max', () => {
      const value = ref<number | null>(100)
      const field = createNumberField({ value, min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(false)
      expect(field.canDecrement.value).toBe(true)
    })

    it('false at min', () => {
      const value = ref<number | null>(0)
      const field = createNumberField({ value, min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(true)
      expect(field.canDecrement.value).toBe(false)
    })

    it('both true for null', () => {
      const value = ref<number | null>(null)
      const field = createNumberField({ value, min: 0, max: 100 })
      expect(field.canIncrement.value).toBe(true)
      expect(field.canDecrement.value).toBe(true)
    })
  })

  describe('floor / ceil', () => {
    it('sets to min', () => {
      const value = ref<number | null>(50)
      const field = createNumberField({ value, min: 10, max: 90 })
      field.floor()
      expect(value.value).toBe(10)
    })

    it('sets to max', () => {
      const value = ref<number | null>(50)
      const field = createNumberField({ value, min: 10, max: 90 })
      field.ceil()
      expect(value.value).toBe(90)
    })
  })

  describe('format / parse', () => {
    it('formats with default (no options)', () => {
      const field = createNumberField()
      expect(field.formatValue(1234)).toBe('1234')
    })

    it('formats currency', () => {
      const field = createNumberField({
        format: { style: 'currency', currency: 'USD' },
        locale: 'en-US',
      })
      expect(field.formatValue(42)).toBe('$42.00')
    })

    it('parses numeric string', () => {
      const field = createNumberField({ locale: 'en-US' })
      expect(field.parse('1234')).toBe(1234)
      expect(field.parse('12.5')).toBe(12.5)
    })

    it('parses empty string to null', () => {
      const field = createNumberField()
      expect(field.parse('')).toBeNull()
    })

    it('parses invalid string to null', () => {
      const field = createNumberField()
      expect(field.parse('abc')).toBeNull()
    })
  })

  describe('commit', () => {
    it('snaps and clamps value', () => {
      const value = ref<number | null>(null)
      const field = createNumberField({ value, min: 0, max: 100, step: 5 })
      value.value = 47
      field.commit()
      expect(value.value).toBe(45)
    })

    it('clamps to bounds when clamp is true', () => {
      const value = ref<number | null>(150)
      const field = createNumberField({ value, min: 0, max: 100, clamp: true })
      field.commit()
      expect(value.value).toBe(100)
    })

    it('does not clamp when clamp is false', () => {
      const value = ref<number | null>(150)
      const field = createNumberField({ value, min: 0, max: 100, clamp: false })
      field.commit()
      expect(value.value).toBe(150)
    })
  })

  describe('numeric context', () => {
    it('exposes numeric context', () => {
      const field = createNumberField({ min: 10, max: 90, step: 5 })
      expect(field.numeric.min).toBe(10)
      expect(field.numeric.max).toBe(90)
      expect(field.numeric.step).toBe(5)
    })
  })

  describe('input context', () => {
    it('exposes input context', () => {
      const field = createNumberField()
      expect(field.input).toBeDefined()
      expect(field.input.isValid).toBeDefined()
      expect(field.input.validate).toBeInstanceOf(Function)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/0/src/composables/createNumberField/index.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Commit test file**

```bash
git add packages/0/src/composables/createNumberField/index.test.ts
git commit -m "test(createNumberField): add tests for number field composable"
```

---

### Task 9: createNumberField — implementation

**Files:**
- Create: `packages/0/src/composables/createNumberField/index.ts`
- Modify: `packages/0/src/composables/index.ts`

- [ ] **Step 1: Implement createNumberField**

```ts
/**
 * @module createNumberField
 *
 * @remarks
 * Orchestrator composable for numeric input fields.
 * Composes createInput + createNumeric + Intl.NumberFormat.
 *
 * Manages the numeric value, formatting/parsing, and field state.
 * No event handling — components own keyboard, wheel, scrub, and spin behavior.
 */

// Composables
import { createInput } from '#v0/composables/createInput'
import { createNumeric } from '#v0/composables/createNumeric'

// Utilities
import { isNull } from '#v0/utilities'
import { clamp } from '#v0/utilities'
import { ref, toRef, toValue } from 'vue'

// Types
import type { InputContext, InputOptions } from '#v0/composables/createInput'
import type { NumericContext, NumericOptions } from '#v0/composables/createNumeric'
import type { MaybeRefOrGetter, Readonly, Ref } from 'vue'

export interface NumberFieldOptions {
  /** Numeric value. @default ref(null) */
  value?: Ref<number | null>

  // Numeric
  min?: number
  max?: number
  step?: number
  leap?: number
  wrap?: boolean

  // Formatting
  /** Intl.NumberFormatOptions for locale-aware display. */
  format?: Intl.NumberFormatOptions
  /** Locale override (defaults to navigator locale). */
  locale?: string

  // Behavior
  /** Whether commit() clamps to bounds. @default true */
  clamp?: boolean

  // Field state
  disabled?: MaybeRefOrGetter<boolean>
  readonly?: MaybeRefOrGetter<boolean>
}

export interface NumberFieldContext {
  /** The numeric value. */
  value: Ref<number | null>
  /** Formatted display string (reactive, locale-aware). */
  display: Readonly<Ref<string>>
  /** Numeric math context. */
  numeric: NumericContext
  /** Field state context. */
  input: InputContext<number | null>
  /** Whether increment is possible. */
  canIncrement: Readonly<Ref<boolean>>
  /** Whether decrement is possible. */
  canDecrement: Readonly<Ref<boolean>>
  /** Increment by step × multiplier. */
  increment: (multiplier?: number) => void
  /** Decrement by step × multiplier. */
  decrement: (multiplier?: number) => void
  /** Set to min. */
  floor: () => void
  /** Set to max. */
  ceil: () => void
  /** Parse display string → number | null. */
  parse: (text: string) => number | null
  /** Format number → locale display string. */
  formatValue: (value: number) => string
  /** Parse current value, snap, optionally clamp, update value. */
  commit: () => void
}

/**
 * Creates a number field context.
 *
 * @param options Number field configuration.
 * @returns Number field context.
 *
 * @example
 * ```ts
 * import { createNumberField } from '@vuetify/v0'
 * import { ref } from 'vue'
 *
 * const price = ref<number | null>(0)
 * const field = createNumberField({
 *   value: price,
 *   min: 0,
 *   max: 1000,
 *   step: 0.01,
 *   format: { style: 'currency', currency: 'USD' },
 * })
 *
 * field.increment()     // price: 0.01
 * field.formatValue(42) // "$42.00"
 * ```
 */
export function createNumberField (options: NumberFieldOptions = {}): NumberFieldContext {
  const {
    value: valueProp,
    min,
    max,
    step,
    leap,
    wrap,
    format: formatOptions,
    locale,
    clamp: clampOnCommit = true,
    disabled = false,
    readonly: readonlyProp = false,
  } = options

  const value = valueProp ?? ref<number | null>(null)

  const numeric = createNumeric({ min, max, step, leap, wrap })

  const input = createInput<number | null>({
    value,
    disabled,
    readonly: readonlyProp,
    dirty: v => !isNull(v),
    equals: (a, b) => Object.is(a, b),
  })

  const formatter = new Intl.NumberFormat(locale, formatOptions)

  const canIncrement = toRef(() => {
    if (isNull(value.value)) return true
    return numeric.canUp(value.value)
  })

  const canDecrement = toRef(() => {
    if (isNull(value.value)) return true
    return numeric.canDown(value.value)
  })

  const display = toRef(() => {
    if (isNull(value.value)) return ''
    return formatter.format(value.value)
  })

  function increment (multiplier = 1): void {
    if (toValue(disabled) || toValue(readonlyProp)) return
    const current = value.value
    if (isNull(current)) {
      const initial = Number.isFinite(numeric.min) ? numeric.min : 0
      value.value = numeric.snap(initial + numeric.step * multiplier)
      return
    }
    value.value = numeric.up(current, multiplier)
  }

  function decrement (multiplier = 1): void {
    if (toValue(disabled) || toValue(readonlyProp)) return
    const current = value.value
    if (isNull(current)) {
      const initial = Number.isFinite(numeric.max) ? numeric.max : 0
      value.value = numeric.snap(initial - numeric.step * multiplier)
      return
    }
    value.value = numeric.down(current, multiplier)
  }

  function floor (): void {
    if (toValue(disabled) || toValue(readonlyProp)) return
    value.value = numeric.floor()
  }

  function ceil (): void {
    if (toValue(disabled) || toValue(readonlyProp)) return
    value.value = numeric.ceil()
  }

  function parse (text: string): number | null {
    if (!text.trim()) return null
    // Strip locale-specific characters (grouping separators, currency, etc.)
    const parts = formatter.formatToParts(0)
    const groupSep = parts.find(p => p.type === 'group')?.value
    const decimalSep = parts.find(p => p.type === 'decimal')?.value ?? '.'

    let cleaned = text
    // Remove currency symbols, percent signs, unit strings, grouping
    for (const part of parts) {
      if (part.type === 'currency' || part.type === 'percentSign' || part.type === 'unit' || part.type === 'literal') {
        cleaned = cleaned.replaceAll(part.value, '')
      }
    }
    if (groupSep) cleaned = cleaned.replaceAll(groupSep, '')
    if (decimalSep !== '.') cleaned = cleaned.replace(decimalSep, '.')
    cleaned = cleaned.trim()

    const num = Number(cleaned)
    return Number.isNaN(num) ? null : num
  }

  function formatValue (v: number): string {
    return formatter.format(v)
  }

  function commit (): void {
    if (isNull(value.value)) return
    let snapped = numeric.snap(value.value)
    if (clampOnCommit && Number.isFinite(numeric.min) && Number.isFinite(numeric.max)) {
      snapped = clamp(snapped, numeric.min, numeric.max)
    }
    value.value = snapped
  }

  return {
    value,
    display,
    numeric,
    input,
    canIncrement,
    canDecrement,
    increment,
    decrement,
    floor,
    ceil,
    parse,
    formatValue,
    commit,
  }
}
```

- [ ] **Step 2: Add barrel export**

Add to `packages/0/src/composables/index.ts` (after `createNumeric`):

```ts
export * from './createNumberField'
```

- [ ] **Step 3: Run tests**

Run: `pnpm vitest run packages/0/src/composables/createNumberField/index.test.ts`
Expected: ALL PASS

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/0/src/composables/createNumberField/index.ts packages/0/src/composables/index.ts
git commit -m "feat(createNumberField): add number field composable"
```

---

### Task 10: NumberField component — Root + Input

**Files:**
- Create: `packages/0/src/components/NumberField/NumberFieldRoot.vue`
- Create: `packages/0/src/components/NumberField/NumberFieldInput.vue`

- [ ] **Step 1: Create NumberFieldRoot.vue**

The Root creates the context (createNumberField), provides it, and renders an Atom wrapper. It owns spin-on-hold config and validateOn event policy.

Props include all NumberFieldOptions plus component-specific: `validateOn`, `rules`, `error`, `errorMessages`, `spinDelay`, `spinRate`, `wheel`, `namespace`.

Reference `SliderRoot.vue` and `InputRoot.vue` for patterns (defineModel, useProxyModel if needed, provideContext).

The Root:
1. Calls `createNumberField(...)` with props
2. Passes rules/validateOn/error/errorMessages to the internal `input` context
3. Sets up `watch(input.isFocused)` for validateOn blur
4. Provides `NumberFieldRootContext` via `createContext`
5. Renders `<Atom>` with data-state attrs and slot props

- [ ] **Step 2: Create NumberFieldInput.vue**

The Input renders `<input>` with:
- `role="spinbutton"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- `inputmode="decimal"`, `type="text"`
- Keyboard handler: ArrowUp/Down (increment/decrement), PageUp/Down (leap), Home/End (floor/ceil), Shift+Arrow (×10), Enter (commit)
- Focus/blur handlers setting `input.isFocused`
- Input handler for text editing
- Optional wheel handler (prop `wheel`)

Reference `InputControl.vue` for the ARIA binding pattern and `SliderThumb.vue` for keyboard handling.

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add packages/0/src/components/NumberField/NumberFieldRoot.vue packages/0/src/components/NumberField/NumberFieldInput.vue
git commit -m "feat(NumberField): add Root and Input components"
```

---

### Task 11: NumberField component — Increment, Decrement, Scrub

**Files:**
- Create: `packages/0/src/components/NumberField/NumberFieldIncrement.vue`
- Create: `packages/0/src/components/NumberField/NumberFieldDecrement.vue`
- Create: `packages/0/src/components/NumberField/NumberFieldScrub.vue`

- [ ] **Step 1: Create NumberFieldIncrement.vue**

Button that calls `context.increment()`. Disables when `canIncrement` is false. Implements spin-on-hold via pointer events with `spinDelay`/`spinRate` from Root context.

ARIA: `aria-label="Increment"`, `tabindex="0"`, `aria-disabled` when at max.

- [ ] **Step 2: Create NumberFieldDecrement.vue**

Mirror of Increment, calls `context.decrement()`, disables when `canDecrement` is false.

- [ ] **Step 3: Create NumberFieldScrub.vue**

Click-and-drag to adjust value via Pointer Lock API. Props: `sensitivity` (pixels per step, default 1).

On `pointerdown`: request pointer lock. On `pointermove` (locked): accumulate `movementX`, call `increment`/`decrement` based on accumulated pixels ÷ sensitivity. On `pointerup`: release lock.

Shows scrub cursor (`cursor: ew-resize`) on hover. Renders as `<label>` by default via Atom `as` prop.

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/0/src/components/NumberField/NumberFieldIncrement.vue packages/0/src/components/NumberField/NumberFieldDecrement.vue packages/0/src/components/NumberField/NumberFieldScrub.vue
git commit -m "feat(NumberField): add Increment, Decrement, and Scrub components"
```

---

### Task 12: NumberField component — Description, Error, barrel export

**Files:**
- Create: `packages/0/src/components/NumberField/NumberFieldDescription.vue`
- Create: `packages/0/src/components/NumberField/NumberFieldError.vue`
- Create: `packages/0/src/components/NumberField/index.ts`
- Modify: `packages/0/src/components/index.ts`

- [ ] **Step 1: Create NumberFieldDescription.vue**

Nearly identical to `InputDescription.vue`. Uses `useNumberFieldRoot` instead of `useInputRoot`. Sets `hasDescription` on mount/unmount.

- [ ] **Step 2: Create NumberFieldError.vue**

Nearly identical to `InputError.vue`. Uses `useNumberFieldRoot` instead of `useInputRoot`. Sets `hasError` on mount/unmount.

- [ ] **Step 3: Create index.ts barrel export**

Follow the pattern in `packages/0/src/components/Slider/index.ts`:

```ts
export { default as NumberFieldRoot } from './NumberFieldRoot.vue'
export { provideNumberFieldRoot, useNumberFieldRoot } from './NumberFieldRoot.vue'
export { default as NumberFieldInput } from './NumberFieldInput.vue'
export { default as NumberFieldIncrement } from './NumberFieldIncrement.vue'
export { default as NumberFieldDecrement } from './NumberFieldDecrement.vue'
export { default as NumberFieldScrub } from './NumberFieldScrub.vue'
export { default as NumberFieldDescription } from './NumberFieldDescription.vue'
export { default as NumberFieldError } from './NumberFieldError.vue'

// Types
export type { NumberFieldRootProps, NumberFieldRootSlotProps, NumberFieldRootContext } from './NumberFieldRoot.vue'
export type { NumberFieldInputProps, NumberFieldInputSlotProps } from './NumberFieldInput.vue'
export type { NumberFieldIncrementProps } from './NumberFieldIncrement.vue'
export type { NumberFieldDecrementProps } from './NumberFieldDecrement.vue'
export type { NumberFieldScrubProps } from './NumberFieldScrub.vue'
export type { NumberFieldDescriptionProps, NumberFieldDescriptionSlotProps } from './NumberFieldDescription.vue'
export type { NumberFieldErrorProps, NumberFieldErrorSlotProps } from './NumberFieldError.vue'

import Decrement from './NumberFieldDecrement.vue'
import Description from './NumberFieldDescription.vue'
import Error from './NumberFieldError.vue'
import Increment from './NumberFieldIncrement.vue'
import Input from './NumberFieldInput.vue'
import Root from './NumberFieldRoot.vue'
import Scrub from './NumberFieldScrub.vue'

/**
 * NumberField component with sub-components for numeric input controls.
 *
 * @see https://0.vuetifyjs.com/components/forms/number-field
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { NumberField } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const quantity = ref<number | null>(0)
 * </script>
 *
 * <template>
 *   <NumberField.Root v-model="quantity" :min="0" :max="99">
 *     <NumberField.Decrement>−</NumberField.Decrement>
 *     <NumberField.Input />
 *     <NumberField.Increment>+</NumberField.Increment>
 *   </NumberField.Root>
 * </template>
 * ```
 */
export const NumberField = {
  Root,
  Input,
  Increment,
  Decrement,
  Scrub,
  Description,
  Error,
}
```

- [ ] **Step 4: Add component barrel export**

Add to `packages/0/src/components/index.ts` (alphabetical, after `Locale`):

```ts
export * from './NumberField'
```

- [ ] **Step 5: Typecheck and lint**

```bash
pnpm lint:fix && pnpm typecheck
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/0/src/components/NumberField/ packages/0/src/components/index.ts
git commit -m "feat(NumberField): add Description, Error, and barrel export"
```

---

### Task 13: Maturity, README, checklist items

**Files:**
- Modify: `packages/0/src/maturity.json`
- Modify: `packages/0/README.md`
- Modify: `README.md` (root)

- [ ] **Step 1: Update maturity.json**

Add to `"composables"`:

```json
"createNumberField": {
  "level": "preview",
  "since": "0.2.0",
  "category": "forms"
},
```

Add to `"components"`:

```json
"NumberField": {
  "level": "preview",
  "since": "0.2.0",
  "category": "forms"
},
```

- [ ] **Step 2: Update package README**

In `packages/0/README.md`, add to the Forms component table:

```markdown
| **NumberField** | Numeric input with increment/decrement, scrub, and Intl formatting |
```

Add to the Forms composable list:

```markdown
- **`createNumberField`** - Numeric input state with formatting, stepping, and validation
- **`createNumeric`** - Pure numeric math: clamp, snap, step, and percentage conversion
- **`createInput`** - Shared form field state: validation, dirty/pristine, ARIA IDs
```

- [ ] **Step 3: Sync root README**

Keep root `README.md` in sync with the changes made to `packages/0/README.md`.

- [ ] **Step 4: Commit**

```bash
git add packages/0/src/maturity.json packages/0/README.md README.md
git commit -m "docs: add NumberField to maturity.json and READMEs"
```

---

### Task 14: Documentation page + examples

**Files:**
- Create: `apps/docs/src/pages/components/forms/number-field.md`
- Create: `apps/docs/src/examples/components/number-field/basic.vue`
- Create: `apps/docs/src/examples/components/number-field/currency.vue`
- Create: `apps/docs/src/examples/components/number-field/scrub.vue`
- Modify: `apps/docs/src/pages/components/index.md` (add table entry)
- Create: `apps/docs/src/pages/composables/forms/create-number-field.md`
- Create: `apps/docs/src/pages/composables/forms/create-numeric.md`
- Create: `apps/docs/src/pages/composables/forms/create-input.md`
- Create: `apps/docs/src/examples/composables/create-number-field/basic.vue`

- [ ] **Step 1: Create component docs page**

`apps/docs/src/pages/components/forms/number-field.md` with frontmatter:

```yaml
---
title: NumberField - Numeric Input with Formatting
meta:
  - name: description
    content: Headless numeric input with increment/decrement controls, locale-aware formatting, drag-to-scrub, and WAI-ARIA spinbutton compliance.
  - name: keywords
    content: number field, number input, stepper, spinbutton, increment, decrement, scrub, currency, vuetify, headless
features:
  category: Component
  label: 'C: NumberField'
  github: /components/NumberField/
  renderless: false
  level: 2
related:
  - /composables/forms/create-number-field
  - /composables/forms/create-numeric
  - /components/forms/slider
  - /components/forms/input
---
```

Follow the component page structure from `.claude/rules/docs.md`: Usage, Anatomy, Examples (basic, currency, scrub), Accessibility, FAQ, DocsApi.

- [ ] **Step 2: Create basic example**

`apps/docs/src/examples/components/number-field/basic.vue`:

```vue
<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
  import { ref } from 'vue'

  const quantity = ref<number | null>(1)
</script>

<template>
  <NumberField.Root v-model="quantity" :min="0" :max="99">
    <NumberField.Decrement
      class="px-3 py-2 border rounded-l-lg"
      :class="{ 'opacity-50 cursor-not-allowed': false }"
    >
      −
    </NumberField.Decrement>

    <NumberField.Input class="w-20 text-center border-y py-2 outline-none" />

    <NumberField.Increment
      class="px-3 py-2 border rounded-r-lg"
    >
      +
    </NumberField.Increment>
  </NumberField.Root>
</template>
```

- [ ] **Step 3: Create currency example**

`apps/docs/src/examples/components/number-field/currency.vue` — demonstrate `format` with currency, Scrub label, Description, Error.

- [ ] **Step 4: Create scrub example**

`apps/docs/src/examples/components/number-field/scrub.vue` — demonstrate drag-to-adjust with a design-tool style numeric input.

- [ ] **Step 5: Create composable docs pages**

Create docs pages for createNumberField, createNumeric, and createInput following composable page structure from `.claude/rules/docs.md`.

- [ ] **Step 6: Update component index page**

Add NumberField to the Forms table in `apps/docs/src/pages/components/index.md`.

- [ ] **Step 7: Build docs to verify**

```bash
pnpm build:docs
```

Expected: PASS — all pages render, examples work

- [ ] **Step 8: Commit**

```bash
git add apps/docs/src/pages/components/forms/number-field.md apps/docs/src/examples/components/number-field/ apps/docs/src/pages/composables/forms/create-number-field.md apps/docs/src/pages/composables/forms/create-numeric.md apps/docs/src/pages/composables/forms/create-input.md apps/docs/src/examples/composables/create-number-field/ apps/docs/src/pages/components/index.md
git commit -m "docs(NumberField): add component and composable documentation"
```

---

### Task 15: Final verification

- [ ] **Step 1: Full build and test suite**

```bash
pnpm build:0 && pnpm lint:fix && pnpm typecheck && pnpm test:run
```

Expected: ALL PASS

- [ ] **Step 2: Build docs**

```bash
pnpm build:docs
```

Expected: PASS

- [ ] **Step 3: PR2 checklist verification**

- [ ] createNumberField composable with tests
- [ ] NumberField component (Root, Input, Increment, Decrement, Scrub, Description, Error)
- [ ] maturity.json entries (composable + component)
- [ ] Barrel exports (composables/index.ts + components/index.ts)
- [ ] Docs page with examples (basic, currency, scrub)
- [ ] Composable docs pages (createNumberField, createNumeric, createInput)
- [ ] Component index page updated
- [ ] README updates (package + root)
- [ ] All tests pass
- [ ] Build succeeds
