---
title: Md1ToggleButtons - Material Design 1 Toggle Buttons for Vue
meta:
- name: description
  content: The Material Design 1 toggle buttons, a group of at least three related options with exclusive or multiple selection, as text, glyphs or both. Built on Vuetify0's Toggle.
- name: keywords
  content: md1 toggle buttons, material design 1 toggle buttons, button group, segmented control, exclusive selection, vue toggle group, vuetify0 toggle, paper md1
features:
  category: Component
  label: 'C: Md1ToggleButtons'
  level: 2
  renderless: false
  group: actions
  order: 6
related:
  - /systems/md1
  - /systems/md1/icon-toggle
  - /systems/md1/button
  - /components/actions/toggle
---

# Md1ToggleButtons

<DocsPageFeatures :frontmatter />

The Material Design 1 toggle buttons. A row of at least three related options, selected one at a time or several at once, labelled with text, a glyph, or both.

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](https://m1.material.io/components/buttons.html), the archived page Material Design 1 is pinned to (the toggle buttons section). The page draws the group's metrics only as images; the values on this page are Material Design 1 decisions, marked where they appear. This page is the Vue.

## Usage

`Md1ToggleButtons` is a compound: the root owns the selection and each `Md1ToggleButtons.Item` is one option. `v-model` is the selected `value`, or an array of values under `multiple`. `mandatory` keeps one option selected.

::: ds-example
/systems/md1/toggle-buttons/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1ToggleButtons } from '@paper/md1'
</script>

<template>
  <Md1ToggleButtons>
    <Md1ToggleButtons.Item />
  </Md1ToggleButtons>
</template>
```

## Composed on Vuetify0

`Md1ToggleButtons` renders v0's [Toggle](/components/actions/toggle) compound: the root is `Toggle.Group`, which owns the selection (single or multiple, decided once at setup), the `v-model` and the `role="group"` container, and each item is a `Toggle.Root` that registers with it and publishes `aria-pressed`. Exclusive selection, `mandatory` and per-item `disabled` are v0's.

`Toggle.Group` emits `data-disabled` and `data-orientation`; `Toggle.Root` emits `data-state` (`on` or `off`) and `data-disabled` on each item. `data-multiple` on the root and `data-solo` on an icon-only item are Material Design 1's own. Each item hosts a bounded [Md1Ripple](/systems/md1/ripple) as its first child, and glyphs draw through [Md1Icon](/systems/md1/icon).

The root also counts its items through a registry so it can hold the guidelines' minimum: a group of fewer than three options warns in development. An item rendered outside a group warns too, and falls back to a standalone toggle.

## Examples

::: ds-example
/systems/md1/toggle-buttons/basic

### Exclusive selection

The default group is exclusive: selecting an option deselects the one before it, and pressing the selected option again clears the selection. That is the guidelines' "exclusive and unselected" combination, and `v-model` reads `undefined` while nothing is chosen.

Each option is a 36 dp flat button in the Button type style, 14 sp Roboto Medium in capitals with 8 dp of side padding. The page shows the group only as an image, so the group is Vuetify 1.5's button toggle: a strip in the surface colour with 2 dp corners and no outline, which rises to 2 dp once an option is selected, so layout reads as one control the way the guidelines ask. Each item still answers to a 48 dp tall hit area.

Unselected options sit at 40% opacity of the primary ink. The selected option returns to full opacity under the buttons' 12% overlay of its own ink, with a 1 dp seam after it in the disabled-button ink; unselected neighbours have no seam between them. The faded options read at about 2.4:1 on white, under the contrast floor, as Vuetify 1.5 drew them. Name the group with `label` (or `aria-labelledby`) so a screen reader announces what the options choose between.
:::

::: ds-example
/systems/md1/toggle-buttons/multiple

### Multiple selection

`multiple` lets several options be selected at once, the guidelines' Bold, Italic, Underline example. `v-model` is then an array of the selected values, and each option toggles on its own. This is the "multiple and unselected" combination: every option can be released.

`multiple` is read once when the group mounts, because v0 builds a different selection model for each mode. Switching between exclusive and multiple means rendering a new group, with a `key` if the same element is reused.
:::

::: ds-example
/systems/md1/toggle-buttons/mandatory

### Mandatory

`mandatory` keeps the last selected option selected: pressing it again does nothing. Give the model an initial value so the group never starts empty; that is the guidelines' "exclusive only" combination, the right shape for a setting that always has a value, such as text alignment.

`mandatory="force"` goes one step further and selects the first enabled option on mount when the model is empty. It works with `multiple` as well, where it keeps at least one option selected.
:::

::: ds-example
/systems/md1/toggle-buttons/icons

### Icons

`icon` on an item draws a glyph from the Material Design 1 icon set through `Md1Icon` ahead of the label, at 24 dp with Vuetify 1.5's 10 dp gap (the guidelines state no icon-to-label gap). Leave the slot empty and the item becomes icon-only: a 48 dp square around the centred glyph, marked `data-solo`.

An icon-only item has no text, so it needs `ariaLabel`; without one Material Design 1 warns in development. The glyph is hidden from assistive technology in both forms, so the label in the slot or `ariaLabel` is always the item's whole name.
:::

::: ds-example
/systems/md1/toggle-buttons/disabled

### Disabled

`disabled` on the root disables every item; on an item it disables that option alone and leaves its siblings selectable. A disabled item takes the native `disabled` attribute, leaves the tab order, ignores clicks, draws no ink and drops its ink to the buttons page's disabled opacity, 26% black (30% white on the dark theme). A selected item keeps its 12% overlay when it is disabled.

v0 does not select into a disabled group, so a group that is disabled from the start shows no selection even when `v-model` holds a value. To show a locked choice, render the group enabled and disable it afterwards, or disable the items that are not chosen.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1ToggleButtons.vue and
     Md1ToggleButtonsItem.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T \| T[]` | | The selected value, or the array of selected values under `multiple`; bind it with `v-model` |
