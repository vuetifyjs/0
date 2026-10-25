---
title: Md1Checkbox - Material Design 1 Checkbox for Vue
meta:
- name: description
  content: The Material Design 1 checkbox, an 18 dp square filled with the accent colour and a white check when on, with its inline label, disabled inks, the touch-only radial reaction and an indeterminate extension. Built on Vuetify0's Checkbox.
- name: keywords
  content: md1 checkbox, material design 1 checkbox, selection controls, indeterminate checkbox, vue checkbox, vuetify0 checkbox, paper md1
features:
  category: Component
  label: 'C: Md1Checkbox'
  level: 2
  renderless: false
  group: forms
  order: 2
related:
  - /systems/md1
  - /systems/md1/radio
  - /systems/md1/switch
  - /components/forms/checkbox
---

# Md1Checkbox

<DocsPageFeatures :frontmatter />

The Material Design 1 checkbox. It selects any number of options from a set: an outlined square when off, filled with the accent colour and a white check when on.

> [!NOTE]
> Reference: [Selection controls, Material Design 1 guidelines](https://m1.material.io/components/selection-controls.html), the archived page Material Design 1 is pinned to. Colours and usage come from the page text; the geometry is measured from its spec sheets. This page is the Vue.

## Usage

`Md1Checkbox` is a shell component: fixed anatomy, props for everything, and `v-model` is a boolean. `label` is the visible text beside the box; the default slot replaces it with richer content.

Use checkboxes when several options from a list can be on at once. For a single option on its own, the guidelines prefer a [switch](/systems/md1/switch).

::: ds-example
/systems/md1/checkbox/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Checkbox } from '@paper/md1'
</script>

<template>
  <Md1Checkbox />
</template>
```

## Composed on Vuetify0

`Md1Checkbox` renders v0's [Checkbox](/components/forms/checkbox) compound, `Checkbox.Root` and `Checkbox.Indicator`, inside a native `<label>`. The root is a `<button role="checkbox">`; it owns the model, `aria-checked`, the Space and click handlers, and the hidden form input it adds when `name` is set. The indicator holds the check glyph, drawn through [Md1Icon](/systems/md1/icon) as the `check` role (`remove` while indeterminate), and is hidden while the box is off.

`Checkbox.Root` emits the `data-state` (`checked`, `unchecked`, `indeterminate`) and `data-disabled` attributes Material Design 1's stylesheet hangs off. The visible label is a sibling span that the button's `aria-labelledby` points at, and the `<label>` around both makes the text a click target without a second handler.

The first child of the button is an unbounded [Md1Ripple](/systems/md1/ripple). The guidelines draw the 48 dp radial reaction only on form factors that favour touch, so Material Design 1 hides the ink under a fine pointer.

## Examples

::: ds-example
/systems/md1/checkbox/states

### On, off and disabled

The box is 18 dp square with a 2 dp border and 2 dp corners, centred in a 24 dp control. Off, it is an outline in 54% black on the light theme and 70% white on the dark one. On, it fills with the accent colour (`--md1-accent`, Pink A200 in the default theme) and the check is drawn in white across the square. Both themes use the accent itself for the on state; only the switch moves to the 200 shade on dark.

Disabled drops the whole control to 26% black (30% white on dark), and the check of a disabled box is cut out of the square in the sheet colour, as the spec sheets draw it. The label takes the disabled text ink. A disabled checkbox ignores clicks on the box and on its label and draws no ripple.

The guidelines give no gap between the control and its label; Material Design 1 uses 8 dp from the 24 dp control, one step of the grid,[^gap] and each row is 48 dp tall so stacked checkboxes keep their touch targets apart.[^row] Those two values are decisions, not spec numbers. Stack checkboxes as this example does: the 48 dp target reaches 12 dp beyond the control, so side by side at an 8 dp gap it would cover the end of the previous label.
:::

::: ds-example
/systems/md1/checkbox/indeterminate

### Indeterminate

Material Design 1 draws no mixed state, so `indeterminate` is a declared extension:[^indeterminate] a data table's select-all needs one, and v0 provides it. The box fills as it does when on and draws a dash (the `remove` role) instead of the check, and the button reports `aria-checked="mixed"`.

The parent here is a computed view of its children: it is indeterminate while some toppings are chosen, on when all are, and a click sets every child to the parent's new value. `indeterminate` is the consumer's to clear; the checkbox never decides it.
:::

::: ds-example
/systems/md1/checkbox/themes

### Light and dark themes

The same controls on each theme. On the dark theme the checked box keeps the accent, the empty box's border rises to 70% white, and a disabled box drops to 30% white whether it is checked or not. Focus a box with Tab, or press one on a touch screen, to see the 48 dp halo; the halo is a touch affordance, so a mouse pointer does not draw it.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Checkbox.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | | `v-model`: on or off |
| `label` | `string` | | The visible text beside the box; the control's `aria-labelledby` points at it. The default slot replaces it |
| `indeterminate` | `boolean` | `false` | The mixed state, a declared extension: the box fills and draws a dash, `aria-checked="mixed"` |
| `disabled` | `boolean` | `false` | 26% ink (30% on dark), no activation, no ripple, disabled label text |
| `value` | `unknown` | | Value submitted through the hidden input, and the ticket value inside a v0 `Checkbox.Group` |
| `name` | `string` | | Form field name; renders v0's hidden checkbox input, checked with the model |
| `ariaLabel` | `string` | | Accessible name for a checkbox with no visible label, such as a data table row |
| `namespace` | `string` | | The context key `Checkbox.Root` provides to its indicator. Leave it unset unless a surrounding v0 `Checkbox` context must not collide with this one |

The default slot is the label. There are no named slots.

## Accessibility

The control is a `<button role="checkbox">` with `aria-checked`, the WAI-ARIA Checkbox pattern. Its name is the visible label, through `aria-labelledby`. A checkbox with no visible label needs `ariaLabel`, or an `aria-labelledby` naming text elsewhere on the page (a data table row's cell), which Material Design 1 moves from the `<label>` root onto the control. Material Design 1 warns in development when none of these is set.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the checkbox |
| Space | Toggles the checkbox |
| Enter | Toggles the checkbox (the native button's activation) |

### Focus

Keyboard focus draws the 48 dp radial reaction around the control: 6% black off (10% white on dark) and 10% of the accent on, the values measured from the spec sheets. Material Design 1 draws it for `:focus-visible` on every pointer type,[^halo] so a keyboard user on a desktop still sees where focus is; the touch-only rule of the guidelines applies to the press ink. A focused disabled checkbox draws the grey halo, on or off, as the spec sheets draw the disabled focused state. Under forced colours a transparent 2 px outline draws in its place.

### Disabled

| State | Attributes set | Focusable | Activation |
|-------|----------------|-----------|------------|
| enabled | `tabindex="0"` | Yes | Space, Enter, click on the box or label |
| `disabled` | `aria-disabled="true"`, `data-disabled` | Yes: the button stays in the tab order, so the option is still discoverable | Blocked |

### Touch target

The 24 dp control answers to a 48 dp circle around it, and the whole label row is a click target.

[^gap]: Vuetify 1.5.24, stylus/components/_selection-controls.styl:42. Vuetify 1.5 sets the same 8 px between control and label.

[^row]: Our call: a 48 dp row is the touch target, so stacked rows never overlap.

[^indeterminate]: Our call: `Md1DataTable`'s select-all needs a mixed state, and v0 provides one.

[^halo]: Our call: the page draws the halo for touch; without it, desktop keyboard focus would have no indicator. Still an open ruling in SPEC.
