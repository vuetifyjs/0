---
meta:
  title: useFilter
  description: Creates a reactive filter for arrays based on query matching with configurable search modes.
  keywords: useFilter, filter, composable, Vue, data filtering
category: Selection
performance: 0
---

# useFilter

The `useFilter` composable creates a reactive filter for arrays based on query matching with configurable search modes. It supports 'some' (any field matches), 'every' (all fields match), 'union' (any query matches), and 'intersection' (all queries match) filtering strategies.

## API

### `useFilter(query, items, options?)`

* **Type**
    
  ```ts
  export function useFilter<Z extends FilterItem> (
    query: FilterQuery,
    items: MaybeRef<Z[]>,
    options: UseFilterOptions = {},
  ): UseFilterResult<Z>
  ```
    
* **Details**
    
  - `query`: The filter query to match against items. Can be a primitive value or an array of primitives.
  - `items`: The collection of items to filter. Can be a `Ref` or a plain array.
  - `options`: Optional configuration for the filter behavior:
      - `customFilter?: FilterFunction`: A custom filter function to override the default behavior.
      - `keys?: string[]`: An array of keys to search within each item (if items are objects).
      - `mode?: FilterMode`: The filtering strategy to use: `'some'`, `'every'`, `'union'`, or `'intersection'`. Defaults to `'some'`.

  Returns an object with a `items` computed property, which is a computed reference to the filtered items based on the query and options.

## Examples

### Basic Usage

```html
<template>
  <div>
    <input v-model="searchQuery" placeholder="Search items..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }} - {{ item.category }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useFilter } from '@vuetify/v0/composables/useFilter'

  const items = ref([
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
    { id: 4, name: 'Broccoli', category: 'Vegetable' },
  ])

  const searchQuery = ref('')

  const { items: filteredItems } = useFilter(searchQuery, items, {
    keys: ['name', 'category'],
    mode: 'some',
  })
</script>
```

### Using different filter modes

```html
<template>
  <div>
    <input v-model="searchQuery" placeholder="Search items (comma-separated for multiple queries)..." />
    <h4>Mode: Some (default)</h4>
    <ul>
      <li v-for="item in filteredItemsSome" :key="item.id">
        {{ item.name }}
      </li>
    </ul>

    <h4>Mode: Intersection</h4>
    <ul>
      <li v-for="item in filteredItemsIntersection" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useFilter } from '@vuetify/v0/composables/useFilter'

  const items = ref([
    { id: 1, name: 'Red Apple', tags: ['fruit', 'red'] },
    { id: 2, name: 'Green Apple', tags: ['fruit', 'green'] },
    { id: 3, name: 'Red Pepper', tags: ['vegetable', 'red'] },
  ])

  const searchQuery = ref('red,fruit')
  const queries = computed(() => searchQuery.value.split(',').map(s => s.trim()))

  const { items: filteredItemsSome } = useFilter(queries, items, {
    keys: ['name', 'tags'],
    mode: 'some',
  })

  const { items: filteredItemsIntersection } = useFilter(queries, items, {
    keys: ['name', 'tags'],
    mode: 'intersection',
  })
</script>
```


