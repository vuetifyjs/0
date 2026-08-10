---
title: EmCalendar - Emerald Calendar for Vue
meta:
- name: description
  content: Emerald's month calendar — an APG-conformant date grid with full keyboard navigation, an event layer, and a compact variant, over a calendar core incubating for Vuetify0.
- name: keywords
  content: emerald calendar, vue calendar, date grid vue, apg calendar, accessible calendar, event calendar vue
features:
  category: Component
  label: 'C: EmCalendar'
  level: 2
  renderless: false
  order: 5
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /composables/plugins/use-date
---

# EmCalendar

<DocsPageFeatures :frontmatter />

A month calendar with day selection, an event layer, and the full APG date-grid keyboard map. The compound is yours to arrange — header, title, navigation and grid are each their own part.

## Usage

`EmCalendar` owns two pieces of state and exposes both. `v-model` is the selected day as an ISO `YYYY-MM-DD` **string**; `v-model:month` is the visible-month cursor as a `Date`.

The selected day being a string rather than a `Date` is deliberate. Two `Date` objects for the same day are not equal, so a re-created value silently breaks identity checks and re-render guards; an ISO string compares by value and survives a round trip through JSON without a timezone shifting it a day.

Arrange the parts however the surface needs. Nothing is required except the root — a calendar with no header is valid, and so is one whose title sits above its navigation.

::: ds-example
/systems/emerald/calendar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmCalendar,
    EmCalendarGrid,
    EmCalendarHeader,
    EmCalendarMini,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
    EmCalendarToday,
  } from '@paper/emerald'
</script>

<template>
  <EmCalendar>
    <EmCalendarHeader>
      <EmCalendarPrev />

      <EmCalendarTitle />

      <EmCalendarNext />

      <EmCalendarToday />
    </EmCalendarHeader>

    <EmCalendarGrid />

    <EmCalendarMini />
  </EmCalendar>
