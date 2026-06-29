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
  renderless: false
  level: 2
related:
  - /composables/plugins/use-stack
  - /components/disclosure/dialog
---

# Scrim

Headless backdrop component for overlay systems with automatic z-index management and dismiss handling.

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

::: gn-example
/components/scrim/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Scrim } from '@vuetify/v0'
</script>

<template>
  <Scrim />
</template>
```

## Recipes

### Blocking Mode

When the topmost overlay has `blocking: true`, the scrim will not dismiss on click. The `isBlocking` slot prop reflects this state:

```vue
<template>
  <Scrim v-slot="{ isBlocking }" class="fixed inset-0">
    <div :class="isBlocking ? 'bg-black/70' : 'bg-black/50'" />
  </Scrim>
</template>
```

### Inline Rendering

By default, Scrim teleports to `body`. Disable teleport for inline rendering:

```vue
<template>
  <div class="relative">
    <Scrim :teleport="false" class="absolute inset-0 bg-black/50" />
    <!-- Content -->
  </div>
</template>
```

#### Custom Stack Context

For isolated overlay systems, create a custom stack and provide it via Vue's injection system:

```vue
<script setup lang="ts">
  import { provide } from 'vue'
  import { createStack, Scrim } from '@vuetify/v0'

  // Create isolated stack (doesn't interfere with global stack)
  const stack = createStack()
  provide('v0:stack', stack)
</script>

<template>
  <Scrim class="fixed inset-0 bg-black/50" />
</template>
```

#### Transitions

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

## FAQ

::: faq

??? Why doesn't my scrim dismiss when I click it?

The topmost overlay has `blocking: true`, which prevents click-to-dismiss. The `isBlocking` slot prop reflects this state so you can style the backdrop differently while blocking.

??? Do I need to install the stack plugin?

Only for SSR. Client-side-only apps can skip it — Scrim falls back to the default `stack` singleton automatically.

??? How do I stop the scrim from teleporting to `<body>`?

Pass `:teleport="false"` to render it inline within its parent, for example inside a `relative` container for a scoped overlay.

:::

<DocsApi />
