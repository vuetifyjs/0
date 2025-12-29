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
related:
  - /composables/system/use-event-listener
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

This composable handles pointer interactions only. For accessible overlays, you **must** implement additional patterns.

### Keyboard Dismissal (Required)

> **WCAG 2.1.2 Level A**: Without keyboard dismissal, click-outside creates a keyboard trap. This is a compliance failure.

```ts
import { useClickOutside, useKeydown } from '@vuetify/v0'

// Pointer dismissal
useClickOutside(menuRef, close)

// Keyboard dismissal - REQUIRED for WCAG 2.1.2
useKeydown({ key: 'Escape', handler: close })
```

### Focus Restoration

Return focus to the trigger element after dismissal per APG dialog patterns:

```ts
import { nextTick } from 'vue'

function close() {
  isOpen.value = false
  // Return focus to trigger for screen reader context
  nextTick(() => buttonRef.value?.focus())
}

useClickOutside(menuRef, close)
```

### Mobile Screen Reader Support

Mobile screen reader users (VoiceOver, TalkBack) cannot press Escape. Include a focusable close button within overlays:

```vue
<div ref="menu" role="menu">
  <!-- Visually hidden close for screen readers -->
  <button class="sr-only" @click="close" aria-label="Close menu">
    Close
  </button>
  <!-- menu items -->
</div>
```

The `sr-only` class hides content visually while keeping it accessible:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```


<DocsApi />
