---
title: BuField - Bulma Form Field for Vue
meta:
- name: description
  content: Bulma's field scaffolding for Vue — label, control and help, with addons, grouped and horizontal layouts, plus Vuetify0 wiring for labels and validation text.
- name: keywords
  content: bulma field, vue form, has-addons, is-horizontal, is-grouped, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuField'
  level: 2
  renderless: false
  order: 12
related:
  - /systems/bulma
  - /systems/bulma/input
  - /components/forms/input
---

# BuField

<DocsPageFeatures :frontmatter />

The `.field` wrapper and the parts that live inside it: label, control, help. Addons, grouped and horizontal layouts are props on the field; the horizontal columns are parts you compose.

> [!NOTE]
> Reference: [Form on bulma.io](https://bulma.io/documentation/form/general/) — classes and visual variants. This page is the JavaScript.

## Usage

`BuField` is markup. It does not own a value and it does not create a Vuetify0 context. Put a [BuLabel](#bulabel), a [BuControl](#bucontrol) around the input, and a [BuHelp](#buhelp) under it — that is the stacked field Bulma documents.

`addons`, `grouped` and `horizontal` are three layouts — pick one. The component will happily emit both `has-addons` and `is-grouped` if you set both, and Bulma has no stylesheet for that combination. `addons` attaches controls into one group (`has-addons`, plus `has-addons-centered` / `has-addons-right` when you pass those strings). `grouped` spaces them as separate controls. `horizontal` splits the row into a label column and a body column, which you compose from `BuFieldLabel` and `BuFieldBody`.

::: ds-example
/systems/bulma/field/basic
:::

## Anatomy

The first tree is a stacked field. The second is the horizontal layout — a field is one or the other, never both.

```vue Anatomy no-filename collapse
<script setup lang="ts">
  import {
    BuControl,
    BuField,
    BuFieldBody,
    BuFieldLabel,
    BuHelp,
    BuLabel,
  } from '@paper/bulma'
</script>

<template>
  <BuField>
    <BuLabel />

    <BuControl />

    <BuHelp />
  </BuField>

  <BuField>
    <BuFieldLabel>
      <BuLabel />
    </BuFieldLabel>

    <BuFieldBody>
      <BuField>
        <BuControl />
      </BuField>
    </BuFieldBody>
  </BuField>
</template>
```

## Composed on Vuetify0

`BuField`, `BuFieldLabel`, `BuFieldBody` and `BuControl` are pure markup. They emit Bulma's classes around a slot. There is no model, no context and no Vuetify0 primitive underneath.

`BuLabel` and `BuHelp` are the two that reach into Vuetify0. Both optionally inject an [Input.Root](/components/forms/input) on `v0:input:root` by default. `BuLabel`'s `for` falls back to that root's id when you do not pass one. `BuHelp` with `validation` wraps a renderless `Input.Error`, so the error id, `aria-live` and `aria-errormessage` registration wire up without you tracking them.

Vuetify0 ships no `Input.Label` part, which is why `BuLabel` is hand-rolled markup rather than a styled v0 label.

Without an ambient root they still render — a standalone label has no `for`, and a help with `validation` renders an empty `.help` (and warns in development). That is the half-wired trap on [BuInput](/systems/bulma/input): the input still paints `is-danger`, the sibling help stays blank. Wrap the field in `<InputRoot renderless>` when the label and the error text need to see the same context.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/general/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<div class="field">
  <label class="label">Label</label>
  <div class="control">
    <input class="input" type="text" placeholder="Text input">
  </div>
  <p class="help">This is a help text</p>
</div>
```

```vue Vue
<template>
  <BuField>
    <BuLabel>Label</BuLabel>

    <BuControl>
      <BuInput placeholder="Text input" />
    </BuControl>

    <BuHelp>This is a help text</BuHelp>
  </BuField>
</template>
```

:::

Icons and the loading spinner live on `BuControl`, not on the input. `icons="both"` emits `has-icons-left` and `has-icons-right`; `loading` emits `is-loading`; `size` on the control pairs the spinner with the input size. Drop the icon elements in as siblings of the input, the way Bulma documents them.

## Examples

::: ds-example
/systems/bulma/field/horizontal

### Horizontal layout

`horizontal` adds `is-horizontal` and that is all it does. The two columns are parts you compose: `BuFieldLabel` is the label column, `BuFieldBody` is the control column, and the body holds one or more nested `BuField`s — never a bare control. That inner field is what carries the input's help text, so a required-field message sits under the control rather than under the row label.

`size` on `BuFieldLabel` is column alignment, not type size. `is-normal` lines the label up with a normal input; `is-small` / `is-medium` / `is-large` track the control they sit next to. The `.label` itself is still a `BuLabel` nested inside.

The help in this example is colored statically (`color="danger"`). That is not `validation` — there is no ambient root, so a `BuHelp validation` would render empty. Reach for this layout when a form is a list of questions that should scan as rows — settings, a checkout, anything whose labels are short and whose controls should share a left edge. Leave it off for a single stacked field; a horizontal field with one row and a long label wastes the column on nothing.
:::

::: ds-example
/systems/bulma/field/addons

### Addons

`addons` attaches every child control into one visual group. Bulma keys the group's corner radii off the first and last `.control`, and squares the ones between, so each attached piece — the input, the button — has to be its own `BuControl`. A bare button dropped in as a sibling of the field gets no radius treatment and visibly breaks the group.

Pass `'centered'` or `'right'` when the group should not hug the left edge; those strings add `has-addons-centered` or `has-addons-right` on top of `has-addons`. `grouped` is the other layout: same child shape, but the controls stay separate instead of joining. Do not set both.

There is no `BuButton`. The search control in this example is a native `button.button`, which is the markup Bulma documents for an addon. Give it `type="button"` so it does not submit a surrounding form.
:::

## Props

`BuField` renders `.field`. Everything else is a part.

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the SFCs until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `addons` | `boolean \| 'centered' \| 'right'` | `false` | `has-addons`, plus `has-addons-{value}` when a string |
| `grouped` | `boolean \| 'centered' \| 'right' \| 'multiline'` | `false` | `is-grouped`, plus `is-grouped-{value}` when a string |
| `horizontal` | `boolean` | `false` | `is-horizontal` — compose from `BuFieldLabel` + `BuFieldBody` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuFieldLabel` | `div.field-label` | Label column of a horizontal field. `size` emits `is-{size}` |
| `BuFieldBody` | `div.field-body` | Control column. Holds nested `BuField`s |
| `BuControl` | `div.control` or `p.control` | Wraps the input. Icons, loading and `expanded` live here |
| `BuLabel` | `label.label` | `for` falls back to the ambient Input.Root id |
| `BuHelp` | `p.help` | Plain help text, or ambient `Input.Error` when `validation` is set |

### BuFieldLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` on the column, aligning it with the control |

### BuControl

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'div' \| 'p'` | `'div'` | Element tag — Bulma docs use both |
| `expanded` | `boolean` | `false` | `is-expanded` — fill leftover width in grouped or addon fields |
| `icons` | `'left' \| 'right' \| 'both'` | — | `has-icons-left` / `has-icons-right` |
| `loading` | `boolean` | `false` | `is-loading` — spinner on the control, not the input |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` — pairs the spinner with the input size |

### BuLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | ambient id | Explicit target id; falls back to the ambient Input.Root id |
| `namespace` | `string` | `'v0:input:root'` | Context the label injects |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` on the label |

### BuHelp

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}`. Defaults to `danger` in validation mode |
| `namespace` | `string` | `'v0:input:root'` | Context the help injects |
| `validation` | `boolean` | `false` | Render ambient Input.Root errors via `Input.Error` |

Slot props when `validation` is set: `errors: string[]`. The default slot content is `errors.join(' ')`.

## Accessibility

### Naming

`BuLabel` is a real `<label>`. Pass `for`, or let it fall back to an ambient Input.Root id, so clicking the text moves focus into the control. A label with neither is still visible — it just does not name anything, and the input has to get its accessible name some other way (`label` on the control, `aria-label`, `aria-labelledby`).

### Errors

`BuHelp` with `validation` is `Input.Error`: the region carries `aria-live="polite"` and registers as `aria-errormessage` on the control. That only happens inside an ambient [Input.Root](/components/forms/input). Outside one, `validation` is a no-op that warns in development — the input can still show `is-danger` from its own root, and the help stays empty.

Plain `BuHelp` (no `validation`) is help text. Color it yourself; it is not wired to the control unless you pass `id` and point `aria-describedby` at it.
