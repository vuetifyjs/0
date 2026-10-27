---
title: Md1Button - Material Design 1 Button for Vue
meta:
- name: description
  content: The Material Design 1 button in flat and raised variants, with the dense and persistent footer forms and a glyph through Md1Icon. Built on Vuetify0's Button.
- name: keywords
  content: md1 button, material design 1 button, flat button, raised button, dense button, vue button, vuetify0 button, paper md1
features:
  category: Component
  label: 'C: Md1Button'
  level: 2
  renderless: false
  group: actions
  order: 1
related:
  - /systems/md1
  - /systems/md1/icon
  - /systems/md1/ripple
  - /components/actions/button
---

# Md1Button

<DocsPageFeatures :frontmatter />

The Material Design 1 button. Flat ink or a raised sheet, in the standard, dense and persistent footer forms, with an optional glyph ahead of the label.

<DocsMd1Reference
  href="https://m1.material.io/components/buttons.html"
  title="Buttons"
/>

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](https://m1.material.io/components/buttons.html), the archived page Material Design 1 is pinned to. Metrics, states, colour and placement. This page is the Vue.

## Usage

`Md1Button` is a shell component: fixed anatomy, props for everything, and the default slot is the label. `variant` picks between the two text buttons the guidelines define. Flat is the default; `raised` is the sheet that lifts.

Use one type per container. Raised buttons add dimension to a flat layout and give an action prominence on a busy surface. Flat buttons belong in dialogs and toolbars, where a raised button would be too prominent.

::: ds-example
/systems/md1/button/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <Md1Button />
</template>
```

## Composed on Vuetify0

`Md1Button` renders v0's [Button](/components/actions/button) compound, `Button.Root` and `Button.Content`, with `Button.Icon` around a [Md1Icon](/systems/md1/icon) when `icon` is set, and adds nothing to its behavior. `Button.Content` carries the label and is left out of an icon-only button, which is how `Button.Icon` marks the root `data-solo`. Activation, focus order, the native `disabled` attribute and the `aria-label` fallback for an icon-only button all come from `Button.Root`.

`Button.Root` is also what emits the `data-disabled` and `data-solo` attributes Material Design 1's stylesheet hangs off. `data-variant`, `data-dense` and `data-footer` are Material Design 1's own. Material Design 1 never writes a state class; it styles the attributes v0 publishes.

The first child of the root is a [Md1Ripple](/systems/md1/ripple), the ink reaction the buttons page describes on every press. There is no prop to remove it: the ripple is the spec's press feedback, not an option. There is no `loading` prop either. Material Design 1 buttons have no loading state, so progress belongs in an `Md1ProgressCircular` beside the button.

## Examples

::: ds-example
/systems/md1/button/variants

### Flat and raised

A flat button is text printed on the sheet it sits on: no container, no shadow, ink in the accent colour (`--md1-accent`, Pink A200 in the default theme) so it reads as an action rather than as body text. On press it fills with the pressed overlay, 40% `#999999` on the light theme and 25% `#CCCCCC` on the dark one, drawn by the ripple. It never lifts. The guidelines put flat buttons in dialogs, on toolbars and inline, with padding around them so they can be found.

A raised button is a rectangular sheet of its own: the primary colour (`--md1-primary`, Indigo 500) with white ink at 100%, resting at 2 dp. Pressing it lifts the sheet to 8 dp and fills it with the 700 shade (`--md1-primary-dark`); on release it settles back to rest. Raised buttons add dimension to mostly flat layouts and emphasize an action on busy or wide surfaces. The guidelines call them too prominent inside dialogs.

Both share one set of metrics: 36 dp tall, at least 88 dp wide, 16 dp of padding on each side, 2 dp corners, 8 dp between neighbours, and the Button type style of 14 sp Roboto Medium in capitals. Where the pointer is a mouse, the raised button rests seamed at 0 dp and gains its 2 dp on hover and press, the desktop rule of the elevation page. On hover both variants draw a 12% overlay of their own ink, a tint of the accent on a flat button and a white wash on a raised one: the buttons page states no hover, so the button takes Vuetify 1.5's.[^hover] A device that cannot hover draws none.
:::

::: ds-example
/systems/md1/button/dense

### Dense

When mouse and keyboard are the primary input, the guidelines allow button measurements to be slightly reduced. `dense` is that form: 32 dp tall with a 13 sp label, while the 16 dp padding and the 2 dp radius stay. Reach for it in dense desktop surfaces, a data table's toolbar or a desktop dialog, and keep the 36 dp button for anything a finger will touch.

The guidelines make the reduction optional for mouse-and-keyboard UIs ("can be slightly reduced"), so Material Design 1 exposes it as a prop instead of switching on `(pointer: fine)`: the same app can hold a dense toolbar above standard dialog actions.[^dense] The touch target still extends to 48 dp around the button; the dense form only condenses what is painted. A glyph inside a dense button drops to the 20 dp dense icon size.
:::

::: ds-example
/systems/md1/button/icon

### Icons

`icon` names a role from the Material Design 1 icon set and draws it through `Md1Icon` ahead of the label: 24 dp, hidden from assistive technology because the label already names the action. The guidelines give no icon-to-label gap, so Material Design 1 takes Vuetify 1.5's 16 dp, two steps of the 8 dp grid.[^icon-gap]

Leave the slot empty and the button becomes icon-only. v0 marks it `data-solo`, and Material Design 1 renders the 48 dp circular target with the glyph centred, the shape of every icon button in a Material Design 1 toolbar. Its ink is the primary text ink, 87% black (white on the dark theme), rather than the accent, Vuetify 1.5's icon button.[^icon-ink] An icon-only button has no text, so its accessible name must come from `ariaLabel`; without it Material Design 1 warns in development and v0 falls back to a generic label. Under `dense` the icon-only form takes the icon toggle's dense rule: a 40 dp target around a 20 dp glyph.
:::

::: ds-example
/systems/md1/button/disabled

### Disabled

`disabled` sets the native attribute. The button leaves the tab order, no click fires, and the ripple draws nothing. The ink drops to the disabled opacity, 26% black on the light theme and 30% white on the dark one. A raised container drops to a 12% fill and casts no shadow, so it reads as part of the sheet beneath it rather than as a sheet of its own.

Prefer explaining the precondition next to a disabled button. A disabled control is unfocusable, so a keyboard user never meets it and gets no reason for the missing action. When the reason matters, leave the button enabled and report the problem on activation.
:::

::: ds-example
/systems/md1/button/themes

### Light and dark themes

The guidelines draw every button twice, once on each theme. On the dark theme a flat button keeps its transparent container and its coloured ink; its disabled ink drops to 30% white, where the light theme uses 26% black. A raised button keeps its container and its elevation, and a disabled raised button falls to a 12% white fill with no shadow.

Nothing changes on the button itself: `data-theme="md1-dark"` on any ancestor swaps the tokens it reads, so one surface can hold both themes, as this figure does.
:::

::: ds-example
/systems/md1/button/footer

### Persistent footer

A persistent footer button is a flat button fixed to the bottom of a screen or a dialog, so the action stays available while the content scrolls. The guidelines fix its height at 48 dp; Material Design 1 renders it the width of its container with square corners, a Material Design 1 decision where the page states only the height.[^footer] The guidelines add a divider above it when the content scrolls, and forbid raised buttons in persistent areas; `footer` with `variant="raised"` logs a development warning and is not a spec form.

Use it for the one action a sheet must keep reachable: "Got it" under a notice, "Done" under a long form. The 48 dp height is the touch target itself, so no hit area is added around it, and the label is capitalised by the stylesheet while the source text stays sentence case.
:::

::: ds-example
/systems/md1/button/footer-dialog

### Footer button in a dialog

A dialog with a single acknowledgement can end in a persistent footer button instead of an action row. The button spans the dialog and stays pinned to its bottom edge; when the dialog's content is long enough to scroll, a divider appears above the button so the scrolling text has an edge to pass under.

Pressing the footer button closes the dialog through its own `v-model`. Keep it to one action: a dialog that needs a choice between two takes `Md1Dialog.Actions` instead.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Button.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'flat' \| 'raised'` | `'flat'` | Flat is accent ink on the sheet with no lift. Raised is a primary 500 sheet at 2 dp that lifts to 8 dp and fills with the 700 shade on press; 0 dp at rest and 2 dp on hover under a fine pointer |
| `dense` | `boolean` | `false` | 32 dp tall, 13 sp label: the condensed form for mouse and keyboard layouts |
| `footer` | `boolean` | `false` | The persistent footer button: 48 dp tall (guidelines); full width and square corners (Material Design 1). Always flat; pairing it with `raised` warns in development |
| `icon` | `Md1IconName` | | An `Md1Icon` role drawn ahead of the label; any role registered through `createMd1IconsPlugin` also type-checks. Icon-only without slot content: a 48 dp circular target that requires `ariaLabel` |
| `disabled` | `boolean` | `false` | Sets the native `disabled` attribute: out of the tab order, no activation, 26% ink (30% on dark), a 12% raised fill and no shadow |
| `ariaLabel` | `string` | | Accessible name. Required for icon-only buttons |
| `name` | `string` | | Form field name for v0's hidden input. A standalone button's input is unchecked and submits nothing; it carries a value only when the button is selected inside a v0 `Button.Group` |
| `namespace` | `string` | | The context key `Button.Root` provides to its parts; Material Design 1 forwards it to `Button.Icon` and `Button.Content`. Leave it unset unless a surrounding v0 `Button` context must not collide with this one |

The default slot is the label. There are no named slots.

## Accessibility

`Button.Root` renders a native `<button type="button">`, so activation by Enter and Space, focus order and the implicit `button` role all come from the platform rather than from JavaScript.

### Naming

The accessible name is the default slot's text. The capitals are applied by the stylesheet, so assistive technology reads the sentence-case source text ("Save changes"), not a string of capital letters. When there is no text, an icon-only button, you must pass `ariaLabel`: the glyph inside is `aria-hidden` and contributes nothing. Never solve it by labelling the icon instead; that names the image, not the control.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the button. A disabled button is skipped |
| Enter | Activates the button |
| Space | Activates the button on release. While held, the ink draws from the centre of the button |

### Focus

The guidelines give a focused button a 12% overlay: 12% of the button's own ink on a flat button, a 12% black shade over the colour on a raised one. Material Design 1 draws it for `:focus-visible` only, so keyboard focus shows it and a mouse click does not leave it behind.[^focus] Under forced colours, where backgrounds are dropped, a 2 px outline draws in its place.

### Disabled

| State | Attributes set | Focusable | Activation | Announced as |
|-------|----------------|-----------|------------|--------------|
| enabled | none | Yes | Enter, Space, click | The label, as a button |
| `disabled` | `disabled`, `aria-disabled="true"`, `data-disabled` | No | Blocked | Disabled: present but unavailable |

### Touch target

The 36 dp button answers to a 48 dp tall hit area, the minimum touch target of the metrics page, without taking that space in the layout. In a row, the 8 dp the guidelines put between buttons keeps the targets apart, because the hit area only extends vertically. Stacked buttons need 20 dp between them (8 dp between the 48 dp targets) or the areas overlap. The dense form extends its area further, and the footer and icon-only forms are 48 dp already.

[^hover]: Vuetify 1.5.24, stylus/components/_buttons.styl:54,62-72. The 12% `currentColor` hover overlay on `.v-btn`, cleared under `(hover: none)`.

[^dense]: Our call: the page makes the reduction optional, so it is a prop rather than a `(pointer: fine)` switch.

[^icon-gap]: Vuetify 1.5.24, stylus/components/_icons.styl:25-26. `.v-icon--left` takes a `$grid-gutters.lg` (16 px) end margin.

[^icon-ink]: Vuetify 1.5.24, stylus/components/_buttons.styl:5-6. An uncoloured `.v-btn` takes `text.primary`, which is what an icon button inherits.

[^footer]: Our call: the page fixes only the 48 dp height, and a footer that spans its container reads as part of the edge.

[^focus]: Our call: the page states the overlay, not when it shows; `:focus-visible` keeps it off mouse clicks. The forced-colours outline is ours too.
