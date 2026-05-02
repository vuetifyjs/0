---
title: useStorage - Reactive Browser Storage for Vue 3
meta:
- name: description
  content: Reactive storage composable with localStorage, sessionStorage, and custom adapters. Automatic serialization, caching, and SSR-safe operations for Vue 3.
- name: keywords
  content: useStorage, localStorage, sessionStorage, storage adapter, reactive storage, composable, Vue 3, SSR, TTL, cache expiration
features:
  category: Plugin
  label: 'E: useStorage'
  github: /composables/useStorage/
  level: 2
related:
  - /composables/plugins/use-hydration
  - /guide/fundamentals/plugins
---

# useStorage

Reactive storage with automatic serialization, caching, and SSR-safe operations.

<DocsPageFeatures :frontmatter />

## Installation

Install the Storage plugin in your app's entry point:

```ts main.ts
import { createApp } from 'vue'
import { createStoragePlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createStoragePlugin())

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useStorage` composable in any component:

```vue collapse no-filename UseStorage
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

## Standalone Usage

Use `createStorage` directly without the plugin system for standalone or module-level caching:

```ts collapse no-filename createStorage
import { createStorage } from '@vuetify/v0'

const storage = createStorage({ prefix: 'myapp:' })

storage.set('theme', 'dark')

const theme = storage.get('theme', 'light')

console.log(theme.value) // 'dark'
```

### TTL (Time-to-Live)

Set a `ttl` option (in milliseconds) to automatically expire cached entries. Expired entries return the default value on `get()` and are removed from storage.

```ts collapse no-filename TTL
import { createStorage } from '@vuetify/v0'

// Cache expires after 5 minutes
const cache = createStorage({
  prefix: 'api-cache:',
  ttl: 5 * 60 * 1000,
})

// Store fetched data — automatically timestamped
cache.set('users', await fetchUsers())

// Later reads return the default if expired
const users = cache.get('users', [])
```

> [!TIP] How TTL works
> When `ttl` is set, values are internally wrapped as `{ __ttl, __v, __t }` with a timestamp. On `get()`, if the entry is older than the TTL, it is treated as absent and removed from storage. Non-TTL entries stored previously are read normally.

## Adapters

Adapters let you swap the underlying storage backend without changing your application code.

| Adapter | Import | Description |
|---------|--------|-------------|
| `localStorage` | — | Browser localStorage (default in browser) |
| `sessionStorage` | — | Browser sessionStorage |
| `MemoryAdapter` | `@vuetify/v0/storage/adapters/memory` | In-memory storage (default in SSR) |

## Architecture

`useStorage` uses the plugin pattern with storage adapters:

```mermaid "Storage Plugin"
flowchart LR
  createStoragePlugin --> createContext
  createContext --> StorageContext
  StorageContext --> Adapter[LocalStorageAdapter/SessionStorageAdapter/MemoryAdapter]
  Adapter --> storage[browser storage/memory]
```

## Reactivity

The `get()` method returns reactive refs that sync with storage automatically.

| Property | Reactive | Notes |
| - | :-: | - |
| `get()` return value | <AppSuccessIcon /> | Returns `Ref<T>` synced with storage |
| `has()` | <AppErrorIcon /> | Returns `boolean` — checks if key exists (TTL-aware) |

> [!TIP] Auto-persistence
> Refs returned by `get()` are watched with `{ deep: true }`. Any changes to the ref value automatically persist to storage.

> [!TIP] Empty strings are preserved
> `get()` uses nullish coalescing (`??`) internally, so an empty string `''` is a valid stored value — it is never treated as absent or replaced by the default. Only `null` and `undefined` trigger the default.

## Examples

::: example
/composables/use-storage/persistent-settings

### Persistent Settings

A settings panel that survives page refreshes using `useStorage` with a memory adapter, showing reactive `get()` refs with deep-watch auto-persistence.

:::

<DocsApi />
