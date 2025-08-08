---
meta:
  title: Avatar
  description: A component for displaying user avatars or other circular images.
  keywords: avatar, vuetify0, component, user profile
category: Component
performance: 0
---

# Avatar Component

## Description

The `Avatar` component in Vuetify0 is used to display circular images, typically representing user profiles, but can also be used for other visual elements requiring a circular shape. It provides options for displaying images, fallback content, and managing loading states.

## API

### Props

- **`type`**: `"image" | "fallback"`
  - Specifies the type of content the avatar displays. Can be either an image or a fallback (e.g., initials or an icon).
- **`priority`**: `number`
  - Determines the loading priority of the avatar, useful for optimizing image loading in lists or grids.
- **`status`**: `"idle" | "loading" | "loaded" | "error"`
  - Indicates the current loading status of the avatar's content.
- **`isVisible`**: `Readonly<ComputedGetter<boolean>>`
  - A computed property indicating whether the avatar is currently visible.

### Slots

- **`default`**
  - The default slot for custom content within the avatar, such as an image or text.

### Events

There are no specific events emitted by the `Avatar` component.

## Examples

### Basic Image Avatar

```vue
<template>
  <Avatar type="image" src="https://example.com/avatar.jpg" />
</template>

<script setup lang="ts">
import { Avatar } from '@vuetify/0/components/Avatar';
</script>
```

### Avatar with Fallback (Initials)

```vue
<template>
  <Avatar type="fallback">
    <span>JD</span>
  </Avatar>
</template>

<script setup lang="ts">
import { Avatar } from '@vuetify/0/components/Avatar';
</script>
```

### Avatar with Loading Status

```vue
<template>
  <Avatar type="image" src="https://example.com/loading-avatar.jpg" status="loading" />
</template>

<script setup lang="ts">
import { Avatar } from '@vuetify/0/components/Avatar';
</script>
```

### Avatar with Custom Content

```vue
<template>
  <Avatar>
    <img src="https://example.com/custom-avatar.png" alt="Custom Avatar" />
  </Avatar>
</template>

<script setup lang="ts">
import { Avatar } from '@vuetify/0/components/Avatar';
</script>
```

