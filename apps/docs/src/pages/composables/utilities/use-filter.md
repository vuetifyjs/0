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


<DocsApi />

## Examples

### Basic String Search

Filter an array of objects by a search term:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const users = ref([
  { id: 1, name: 'Alice Smith', role: 'Admin' },
  { id: 2, name: 'Bob Jones', role: 'User' },
  { id: 3, name: 'Charlie Smith', role: 'User' },
])

const searchQuery = ref('smith')
const { items: filteredUsers } = useFilter(searchQuery, users, {
  keys: ['name']
})

console.log(filteredUsers.value)
// [
//   { id: 1, name: 'Alice Smith', role: 'Admin' },
//   { id: 3, name: 'Charlie Smith', role: 'User' }
// ]
```

### Filtering Primitives

Filter an array of primitive values:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const fruits = ref(['apple', 'banana', 'cherry', 'apricot', 'blueberry'])

const query = ref('ap')
const { items: filtered } = useFilter(query, fruits)

console.log(filtered.value)
// ['apple', 'apricot']
```

### Mode: Some (Default)

Match items where ANY field contains the query:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const products = ref([
  { name: 'Laptop', category: 'Electronics', price: 999 },
  { name: 'Phone', category: 'Electronics', price: 599 },
  { name: 'Desk', category: 'Furniture', price: 299 },
])

const query = ref('electronics')
const { items: filtered } = useFilter(query, products, { mode: 'some' })

console.log(filtered.value)
// [
//   { name: 'Laptop', category: 'Electronics', price: 999 },
//   { name: 'Phone', category: 'Electronics', price: 599 }
// ]
```

### Mode: Every

Match items where ALL fields contain the query:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const items = ref([
  { title: 'Vue Guide', tags: 'vue, guide, tutorial' },
  { title: 'React Guide', tags: 'react, guide' },
  { title: 'Vue API', tags: 'vue, api, reference' },
])

const query = ref('vue')
const { items: filtered } = useFilter(query, items, { mode: 'every' })

console.log(filtered.value)
// [
//   { title: 'Vue Guide', tags: 'vue, guide, tutorial' },
//   { title: 'Vue API', tags: 'vue, api, reference' }
// ]
```

### Mode: Union (OR Logic)

Match items where ANY query matches ANY field:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const books = ref([
  { title: 'JavaScript Basics', author: 'John Doe' },
  { title: 'Vue.js Guide', author: 'Jane Smith' },
  { title: 'TypeScript Deep Dive', author: 'John Smith' },
])

// Search for items containing 'vue' OR 'john'
const queries = ref(['vue', 'john'])
const { items: filtered } = useFilter(queries, books, { mode: 'union' })

console.log(filtered.value)
// [
//   { title: 'JavaScript Basics', author: 'John Doe' },
//   { title: 'Vue.js Guide', author: 'Jane Smith' },
//   { title: 'TypeScript Deep Dive', author: 'John Smith' }
// ]
```

### Mode: Intersection (AND Logic)

Match items where ALL queries match at least one field:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const articles = ref([
  { title: 'Vue 3 Composition API', tags: 'vue, composition, api' },
  { title: 'Vue 2 Options API', tags: 'vue, options' },
  { title: 'React Hooks Guide', tags: 'react, hooks, api' },
])

// Search for items containing BOTH 'vue' AND 'api'
const queries = ref(['vue', 'api'])
const { items: filtered } = useFilter(queries, articles, { mode: 'intersection' })

console.log(filtered.value)
// [
//   { title: 'Vue 3 Composition API', tags: 'vue, composition, api' },
//   { title: 'Vue 2 Options API', tags: 'vue, options' }
// ]
```

### Filtering by Specific Keys