| `multiple` | `boolean` | `false` | Several options at once. Read once at mount |
| `mandatory` | `boolean \| 'force'` | `false` | Keep the last selected option selected; `'force'` also selects the first enabled option on mount |
| `disabled` | `boolean` | `false` | Disables every item |
| `label` | `string` | | Accessible name for the group (`aria-label`) |
| `ariaLabelledby` | `string` | | Id of a visible element that names the group |
| `ariaDescribedby` | `string` | | Id of an element that describes the group |
| `namespace` | `string` | | The context key `Toggle.Group` provides to its items. Set the same key as `groupNamespace` on every item, and only to nest two groups |

The default slot holds the items. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1ToggleButtons.Item` | `value`, `icon`, `ariaLabel`, `disabled`, `groupNamespace` | One option: a native `<button>` with `aria-pressed`. The default slot is the label; with `icon` set and no slot it is icon-only and needs `ariaLabel`. Also exported flat as `Md1ToggleButtonsItem` |

## Accessibility

The root is a `role="group"` container named by `label` or `aria-labelledby`, and each item is a native `<button type="button">` with `aria-pressed`, the APG toggle button pattern applied to every option. Assistive technology announces each option as a toggle button and its pressed state.

### Keyboard

Every enabled item is its own tab stop; v0's toggle group binds no arrow-key navigation.

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus between the items and out of the group. Disabled items are skipped |
| Enter | Toggles the focused item |
| Space | Toggles the focused item. While held, the ink draws from the centre of the item |

### Focus

Keyboard focus draws the buttons page's 12% overlay in the item's own ink, and hovering an item draws the same overlay; a mouse click leaves nothing behind once the pointer moves away. Under forced colours a 2 px outline draws in its place.

### States

| State | Attributes set | Focusable | Activation | Announced as |
|-------|----------------|-----------|------------|--------------|
| not selected | `aria-pressed="false"`, `data-state="off"` | Yes | Enter, Space, click | The label, toggle button, not pressed |
| selected | `aria-pressed="true"`, `data-state="on"` | Yes | Enter, Space, click (blocked on the last selected item under `mandatory`) | The label, toggle button, pressed |
| `disabled` | `disabled`, `data-disabled` | No | Blocked | Disabled, with its pressed state |
