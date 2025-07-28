---
meta:
  title: createTrinity
  description: A factory function for creating a 3 item tuple that contains a context consumer, a provider, and the actual context object, allowing for easy state management and sharing across components.
  keywords: createTrinity, context, composable, Vue, state management
category: Factory
performance: 0
---

# createTrinity

The **createTrinity** factory function is a type-safe utility for generating a 3-item tuple —called a **trinity**—which contains a context consumer, a provider, and the underlying context object.

## API

- **Type**
  ```ts
  type ContextTrinity<
   Z = unknown,
   E = unknown,
  > = readonly [
    () => Z,
    (model?: Ref<E>, context?: Z, app?: App) => Z,
    Z,
  ]

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

interface User {
  id: string
  name: string
}

interface UserContext {
  user: User
}

export function useUserContext () {
  const [useContext, provideContext] = createContext<UserContext>('user')

  const user = ref<User>({ id: '123', name: 'John Doe' })

  return createTrinity<UserContext>(useContext, provideContext, user)
}
```

This pattern also supports the use of a `Ref` model that can be used to manage reactive state. The `model` parameter in the `provideContext` function allows you to pass a `Ref` that will be updated whenever the context changes.

```ts
// src/composables/user-context.ts
import { createContext, createTrinity } from '@vuetify/0'

interface User {
  id: string
  name: string
}

interface UserContext {
  user: User
}

function useUserContext () {
  const [useContext, _provideContext] = createContext<UserContext>('user')

  const user = ref<User>({ id: '123', name: 'John Doe' })

  function provideContext (model?: Ref<User>, _context?: UserContext, app?: App): UserContext {
    if (model) {
      watch(model, value => {
        user.value = value
      })
    }

    return _provideContext(user, _context, app)
  }

  const context: UserContext = {  user }

  return createTrinity<UserContext>(useContext, provideContext, user)
}

export const [useUserContext, provideUserContext] = useUserContext()
```

Now, the `useUserContext` composable can respond to changes in the `user` model, allowing for reactive updates across components that consume this context.


```html
<!-- src/App.vue -->
<script lang="ts" setup>
  import { provideUserContext } from '@/composables/user-context'

  const user = ref<Partial<User>>({})

  provideUserContext(user)
</script>
```

And in subsequent components, you can use the `useUserContext` composable to access the user context:

```html
<!-- src/components/UserProfile.vue -->
<script lang="ts" setup>
  import { useUserContext } from '@/composables/user-context'

  const { user } = useUserContext()
</script>
```

## Example

The following is an example of how to create a context for authentication in a Vue application using the `createTrinity` function:

```ts
// state/auth.ts
import { createContext, createTrinity } from '@vuetify/0'
import { ref, toRef } from 'vue'

import type { ComputedGetter, Readonly, Ref } from 'vue'

interface LoginCredentials {
  username: string
  password: string
}

interface AuthContext {
  user: Ref<User | null>
  isAuthenticated: Readonly<ComputedGetter<boolean>>
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

  const context: AuthContext = {
    user,
    isAuthenticated,
    login,
    logout,
  }

  return createTrinity<AuthContext>(useAuth, provideAuth, context)
}

export const [useAuth, provideAuth] = createAuth()
```