Limit the search to specific object properties:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const employees = ref([
  { name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering' },
  { name: 'Bob Smith', email: 'bob@example.com', department: 'Marketing' },
  { name: 'Charlie Johnson', email: 'charlie@example.com', department: 'Sales' },
])

// Search only in the 'name' field
const query = ref('johnson')
const { items: filtered } = useFilter(query, employees, { keys: ['name'] })

console.log(filtered.value)
// [
//   { name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering' },
//   { name: 'Charlie Johnson', email: 'charlie@example.com', department: 'Sales' }
// ]
```

### Custom Filter Function

Implement custom filtering logic for advanced use cases:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const products = ref([
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Phone', price: 599, inStock: false },
  { name: 'Tablet', price: 399, inStock: true },
])

// Custom filter: search by name and filter by price range
const priceRange = ref([300, 700])
const { items: filtered } = useFilter(priceRange, products, {
  customFilter: (query, item) => {
    if (typeof item === 'object' && item !== null) {
      const [min, max] = query as number[]
      return item.price >= min && item.price <= max && item.inStock
    }
    return false
  }
})

console.log(filtered.value)
// [{ name: 'Tablet', price: 399, inStock: true }]
```

### Empty Query Handling

When the query is empty or only whitespace, all items are returned:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

const items = ref(['apple', 'banana', 'cherry'])

const query = ref('')
const { items: filtered } = useFilter(query, items)

console.log(filtered.value)
// ['apple', 'banana', 'cherry']

query.value = '   ' // Only whitespace
console.log(filtered.value)
// ['apple', 'banana', 'cherry']
```

### Real-World Search Example

A practical example of a searchable user list:

```vue UseFilter
<script setup lang="ts">
  import { ref } from 'vue'
  import { useFilter } from '@vuetify/v0'

  interface User {
    id: number
    name: string
    email: string
    department: string
  }

  const users = ref<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering' },
    { id: 2, name: 'Bob Smith', email: 'bob@company.com', department: 'Marketing' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@company.com', department: 'Engineering' },
    { id: 4, name: 'Diana Prince', email: 'diana@company.com', department: 'Sales' },
  ])

  const searchQuery = ref('')
  const searchFields = ref<string[]>(['name', 'email', 'department'])

  const { items: filteredUsers } = useFilter(searchQuery, users, {
    keys: searchFields.value,
    mode: 'some'
  })
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search users..."
    />

    <div v-if="filteredUsers.length === 0">
      No users found matching "{{ searchQuery }}"
    </div>

    <ul v-else>
      <li v-for="user in filteredUsers" :key="user.id">
        <strong>{{ user.name }}</strong> - {{ user.email }} ({{ user.department }})
      </li>
    </ul>
  </div>
</template>
```

## TypeScript Usage

The composable is fully typed and supports generic type parameters:

```ts
import { ref } from 'vue'
import { useFilter } from '@vuetify/v0'

interface Product {
  id: number
  name: string
  category: string
  price: number
}

const products = ref<Product[]>([
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 2, name: 'Desk', category: 'Furniture', price: 299 },
])

const query = ref('laptop')
const { items } = useFilter<Product>(query, products, {
  keys: ['name', 'category']
})

// items is typed as ComputedRef<Product[]>
console.log(items.value[0]?.name) // TypeScript knows this is a string
```

## Dependency Injection

For sharing filter configuration across component trees, use the context-based API.

### createFilter

Creates a filter context with pre-configured options:

```ts
import { createFilter } from '@vuetify/v0'

const filter = createFilter({
  mode: 'intersection',
  keys: ['name', 'email'],
})

// Use the apply method to filter arrays
const { items } = filter.apply(query, users)
```

### createFilterContext

Creates a trinity tuple for Vue's provide/inject system:

```ts
import { createFilterContext } from '@vuetify/v0'

// Create a shared filter context
export const [useSearchFilter, provideSearchFilter, searchFilter] = createFilterContext({
  namespace: 'app:search',
  mode: 'union',
  keys: ['title', 'description'],
})
```

```vue
<!-- Parent component -->
<script setup lang="ts">
  import { provideSearchFilter } from './search-filter'

  // Provide the filter context to descendants
  provideSearchFilter()
</script>
```

```vue
<!-- Child component -->
<script setup lang="ts">
  import { ref } from 'vue'
  import { useSearchFilter } from './search-filter'

  const filter = useSearchFilter()
  const query = ref('')
  const products = ref([...])

  const { items: filtered } = filter.apply(query, products)
</script>
```

### useFilterContext

Retrieves a filter context from dependency injection:

```ts
import { useFilterContext } from '@vuetify/v0'

// Get the filter context provided by an ancestor
const filter = useFilterContext('app:search')
const { items } = filter.apply(query, products)
```

## Notes

- The default filter is **case-insensitive** and uses substring matching (`.includes()`)
- Empty queries (empty string or whitespace-only) return all items unfiltered
- When using arrays of queries, individual empty values are filtered out before processing
- The `customFilter` function receives the full query parameter (single value or array) and must handle it accordingly
- Filtering is reactive: changes to the query or items array automatically update the filtered results

