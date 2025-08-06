---
meta:
  title: useStorage
  description: Creates a reactive storage system with automatic persistence and cross-adapter support.
  keywords: useStorage, storage, persistence, reactive, composable, Vue
category: Plugin
performance: 0
---

# useStorage

The `useStorage` composable creates a reactive storage system with automatic persistence and cross-adapter support. This function provides a consistent interface for storing and retrieving reactive values that automatically sync with the underlying storage adapter (e.g., `localStorage`, `sessionStorage`, or an in-memory adapter).

## API

### `StorageContext`

```ts
export interface StorageContext {
  get: <T>(key: string, defaultValue?: T) => Ref<T>
  set: <T>(key: string, value: T) => void
  remove: (key: string) => void
  clear: () => void
}
```

Defines the interface for the storage context:
- `get<T>(key: string, defaultValue?: T)`: Retrieves a reactive `Ref` for the given `key`. If the key does not exist in storage, `defaultValue` is used. Changes to the `Ref` are automatically persisted.
- `set<T>(key: string, value: T)`: Sets the value for the given `key` in storage. This will update the corresponding reactive `Ref`.
- `remove(key: string)`: Removes the item with the given `key` from storage.
- `clear()`: Clears all items from the storage.

### `useStorage()`

* **Type**
    
  ```ts
  function useStorage (): StorageContext
  ```
    
* **Details**
    
  A simple hook to access the storage context provided by `createStoragePlugin`.

### `createStorage(options?)`

* **Type**
    
  ```ts
  export interface StorageOptions {
    adapter?: StorageAdapter
    prefix?: string
    serializer?: {
      read: (value: string) => any
      write: (value: any) => string
    }
  }

  export function createStorage<E extends StorageContext> (options?: StorageOptions): E
  ```
    
* **Details**
    
  Creates a reactive storage system. 
  - `adapter`: An optional `StorageAdapter` instance (defaults to `window.localStorage` in browser, or an in-memory adapter otherwise).
  - `prefix`: An optional string prefix to prepend to all storage keys (defaults to `v0:`).
  - `serializer`: An optional object with `read` and `write` functions for custom serialization/deserialization (defaults to `JSON.parse` and `JSON.stringify`).

  Returns a `StorageContext` object.

### `createStoragePlugin(options?)`

* **Type**
    
  ```ts
  export interface StoragePlugin {
    install: (app: App, ...options: any[]) => any
  }

  export function createStoragePlugin (options?: StorageOptions): StoragePlugin
  ```
    
* **Details**
    
  Creates a Vue plugin for reactive storage capabilities with automatic persistence. This plugin provides app-wide access to reactive storage that syncs with the configured adapter. The `options` parameter is the same as for `createStorage`.

## Examples

### Using `useStorage` in a Component

```html
<template>
  <div>
    <p>User Name: {{ userName }}</p>
    <input v-model="userName" placeholder="Enter your name" />
    <button @click="clearName">Clear Name</button>

    <p>Settings: {{ userSettings }}</p>
    <input v-model="userSettings.theme" placeholder="Theme" />
    <input v-model="userSettings.notifications" type="checkbox" /> Notifications
  </div>
</template>

<script setup lang="ts">
  import { useStorage } from "@vuetify/v0/composables/useStorage";

  // Reactive ref synchronized with localStorage key 'v0:userName'
  const userName = useStorage<string>("userName", "Guest");

  // Reactive ref for an object, automatically serialized/deserialized
  const userSettings = useStorage("userSettings", {
    theme: "dark",
    notifications: true,
  });

  const clearName = () => {
    userName.value = "";
  };
</script>
```

### Using `createStoragePlugin` to Configure Global Storage

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createStoragePlugin } from "@vuetify/v0/composables/useStorage";

const app = createApp(App);

app.use(
  createStoragePlugin({
    prefix: "my-app:", // Custom prefix for all keys
    // adapter: sessionStorage, // Use sessionStorage instead of localStorage
  })
);

app.mount("#app");
```


