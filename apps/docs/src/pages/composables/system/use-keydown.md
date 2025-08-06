---
meta:
  title: useKeydown
  description: Sets up global keyboard event listeners for specified key handlers with automatic cleanup.
  keywords: useKeydown, keydown, keyboard, event listener, composable, Vue
category: System
performance: 0
---

# useKeydown

The `useKeydown` composable sets up global keyboard event listeners for specified key handlers with automatic cleanup. This composable automatically starts listening when mounted and cleans up when the scope is disposed, providing a clean way to handle global keyboard interactions.

## API

### `useKeydown(handlers)`

Registers keyboard event handlers with automatic cleanup.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `handlers` | `KeyHandler \| KeyHandler[]` | Single handler or array of handlers |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `startListening` | `() => void` | Manually start listening for events |
| `stopListening` | `() => void` | Manually stop listening for events |

### KeyHandler

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | - | The key to listen for (e.g., 'Enter', 'Escape', 'ArrowUp') |
| `handler` | `(event: KeyboardEvent) => void` | - | Function to execute when key is pressed |
| `preventDefault` | `boolean` | `false` | Whether to call `preventDefault()` on the event |
| `stopPropagation` | `boolean` | `false` | Whether to call `stopPropagation()` on the event |

* **Type**
    
  ```ts
  export interface KeyHandler {
    key: string
    handler: (event: KeyboardEvent) => void
    preventDefault?: boolean
    stopPropagation?: boolean
  }

  export function useKeydown (handlers: KeyHandler[] | KeyHandler): {
    startListening: () => void
    stopListening: () => void
  }
  ```
    
* **Details**
    
  - `handlers`: A single `KeyHandler` object or an array of `KeyHandler` objects to register for keydown events.
      - `key`: The `KeyboardEvent.key` value to listen for (e.g., `'Escape'`, `'Enter'`, `'ArrowUp'`).
      - `handler`: The function to execute when the specified key is pressed. It receives the `KeyboardEvent` object.
      - `preventDefault?`: Optional boolean. If `true`, `event.preventDefault()` will be called on the event.
      - `stopPropagation?`: Optional boolean. If `true`, `event.stopPropagation()` will be called on the event.

  Returns an object with `startListening` and `stopListening` methods, allowing manual control over the event listeners.

## Common Key Names

| Key | Description |
|-----|-------------|
| `'Enter'` | Enter key |
| `'Escape'` | Escape key |
| `'Space'` | Space bar |
| `'ArrowUp'` | Up arrow |
| `'ArrowDown'` | Down arrow |
| `'ArrowLeft'` | Left arrow |
| `'ArrowRight'` | Right arrow |
| `'Tab'` | Tab key |
| `'Backspace'` | Backspace |
| `'Delete'` | Delete key |
| `'a'` - `'z'` | Letter keys |
| `'0'` - `'9'` | Number keys |
| `'F1'` - `'F12'` | Function keys |

## TypeScript Support

The composable is fully typed:

```typescript
import { useKeydown } from 'v0'
import type { KeyHandler } from 'v0'

// Type-safe handler definition
const handlers: KeyHandler[] = [
  {
    key: 'Enter',
    handler: (event: KeyboardEvent) => {
      // event is fully typed
      console.log(event.key, event.ctrlKey, event.shiftKey)
    },
    preventDefault: true
  }
]

const { startListening, stopListening } = useKeydown(handlers)
```

## Examples

### Handling a single key press

```html
<template>
  <div>
    <p>Press 'Escape' to see an alert.</p>
  </div>
</template>

<script setup lang="ts">
  import { useKeydown } from '@vuetify/v0/composables/useKeydown'

  useKeydown({
    key: 'Escape',
    handler: () => {
      alert('Escape key pressed!')
    },
    preventDefault: true,
  })
</script>
```

### Handling multiple key presses

```html
<template>
  <div>
    <p>Press 'ArrowUp' or 'ArrowDown' to log a message.</p>
  </div>
</template>

<script setup lang="ts">
  import { useKeydown } from '@vuetify/v0/composables/useKeydown'

  useKeydown([
    {
      key: 'ArrowUp',
      handler: () => {
        console.log('ArrowUp pressed!')
      },
    },
    {
      key: 'ArrowDown',
      handler: () => {
        console.log('ArrowDown pressed!')
      },
    },
  ])
</script>
```

### Manually starting and stopping listeners

```html
<template>
  <div>
    <button @click="start">Start Listening for 'Space'</button>
    <button @click="stop">Stop Listening for 'Space'</button>
    <p>Press 'Space' while listening is active.</p>
  </div>
</template>

<script setup lang="ts">
  import { useKeydown } from '@vuetify/v0/composables/useKeydown'

  const { startListening, stopListening } = useKeydown({
    key: ' ',
    handler: () => {
      console.log('Spacebar pressed!')
    },
  })

  const start = () => {
    startListening()
    console.log('Listening started.')
  }

  const stop = () => {
    stopListening()
    console.log('Listening stopped.')
  }
</script>
```


