---
meta:
  title: Hydration
  description: A component for managing the hydration state of a Vue application, ensuring proper server-side rendering and client-side re-engagement.
  keywords: hydration, vuetify0, component, server-side rendering, SSR
category: Component
performance: 0
---

# Hydration Component

## Description

The `Hydration` component in Vuetify0 is crucial for applications utilizing Server-Side Rendering (SSR). It provides a mechanism to manage the hydration process, which involves re-using the server-rendered HTML on the client-side and attaching interactivity. This ensures a smooth transition from a static server-rendered page to a fully interactive Vue application.

## API

### Props

There are no specific props for the `Hydration` component itself, as its primary function is to provide context for hydration.

### Slots

- **`default`**: `(scope: HydrationContext) => any`
  - The default slot provides access to the `HydrationContext` object. This context can contain information or utilities related to the hydration process, allowing child components to react to or participate in hydration.

### Events

There are no specific events emitted by the `Hydration` component.

## Examples

### Basic Hydration Usage

```vue
<template>
  <Hydration>
    <template #default="{ isHydrated }">
      <div v-if="isHydrated">
        This content is hydrated and interactive.
      </div>
      <div v-else>
        This content is server-rendered and awaiting hydration.
      </div>
    </template>
  </Hydration>
</template>

<script setup lang="ts">
import { Hydration } from '@vuetify/0/components/Hydration';
</script>
```

### Hydration with Nested Components

```vue
<template>
  <Hydration>
    <MyInteractiveComponent />
  </Hydration>
</template>

<script setup lang="ts">
import { Hydration } from '@vuetify/0/components/Hydration';
import { inject } from 'vue';

const MyInteractiveComponent = {
  setup() {
    const hydrationContext = inject('hydrationContext'); // Assuming 'hydrationContext' is the key provided by Hydration
    // Use hydrationContext to determine if component is hydrated
    return {};
  },
  template: `<div>Interactive content inside Hydration.</div>`,
};
</script>
```

