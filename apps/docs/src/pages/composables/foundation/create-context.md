---
meta:
  title: createContext
  description: A foundational utility for creating and consuming context throughout your application, enabling sharing state and methods across components without prop drilling.
  keywords: createContext, context, composable, Vue, state management
category: Factory
performance: 0
---

# createContext

The **createContext** factory function is at the heart of all functionality in Vuetify0. It is a small wrapper around the Vue 3 [provide](https://vuejs.org/api/composition-api.html#provide) and [inject](https://vuejs.org/api/composition-api.html#inject) APIs, allowing you to create a context that can be shared across components.

## API

- **Type**
  ```ts
  function createContext<Z> (namespace: string): [
    () => Z,
    (context: Z, app?: App) => Z,
  ]
  ```
- **Details**

  **Z** represents the context interface, which defines the structure of the context object that will be created and consumed. **namespace** is a string that scopes the context, allowing multiple contexts to coexist without conflict.

## Usage

```ts
import { createContext } from '@vuetify/0'

interface ContextType {}

const [useContext, provideContext] = createContext<ContextType>('namespace')
```
