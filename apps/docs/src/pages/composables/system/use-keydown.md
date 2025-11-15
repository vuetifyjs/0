---
meta:
  title: useKeydown
  description: A plugin for handling global keyboard events with key filtering, automatic cleanup, and registry-based management.
  keywords: useKeydown, keyboard, events, keydown, plugin, Vue, global shortcuts
features:
  category: Plugin
  label: 'P: useKeydown'
  github: /composables/useKeydown/
---

# useKeydown

A plugin-primary composable for handling global keyboard events with key filtering and automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

### Plugin Setup

The recommended approach is to install the keydown plugin at the app level, which provides a global registry for keyboard event handlers accessible throughout your application.

```ts
import { createApp } from 'vue'
import { createKeydownPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createKeydownPlugin())

app.mount('#app')
```

### Using in Components

Once the plugin is installed, use `useKeydown()` in any component to access the keydown instance and register handlers:

```vue
<script setup>
import { useKeydown } from '@vuetify/v0'
import { ref } from 'vue'

const keydown = useKeydown()
const modalOpen = ref(false)

// Register keyboard handlers
keydown.register({
  key: 'Escape',
  handler: () => {
    modalOpen.value = false
  },
  preventDefault: true
})

keydown.register({
  key: 'k',
  handler: (event) => {
    if (event.ctrlKey || event.metaKey) {
      modalOpen.value = true
    }
  },
  preventDefault: true
})
</script>

<template>
  <div>
    <p>Press Escape to close, Ctrl+K to search</p>
    <div v-if="modalOpen">Modal is open</div>
  </div>
</template>
```

### Standalone Usage

For cases where you don't need app-level coordination, you can create a standalone instance:

```ts
import { createKeydown } from '@vuetify/v0'

const keydown = createKeydown()

keydown.register({
  key: 'Enter',
  handler: (event) => console.log('Enter pressed'),
  preventDefault: true
})

keydown.startListening()
```

## API

| Composable | Description |
|---|---|
| [useEventListener](/composables/system/use-event-listener) | General DOM event handling |
| [useRegistry](/composables/registration/use-registry) | Base registry system |

### `createKeydownPlugin`

- **Type**
  ```ts
  function createKeydownPlugin(
    options?: KeydownPluginOptions
  ): Plugin
  ```

- **Details**

  Creates a Vue plugin that provides a global keydown registry accessible throughout the application via `useKeydown()`.

- **Parameters**

  - `options`: Optional configuration
    - `namespace`: Custom namespace for the keydown context (default: `'v0:keydown'`)
    - `immediate`: Whether to start listening immediately (default: `true`)

- **Returns**

  Vue plugin instance to pass to `app.use()`

- **Example**
  ```ts
  import { createApp } from 'vue'
  import { createKeydownPlugin } from '@vuetify/v0'

  const app = createApp(App)
  app.use(createKeydownPlugin())
  ```

### `useKeydown`

- **Type**
  ```ts
  function useKeydown(
    namespace?: string
  ): KeydownContext
  ```

- **Details**

  Returns the keydown instance from context. Must be used after installing the keydown plugin or providing a context via `createKeydownContext()`.

- **Parameters**

  - `namespace`: The namespace to use for context lookup (default: `'v0:keydown'`)

- **Returns**

  Keydown context instance with the following properties and methods.

- **Example**
  ```ts
  import { useKeydown } from '@vuetify/v0'

  const keydown = useKeydown()

  keydown.register({
    key: 'Escape',
    handler: () => console.log('Escape pressed')
  })
  ```

### `createKeydown`

- **Type**
  ```ts
  function createKeydown(
    options?: KeydownOptions
  ): KeydownContext
  ```

- **Details**

  Creates a standalone keydown instance without dependency injection. Useful for isolated keyboard handling outside the plugin system.

- **Parameters**

  - `options`: Optional configuration
    - `immediate`: Whether to start listening immediately when in component scope (default: `true`)

- **Example**
  ```ts
  import { createKeydown } from '@vuetify/v0'

  const keydown = createKeydown({ immediate: false })
  keydown.startListening()
  ```

### `createKeydownContext`

- **Type**
  ```ts
  function createKeydownContext(
    options?: KeydownContextOptions
  ): [useKeydown, provideKeydown, defaultInstance]
  ```

- **Details**

  Creates a keydown context trinity for custom dependency injection scenarios.

- **Returns**

  Tuple containing:
  - `useKeydown()`: Function to consume the context
  - `provideKeydown(context?, app?)`: Function to provide the context
  - `defaultInstance`: Default keydown instance

- **Example**
  ```ts
  import { createKeydownContext } from '@vuetify/v0'

  const [useMyKeydown, provideMyKeydown, keydown] = createKeydownContext({
    namespace: 'my-app:keydown'
  })

  provideMyKeydown()
  ```

### `register`

- **Type**
  ```ts
  function register(handler: KeyHandler): KeyHandlerTicket

  interface KeyHandler {
    key: string
    handler: (event: KeyboardEvent) => void
    preventDefault?: boolean
    stopPropagation?: boolean
  }
  ```

