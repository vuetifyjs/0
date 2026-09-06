---
title: BuInput - Bulma Text Input for Vue
meta:
- name: description
  content: Bulma's text input for Vue — a native .input with v-model, color and size modifiers, and Vuetify0 validation that paints is-danger when the value fails.
- name: keywords
  content: bulma input, vue text field, is-static, form validation vue, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuInput'
  level: 2
  renderless: false
  order: 13
related:
  - /systems/bulma
  - /systems/bulma/field
  - /components/forms/input
---

# BuInput

<DocsPageFeatures :frontmatter />

Bulma's `.input` as a native text control, with `v-model`, the color and size modifiers the stylesheet already knows, and validation that paints `is-danger` when the value fails.

> [!NOTE]
> Reference: [Input on bulma.io](https://bulma.io/documentation/form/input/) — classes and visual variants. This page is the JavaScript.

## Usage

`v-model` is a `string` and defaults to `''`. It stays a string for every `type`, including `number` — the DOM gives you a string, and quietly coercing it is how forms end up with `NaN` in a payload.

A wrapper is optional. Bulma's `.input` is bare-capable, so `BuInput` renders the native control and nothing around it. Put it in a [BuField](/systems/bulma/field) when you need a label or help text; put it in a `BuControl` when you need icons, a loading spinner, or `is-expanded`.

::: ds-example
/systems/bulma/input/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuInput } from '@paper/bulma'
</script>

<template>
  <BuInput />
</template>
```

## Composed on Vuetify0

`BuInput` is a renderless [Input.Root](/components/forms/input) around a native `Input.Control`. The root owns the value, focus, the validation pipeline and the aria ids; the control is the element you type into. No wrapper element lands, which is why the conformance fixture is a bare `<input class="input">`.

v0's control already is a native `<input>`, and Bulma styles that element, so the compound is the right primitive — not a hand-rolled input. `is-danger` is the one piece the skin owns: it lands on the control when `isValid === false`, because Bulma's invalid state is a class, not a data attribute.

Inside an existing `Input.Root` the wrapper is skipped and the control binds to the ambient context instead. A nested root would shadow it, which is why the skip exists — and why the ambient root then owns the whole behavioral surface. See [Validation and error text](#validation-and-error-text).

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/input/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<input class="input" type="text" placeholder="Text input" />
```

```vue Vue
<template>
  <BuInput placeholder="Text input" />
</template>
```

:::

`placeholder`, `autocomplete`, `maxlength` and the rest of the native surface fall through to the input. `class` and `style` do too — there is no wrapper to land them on.

Loading is not an input modifier. `is-loading` goes on the wrapping [BuControl](/systems/bulma/field), and `size` on that control pairs the spinner with the input size.

## Examples

::: ds-example
/systems/bulma/input/validation

### Validation and error text

Rules and error text come from an ambient `InputRoot` rather than from props on `BuInput`, and that is deliberate rather than incidental. `BuLabel` and `BuHelp` resolve their wiring by injection — the label's `for`, the help text's id, the input's `aria-errormessage` — so all three need to see the same context. A `BuInput` that creates its own root scopes that context to its own subtree, where a sibling label and help cannot reach it.

Wrapping the field in `<InputRoot renderless>` puts the context one level up, where every sibling can inject it. `BuInput` detects the ambient root and renders only the control, so nothing is shadowed. The label and the help both need `namespace="v0:input:root"`: that is their default, but a mismatched namespace injects nothing and renders unwired — no `for`, no error text, and no complaint at runtime besides a development warning on `BuHelp`.

Without that ambient root, `BuHelp validation` is empty while the input still shows `is-danger`. The field looks invalid and explains nothing. That is a known limitation, not a bug to work around with a slot.

Inside an ambient root, that root owns the whole behavioral surface. `v-model`, `type`, `disabled`, `readonly`, `required`, `name`, `form`, `id`, `label` and every validation prop belong to it, and the same props passed to `BuInput` are ignored. Only the presentational modifiers — `color`, `size`, `rounded`, `plaintext` — still apply, and `plaintext` is then class-only (set `readonly` on the ambient root for the attribute).

`validateOn` defaults to `blur`. The failing state itself is component-owned: `BuInput` puts `is-danger` on the input when validation fails; there is no class prop for it, and `error` forces the state rather than styling it.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with BuInput.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | Field value. Always a string, whatever the `type` |
| `v-model:focused` | `boolean` | `false` | Focus state |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` |
| `disabled` | `boolean` | `false` | Disables the input |
| `error` | `boolean` | `false` | Force the invalid state — paints `is-danger` |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `form` | `string` | — | Id of the form to associate with |
| `id` | `string \| number` | auto | Input id; generated when omitted |
| `label` | `string` | — | Accessible name for the input |
| `name` | `string` | — | Form field name |
| `namespace` | `string` | `'v0:input:root'` | Context namespace the control binds to |
| `plaintext` | `boolean` | `false` | `is-static` + readonly. Class-only inside an ambient root |
| `readonly` | `boolean` | `false` | Input stays focusable; value cannot change |
| `required` | `boolean` | — | Marks the field required |
| `rounded` | `boolean` | `false` | `is-rounded` |
| `rules` | `ValidationRule[]` | — | Validation rules |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` — omitted until passed |
| `type` | `string` | `'text'` | Native input type |
| `validate-on` | `ValidateOn` | — | When validation runs. v0 default is `'blur'` |

Inside an ambient `Input.Root`, every behavioral row in that table is ignored. Native attributes (`placeholder`, `autocomplete`, `maxlength`, …) fall through to the input.

## Accessibility

The control is a real `<input>`. It needs an accessible name like any other: a sibling `BuLabel` pointed at its id, the `label` prop, or `aria-labelledby`. An unnamed field fails the axe `label` rule.

### Naming

Prefer a visible `BuLabel` over `label` on the input. The prop becomes an `aria-label` and hides the visible text from the accessible name if both exist. `placeholder` is not a name — it disappears the moment someone types, and it fails contrast in most themes.

### States

| State | Focusable | Submitted | Visual |
|-------|-----------|-----------|--------|
| `readonly` | Yes | Yes | Native readonly. Use `plaintext` when it should also look like static text (`is-static`) |
| `disabled` | No | No | Native disabled, Bulma's disabled treatment |
| `error` / failed rules | Yes | Yes | `is-danger` on the input; `aria-invalid` from Vuetify0 |

### Validation

`aria-invalid` follows `isValid === false`. `aria-errormessage` points at a `BuHelp validation` only when that help is inside the same ambient root. A `BuInput` with its own internal root and a sibling help will announce invalid without a message — the half-wired trap above.
