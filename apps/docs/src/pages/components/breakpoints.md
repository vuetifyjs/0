---
meta:
  title: Breakpoints
  description: A component for managing responsive breakpoints and providing breakpoint-related information.
  keywords: breakpoints, responsive, vuetify0, component
category: Component
performance: 0
---

# Breakpoints Component

## Description

The `Breakpoints` component in Vuetify0 provides a way to manage and react to different screen sizes and device orientations. It leverages the `useBreakpoints` composable to expose reactive properties related to the current breakpoint, allowing you to build responsive layouts and adapt your UI based on the user's device.

## API

### Props

- **`name`**: `string`
  - The name of the breakpoint context.
- **`width`**: `number`
  - The current width of the viewport.
- **`height`**: `number`
  - The current height of the viewport.
- **`isMobile`**: `boolean`
  - Indicates if the current viewport is considered a mobile device.
- **`xs`**: `boolean`
  - Indicates if the current viewport is within the 'extra small' breakpoint.
- **`sm`**: `boolean`
  - Indicates if the current viewport is within the 'small' breakpoint.
- **`md`**: `boolean`
  - Indicates if the current viewport is within the 'medium' breakpoint.
- **`lg`**: `boolean`
  - Indicates if the current viewport is within the 'large' breakpoint.
- **`xl`**: `boolean`
  - Indicates if the current viewport is within the 'extra large' breakpoint.
- **`xxl`**: `boolean`
  - Indicates if the current viewport is within the 'double extra large' breakpoint.

### Slots

- **`default`**: `(scope: BreakpointsContext) => any`
  - The default slot provides access to the `BreakpointsContext` object, which contains all the reactive breakpoint properties. This allows you to conditionally render content or apply styles based on the current breakpoint.

### Events

There are no specific events emitted by the `Breakpoints` component.

## Examples

### Basic Usage with Breakpoint Information

```vue
<template>
  <Breakpoints>
    <template #default="{ xs, sm, md, lg, xl, xxl, width, height, isMobile }">
      <div>
        <p>Current Width: {{ width }}px</p>
        <p>Current Height: {{ height }}px</p>
        <p>Is Mobile: {{ isMobile }}</p>
        <p v-if="xs">Extra Small Screen</p>
        <p v-if="sm">Small Screen</p>
        <p v-if="md">Medium Screen</p>
        <p v-if="lg">Large Screen</p>
        <p v-if="xl">Extra Large Screen</p>
        <p v-if="xxl">Double Extra Large Screen</p>
      </div>
    </template>
  </Breakpoints>
</template>

<script setup lang="ts">
import { Breakpoints } from '@vuetify/0/components/Breakpoints';
</script>
```

### Conditional Rendering based on Breakpoint

```vue
<template>
  <Breakpoints>
    <template #default="{ mdAndUp }">
      <div v-if="mdAndUp">
        This content is visible on medium screens and larger.
      </div>
      <div v-else>
        This content is visible on screens smaller than medium.
      </div>
    </template>
  </Breakpoints>
</template>

<script setup lang="ts">
import { Breakpoints } from '@vuetify/0/components/Breakpoints';
</script>
```

