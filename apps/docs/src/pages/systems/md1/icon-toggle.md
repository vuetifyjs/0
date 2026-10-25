---
title: Md1IconToggle - Material Design 1 Icon Toggle for Vue
meta:
- name: description
  content: The Material Design 1 icon toggle, a single choice selected or deselected, drawn as a glyph in a 48 dp target with a bounded or unbounded ripple. Built on Vuetify0's Toggle.
- name: keywords
  content: md1 icon toggle, material design 1 icon toggle, star toggle, toggle button, aria-pressed, vue icon toggle, vuetify0 toggle, paper md1
features:
  category: Component
  label: 'C: Md1IconToggle'
  level: 2
  renderless: false
  group: actions
  order: 5
related:
  - /systems/md1
  - /systems/md1/toggle-buttons
  - /systems/md1/icon
  - /systems/md1/ripple
  - /components/actions/toggle
---

# Md1IconToggle

<DocsPageFeatures :frontmatter />

The Material Design 1 icon toggle. One choice, selected or deselected, drawn as a glyph in a 48 dp touch target: the star on a message, the bookmark on an article.

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](https://m1.material.io/components/buttons.html), the archived page Material Design 1 is pinned to (the icon toggles section). Icon opacities come from the [icons page](https://m1.material.io/style/icons.html). This page is the Vue.

## Usage

`Md1IconToggle` is a shell component: fixed anatomy and props for everything. `icon` is the glyph while the toggle is off, `iconOn` the glyph while it is on, and `v-model` is the pressed state. `ariaLabel` is required because the toggle has no text.

The guidelines place icon toggles in app bars, toolbars, action buttons and toggles. For a set of related options, use [Md1ToggleButtons](/systems/md1/toggle-buttons) instead.

::: ds-example
/systems/md1/icon-toggle/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1IconToggle } from '@paper/md1'
</script>

<template>
  <Md1IconToggle />
</template>
```

## Composed on Vuetify0

`Md1IconToggle` renders v0's [Toggle](/components/actions/toggle) compound: `Toggle.Root` is the native `<button>` and owns the pressed state, the click and the `aria-pressed` attribute, and a renderless `Toggle.Indicator` reads that state to pick the glyph. The glyph itself draws through [Md1Icon](/systems/md1/icon), hidden from assistive technology.

`Toggle.Root` emits the `data-state` (`on` or `off`) and `data-disabled` attributes Material Design 1's stylesheet hangs off; `data-unbounded` is Material Design 1's own. The first child of the root is a [Md1Ripple](/systems/md1/ripple), the press feedback the guidelines give every button.

## Examples

::: ds-example
/systems/md1/icon-toggle/basic

### Star

The canonical icon toggle: an outlined star while off, a filled star while on. `icon` names the off glyph and `iconOn` the on glyph, both roles of the Material Design 1 icon set, and `v-model` holds the boolean. Each click flips the state, and v0 publishes it to assistive technology as `aria-pressed`, so a screen reader announces "Star, toggle button, pressed".

The glyph is the 24 dp system icon centred in the 48 dp touch target of the metrics page. The note beside the toggle is the example's own status line; in an app the changed glyph is the feedback, and the guidelines need nothing more.
:::

::: ds-example
/systems/md1/icon-toggle/ripple

### Bounded and unbounded ink

The buttons page lets an icon toggle's ink run bounded or unbounded. Unbounded is the default:[^1] a 48 dp circle of ink centred on the toggle, whatever the press point, reaching past the 24 dp glyph to the edge of the touch target. Set `:unbounded="false"` and the ink grows from the press point and is clipped to the toggle's circle.

Both inks paint the pressed overlay of the buttons page, 40% `#999999` on the light theme and 25% `#CCCCCC` on the dark one. A keyboard press draws the ink from the centre. Under reduced motion the ink is a static fill that clears on release.
:::

::: ds-example
/systems/md1/icon-toggle/states

### States

Off, on, and both again disabled. The ink follows the icons page's opacity tiers: an off toggle draws at the inactive tier, 38% black (50% white on the dark theme), and an on toggle at the active tier, 54% black (100% white). Keyboard focus lifts the glyph to the focused tier, 87% black (100% white), and fills the 48 dp circle with 12% of the glyph's own ink: the buttons page ties an icon toggle's focus indicator to the icon's colour and gives focus a 12% overlay. The circle is what shows focus on an on toggle in the dark theme, where the active and focused tiers are both 100% white and the glyph cannot brighten.

The guidelines draw a disabled toggle only as an image, so Material Design 1 gives it the buttons page's disabled ink, 26% black (30% white).[^2] A disabled toggle keeps its glyph, so an on toggle still reads as on. It leaves the tab order, ignores clicks and draws no ink.
:::

::: ds-example
/systems/md1/icon-toggle/glyph

### One glyph

Leave `iconOn` out and the toggle draws the same glyph in both states; only the ink tells them apart, the 38% inactive tier against the 54% active one. Use it for a glyph that has no outlined form in the icon set, such as the bookmark here.

Prefer two glyphs where the set has them. A change of shape survives colour blindness and low contrast better than a change of opacity, and the 16 point gap between the two tiers is the smallest signal the toggle can give.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1IconToggle.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | The pressed state; bind it with `v-model` |
| `icon` | `Md1IconName` | | Required. The glyph role drawn while the toggle is off |
| `iconOn` | `Md1IconName` | `icon` | The glyph role drawn while the toggle is on. Without it the state reads from the ink alone |
| `unbounded` | `boolean` | `true` | The 48 dp circle of ink centred on the toggle and not clipped. `false` grows the ink from the press point inside the toggle's circle |
| `ariaLabel` | `string` | | Accessible name. Required: the glyph is hidden from assistive technology. Missing it (and `aria-labelledby`) warns in development |
| `disabled` | `boolean` | `false` | Sets the native `disabled` attribute: out of the tab order, no toggle, no ink, 26% ink (30% on dark) |
| `namespace` | `string` | | The context key `Toggle.Root` provides to `Toggle.Indicator`. Leave it unset unless a surrounding v0 `Toggle` must not collide with this one |

There is no slot: the glyph is the content. In a host carrying `data-dense` (a dense toolbar or list), the toggle condenses to the icons page's dense form, a 20 dp glyph in a 40 dp target.

## Accessibility

`Toggle.Root` renders a native `<button type="button">` with `aria-pressed`, the APG toggle button pattern. Activation by Enter and Space and the focus order come from the platform.

### Naming

The glyph is `aria-hidden`, so the name must come from `ariaLabel` or from `aria-labelledby` pointing at a visible caption. Name the action, not the state: "Star", not "Starred" or "Not starred". `aria-pressed` already carries the state, and a label that changes with it would announce the state twice.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the toggle. A disabled toggle is skipped |
| Enter | Toggles the state |
| Space | Toggles the state. While held, the ink draws from the centre |

### States

| State | Attributes set | Focusable | Activation | Announced as |
|-------|----------------|-----------|------------|--------------|
| off | `aria-pressed="false"`, `data-state="off"` | Yes | Enter, Space, click | The label, toggle button, not pressed |
| on | `aria-pressed="true"`, `data-state="on"` | Yes | Enter, Space, click | The label, toggle button, pressed |
| `disabled` | `disabled`, `data-disabled` | No | Blocked | Disabled, with its pressed state |

[^1]: Our call: the page allows either ink; unbounded matches the icon buttons in every toolbar figure.
[^2]: Our call: the page draws the disabled toggle only as an image; the buttons page's disabled ink is the nearest stated value.
