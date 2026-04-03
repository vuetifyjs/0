---
title: Tour - Guided Tour Component for Vue 3
meta:
- name: description
  content: Headless guided tour component for Vue 3 with step navigation, validation gates, keyboard support, and activator highlighting. Fully customizable and accessible.
- name: keywords
  content: tour, guided tour, onboarding, walkthrough, tooltip, Vue 3, headless, accessibility
features:
  category: Component
  label: 'C: Tour'
  github: /components/Tour/
  renderless: false
  level: 2
related:
  - /components/disclosure/dialog
  - /components/disclosure/popover
  - /composables/plugins/use-tour
---

# Tour

A headless guided tour component for building onboarding flows, feature walkthroughs, and contextual help.

<DocsPageFeatures :frontmatter />

## Usage

The Tour component composes step navigation, activator tracking, and overlay management into a compound component pattern. Install the plugin, register steps, and wrap target elements with activators.

::: example
/components/tour/basic
:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Tour } from '@vuetify/v0'
</script>

<template>
  <Tour.Highlight />

  <Tour.Root>
    <Tour.Content>
      <Tour.Title />

      <Tour.Description />

      <Tour.Progress />

      <Tour.Prev />

      <Tour.Next />

      <Tour.Skip />
    </Tour.Content>
  </Tour.Root>

  <Tour.Activator />

  <Tour.Keyboard />
</template>
```

## Step Types

| Type | Behavior |
| - | - |
| `tooltip` | Anchored to an activator element (default) |
| `dialog` | Centered overlay, no activator needed |
| `floating` | Positioned freely, no activator anchoring |
| `wait` | Blocks navigation until `tour.ready()` is called |

## Accessibility

- Tour content uses `role="dialog"` with `aria-modal="true"`
- Title and description linked via `aria-labelledby` and `aria-describedby`
- Navigation buttons have descriptive `aria-label` attributes
- Progress uses `role="status"` for screen reader announcements
- Keyboard navigation via `TourKeyboard` (arrow keys + escape)

<DocsApi />
