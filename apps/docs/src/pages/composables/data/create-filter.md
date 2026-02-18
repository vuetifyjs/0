---
title: createFilter - Reactive Array Filtering for Vue 3
meta:
- name: description
  content: Filter arrays based on search queries with multiple filter modes (some, every, union, intersection) and custom filtering logic. Reactive and type-safe for Vue 3.
- name: keywords
  content: createFilter, filter, search, composable, Vue 3, array filtering, reactive, type-safe
features:
  category: Composable
  label: 'E: createFilter'
  github: /composables/createFilter/
  level: 2
related:
  - /composables/data/create-pagination
  - /composables/data/create-virtual
---

# createFilter

A composable for filtering arrays of items based on search queries, supporting both primitive values and complex objects with customizable filtering logic.

<DocsPageFeatures :frontmatter />

## Usage

The `createFilter` composable provides reactive array filtering with multiple modes for different search behaviors. It works with both primitive values and complex objects, and supports filtering by specific keys.

```ts collapse
import { ref, shallowRef } from 'vue'
import { createFilter } from '@vuetify/v0'

const query = shallowRef('doe')
const items = ref([
  { name: 'John Doe', age: 30, city: 'New York' },
  { name: 'Jane Doe', age: 25, city: 'Los Angeles' },
  { name: 'Peter Jones', age: 40, city: 'Chicago' },
])

const filter = createFilter({ keys: ['name'] })
const { items: filtered } = filter.apply(query, items)

console.log(filtered.value)
// [
//   { name: 'John Doe', age: 30, city: 'New York' },
//   { name: 'Jane Doe', age: 25, city: 'Los Angeles' }
// ]
```

## Architecture

`createFilter` provides pure filtering logic with context support:

```mermaid "Filter Flow"
flowchart LR
  query[query ref] --> apply
  items[items ref] --> apply
  filter[createFilter]:::primary --> apply
  apply --> computed[filtered items]
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `query` | <AppSuccessIcon /> | ShallowRef, updated on each `apply()` |
| `items` (from apply) | <AppSuccessIcon /> | Computed, filters reactively |

> [!TIP] Reactive filtering
> Both the query and items passed to `apply()` can be reactive. The filtered result automatically updates when either changes.

<DocsApi />

## Examples

::: example
/composables/create-filter/live-search
:::
