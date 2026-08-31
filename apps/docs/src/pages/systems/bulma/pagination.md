---
title: BuPagination - Bulma Pagination for Vue
meta:
- name: description
  content: Bulma's pagination markup with Vuetify0 behavior — 1-indexed v-model, composed Prev/Next/List/Item/Ellipsis parts, anchors in the documented DOM order.
- name: keywords
  content: bulma pagination, vue pagination, pagination-list, is-current, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuPagination'
  level: 2
  renderless: false
  order: 8
related:
  - /systems/bulma
  - /systems/bulma/breadcrumb
  - /components/semantic/pagination
---

# BuPagination

<DocsPageFeatures :frontmatter />

Bulma's `.pagination` with the JavaScript it never shipped: current page, ellipses, and disabled previous and next.

> [!NOTE]
> Reference: [Pagination on bulma.io](https://bulma.io/documentation/components/pagination/) — classes and visual variants. This page is the JavaScript.

## Usage

`v-model` is the current page, 1-indexed. `pages` is how many there are. Compose `BuPaginationPrev`, `BuPaginationNext`, then `BuPaginationList` with `BuPaginationItem` / `BuPaginationEllipsis` children — that DOM order is load-bearing. Bulma CSS flex-orders the list between the two anchors visually; the harness diffs the source order.

::: ds-example
/systems/bulma/pagination/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuPagination } from '@paper/bulma'
</script>

<template>
  <BuPagination>
    <BuPagination.Prev />

    <BuPagination.Next />

    <BuPagination.List>
      <BuPagination.Item />

      <BuPagination.Ellipsis />
    </BuPagination.List>
  </BuPagination>
</template>
```

## Composed on v0

`BuPagination` maps onto v0's [Pagination](/components/semantic/pagination) compound: `Pagination.Root`, `Pagination.Prev`, `Pagination.Next`, `Pagination.Item` and `Pagination.Ellipsis`.

v0's `size` is total items, not page count. The mapping is `:size="pages"` with `:items-per-page="1"`, which is why the prop is named `pages` and why `size` / `itemsPerPage` never appear on this surface.

`visible` is `totalVisible`. Omit it and the root measures the container and shows as many page links as fit; pass it and the window is a hard cap, with ellipses filling the gaps.

What the parts own is the Bulma shape the compound does not: anchors (`as="a"`) instead of buttons, `is-disabled` / `is-current` classes instead of a `disabled` attribute, and the consumer-authored DOM order Previous, Next, *then* `ul.pagination-list`.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/pagination/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — localized `aria-label` text and the absence of placeholder `href`s are the tolerated differences.

::: code-group no-filename

```html Bulma collapse
<nav class="pagination" role="navigation" aria-label="pagination">
  <a href="#" class="pagination-previous">Previous</a>
  <a href="#" class="pagination-next">Next page</a>
  <ul class="pagination-list">
    <li>
      <a href="#" class="pagination-link" aria-label="Goto page 1">1</a>
    </li>
    <li>
      <span class="pagination-ellipsis">&hellip;</span>
    </li>
    <li>
      <a href="#" class="pagination-link" aria-label="Goto page 45">45</a>
    </li>
    <li>
      <a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
    </li>
    <li>
      <a href="#" class="pagination-link" aria-label="Goto page 47">47</a>
    </li>
    <li>
      <span class="pagination-ellipsis">&hellip;</span>
    </li>
    <li>
      <a href="#" class="pagination-link" aria-label="Goto page 86">86</a>
    </li>
  </ul>
</nav>
```

```vue Vue
<template>
  <BuPagination v-slot="{ items }" v-model="page" :pages="86" :visible="7">
    <BuPagination.Prev>Previous</BuPagination.Prev>

    <BuPagination.Next>Next page</BuPagination.Next>

    <BuPagination.List>
      <template v-for="(item, index) in items" :key="index">
        <BuPagination.Item v-if="item.type === 'page'" :value="item.value" />

        <BuPagination.Ellipsis v-else />
      </template>
    </BuPagination.List>
  </BuPagination>
</template>
```

:::

You write no `is-current` and no `is-disabled` — Prev/Next/Item apply those from the pagination context. An out-of-range model is clamped back so the parent matches what renders. A disabled previous's `title` (fixture: `"This is the first page"`) is authored content — bind it as an attribute on `BuPaginationPrev`.

## Examples

::: ds-example
/systems/bulma/pagination/window

### Visible window

`visible` caps how many page links are shown at once. The rest collapse behind ellipses, with the first page, the last page, and a window around the current page kept. The example is the fixture's 86-page run with the cap at 5 — enough to force both ellipses without hiding the current page.

Omit `visible` and the cap is measured from the container instead. That is the right default for a pagination that should fill its bar; pass `visible` when the surrounding layout cannot tolerate a changing control width, or when you want the same window at every breakpoint.

The trade is information. A hard cap of 5 on 86 pages tells the reader almost nothing about where they are in the run except through the current-page mark and the first/last links. Pair it with copy that names the page, or raise the cap until the window is a useful map.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* yet. Keep in sync with the SFC. -->

`BuPagination` also binds `v-model` — the current page as a `number`, 1-indexed, defaulting to `1`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pages` | `number` | `1` | Total page count |
| `visible` | `number` | — | Visible page-link cap; omit for auto-measure |
| `ellipsis` | `string` | `'…'` | Character between page ranges |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` |
| `rounded` | `boolean` | — | `is-rounded` |
| `centered` | `boolean` | — | `is-centered` |
| `right` | `boolean` | — | `is-right` |

The default slot receives v0's pagination surface (`items`, `isFirst`, `isLast`, `page`, …). Iterate `items` to render Item/Ellipsis children.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `BuPaginationPrev` | `namespace` | `.pagination-previous`. Slot is the label (default `Previous`). Applies `is-disabled` on the first page |
| `BuPaginationNext` | `namespace` | `.pagination-next`. Slot is the label (default `Next page`). Applies `is-disabled` on the last page |
| `BuPaginationList` | — | `ul.pagination-list` |
| `BuPaginationItem` | `value` (`number`, required), `namespace` | `li > a.pagination-link`. Applies `is-current` when selected |
| `BuPaginationEllipsis` | `namespace` | `li > span.pagination-ellipsis` |

DOM order is previous, next, then the list — CSS puts the list in the middle visually. Do not reorder in JS.

## Accessibility

The root is a `nav` whose accessible name comes from the locale key `Pagination.label`. Page links, previous and next are anchors, not buttons: `disabled` is omitted (it is not valid on `<a>`), and the inert state is `is-disabled` plus `aria-disabled` and `tabindex="-1"`. The current page is `is-current` with `aria-current="page"`.

Enter and Space activate those anchors. Ellipses are `aria-hidden`. Page-link names come from the locale keys `Pagination.goToPage` and `Pagination.currentPage` — do not copy the fixture's "Goto page N" strings; they are documentation placeholders, and the conformance suite ignores the difference on purpose.
