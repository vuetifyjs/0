# useKeydown

A composable for handling keyboard events with automatic cleanup, supporting multiple key combinations and customizable behavior.

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
