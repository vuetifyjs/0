---
title: Md1SearchBar - Material Design 1 Search Bar for Vue
meta:
- name: description
  content: The Material Design 1 persistent search bar. A raised 48 dp inset box with the search glyph that becomes the up arrow, clear and voice actions, recent queries and completions, and the desktop Search button. Built on Vuetify0's Combobox.
- name: keywords
  content: md1 search bar, material design 1 search, persistent search, search suggestions, vue search bar, vuetify0 combobox, paper md1
features:
  category: Component
  label: 'C: Md1SearchBar'
  level: 2
  renderless: false
  group: navigation
  order: 4
related:
  - /systems/md1
  - /systems/md1/toolbar
  - /systems/md1/text-field
  - /components/forms/combobox
---

# Md1SearchBar

<DocsPageFeatures :frontmatter />

The persistent search of Material Design 1. A raised inset box that is always on screen, with recent queries on focus, completions as the user types, and results laid out as cards below it.

<DocsMd1Reference
  href="https://m1.material.io/patterns/search.html"
  title="Search"
/>

> [!NOTE]
> Read with the solo field of [Text fields](https://m1.material.io/components/text-fields.html).

## Usage

`Md1SearchBar` is a compound. The root is the bar; its default slot is the suggestion list, filled with `Md1SearchBar.Item` rows and an optional `Md1SearchBar.Empty`. `v-model` holds the query and `submit` reports it.

Use it when search is the primary focus of the screen. When search is secondary, use the expandable search of [Md1Toolbar](/systems/md1/toolbar) instead.

::: ds-example
/systems/md1/search-bar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1SearchBar } from '@paper/md1'
</script>

<template>
  <Md1SearchBar>
    <Md1SearchBar.Item />

    <Md1SearchBar.Empty />
  </Md1SearchBar>
</template>
```

## Composed on Vuetify0

`Md1SearchBar` renders v0's [Combobox](/components/forms/combobox) parts against one combobox that Material Design 1's `useSearch` creates, the same core the expandable search of `Md1Toolbar` uses. `Combobox.Activator` is the inset box, `Combobox.Control` is the field, `Combobox.Content` is the suggestion list, and every `Md1SearchBar.Item` is a `Combobox.Item`. Filtering is v0's client adapter: rows that do not contain the query stay registered and hide.

v0 owns the field's keyboard model, the virtual highlight (`aria-activedescendant`), the popover the list opens in and the outside click that closes it. Material Design 1 adds the search pattern on top: Enter or a chosen row submits, the X clears, the up arrow releases. The nav, clear, voice and Search actions are [Md1Button](/systems/md1/button)s, so each one carries a [Md1Ripple](/systems/md1/ripple). The box itself is the solo anatomy of [Md1TextField](/systems/md1/text-field): the field's editable element is `Combobox.Control`, not `Input.Control`, so the bar reuses the solo values rather than mounting an `Md1TextField`.

## Examples

::: ds-example
/systems/md1/search-bar/basic

### The persistent bar

The search box is an inset sheet presented ready to receive focus. Material Design 1 draws it at 48 dp, the solo field height of the text fields page (the search page gives no metric),[^height] on the surface colour with 2 dp corners and the 2 dp resting elevation of the elevation page's quick entry and search bar row. Under a fine pointer (mouse and keyboard) the closed box rests 2 dp lower, at 0 dp, the elevation page's desktop rule for every resting value; opened, it is no longer at rest and overlaps the page at 2 dp like a menu.[^open] The search glyph sits on the 16 dp keyline and the query starts on the 72 dp keyline, set in Subheading 16 sp like every text field's input.

Focus turns the search glyph into the up arrow and opens the suggestions. Enter submits the query, and so does choosing a suggestion; either way the field keeps the query and gives up focus, so the results show with the bar visible but not focused, as the pattern prescribes. The `submit` event carries the trimmed query; a blank query submits nothing.
:::

::: ds-example
/systems/md1/search-bar/suggestions

### Recent queries and completions

The pattern orders suggestions by intent. Before a query is complete the field shows historical suggestions, the user's recent queries; as the user types it shifts to auto-completion against the app's data. `history` marks a recent query: it draws the history glyph and is offered from focus. An item without it is a completion with the search glyph, shown only once something is typed. Both filter as the user types, so recent matches stay first.

Rows are 48 dp single-line list rows with the glyph on the 16 dp keyline and the text on the 72 dp keyline, the list and navigation drawer metrics. The list opens directly under the box at its width, squaring the box's lower corners so the two read as one expanded card.[^card] `Md1SearchBar.Empty` is the row for a typed query nothing matches; it never shows before something is typed, and with no Empty part and nothing to offer the list stays shut.
:::

::: ds-example
/systems/md1/search-bar/voice

### Voice search

`voice` adds the microphone at the end of the box. The guidelines show it only when voice search is supported, and touching it initiates a voice search; on the web that means the app's own speech capture, so the bar only emits `voice` and leaves the transcript to the app, which writes it back through `v-model`. The microphone keeps the caret in the field.

The X clear action appears beside it as soon as the field has characters, empties the query, emits `clear` and keeps focus in the field so the user can type again.
:::

::: ds-example
/systems/md1/search-bar/button

### Desktop Search button

The text fields page puts a raised search button to the right of the field on desktop. Material Design 1 renders it as a raised `Md1Button` labelled Search, 16 dp after the box, and shows it whenever the pointer is fine (mouse and keyboard), whatever `button` says. `button` forces it on for touch layouts too and sets `data-button` on the root.

The button submits the typed query exactly as Enter does. On a fine pointer it follows the raised button's desktop rule, resting at 0 dp and lifting to 2 dp on hover.
:::

::: ds-example
/systems/md1/search-bar/scrolled

### Scrolled

The elevation page gives the search bar two values: 2 dp at rest and 3 dp when content scrolls under it. `scrolled` is that state: it sets `data-scrolled` and lifts the box and an open list to 3 dp. Under a fine pointer the closed box sits 2 dp lower, at 1 dp. The bar does not watch scrolling itself, since only the app knows which container scrolls under it; this example sets it from the scroll position of the region the bar is pinned to.
:::

::: ds-example
/systems/md1/search-bar/results

### Results as cards

The pattern formats results as cards to match the inset look of the search box. Results are not part of the bar: listen for `submit`, run the search and render [Md1Card](/systems/md1/card)s below it. The bar stays visible, unfocused, with the query in place, ready for the next search.
:::

::: ds-example
/systems/md1/search-bar/expandable

### Results under an expandable search

In-app search can also live behind a search icon in the app bar: `Md1Toolbar.Search` expands over the bar, offers completions, and on submit the screen's content is replaced by the results while the query stays in the expanded bar. Here the results are a list with a count above it; clearing the query returns to the screen's content.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1SearchBar.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The query: the text in the field. Use `v-model` |
| `placeholder` | `string` | `'Search'` | Hint text in the empty field; also the accessible name of the field and the search landmark. The default comes from the locale key `Md1.search` |
| `voice` | `boolean` | `false` | The microphone action; emits `voice` |
| `button` | `boolean` | `false` | The raised Search button to the right of the box on any pointer. It always shows under a fine pointer |
| `scrolled` | `boolean` | `false` | Content scrolls under the bar: 3 dp instead of 2 dp (closed under a fine pointer: 1 dp instead of 0 dp) |
| `disabled` | `boolean` | `false` | Disables the field and every action; nothing opens |
| `id` | `string` | | Root id: the field is `${id}-input` and the list `${id}-listbox` |
| `namespace` | `string` | `'md1:search-bar:combobox'` | The combobox context key the parts join. Change it only to nest two bars |

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `string` | The trimmed query, on Enter, the Search button or a chosen suggestion |
| `voice` | | The microphone was pressed |
| `clear` | | The X emptied the field |

The default slot is the suggestion list. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1SearchBar.Item` | `value: string`, `history?: boolean`, `icon?: Md1IconName`, `disabled?: boolean` | A 48 dp suggestion row (`Combobox.Item`). `history` marks a recent query, shown from focus with the history glyph; without it the row is a completion, shown once something is typed, with the search glyph. `icon` replaces the glyph; the slot replaces the text, which defaults to `value`. Choosing it submits `value` |
| `Md1SearchBar.Empty` | | The row for a typed query nothing matches (`Combobox.Empty`). The default text comes from `Md1.noResults` (`'No results'`); the slot receives `{ query }` |

