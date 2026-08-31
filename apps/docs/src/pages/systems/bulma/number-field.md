---
title: BuNumberField - Bulma Number Input for Vue
meta:
- name: description
  content: A number field composed from Bulma's own has-addons markup — stepper buttons around an input — with Vuetify0 spinbutton behavior, bounds, formatting and validation.
- name: keywords
  content: bulma number field, vue number input, spinbutton, has-addons, stepper, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuNumberField'
  level: 2
  renderless: false
  order: 3
related:
  - /systems/bulma
  - /systems/bulma/dropdown
  - /components/forms/number-field
---

# BuNumberField

A number field Bulma never documented, built entirely from parts it did: stepper buttons attached to an input, with stepping, bounds, formatting and validation supplied by Vuetify0.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: Bulma has no number field. The layout is [form addons on bulma.io](https://bulma.io/documentation/form/general/#form-addons).

## Usage

`v-model` holds the value — a number, or `null` while the field is empty. `min`, `max` and `step` bound it, and each stepper goes inert the moment the value reaches its bound. Compose the three parts in order: decrement, input, increment.

Give the input the leftover width with `expanded`. Without it the input sizes to its content and the group collapses to the width of a short number.

::: ds-example
/systems/bulma/number-field/basic
:::

## Anatomy

```vue Anatomy no-filename collapse
<script setup lang="ts">
  import { BuNumberField } from '@paper/bulma'
</script>

<template>
  <BuNumberField>
    <BuNumberField.Decrement />

    <BuNumberField.Input />

    <BuNumberField.Increment />
  </BuNumberField>
</template>
```

## Composed on v0

Composes v0's [NumberField](/components/forms/number-field). `BuNumberField` creates a `NumberField.Root` unless an ambient one already exists; `Decrement`, `Control`, and `Increment` live inside each part's own `.control`.

v0 owns the spinbutton: the math, the bounds, formatting, validation, keyboard, hold-to-repeat. Bulma owns `.field.has-addons` radii — each part wraps `.control` because first- and last-child selectors are how the group gets its corners.

An ambient `NumberField.Root` swallows every behavioral prop on `BuNumberField` — `v-model`, bounds, format, validation. Only presentational modifiers still apply. Point `BuLabel` and `BuHelp` at `namespace="v0:number-field:root"` or they inject nothing.

## The markup it composes

Bulma ships no number input. There is no upstream component page to copy from, so this one is composed out of things Bulma does document: the [attached-controls layout](https://bulma.io/documentation/form/general/#form-addons) — `.field.has-addons` wrapping one `.control` per item — with `button.button` steppers on either side of an `input.input`. No class in it is invented, and the package ships no CSS.

That changes what conformance can promise here, and the change is declared rather than glossed. Every other component in the package is diffed against markup captured verbatim from bulma.io. This one is diffed against a fixture the package authored itself, whose provenance header traces each class back to another fixture block or to a `bulma.css` selector — so every atom is upstream-verified and only the arrangement is ours. The arrangement is pinned the moment that fixture is written, so drift still fails the suite loudly. What the suite cannot claim is that upstream would have arranged the atoms the same way.

::: code-group no-filename

```html Bulma
<div class="field has-addons">
  <div class="control">
    <button class="button" type="button">&minus;</button>
  </div>
  <div class="control is-expanded">
    <input class="input" type="text" inputmode="decimal" role="spinbutton" />
  </div>
  <div class="control">
    <button class="button" type="button">+</button>
  </div>
</div>
```

```vue Vue
<template>
  <BuNumberField v-model="quantity" :max="10" :min="0">
    <BuNumberField.Decrement />

    <BuNumberField.Input expanded />

    <BuNumberField.Increment />
  </BuNumberField>
</template>
```

:::

Each part renders its own `.control` wrapper rather than leaving it to you, because that wrapper is structural: Bulma keys the group's corner radii off the first and last `.control`, and squares off the ones between. A bare stepper dropped in as a sibling would get no radius treatment and visibly break the group, so the composition is not something userland has to get right.

## Examples

::: ds-example
/systems/bulma/number-field/formatted

### Formatted display

`format` takes `Intl.NumberFormat` options and `locale` takes a BCP 47 tag, and together they decide what the field shows while it is not being edited. Focus the input and the raw number appears for typing; blur it and the formatted string comes back. The value in `v-model` is a plain number throughout — formatting is a display concern and never round-trips through the model.

Reach for it whenever the number means something to a reader in a particular shape: currency, percentages, a fixed number of decimal places. Typing is unaffected, so a reader can enter `12.5` into a currency field and get `$12.50` back on blur without learning the format.

`color` is worth noting here too. It lands on the steppers only, never on the input, because Bulma's `.input` color modifier paints the border — which is the same surface `is-danger` uses to signal a failing value. Leaving the input uncolored keeps the validation state legible no matter which color the field carries.
:::

::: ds-example
/systems/bulma/number-field/validated

### Validation and error text

Rules and error text come from an ambient `NumberFieldRoot` rather than from props on `BuNumberField`, and that is deliberate rather than incidental. `BuLabel` and `BuHelp` resolve their wiring by injection — the label's `for`, the help text's id, the input's `aria-errormessage` — so all three need to see the same context. A `BuNumberField` that creates its own root scopes that context to its own subtree, where a sibling label and help cannot reach it.

Wrapping the field in `<NumberFieldRoot renderless>` puts the context one level up, where every sibling can inject it. `BuNumberField` detects the ambient root and renders a plain `.field.has-addons` instead of creating a second one, so nothing is shadowed. The label and the help both need `namespace="v0:number-field:root"`: their default namespace is the plain input one, and a mismatched namespace injects nothing and renders unwired — no `for`, no error text, and no complaint at runtime.

The failing state itself is component-owned. `BuNumberFieldInput` puts `is-danger` on the input when validation fails; there is no prop for it, and `error` on `BuNumberField` forces the state rather than styling it. Validation runs on blur by default — `validateOn` changes that.

Inside an ambient root, that root owns the whole behavioral surface. `v-model`, the bounds, the format, the id and every validation prop belong to it, and the same props passed to `BuNumberField` are ignored. Only the presentational modifiers — `color`, `size`, `rounded`, `addons`, and the input's `expanded` — still apply.
:::

::: ds-example
/systems/bulma/number-field/readonly

### Readonly and disabled

`readonly` and `disabled` are not two intensities of the same thing. A readonly field still takes focus and its value can be selected and copied; the steppers go inert, arrow keys do nothing, and the value cannot change. A disabled field is out of the tab order entirely, input included, and Bulma paints all three elements with its disabled treatment.

Pick `readonly` for a value the reader should be able to see and copy but not change — a computed allocation, a quantity locked by a plan. Pick `disabled` when the whole control is inapplicable and there is nothing worth reading. The steppers carry the native `disabled` attribute in both cases, which is what makes them inert without any extra styling.
:::

## Props

`BuNumberField` renders `.field.has-addons` and owns the value, the bounds and the modifiers. Everything else is a part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number \| null` | `null` | Field value; `null` while empty |
| `addons` | `'centered' \| 'right'` | — | `has-addons-{value}` — alignment of the group |
| `aria-labelledby` | `string` | — | Id of the element naming the spinbutton |
| `clamp` | `boolean` | `true` | Clamp a committed value to `min`/`max` |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` on the steppers only |
| `commit-on` | `'input' \| 'change'` | `'change'` | When typed input writes into `v-model` |
| `disabled` | `boolean` | `false` | Disables the input and both steppers |
| `error` | `boolean` | `false` | Force the invalid state |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `form` | `string` | — | Id of the form to associate with |
| `format` | `Intl.NumberFormatOptions` | — | Display format while blurred |
| `id` | `string \| number` | auto | Input id; generated when omitted |
| `label` | `string` | — | Accessible name for the spinbutton |
| `leap` | `number` | `step * 10` | PageUp / PageDown increment |
| `locale` | `string` | `'en-US'` | BCP 47 tag used to format the display |
| `max` | `number` | — | Upper bound |
| `min` | `number` | — | Lower bound |
| `name` | `string` | — | Form field name |
| `namespace` | `string` | `'v0:number-field:root'` | Context namespace the parts bind to |
| `readonly` | `boolean` | `false` | Input stays focusable; steppers inert |
| `required` | `boolean` | — | Marks the field required |
| `rounded` | `boolean` | `false` | `is-rounded` on the input and both steppers |
| `rules` | `ValidationRule[]` | `[]` | Validation rules |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` on the input and both steppers |
| `spin-delay` | `number` | `400` | Delay in ms before spin-on-hold starts |
| `spin-rate` | `number` | `60` | Interval in ms between repeats while held |
| `step` | `number` | `1` | Stepper and arrow-key increment |
| `validate-on` | `ValidateOn` | `'blur'` | When validation runs |
| `wheel` | `boolean` | `false` | Mouse wheel adjusts the value while focused |
| `wrap` | `boolean` | `false` | Wrap around at the bounds |

| Part | Renders | Notes |
|------|---------|-------|
| `BuNumberFieldDecrement` | `div.control` + `button.button` | First control — carries the group's left radii; slot content defaults to the minus glyph |
| `BuNumberFieldInput` | `div.control` + `input.input` | Middle control — square corners; `expanded` adds `is-expanded`; owns `is-danger` |
| `BuNumberFieldIncrement` | `div.control` + `button.button` | Last control — carries the group's right radii; slot content defaults to the plus glyph |

Each part takes a `namespace` prop as an escape hatch, but the parent's namespace wins whenever they are composed inside a `BuNumberField`.

## Accessibility

The input is the widget. It carries `role="spinbutton"` and `inputmode="decimal"`, and the full `aria-value*` set follows the value: `aria-valuenow` and `aria-valuetext` while a value exists, plus `aria-valuemin` and `aria-valuemax` whenever the corresponding bound is finite. On an empty field `aria-valuenow` and `aria-valuetext` are omitted rather than faked — there is no number to report.

The steppers are deliberately not focusable. Both carry `tabindex="-1"` and a localized `aria-label`, which is the ARIA Authoring Practices spinbutton pattern: keyboard users operate the field through the input, and the buttons exist for pointer input. That leaves one tab stop per field instead of three.

| Key | Behavior |
|-----|----------|
| Up / Down | Step by `step` |
| Shift + Up / Down | Step by `leap` |
| PageUp / PageDown | Step by `leap` |
| Home / End | Jump to `min` / `max` |
| Enter | Commit the typed text |

Holding a stepper repeats it — after `spin-delay`, at `spin-rate`. The release is caught on the document, so dragging off the button before letting go still stops the spin.

> [!IMPORTANT]
> Name the field. The spinbutton is a real `input`, so it needs an accessible name like any other: a sibling `BuLabel` pointed at its id, the `label` prop, or `aria-labelledby`. An unnamed field fails the axe `label` rule.

> [!NOTE]
> The steppers reach their bounds by way of the native `disabled` attribute, not `aria-disabled` — so a disabled stepper is inert to pointer and assistive technology alike, and Bulma's existing `[disabled]` styling applies with nothing added.
