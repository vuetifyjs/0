# useKeydown

The `useKeydown` composable provides a simple and efficient way to handle keyboard events in your Vue applications. It allows you to register keyboard event handlers with automatic cleanup and supports multiple key combinations with customizable behavior.

## Usage

```vue
<script lang="ts" setup>
import { useKeydown } from '@vuetify/0'
import { ref } from 'vue'

const message = ref('')

useKeydown({
  key: 'Enter',
  handler: () => {
    message.value = 'Enter key pressed!'
  }
})
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>Press Enter to see the message</p>
  </div>
</template>
```

## API Reference

### `useKeydown(handlers)`

Registers keyboard event handlers with automatic cleanup.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `handlers` | `KeyHandler \| KeyHandler[]` | Single handler or array of handlers |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `startListening` | `Function` | Manually start listening for events |
| `stopListening` | `Function` | Manually stop listening for events |

### KeyHandler

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | - | The key to listen for (e.g., 'Enter', 'Escape', 'ArrowUp') |
| `handler` | `(event: KeyboardEvent) => void` | - | Function to execute when key is pressed |
| `preventDefault` | `boolean` | `false` | Whether to call `preventDefault()` on the event |
| `stopPropagation` | `boolean` | `false` | Whether to call `stopPropagation()` on the event |

## TypeScript Support

The composable is fully typed:

```typescript
import { useKeydown } from '@vuetify/0'
import type { KeyHandler } from '@vuetify/0'

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
