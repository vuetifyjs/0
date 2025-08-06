---
meta:
  title: Popover
  description: A component for displaying contextual overlays, such as tooltips, dropdowns, or menus.
  keywords: popover, vuetify0, component, tooltip, dropdown, menu
category: Component
performance: 0
---

# Popover Component

## Description

The `Popover` component in Vuetify0 provides a flexible and accessible way to display contextual overlays. It can be used for various purposes, including tooltips, dropdown menus, and more complex interactive elements that appear on top of other content. The `Popover` component consists of an `Anchor` (the element that triggers the popover) and `Content` (the actual popover display).

## API

### Props

- **`id`**: `string`
  - A unique identifier for the popover, used for accessibility and internal state management.
- **`isActive`**: `ShallowRef<boolean>`
  - A reactive property indicating whether the popover is currently open or closed.

### Slots

- **`default`**
  - The default slot for the `PopoverRoot` component, which typically contains the `PopoverAnchor` and `PopoverContent` components.

### Events

- **`toggle`**: `() => void`
  - A function provided by the `PopoverContext` to programmatically open or close the popover.

## Examples

### Basic Popover with Click Trigger

```vue
<template>
  <Popover>
    <PopoverAnchor>
      <button>Click Me</button>
    </PopoverAnchor>
    <PopoverContent>
      <div>This is the popover content!</div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverAnchor, PopoverContent } from '@vuetify/0/components/Popover';
</script>
```

### Popover with Custom Content and Toggle Functionality

```vue
<template>
  <Popover>
    <PopoverAnchor>
      <button @click="toggle">Toggle Popover</button>
    </PopoverAnchor>
    <PopoverContent>
      <div>
        <h2>My Custom Popover</h2>
        <p>This popover can be controlled programmatically.</p>
        <button @click="toggle">Close</button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverAnchor, PopoverContent } from '@vuetify/0/components/Popover';
import { usePopoverContext } from '@vuetify/0/composables/usePopover'; // Assuming this composable exists

const { toggle } = usePopoverContext();
</script>
```

