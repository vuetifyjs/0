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

## useFilter

Filter arrays based on search queries:

```ts
import { useFilter } from '@vuetify/v0'

const items = ref(['Apple', 'Banana', 'Cherry'])
const filter = useFilter(items)

filter.query.value = 'an'
filter.filtered.value  // ['Banana']
```

### With Custom Accessor

```ts
const users = ref([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
])

const filter = useFilter(users, {
  accessor: (user) => `${user.name} ${user.email}`
})

filter.query.value = 'alice'
filter.filtered.value  // [{ name: 'Alice', ... }]
```

### With Debounce

```ts
const filter = useFilter(items, {
  debounce: 300  // Wait 300ms after typing stops
})
```

## usePagination

Pagination state management:

```ts
import { usePagination } from '@vuetify/v0'

const pagination = usePagination({
  total: 100,
  perPage: 10
})

pagination.current.value  // 1
pagination.totalPages     // 10
pagination.hasNext        // true
pagination.hasPrev        // false

pagination.next()         // Go to page 2
pagination.prev()         // Go to page 1
pagination.select(5)      // Go to page 5
pagination.first()        // Go to page 1
pagination.last()         // Go to page 10
```

### With Reactive Total

```ts
const items = ref([...])

const pagination = usePagination({
  total: computed(() => items.value.length),
  perPage: 20
})
```

### Page Range

```ts
pagination.range  // [1, 2, 3, 4, 5] for current page context
```

## useVirtual

Virtual scrolling for large datasets:

```ts
import { useVirtual } from '@vuetify/v0'

const container = ref<HTMLElement>()
const items = ref(Array.from({ length: 10000 }, (_, i) => `Item ${i}`))

const virtual = useVirtual({
  container,
  items,
  itemHeight: 40
})
```

```vue
<template>
  <div ref="container" style="height: 400px; overflow: auto;">
    <div :style="{ height: `${virtual.totalHeight}px`, position: 'relative' }">
      <div
        v-for="item in virtual.visibleItems"
        :key="item.index"
        :style="{ position: 'absolute', top: `${item.offset}px`, height: '40px' }"
      >
        {{ item.data }}
      </div>
    </div>
  </div>
</template>
```

### Variable Height

```ts
const virtual = useVirtual({
  container,
  items,
  estimateHeight: 40,  // Initial estimate
  getItemHeight: (item, index) => item.type === 'header' ? 60 : 40
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

overflow.capacity.value  // Number of items that fit
overflow.overflow.value  // Number of items that don't fit
```

### Use Case: Responsive Chips

```vue
<template>
  <div ref="container" class="flex gap-2">
    <span v-for="tag in visibleTags" :key="tag" class="chip">
      {{ tag }}
    </span>
    <span v-if="overflow.overflow > 0" class="chip">
      +{{ overflow.overflow }}
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
const filter = useFilter(items)
const pagination = usePagination({
  total: computed(() => filter.filtered.value.length),
  perPage: 10
})

const displayedItems = computed(() => {
  const start = (pagination.current.value - 1) * 10
  return filter.filtered.value.slice(start, start + 10)
})
```

### Virtual + Filter

```ts
const filter = useFilter(items)
const virtual = useVirtual({
  container,
  items: filter.filtered,
  itemHeight: 40
})
```