Both parts render nothing and warn in development when placed outside `Md1SearchBar`.

### Data attributes

| Attribute | On | Set when |
|-----------|----|----------|
| `data-focused` | root | The field has focus, or focus moved from the field to one of the box's actions. Focus that lands on the search glyph at rest does not set it |
| `data-open` | root | The suggestion list is showing |
| `data-scrolled` | root | `scrolled` is set |
| `data-button` | root | `button` is set |
| `data-disabled` | root | `disabled` is set |
| `data-history` | item | The row is a recent query |

## Accessibility

The root is a `<form role="search">`, a search landmark named by `placeholder`. The field is a WAI-ARIA combobox from v0: `role="combobox"` with `aria-expanded`, `aria-controls` pointing at the `role="listbox"` list, and `aria-activedescendant` following the highlighted row while DOM focus stays in the field. Every icon action is a native button with its own name: Search or Back for the nav glyph, Clear, and Voice search, from the locale keys `Md1.search`, `Md1.back`, `Md1.clear` and `Md1.voice`.

### Keyboard

| Key | Behavior |
|-----|----------|
| Arrow Down, Arrow Up | Opens the suggestions, then moves the highlight through the visible rows |
| Enter | Submits the highlighted row, or the typed query when nothing is highlighted, and releases the field |
| Escape | Closes the suggestions; focus stays in the field |
| Home, End | Clears the highlight, so the caret keys edit the query again |
| Tab | From the field, closes the suggestions and moves to the clear and voice actions, then to the Search button when it shows |
| Shift+Tab | From the field, reaches the up arrow; Enter on it releases the bar |
| Tab into the bar | Lands on the search glyph, which stays the search glyph; Enter on it moves focus into the field |

### Focus

The field draws no focus ring: the caret in the accent colour and the up arrow mark focus inside the box. Pointer presses on the nav, clear and voice actions keep the caret in the field. Releasing the bar, by the up arrow or a submit, moves focus out, the web counterpart of the pattern dismissing the on-screen keyboard.

[^height]: Vuetify 1.5.24, stylus/components/_text-fields.styl:318-319. The solo field's 48 px minimum height, the same value.

[^open]: Our call: the elevation page gives no open state for the bar.

[^card]: Our call: the pattern page shows the expanded card without metrics.
