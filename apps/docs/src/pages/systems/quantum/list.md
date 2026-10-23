---
title: QuList - Quantum List for Vue
meta:
- name: description
  content: The Material Design 1 list, one continuous column of one-, two- and three-line tiles with avatars, icons, secondary actions, dense metrics, expandable groups and the selection pattern. Built on Vuetify0's Atom, createSelection and Collapsible.
- name: keywords
  content: quantum list, material design 1 list, list tile, two-line list, three-line list, dense list, selectable list, listbox, nested list, vue list, vuetify0 selection, paper quantum
features:
  category: Component
  label: 'C: QuList'
  level: 2
  renderless: false
  group: content
  order: 5
related:
  - /systems/quantum
  - /systems/quantum/subheader
  - /systems/quantum/divider
  - /composables/selection/create-selection
  - /components/disclosure/collapsible
---

# QuList

<DocsPageFeatures :frontmatter />

The Material Design 1 list. One continuous column of one-, two- and three-line tiles, with an avatar or icon at the edge, text on the content keyline, a secondary action at the end, dense metrics for desktop, expandable groups, and the selection pattern's selected state.

> [!NOTE]
> Reference: [Lists](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/lists.html) and [Lists: controls](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/lists-controls.html), Material Design 1 guidelines, the archived pages Quantum is pinned to. Tile types, metrics, keylines, controls and the expand pattern. The selected state follows the [Selection](http://web.archive.org/web/20181225002148/https://material.io/archive/guidelines/patterns/selection.html) pattern. This page is the Vue.

## Usage

`QuList` is a compound: the root is the `ul`, every row is a `QuList.Item`, and the anatomy inside a row is made of parts. The whole tile is the row's primary action. Give an item a `value` (or an `href`, or a click listener) and its tile becomes a button or a link; an item with none of them is a static row.

Bind `v-model` on a navigation list and the item whose `value` matches is the current destination: it takes the primary colour and `aria-current`. On the dark theme the primary 500 would read at under 2:1, below the 4.5:1 contrast floor, so the current item takes the primary's 100 instead, a Quantum decision.

::: ds-example
/systems/quantum/list/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuList } from '@paper/quantum'
</script>

<template>
  <QuList>
    <QuList.Item>
      <QuList.Avatar />

      <QuList.Icon />

      <QuList.Content>
        <QuList.Primary />

        <QuList.Secondary />
      </QuList.Content>

      <QuList.Action />
    </QuList.Item>

    <QuList.Group>
      <QuList.Item />
    </QuList.Group>
  </QuList>
