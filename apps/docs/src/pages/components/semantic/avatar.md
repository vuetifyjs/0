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

```vue Anatomy playground
<script setup lang="ts">
  import { Avatar } from '@vuetify/v0'
</script>

<template>
  <Avatar.Root>
    <Avatar.Image />

    <Avatar.Fallback />
  </Avatar.Root>
</template>
```

<DocsApi />

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

