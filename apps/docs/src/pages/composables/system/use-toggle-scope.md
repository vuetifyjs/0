---
meta:
  title: useToggleScope
  description: Conditionally manage effect scopes based on reactive boolean conditions with automatic cleanup.
  keywords: effect scope, toggle, conditional, lifecycle, cleanup, Vue, composable
features:
  category: Composable
  label: 'E: useToggleScope'
  github: /composables/useToggleScope/
---

# useToggleScope

A composable for conditionally managing Vue effect scopes based on reactive boolean conditions with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useToggleScope` composable wraps Vue's `effectScope` API to create and destroy reactive effect scopes based on a boolean condition. When the condition becomes true, a new scope is created and your callback runs. When false, the scope is stopped and all effects are cleaned up automatically.

```vue
<script setup>
  import { useToggleScope } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  const isEnabled = shallowRef(false)
  const data = shallowRef(0)

  const { isActive } = useToggleScope(isEnabled, () => {
    // This watch is only active when isEnabled is true
    watch(data, (value) => {
      console.log('Data changed:', value)
    })
  })
</script>

<template>
  <div>
    <button @click="isEnabled = !isEnabled">
      {{ isEnabled ? 'Disable' : 'Enable' }} Watcher
    </button>
    <p>Scope active: {{ isActive }}</p>
    <input v-model.number="data" type="number">
  </div>
</template>
```

### `useToggleScope`

- **Type**
  ```ts
  interface ToggleScopeControls {
    isActive: Readonly<Ref<boolean>>
    stop: () => void
    start: () => void
    reset: () => void
  }

  function useToggleScope(
    source: WatchSource<boolean>,
    fn: (() => void) | ((controls: ToggleScopeControls) => void)
  ): ToggleScopeControls
  ```

- **Details**

  Creates an effect scope that is conditionally active based on a reactive boolean source. All reactive effects created within the scope are automatically cleaned up when the scope stops.

- **Parameters**

  - `source`: A reactive boolean value or getter that controls when the scope is active
  - `fn`: Function to execute within the scope. Can optionally receive controls for manual scope management.

- **Returns**

  - `isActive`: Whether the scope is currently active (created and running)
  - `stop()`: Stop the scope (destroys and cleans up all effects)
  - `start()`: Start the scope (creates and runs effects)
  - `reset()`: Reset the scope (stops and immediately restarts)

- **Example**
  ```ts
  const isFeatureEnabled = ref(false)

  const { isActive, stop, start } = useToggleScope(isFeatureEnabled, () => {
    // All watchers and effects created here are automatically cleaned up
    // when isFeatureEnabled becomes false

    watch(someData, () => {
      console.log('Data changed')
    })

    watchEffect(() => {
      console.log('Effect running')
    })
  })

  // Manually control the scope
  stop()  // Stops even if isFeatureEnabled is true
  start() // Starts the scope
  ```

## Use Cases

### Feature Flags

Enable/disable features dynamically with proper cleanup:

```ts
const isDarkMode = shallowRef(false)

useToggleScope(isDarkMode, () => {
  // Dark mode specific watchers and effects
  watch(theme, (value) => {
    document.documentElement.classList.toggle('dark', value.isDark)
  })

  // Auto-cleanup when dark mode is disabled
})
```

### Conditional API Polling

Start/stop polling based on component visibility:

```ts
const isVisible = shallowRef(true)

useToggleScope(isVisible, () => {
  const intervalId = setInterval(() => {
    fetchData()
  }, 5000)

  onScopeDispose(() => {
    clearInterval(intervalId)
  })
})
```

### Performance Optimization

Only run expensive reactive effects when needed:

```ts
const isExpanded = shallowRef(false)

useToggleScope(isExpanded, () => {
  // Heavy computations only run when panel is expanded
  watch([data1, data2, data3], () => {
    performExpensiveCalculation()
  })
})
```

### Debug Mode

Toggle debug logging without performance overhead:

```ts
const isDebugMode = shallowRef(false)

useToggleScope(isDebugMode, () => {
  watch(() => store.state, (state) => {
    console.log('State changed:', state)
  }, { deep: true })
})
```

## Lifecycle & Cleanup

### Automatic Cleanup

`useToggleScope` automatically cleans up the effect scope when:
- The source condition becomes false
- The parent component unmounts
- The parent Vue effect scope is disposed

**Implementation:**
```ts
// All effects are disposed when scope stops
scope.value?.stop()
```

This ensures all watchers, computed properties, and effects created within the scope are properly cleaned up, preventing memory leaks.

### Manual Control

The composable returns control functions for manual scope management:

```ts
const { isActive, start, stop, reset } = useToggleScope(isEnabled, () => {
  // Scope logic
})

