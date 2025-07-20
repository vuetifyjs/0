# useHydration

A composable for managing the hydration process in SSR applications, controlling when and how components are hydrated to optimize performance and prevent hydration mismatches.
    <p>Loading...</p>
  </div>
</template>
```

## API Reference

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isHydrated` | `Readonly<ShallowRef<boolean>>` | Reactive boolean indicating if the app is hydrated |
| `hydrate` | `() => void` | Function to manually trigger hydration |

## Examples

### Conditional Component Rendering

```vue
<script lang="ts" setup>
import { useHydration } from 'v0'

const { isHydrated } = useHydration()
</script>

<template>
  <div>
    <!-- Always render server-safe content -->
    <header>
      <h1>My App</h1>
    </header>

    <!-- Only render interactive content after hydration -->
    <main v-if="isHydrated">
      <InteractiveComponent />
      <ClientOnlyFeature />
    </main>

    <!-- Optional: Show loading state during hydration -->
    <div v-else class="loading">
      <p>Loading interactive content...</p>
    </div>
  </div>
</template>
```

### Manual Hydration Control

```vue
<script lang="ts" setup>
import { useHydration } from 'v0'

const { isHydrated, hydrate } = useHydration()

// Manually trigger hydration based on user interaction
const handleUserInteraction = () => {
  if (!isHydrated.value) {
    hydrate()
  }
}
</script>

<template>
  <div>
    <button @click="handleUserInteraction">
      {{ isHydrated ? 'Hydrated!' : 'Click to hydrate' }}
    </button>

    <ExpensiveComponent v-if="isHydrated" />
  </div>
</template>
```

### Preventing Hydration Mismatches

```vue
<script lang="ts" setup>
import { useHydration } from 'v0'

const { isHydrated } = useHydration()

// This will be different on server vs client
const currentTime = new Date().toLocaleTimeString()
</script>

<template>
  <div>
    <!-- Safe: Same content on server and client -->
    <h1>Welcome to our app!</h1>

    <!-- Unsafe: Different on server vs client -->
    <!-- <p>Current time: {{ currentTime }}</p> -->

    <!-- Safe: Only render after hydration -->
    <p v-if="isHydrated">Current time: {{ currentTime }}</p>
  </div>
</template>
```

## TypeScript Support

The composable is fully typed with TypeScript:

```ts
export interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}

export interface HydrationPlugin {
  install: (app: App) => void
}
```

## SSR Considerations

### Hydration Process

1. **Server-Side Rendering**: Components render with `isHydrated = false`
2. **Client-Side Hydration**: After Vue hydrates, `isHydrated` becomes `true`
3. **Automatic Triggering**: Hydration is triggered automatically in `onMounted`
