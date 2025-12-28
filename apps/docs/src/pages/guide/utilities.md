---
title: Utilities Guide - Helper Functions for Vue 3
meta:
  - name: description
    content: Discover Vuetify0's utility functions for common development tasks. Type guards, transformers, and helpers that enhance code reusability in Vue 3 applications.
  - name: keywords
    content: vuetify0, utilities, helpers, type guards, transformers, toArray, toReactive, Vue 3
related:
  - /composables/utilities/use-filter
  - /composables/utilities/use-pagination
  - /composables/utilities/use-virtual
  - /composables/utilities/use-overflow
---

# Utilities

Standalone helpers for common UI patterns. These composables don't depend on context or plugins—use them anywhere.

<DocsPageFeatures :frontmatter />

## Overview

| Utility | Purpose |
| - | - |
| [useFilter](/composables/utilities/use-filter) | Filter arrays with search queries |
| [usePagination](/composables/utilities/use-pagination) | Page navigation state |
| [useVirtual](/composables/utilities/use-virtual) | Virtual scrolling for large lists |
| [useOverflow](/composables/utilities/use-overflow) | Compute visible item capacity |

## createFilter

Filter arrays based on search queries:

```ts
import { createFilter } from '@vuetify/v0'

const items = ref(['Apple', 'Banana', 'Cherry'])
const query = ref('')

const filter = createFilter()
const { items: filtered } = filter.apply(query, items)

query.value = 'an'
filtered.value  // ['Banana']
```

### With Object Keys

```ts
const users = ref([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
])

const filter = createFilter({
  keys: ['name', 'email']
})

const query = ref('alice')
const { items: filtered } = filter.apply(query, users)
filtered.value  // [{ name: 'Alice', ... }]
```

### Filter Modes

```ts
const filter = createFilter({
  mode: 'intersection',  // 'some' | 'every' | 'union' | 'intersection'
  keys: ['name', 'tags']
})
```

## createPagination

Pagination state management:

```ts
import { createPagination } from '@vuetify/v0'

const pagination = createPagination({
  size: 100,
  itemsPerPage: 10
})

pagination.page.value     // 1
pagination.pages          // 10
pagination.isFirst.value  // true
pagination.isLast.value   // false

pagination.next()         // Go to page 2
pagination.prev()         // Go to page 1
pagination.select(5)      // Go to page 5
pagination.first()        // Go to page 1
pagination.last()         // Go to page 10
```

### With Reactive Size

```ts
const items = ref([...])

const pagination = createPagination({
  size: () => items.value.length,
  itemsPerPage: 20
})
```

### Page Items

```ts
pagination.items.value  // [{ type: 'page', value: 1 }, { type: 'page', value: 2 }, ...]
```

## useVirtual

Virtual scrolling for large datasets:

```ts
import { useVirtual } from '@vuetify/v0'

const items = ref(Array.from({ length: 10000 }, (_, i) => `Item ${i}`))

// useVirtual takes items as first arg, options as second
const virtual = useVirtual(items, {
  itemHeight: 40
})
```

```vue playground
<template>
  <div ref="virtual.element" style="height: 400px; overflow: auto;">
    <div :style="{ height: `${virtual.size}px`, paddingTop: `${virtual.offset}px` }">
      <div
        v-for="item in virtual.items"
        :key="item.index"
        style="height: 40px"
      >
        {{ item.raw }}
      </div>
    </div>
  </div>
</template>
```

### Variable Height

```ts
const virtual = useVirtual(items, {
  height: 400  // Container height (or use element ref)
})
```

## useOverflow

Compute how many items fit in a container:

```ts
import { useOverflow } from '@vuetify/v0'

const container = ref<HTMLElement>()

const overflow = useOverflow({
  container,
  itemWidth: 100,
  gap: 8
})

overflow.capacity.value     // Number of items that fit
overflow.isOverflowing.value // Boolean: items exceed capacity
```

### Use Case: Responsive Chips

```vue playground
<template>
  <div ref="container" class="flex gap-2">
    <span v-for="tag in visibleTags" :key="tag" class="chip">
      {{ tag }}
    </span>
    <span v-if="overflow.isOverflowing" class="chip">
      +{{ tags.length - overflow.capacity }}
    </span>
  </div>
</template>

<script setup>
const tags = ['Vue', 'React', 'Angular', 'Svelte', 'Solid']
const visibleTags = computed(() => tags.slice(0, overflow.capacity.value))
</script>
```

## Transformers

Value transformation utilities:

### toArray

Normalize any value to an array:

```ts
import { toArray } from '@vuetify/v0'

toArray('single')      // ['single']
toArray(['array'])     // ['array']
toArray(null)          // []
toArray(undefined)     // []
```

### toReactive

Convert MaybeRef objects to reactive proxies:

```ts
import { toReactive } from '@vuetify/v0'

const props = defineProps<{ config?: { debug: boolean } }>()

// Works whether config is reactive or plain object
const config = toReactive(() => props.config ?? { debug: false })

config.debug  // Reactive access
```

## Best Practices

### Combine Utilities

```ts
// Filter + Paginate
const query = ref('')
const filter = createFilter()
const { items: filtered } = filter.apply(query, items)

const pagination = createPagination({
  size: () => filtered.value.length,
  itemsPerPage: 10
})

const displayedItems = computed(() => {
  const start = pagination.pageStart.value
  const end = pagination.pageStop.value
  return filtered.value.slice(start, end)
})
```

### Virtual + Filter

```ts
const query = ref('')
const filter = createFilter()
const { items: filtered } = filter.apply(query, items)

const virtual = useVirtual(filtered, {
  itemHeight: 40
})
```

