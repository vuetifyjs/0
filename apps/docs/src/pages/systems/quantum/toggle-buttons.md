---
title: QuToggleButtons - Quantum Toggle Buttons for Vue
meta:
- name: description
  content: The Material Design 1 toggle buttons, a group of at least three related options with exclusive or multiple selection, as text, glyphs or both. Built on Vuetify0's Toggle.
- name: keywords
  content: quantum toggle buttons, material design 1 toggle buttons, button group, segmented control, exclusive selection, vue toggle group, vuetify0 toggle, paper quantum
features:
  category: Component
  label: 'C: QuToggleButtons'
  level: 2
  renderless: false
  group: actions
  order: 6
related:
  - /systems/quantum
  - /systems/quantum/icon-toggle
  - /systems/quantum/button
  - /components/actions/toggle
---

# QuToggleButtons

<DocsPageFeatures :frontmatter />

The Material Design 1 toggle buttons. A row of at least three related options, selected one at a time or several at once, labelled with text, a glyph, or both.

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html), the archived page Quantum is pinned to (the toggle buttons section). The page draws the group's metrics only as images; the values on this page are Quantum decisions, marked where they appear. This page is the Vue.

## Usage

`QuToggleButtons` is a compound: the root owns the selection and each `QuToggleButtons.Item` is one option. `v-model` is the selected `value`, or an array of values under `multiple`. `mandatory` keeps one option selected.

::: ds-example
/systems/quantum/toggle-buttons/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuToggleButtons } from '@paper/quantum'
</script>

<template>
  <QuToggleButtons>
    <QuToggleButtons.Item />
  </QuToggleButtons>
</template>
```

## Composed on Vuetify0

`QuToggleButtons` renders v0's [Toggle](/components/actions/toggle) compound: the root is `Toggle.Group`, which owns the selection (single or multiple, decided once at setup), the `v-model` and the `role="group"` container, and each item is a `Toggle.Root` that registers with it and publishes `aria-pressed`. Exclusive selection, `mandatory` and per-item `disabled` are v0's.

`Toggle.Group` emits `data-disabled` and `data-orientation`; `Toggle.Root` emits `data-state` (`on` or `off`) and `data-disabled` on each item. `data-multiple` on the root and `data-solo` on an icon-only item are Quantum's own. Each item hosts a bounded [QuRipple](/systems/quantum/ripple) as its first child, and glyphs draw through [QuIcon](/systems/quantum/icon).

The root also counts its items through a registry so it can hold the guidelines' minimum: a group of fewer than three options warns in development. An item rendered outside a group warns too, and falls back to a standalone toggle.

## Examples

::: ds-example
/systems/quantum/toggle-buttons/basic

### Exclusive selection

The default group is exclusive: selecting an option deselects the one before it, and pressing the selected option again clears the selection. That is the guidelines' "exclusive and unselected" combination, and `v-model` reads `undefined` while nothing is chosen.

Each option is a 36 dp flat button in the Button type style, 14 sp Roboto Medium in capitals with 16 dp of side padding. The page shows the group only as an image, so the container is a Quantum decision: one 2 dp radius shared by the items, a 1 dp edge and 1 dp dividers in `--quantum-divider`, so layout reads as one control the way the guidelines ask. Each item still answers to a 48 dp tall hit area.

The selected option fills with the 12% overlay of the buttons page (`--quantum-focus`) and its ink rises from the secondary tier, 54% black, to the primary tier, 87% black. Name the group with `label` (or `aria-labelledby`) so a screen reader announces what the options choose between.
:::

::: ds-example
/systems/quantum/toggle-buttons/multiple

### Multiple selection

`multiple` lets several options be selected at once, the guidelines' Bold, Italic, Underline example. `v-model` is then an array of the selected values, and each option toggles on its own. This is the "multiple and unselected" combination: every option can be released.

`multiple` is read once when the group mounts, because v0 builds a different selection model for each mode. Switching between exclusive and multiple means rendering a new group, with a `key` if the same element is reused.
:::

::: ds-example
/systems/quantum/toggle-buttons/mandatory

### Mandatory

`mandatory` keeps the last selected option selected: pressing it again does nothing. Give the model an initial value so the group never starts empty; that is the guidelines' "exclusive only" combination, the right shape for a setting that always has a value, such as text alignment.

`mandatory="force"` goes one step further and selects the first enabled option on mount when the model is empty. It works with `multiple` as well, where it keeps at least one option selected.
:::

::: ds-example
/systems/quantum/toggle-buttons/icons

### Icons

`icon` on an item draws a glyph from the Quantum icon set through `QuIcon` ahead of the label, at 24 dp with the 8 dp gap QuButton uses (the guidelines state no icon-to-label gap). Leave the slot empty and the item becomes icon-only: a 48 dp square around the centred glyph, marked `data-solo`.

An icon-only item has no text, so it needs `ariaLabel`; without one Quantum warns in development. The glyph is hidden from assistive technology in both forms, so the label in the slot or `ariaLabel` is always the item's whole name.
:::

::: ds-example
/systems/quantum/toggle-buttons/disabled

### Disabled

`disabled` on the root disables every item; on an item it disables that option alone and leaves its siblings selectable. A disabled item takes the native `disabled` attribute, leaves the tab order, ignores clicks, draws no ink and drops its ink to the buttons page's disabled opacity, 26% black (30% white on the dark theme). A selected item keeps its 12% fill when it is disabled.

v0 does not select into a disabled group, so a group that is disabled from the start shows no selection even when `v-model` holds a value. To show a locked choice, render the group enabled and disable it afterwards, or disable the items that are not chosen.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuToggleButtons.vue and
     QuToggleButtonsItem.vue until then. -->

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
| `QuToggleButtons.Item` | `value`, `icon`, `ariaLabel`, `disabled`, `groupNamespace` | One option: a native `<button>` with `aria-pressed`. The default slot is the label; with `icon` set and no slot it is icon-only and needs `ariaLabel`. Also exported flat as `QuToggleButtonsItem` |

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

Keyboard focus draws the buttons page's 12% overlay in the item's own ink, over the selected fill when the item is selected; a mouse click leaves nothing behind. Under forced colours a 2 px outline draws in its place.

### States

| State | Attributes set | Focusable | Activation | Announced as |
|-------|----------------|-----------|------------|--------------|
| not selected | `aria-pressed="false"`, `data-state="off"` | Yes | Enter, Space, click | The label, toggle button, not pressed |
| selected | `aria-pressed="true"`, `data-state="on"` | Yes | Enter, Space, click (blocked on the last selected item under `mandatory`) | The label, toggle button, pressed |
| `disabled` | `disabled`, `data-disabled` | No | Blocked | Disabled, with its pressed state |
