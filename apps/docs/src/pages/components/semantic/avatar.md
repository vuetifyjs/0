---
title: Avatar - Headless Image Component with Fallbacks
meta:
- name: description
  content: Headless avatar component with priority-based image loading and automatic fallback handling. Supports initials, icons, and multi-source images for Vue 3.
- name: keywords
  content: avatar, image, fallback, loading, profile picture, Vue 3, headless, priority loading
features:
  category: Component
  label: 'E: Avatar'
  github: /components/Avatar/
  renderless: false
related:
  - /components/primitives/atom
---

<script setup>
import BasicExample from '@/examples/components/avatar/basic.vue'
import BasicExampleRaw from '@/examples/components/avatar/basic.vue?raw'
</script>

# Avatar

A headless component for managing image loading with priority-based fallback system.

<DocsPageFeatures :frontmatter />

## Usage

The Avatar component provides a robust image loading system with automatic fallback handling. It manages multiple image sources with priority ordering and only displays the highest-priority loaded image or fallback content.

<DocsExample file="basic.vue" title="Avatar with Fallback" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { Avatar } from '@vuetify/v0'
</script>

<template>
  <Avatar.Root>
    <Avatar.Image src="/path/to/image.jpg" />

    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</template>
```

## API

| Component | Description |
|---|---|
| [Atom](/components/atom) | Foundation component used by Avatar components |

| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | Base selection system for managing visibility |

### AvatarRoot

The root component that manages image loading state and fallback logic.

- **Props**

  ```ts
  interface AvatarRootProps extends AtomProps {
    namespace?: string
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:avatar'`)
  - `as`: Element to render as (default: `'div'`)
  - `renderless`: Render only the slot content without a wrapper element

- **Example**

  ```vue AvatarRoot
  <script setup lang="ts">
    import { Avatar } from '@vuetify/v0'
  </script>

  <template>
    <Avatar.Root class="w-12 h-12 rounded-full overflow-hidden">
      <Avatar.Image src="/avatar.jpg" />

      <Avatar.Fallback>AB</Avatar.Fallback>
    </Avatar.Root>
  </template>
  ```

### AvatarImage

Image component that registers with the Avatar context and manages loading state.

- **Props**

  ```ts
  interface AvatarImageProps extends AtomProps {
    src?: string
    priority?: number
    namespace?: string
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

  - `src`: Image source URL
  - `priority`: Priority for display order (higher = more preferred, default: `0`)
  - `namespace`: Namespace for dependency injection (default: `'v0:avatar'`)
  - `as`: Element to render as (default: `'img'`)
  - `renderless`: Render only the slot content without a wrapper element

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `load` | `Event` | Emitted when the image loads successfully |
  | `error` | `Event` | Emitted when the image fails to load |

- **Slot Props**

  ```ts
  interface AvatarImageSlotProps {
    isSelected: boolean
    attrs: {
      role: 'img'
      src?: string
      onLoad: (e: Event) => void
      onError: (e: Event) => void
    }
  }
  ```

  - `isSelected`: Whether this image is currently visible
  - `attrs`: Object containing attributes to bind to the image element

- **Example**

  ```vue AvatarImage
  <script setup lang="ts">
    import { Avatar } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Avatar.Image src="/avatar.jpg" />

    <!-- With priority (higher priority images preferred) -->
    <Avatar.Image src="/high-res.jpg" :priority="10" />
    <Avatar.Image src="/low-res.jpg" :priority="1" />

    <!-- Renderless with custom element -->
    <Avatar.Image src="/avatar.jpg" renderless v-slot="{ attrs, isSelected }">
      <img v-bind="attrs" v-show="isSelected" class="object-cover" />
    </Avatar.Image>
  </template>
  ```

### AvatarFallback

Fallback content component shown when no images are loaded.

- **Props**

  ```ts
  interface AvatarFallbackProps extends AtomProps {
    namespace?: string
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:avatar'`)
  - `as`: Element to render as (default: `'span'`)
  - `renderless`: Render only the slot content without a wrapper element

- **Slot Props**

  ```ts
  interface AvatarFallbackSlotProps {
    isSelected: boolean
  }
  ```

  - `isSelected`: Whether this fallback is currently visible

- **Example**

  ```vue AvatarFallback
  <script setup lang="ts">
    import { Avatar } from '@vuetify/v0'
  </script>

  <template>
    <!-- Text initials -->
    <Avatar.Fallback>JD</Avatar.Fallback>

    <!-- Icon fallback -->
    <Avatar.Fallback>
      <UserIcon class="w-6 h-6" />
    </Avatar.Fallback>

    <!-- Conditional styling -->
    <Avatar.Fallback v-slot="{ isSelected }">
      <span v-if="isSelected" class="bg-gray-200 flex items-center justify-center">
        JD
      </span>
    </Avatar.Fallback>
  </template>
  ```

## Priority System

The Avatar component uses a priority-based system to determine which content to display:

1. Images register with a `priority` value (default: `0`)
2. Fallbacks register with the lowest implicit priority
3. When an image loads successfully, it becomes selectable
4. The highest-priority loaded image is displayed
5. If all images fail, the fallback is shown

```vue PriorityExample
<template>
  <Avatar.Root>
    <!-- High-res preferred when available -->
    <Avatar.Image src="/high-res.jpg" :priority="10" />
    <!-- Low-res as backup -->
    <Avatar.Image src="/low-res.jpg" :priority="1" />
    <!-- Fallback if both fail -->
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</template>
```

