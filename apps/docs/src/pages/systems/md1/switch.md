---
title: Md1Switch - Material Design 1 Switch for Vue
meta:
- name: description
  content: The Material Design 1 switch, a 20 dp thumb at 1 dp elevation over a 36 x 14 dp track in the accent colour when on, with its inline label, disabled and dark theme values. Built on Vuetify0's Switch.
- name: keywords
  content: md1 switch, material design 1 switch, selection controls, toggle switch, vue switch, vuetify0 switch, paper md1
features:
  category: Component
  label: 'C: Md1Switch'
  level: 2
  renderless: false
  group: forms
  order: 4
related:
  - /systems/md1
  - /systems/md1/checkbox
  - /systems/md1/radio
  - /components/forms/switch
---

# Md1Switch

<DocsPageFeatures :frontmatter />

The Material Design 1 switch. It turns a single setting on or off, and its inline label says which setting.

<DocsMd1Reference
  href="https://m1.material.io/components/selection-controls.html"
  title="Selection controls"
/>

> [!NOTE]
> Colours and usage come from the page text; the geometry is measured from its spec sheets.

## Usage

`Md1Switch` is a shell component: `v-model` is a boolean and `label` is the inline label. The guidelines require that label: the option the switch controls, and its state, must be clear from it.

::: ds-example
/systems/md1/switch/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Switch } from '@paper/md1'
</script>

<template>
  <Md1Switch />
</template>
```

## Composed on Vuetify0

`Md1Switch` renders v0's [Switch](/components/forms/switch) compound, `Switch.Root`, `Switch.Track` and `Switch.Thumb`, inside a native `<label>`. The root is a `<button role="switch">` that owns the model, `aria-checked`, the Space and click handlers and the hidden input added under `name`; the track and thumb are `aria-hidden` and carry `data-state`.

v0 hard-codes `dir="ltr"` on the track so the thumb's travel is the same in every direction. Material Design 1 mirrors the track with `scaleX(-1)` under right-to-left text, so the off thumb rests at the start edge there too.

The first child of the button is an unbounded [Md1Ripple](/systems/md1/ripple). Its ink is centred on the thumb and travels with it; under a fine pointer it is hidden, because the guidelines draw the radial reaction only where touch is favoured.

## Examples

::: ds-example
/systems/md1/switch/states

### On, off and disabled

The track is a 36 x 14 dp pill; the thumb is a 20 dp circle that overhangs it by 3 dp above and below, sits flush with either end and travels 16 dp. The thumb rests at 1 dp, the switch's entry on the elevation page.

Off, the thumb is Grey 50 on a 38% black track. On, the thumb takes the accent colour and the track the same colour at 50%. Disabled, in either position, the thumb is Grey 400 on a 12% black track, and the label takes the disabled text ink.

The dark theme changes every one of those: Grey 400 on a 30% white track off, the accent's 200 shade (`--md1-accent-control`, Pink 200) for thumb and track on, Grey 800 on a 10% white track disabled. Unlike the checkbox and radio, which keep the accent itself on dark, the switch moves to the lighter shade.

Stack switches as this example does: the 48 dp target reaches 14 dp beyond the control, so side by side at an 8 dp gap it would cover the end of the previous label.
:::

::: ds-example
/systems/md1/switch/settings

### A settings column

Switches suit independent settings that take effect at once. Each row is 48 dp tall with the label 8 dp from the control, so a column of switches keeps the touch targets apart without extra spacing; the 8 dp gap is a Material Design 1 decision, as the page gives no value.[^gap]

When a switch sits in a list tile, the tile's text names it: place it in the tile's secondary action column and pass `ariaLabel` instead of `label`, so the setting is not read twice.
:::

::: ds-example
/systems/md1/switch/themes

### Light and dark themes

The same switches on each theme. On the dark theme an on switch takes the dark-theme accent control colour, the 200 hue, with its track at 50%; an off thumb is Grey 400 on a 30% white track, and a disabled thumb Grey 800 on a 10% track. The thumb sits at 1 dp on both themes.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Switch.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | | `v-model`: on or off |
| `label` | `string` | | The inline label naming the setting; the control's `aria-labelledby` points at it. The default slot replaces it |
| `disabled` | `boolean` | `false` | Grey 400 thumb on a 12% track (Grey 800 on 10% white on dark), no activation, no ripple |
| `value` | `unknown` | | Value submitted through the hidden input, and the ticket value inside a v0 `Switch.Group` |
| `name` | `string` | | Form field name; renders v0's hidden checkbox input, checked with the model |
| `ariaLabel` | `string` | | Accessible name for a switch with no visible label |
| `namespace` | `string` | | The context key `Switch.Root` provides to the track and thumb |

The default slot is the label. There are no named slots.

## Accessibility

The control is a `<button role="switch">` with `aria-checked`, the WAI-ARIA Switch pattern. Its name is the inline label, through `aria-labelledby`. A switch with no visible label takes `ariaLabel`, or an `aria-labelledby` naming the list tile text, which Material Design 1 moves from the `<label>` root onto the control. Material Design 1 warns in development when a switch has no name. Keep the label stable: the switch already announces on and off, so a label that flips with the state says it twice.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the switch |
| Space | Toggles the switch |
| Enter | Toggles the switch (the native button's activation) |

### Focus

Keyboard focus draws the 48 dp radial reaction centred on the thumb: 6% black off (10% white on dark) and 10% of the accent on. Material Design 1 draws it for `:focus-visible` on every pointer type;[^halo] the touch-only rule of the guidelines applies to the press ink. A focused disabled switch draws the grey halo, on or off, as the spec sheets draw the disabled focused state.

### Disabled

| State | Attributes set | Focusable | Activation |
|-------|----------------|-----------|------------|
| enabled | `tabindex="0"` | Yes | Space, Enter, click on the switch or label |
| `disabled` | `aria-disabled="true"`, `data-disabled` | Yes: the button stays in the tab order, so the setting is still discoverable | Blocked |

### Touch target

The radial reaction is also the hit area: a 48 dp circle around the thumb. The whole label row is a click target as well.

[^gap]: Vuetify 1.5.24, stylus/components/_selection-controls.styl:42. Vuetify 1.5 sets the same 8 px between control and label.

[^halo]: Our call: the page draws the halo for touch; without it, desktop keyboard focus would have no indicator. Still an open ruling in SPEC.
