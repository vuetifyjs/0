---
title: BuTextarea - Bulma Textarea for Vue
meta:
- name: description
  content: Bulma's textarea for Vue — a native .textarea with v-model, sizes, colors, a fixed-size option, and Vuetify0 validation on the same Input family as BuInput.
- name: keywords
  content: bulma textarea, vue textarea, has-fixed-size, multiline input vue, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuTextarea'
  level: 2
  renderless: false
  order: 14
related:
  - /systems/bulma
  - /systems/bulma/field
  - /components/forms/input
---

# BuTextarea

<DocsPageFeatures :frontmatter />

Bulma's `.textarea` as a native multiline control — the same Input family as [BuInput](/systems/bulma/input), grown to paragraph-length values, with `fixed` in place of rounded and plaintext.

> [!NOTE]
> Reference: [Textarea on bulma.io](https://bulma.io/documentation/form/textarea/) — classes and visual variants. This page is the JavaScript.

## Usage

`v-model` is a `string` and defaults to `''`. `rows` is a native attribute, not a prop — it falls through to the textarea and sets how many lines are visible before scrolling. The box still resizes unless you pass `fixed`.

A wrapper is optional. Put it in a [BuField](/systems/bulma/field) when you need a label; put it in a `BuControl` when you need a loading spinner.

::: ds-example
/systems/bulma/textarea/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuTextarea } from '@paper/bulma'
</script>

<template>
  <BuTextarea />
</template>
```

## Composed on Vuetify0

`BuTextarea` is a renderless [Input.Root](/components/forms/input) around `Input.Control` rendered as a native `<textarea>`. The compound is element-agnostic — the whole wiring surface (value sync, focus tracking, the validation pipeline, the aria attributes) applies to a textarea exactly as it does to an input. v0 supplies the behavior; the skin picks the element with `as="textarea"` and the `.textarea` class.

There is no `rounded` and no `plaintext`. Those are input modifiers. The extra knob here is `fixed`, which emits `has-fixed-size` and disables the resize handle.

Inside an existing `Input.Root` the wrapper is skipped and the control binds to the ambient context instead. The ambient-root contract is the same as `BuInput`: the root owns `v-model`, `disabled`, `readonly`, `required`, `name`, `form`, `id`, `label` and every validation prop; only `color`, `size` and `fixed` still apply on the textarea.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/textarea/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<textarea class="textarea" placeholder="e.g. Hello world"></textarea>
```

```vue Vue
<template>
  <BuTextarea placeholder="e.g. Hello world" />
</template>
```

:::

Loading is not a textarea modifier. `is-loading` goes on the wrapping [BuControl](/systems/bulma/field), and `size` on that control pairs the spinner with the textarea size.

## Examples

::: ds-example
/systems/bulma/textarea/fixed

### Fixed size

`fixed` adds `has-fixed-size` and that is the whole resize story. The handle disappears; the box stays at the height `rows` (or the UA default) set. Reach for it when a resize handle would shove neighbouring controls around — a comment box in a tight card, a notes field in a horizontal form.

Leave it off when the reader might have more to say than the visible rows. The default textarea resizes vertically, which is the signal that an essay is allowed even if you opened the box at three lines.

The ambient-root trap on [BuInput](/systems/bulma/input) applies here too. A sibling `BuHelp validation` is empty unless the field is wrapped in `<InputRoot renderless>` — the textarea still paints `is-danger`, the help stays blank.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with BuTextarea.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | Field value |
| `v-model:focused` | `boolean` | `false` | Focus state |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` |
| `disabled` | `boolean` | `false` | Disables the textarea |
| `error` | `boolean` | `false` | Force the invalid state — paints `is-danger` |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `fixed` | `boolean` | `false` | `has-fixed-size` — disables resize |
| `form` | `string` | — | Id of the form to associate with |
| `id` | `string \| number` | auto | Textarea id; generated when omitted |
| `label` | `string` | — | Accessible name |
| `name` | `string` | — | Form field name |
| `namespace` | `string` | `'v0:input:root'` | Context namespace the control binds to |
| `readonly` | `boolean` | `false` | Textarea stays focusable; value cannot change |
| `required` | `boolean` | — | Marks the field required |
| `rules` | `ValidationRule[]` | — | Validation rules |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` — omitted until passed |
| `validate-on` | `ValidateOn` | — | When validation runs. v0 default is `'blur'` |

Inside an ambient `Input.Root`, every behavioral row in that table is ignored. Native attributes (`placeholder`, `rows`, `maxlength`, …) fall through to the textarea.

## Accessibility

The control is a real `<textarea>`. Name it with a sibling `BuLabel`, the `label` prop, or `aria-labelledby`. An unnamed field fails the axe `label` rule.

### Naming

Prefer a visible `BuLabel` over `label` on the textarea. `placeholder` is a format hint, not a name — `e.g. Hello world` tells the reader what a filled box looks like; it does not tell assistive technology what the field is for.

### States

| State | Focusable | Submitted | Visual |
|-------|-----------|-----------|--------|
| `readonly` | Yes | Yes | Native readonly |
| `disabled` | No | No | Native disabled, Bulma's disabled treatment |
| `error` / failed rules | Yes | Yes | `is-danger` on the textarea; `aria-invalid` from Vuetify0 |

### Validation

Same contract as `BuInput`. `aria-invalid` follows `isValid === false`. `BuHelp validation` only wires `aria-errormessage` inside an ambient `Input.Root`. Without that root the textarea can look invalid and explain nothing.
