---
title: Md1Menu - Material Design 1 Menu for Vue
meta:
- name: description
  content: The Material Design 1 menu, a transient 8 dp sheet of choices in handset, dense and desktop metrics, with check items, groups and cascading sub menus. Built on Vuetify0's Menu.
- name: keywords
  content: md1 menu, material design 1 menu, simple menu, cascading menu, dropdown menu, vue menu, vuetify0 menu, paper md1
features:
  category: Component
  label: 'C: Md1Menu'
  level: 2
  renderless: false
  group: overlay
  order: 2
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/subheader
  - /components/disclosure/menu
---

# Md1Menu

<DocsPageFeatures :frontmatter />

The Material Design 1 menu: a temporary sheet of choices that opens from a button and closes once one is chosen. It comes in handset, dense and desktop metrics, with check items, grouped sections and cascading sub menus.

> [!NOTE]
> Reference: [Menus, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/menus.html), the archived page Material Design 1 is pinned to. Metrics, widths, elevation, states and behavior. This page is the Vue.

## Usage

`Md1Menu` is a compound. The root holds the open state (`v-model`) and the metrics; `Md1Menu.Activator` hands its `attrs` to the emitting `Md1Button`; `Md1Menu.Content` is the sheet, and the items go inside it.

::: ds-example
/systems/md1/menu/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Menu } from '@paper/md1'
</script>

<template>
  <Md1Menu>
    <Md1Menu.Activator />

    <Md1Menu.Content>
      <Md1Menu.Subheader />

      <Md1Menu.Item />

      <Md1Menu.CheckItem />

      <Md1Menu.Divider />

      <Md1Menu.Sub>
        <Md1Menu.Item />
      </Md1Menu.Sub>
    </Md1Menu.Content>
  </Md1Menu>
