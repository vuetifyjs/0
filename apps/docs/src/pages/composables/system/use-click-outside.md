---
title: useClickOutside - Click Outside Detection for Vue 3
meta:
- name: description
  content: Detect clicks outside of elements with two-phase detection, touch scroll handling, iframe focus detection, and automatic cleanup.
- name: keywords
  content: useClickOutside, click outside, dismiss, popover, dropdown, modal, Vue 3, composable
features:
  category: Composable
  label: 'E: useClickOutside'
  github: /composables/useClickOutside/
---

# useClickOutside

A composable for detecting clicks outside of specified element(s) with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useClickOutside` composable detects when users click outside target elements. It uses two-phase detection (pointerdown → pointerup) to prevent false positives when dragging, and includes touch scroll handling for mobile.

```vue UseClickOutside
<script setup>
import { useClickOutside } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(true)
const menuRef = useTemplateRef('menu')

useClickOutside(menuRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div class="relative">
    <button @click="isOpen = true">Open Menu</button>

    <div
      v-if="isOpen"
      ref="menu"
      class="absolute mt-2 p-4 bg-white rounded shadow-lg"
    >
      Click outside to close
    </div>
  </div>
</template>
```

### With Component Refs

When using component refs (like Atom), pass a getter that returns the exposed element:

```vue ComponentRef
<script setup>
import { Atom, useClickOutside } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(true)
const popoverRef = useTemplateRef('popover')

useClickOutside(
  () => popoverRef.value?.element,
  () => { isOpen.value = false }
)
</script>

<template>
  <Atom v-if="isOpen" ref="popover" class="popover">
    Popover content
  </Atom>
</template>
```

### Multiple Targets

Detect clicks outside multiple elements (e.g., anchor and popover):

```vue MultipleTargets
<script setup>
import { useClickOutside } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(false)
const anchorRef = useTemplateRef('anchor')
const popoverRef = useTemplateRef('popover')

useClickOutside(
  [anchorRef, () => popoverRef.value?.element],
  () => { isOpen.value = false }
)
</script>

<template>
  <button ref="anchor" @click="isOpen = !isOpen">Toggle</button>
  <div v-if="isOpen" ref="popover">Popover</div>
</template>
```

### Ignoring Elements

Ignore specific elements via CSS selectors or refs:

```vue IgnoreElements
<script setup>
import { useClickOutside } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(true)
const menuRef = useTemplateRef('menu')

useClickOutside(menuRef, () => { isOpen.value = false }, {
  ignore: ['[data-app-bar]', '.toast-container']
})
</script>
```

## Accessibility

This composable handles pointer interactions only. For accessible components (dialogs, popovers, menus), pair with `useKeydown` for Escape key dismissal per WCAG/APG requirements:

```ts
import { useClickOutside, useKeydown } from '@vuetify/v0'

// Pointer dismissal
useClickOutside(menuRef, close)

// Keyboard dismissal (required for accessibility)
useKeydown({ key: 'Escape', handler: close })
```

## API

| Composable | Description |
|---|---|
| [useKeydown](/composables/system/use-keydown) | Keyboard event handling |
| [useEventListener](/composables/system/use-event-listener) | General DOM event handling |

### `useClickOutside`

- **Type**
  ```ts
  interface UseClickOutsideOptions {
    capture?: boolean              // Use capture phase (default: true)
    touchScrollThreshold?: number  // Touch scroll threshold in px (default: 30)
    detectIframe?: boolean         // Detect iframe focus (default: false)
    ignore?: MaybeRefOrGetter<ClickOutsideIgnoreTarget[]>
  }

  interface UseClickOutsideReturn {
    readonly isActive: Readonly<Ref<boolean>>
    readonly isPaused: Readonly<Ref<boolean>>
    pause: () => void
    resume: () => void
    stop: () => void
  }

  function useClickOutside(
    target: ClickOutsideTarget | readonly ClickOutsideTarget[],
    handler: (event: PointerEvent | FocusEvent) => void,
    options?: UseClickOutsideOptions
  ): UseClickOutsideReturn
  ```

- **Details**

  Uses two-phase detection (pointerdown → pointerup) to prevent false positives when users drag from inside to outside an element. Touch interactions that move more than the threshold are treated as scrolls, not clicks.

- **Parameters**

  - `target`: Element ref(s) to detect clicks outside of
  - `handler`: Callback invoked when a click outside is detected
  - `options`:
    - `capture`: Use capture phase for event listeners (default: true)
    - `touchScrollThreshold`: Pixel threshold for touch scroll detection (default: 30)
    - `detectIframe`: Detect focus moving to iframes outside target (default: false)
    - `ignore`: Elements or CSS selectors to ignore

- **Returns**

  - `isActive`: Whether detection is currently active
  - `isPaused`: Whether detection is paused
  - `pause()`: Pause detection (clears pending state)
  - `resume()`: Resume detection
  - `stop()`: Stop detection and clean up

- **Example**
  ```ts
  const { pause, resume, stop } = useClickOutside(
    menuRef,
    () => { isOpen.value = false },
    {
      capture: true,
      touchScrollThreshold: 30,
      detectIframe: true,
      ignore: ['.modal', buttonRef]
    }
  )

  // Control detection
  pause()   // Temporarily pause
  resume()  // Resume after pause
  stop()    // Permanently stop
  ```
