---
title: useHotkey Composable
meta:
- name: description
  content: A composable for handling hotkey combinations and sequences with platform-aware
    modifiers and automatic cleanup.
- name: keywords
  content: useHotkey, hotkey, keyboard, shortcuts, sequences, combinations, composable, Vue
features:
  category: Composable
  label: 'E: useHotkey'
  github: /composables/useHotkey/
---

# useHotkey

A composable for handling hotkey combinations and sequences with platform-aware modifiers and automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useHotkey` composable registers hotkey handlers on the window with automatic cleanup when the component is unmounted. It supports key combinations (`ctrl+k`), key sequences (`g-h`), and platform-aware modifier mapping.

```vue UseHotkey
<script setup>
import { useHotkey } from '@vuetify/v0'
import { ref } from 'vue'

const commandPaletteOpen = ref(false)
const message = ref('')

// Simple key combination - Ctrl+K (Cmd+K on Mac)
useHotkey('ctrl+k', () => {
  commandPaletteOpen.value = true
})

// Key sequence (GitHub-style) - press 'g' then 'h'
useHotkey('g-h', () => {
  message.value = 'Go home!'
})

// With multiple modifiers
useHotkey('ctrl+shift+s', () => {
  message.value = 'Save all!'
})

// Allow in inputs with the inputs option
useHotkey('escape', () => {
  commandPaletteOpen.value = false
}, { inputs: true })
</script>

<template>
  <div>
    <p>Press Ctrl+K to open command palette</p>
    <p>Press g then h for GitHub-style navigation</p>
    <p v-if="message">{{ message }}</p>
  </div>
</template>
```

## Key Combinations

Combinations use `+`, `/`, or `_` to join keys that must be pressed simultaneously:

```ts
useHotkey('ctrl+k', callback)       // Ctrl + K
useHotkey('shift+enter', callback)  // Shift + Enter
useHotkey('ctrl+shift+p', callback) // Ctrl + Shift + P
useHotkey('alt+1', callback)        // Alt + 1
useHotkey('ctrl/k', callback)       // Same as ctrl+k (/ separator)
useHotkey('ctrl_k', callback)       // Same as ctrl+k (_ separator)
```

## Key Sequences

Sequences use `-` to join keys that must be pressed in order:

```ts
useHotkey('g-h', callback)      // Press 'g', then 'h'
useHotkey('g-i', callback)      // Press 'g', then 'i'
useHotkey('ctrl+k-p', callback) // Press Ctrl+K, then 'p'
```

Sequences reset if the wrong key is pressed or if the timeout expires (default: 1000ms).

## Platform-Aware Modifiers

The composable automatically maps `cmd` and `meta` modifiers based on platform:

| Modifier | Mac/iOS | Windows/Linux |
|----------|---------|---------------|
| `cmd` | Meta key (⌘) | Ctrl key |
| `meta` | Meta key (⌘) | Ctrl key |
| `ctrl` | Ctrl key | Ctrl key |

```ts
// Works as Cmd+K on Mac, Ctrl+K elsewhere
useHotkey('cmd+k', callback)
```

## Pause and Resume

Control hotkey listening without destroying the configuration:

```ts
const { pause, resume, stop, isPaused, isActive } = useHotkey('ctrl+k', callback)

pause()  // Temporarily disable
resume() // Re-enable
stop()   // Permanently stop (cleanup)

// Check state
console.log(isPaused.value)  // true when paused
console.log(isActive.value)  // true when actively listening
```

## API

### `useHotkey`

- **Type**
  ```ts
  interface UseHotkeyOptions {
    event?: MaybeRefOrGetter<'keydown' | 'keyup'>
    inputs?: MaybeRefOrGetter<boolean>
    preventDefault?: MaybeRefOrGetter<boolean>
    stopPropagation?: MaybeRefOrGetter<boolean>
    sequenceTimeout?: MaybeRefOrGetter<number>
  }

  interface UseHotkeyReturn {
    readonly isActive: Readonly<Ref<boolean>>
    readonly isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }

  function useHotkey(
    keys: MaybeRefOrGetter<string | undefined>,
    callback: (e: KeyboardEvent) => void,
    options?: UseHotkeyOptions
  ): UseHotkeyReturn
  ```

- **Details**

  Registers a hotkey handler on the window. Automatically starts listening when called and stops on scope disposal.

- **Parameters**

  - `keys`: The hotkey string (e.g., `'ctrl+k'`, `'g-h'`) or a reactive reference. Set to `undefined` to disable.
  - `callback`: Function to execute when the hotkey is triggered
  - `options`: Configuration options
    - `event`: Keyboard event type (`'keydown'` or `'keyup'`, default: `'keydown'`)
    - `inputs`: Allow hotkey when input/textarea is focused (default: `false`)
    - `preventDefault`: Prevent default browser action (default: `true`)
    - `stopPropagation`: Stop event propagation (default: `false`)
    - `sequenceTimeout`: Timeout in ms before sequence resets (default: `1000`)

- **Returns**

  - `isActive`: Whether the listener is currently active
  - `isPaused`: Whether the listener is paused
  - `pause()`: Temporarily disable the hotkey
  - `resume()`: Re-enable after pause
  - `stop()`: Permanently stop and cleanup

- **Example**
  ```ts
  import { useHotkey } from '@vuetify/v0'
  import { ref } from 'vue'

  // Reactive keys
  const keys = ref('ctrl+k')
  const { isActive, pause, resume } = useHotkey(keys, (e) => {
    console.log('Hotkey triggered!', e.key)
  })

  // Change hotkey dynamically
  keys.value = 'ctrl+j'

  // Disable temporarily
  pause()
  resume()
  ```

## Key Aliases

Common key aliases are supported for convenience:

| Alias | Canonical |
|-------|-----------|
| `control` | `ctrl` |
| `command` | `cmd` |
| `option` | `alt` |
| `esc` | `escape` |
| `space`, `spacebar` | ` ` (space) |
| `return` | `enter` |
| `del` | `delete` |
| `up`, `down`, `left`, `right` | `arrowup`, `arrowdown`, `arrowleft`, `arrowright` |
| `minus`, `hyphen` | `-` |

## Related

| Composable | Description |
|---|---|
| [useKeydown](/composables/system/use-keydown) | Simple key matching without parsing |
| [useEventListener](/composables/system/use-event-listener) | General DOM event handling |
