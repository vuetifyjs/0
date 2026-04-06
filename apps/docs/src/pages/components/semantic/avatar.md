---
title: Avatar - Headless Image Component with Fallbacks
meta:
- name: description
  content: Headless avatar component with priority-based image loading and automatic fallback handling. Supports initials, icons, and multi-source images for Vue 3.
- name: keywords
  content: avatar, image, fallback, loading, profile picture, Vue 3, headless, priority loading
features:
  category: Component
  label: 'C: Avatar'
  github: /components/Avatar/
  renderless: false
  level: 2
related:
  - /components/primitives/atom
---

# Avatar

Headless image component with automatic fallback to icon or text content.

<DocsPageFeatures :frontmatter />

## Usage

The Avatar component provides a robust image loading system with automatic fallback handling. It manages multiple image sources with priority ordering and only displays the highest-priority loaded image or fallback content.

::: example
/components/avatar/basic

### Image and Fallback

Two avatars showing successful image loading and graceful fallback to initials when the image fails.

:::

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

## Architecture

The Avatar uses an internal selection system with `mandatory: 'force'` to ensure exactly one element is always visible. Images register as disabled until they load successfully.

```mermaid "Image/Fallback Flow"
flowchart TD
  subgraph Root["Avatar.Root"]
    Selection["Selection Context<br/>(mandatory: force)"]
  end

  subgraph Image["Avatar.Image"]
    Register["Register<br/>(disabled: true)"]
    Load{Load Event}
    Error{Error Event}
  end

  subgraph Fallback["Avatar.Fallback"]
    FallbackReg["Register<br/>(enabled)"]
  end

  Root --> Image
  Root --> Fallback

  Register --> Load
  Register --> Error

  Load -->|"disabled = false<br/>select()"| Visible["Image Visible"]
  Error -->|"disabled = true<br/>seek('first')"| FallbackVisible["Fallback Visible"]

  FallbackReg -->|"Selected by default<br/>until image loads"| FallbackVisible
```

### Priority System

When multiple images are present, the `priority` prop determines display order. Higher priority images are preferred when loaded:

```vue
<template>
  <Avatar.Root>
    <!-- Preferred when loaded -->
    <Avatar.Image src="/high-res.jpg" :priority="1" />

    <!-- Fallback image -->
    <Avatar.Image src="/low-res.jpg" :priority="0" />

    <!-- Text fallback -->
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</template>
```

<DocsApi />