</template>
```

## Composed on Vuetify0

`Md1Menu` renders v0's [Menu](/components/disclosure/menu) compound and keeps its behavior: `Menu.Root` owns the open path, `Menu.Activator` the trigger wiring, `Menu.Content` the native popover with its roving focus, typeahead, Escape and light dismiss, `Menu.Item` and `Menu.CheckboxItem` the rows, `Menu.Separator` the divider, and `Menu.Sub` with `Menu.SubActivator` and `Menu.SubContent` the cascading layer, folded into the single `Md1Menu.Sub` part. The placement is CSS anchor positioning through v0's popover adapter.

Material Design 1 adds the spec around it. The sheet's width, elevation and motion are Material Design 1's stylesheet; `data-dense` and `data-desktop` on the sheet and `data-selected` and `data-icon` on a row are Material Design 1's own attributes, while `data-open`, `data-highlighted`, `data-disabled` and `data-state` are v0's. Every row hosts a [Md1Ripple](/systems/md1/ripple), and every glyph (the leading icon, the check, the sub menu triangle) draws through [Md1Icon](/systems/md1/icon).

Two seams are Material Design 1's. The activator is renderless, so the menu has no element to return focus to; `Md1Menu.Activator` registers the trigger by its id as the menu's return target, and Escape or a choice puts focus back on the button. And v0 activates a plain item from the keyboard without a click, so `Md1Menu.Item` answers Enter and Space with a click itself: `select`, a consumer `@click` and the `value` commit fire once whichever way the item is chosen.

## Examples

::: ds-example
/systems/md1/menu/icons

### Icons and inline information

`icon` draws a glyph role at the leading keyline, 16 dp from the start edge at 54% ink. One icon anywhere in the list moves every row's text to the 72 dp content keyline (80 dp from 600 px), so labels stay aligned whether or not their row has a glyph. Menu items may contain icons, the guidelines say; they are optional, and a menu either uses them as a column or not at all.

`info` is the inline information the lists-controls page puts at the trailing edge: a keyboard shortcut or similar, in the secondary ink (54% black, 70% white), never truncated. Material Design 1 also publishes it as `aria-keyshortcuts` and hides the visible copy from the accessible name, so a screen reader hears "Share" and is told the shortcut separately. When the visible text is not in the attribute's syntax, pass `aria-keyshortcuts` yourself; the attribute you pass wins.
:::

::: ds-example
/systems/md1/menu/disabled

### Disabled items

The guidelines are specific: show an item as disabled rather than removing it when it exists under the right conditions. Redo with nothing to redo, Cut and Copy with nothing selected. A disabled row keeps its place at the disabled ink, 38% black or 50% white, its glyph drops to 38%, and the keyboard and pointer pass over it.

Removal is for contextual menus, where an item that cannot apply to the current context leaves the list. Everything that waits for a condition stays visible so the menu reads the same every time it opens. `disabled` on the root goes further and disables the trigger along with every item.
:::

::: ds-example
/systems/md1/menu/groups

### Groups

`Md1Menu.Divider` separates groups of items with a 1 dp rule at 12% ink, the full width of the sheet, with 8 dp above and below it. `Md1Menu.Subheader` titles a group with the subheaders page's 48 dp tile in Body 2 (Medium 14 sp) at the secondary ink, at the 16 dp text padding (24 px in a desktop menu).

A menu may only own items, groups and separators in the accessibility tree, so the subheader is presentational inside it: its text is still read, but it is not a heading. Order the groups the way the guidelines order items in a static menu, most used first.
:::

::: ds-example
/systems/md1/menu/selected

### The selected value

`value` on an item and `v-model:selected` on the root make a simple menu that commits a choice. Choosing an option commits it immediately and closes the menu, the guidelines' selection rule; the row whose value matches the model is drawn with the 12% focus shade the buttons page gives a focused surface, and carries `aria-current`.

The guidelines also position a simple menu so the selected item sits over the emitting control. Material Design 1 does not implement that alignment: CSS anchor positioning has no measured offset for it, so the menu opens below its trigger, aligned to its start edge. This is a known limitation. A value picker inside a form field belongs to a dropdown text field, which is a listbox rather than a menu.
:::

::: ds-example
/systems/md1/menu/check

### Check items

`Md1Menu.CheckItem` is the multi-select row: `v-model:checked` toggles a check glyph in the leading slot, and the menu stays open so several options can be set in one visit. The guidelines dismiss a menu on selection except in multi-select menus with checkmarks, which is this case. The check column reserves the 72 dp keyline for every row, checked or not, so labels do not jump as items toggle.

Each row is a `menuitemcheckbox` with `aria-checked`, and `data-state` carries `checked` or `unchecked` for styling. Enter, Space and a press all toggle it.
:::

::: ds-example
/systems/md1/menu/dense

### Dense

`dense` condenses a handset menu to the 14 sp type the menus page names for dense simple menus. The page gives no dense row height; Material Design 1 uses the dense list tile's 40 dp, a decision rather than a spec value. Text padding and widths stay the same.

Use it where many short options must fit on a phone screen at once. Everywhere a finger is the primary input and space is not scarce, keep the 48 dp rows: they are the touch target.
:::

::: ds-example
/systems/md1/menu/desktop

### Desktop

`desktop` switches to the desktop column of the menus page, for layouts where mouse and keyboard are the primary input: 32 px rows, 24 px text padding, 15 px type and 8 px above the first row and below the last. With `dense` it is the dense desktop menu: 24 px rows, 13 px type and 4 px list padding. A desktop sheet rests 2 dp lower than a handset one, 6 dp in place of 8, the elevation page's desktop rule, and its glyphs drop to the 20 dp dense icon size with the text at the 64 px keyline.

Widths change unit as well: a desktop sheet is a multiple of 64 px, at least 128 px, with no 5x ceiling (the width redline draws 6x and 7x desktop menus). Material Design 1 makes the choice an explicit prop rather than a pointer media query, so a desktop toolbar opens a desktop menu on a touch laptop too, and a handset layout keeps its 48 dp rows under a mouse.
:::

::: ds-example
/systems/md1/menu/cascading

### Cascading

`Md1Menu.Sub` is the cascading menu of the desktop page: a parent row with a right-pointing triangle at the trailing edge, ending 32 px from the desktop edge, whose sub menu flies out flush with the parent's trailing edge, its top aligned with the parent row. It opens when the pointer rests on the row (after 100 ms, `openDelay`), on a press, or on ArrowRight, and closes on ArrowLeft or Escape. The row stays highlighted while its sub menu is open.

A sub menu stands 1 dp above its parent, 9 dp on a handset and 7 dp on a desktop, and each further level adds 1 dp more. Its list has 16 px of padding above and below on desktop, the cascading redline. Keep nesting to one level, as the guidelines ask: cascading menus are a desktop pattern, and on a phone a second sheet over the first is harder to read than a dialog.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Menu.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Whether the menu is open (`v-model`) |
| `selected` | `unknown` | | The committed value (`v-model:selected`); written when an item with a `value` is chosen |
| `dense` | `boolean` | `false` | 14 sp handset rows at 40 dp; with `desktop`, 24 px rows, 13 px type and 4 px list padding |
| `desktop` | `boolean` | `false` | The desktop menu: 32 px rows, 24 px text padding, 15 px type, the 64 px width unit and 2 dp less elevation |
| `disabled` | `boolean` | `false` | Disables the trigger and every item |
| `openDelay` | `number` | `100` | Pointer rest before a sub menu opens |
| `closeDelay` | `number` | `250` | v0's close delay for a menu opened by hover. An Md1Menu opens on a press, so today it has no effect; it is kept for parity with v0 |
| `id` | `string` | | DOM id prefix for the sheet and the trigger |
| `namespace` | `string` | `'v0:menu'` | The v0 menu key; the parts inherit it. Change it only to nest a menu inside another v0 menu's tree |

The root renders no element. Its default slot receives `isOpen` and `dismiss(restore?)`.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Menu.Activator` | `disabled`, `namespace` | Renderless. Spread the slot's `attrs` onto an `Md1Button`; they carry the id, `aria-haspopup`, `aria-expanded`, `aria-controls` and the handlers |
| `Md1Menu.Content` | `eager`, `namespace` | The `role="menu"` popover sheet. `data-open`, `data-dense`, `data-desktop`. Items render on first open unless `eager` |
| `Md1Menu.Item` | `icon`, `info`, `disabled`, `value`, `label`, `id`, `namespace` | A `menuitem`. Emits `select` when chosen by pointer or keyboard. `label` overrides the typeahead text |
| `Md1Menu.CheckItem` | `v-model:checked`, `info`, `disabled`, `label`, `id`, `namespace` | A `menuitemcheckbox`; choosing it keeps the menu open. `data-state` is `checked` or `unchecked` |
| `Md1Menu.Divider` | | An `hr` with `role="separator"` |
| `Md1Menu.Subheader` | | A 48 dp group title, presentational inside the menu |
| `Md1Menu.Sub` | `label` (required), `icon`, `disabled`, `eager`, `id`, `namespace` | The parent row and its sub menu; the default slot is the sub menu's items |

