---
title: useStack - Overlay Z-Index Management for Vue 3
meta:
- name: description
  content: Vue 3 composable for managing overlay z-index stacking. Automatic z-index calculation, scrim integration, and SSR-safe global overlay coordination.
- name: keywords
  content: useStack, stack, z-index, overlay, modal, dialog, scrim, composable, Vue
features:
  category: Plugin
  label: 'E: useStack'
  github: /composables/useStack/
  level: 2
related:
- /composables/registration/create-registry
- /composables/registration/create-queue
- /components/providers/scrim
---

# useStack

A composable for managing overlay z-index stacking with automatic calculation, scrim integration, and parent/child tracking for nested overlays.

<DocsPageFeatures :frontmatter />

## Installation

Install the Stack plugin in your app's entry point:

```ts main.ts
import { createApp } from 'vue'
import { createStackPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createStackPlugin())

app.mount('#app')
```

> [!TIP]
> For client-side only apps, you can skip plugin installation and use the default `stack` singleton directly. The plugin is required for SSR to ensure each request gets its own stack instance.

## Scrim Integration

Use the [Scrim](/components/providers/scrim) component alongside `useStack` to provide a backdrop for your overlays. The Scrim automatically positions itself below the topmost overlay:

```vue
<script setup lang="ts">
import { Scrim } from '@vuetify/v0'
</script>

<template>
  <Scrim class="fixed inset-0 bg-black/50" />
</template>
```

The Scrim reads from the same stack context, so its z-index is always coordinated with your registered overlays.

## Usage

Use the `useStack` composable to register an overlay and receive its z-index and position in the stack:

```ts collapse
import { shallowRef, watch } from 'vue'
import { useStack } from '@vuetify/v0'

const isOpen = shallowRef(false)

const stack = useStack()
const ticket = stack.register({
  onDismiss: () => { isOpen.value = false }
})

// Activate when opening, deactivate when closing
watch(isOpen, open => {
  if (open) ticket.select()
  else ticket.unselect()
})

// ticket.zIndex.value = 2000 when first overlay
// ticket.zIndex.value = 2010 when second overlay
// ticket.globalTop.value = true when this is the topmost overlay
```

## Architecture

`createStack` extends `createRegistry` with z-index management and scrim coordination:

```mermaid "Stack Hierarchy"
flowchart TD
  createRegistry --> createStack:::primary
  createStack --> zIndex[auto z-index]
  createStack --> globalTop[topmost tracking]
  createStack --> scrim[scrim integration]
  createStack --> nested[parent/child tracking]
```

## Examples

::: example
/composables/use-stack/context.ts
/composables/use-stack/StackProvider.vue
/composables/use-stack/StackConsumer.vue
/composables/use-stack/overlays.vue

### Overlay Stack

This example demonstrates overlay stacking with `createStack`. Each overlay gets an automatically calculated z-index, and the scrim appears below the topmost overlay.

```mermaid "Stack Data Flow"
graph LR
  A["context.ts"]:::info -->|"provideStack()"| B["StackProvider"]:::success
  A -->|"useOverlays()"| C["StackConsumer"]:::warning
  B -->|"wraps"| C
```

**File breakdown:**

| File | Role |
|------|------|
| `context.ts` | Defines overlay context with open/close methods |
| `StackProvider.vue` | Provides stack context and renders scrim |
| `StackConsumer.vue` | Displays buttons to open overlays at different stack levels |
| `overlays.vue` | Entry point that composes Provider around Consumer |

**Key patterns:**

- `stack.register({ onDismiss })` creates a ticket for the overlay
- `ticket.select()` / `ticket.unselect()` activates/deactivates the overlay
- `ticket.globalTop` determines if this overlay should handle escape key
- `ticket.zIndex` provides the z-index value
- Scrim reads from the stack context to position below the top overlay

Click a button to open an overlay. Open multiple overlays to observe z-index layering.

:::

<DocsApi />
