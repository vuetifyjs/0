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

<script setup>
import BasicExample from '@/examples/composables/use-click-outside/basic.vue'
import BasicExampleRaw from '@/examples/composables/use-click-outside/basic.vue?raw'
</script>

# useClickOutside

A composable for detecting clicks outside of specified element(s) with automatic cleanup.

<DocsPageFeatures :frontmatter />

## Usage

The `useClickOutside` composable detects when users click outside target elements. It uses two-phase detection (pointerdown → pointerup) to prevent false positives when dragging, and includes touch scroll handling for mobile.

<DocsExample file="basic.vue" title="Dropdown Menu" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Examples

### With Component Refs

When using component refs (like Atom), pass a getter that returns the exposed element:

```ts
import { Atom, useClickOutside } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(true)
const popoverRef = useTemplateRef<AtomExpose>('popover')

useClickOutside(
  () => popoverRef.value?.element,
  () => { isOpen.value = false }
)
```

### Multiple Targets

Detect clicks outside multiple elements (e.g., anchor and popover):

```ts
import { useClickOutside } from '@vuetify/v0'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(false)
const anchorRef = useTemplateRef<HTMLElement>('anchor')
const popoverRef = useTemplateRef<AtomExpose>('popover')

useClickOutside(
  [anchorRef, () => popoverRef.value?.element],
  () => { isOpen.value = false }
)
```

### Ignoring Elements

Ignore specific elements via CSS selectors or refs:

```ts
import { useClickOutside } from '@vuetify/v0'
import { useTemplateRef } from 'vue'

const menuRef = useTemplateRef<HTMLElement>('menu')

useClickOutside(menuRef, close, {
  ignore: ['[data-app-bar]', '.toast-container']
})
```

### Pause and Resume

Control detection programmatically:

```ts
const { pause, resume, stop, isPaused } = useClickOutside(menuRef, close)

// Temporarily disable during animations
pause()

// Re-enable after animation
resume()

// Permanently stop and cleanup
stop()
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