- **Details**

  Registers a keyboard event handler. The handler is automatically added to the global listener when `startListening()` is called or when `immediate: true`.

- **Parameters**

  - `key`: The key to listen for (e.g., `'Enter'`, `'Escape'`, `'ArrowUp'`, `'a'`, `'Control'`)
  - `handler`: Function to execute when the key is pressed
  - `preventDefault`: Whether to call `preventDefault()` on the event (default: `false`)
  - `stopPropagation`: Whether to call `stopPropagation()` on the event (default: `false`)

- **Returns**

  Ticket object with `id`, `index`, and handler properties

- **Example**
  ```ts
  const keydown = useKeydown()

  keydown.register({
    key: 'Enter',
    handler: (event) => console.log('Enter pressed', event),
    preventDefault: true
  })
  ```

### `startListening`

- **Type**
  ```ts
  function startListening(): void
  ```

- **Details**

  Manually starts listening for keyboard events. Registers all handlers with the global document listener. This is called automatically when `immediate: true` (default).

- **Example**
  ```ts
  const keydown = createKeydown({ immediate: false })

  keydown.register({ key: 'Enter', handler: () => {} })
  keydown.startListening()
  ```

### `stopListening`

- **Type**
  ```ts
  function stopListening(): void
  ```

- **Details**

  Manually stops listening for keyboard events. Unregisters all handlers from the global document listener. Automatically called on component unmount.

- **Example**
  ```ts
  const keydown = useKeydown()

  // Temporarily disable keyboard handling
  keydown.stopListening()

  // Re-enable later
  keydown.startListening()
  ```

### `isListening`

- **Type**
  ```ts
  Readonly<Ref<boolean>>
  ```

- **Details**

  Readonly reactive state indicating whether the keydown instance is currently listening for events.

- **Example**
  ```ts
  const keydown = useKeydown()

  console.log(keydown.isListening.value) // true (if immediate: true)

  keydown.stopListening()
  console.log(keydown.isListening.value) // false
  ```

## Lifecycle & Cleanup

### Automatic Cleanup

The keydown instance automatically manages lifecycle:

- **Component scope**: When used inside a component with `immediate: true` (default), listening starts on mount
- **Unmount**: Handlers are automatically unregistered when the component unmounts via `onScopeDispose`
- **Document listener**: Each keydown instance maintains its own document-level listener for isolation

### Manual Control

You can manually control when handlers are active:

```ts
const keydown = createKeydown({ immediate: false })

keydown.register({ key: 'Enter', handler: () => {} })

// Start listening manually
keydown.startListening()

// Pause keyboard handling
keydown.stopListening()

// Resume
keydown.startListening()
```

### SSR Considerations

The keydown composable is SSR-safe:
- Keyboard listeners are only attached when running in the browser
- Uses `IN_DOCUMENT` constant internally to check for browser environment
- No special handling needed for SSR applications

## Implementation Details

### Instance-Based Architecture

Each `createKeydown()` instance is fully isolated with its own registry and document listener:

1. Each instance creates its own `document.addEventListener('keydown')` listener when `startListening()` is called
2. Handlers are stored in the instance's local registry
3. On each keydown event, the listener iterates through the instance's registered handlers
4. When the instance stops listening, its document listener is removed

**Plugin usage**: When using the plugin, all components share the same instance via context injection, so they effectively share one listener app-wide. This provides both efficiency and centralized management.

### Key Matching

The `key` parameter uses the `KeyboardEvent.key` property. Valid values include:

- **Special keys**: `'Enter'`, `'Escape'`, `'Tab'`, `'Backspace'`, `'Delete'`
- **Arrow keys**: `'ArrowUp'`, `'ArrowDown'`, `'ArrowLeft'`, `'ArrowRight'`
- **Modifier keys**: `'Control'`, `'Shift'`, `'Alt'`, `'Meta'`
- **Function keys**: `'F1'`, `'F2'`, etc.
- **Character keys**: `'a'`, `'b'`, `'1'`, `'@'`, etc. (case-sensitive)

For modifier combinations (e.g., Ctrl+K), check modifiers in your handler:

```ts
keydown.register({
  key: 'k',
  handler: (event) => {
    if (event.ctrlKey || event.metaKey) {
      // Handle Ctrl+K or Cmd+K
    }
  }
})
```

### preventDefault and stopPropagation

These options control event propagation:

- **`preventDefault: true`**: Prevents default browser behavior (e.g., form submission on Enter)
- **`stopPropagation: true`**: Stops event from bubbling to parent handlers

Both are called **before** your handler executes.

## Plugin vs Composable

### When to Use the Plugin

Use `createKeydownPlugin()` when:
- You need app-wide keyboard shortcuts
- Multiple components register keyboard handlers
- You want centralized keyboard event management
- Handlers should persist across route changes

### When to Use Standalone

Use `createKeydown()` when:
- You need isolated keyboard handling for a specific feature
- You don't want to share state with other parts of the app
- You're working outside the Vue component system
- You need multiple independent keydown registries
