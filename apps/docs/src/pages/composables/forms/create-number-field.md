---
title: createNumberField - Numeric Input Composable
meta:
  - name: description
    content: Composable for numeric input state with Intl.NumberFormat, step snapping, and field validation for Vue 3.
  - name: keywords
    content: createNumberField, number input, composable, formatting, stepping, Vue 3, headless
features:
  category: Composable
  label: 'E: createNumberField'
  github: /composables/createNumberField/
  level: 2
related:
  - /components/forms/number-field
  - /composables/forms/create-numeric
  - /composables/forms/create-input
---

# createNumberField

Numeric value with locale-aware formatting, step snapping, and field validation. Give it a min/max/step, get increment/decrement, formatted display, and parse/commit for text input.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse
import { createNumberField } from '@vuetify/v0'
import { shallowRef } from 'vue'

// Basic — standalone counter
const field = createNumberField({ min: 0, max: 100, step: 1 })
field.increment()       // 1
field.increment(5)      // 6  (multiplier)
field.value.value       // 6
field.display.value     // '6'

// Currency formatting
const price = shallowRef<number | null>(42)
const currency = createNumberField({
  value: price,
  min: 0,
  max: 10000,
  step: 0.01,
  locale: 'en-US',
  format: { style: 'currency', currency: 'USD' },
})
currency.display.value  // '$42.00'
currency.parse('$1,234.56')  // 1234.56

// With validation
const validated = createNumberField({
  min: 1,
  max: 100,
  rules: [v => v !== null || 'Required'],
})
await validated.input.validate()
validated.input.errors.value  // ['Required']
```

## Architecture

```mermaid "createNumberField Architecture"
flowchart TD
  Options["NumberFieldOptions"]
  CNF["createNumberField"]:::primary
  CN["createNumeric"]
  CI["createInput"]
  INF["Intl.NumberFormat"]
  Context["NumberFieldContext"]

  Options --> CNF
  CNF --> CN
  CNF --> CI
  CNF --> INF
  CN --> Context
  CI --> Context
  INF --> Context
```

`createNumeric` provides pure math (step, clamp, snap, boundary checks). `createInput` provides field state (dirty, pristine, focus, validation). `Intl.NumberFormat` provides locale-aware formatting and parsing.

## Reactivity

| Property | Type | Reactive | Description |
|----------|------|----------|-------------|
| `value` | `Ref<number \| null>` | Yes | Current numeric value |
| `display` | `Readonly<Ref<string>>` | Yes | Formatted display string |
| `canIncrement` | `Readonly<Ref<boolean>>` | Yes | Whether value can go up |
| `canDecrement` | `Readonly<Ref<boolean>>` | Yes | Whether value can go down |
| `numeric` | `NumericContext` | No | Underlying numeric math context |
| `input` | `InputContext` | Partial | Field state (focus, dirty, validation) |
| `increment(n?)` | `(multiplier?: number) => void` | -- | Increment by step * multiplier |
| `decrement(n?)` | `(multiplier?: number) => void` | -- | Decrement by step * multiplier |
| `floor()` | `() => void` | -- | Set to minimum |
| `ceil()` | `() => void` | -- | Set to maximum |
| `formatValue(v)` | `(value: number) => string` | -- | Format a number |
| `parse(text)` | `(text: string) => number \| null` | -- | Parse text to number |
| `commit()` | `() => void` | -- | Snap and optionally clamp |

## Examples

::: gn-example
/composables/create-number-field/useOrder.ts 1
/composables/create-number-field/NumberStepper.vue 2
/composables/create-number-field/order-calculator.vue 3

### Build your own number input

This example builds a reusable numeric field entirely from `createNumberField`, without reaching for the NumberField component. `useOrder` creates two field contexts over shared value refs — a unit price formatted as USD currency and an integer quantity — then derives a live order total by calling `priceField.formatValue` on the product of the two raw values. Keeping the numbers in `value` and the formatting in `display`/`formatValue` is what lets the total reuse the price field's currency formatter without re-implementing Intl.

`NumberStepper` is the headless input you would otherwise get from the component. It renders a text box plus a pair of stepper buttons and wires the four interaction surfaces by hand: `decrement`/`increment` on the buttons, `canDecrement`/`canIncrement` to disable them at the min/max boundaries, `display` for the formatted read-only view, and `parse` + `commit` on blur to turn typed text back into a clamped, step-snapped number. A local draft string holds the raw text only while the field is focused, so typing never fights the formatter and the cursor never jumps.

Reach for this pattern when you need numeric input with custom markup the component's structure does not allow — a stepper baked into a larger control, an inline editable total, or a non-standard layout. When you just need a labelled, accessible spin-button with errors, use the [NumberField component](/components/forms/number-field) instead; for the pure step math underneath, see [createNumeric](/composables/forms/create-numeric).

| File | Role |
|------|------|
| `useOrder.ts` | Creates the price and quantity field contexts and derives the formatted total |
| `NumberStepper.vue` | Renders a custom text input plus stepper buttons from a field context |
| `order-calculator.vue` | Wires the composable to two steppers and shows the live total |
:::

::: faq

??? How does parsing handle different locales?

`createNumberField` builds a stripping regex from `Intl.NumberFormat.formatToParts`. It removes group separators, currency symbols, and literal characters automatically, then normalizes the decimal separator to `.` before parsing with `Number()`.

??? What's the difference between this and createNumeric?

`createNumeric` is a pure math primitive with no reactivity or DOM concerns. `createNumberField` orchestrates `createNumeric` + `createInput` + `Intl.NumberFormat` into a complete field with reactive state, formatting, parsing, and validation.

??? Does commit() always clamp?

By default yes. Set `clamp: false` to allow values outside min/max after typing. The value still gets snapped to the step grid.

??? Can I share the value ref across multiple fields?

Yes. Pass the same `Ref<number | null>` to multiple `createNumberField` instances. Each field formats independently but writes to the same source.

:::

<DocsApi />
