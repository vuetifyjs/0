---
title: createContext Composable
meta:
- name: description
  content: A foundational utility for creating and consuming context throughout your
    application, enabling sharing state and methods across components without prop
    drilling.
- name: keywords
  content: createContext, context, composable, Vue, state management
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

### `createContext`{ #create-context }

- **Type**

  ```ts
  type ContextKey<Z> = InjectionKey<Z> | string

  function createContext<Z> (
    key: ContextKey<Z>,
    defaultValue?: Z
  ): [
    (namespace?: string) => Z,
    (context: Z, app?: App) => Z,
  ]
  ```

- **Details**

  **Z** represents the context interface, which defines the structure of the context object that will be created and consumed. **namespace** is an optional string that overrides the default provided key. **defaultValue** is an optional default context that will be returned if the context is not provided by an ancestor or called outside of a Vue setup context.

### `useContext`{ #use-context }

- **Type**

  ```ts
  function useContext<Z> (
    key: ContextKey<Z>,
    defaultValue?: Z
  ) => Z
  ```

- **Details**

  A simple wrapper function for injecting context. If a `defaultValue` is provided, it will be returned when the context is not found. Otherwise, it throws an error if the context is not found, ensuring that the consumer is aware of the missing context.

### `provideContext`{ #provide-context }

- **Type**

  ```ts
  function provideContext<Z> (
    key: ContextKey<Z>,
    context: Z,
    app?: App
  ) => Z
  ```

- **Details**

  A simple wrapper function for providing context. It uses Vue's `provide` API to make the context available to descendant components. If an `app` instance is provided, it will register the context at the application level, making it available globally.