Every part's default slot is its content. There are no named slots.

## Accessibility

The trigger is a native button carrying `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`. The sheet is `role="menu"`, named by the trigger through `aria-labelledby`, with `menuitem`, `menuitemcheckbox` and `separator` children; a sub menu's parent row is a `menuitem` with `aria-haspopup="menu"`, and the sub sheet is a nested `role="menu"`. Focus moves into the menu on open and returns to the trigger on Escape or on a choice.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | On the trigger, opens the menu on its first item. On an item, chooses it; on a check item, toggles it and keeps the menu open; on a parent row, opens its sub menu |
| ArrowDown | On the trigger, opens on the first item. In the menu, moves to the next enabled item, wrapping |
| ArrowUp | On the trigger, opens on the last item. In the menu, moves to the previous enabled item, wrapping |
| ArrowRight | Opens the focused row's sub menu on its first item (ArrowLeft under `dir="rtl"`) |
| ArrowLeft | Closes a sub menu and returns to its parent row (ArrowRight under `dir="rtl"`) |
| Escape | Closes every layer and returns focus to the trigger |
| Tab | Closes the menu and lets focus move on |
| A letter | Moves to the next item starting with it |

### States

| State | Attributes set | Reachable |
|-------|----------------|-----------|
| highlighted | `data-highlighted`, `tabindex="0"` | The roving focus |
| disabled | `aria-disabled="true"`, `data-disabled`, `tabindex="-1"` | Skipped by the arrows and typeahead; a press does nothing |
| selected | `data-selected`, `aria-current="true"` | Yes |
| checked | `aria-checked="true"`, `data-state="checked"` | Yes |

A press outside the sheet closes it, the native popover's light dismiss. The rows are 48 dp touch targets on handsets; the desktop and dense forms are for mouse and keyboard layouts.