</template>
```

An item takes an `Avatar` or an `Icon`, not both: the guidelines put one control at the start of a tile and forbid placing two side by side.

## Composed on Vuetify0

The root renders v0's [Atom](/components/primitives/atom) as the `ul` and owns a [createSelection](/composables/selection/create-selection) registry. Every item registers a ticket with its `value`, so `v-model` reaches the items through `useProxyModel` in all three modes: the current destination under `select="none"`, one value under `single`, an array under `multiple`. In the listbox modes the root also runs [useRovingFocus](/composables/system/use-roving-focus) over the options in document order, which is where the arrow keys, Home and End come from.

`QuList.Group` is v0's [Collapsible](/components/disclosure/collapsible): `Collapsible.Root` is the `li`, `Collapsible.Activator` is the header tile, `Collapsible.Cue` holds the chevron and `Collapsible.Content` the nested `ul`. Activation, `aria-expanded`, `aria-controls` and the `data-state` the stylesheet reads all come from v0.

The first child of every interactive tile is a [QuRipple](/systems/quantum/ripple). `data-dense`, `data-select` and `data-selecting` on the root, and `data-lines`, `data-selected`, `data-disabled` and `data-inset` on each item, are Quantum's own.

A secondary action is a separate target, so `QuList.Item` renders `QuList.Action` beside the tile rather than inside it, where a switch or a checkbox would nest one control inside a button. The text column stops short of the action column either way.

## Examples

::: ds-example
/systems/quantum/list/lines

### One, two and three lines

The guidelines define three tile types by their line count. A single-line tile is 48 dp tall, 56 dp when it carries an avatar; a two-line tile is 72 dp; a three-line tile is 88 dp. `lines` on the root sets the type for every item, and `lines` on an item overrides it for that row: tiles may vary in height within one list.

Primary text is Roboto Regular 16 sp (15 sp on desktop) on a 24 dp line at 87% ink. Secondary text is Roboto Regular 14 sp (13 sp on desktop) on a 20 dp line at 54%. In a three-line tile the secondary text runs to two lines and ends in an ellipsis after the second, and the avatar or icon top-aligns with the primary text, 16 dp below the tile's top edge. When a row needs more than three lines, the guidelines send you to a card instead.

The avatar is a 40 dp circle. With `src` it shows an image whose `alt` is empty by default, because the primary text already names the person; without one it is a Grey 400 fill under white ink for an icon or initials.
:::

::: ds-example
/systems/quantum/list/keylines

### Keylines and inset

The avatar or icon sits on the margin keyline, 16 dp from the edge, and the text starts on the content keyline at 72 dp. From 600 px the keylines move to 24 dp and 80 dp, the tablet column of the metrics page. A 40 dp avatar leaves 16 dp before the text, a 24 dp icon 32 dp.

`inset` puts an item's text on the content keyline with nothing beside it, so rows without an avatar line up with the rows that have one. `QuDivider inset` and `QuSubheader inset` follow the same keyline: an inset divider separates related content beside avatars, a full-bleed divider separates sections. A list that opens with a subheader drops its own 8 dp top padding, because the 48 dp subheader tile carries its own. Dividers and subheaders sit between lists rather than inside them, since a `ul` may hold only list items.
:::

::: ds-example
/systems/quantum/list/dense

### Dense

When mouse and keyboard are the primary input, the guidelines condense the measurements: 40, 48, 60 and 76 dp tiles for the four heights above, 13 sp text, and 4 dp of list padding in place of 8. `dense` turns them on for the whole list. The page gives no separate dense secondary size, so both lines take 13 sp.

The icon stays 24 dp in a dense list. The dense redlines draw it at full size, and Quantum follows them over Vuetify 1.5's 22 px dense icon. As with the dense button, Quantum exposes the form as a prop rather than switching on the pointer type, so one surface can mix a dense list with standard controls.
:::

::: ds-example
/systems/quantum/list/controls

### Secondary actions

The column at the end of a tile holds a secondary action or secondary info. The guidelines place a switch, a checkbox, an icon toggle or an expand control there, 16 dp from the end edge, in a column that stops the text 56 dp from the edge for a 24 dp control. Each control is its own target: pressing it never activates the tile, and the tile's primary action never toggles it.

Text in the column is secondary info, set in Caption at 12 sp and 54%. Keep the action consistent across the list and avoid repeating the same action on every row; per-row toggles such as a star are the exception, because they carry information about the row. Give each control its own accessible name, since it sits outside the tile's text.
:::

::: ds-example
/systems/quantum/list/radio

### Radio choices

A radio in the action column turns the list into a single choice. Wrap the list in `QuRadio.Group`, which owns the value and the arrow-key movement between radios, and keep the tiles static so the radio is the one target on each row. For a single choice without visible radios, use `select="single"` instead.
:::

::: ds-example
/systems/quantum/list/single

### Single selection

`select="single"` makes the list a listbox. The root renders `ul[role=listbox]`, each tile becomes `role="option"` with `aria-selected`, and `v-model` holds the selected value. Clicking a tile, or pressing Space or Enter on it, selects it and clears the previous one.

The selected tile carries the selection pattern's scrim: the `--quantum-selection` token, the accent at 30%, the same fill `QuGridList` uses. The pattern page gives no scrim value, so the alpha is a Quantum decision recorded on the token. A disabled option stays visible at 38% ink and refuses the selection.
:::

::: ds-example
/systems/quantum/list/multiple

### Multiple selection

`select="multiple"` adds `aria-multiselectable` and makes `v-model` an array; a tile toggles on click, Space or Enter. The selection pattern's check mark replaces the avatar or icon of a selected item, drawn as the checkbox glyph in the selection-control accent over the scrim.

On desktop the pattern reveals a check mark on hover: the empty checkbox replaces the avatar of the item under the pointer or the keyboard focus. Once one item is selected, the list is in selection mode and every item shows its mark, so the rest can be picked without hunting for them. Deselecting the last item ends selection mode. Text-only tiles have no leading element to replace, so the scrim alone marks them.
:::

::: ds-example
/systems/quantum/list/group

### Expandable groups

`QuList.Group` is the lists: controls page's expand and collapse control. Its header is an item-shaped tile with an optional `icon` and the `title`, and the `expand-more` chevron in the end column rotates when the group opens. The nested items slide open vertically over the standard 300 ms duration (200 ms on desktop) on the standard curve, indent to the content keyline, and full-bleed dividers close the open group off above and below. The open group's title takes the primary colour, and its 100 tint on the dark theme.

`v-model` on the group holds its open state. Nested items still register with the root list, so the root's `v-model` marks the current destination wherever it sits in the tree. Groups belong to navigation lists: a listbox may hold options only, and Quantum warns in development when a group is placed inside one.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the QuList SFCs until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `select` | `'none' \| 'single' \| 'multiple'` | `'none'` | `none` renders a plain or navigation list; `single` and `multiple` render a listbox of options with the selection pattern's selected state |
| `dense` | `boolean` | `false` | 40, 48, 60 and 76 dp tiles, 13 sp text and 4 dp list padding: the condensed metrics for mouse and keyboard layouts |
| `lines` | `1 \| 2 \| 3` | `1` | The default line count of every item: 48 (56 with an avatar), 72 or 88 dp |
| `modelValue` | `T \| T[]` | | The current destination under `none`, the selected value under `single`, the array of selected values under `multiple` |

The root's default slot holds `QuList.Item` and `QuList.Group` children. A listbox needs an accessible name: pass `aria-label` or `aria-labelledby`, which land on the `ul`.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `QuList.Item` | `value?: unknown`, `href?: string`, `disabled?: boolean`, `lines?: 1 \| 2 \| 3`, `inset?: boolean` | `li.quantum-list__item` around the tile. The tile is an `a` with `href`, a `div[role=option]` in a listbox, a `button` with a `value` or a click listener, and a static `div` otherwise. Consumer attributes and listeners land on the tile. `inset` puts the text on the content keyline with no leading element |
| `QuList.Avatar` | `src?: string`, `alt?: string` (`''`) | The 40 dp circle. Without `src`, the default slot (an icon, initials) sits on a Grey 400 fill |
| `QuList.Icon` | `name: QuIconName` | A 24 dp glyph through `QuIcon` in the 54% active icon ink, 24 dp in dense lists too |
| `QuList.Content` | | The text column on the content keyline |
| `QuList.Primary` | | The first line: Regular 16 sp (15 sp desktop, 13 sp dense) at 87%, one line with an ellipsis |
| `QuList.Secondary` | | The second line, or two lines in a three-line tile: Regular 14 sp (13 sp desktop) at 54% |
| `QuList.Action` | | The end column, rendered beside the tile as its own target: a `QuCheckbox`, `QuSwitch`, `QuRadio` or `QuIconToggle`, or Caption text. Warns in development inside a listbox |
| `QuList.Group` | `title: string`, `icon?: QuIconName`, `disabled?: boolean`, `modelValue?: boolean` | The expandable header and its nested `ul`. Warns in development inside a listbox |

Every part warns once in development when it renders outside its parent, and renders inert. There are no named slots.

## Accessibility

A list with `select="none"` is a plain `ul` of `li` rows. Its interactive tiles are native links and buttons, so the tab order, Enter and Space all come from the platform. The current destination carries `aria-current="page"` on a link and `aria-current="true"` on a button; `aria-selected` is never set outside a listbox, where it would be invalid.

A list with `select="single"` or `"multiple"` follows the WAI-ARIA Listbox pattern: `ul[role=listbox]`, `li[role=none]`, and each tile `role="option"` with `aria-selected` and, when disabled, `aria-disabled`. The list holds one tab stop, which starts on the first selected option, or the first enabled one.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus into and out of the list. In a navigation list every tile is a tab stop; a listbox is one |
| Arrow Down, Arrow Up | In a listbox, moves focus to the next or previous enabled option |
| Home, End | In a listbox, moves focus to the first or last enabled option |
| Space, Enter | Activates the tile. In a listbox, selects the option (`single`) or toggles it (`multiple`) |
| Enter, Space on a group header | Opens or closes the group |

### Naming

A tile's accessible name is its text, primary then secondary. The avatar's image is decorative by default (`alt=""`), and icons and check marks are hidden from assistive technology. A control in `QuList.Action` sits outside the tile, so it needs its own name, usually `aria-label` repeating the row's primary text. Name a listbox with `aria-label` or `aria-labelledby` on the root.

### Focus and states

Hover lays a 6% overlay over the tile and keyboard focus a 12% overlay, drawn for `:focus-visible` only; pressing draws the ripple from the press point. Under forced colours, a 2 px outline draws in place of the focus overlay. A disabled item drops its text to 38% and its icon to the inactive ink, and its tile answers to nothing: a disabled button is out of the tab order, a disabled link loses its `href`, and a disabled option is skipped by the arrow keys.

### Motion

The rows present when the list mounts fade and lift in, top to bottom, each 20 ms after the one above (`--quantum-stagger`), over the entering duration on the decelerate curve. The entrance plays once: rows added later, and rows inside a group that is closed at mount, appear at once. A group opens and closes as a vertical expansion on the standard duration and curve. Reduced motion removes the entrance, the expansion and the chevron's turn.

### Not shipped

Swipe gestures (leave-behinds) and pick-up-and-move reordering are touch gestures the package does not ship. Expose the same action through a visible control in the action column instead.
