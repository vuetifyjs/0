---
title: Md1DatePicker - Material Design 1 Date Picker for Vue
meta:
- name: description
  content: The Material Design 1 date picker with its primary header, month grid and year list, in portrait and landscape, hosted by a confirmation dialog. Built on Vuetify0.
- name: keywords
  content: md1 date picker, material design 1 date picker, calendar, year picker, vue date picker, vuetify0 date picker, paper md1
features:
  category: Component
  label: 'C: Md1DatePicker'
  level: 2
  renderless: false
  group: forms
  order: 7
related:
  - /systems/md1
  - /systems/md1/dialog
  - /systems/md1/time-picker
  - /composables/system/use-roving-focus
  - /composables/plugins/use-date
---

# Md1DatePicker

<DocsPageFeatures :frontmatter />

The Material Design 1 date picker: the chosen date in a coloured header over a month grid, with a year list one tap away. It picks one date, in a confirmation dialog.

<DocsMd1Reference
  href="https://m1.material.io/components/pickers.html"
  title="Pickers"
/>

> [!NOTE]
> The page gives no numbers; every size here is measured from its own artwork.

## Usage

`Md1DatePicker` is a shell component with no parts. `v-model` is an ISO date string (`YYYY-MM-DD`). Put it inside `Md1Dialog variant="confirmation"`, which supplies Cancel and OK: the dialog holds each pick until OK writes it to the dialog's `v-model:value`. The picker still emits every pick on its own model as it happens — that emit is how a hosting field formats what it shows — so keep committed state on `v-model:value`; a binding on the picker's model sees picks that Cancel never reverts.

::: ds-example
/systems/md1/date-picker/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1DatePicker } from '@paper/md1'
</script>

<template>
  <Md1DatePicker />
