---
title: QuChip - Quantum Chip for Vue
meta:
- name: description
  content: The Material Design 1 chip with text, an icon or a photo, deletable from its cancel glyph or the Delete key, and the contact chip that opens to its addresses. Built on Vuetify0.
- name: keywords
  content: quantum chip, material design 1 chip, contact chip, deletable chip, vue chip, vuetify0 popover, paper quantum
features:
  category: Component
  label: 'C: QuChip'
  level: 2
  renderless: false
  group: actions
  order: 2
related:
  - /systems/quantum
  - /systems/quantum/icon
  - /systems/quantum/ripple
  - /components/actions/button
  - /components/disclosure/popover
---

# QuChip

<DocsPageFeatures :frontmatter />

The Material Design 1 chip: a small block that stands for an entity, such as a filter, a rule or a contact. Chips can carry an icon or a photo, can be deleted, and the contact chip opens to show the contact's other addresses.

> [!NOTE]
> Reference: [Chips, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/chips.html), the archived page Quantum is pinned to. Metrics, contact chips, deletion and behavior. This page is the Vue.

## Usage

`QuChip` is a compound with one optional part. The default slot is the label; `icon`, `avatar`, `deletable` and `contact` select the chip types the guidelines define. A chip with no press is text printed on the sheet; bind `@click`, or set `contact`, and it becomes a button.

::: ds-example
/systems/quantum/chip/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuChip } from '@paper/quantum'
</script>

<template>
  <QuChip>
    <QuChip.Addresses>
      <QuChip.Address />
    </QuChip.Addresses>
  </QuChip>
