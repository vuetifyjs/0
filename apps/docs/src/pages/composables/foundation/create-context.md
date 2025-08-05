---
meta:
  title: createContext
  description: A foundational utility for creating and consuming context throughout your application, enabling sharing state and methods across components without prop drilling.
  keywords: createContext, context, composable, Vue, state management
category: Factory
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# createContext

The **createContext** factory function is at the heart of all functionality in Vuetify0. It is a small wrapper around the Vue 3 [provide](https://vuejs.org/api/composition-api.html#provide) and [inject](https://vuejs.org/api/composition-api.html#inject) APIs, allowing you to create a context that can be shared across components.

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
  function useContext<Z> (namespace?: ContextKey<Z>): Z
  ```
- **Details**
  A type-safe helper function for injecting a given namespace. Returns an inject function that when invoked will return the context object of type **Z**. If the context is not found, it will throw an error.

## Example

It's easy to create a global context that can be used throughout your application. Here's a simple example of how to create and use a context:

```ts
// src/composables/my-context.ts

import { createContext } from '@vuetify/v0'

interface MyContext {
  collection: Map<string, string>
  find: (id: string) => string | undefined
}

export function useMyContext () {
  const [useContext, provideContext] = createContext<MyContext>('namespace')

  const collection = new Map<string, string>()

  function find (id: string): string | undefined {
    return collection.get(id)
  }

  const context = { collection, find }

  provideContext(context)

  return useContext()
}
```

Now, in your components, access the context by importing the `useMyContext` composable:

```html
<script setup lang="ts">
  import { useMyContext } from '@/composables/my-context'

  const context = useMyContext()

  context.collection.set('1', 'Item 1')

  const item = context.get('1')

  console.log(item) // 'Item 1'
</script>
```

Here is a mermaid diagram illustrating the relationship between `createContext`, `useRegistrar`, and other composables:

<Mermaid code="
graph TD
    A(createApp) --> B(useMyContext)
    B --> C{provideContext}
    C --> D(Component 1)
    C --> E(Component 2)
    C --> F(Component 3)
" />

This diagram shows how `createContext` is used to create a context that can be injected into components, allowing for shared state and methods without the need for prop drilling. The context can be provided at a higher level in the component tree and consumed by any child component that needs access to it.
