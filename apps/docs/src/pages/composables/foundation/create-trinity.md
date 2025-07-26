---
meta:
  title: createTrinity
  description: A factory function for creating a 3 item tuple that contains a context consumer, a provider, and the actual context object, allowing for easy state management and sharing across components.
  keywords: createTrinity, context, composable, Vue, state management
category: Factory
performance: 0
---

# createTrinity

The **createTrinity** factory function is a simple utility for normalizing the joining of [createContext](). It generates a 3-item tuple containing a context consumer, a provider, and the actual context object.

## API

- **Type**
  ```ts
  function createTrinity<Z> (
    useContext: () => Z,
    provideContext: (model?: Ref<unknown | unknown[]>, context: Z, app?: App) => Z,
    context: Z
  ): ContextTrinity<Z>
  ```
- **Details**

  **Z** represents the context interface, which defines the structure of the context object that will be created and consumed. The **useContext** function is a hook to access the context, **provideContext** is used to provide the context to the application, and **context** is the actual context object.

## Usage

The trinity pattern is the marrying of provide and inject with a context object. It provides a clean and type safe way to create a sharable singleton state.

```ts
import { createContext, createTrinity } from '@vuetify/0'
```


## Example

The following is an example of how to create a context for authentication in a Vue application using the `createTrinity` function:

```ts
// state/auth.ts
import { createContext, createTrinity } from '@vuetify/0'
import { ref, toRef } from 'vue'

import type { Ref } from 'vue'

interface LoginCredentials {
  username: string
  password: string
}

interface AuthContext {
  user: Ref<User | null>
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

function createAuth () {
  const [useAuth, provideAuth] = createContext<AuthContext>('auth')

  const user = ref()

  const isAuthenticated = toRef(() => !!user.value)

  function login (credentials: LoginCredentials) {
    user.value = { id: '123', name: 'John Doe' }
  }

  function logout () {
    user.value = null
  }

  return createTrinity<AuthContext>(useAuth, provideAuth, {
    user,
    isAuthenticated,
    login,
    logout
  })
}

export const [useAuth, provideAuth] = createAuth()
```
