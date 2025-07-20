# useContext

A foundational utility for creating and consuming context throughout your application, enabling sharing state and methods across components without prop drilling.

```ts
// composables/useUser.ts
import { ref } from 'vue'
import { useContext } from 'v0'
import type { UserContext } from '@/types'

const [useUserContext, provideUserContext] = useContext<UserContext>('app:user')

export { useUserContext, provideUserContext }

// types.ts
export interface UserContext {
  currentUser: Ref<User | null>
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}
```

```ts
// providers/UserProvider.vue
<script lang="ts" setup>
import { ref } from 'vue'
import { provideUserContext } from '@/composables/useUser'

const currentUser = ref<User | null>(null)

const login = async (credentials: LoginCredentials) => {
  // Login logic
  currentUser.value = await authService.login(credentials)
}

const logout = async () => {
  // Logout logic
  await authService.logout()
  currentUser.value = null
}

provideUserContext({
  currentUser,
  login,
  logout,
})
</script>

<template>
  <slot />
</template>
```

### Providing Context in App

```vue
// App.vue
<script lang="ts" setup>
import UserProvider from '@/providers/UserProvider.vue'
</script>

<template>
  <UserProvider>
    <router-view />
  </UserProvider>
</template>
```

### Consuming Context in Components

```vue
<script lang="ts" setup>
import { useUserContext } from '@/composables/useUser'

const { currentUser, login, logout } = useUserContext()

const handleLogin = async () => {
  await login({ username: 'john', password: 'secret' })
}
</script>

<template>
  <div>
    <div v-if="currentUser">
      <h2>Welcome, {{ currentUser.name }}!</h2>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <button @click="handleLogin">Login</button>
    </div>
  </div>
</template>
```

### Nested Context Providers

```vue
<script lang="ts" setup>
import { useContext } from 'v0'

// Create theme context
interface ThemeContext {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
}

const [useThemeContext, provideThemeContext] = useContext<ThemeContext>('theme')

const theme = ref<'light' | 'dark'>('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const themeContext = {
  theme,
  toggleTheme,
}

// Provide context to children
provideThemeContext(themeContext)
</script>

<template>
  <div :class="theme">
    <slot />
  </div>
</template>
```

### Error Handling

```ts
// Safe context consumption with error handling
import { useContext } from 'v0'

const [useMyContext, provideMyContext] = useContext<MyContextType>('my-context')

export function useSafeContext(): MyContextType | null {
  try {
    return useMyContext()
  } catch (error) {
    console.warn('Context not found:', error)
    return null
  }
}
```

## TypeScript Support

The composable is fully typed with TypeScript:

```ts
export function useContext<T>(
  key: InjectionKey<T> | string,
): readonly [
  () => T,
  (value: T, app?: App) => void,
]
```
