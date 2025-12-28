---
title: createTrinity - Context Provider/Consumer Pattern for Vue 3
meta:
- name: description
  content: Factory for the trinity pattern. Creates a 3-tuple with context consumer, provider, and default instance for type-safe sharable singleton state in Vue apps.
- name: keywords
  content: createTrinity, context, trinity pattern, provide inject, singleton, composable, Vue 3
features:
  category: Factory
  label: 'E: createTrinity'
  github: /composables/createTrinity/
related:
  - /composables/foundation/create-context
  - /composables/foundation/create-plugin
  - /guide/framework-core
---

# createTrinity

The **createTrinity** factory function is a type-safe utility for generating a 3-item tuple—called a **trinity**—which contains a context consumer, a provider, and the underlying context object.

<DocsPageFeatures :frontmatter />

## Usage

The trinity pattern is the marrying of provide and inject with a context object. It provides a clean and type safe way to create a sharable singleton state.

```ts
import { createContext, createTrinity } from '@vuetify/v0'
import { ref } from 'vue'

interface User {
  id: string
  name: string
}

interface UserContext {
  user: Ref<User>
  updateUser: (user: User) => void
}

function createUserContext() {
  const [useContext, provideContext] = createContext<UserContext>('user')

  const user = ref<User>({ id: '123', name: 'John Doe' })

  function updateUser(newUser: User) {
    user.value = newUser
  }

  const context: UserContext = {
    user,
    updateUser
  }

  return createTrinity<UserContext>(useContext, provideContext, context)
}

export const [useUser, provideUser, defaultUserContext] = createUserContext()
```

## API

### `createTrinity`{ #create-trinity }

- **Type**
  ```ts
  type ContextTrinity<Z = unknown> = readonly [
    () => Z,
    (context: Z, app?: App) => Z,
    Z,
  ]

  function createTrinity<Z>(
    useContext: () => Z,
    provideContext: (context: Z, app?: App) => Z,
    context: Z
  ): ContextTrinity<Z>
  ```

- **Details**

  Creates a readonly 3-item tuple (trinity) containing:
  1. A context consumer function (useContext)
  2. A context provider function (provideContext)
  3. The default context instance

  This pattern provides a clean and type-safe way to create sharable singleton state across components.

- **Parameters**

  - `useContext`: Function to access/consume the context
  - `provideContext`: Function to provide the context to the application or component tree
  - `context`: The actual context object instance

- **Returns**

  A readonly tuple `[useContext, provideContext, context]`

- **Example**
  ```ts
  const [_useAuth, _provideAuth] = createContext<AuthContext>('auth')

  const context: AuthContext = {
    user: ref(null),
    login: async (credentials) => { /* ... */ },
    logout: () => { /* ... */ }
  }

  export const [useAuth, provideAuth, context] = createTrinity<AuthContext>(
    _useAuth,
    _provideAuth,
    context
  )
  ```

