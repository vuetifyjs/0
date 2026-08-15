---
title: EmPagination - Emerald Pagination for Vue
meta:
- name: description
  content: Emerald's pagination — page buttons, prev/next controls and an automatic ellipsis window, composed on Vuetify0's headless Pagination compound.
- name: keywords
  content: emerald pagination, vue pagination, design system pagination, page navigation vue, vuetify0 pagination, paper emerald
features:
  category: Component
  label: 'C: EmPagination'
  level: 2
  renderless: false
  order: 17
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/semantic/pagination
---

# EmPagination

<DocsPageFeatures :frontmatter />

Page navigation for long lists — numbered page buttons, previous/next controls, and an ellipsis window that collapses the pages you are not near.

## Usage

`EmPagination` is a compound: the root owns the page state and the math, and you lay out the parts — `EmPaginationPrev`, `EmPaginationItem`, `EmPaginationNext` — inside its default slot. The slot receives `items`, the computed window of page entries, and each entry is either a page (`type: 'page'`) or an ellipsis (`type: 'ellipsis'`); render an `EmPaginationItem` for the pages and a plain span for the gaps.

The prop worth reading twice is `size`. It is the total number of **items**, not pages — the page count is derived as `size / itemsPerPage`, rounded up. Passing your page count to `size` is the most common way to end up with a pagination that shows a tenth of the pages you expected.

`v-model` is the current page, 1-indexed, and writes outside the valid range are clamped rather than honored.

::: ds-example
/systems/emerald/pagination/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
  } from '@paper/emerald'
</script>

<template>
  <EmPagination>
    <EmPaginationPrev />

    <EmPaginationItem />

    <EmPaginationNext />
  </EmPagination>
