---
title: useStorage Composable
meta:
- name: description
  content: A composable for reactive storage management with support for localStorage,
    sessionStorage, and custom adapters. Provides automatic serialization, caching,
    and SSR-safe operations.
- name: keywords
  content: useStorage, localStorage, sessionStorage, storage adapter, reactive storage,
    composable
features:
  category: Plugin
  label: 'E: useStorage'
  github: /composables/useStorage/
---

# useStorage

The `useStorage` composable provides reactive storage management with support for multiple storage backends (localStorage, sessionStorage, memory). Built with an adapter pattern for flexibility, it automatically serializes values, manages reactive refs, and provides SSR-safe operations.

<DocsPageFeatures :frontmatter />

## Installation

First, install the storage plugin in your application:

```ts
import { createApp } from 'vue'
import { createStoragePlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

// Use default settings (localStorage in browser, memory in SSR)
app.use(createStoragePlugin())

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useStorage` composable in any component:

```vue
<script setup lang="ts">
import { useStorage } from '@vuetify/v0'

const storage = useStorage()

// Get a reactive ref for a storage key
const username = storage.get('username', 'Guest')

// Update the value (automatically persists to storage)
function updateUsername(name: string) {
  username.value = name
}
</script>

<template>
  <div>
    <h1>Welcome, {{ username }}!</h1>
    <input v-model="username" placeholder="Enter your name" />
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
| [useHydration](/composables/plugins/use-hydration) | SSR hydration helpers |
### Plugin Options

- **Type**

  ```ts
  interface StorageOptions {
    adapter?: StorageAdapter
    prefix?: string
    serializer?: {
      read: (value: string) => any
      write: (value: any) => string
    }
  }

  interface StorageAdapter {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
    removeItem: (key: string) => void
    readonly length?: number
    key?: (index: number) => string | null
  }
  ```

- **Details**

  - `adapter`: Storage backend adapter (default: `localStorage` in browser, `MemoryAdapter` in SSR)
  - `prefix`: Prefix for all storage keys (default: `'v0:'`)
  - `serializer`: Custom serialization functions (default: `JSON.parse`/`JSON.stringify`)

### Storage Context

The `useStorage()` composable returns a context with the following properties and methods:

```ts
interface StorageContext {
  has: (key: string) => boolean
  get: <T>(key: string, defaultValue?: T) => Ref<T>
  set: <T>(key: string, value: T) => void
  remove: (key: string) => void
  clear: () => void
}
```

- `has(key)`: Check if a key exists in the cache
- `get(key, defaultValue)`: Get a reactive ref for a storage key
- `set(key, value)`: Set a value for a storage key
- `remove(key)`: Remove a key from storage and stop its watcher
- `clear()`: Clear all keys from storage and stop all watchers