</template>
```

## Composed on Vuetify0

v0's [createDatePicker](/roadmap) is still a draft, so the calendar logic is Material Design 1's own until it lands: the visible month, the focused day, the six-week matrix, the year list and the selection write. The grid's keyboard model is v0's [useRovingFocus](/composables/system/use-roving-focus) in its seven-column grid mode, and every day, the header year and the two chevrons are v0 [Button](/components/actions/button) roots. When the app installs v0's [date plugin](/composables/plugins/use-date), its adapter formats the month label, the day names and the year, and its locale supplies the first weekday; without it the picker formats through `Intl` on the browser's locale.

Inside a confirmation `Md1Dialog` the picker reads the date the dialog holds and writes each pick back through it, so OK commits and Cancel discards without any wiring; the pick is also emitted on the picker's own model before OK, which is how the [text field's picker mode](/systems/md1/text-field#pickers) re-commits the display form it shows. Anywhere else it reads and writes its own `v-model`. `data-view` (`date` or `year`) and `data-landscape` are Material Design 1's hooks; the day buttons carry `data-selected` and `data-today`.

## Examples

::: ds-example
/systems/md1/date-picker/surface

### The picker surface

The picker on its own, at the dialog's 24 dp, so the anatomy reads at a glance. The guidelines put pickers in a dialog on mobile, and so should you; this example only drops the dialog to show the parts.

The header is a 96 dp band in the primary colour (Grey 700 on the dark theme) with the year in Body 2 size at 70% white over the date in Display 1, 34 sp at 100%, both 24 dp from the start edge. Below it sit the 48 dp navigation row, with the month in Body 2 between two chevrons 16 dp from the edges, the 40 dp row of weekday initials in 12 sp at the hint ink, and six week rows of 44 x 40 dp cells. The grid always draws six rows so the sheet keeps its height from month to month, and the days of the neighbouring months stay blank, as the spec draws them.

The selected day is a filled 40 dp circle in the primary colour with a white number ("the selected day is indicated by a filled circle"); today is printed in the primary colour and a heavier weight. On the dark theme both switch to the accent's 200 swatch, the selection-controls page's dark rule. The surface is 328 dp wide and 424 dp tall; the confirmation dialog's 60 dp action area brings it to the page's 484.

Tap the year in the header to swap the grid for the year list: 44 dp rows in Subheading, the selected year at 24 sp in the primary colour, centred when the list opens. Choosing a year keeps the day and month, clamped to the target month, and returns to the calendar. Swipe the grid sideways to change months; the chevrons do the same.
:::

::: ds-example
/systems/md1/date-picker/landscape

### Landscape

`landscape` moves the header into a 168 dp column at the start edge, where the date wraps to two lines at the 40 dp leading, and tightens the body to 344 dp with 46 x 32 dp cells and a 32 dp selection circle. The pickers page draws both layouts and says "the picker view adapts to the device's orientation".

Material Design 1 does not switch layouts on its own. The web notes in the spec ask for an explicit choice, not a guess from the viewport width, so bind `landscape` to whatever your app treats as landscape: an `(orientation: landscape)` media query, a short viewport, or a fixed decision for a desktop dialog. This example binds the orientation query through `useMediaQuery`, so a phone held upright opens the portrait sheet instead of a 512 dp one it cannot fit. The surface is 512 dp wide; with the dialog's action row below it the sheet is 324 dp tall, 20 dp over the page's measured 304, because the actions sit under the whole picker rather than inside the body column.[^sheet-height]
:::

::: ds-example
/systems/md1/date-picker/first-day

### First day of the week

`firstDayOfWeek` sets the column the week starts in, `0` for Sunday through `6` for Saturday; any other integer folds onto that range, so `7` is Sunday again. The pickers page draws a Sunday-first week; many locales start on Monday, and a calendar that disagrees with the reader's wall calendar is read wrong.

Leave it unset to follow the installed date plugin, whose locale knows its own first weekday; with no plugin the week starts on Sunday. The weekday initials rotate with the columns, and each column header keeps the full weekday name as its accessible name.
:::

::: ds-example
/systems/md1/date-picker/dark

### Dark theme

The portrait and landscape pickers on the dark theme's #303030 canvas. The header turns Grey 700, the sheet is the dark theme's Grey 800 card colour, and the selected day takes the accent control colour, the 200 hue that keeps contrast on a dark sheet. The landscape sheet scrolls sideways on a narrow screen rather than squeezing.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1DatePicker.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | | The selected date, `YYYY-MM-DD`. A value in another shape is ignored. Inside a confirmation `Md1Dialog` the picker reads the dialog's held value in its place, and still emits every pick here before OK — bind committed state to the dialog's `v-model:value`, since Cancel does not revert these emits |
| `landscape` | `boolean` | `false` | The landscape layout: a 168 dp header column beside a 344 dp body with 32 dp rows |
| `firstDayOfWeek` | `number` | | The weekday the grid starts on, `0` for Sunday. Unset, it follows the installed date plugin's locale, or Sunday without one |

There is no slot. Minimum and maximum dates, disabled dates and ranges are not part of the Material Design 1 picker and do not ship; neither does a built-in action row, which belongs to the dialog.

## Accessibility

The picker is a group named by the header date. The grid follows the WAI-ARIA date picker dialog pattern: a `grid` named by the month label, `columnheader` cells named with the full weekday, and `gridcell`s holding one button per day, named with the full date ("Thursday, April 13, 2017"). The selected cell is `aria-selected`, today carries `aria-current="date"`, and the month label is a polite live region, so paging announces the new month.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves between the header year, the chevrons and the grid. The grid is one stop: the selected day, or the focused one |
| Arrow Left, Arrow Right | Previous or next day, paging the month at its edges. Mirrored under `dir="rtl"` |
| Arrow Up, Arrow Down | The same weekday one week earlier or later |
| Home, End | First or last day of the week row |
| Ctrl+Home, Ctrl+End | First or last day of the month |
| Page Up, Page Down | The same day in the previous or next month, clamped to its length |
| Shift+Page Up, Shift+Page Down | The same day in the previous or next year |
| Enter, Space | Selects the focused day; in the year list, selects the focused year |
| Arrow Up, Arrow Down (year list) | Moves through the years |

### Header year

The header year is a toggle button named "Choose year" and the year, with `aria-pressed` reporting whether the year list is showing. Pressing it opens the `listbox` of years with the selected year focused and centred; pressing it again returns to the calendar without a change. Choosing a year returns focus to the day in the grid.

### In a dialog

Opened in a confirmation `Md1Dialog`, the native dialog moves focus straight to the selected day, so the arrows work at once. Escape and Cancel discard the change; OK commits it. The chevrons are named "Previous month" and "Next month" and both, like the year label, are translatable through `useLocale` (`Md1.previousMonth`, `Md1.nextMonth`, `Md1.chooseYear`, `Md1.year`).

[^sheet-height]: Our call: the dialog owns the action row, so it spans the header column too.
