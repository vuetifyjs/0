---
title: Md1DropdownButton - Material Design 1 Dropdown Button for Vue
meta:
- name: description
  content: The Material Design 1 dropdown button in plain, segmented, generic, dense and desktop forms, whose menu covers the button and lists the states. Built on Vuetify0's Menu.
- name: keywords
  content: md1 dropdown button, material design 1 dropdown button, segmented dropdown, vue menu button, vuetify0 menu, paper md1
features:
  category: Component
  label: 'C: Md1DropdownButton'
  level: 2
  renderless: false
  group: actions
  order: 4
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/menu
  - /components/disclosure/menu
---

# Md1DropdownButton

<DocsPageFeatures :frontmatter />

The Material Design 1 dropdown button. A flat button that shows the current state and a down arrow; pressing it opens a menu over the button that lists every state.

<DocsMd1Reference
  href="https://m1.material.io/components/buttons.html"
  title="Buttons"
/>

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](https://m1.material.io/components/buttons.html), the archived page Material Design 1 is pinned to, with the menu sheet from [Menus](https://m1.material.io/components/menus.html). Behavior, the desktop paddings and the menu metrics. This page is the Vue.

## Usage

`Md1DropdownButton` is a compound: the root is the button and owns the selected state through `v-model`, and each `Md1DropdownButton.Item` is one state in the menu. The button draws the selected item's text, and its glyph when the item has one.

The button displays the current state and a down arrow. Pressing it opens a menu that covers the button and lists the possible states; pressing a state dismisses the menu and updates the button. The guidelines show states as strings, a palette or icons; this one uses strings.

The button is a flat button: 36 dp tall, at least 88 dp wide, 16 dp before the label, 2 dp corners, and the Button type style of 14 sp Roboto Medium in capitals in the accent ink, with the arrow 8 dp after the label. The sheet is a menu at 8 dp elevation on the surface colour: 48 dp rows of 16 sp text with 8 dp above the first row and below the last, as wide as its longest state rounded up to whole 56 dp units, from two units to five. Each row's text sits 16 dp in, and the current state carries the 12% selected shade and no check: on the menus page the check belongs to multi-select menus, and a single-choice menu highlights the row it opens over. The button holds the width of its longest state, so choosing a state never moves the button or its menu.[^stable]

::: ds-example
/systems/md1/dropdown-button/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
</script>

<template>
  <Md1DropdownButton>
    <Md1DropdownButton.Item />
  </Md1DropdownButton>
</template>
```

## Composed on Vuetify0

`Md1DropdownButton` renders v0's [Menu](/components/disclosure/menu) compound: `Menu.Root` owns the open state, `Menu.Activator` is the button (or, segmented, the arrow segment), `Menu.Content` is the sheet, and `Menu.RadioGroup` holds the states. Each `Md1DropdownButton.Item` is a `Menu.RadioItem`, so the current state is announced as checked. The segmented state segment is a v0 [Button](/components/actions/button) `Button.Root`. Open and close, focus return, the roving highlight, typeahead and light dismiss all come from v0.

Material Design 1 adds three things v0 does not do. A v0 radio item keeps its menu open; a dropdown commits and closes on the choice, so each item dismisses the menu after v0 selects it. The sheet is placed by the same measuring popover adapter as `Md1Menu`'s simple menu: it lands the selected state's row on the button with the row's text on the button's text, across as well as down, measured once the sheet is laid out. And the button reads the selected item's text and glyph through a `md1:dropdown-button` context the items register with.

`Menu.Activator` and the items publish `data-open`, `data-state`, `data-highlighted` and `data-disabled`, which Material Design 1's stylesheet hangs off. `data-segmented`, `data-dense`, `data-desktop` and `data-solo` on the root are Material Design 1's own. Every interactive element hosts a [Md1Ripple](/systems/md1/ripple) as its first child, and every glyph is a [Md1Icon](/systems/md1/icon) role.

## Examples

::: ds-example
/systems/md1/dropdown-button/segmented

### Segmented

A segmented dropdown button has two sections. Pressing the current state fires that state's action, and pressing the arrow shows all the options; choosing one changes the state the button displays. `segmented` splits the button that way: the state segment emits `select` with the current value and never opens the menu, and the arrow segment is the menu button.

The arrow segment is a 36 dp square seamed to the state by a 1 dp divider line. The guidelines draw the segments only as an image, so the square and the seam are Material Design 1 decisions.[^segments] The arrow has no text of its own: it is named by `ariaLabel`, or by the `Md1.options` locale copy ("Options") when you leave it unset. The sheet lands the selected text on the state segment's text and is at least as wide as the whole button, so it covers both segments.
:::

::: ds-example
/systems/md1/dropdown-button/editable

### Editable segmented

The guidelines' font size picker: a segmented dropdown whose displayed state is text editable. Pressing the current state fires its action and makes the state editable, and pressing the arrow shows all the options. `editable` turns the state segment into a text field named by `label`: pressing it emits `select` with the current value and selects the text; Enter, or leaving the field, commits what was typed to `v-model` and emits `select` with it, and Escape puts the state back. An empty field never commits. `editable` implies `segmented`.

A typed state need not be one of the items: a size the list does not offer is still a size. Text that names an item commits that item's value; when every item's value is a number, a typed number commits as a number; anything else commits as the text, for the app to accept or correct. The field shows the committed state, an item's text or the value itself.

The guidelines give the editable form no metrics, so it takes Vuetify 1.5's editable overflow button: a 48 dp field with its 16 sp text 16 dp in, a 1 dp divider line at its foot, and a 48 dp arrow segment behind a 1 dp seam.[^overflow-button] Hovered, it takes the surface fill; focused or open, it also lifts to 2 dp.[^lift] It is two 56 dp increments wide by default, the menu's own minimum, so the sheet that opens over it covers it;[^width] set a width on it for a wider field.
:::

::: ds-example
/systems/md1/dropdown-button/icons

### States as icons

`icon` on an item gives the state a glyph. The row draws it in the leading column, and the button draws it ahead of the text while that state is selected, the icon form of the dropdown the buttons page shows. With glyphs in the menu every row's text sits at the 72 dp keyline (64 px on desktop), and the selected row's glyph lands on the button's glyph.[^glyph]

Glyphs draw at 24 dp and 54% ink in the menu, 38% when the state is disabled. Pick roles from the Material Design 1 icon set or register your own through the icons plugin.
:::

::: ds-example
/systems/md1/dropdown-button/generic

### Generic dropdown

The generic dropdown shows an arrow by default, and pressing an option navigates to further settings rather than becoming a displayed state. With no selected state and no `label`, the button is the arrow alone in the 48 dp circular target of an icon button, and `data-solo` is set.

The arrow carries no text, so pass `ariaLabel`; without it Material Design 1 warns in development. In this example the model stays empty: the choice is handled in `update:modelValue` and the button keeps showing the arrow.
:::

::: ds-example
/systems/md1/dropdown-button/dense

### Dense

`dense` condenses both halves. The button becomes the dense button, 32 dp tall with a 13 sp label; the menu takes the 14 sp dense type of the menus page. That page gives no dense row height, so the rows take the 40 dp of the dense list tile, a Material Design 1 decision `Md1Menu` shares.[^dense] The 48 dp touch target still extends around the 32 dp button without taking layout space.
:::

::: ds-example
/systems/md1/dropdown-button/desktop

### Desktop

`desktop` is the dropdown the buttons page specifies for desktop app bars: 16 dp above and below, 24 dp before the state and 16 dp after the arrow, which makes the button 56 dp tall around its 24 dp glyph. The menu takes the desktop metrics of the menus page: 32 px rows, 15 px type, the text 24 px in from both edges (at the 64 px keyline beside glyphs), in whole 64 px units from 128 px, resting 2 dp lower at 6 dp.

With `dense` as well, the menu drops to 24 px rows of 13 px type with 4 px above the first row and below the last, the dense desktop redline. Desktop is a prop rather than a pointer query, so the same app can mix forms.[^desktop]
:::

::: ds-example
/systems/md1/dropdown-button/disabled

### Disabled

Show a state as disabled rather than removing it when it exists under the right conditions, the menus page's rule for Redo with nothing to redo. A disabled item stays in place at 38% ink (50% on the dark theme), takes no press and is skipped by the arrow keys.

`disabled` on the root disables the whole button: the native `disabled` attribute on every segment, the 26% disabled ink of the buttons page, no ripple and no menu.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1DropdownButton.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `unknown` | | The selected state: the `value` of the item the button displays. Use `v-model` |
| `segmented` | `boolean` | `false` | Splits the button into a state segment, which emits `select` with the current value, and an arrow segment that opens the menu |
| `editable` | `boolean` | `false` | The editable segmented dropdown: the state segment is a text field named by `label`; pressing it emits `select`, Enter or blur commits the typed state and emits `select` with it. Implies `segmented` |
| `dense` | `boolean` | `false` | The dense button (32 dp, 13 sp) over condensed menu rows (40 dp at 14 sp; 24 px at 13 px with `desktop`) |
| `desktop` | `boolean` | `false` | The desktop dropdown: 16 dp vertical padding, 24 dp before the state, 16 dp after the arrow, over the desktop menu (32 px rows, 15 px type, 6 dp) |
| `disabled` | `boolean` | `false` | Disables every segment and every item: native `disabled`, 26% ink, no menu |
| `label` | `string` | | Text drawn while no item is selected |
| `ariaLabel` | `string` | | Accessible name of the control that opens the menu. Required for the generic dropdown; the segmented arrow falls back to the `Md1.options` copy |
| `id` | `string` | | DOM id prefix for the menu and its button, passed to `Menu.Root` |

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `unknown` | A state was chosen from the menu |
| `select` | `unknown` | The segmented state segment was pressed; the payload is the current state |

The default slot holds the items. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1DropdownButton.Item` | `value` (required), `label`, `icon`, `disabled` | One state, a `Menu.RadioItem`. The slot is its text. `label` replaces the slot text on the button and in typeahead; `icon` draws a glyph in the row and on the button. Outside an `Md1DropdownButton` it warns in development and renders nothing |

## Accessibility

The button is a native `<button>` with `aria-haspopup="menu"`, `aria-expanded` and `aria-controls` from `Menu.Activator`; the sheet is `role="menu"` labelled by the button, and each state is a `menuitemradio` with `aria-checked`. The WAI-ARIA pattern is the Menu Button; the segmented form is a Button beside a Menu Button. The editable form is a native text field beside the Menu Button rather than the Combobox the guidelines' notes suggest: its popup is a menu of radio items, which a combobox may not own.[^combobox]

### Naming

The plain button is named by the state it shows, so a screen reader announces the current value. The state segment of a segmented button is named the same way, and the arrow segment by `ariaLabel` or the locale fallback. The generic dropdown has no visible text and needs `ariaLabel`. The editable field is named by `label`, which is also its placeholder. Glyphs are `aria-hidden`.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | On the button: opens the menu with the first state focused. On a state: chooses it, closes the menu and returns focus to the button |
| ArrowDown, ArrowUp | On the button: opens the menu at the first or the last state. In the menu: moves between states, wrapping, skipping disabled ones |
| A letter | Moves to the next state whose text starts with it |
| Escape | Closes the menu and returns focus to the button, with the state unchanged |
| Tab | Closes the menu and moves on |
| Enter (editable field) | Commits the typed state and emits `select` with it; the text stays selected for the next edit |
| Escape (editable field) | Puts the state back and leaves the field |

### Positioning

The menu opens over the button rather than below it, as the buttons page describes, with the selected state on the button, as the menus page asks of a simple menu. Near a screen edge the whole sheet moves up or down so every state stays visible, never past the 16 dp screen-edge margin (24 dp from 600 px); a long list opens scrolled so the selected state is in its middle.[^scroll] Across, the selected row's text starts where the button's text starts, the menus page's "always left aligned with the start of the list item text" (the right edge under `dir="rtl"`); near either side edge the sheet shifts back only as far as the screen margin needs.[^align] The sheet stops one 48 dp row short of the screen's height, so a tap outside it always has somewhere to land, and scrolls inside when its states do not fit. A pointer outside the menu dismisses it without a change.

[^stable]: Our call: the guidelines show a dropdown one state at a time and give it no width rule; holding the widest state keeps the button and its menu in place as the state changes, as the tabs More control does. The unseen states are generated content, so they never join the button's accessible name.

[^glyph]: Our call: the button draws its glyph 8 dp before the label while the row puts its text at the 72 dp keyline, so the glyphs and the texts cannot both line up; the glyph leads both, so the glyph lands on the glyph.

[^align]: Vuetify 1.5.24, components/VMenu/mixins/menu-position.js:24-28 and mixins/menuable.js:193-200. `calcLeftAuto` puts the sheet 16 px (`defaultOffset * 2`) before the activator so the tile text meets the field text; `calcXOverflow` shifts an overflowing sheet back only as far as fits.

[^segments]: Our call: the page draws the segments only as an image; a square arrow segment and a 1 dp divider seam read as one button.

[^overflow-button]: Vuetify 1.5.24, stylus/components/_overflow-buttons.styl:16-21,38-46,54-60. The editable `v-overflow-btn`: 48 px field, text 16 px in, 48 px append segment behind a 1 px divider seam.

[^lift]: Vuetify 1.5.24, stylus/components/_overflow-buttons.styl:23-27,82-85. The cards fill on hover, focus and an open menu, and `elevation(2)` on focus and an open menu.

[^width]: Our call: the menu's two-increment minimum keeps the sheet covering the field.

[^dense]: Our call: the menus page gives no dense row height, so the rows borrow the dense list tile's 40 dp.

[^desktop]: Our call: the page names a desktop form, not a device switch, so it is opt-in.

[^combobox]: Our call: ARIA lets a combobox own a listbox, not a menu, so the field sits beside the Menu Button.

[^scroll]: Vuetify 1.5.24, components/VMenu/mixins/menu-position.js:15-23. `calcScrollPosition` centres the active tile in a scrolled menu.
