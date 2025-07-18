# useFilter

The `useFilter` composable provides a powerful way to filter arrays of items based on search queries. It supports both primitive values and complex objects with customizable filtering logic, making it ideal for creating searchable lists, tables, and data grids.

## Usage

```ts
import { useFilter } from 'v0'

const items = ref(['apple', 'banana', 'cherry'])
const query = ref('ban')

const { items: filteredItems } = useFilter(query, items)

console.log(filteredItems.value) // ['banana']
```

## API Reference

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `FilterQuery` | Search query (string, number, boolean, or array) |
| `items` | `MaybeRef<T[]>` | Array of items to filter |
| `options` | `UseFilterOptions` | Configuration options |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customFilter` | `FilterFunction` | `undefined` | Custom filtering function |
| `keys` | `string[]` | `undefined` | Object keys to search in |
| `mode` | `MaybeRef<FilterMode>` | `'some'` | How to match multiple queries |

### Filter Modes

| Mode | Description |
|------|-------------|
| `'some'` | Match if any field contains the query |
| `'every'` | Match if all fields contain the query |
| `'union'` | Match if any query matches any field |
| `'intersection'` | Match if all queries match at least one field |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `items` | `ComputedRef<T[]>` | Filtered array of items |

## Examples

### Basic String Filtering

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useFilter } from 'v0'

const searchQuery = ref('')
const fruits = ref([
  'apple',
  'banana',
  'cherry',
  'date',
  'elderberry',
  'fig',
  'grape'
])

const { items: filteredFruits } = useFilter(searchQuery, fruits)
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      placeholder="Search fruits..."
      class="search-input"
    />

    <ul>
      <li v-for="fruit in filteredFruits" :key="fruit">
        {{ fruit }}
      </li>
    </ul>
  </div>
</template>
```

### Object Filtering

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useFilter } from 'v0'

interface User {
  id: number
  name: string
  email: string
  department: string
}

const searchQuery = ref('')
const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Engineering' },
])

// Filter by specific keys
const { items: filteredUsers } = useFilter(searchQuery, users, {
  keys: ['name', 'email']
})
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      placeholder="Search users by name or email..."
      class="search-input"
    />

    <div class="user-list">
      <div v-for="user in filteredUsers" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <span class="department">{{ user.department }}</span>
      </div>
    </div>
  </div>
</template>
```

### Custom Filter Function

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useFilter } from 'v0'

interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

const searchQuery = ref('')
const products = ref<Product[]>([
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true },
  { id: 2, name: 'Phone', price: 699, category: 'Electronics', inStock: false },
  { id: 3, name: 'Book', price: 29, category: 'Education', inStock: true },
])

// Custom filter that includes price range and stock status
const customFilter = (query: any, item: Product) => {
  const searchTerm = String(query).toLowerCase()

  // Search in name and category
  const textMatch = item.name.toLowerCase().includes(searchTerm) ||
                   item.category.toLowerCase().includes(searchTerm)

  // Special handling for price queries
  if (searchTerm.includes('$') || searchTerm.includes('price')) {
    const priceQuery = searchTerm.replace(/[^\d]/g, '')
    if (priceQuery) {
      return item.price <= parseInt(priceQuery)
    }
  }

  // Special handling for stock queries
  if (searchTerm.includes('in stock') || searchTerm.includes('available')) {
    return item.inStock
  }

  return textMatch
}

const { items: filteredProducts } = useFilter(searchQuery, products, {
  customFilter
})
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      placeholder="Search products (try 'in stock' or 'price 500')..."
      class="search-input"
    />

    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>${{ product.price }}</p>
        <span :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
          {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
        </span>
      </div>
    </div>
  </div>
</template>
```

### Multiple Query Modes

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useFilter } from 'v0'

const searchQuery = ref(['javascript', 'vue'])
const filterMode = ref<'some' | 'every' | 'union' | 'intersection'>('union')

const articles = ref([
  { title: 'Vue.js Fundamentals', tags: ['vue', 'javascript', 'frontend'] },
  { title: 'React Basics', tags: ['react', 'javascript', 'frontend'] },
  { title: 'Node.js Backend', tags: ['nodejs', 'javascript', 'backend'] },
  { title: 'Vue 3 Composition API', tags: ['vue', 'vue3', 'javascript'] },
])

const { items: filteredArticles } = useFilter(searchQuery, articles, {
  keys: ['title', 'tags'],
  mode: filterMode
})
</script>

<template>
  <div>
    <div class="controls">
      <label>
        Filter Mode:
        <select v-model="filterMode">
          <option value="some">Some</option>
          <option value="every">Every</option>
          <option value="union">Union</option>
          <option value="intersection">Intersection</option>
        </select>
      </label>
    </div>

    <div class="articles">
      <article v-for="article in filteredArticles" :key="article.title">
        <h3>{{ article.title }}</h3>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>
```

### Reactive Search with Debouncing

```vue
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useFilter } from 'v0'

const searchQuery = ref('')
const debouncedQuery = ref('')

// Debounce search query
let timeout: NodeJS.Timeout
watch(searchQuery, (newQuery) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    debouncedQuery.value = newQuery
  }, 300)
})

const items = ref([
  'apple', 'banana', 'cherry', 'date', 'elderberry',
  'fig', 'grape', 'honeydew', 'kiwi', 'lemon'
])

const { items: filteredItems } = useFilter(debouncedQuery, items)
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      placeholder="Search with debouncing..."
      class="search-input"
    />

    <p v-if="searchQuery !== debouncedQuery" class="loading">
      Searching...
    </p>

    <ul>
      <li v-for="item in filteredItems" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
```

## TypeScript Support

The composable is fully typed with TypeScript:

```ts
export type Primitive = string | number | boolean
export type FilterQuery = MaybeRefOrGetter<Primitive | Primitive[]>
export type FilterItem = Primitive | Record<string, any>
export type FilterMode = 'some' | 'every' | 'union' | 'intersection'
export type FilterFunction = (query: Primitive | Primitive[], item: FilterItem) => boolean

export interface UseFilterOptions {
  customFilter?: FilterFunction
  keys?: string[]
  mode?: MaybeRef<FilterMode>
}

export interface UseFilterResult<T extends FilterItem = FilterItem> {
  items: ComputedRef<T[]>
}
```
