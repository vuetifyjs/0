# useEventListener

A composable for handling DOM events with automatic cleanup. Register using addEventListener on mounted, and removeEventListener automatically on unmounted.

### `useEventListener(target, event, listener, options?)`

Attaches event listeners to DOM elements with automatic cleanup.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `Window \| Document \| MaybeRefOrGetter<HTMLElement \| EventTarget \| null \| undefined>` | The target element to attach the listener to |
| `event` | `MaybeRefOrGetter<MaybeArray<string>>` | Event name(s) to listen for |
| `listener` | `MaybeRef<MaybeArray<EventHandler>>` | Event handler function(s) |
| `options` | `MaybeRefOrGetter<boolean \| AddEventListenerOptions>` | Optional event listener options |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `stop` | `CleanupFunction` | Function to manually remove the event listener |

### `useWindowEventListener(event, listener, options?)`

Convenience function for attaching event listeners to the window object.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | `MaybeRefOrGetter<MaybeArray<keyof WindowEventMap>>` | Event name(s) to listen for |
| `listener` | `MaybeRef<MaybeArray<WindowEventHandler>>` | Event handler function(s) |
| `options` | `MaybeRefOrGetter<boolean \| AddEventListenerOptions>` | Optional event listener options |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `stop` | `CleanupFunction` | Function to manually remove the event listener |

### `useDocumentEventListener(event, listener, options?)`

Convenience function for attaching event listeners to the document object.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | `MaybeRefOrGetter<MaybeArray<keyof DocumentEventMap>>` | Event name(s) to listen for |
| `listener` | `MaybeRef<MaybeArray<DocumentEventHandler>>` | Event handler function(s) |
| `options` | `MaybeRefOrGetter<boolean \| AddEventListenerOptions>` | Optional event listener options |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `stop` | `CleanupFunction` | Function to manually remove the event listener |

## Basic Usage

```html
<script setup>
import { useEventListener, useWindowEventListener, useDocumentEventListener } from '@vuetify/0'
import { ref, useTemplateRef } from 'vue'

// Track window dimensions for responsive design
const windowSize = ref({ width: 0, height: 0 })
useWindowEventListener('resize', () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight
  }
})

// Handle keyboard shortcuts globally
useDocumentEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    console.log('Save shortcut triggered')
  }
})

// Interactive card with hover effects
const card = useTemplateRef('card')
const isHovered = ref(false)

useEventListener(card, 'mouseenter', () => {
  isHovered.value = true
})

useEventListener(card, 'mouseleave', () => {
  isHovered.value = false
})
</script>

<template>
  <div 
    ref="card" 
    :class="{ 'hovered': isHovered }"
    class="interactive-card"
  >
    <p>Window: {{ windowSize.width }}x{{ windowSize.height }}</p>
    <p>Hover me! ({{ isHovered ? 'Hovered' : 'Not hovered' }})</p>
  </div>
</template>
```

## Convenience Functions

For common use cases with window and document events, you can use the convenience functions:

```typescript
import { useWindowEventListener, useDocumentEventListener } from '@vuetify/0'
import { ref } from 'vue'

// Track online/offline status
const isOnline = ref(navigator.onLine)
useWindowEventListener(['online', 'offline'], () => {
  isOnline.value = navigator.onLine
})

// Handle focus management for accessibility
const lastFocusedElement = ref<Element | null>(null)
useDocumentEventListener('focusin', (evt) => {
  lastFocusedElement.value = evt.target as Element
})

// Detect mobile device orientation changes
const orientation = ref(screen.orientation?.angle || 0)
useWindowEventListener('orientationchange', () => {
  orientation.value = screen.orientation?.angle || 0
})

// Performance-optimized scroll handling
useWindowEventListener('scroll', () => {
  // Throttled scroll logic here
}, { passive: true })
```

## Advanced Usage

### Multiple Events for Form Validation

```html
<script setup>
// Listen to multiple input events for real-time validation
const inputElement = useTemplateRef('inputElement')
const validationErrors = ref<string[]>([])

useEventListener(inputElement, ['input', 'blur', 'focus'], (evt) => {
  if (evt.type === 'input') {
    // Real-time validation
    validateInput(evt.target.value)
  } else if (evt.type === 'blur') {
    // Final validation on blur
    finalizeValidation(evt.target.value)
  }
})
</script>

<template>
  <input ref="inputElement" type="text" placeholder="Enter text..." />
</template>
```

