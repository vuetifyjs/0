---
title: useStorage
---

# useStorage

The `useStorage` composable provides a reactive interface to the browser's storage APIs (`localStorage` and `sessionStorage`) with a fallback to in-memory storage. It allows you to easily synchronize data between your components and the browser's storage.

## Usage

To use the `useStorage` composable, you first need to install the storage plugin in your Vue application:

```typescript
// main.ts
import { createApp } from 'vue'
import { createStoragePlugin } from '#v0/composables/useStorage'

const app = createApp(App)
app.use(createStoragePlugin())
```

Once the plugin is installed, you can use the `useStorage` composable in your components:

```vue
<script setup lang="ts">
import { useStorage } from '#v0/composables/useStorage'
import { ref } from 'vue'

const storage = useStorage()

const username = storage.get('username', 'Guest')
</script>

<template>
  <div>
    <p>Welcome, {{ username }}</p>
    <input v-model="username" />
  </div>
</template>
```

## API

### `createStoragePlugin(options)`

Creates a new storage plugin instance.

- `options` (optional): An object with the following properties:
  - `adapter`: The storage adapter to use. Defaults to `localStorage` in the browser and `memoryAdapter` on the server.
  - `prefix`: A string to prefix all storage keys with. Defaults to `v0:`.
  - `serializer`: An object with `read` and `write` methods for serializing and deserializing stored values. Defaults to `JSON.parse` and `JSON.stringify`.

### `useStorage()`

Returns the storage context.

- **Returns**: `StorageContext`

### `StorageContext`

An object with the following methods:

- `get<T>(key, defaultValue)`: Returns a reactive `Ref<T>` for the given key. If the key does not exist, it is initialized with `defaultValue`.
- `set<T>(key, value)`: Sets the value for the given key.
- `remove(key)`: Removes the given key from storage.
- `clear()`: Clears all keys from storage that are managed by the plugin.

## Adapters

The `useStorage` composable comes with a `MemoryAdapter` that can be used in environments where `localStorage` or `sessionStorage` are not available. You can also create your own custom adapters by implementing the `StorageAdapter` interface.

### `StorageAdapter`

An interface with the following methods:

- `getItem(key)`: Returns the value for the given key.
- `setItem(key, value)`: Sets the value for the given key.
- `removeItem(key)`: Removes the given key from storage.
- `length` (optional): The number of items in storage.
- `key(index)` (optional): The key at the given index.
