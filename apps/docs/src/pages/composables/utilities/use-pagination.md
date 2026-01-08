---
title: usePagination - Lightweight Page Navigation for Vue 3
meta:
- name: description
  content: Lightweight composable for pagination state. Includes navigation methods (first, last, next, prev), computed visible pages, and v-model binding for Vue 3.
- name: keywords
  content: usePagination, pagination, navigation, composable, Vue 3, pages, page state, goto
features:
  category: Composable
  label: 'U: usePagination'
  github: /composables/usePagination/
  level: 2
related:
  - /composables/utilities/use-filter
  - /components/semantic/pagination
---

# usePagination

A lightweight composable for managing pagination state with navigation methods and computed visible page items.

<DocsPageFeatures :frontmatter />

## Usage

The `usePagination` composable provides reactive pagination state management with navigation methods and automatic computation of visible page items with ellipsis support.

```ts
import { ref } from 'vue'
import { createPagination } from '@vuetify/v0'

const pagination = createPagination({
  size: 200, // Total items
  itemsPerPage: 10,
  visible: 5,
})

console.log(pagination.pages) // 20 (200 items / 10 per page)
console.log(pagination.items.value)
// [
//   { type: 'page', value: 1 },
//   { type: 'page', value: 2 },
//   { type: 'page', value: 3 },
//   { type: 'ellipsis', value: '…' },
//   { type: 'page', value: 20 }
// ]
```

## Architecture

`usePagination` computes page state and navigation:

```mermaid
flowchart LR
  size --> pages[total pages]
  page --> items[visible items]
  pages --> items
  visible --> items
  page --> pageStart/pageStop
```

<DocsApi />
