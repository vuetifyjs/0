# NumberField Component Design

## Overview

Headless numeric input with increment/decrement controls, locale-aware formatting, drag-to-scrub interaction, and full WAI-ARIA spinbutton compliance. Ships as two PRs: foundation primitives (createNumeric + createInput), then the feature (createNumberField + NumberField component).

## Architecture

```
createInput<T>          — validation, field state, form integration
createNumeric           — clamp, snap, step, up/down, floor/ceil
createNumberField       — composes createInput<number|null> + createNumeric + Intl.NumberFormat

NumberField component   — compound: Root, Input, Increment, Decrement, Scrub, Description, Error
```

### Inheritance / Composition

```
createInput<number | null>
  + createNumeric
  + Intl.NumberFormat (parse/format)
  = createNumberField
```

Other consumers of these primitives:

| Primitive | Consumers |
|-----------|-----------|
| `createNumeric` | createSlider (refactor), createNumberField, createRating, createPagination, createProgress, DatePicker, TimePicker, Carousel |
| `createInput` | Input.Root (refactor), NumberField.Root, Select.Root (future), Combobox (future), Textarea (future), DatePicker (future) |

---

## createNumeric

Pure numeric math. No reactivity, no registry, no DOM events.

### Options

```ts
interface NumericOptions {
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
```

### Context

```ts
interface NumericContext {
  readonly min: number
  readonly max: number
  readonly step: number
  readonly leap: number
  readonly wrap: boolean

  /** Snap value to nearest step, clamped to [min, max] */
  snap: (value: number) => number
  /** Value → 0–100 percentage */
  fromValue: (value: number) => number
  /** 0–100 percentage → snapped value */
  fromPercent: (percent: number) => number
  /** Increment by step × multiplier */
  up: (value: number, multiplier?: number) => number
  /** Decrement by step × multiplier */
  down: (value: number, multiplier?: number) => number
  /** Return min value */
  floor: () => number
  /** Return max value */
  ceil: () => number
  /** Whether value can increment (false at max unless wrap) */
  canUp: (value: number) => boolean
  /** Whether value can decrement (false at min unless wrap) */
  canDown: (value: number) => boolean
}
```

### Design decisions

- **Pure functions** — `up(value)` returns a new number, does not mutate state. Slider currently mutates a thumb ref; after refactor it calls `numeric.up()` then writes the result.
- **Floating-point correction** — `snap()` uses `toFixed(decimals)` where decimals = `max(decimalPlaces(step), decimalPlaces(min))`. Same algorithm as current createSlider.
- **`wrap`** — when true, `up(max)` returns `min` and `down(min)` returns `max`. Useful for angles (0–360), hours (0–23), etc.
- **No orientation/inverted** — those are slider-specific. `fromValue`/`fromPercent` assume a linear scale without axis concerns.

### createSlider refactor

createSlider delegates math to createNumeric internally:

```ts
const numeric = createNumeric({ min, max, step })

// Before: inline snap function
// After:
function snap(value: number) { return numeric.snap(value) }
```

Multi-thumb logic (crossover, minStepsBetweenThumbs, per-thumb constraints) stays in createSlider. createNumeric only owns single-value math.

---

## createInput\<T\>

Shared form field primitive extracted from InputRoot.vue. Owns validation, field state, and form registration.

### Options

```ts
interface InputOptions<T = string> {
  /** Value source — caller owns this ref */
  value: Ref<T>
  /** Unique identifier (auto-generated if omitted) */
  id?: ID
  /** Display label */
  label?: string
  /** Form field name */
  name?: string
  /** Associate with form by ID */
  form?: string
  /** Whether required */
  required?: boolean
  /** Disabled state */
  disabled?: MaybeRefOrGetter<boolean>
  /** Readonly state */
  readonly?: MaybeRefOrGetter<boolean>
  /** Validation rules */
  rules?: RuleInput[]
  /** Manual error state override */
  error?: MaybeRefOrGetter<boolean>
  /** Manual error messages — merged with rule-based errors */
  errorMessages?: MaybeRefOrGetter<MaybeArray<string>>
  /** Predicate for "has content" — defaults vary by consumer */
  dirty?: (value: T) => boolean
  /** Equality check for pristine tracking. @default === */
  equals?: (a: T, b: T) => boolean
}
```

### Context

```ts
interface InputContext<T = string> {
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
  state: Readonly<Ref<'pristine' | 'valid' | 'invalid'>>
}
```

### Design decisions