</template>
```

## Composed on v0

`EmPagination` renders v0's [Pagination](/components/semantic/pagination) compound — `Pagination.Root`, `Pagination.Item`, `Pagination.Next` and `Pagination.Prev` — inside an Emerald shell.

The split is clean: v0 owns everything that thinks, Emerald owns everything that shows. The page model and its clamping, the window math that decides which page numbers are visible and where the ellipses go, the boundary logic that disables Prev on page one and Next on the last page, and the localized `aria-label` on every control all come from `Pagination.Root` and its parts. Emerald contributes the wrapping element, the flex layout and gap, and a stylesheet that hangs entirely off the `data-selected` and `data-disabled` attributes v0 already emits — Emerald never writes a state class of its own.

One consequence of that split is the responsive default. When `totalVisible` is unset, `Pagination.Root` measures its container and the rendered buttons and computes how many page buttons actually fit, subtracting the space the navigation controls occupy; during SSR and before the first measurement it falls back to seven. Set `totalVisible` and the window is capped at that count instead — the measurement still applies, so the cap never forces an overflow.

v0's compound also ships `Pagination.First`, `Pagination.Last`, `Pagination.Ellipsis` and `Pagination.Status`, which Emerald does not wrap yet. Because the Emerald parts resolve the same default namespace as v0's, the raw parts do drop into an `EmPagination` and function — but they arrive unstyled, so treat that as an escape hatch rather than a pattern.

## Examples

::: ds-example
/systems/emerald/pagination/window

### Capping the window

`totalVisible` fixes how many page buttons render. The first and last page are always among them, the current page stays in view, and ellipses mark the collapsed runs on either side — with `totalVisible` set to `5` and 48 pages, the middle of the range renders as `1 … 12 … 48`.

Leave it unset when the pagination has room to breathe: the auto-measured window uses whatever width the container gives it and re-computes when that width changes, which is the better default in a fluid layout. Reach for a fixed cap when the design calls for a stable, predictable footprint — a card footer, a dense table toolbar — where buttons appearing and disappearing as the viewport moves would read as jitter.

The `ellipsis` prop controls the gap marker itself. It is a string, so any character works, and passing `false` removes the gap entries from `items` entirely — the window then simply omits the collapsed pages with nothing in their place.
:::

::: ds-example
/systems/emerald/pagination/summary

### The range summary

The default slot exposes more than `items`. `pageStart` and `pageStop` are the index range of the current page — `pageStart` is 0-indexed and `pageStop` is exclusive, so the human-readable form is `pageStart + 1` through `pageStop` — and `size` and `pages` are the totals they slice. A "1–8 of 87" summary is a one-line interpolation away, and because it derives from the same state as the buttons, it can never disagree with them.

This matters more than it looks. The controls themselves announce only which page is current; nothing announces what the page *contains*. A visible range summary is the cheapest way to give every reader — sighted or not — the answer to "where am I in this list", and it belongs next to the controls, not in a tooltip.

The slot also exposes the imperative surface — `first`, `last`, `next`, `prev` and `select` — for the occasional control that lives outside the standard parts, like a "jump to end" button in a log viewer.
:::

## Props

`EmPagination` also binds `v-model` — the current page as a `number`, 1-indexed, defaulting to `1`.

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `1` | Total number of **items** (not pages). The page count is `size / itemsPerPage`, rounded up |
| `itemsPerPage` | `number` | `10` | How many items each page holds |
| `totalVisible` | `number` | — | Caps the visible page buttons. Unset, the count is measured from the container width |
| `ellipsis` | `string \| false` | `'…'` | Gap marker in `items`. `false` omits gap entries entirely |
| `namespace` | `string` | — | Which v0 `Pagination` instance to bind to. Only needed when nesting |

The default slot receives the full v0 slot surface: `items`, `page`, `pages`, `size`, `itemsPerPage`, `pageStart`, `pageStop`, `isFirst`, `isLast`, and the methods `first`, `last`, `next`, `prev`, `select`. The `attrs` object in that slot is already bound to the rendered `nav`; do not spread it onto a child.

### Parts

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Part | Props | Notes |
|------|-------|-------|
| `EmPaginationItem` | `value` (`number`, required), `disabled` (`boolean`, default `false`), `namespace` | One page button. Default slot falls back to the page number |
| `EmPaginationPrev` | `namespace` | Previous-page button. Slot is the label; disables itself on the first page |
| `EmPaginationNext` | `namespace` | Next-page button. Slot is the label; disables itself on the last page |

`EmPaginationItem` forwards its v0 slot props — `page`, `isSelected`, `isDisabled`, `select` — so a custom label can still read its own state. Its `attrs` object is already bound to the rendered button; do not spread it again. `EmPaginationPrev` and `EmPaginationNext` pass nothing to their slots; their content is purely the label, and both render empty unless you provide one — an icon, text, or both.

## Accessibility

`Pagination.Root` renders a `<nav>` landmark labelled "Pagination" (via v0's locale plugin, key `Pagination.label`), so assistive technology can jump straight to the controls.

### Naming and state

Every control is a native `<button>` with a localized accessible name, which is why icon-only Prev and Next buttons are safe here — the name does not come from the content:

| Control | Accessible name | State attributes |
|---------|-----------------|------------------|
| `EmPaginationItem` | "Go to page N", or "Page N, current" when selected | `aria-current="page"`, `data-selected` on the current page |
| `EmPaginationPrev` | "Previous page" | `disabled`, `aria-disabled`, `data-disabled` on the first page |
| `EmPaginationNext` | "Next page" | `disabled`, `aria-disabled`, `data-disabled` on the last page |

Prev and Next disable through the native `disabled` attribute, so at a boundary they leave the tab order entirely rather than sitting in it inert. A disabled `EmPaginationItem` gets the same three-pronged treatment — `disabled`, `aria-disabled`, `data-disabled` — plus `tabindex="-1"`.

### Keyboard

Everything is a native button, so activation is the platform's: Enter and Space work without any script, and Tab moves between the controls. There is no arrow-key roving focus — each visible control is its own tab stop, which is the intended pattern for pagination: the window keeps the stop count small, and a reader tabbing through a page expects the page buttons to be individually reachable.

### Announcing the page change

Selecting a page updates `aria-current` on the buttons, but nothing announces the new content — there is no live region in the component. When the paged content replaces itself in place, pair the pagination with a visible range summary (as in the example above) or move focus to the updated region, so a screen-reader user gets confirmation that the click did something. v0 ships a `Pagination.Status` part for exactly this; Emerald has no skin for it yet.

### Focus

All three parts share the same `:focus-visible` treatment — Emerald's focus ring token as a box shadow, shown for keyboard focus only, so a mouse click does not leave a ring behind.
