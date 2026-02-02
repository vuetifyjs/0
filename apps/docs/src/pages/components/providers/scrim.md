---
title: Scrim - Overlay Backdrop for Vue 3
meta:
- name: description
  content: A headless scrim/backdrop component for overlay systems. Integrates with useStack for automatic z-index management, dismiss handling, and blocking mode support.
- name: keywords
  content: scrim, backdrop, overlay, modal, dialog, z-index, Vue 3, headless
features:
  category: Component
  label: 'C: Scrim'
  github: /components/Scrim/
  renderless: true
  level: 2
related:
  - /composables/plugins/use-stack
  - /components/disclosure/dialog
---

# Scrim

A headless backdrop component that integrates with the stack system to provide a shared overlay for all active modals and dialogs.

<DocsPageFeatures :frontmatter />

## Installation

The Scrim component uses the global stack context. For SSR applications, install the stack plugin:

```ts main.ts
import { createApp } from 'vue'
import { createStackPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createStackPlugin())

app.mount('#app')
```

> [!TIP]
> For client-side only apps, you can skip plugin installation. The Scrim will use the default `stack` singleton automatically.

## Usage

The Scrim component renders a backdrop that appears when any overlay is active. It automatically positions itself below the topmost overlay using z-index management from the stack context.

```vue
<script setup lang="ts">
  import { Scrim } from '@vuetify/v0'
</script>

<template>
  <Scrim class="fixed inset-0 bg-black/50" />
</template>
```

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Scrim } from '@vuetify/v0'
</script>

<template>
  <!-- Teleports to body by default -->
  <Scrim class="fixed inset-0 bg-black/50 transition-opacity" />
</template>
```

## Custom Styling via Slot Props

Access the stack state through slot props for custom rendering:

```vue
<script setup lang="ts">
  import { Scrim } from '@vuetify/v0'
</script>

<template>
  <Scrim
    v-slot="{ isActive, isBlocking, zIndex, dismiss }"
    :teleport="false"
    class="fixed inset-0"
  >
    <div
      class="size-full bg-black/50"
      :class="{ 'cursor-not-allowed': isBlocking }"
      @click="dismiss"
    >
      Active: {{ isActive }}, Z-Index: {{ zIndex }}
    </div>
  </Scrim>
</template>
```

## Blocking Mode

When the topmost overlay has `blocking: true`, the scrim will not dismiss on click. The `isBlocking` slot prop reflects this state:

```vue
<template>
  <Scrim v-slot="{ isBlocking }" class="fixed inset-0">
    <div :class="isBlocking ? 'bg-black/70' : 'bg-black/50'" />
  </Scrim>
</template>
```

## Inline Rendering

By default, Scrim teleports to `body`. Disable teleport for inline rendering:

```vue
<template>
  <div class="relative">
    <Scrim :teleport="false" class="absolute inset-0 bg-black/50" />
    <!-- Content -->
  </div>
</template>
```

## Custom Stack Context

For isolated overlay systems, provide a custom stack context:

```vue
<script setup lang="ts">
  import { Scrim, createStackContext } from '@vuetify/v0'

  const customStack = createStackContext()
</script>

<template>
  <Scrim :stack="customStack" class="fixed inset-0 bg-black/50" />
</template>
```

## Transitions

The default transition is `fade`. Customize with the `transition` prop:

```vue
<template>
  <Scrim transition="slide-fade" class="fixed inset-0 bg-black/50" />
</template>

<style>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    opacity: 0;
  }
</style>
```

<DocsApi />
