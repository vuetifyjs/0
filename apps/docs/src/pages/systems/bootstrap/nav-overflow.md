---
title: BNavOverflow - Bootstrap 6 Nav overflow for Vue
meta:
- name: description
  content: Bootstrap 6 nav overflow for Vue. Items that do not fit the row move into a More menu. An item marked nav-overflow-keep stays visible.
- name: keywords
  content: bootstrap 6 nav overflow, vue nav, more menu, nav-overflow-keep, responsive nav, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BNavOverflow'
  level: 2
  renderless: false
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/navbar
  - /systems/bootstrap/menu
  - /composables/semantic/create-overflow
---

# BNavOverflow

A nav row that measures its items and moves the ones that do not fit into a menu labeled More.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: the pinned Bootstrap 6 nav-overflow examples. Classes and the More menu. This page is Vue.

## Usage

Items are slotted. There is no `items` array. `more` renames the menu. `keep` on an item, or the class `nav-overflow-keep`, leaves that item in the row.

::: ds-example
/systems/bootstrap/nav-overflow/basic
:::

### The markup Bootstrap documents

The HTML tab is the pinned wrapper. The More control is not in that markup. This component inserts it when the row overflows. `data-bs-toggle` is the bundle's behavior. This package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<div class="nav-overflow">
  <ul class="nav nav-pills">
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#">Home</a>
    </li>
    <li class="nav-item nav-overflow-keep">
      <a class="nav-link" href="#">Contact</a>
    </li>
  </ul>
</div>
```

```vue Vue collapse
<template>
  <BNavOverflow>
    <ul class="nav nav-pills">
      <BNavOverflow.Item>
        <a class="nav-link" href="#">Home</a>
      </BNavOverflow.Item>
      <BNavOverflow.Item keep>
        <a class="nav-link" href="#">Contact</a>
      </BNavOverflow.Item>
    </ul>
  </BNavOverflow>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BNavOverflow } from '@paper/bootstrap'
</script>

<template>
  <BNavOverflow>
    <BNavOverflow.Item />
  </BNavOverflow>
</template>
```

## Composed on v0

Widths come from [createOverflow](/composables/semantic/create-overflow). Every item calls `measure` with its element and its index, and clears that measurement on unmount. Kept items are not measured as collapsible — their width is reserved instead, along with the More button once the row overflows.

The More menu is a `div.menu`, positioned with [usePopover](/composables/system/use-popover). It is not [BMenu](/systems/bootstrap/menu), because that trigger is `btn-solid theme-primary` and this control is a `nav-link`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `more` | `string` | `'More'` | Label of the menu of items that do not fit. Rendered in `span.nav-overflow-text`. |
| `gap` | `number` | the nav's `column-gap` | Pixel gap between measured items. |
| `keep` | `boolean` | `false` | On `BNavOverflow.Item`. Same rule as the class `nav-overflow-keep`. |

## Accessibility

The More control is a `button` with `aria-haspopup="menu"` and `aria-expanded`. Escape closes the menu. A click outside closes it. Items that moved are in the menu; their copies in the row are hidden, so they are not in the tab order twice. A kept item stays a normal nav link.
