---
title: EmCheckbox - Emerald Checkbox for Vue
meta:
- name: description
  content: Emerald's checkbox — three sizes, an indeterminate state, and a click-anywhere label, composed on Vuetify0's headless Checkbox compound.
- name: keywords
  content: emerald checkbox, vue checkbox, design system checkbox, indeterminate checkbox, vuetify0 checkbox, paper emerald
features:
  category: Component
  label: 'C: EmCheckbox'
  level: 2
  renderless: false
  order: 12
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/forms/checkbox
---

# EmCheckbox

<DocsPageFeatures :frontmatter />

The boolean control — three sizes, a mixed state for partial selections, and a label that is part of the control, so clicking the text toggles the box.

## Usage

`EmCheckbox` is a shell component: fixed anatomy, so everything is a prop and the default slot is the label. `v-model` is the checked state as a plain `boolean`.

The whole component is one `<label>` — box, glyph and text — so the entire surface is a click target and the cursor says so. The label text is not decoration you position next to the control; it *is* the control, and the same text is what names the control for assistive technology (see [Accessibility](#accessibility)).

::: ds-example
/systems/emerald/checkbox/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmCheckbox } from '@paper/emerald'
</script>

<template>
  <EmCheckbox />
</template>
```

## Composed on v0

`EmCheckbox` renders v0's [Checkbox](/components/forms/checkbox) compound — `Checkbox.Root` and `Checkbox.Indicator` — and adds nothing to its behavior.

The split is clean. `Checkbox.Root` owns the state machine: `role="checkbox"` on a native button host, `aria-checked` including `mixed`, the Space handler, the `data-state` / `data-disabled` attributes every Emerald style rule hangs off, and the hidden native input that appears when `name` is set. Emerald owns everything you can see: the bordered box (a decorative `aria-hidden` span), the mark inside it, and the sizing tokens.

The mark is where `Checkbox.Indicator` earns its place. The indicator exposes `isMixed` to its slot, and Emerald renders a single [EmIcon](/systems/emerald/icon) that swaps between the `check` and `minus` glyphs off that flag. The indicator hides itself with `visibility` rather than unmounting, so the box never reflows when the state flips — the glyph is simply invisible until there is something to show.

One inherited capability worth knowing about: `Checkbox.Root` is dual-mode, and `EmCheckbox` leaves the group namespace at its default. Rendered inside a v0 `Checkbox.Group`, it registers with the group and defers its checked state to it — the `v-model` is ignored in that mode. Emerald does not ship a group part yet, so treat that as a v0 escape hatch rather than a documented Emerald surface.

## Examples

::: ds-example
/systems/emerald/checkbox/sizes

### Sizes

`size` steps the control geometry through Emerald's checkbox tokens — a 16px box for `sm`, 20px for `md`, 24px for `lg` — and scales the mark with it. The icon's stroke is restated along the way — the spec's heavier mark weight translated onto the icon set's grid — so the glyph reads as a mark rather than the lighter line work of an icon.

What `size` does **not** change is the label. The text stays on the `b1` body step at every size, so a small checkbox is a smaller box beside the same text, not a smaller row. Pick `sm` for dense surfaces — table rows, filter panels — where the default box reads too heavy, and `lg` where the checkbox is the point of the surface, like a consent line users must notice.
:::

::: ds-example
/systems/emerald/checkbox/indeterminate

### Indeterminate

`indeterminate` shows the mixed state: a minus glyph, `aria-checked="mixed"`, and the same filled box as checked. It is the state for a parent whose children disagree — some selected, some not.

The prop is presentation you own, not state the component manages. While `indeterminate` is true the checkbox *shows* mixed regardless of what the model says, and clicking it still just flips the boolean model — it does not clear the prop. The contract is the loop in this example: derive `indeterminate` from the children, and let the parent's toggle rewrite the children so the derived flag collapses on its own. If you set `indeterminate` from static state instead, the checkbox will look mixed forever, no matter how often it is clicked.

Note the parent binds `model-value` and listens for the update rather than using `v-model` — its checked state is derived from the children too, so there is nothing for a two-way binding to write to.
:::

::: ds-example
/systems/emerald/checkbox/disabled

### Disabled

`disabled` blocks the toggle in every form it can arrive — click, label click, Space — and drops the whole control to Emerald's neutral tokens: grey box, grey text, the mark kept white on a neutral fill, `not-allowed` cursor across the entire label.

The state is preserved, not erased. A disabled checkbox keeps showing checked or mixed exactly as it was, just without the color that invites interaction — which is what you want when a selection is locked by a precondition rather than discarded by one.

One behavior to know: a disabled `EmCheckbox` stays in the tab order. The root is a native button with no `disabled` attribute — the block happens in the state layer — so keyboard users can still reach it and hear it announced as disabled, they just cannot change it. See [Accessibility](#accessibility) for why that is the announced-but-inert pattern rather than a gap.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | — | Checked state |
| `indeterminate` | `boolean` | `false` | Shows the mixed state — minus glyph, `aria-checked="mixed"`. Presentation-only: activation flips the model but never clears this prop |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control geometry step. Scales the box and the mark; the label stays on the body scale |
| `disabled` | `boolean` | `false` | Blocks toggling and greys the control. The root stays focusable and announces `aria-disabled` |
| `label` | `string` | — | Accessible name when no default-slot label is rendered |
| `name` | `string` | — | Form field name; renders a hidden native checkbox when set |
| `value` | `unknown` | — | Submitted value for the hidden input (`'on'` when unset; objects are JSON-serialized) |
| `namespace` | `string` | — | Which v0 `Checkbox` instance the parts bind to. Only needed when nesting |

The default slot is the visible label. There are no named slots.

## Accessibility

`Checkbox.Root` renders a native `<button type="button">` carrying `role="checkbox"`, so the state is announced through `aria-checked` — `true`, `false`, or `mixed` when `indeterminate` is set — and matches the visual `data-state` one for one.

### Naming

A wrapping `<label>` does not name a `<button>` the way it names an `<input>`, so Emerald names the control by reference instead: the slot text renders in a sibling span with a generated id, and the root points at it with `aria-labelledby`. The result is the same as a native pairing — one accessible name, one click target — without relying on an association the platform does not provide for buttons.

When there is no visible text, pass `label`; it becomes the root's `aria-label`. An `EmCheckbox` with neither slot content nor `label` is an unnamed control, and a screen reader will announce only "checkbox" with no hint of what it governs.

### Keyboard

Space toggles — that is the checkbox pattern's key, and `Checkbox.Root` handles it directly. Because the host is a native button, Enter activates it as well; the extra key is a platform bonus, not something to design around.

Clicking the label text toggles too: the wrapper is a real `<label>` and the platform forwards its activation to the button inside.

### Disabled

`disabled` sets `aria-disabled` and `data-disabled` and blocks activation in the state layer — click, label forwarding and Space all hit the same guard. What it does **not** set is the native `disabled` attribute, so the control keeps its place in the tab order. A keyboard user tabbing through a form still encounters the checkbox and hears it announced as disabled, rather than having it silently vanish from navigation; the trade is one extra tab stop for a state that stays discoverable.

### Indeterminate

`aria-checked="mixed"` is announced as partially checked. Activation while mixed writes the boolean model like any other click — the announcement follows whatever your state derives next, so keep the prop wired to real child state as shown in the [indeterminate example](#indeterminate), or the reader will hear "mixed" forever.

### Forms

When `name` is set, v0 renders a visually hidden native `<input type="checkbox">` — `inert`, `tabindex="-1"`, never focusable — that mirrors the checked and disabled state and submits `value` (or `'on'`) with the surrounding form. It exists purely for form serialization; assistive technology interacts with the `role="checkbox"` button, never the mirror.

### Focus

The focus ring is an outline on the box, shown only for `:focus-visible` — keyboard focus draws it, a mouse click does not leave a ring behind.