- **No event handling** — composables never bind DOM events. Components call `validate()` when they choose (on blur, input, submit, close, etc.).
- **No `validateOn`** — that's event policy, owned by the component. The composable exposes `validate()` and `reset()`.
- **`isDirty` vs `isPristine`** — not inverses. `isDirty` = "has content" (via predicate). `isPristine` = "unchanged since mount/reset" (via equals).
- **`isTouched`** — writable by component. Enables "show errors only after interaction" UX.
- **No context provision** — composable returns a context object. The component decides what namespace to provide it under.
- **Generic `<T>`** — string for Input, number|null for NumberField, ID|ID[] for Select.
- **createValidation internal** — called inside createInput with the provided rules. Not exposed on the context.

### InputRoot.vue refactor

InputRoot becomes a thin wrapper:

```vue
<script setup>
const input = createInput({
  value: model,
  rules, disabled, readonly, required,
  error, errorMessages, id, label, name, form,
})
provideInputRoot(namespace, input)
</script>
```

All validation logic, field state tracking, and ARIA ID generation moves out of the component into the composable.

---

## createNumberField

Orchestrator composable. Composes createInput + createNumeric + Intl.NumberFormat.

### Options

```ts
interface NumberFieldOptions {
  /** Numeric value. @default ref(null) */
  value?: Ref<number | null>

  // Numeric (forwarded to createNumeric)
  min?: number
  max?: number
  step?: number
  leap?: number
  wrap?: boolean

  // Formatting
  /** Intl.NumberFormatOptions for locale-aware display */
  format?: Intl.NumberFormatOptions
  /** Locale override (defaults to useLocale) */
  locale?: string

  // Behavior
  /** Whether commit() clamps to bounds. @default true */
  clamp?: boolean

  // Field state
  disabled?: MaybeRefOrGetter<boolean>
  readonly?: MaybeRefOrGetter<boolean>
}
```

### Context

```ts
interface NumberFieldContext {
  /** The numeric value */
  value: Ref<number | null>

  /** Formatted display string (reactive, locale-aware) */
  display: Readonly<Ref<string>>

  /** Numeric math context */
  numeric: NumericContext

  /** Field state context */
  input: InputContext<number | null>

  /** Whether increment is possible */
  canIncrement: Readonly<Ref<boolean>>

  /** Whether decrement is possible */
  canDecrement: Readonly<Ref<boolean>>

  /** Increment by step × multiplier */
  increment: (multiplier?: number) => void

  /** Decrement by step × multiplier */
  decrement: (multiplier?: number) => void

  /** Set to min */
  floor: () => void

  /** Set to max */
  ceil: () => void

  /** Parse display string → number | null */
  parse: (text: string) => number | null

  /** Format number → locale display string */
  formatValue: (value: number) => string

  /** Parse current text, clamp if enabled, update value */
  commit: () => void
}
```

### Design decisions

- **`increment`/`decrement` no-op when disabled or readonly** — state policy, not events.
- **`commit()`** — state operation: parse text → snap → optionally clamp → write value. Component calls it from blur/Enter handler.
- **`display`** — reactive string. While focused: raw editable text. While blurred: locale-formatted string (e.g., "$1,234.56"). Managed internally.
- **`parse`/`format` exposed** — needed by Scrub component and custom controls.
- **`numeric` and `input` exposed** — escape hatches for advanced use. Top-level methods cover 95% of use cases.
- **No event handling** — no wheel, spin-on-hold, keyboard, or scrub logic. All in components.

### Formatting behavior

```ts
// Focused: raw editable text (no grouping separators)
"1234.56"

// Blurred: full Intl.NumberFormat output
"$1,234.56"    // { style: 'currency', currency: 'USD' }
"45%"          // { style: 'percent' }
"72.5 °F"      // { style: 'unit', unit: 'fahrenheit' }
```

Parsing strips locale-specific characters (grouping separators, currency symbols) using the same Intl.NumberFormat instance for consistency.

---

## NumberField Component

### Anatomy

```
NumberField.Root         — context provider (createNumberField + createInput)
NumberField.Input        — <input> with role="spinbutton", keyboard handling
NumberField.Increment    — button, disables at max
NumberField.Decrement    — button, disables at min
NumberField.Scrub        — drag-to-adjust region (Pointer Lock API)
NumberField.Description  — help text (aria-describedby)
NumberField.Error        — error messages (aria-errormessage)
```

### Keyboard interactions (owned by NumberField.Input)

| Key | Action |
|-----|--------|
| ArrowUp | `increment()` |
| ArrowDown | `decrement()` |
| PageUp | `increment(leap / step)` |
| PageDown | `decrement(leap / step)` |
| Home | `floor()` |
| End | `ceil()` |
| Shift+Arrow | `increment/decrement(10)` |
| Enter | `commit()` |

### Spin-on-hold (owned by NumberField.Increment / Decrement)

Props on Root (component-level, not composable):

```ts
spinDelay?: number    // initial hold delay, default: 400ms
spinRate?: number     // repeat interval, default: 50ms
```