</template>
```

## Composed on v0

This is the one pilot component that does **not** wrap a v0 compound, because v0 does not have a calendar yet.

Underneath `EmCalendar` is a `createCalendar` core — the cursor, the 42-cell matrix, the ISO arithmetic and the clamping — that lives inside Emerald as a private module and is not exported from any barrel. It is [incubating here ahead of graduating to v0](/composables/index), where it will become a public composable; Emerald is its first consumer, and building it against a real design system first is how its API gets found before it is frozen.

That does not make the component v0-free. The core is built from v0 primitives, the parts talk to each other through v0's `createContext`, `EmCalendarTitle` renders v0's `Atom` so its heading level is a prop, and `EmCalendarGrid` reads `useRtl` — which is why the horizontal arrow keys swap direction in a right-to-left locale rather than moving the wrong way.

Localization is optional and pluggable: the component reads v0's date plugin if one is installed, and falls back to `Intl` when it is not. Install [useDate](/composables/plugins/use-date) and the month names, weekday names and first-day-of-week follow the adapter.

> [!NOTE]
> Because the core is private, `min`, `max` and per-day disabling exist inside it but are not reachable from the component's props. Those will surface when the composable graduates.

## Examples

::: ds-example
/systems/emerald/calendar/month

### Controlling the visible month

`v-model:month` is a two-way binding on the cursor, so the visible month is as controllable as the selection. Writing a `Date` to it moves the calendar; the calendar writes back when the reader navigates.

The two models are independent, which is what you want. Paging through months does not change the selection, and selecting a day does not force the view somewhere else — the reader can look at March while February's date stays chosen.

`EmCalendarPrev`, `EmCalendarNext` and `EmCalendarToday` are the built-in controls, and each is a plain button you can re-label through its default slot. `EmCalendarToday` does two things rather than one: it returns the view to the current month *and* selects today, which is the behavior a "Today" button in a date picker is expected to have.

For anything beyond one month at a time — jumping a year, snapping to a quarter — write the `Date` directly, as this example does. There is no need to reach for the imperative API for that.
:::

::: ds-example
/systems/emerald/calendar/events

### The event layer

Events arrive as one flat `events` array on the root; there is no per-day slot. The component buckets them by ISO date internally, so an unsorted array with several entries on one day is fine, and `date` accepts either an ISO string or a `Date`.

Each event carries a `title`, an optional `time`, an `allDay` flag and a `tone`. Timed events trail their clock time; all-day events read as a filled bar. `tone` maps onto Emerald's severity palette — `neutral`, `primary`, `secondary`, `info`, `alert`, `danger` — so a calendar's colors stay the same colors the rest of the app uses for the same meanings.

`EmCalendarGrid` shows two chips per day before collapsing the rest into a `+N more` row; `overflow` changes the cut-off. The chips are inert spans rather than buttons, and that is a correctness constraint rather than a limitation: a day cell is a `<button>`, and a button cannot contain interactive children. Selecting a day and then rendering its events beside the calendar is the pattern to reach for when events need to be clickable.

The chips are also `aria-hidden`, with the count folded into the day's accessible name instead — a cell announces as "14 March 2026, 3 events" rather than reading out three titles a reader did not ask for. The titles are visual; the count is the semantic summary.
:::

::: ds-example
/systems/emerald/calendar/mini

### The compact variant

`EmCalendarMini` replaces `EmCalendarGrid` in the same compound — same root, same models, same events — and renders a dense month with tone dots instead of titled chips.

It is deliberately *not* the APG grid. Where `EmCalendarGrid` is a `role="grid"` with roving tabindex and a full keyboard map, the mini is a `role="group"` of ordinary tabbable buttons with no keydown handling at all. That is the right shape for what it is: a navigation widget in a sidebar, next to the real calendar rather than instead of it. Two grids on one page would put two roving-focus surfaces in the tab order and make the arrow keys ambiguous.

The consequence to plan for is that a month of mini days is a month of tab stops. Use it where a reader is glancing and jumping — picking a month, seeing which days are busy — and use the full grid as the surface they actually operate.

Dots are capped at three per day by the `dots` prop, and titles and times are not rendered at all.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the EmCalendar sources until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | — | Selected day as ISO `YYYY-MM-DD` |
| `v-model:month` | `Date` | current month | Visible-month cursor |
| `events` | `EmCalendarEvent[]` | `[]` | Events to lay over the month |
| `firstDayOfWeek` | `number` | date adapter's value | 0 is Sunday |
| `disabled` | `boolean` | `false` | Freezes selection and navigation |
| `id` | `string` | — | Root element id |
| `namespace` | `string` | `'emerald:calendar'` | Context the parts resolve against |

`EmCalendarEvent` is `{ date: string | Date, title: string, time?: string, allDay?: boolean, tone?: EmCalendarTone }`, where `EmCalendarTone` is `'neutral' | 'primary' | 'secondary' | 'info' | 'alert' | 'danger'`.

### Parts

Every part takes `namespace`, defaulting to `'emerald:calendar'` — except `EmCalendarHeader`, which accepts the prop for symmetry but reads no context and does nothing with it.

| Part | Props | Notes |
|------|-------|-------|
| `EmCalendarGrid` | `overflow` (`number`, default `2`) | The APG date grid. Chips per cell before `+N more` |
| `EmCalendarMini` | `dots` (`number`, default `3`) | Compact month; `role="group"`, no roving focus |
| `EmCalendarHeader` | — | Layout only. Takes `namespace` but ignores it |
| `EmCalendarTitle` | `as` (default `'h2'`), `live` (`boolean`, default `true`) | Labels the grid; announces month changes |
| `EmCalendarPrev` | `label` (default `'Previous month'`) | |
| `EmCalendarNext` | `label` (default `'Next month'`) | |
| `EmCalendarToday` | — | Returns to this month **and** selects today |

The root exposes its internal calendar context via `defineExpose({ calendar })`, giving imperative `goto`, `first`, `last` and the `isFirst` / `isLast` signals through a template ref. Note the extra hop — the context is exposed *under* a `calendar` key, so it is `ref.value.calendar.goto(…)`, not `ref.value.goto(…)`.

Treat all of it as provisional: that is the incubating core's surface, not a stable API, and it is the part most likely to change when the composable graduates to v0.

## Accessibility

`EmCalendarGrid` implements the WAI-ARIA APG date-grid pattern: `role="grid"` labelled by the title, `role="row"` weeks, and `role="gridcell"` days that are real buttons.

### Keyboard

The grid is a single tab stop. One cell holds `tabindex="0"` — the focused day, else the selected one, else today, else the first day of the month — and the arrow keys move a roving focus from there.

| Key | Behavior |
|-----|----------|
| Arrow Left / Right | Previous / next day. Swapped under RTL, so the keys follow reading order |
| Arrow Up / Down | Same weekday, previous / next week |
| Home / End | First / last day of the focused week |
| Page Up / Page Down | Previous / next month |
| Shift + Page Up / Page Down | Previous / next year |
| Enter, Space | Select the focused day — native, since the cell is a `<button>` |

Moving past the edge of the visible month pages the calendar and keeps focus on the day it landed on, so arrowing down from the last week walks into the next month rather than stopping. Home and End deliberately stay inside the rendered week, per APG, rather than jumping to the month's boundaries.

There is no Escape handling and no type-ahead; the grid is not a popup and owns no dismissal.

### Announcements

`EmCalendarTitle` is an `aria-live="polite"` region by default, so paging the month announces the new one — without it, a reader navigating by Page Up has no feedback that anything moved.

Turn `live` off when a second title renders over the same state; two live regions announcing the same month change is worse than one. It is also why the mini and the grid should share one title rather than each carrying their own.

### Cell naming

Each day is named by its full date, with the event count appended when there are any — "14 March 2026, 3 events". Event chips are `aria-hidden`, so the titles are not read out; the count tells the reader there is something there and the day is what they act on.

Today carries `aria-current="date"`, and the selected day `aria-selected`. Days outside the visible month are rendered but `aria-disabled` and unselectable, so the grid keeps its shape without offering dates the reader did not navigate to.

### The mini variant

`EmCalendarMini` is `role="group"` with plain buttons — no grid semantics and no roving focus, by design, so it never competes with the real grid for the arrow keys. The cost is that every day is a tab stop; that is the trade you accept for a widget meant to be glanced at and clicked rather than operated by keyboard.