// Check if scope is active
console.log(isActive.value) // true/false

// Manually stop the scope
stop()

// Manually start the scope
start()

// Reset (stop and immediately restart)
reset()
```

### Using Controls Inside Scope

Pass controls to the scope function for self-management:

```ts
useToggleScope(isEnabled, (controls) => {
  // Access scope state
  console.log('Active:', controls.isActive.value)

  // Self-reset on certain conditions
  watch(errorCount, (count) => {
    if (count > 10) {
      controls.reset() // Restart the scope
    }
  })
})
```

## Advanced Patterns

### Nested Scopes

Create hierarchical scope management:

```ts
const parentEnabled = shallowRef(true)
const childEnabled = shallowRef(true)

useToggleScope(parentEnabled, () => {
  console.log('Parent scope active')

  useToggleScope(childEnabled, () => {
    console.log('Child scope active')
    // Child automatically stops when parent stops
  })
})
```

### Coordinated Scopes

Multiple scopes controlled by different conditions:

```ts
const isOnline = shallowRef(true)
const isAuthenticated = shallowRef(false)

// API polling only when online
useToggleScope(isOnline, () => {
  setInterval(() => fetchData(), 5000)
})

// User-specific features only when authenticated
useToggleScope(isAuthenticated, () => {
  watch(userData, syncToServer)
})
```

### Delayed Activation

Use computed source for complex conditions:

```ts
const isReady = shallowRef(false)
const hasData = shallowRef(false)
const shouldActivate = computed(() => isReady.value && hasData.value)

useToggleScope(shouldActivate, () => {
  // Only runs when both conditions are true
})
```

### Scope with Cleanup Handler

Ensure proper resource cleanup:

```ts
useToggleScope(isActive, () => {
  const ws = new WebSocket('wss://api.example.com')

  ws.onmessage = (event) => {
    handleMessage(event.data)
  }

  onScopeDispose(() => {
    ws.close()
    console.log('WebSocket closed')
  })
})
```

## Best Practices

**Keep scope functions pure:**
```ts
// Good - self-contained
useToggleScope(isEnabled, () => {
  const data = shallowRef(0)
  watch(data, () => console.log(data.value))
})

// Avoid - external state modifications
let externalCount = 0
useToggleScope(isEnabled, () => {
  externalCount++ // Don't mutate external state
})
```

**Use onScopeDispose for cleanup:**
```ts
useToggleScope(isActive, () => {
  const timerId = setInterval(() => {}, 1000)

  // Always cleanup non-reactive resources
  onScopeDispose(() => {
    clearInterval(timerId)
  })
})
```

**Prefer reactive sources over manual control:**
```ts
// Good - reactive and automatic
const isEnabled = shallowRef(true)
useToggleScope(isEnabled, () => {})

// Less ideal - manual control
const { start, stop } = useToggleScope(() => false, () => {})
start() // Manual management required
```

**Don't create scopes in loops:**
```ts
// Bad - creates multiple scopes
items.forEach(item => {
  useToggleScope(item.isActive, () => {})
})

// Good - single scope observing array
useToggleScope(hasActiveItems, () => {
  items.value.forEach(item => {
    if (item.isActive) setupItem(item)
  })
})
```

## Performance Tips

**Use for expensive operations only:**
```ts
// Good - heavy operation worth toggling
useToggleScope(isExpanded, () => {
  watch(massiveArray, computeExpensiveStats, { deep: true })
})

// Overkill - simple operation
useToggleScope(isVisible, () => {
  const simple = computed(() => a.value + b.value)
})
```

**Batch related effects:**
```ts
// Good - related effects in one scope
useToggleScope(isActive, () => {
  watch(data1, handler1)
  watch(data2, handler2)
  watch(data3, handler3)
})

// Less efficient - separate scopes
useToggleScope(isActive, () => watch(data1, handler1))
useToggleScope(isActive, () => watch(data2, handler2))
useToggleScope(isActive, () => watch(data3, handler3))
```

**Debounce rapid toggles:**
```ts
import { refDebounced } from '@vueuse/core'

const isEnabled = shallowRef(false)
const debouncedEnabled = refDebounced(isEnabled, 300)

useToggleScope(debouncedEnabled, () => {
  // Won't thrash on rapid toggles
})
```
