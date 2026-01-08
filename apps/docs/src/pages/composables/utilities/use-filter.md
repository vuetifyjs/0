---
title: useFilter - Reactive Array Filtering for Vue 3
meta:
- name: description
  content: Filter arrays based on search queries with multiple filter modes (some, every, union, intersection) and custom filtering logic. Reactive and type-safe for Vue 3.
- name: keywords
  content: useFilter, filter, search, composable, Vue 3, array filtering, reactive, type-safe
features:
  category: Composable
  label: 'E: useFilter'
  github: /composables/useFilter/
  level: 2
related:
  - /composables/utilities/use-pagination
  - /composables/utilities/use-virtual
---

# useFilter

A composable for filtering arrays of items based on search queries, supporting both primitive values and complex objects with customizable filtering logic.

<DocsPageFeatures :frontmatter />

## Usage

The `useFilter` composable provides reactive array filtering with multiple modes for different search behaviors. It works with both primitive values and complex objects, and supports filtering by specific keys.

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const items = ref([
  { name: 'John Doe', age: 30, city: 'New York' },
  { name: 'Jane Doe', age: 25, city: 'Los Angeles' },
  { name: 'Peter Jones', age: 40, city: 'Chicago' },
])

const query = ref('doe')
const { items: filtered } = useFilter(query, items, { keys: ['name'] })

console.log(filtered.value)
// [
//   { name: 'John Doe', age: 30, city: 'New York' },
//   { name: 'Jane Doe', age: 25, city: 'Los Angeles' }
// ]
```

## Architecture

`useFilter` provides pure filtering logic with context support:

```mermaid
flowchart LR
  query[query ref] --> filter
  items[items ref] --> filter
  options[mode/keys] --> filter
  filter --> computed[filtered items]
```

<DocsApi />
