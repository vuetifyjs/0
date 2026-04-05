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
  - /components/forms/slider
  - /components/forms/input
---

# NumberField

Numeric input with increment/decrement buttons, drag-to-scrub, and locale-aware formatting. Supports currency, percent, and unit display via `Intl.NumberFormat`.

<DocsPageFeatures :frontmatter />

## Usage

NumberField renders a spinbutton input with optional increment, decrement, and scrub controls. Wire it up with `v-model` for two-way binding.

::: example
/components/number-field/basic
:::

## Anatomy

```vue Anatomy playground collapse no-filename
<script setup lang="ts">
  import { NumberField } from '@vuetify/v0'
</script>

<template>
  <!-- Minimal -->
  <NumberField.Root>
    <NumberField.Input />
  </NumberField.Root>

  <!-- With buttons -->
  <NumberField.Root>
    <NumberField.Decrement>-</NumberField.Decrement>
    <NumberField.Input />
    <NumberField.Increment>+</NumberField.Increment>
  </NumberField.Root>

  <!-- With scrub label and description -->
  <NumberField.Root>
    <NumberField.Scrub>Amount</NumberField.Scrub>
    <NumberField.Description>Enter a value</NumberField.Description>

    <NumberField.Decrement>-</NumberField.Decrement>
    <NumberField.Input />
    <NumberField.Increment>+</NumberField.Increment>

    <NumberField.Error v-slot="{ errors }">
      <span v-for="error in errors">{{ error }}</span>
    </NumberField.Error>
  </NumberField.Root>
</template>
```

## Architecture

Root composes `createNumberField` which delegates to `createInput` for field state and `createNumeric` for math operations. Each sub-component consumes the root context.

```mermaid "NumberField Architecture"
flowchart TD
  CreateNumberField["createNumberField"]
  CreateInput["createInput"]
  CreateNumeric["createNumeric"]
  Root["NumberField.Root"]:::primary
  Input["NumberField.Input"]
  Increment["NumberField.Increment"]
  Decrement["NumberField.Decrement"]
  Scrub["NumberField.Scrub"]
  Description["NumberField.Description"]
  Error["NumberField.Error"]

  CreateInput --> CreateNumberField
  CreateNumeric --> CreateNumberField
  CreateNumberField --> Root
  Root --> Input
  Root --> Increment
  Root --> Decrement
  Root --> Scrub
  Root --> Description
  Root --> Error
```

## Examples

::: example
/components/number-field/currency

### Currency Formatting

Locale-aware currency display using `Intl.NumberFormat`. The `format` prop accepts any `Intl.NumberFormatOptions`, and the `Scrub` label allows drag-to-adjust the value.
:::

::: example
/components/number-field/scrub

### Design Tool Scrub

Figma-style property inputs where the label acts as a scrub control. Drag horizontally on any label to adjust its value. Uses the Pointer Lock API for unbounded movement.
:::

## Recipes

### Spin-on-Hold

Increment and Decrement buttons repeat automatically when held. Configure timing with `spin-delay` (initial pause, default 400ms) and `spin-rate` (repeat interval, default 60ms):

```vue
<template>
  <NumberField.Root :spin-delay="300" :spin-rate="40">
    <NumberField.Decrement>-</NumberField.Decrement>
    <NumberField.Input />
    <NumberField.Increment>+</NumberField.Increment>
  </NumberField.Root>
</template>
```

### Mouse Wheel

Enable value adjustment via scroll wheel when the input is focused:

```vue
<template>
  <NumberField.Root v-model="value" wheel>
    <NumberField.Input />
  </NumberField.Root>
</template>
```

### Data Attributes

Style interactive states without slot props:

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-state` | `valid`, `invalid`, `pristine` | Root, Input |
| `data-dirty` | `true` | Root |
| `data-focused` | `true` | Root, Input |
| `data-disabled` | `true` | Root, Input, Increment, Decrement, Scrub |
| `data-readonly` | `true` | Root, Input, Scrub |

## Accessibility

NumberField.Input renders with `role="spinbutton"` and full ARIA attributes per the [WAI-ARIA Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/).

### ARIA Attributes

| Attribute | Value | Notes |
|-----------|-------|-------|
| `role` | `spinbutton` | Applied to Input |
| `aria-valuenow` | Current value | `undefined` when empty |
| `aria-valuemin` | Min value | Only when finite |
| `aria-valuemax` | Max value | Only when finite |
| `aria-valuetext` | Formatted string | Screen readers announce "$42.00" not "42" |
| `aria-invalid` | `true` | When validation fails |
| `aria-label` | Label text | From Root's `label` prop |
| `aria-describedby` | Description ID | When Description is mounted |
| `aria-errormessage` | Error ID | When Error is mounted with messages |
| `aria-required` | `true` | When Root has `required` |

Increment and Decrement buttons use `tabindex="-1"` to keep them out of the tab sequence — only the Input is focusable.

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowUp` | Increment by one step |
| `ArrowDown` | Decrement by one step |
| `Shift+ArrowUp` | Increment by 10 steps |
| `Shift+ArrowDown` | Decrement by 10 steps |
| `PageUp` | Increment by leap (default step × 10) |
| `PageDown` | Decrement by leap (default step × 10) |
| `Home` | Set to minimum |
| `End` | Set to maximum |
| `Enter` | Commit the typed value |

::: faq

??? How does formatting work?

Root accepts a `locale` prop (BCP 47 tag, defaults to `en-US`) and a `format` prop with `Intl.NumberFormatOptions`. While the input is focused it shows the raw number for editing; on blur it displays the formatted string. Parsing strips locale-specific group separators and currency symbols automatically.

??? What happens when I type an invalid value?

On blur, the Input parses the text via `parse()`. If the result is `NaN`, the value becomes `null`. If `clamp` is `true` (default), the value is clamped to min/max and snapped to the nearest step.

??? How does scrub sensitivity work?

`Scrub` accepts a `sensitivity` prop (default 1) that controls how many pixels of horizontal movement equal one step. Higher values require more movement per step for finer control.

??? Can I use NumberField without increment/decrement buttons?

Yes. Only `Root` and `Input` are required. Buttons, Scrub, Description, and Error are all optional.

:::

<DocsApi />