### Multiple Handlers for Analytics

```html
<script setup>
// Track user interactions with multiple handlers
const trackClick = (evt) => {
  analytics.track('button_click', { target: evt.target.id })
}

const updateUI = (evt) => {
  // Update UI state
  buttonClickCount.value++
}

const button = useTemplateRef('button')
useEventListener(button, 'click', [trackClick, updateUI])
</script>

<template>
  <button ref="button">Click me</button>
</template>
```

### Performance-Optimized Event Options

```html
<script setup>
// Optimized scroll handling for infinite scroll
const scrollContainer = useTemplateRef('scrollContainer')

useEventListener(scrollContainer, 'scroll', (evt) => {
  const { scrollTop, scrollHeight, clientHeight } = evt.target
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreItems()
  }
}, { passive: true, capture: false })
</script>

<template>
  <div ref="scrollContainer" class="scroll-container">
    <!-- Scrollable content -->
  </div>
</template>
```

### Dynamic Event Switching

```html
<script setup>
// Switch between touch and mouse events based on device
const isTouchDevice = ref('ontouchstart' in window)
const eventType = computed(() => 
  isTouchDevice.value ? 'touchstart' : 'mousedown'
)

const element = useTemplateRef('element')
useEventListener(element, eventType, (evt) => {
  handleInteraction(evt)
})
</script>

<template>
  <div ref="element" class="interactive-element">
    Touch or click me
  </div>
</template>
```

### Conditional Cleanup

```typescript
// Cleanup based on component state
const isModalOpen = ref(false)
const stopEscapeListener = ref<(() => void) | null>(null)

watch(isModalOpen, (open) => {
  if (open) {
    stopEscapeListener.value = useDocumentEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        isModalOpen.value = false
      }
    })
  } else {
    stopEscapeListener.value?.()
    stopEscapeListener.value = null
  }
})
```

## TypeScript Support

The composable provides full TypeScript support with proper event typing:

```html
<script setup lang="ts">
import { useEventListener, useWindowEventListener } from '@vuetify/0'
import { useTemplateRef, ref } from 'vue'
import type { CleanupFunction } from '@vuetify/0'

// Custom event handler with proper typing
interface CustomFormData {
  email: string
  password: string
}

const form = useTemplateRef('form')
const formData = ref<CustomFormData>({ email: '', password: '' })

// Form submission with typed event
useEventListener(form, 'submit', (evt: SubmitEvent) => {
  evt.preventDefault()
  const form = evt.currentTarget as HTMLFormElement
  const data = new FormData(form)
  
  formData.value = {
    email: data.get('email') as string,
    password: data.get('password') as string
  }
})
</script>

<template>
  <form ref="form">
    <input name="email" type="email" placeholder="Email" />
    <input name="password" type="password" placeholder="Password" />
    <button type="submit">Submit</button>
  </form>
</template>

// Media query change events with proper typing
const mediaQuery = window.matchMedia('(max-width: 768px)')
const isMobile = ref(mediaQuery.matches)

useEventListener(mediaQuery, 'change', (evt: MediaQueryListEvent) => {
  isMobile.value = evt.matches
})

// File input with drag and drop typing
const dropZone = useTemplateRef('dropZone')
const files = ref<File[]>([])

useEventListener(dropZone, 'drop', (evt: DragEvent) => {
  evt.preventDefault()
  const droppedFiles = Array.from(evt.dataTransfer?.files || [])
  files.value = droppedFiles.filter(file => file.type.startsWith('image/'))
})
</script>

<template>
  <div ref="dropZone" class="drop-zone">
    Drop images here
  </div>
</template>
```

## SSR Considerations

For Server-Side Rendering, wrap DOM-dependent logic in `onMounted`:

```typescript
import { onMounted } from 'vue'
import { useDocumentEventListener } from '@vuetify/0'

// Safe for SSR
onMounted(() => {
  useDocumentEventListener('keydown', (e) => {
    console.log(e.key)
  })
})
```

## Features

- **Automatic cleanup**: Listeners are removed when component unmounts
- **Reactive targets**: Event target can be a ref that changes dynamically
- **Reactive events**: Event types can change dynamically
- **Multiple events**: Single listener can handle multiple event types
- **Multiple listeners**: Multiple listeners can be attached to the same event
- **Type safe**: Full TypeScript support with proper event typing
- **Options support**: Supports all standard addEventListener options
- **Manual cleanup**: Returns a stop function for manual cleanup