Uses a component-level `useHold` pattern (same as Vuetify's VNumberInput).

### Wheel (owned by NumberField.Input)

```ts
wheel?: boolean       // default: false (opt-in, per GOV.UK concerns)
```

When enabled, scroll increments/decrements while the input is focused.

### Scrub (owned by NumberField.Scrub)

Pointer Lock API — click and drag to adjust value. Props:

```ts
sensitivity?: number  // pixels per step, default: 1
```

Renders as a label or any element via Atom's `as` prop. Shows a scrub cursor on hover.

### ARIA attributes (owned by NumberField.Input)

```html
<input
  role="spinbutton"
  aria-valuenow="42"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuetext="$42.00"
  aria-invalid="true|false"
  aria-describedby="[descriptionId]"
  aria-errormessage="[errorId]"
  aria-disabled="true"
  aria-readonly="true"
  inputmode="decimal"
  type="text"
/>
```

- `type="text"` always — `type="number"` has browser inconsistencies
- `inputmode="decimal"` — mobile numeric keyboard
- `aria-valuetext` — formatted display for screen readers ("$42.00" not "42")
- `aria-valuemin`/`aria-valuemax` omitted when Infinity (WAI-ARIA allows this)

### Usage examples

#### Basic

```vue
<NumberField.Root v-model="quantity" :min="0" :max="99">
  <NumberField.Decrement>−</NumberField.Decrement>
  <NumberField.Input />
  <NumberField.Increment>+</NumberField.Increment>
</NumberField.Root>
```

#### Currency with scrub

```vue
<NumberField.Root v-model="price" :min="0" :max="1000" :step="0.01"
  :format="{ style: 'currency', currency: 'USD' }"
>
  <NumberField.Scrub>Price</NumberField.Scrub>
  <NumberField.Decrement>−</NumberField.Decrement>
  <NumberField.Input />
  <NumberField.Increment>+</NumberField.Increment>
  <NumberField.Description>Enter amount in USD</NumberField.Description>
  <NumberField.Error v-slot="{ errors }">
    <span v-for="error in errors" :key="error">{{ error }}</span>
  </NumberField.Error>
</NumberField.Root>
```

#### Form integration

```vue
<Form.Root @submit="onSubmit">
  <NumberField.Root v-model="age" :min="0" :max="150"
    :rules="[v => v !== null || 'Required', v => (v ?? 0) >= 18 || 'Must be 18+']"
  >
    <NumberField.Scrub>Age</NumberField.Scrub>
    <NumberField.Input />
    <NumberField.Error v-slot="{ errors }">
      <span v-for="error in errors" :key="error">{{ error }}</span>
    </NumberField.Error>
  </NumberField.Root>
</Form.Root>
```

---

## PR Strategy

### PR1: Foundation Primitives

**New composables:**
- `packages/0/src/composables/createNumeric/index.ts`
- `packages/0/src/composables/createInput/index.ts`

**Refactors:**
- `createSlider` — compose `createNumeric` internally
- `Input.Root` — compose `createInput` internally

**Tests:**
- `createNumeric/index.test.ts` — snap, up/down, floor/ceil, wrap, floating-point
- `createInput/index.test.ts` — validation, field state, pristine/dirty, reset

**Verification:**
- All existing Slider tests pass unchanged
- All existing Input tests pass unchanged
- Build succeeds, typecheck passes

### PR2: NumberField Feature

**New composable:**
- `packages/0/src/composables/createNumberField/index.ts`

**New component:**
- `packages/0/src/components/NumberField/` — Root, Input, Increment, Decrement, Scrub, Description, Error, index.ts

**New feature checklist (per CLAUDE.md):**
- maturity.json entry (composable + component)
- Barrel exports (composables/index.ts, components/index.ts)
- Docs page + examples (basic, currency, percentage, scrub, form integration)
- Component/composable index pages
- README updates

**Tests:**
- `createNumberField/index.test.ts` — increment/decrement, commit, parse/format, clamp, wrap

---

## What Vuetify Gets Wrong (and v0 fixes)

| Issue | Vuetify VNumberInput | v0 NumberField |
|-------|---------------------|----------------|
| ARIA | No `role="spinbutton"`, buttons `aria-hidden` | Full spinbutton pattern with `aria-valuenow/min/max/text` |
| Formatting | No Intl.NumberFormat, no currency/percent | First-class `format` option via Intl.NumberFormatOptions |
| Buttons | Unfocusable (`tabindex="-1"`) | Focusable, proper `aria-label` |
| Scrub | None | Pointer Lock drag-to-adjust |
| Keyboard | Arrow only | Arrow + PageUp/Down (leap) + Shift+Arrow + Home/End |
| Locale | Basic decimal separator only | Full Intl locale support (grouping, numbering systems) |
| Floating-point | Has had multiple bugs | Handled at createNumeric level with `toFixed` correction |
| Composable | None — component-only | createNumberField usable standalone without component |
