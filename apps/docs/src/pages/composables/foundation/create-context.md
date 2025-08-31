---
meta:
  title: createContext
  description: A foundational utility for creating and consuming context throughout your application, enabling sharing state and methods across components without prop drilling.
  keywords: createContext, context, composable, Vue, state management
features:
  category: Factory
  label: 'E: createContext'
  github: /factories/createContext/
---

# createContext

The `createContext` factory function is at the heart of all functionality in Vuetify0. It is a small wrapper around the Vue 3 [provide](https://vuejs.org/api/composition-api.html#provide) and [inject](https://vuejs.org/api/composition-api.html#inject) APIs, allowing you to create a context that can be shared across components.

<DocsPageFeatures :frontmatter />

## Usage

```ts
import { shallowRef } from 'vue'
import { createContext } from '@vuetify/v0'
import type { ShallowRef } from 'vue'

interface MyContext {
  isDisabled: ShallowRef<boolean>
}

const [useContext, provideContext] = createContext<MyContext>('namespace')

provideContext({ isDisabled: shallowRef(false) })

export { useContext }
```

## API

### `createContext`

- **Type**

  ```ts
  type ContextKey<Z> = InjectionKey<Z> | string

  function createContext<Z> (namespace: ContextKey<Z>): [
    () => Z,
    (context: Z, app?: App) => Z,
  ]
  ```

- **Details**

  **Z** represents the context interface, which defines the structure of the context object that will be created and consumed. **namespace** is a string that scopes the context, allowing multiple contexts to coexist without conflict.

### `useContext`

- **Type**

  ```ts
  function useContext<Z> (key: ContextKey<Z>): (namespace?: string) => Z
  ```

- **Details**

  A type-safe helper creator: pass a key once and it returns a zero‑arg (optionally override namespace) function that injects and returns the context object of type **Z**. If the context is not found it throws: `Error('Context "<key>" not found. Ensure it\'s provided by an ancestor.')`.

## Example

It's easy to create a global context that can be used throughout your application. Here's a simple example of how to create and use a context:

```ts
// src/composables/my-context.ts

import { createContext } from '@vuetify/v0'

interface MyContext {
  collection: Map<string, string>
  get: (id: string) => string | undefined
}

const [useContext, provideContext] = createContext<MyContext>('namespace')

export function createMyContext () {
  const collection = new Map<string, string>([
    ['1', 'Item 1'],
    ['2', 'Item 2']
  ])

  function get (id: string): string | undefined {
    return collection.get(id)
  }

  provideContext({ collection, get })
}

export { useContext }
```

```vue
<!-- src/App.vue -->
<script setup lang="ts">
  import { createMyContext } from '@/composables/my-context'

  createMyContext()
</script>
```

Now, in your components, access the context by importing the exported `useContext` composable:

```vue
<script setup lang="ts">
  import { useContext } from '@/composables/my-context'

  const context = useContext()

  const item = context.get('1')

  console.log(item) // 'Item 1'
</script>
```

The following is a mermaid diagram that visualizes the flow of creating and using a context in a Vue application:

<Mermaid code="
graph TD
  A(createApp) --> B(createMyContext)
  B --> C{provideContext}
  C --> D(Component 1: useContext)
  C --> E(Component 2: useContext)
  C --> F(Component 3: useContext)
" />
