---
title: useHotkey - Hotkey Combinations and Sequences for Vue 3
meta:
- name: description
  content: Handle hotkey combinations and sequences with platform-aware modifiers and automatic cleanup. Supports ctrl+k combinations, g-h sequences, and input focus.
- name: keywords
  content: useHotkey, hotkey, keyboard, shortcuts, sequences, combinations, composable, Vue 3, ctrl+k, cmd+k
features:
  category: Composable
  label: 'E: useHotkey'
  github: /composables/useHotkey/
  level: 2
related:
  - /composables/system/use-event-listener
  - /composables/system/use-click-outside
---

# useHotkey

A composable for handling hotkey combinations and sequences with platform-aware modifiers and automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useHotkey` composable registers hotkey handlers on the window with automatic cleanup when the component is unmounted. It supports key combinations (`ctrl+k`), key sequences (`g-h`), and platform-aware modifier mapping.

```vue collapse no-filename UseHotkey
<script setup lang="ts">
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

## Key Aliases

Key strings are normalized before matching, so you can use human-friendly names instead of exact `KeyboardEvent.key` values:

| Alias | Canonical |
| - | - |
| `esc` | `escape` |
| `return` | `enter` |
| `del` | `delete` |
| `space`, `spacebar` | ` ` (space character) |
| `up` / `down` / `left` / `right` | `arrowup` / `arrowdown` / `arrowleft` / `arrowright` |
| `control` | `ctrl` |
| `command` | `cmd` |
| `option` | `alt` |
| `plus` | `+` |
| `minus`, `hyphen` | `-` |
| `slash` | `/` |
| `underscore` | `_` |

```ts no-filename
// These are equivalent:
useHotkey('escape', close)
useHotkey('esc', close)

useHotkey('ctrl+plus', zoomIn)   // matches Ctrl ++
useHotkey('cmd+minus', zoomOut)  // matches Cmd +-
```

## Architecture

`useHotkey` builds on `useEventListener` for keyboard event handling:

```mermaid "Hotkey Hierarchy"
flowchart TD
  useEventListener --> useHotkey
  useHotkey --> Combinations["ctrl+k, cmd+s"]
  useHotkey --> Sequences["g-h, g-i"]
  useHotkey --> Components["Command Palette, Shortcuts"]
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `isActive` | <AppSuccessIcon /> | Computed from cleanup ref |
| `isPaused` | <AppSuccessIcon /> | ShallowRef, readonly |
| `keys` | <AppSuccessIcon /> | Accepts MaybeRefOrGetter, watched for changes |

## Examples

::: gn-example
/composables/use-hotkey/command-palette

### Command Palette

A searchable command palette (Cmd+J / Ctrl+J) built with `useHotkey`, `Dialog`, and `useToggleScope`. Three layers of hotkey registration work together: a global `cmd+j` binding opens the palette unconditionally; inside the palette, per-command shortcuts (`cmd+l`, `cmd+s`, …) fire while the user types in the search field thanks to `{ inputs: true }`; and arrow-key navigation moves the selection through filtered results.

`useToggleScope` is the key composition pattern: scoped hotkeys — navigation and per-command shortcuts — are registered only while `isOpen` is `true`, and automatically torn down when the palette closes. This prevents global key conflicts and avoids manual cleanup.

The `computed` filtered list re-derives on every `query` change, and a `watch` on `filtered` resets `selectedIndex` to `0` so the highlight never sits on a stale position. Platform awareness is handled with `IN_BROWSER && navigator.userAgent.includes('Mac')` to display the correct modifier key label.

Reach for `useHotkey` + `useToggleScope` whenever a UI surface needs context-sensitive shortcuts that exist only while it is open — command palettes, modals, sidebars, and feature-specific shortcut overlays all benefit from this shape. For simpler one-shot bindings without scope gating, call `useHotkey` directly. For element-level keyboard handling (arrow keys inside a listbox, roving focus), see [useRovingFocus](/composables/system/use-roving-focus).

:::

<DocsApi />