</template>
```

## Composed on Vuetify0

A chip with no press renders v0's [Atom](/components/primitives/atom) as a `<span>`. A chip with a press, and every contact chip, renders [Button](/components/actions/button) `Button.Root` instead, so activation, focus order and the native `disabled` attribute come from v0. The delete control of a text chip is its own `Button.Root` with an accessible name; a pressable chip cannot hold a second button, so there the glyph is decoration and the chip itself answers to Delete.

The contact chip's open state is v0's [Popover](/components/disclosure/popover). `Popover.Root` owns the `open` model and `Popover.Activator` binds the chip as its trigger once an `Addresses` part is present, which is where `aria-expanded`, `aria-controls` and `data-open` come from. `QuChip.Addresses` is `Popover.Content`: a native popover, so Escape and a press outside close it and focus returns to the chip without any Quantum code. The sheet is moved out of the chip's `<button>` into an outlet right beside it, which keeps it inside the chip's themed subtree.

On a pressable chip `data-disabled` comes from `Button.Root`; on a text chip Quantum sets it on the `<span>` itself. `data-open` comes from `Popover.Activator` once an `Addresses` part is present. `data-deletable`, `data-contact` and `data-focused` are Quantum's own; the chip never writes a state class. Every pressable chip and every address row starts with a [QuRipple](/systems/quantum/ripple).

## Examples

::: ds-example
/systems/quantum/chip/icon

### Text and an icon

`icon` names a role from the Quantum icon set and draws it through `QuIcon` ahead of the label: the page's "chip with text and an icon". The guidelines show the type but give no icon metrics, so Quantum draws the 24 dp glyph in the active icon tier (54% black, white on the dark theme), 4 dp from the chip's start edge and 8 dp before the label. Those three numbers are decisions; the 32 dp height, the 13 sp label at 87% and the 12 dp end padding are the page's.

The glyph is hidden from assistive technology, because the label already names the chip. Use an icon to classify a chip (a place, a date, a label) and keep the label as the content. When a chip stands for a person, use `avatar` instead: the photo takes the icon's place.
:::

::: ds-example
/systems/quantum/chip/deletable

### Deletable

`deletable` adds the remove glyph: the `cancel` icon at 24 dp in 54% black, with a 4 dp margin to the chip's end edge, which replaces the 12 dp end padding. The guidelines make the icon persistent on desktop, so Quantum never hides it on hover. Pressing it emits `delete`; the chip does not remove itself, because the list it belongs to is yours.

On a text chip the glyph is a real button named "Delete" plus the label ("Delete Toronto"), and Delete or Backspace on it emits `delete` too, as the page states. The page states a 2 dp rise on focus for the contact chip; Quantum extends it to every chip (a decision) and applies it to the whole chip while focus is anywhere inside it, the delete control included. The control keeps a 48 dp tall hit area, so the 24 dp glyph is easy to press on touch.
:::

::: ds-example
/systems/quantum/chip/pressable

### Pressable

Touching a chip, the guidelines say, opens a full detail view in a card or a full screen, or a menu of options for that chip. Bind `@click` and `QuChip` renders a native button with a ripple, a 6% hover overlay and the 12% keyboard focus overlay, and rises to 2 dp while focused. Open whatever the press stands for from the handler: a `QuDialog`, a `QuMenu`, or a route change.

The 32 dp chip answers to a 48 dp tall hit area, the touch target minimum of the metrics page, without taking that space in the layout. A pressable chip that is also deletable stays one button: a press on the glyph emits `delete` and never reaches your click handler, and the Delete key on the focused chip does the same, announced through `aria-keyshortcuts`.
:::

::: ds-example
/systems/quantum/chip/contact

### Contact chips

`contact` is the chip the guidelines put in a "To" field: the photo flush with the start edge at the chip's full height, 8 dp to the name, 12 dp after it, and the name at 14 sp. A contact chip is always a button. When it takes focus it rises to 2 dp and grows to 40 dp; the field around it gives back 4 dp on each side, from 20 dp of padding to 16 dp, so the row keeps its height. Tab through the chips above to see it.

The photo size is not in the page's text; Quantum follows the figures, a circle as tall as the chip. Contact chips are usually deletable, and the remove glyph sits at the end edge as on any chip. Since the contact chip is a button, delete it from the keyboard with Delete or Backspace once it has focus.
:::

::: ds-example
/systems/quantum/chip/addresses

### Open contact chip

Put a `QuChip.Addresses` part inside a contact chip and a press opens it: the chip expands into an 8 dp sheet, its top start corner on the chip's, headed by the photo and the name at 16 sp, with one `QuChip.Address` row per address at 14 sp. Mark the address in use with `active`; it is set at Medium weight (a decision: the page shows the activated row only as an image, and the primary colour fails contrast on the dark sheet) and, as the page says, "the top field is activated and focused by default", so focus lands on it when the sheet opens.

A press on the open chip closes it, also as the page says: a press on a row closes it after your `@click` runs, so swapping the address is one handler. Escape and a press outside close it too, and focus returns to the chip. The sheet's width, 280 dp at least, the 40 dp avatar and the 40 dp rows on the 72 dp keyline are decisions; the page states the type sizes and the elevation only. `v-model:open` reads and drives the state.
:::

::: ds-example
/systems/quantum/chip/disabled

### Disabled

The page states no disabled chip. Quantum's `disabled` drops the label to the disabled text tier (38% black, 50% white on the dark theme) and the glyphs to the inactive icon tier, and takes the chip out of pointer and keyboard interaction. A disabled delete control is a disabled button, out of the tab order, so `delete` cannot fire.

Prefer removing a chip that cannot be acted on over disabling it. A disabled chip in a list of filters reads as a filter that is applied but stuck, which is rarely what you mean.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuChip.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `QuIconName` | | A `QuIcon` role drawn ahead of the label at 24 dp |
| `avatar` | `string` | | Image URL for the photo at the start edge, as tall as the chip. Wins over `icon` |
| `deletable` | `boolean` | `false` | Shows the 24 dp `cancel` glyph at 54% with a 4 dp margin; it and the Delete or Backspace key emit `delete` |
| `contact` | `boolean` | `false` | The contact chip: always a button, name at 14 sp, 8 dp from the photo, 40 dp at 2 dp while focused. Opens its `Addresses` part on press |
| `disabled` | `boolean` | `false` | Disabled text and icon tiers; no press, no delete, out of the tab order when the chip is a button |
| `open` | `boolean` | `false` | `v-model:open`. Whether the contact chip's `Addresses` sheet is open |

| Event | Payload | Description |
|-------|---------|-------------|
| `delete` | none | The delete glyph was pressed, or Delete or Backspace was pressed on the chip or its delete control. Remove the chip from your list |
| `click` | `MouseEvent` | Binding it makes the chip a button. Not fired for a press on the delete glyph |

The default slot is the label, followed by the `Addresses` part on a contact chip. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `QuChip.Addresses` | none | The open contact chip: an 8 dp sheet headed by the chip's photo and name at 16 sp, listing the rows in its default slot. Only inside `QuChip contact`; elsewhere it renders nothing and warns in development |
| `QuChip.Address` | `active: boolean = false`, `disabled: boolean = false` | One 40 dp row at 14 sp. `active` marks the address in use with `aria-current` and Medium weight and takes focus on open. A press closes the sheet after the row's `@click` |

## Accessibility

A chip with no press is a `<span>` and is not focusable: it is content, read in line. A pressable chip and a contact chip are native `<button type="button">` elements named by their label; the photo and the icon are hidden from assistive technology.

### Deleting

| Chip | Delete control | Keyboard |
|------|----------------|----------|
| Text chip | A `<button>` named "Delete" plus the label, in the tab order after the chip's content | Enter or Space presses it; Delete or Backspace on it also emits `delete` |
| Pressable or contact chip | The glyph is `aria-hidden`; the chip carries `aria-keyshortcuts="Delete"` | Delete or Backspace on the focused chip emits `delete` |

The verb comes from `useLocale().ti('Quantum.delete')` with "Delete" as the fallback.

### Open contact chip

| Key | Behavior |
|-----|----------|
| Enter, Space | On the chip: opens the sheet and moves focus to the active address, or the first enabled one |
| Tab, Shift+Tab | Moves between the address rows |
| Enter, Space | On a row: runs its `@click` and closes the sheet |
| Escape | Closes the sheet and returns focus to the chip |

The chip carries `aria-expanded` and `aria-controls` while it owns a sheet. The sheet is a `role="dialog"` labelled by the contact's name, and the active row carries `aria-current="true"`.

### Focus

A focused chip rises to 2 dp, the guidelines' rule for the contact chip that Quantum extends to every chip, and keyboard focus on a pressable chip adds the 12% overlay. Under forced colours, where backgrounds are dropped, a 2 px outline draws in its place.
