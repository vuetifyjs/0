---
title: Tabs - Accessible Tab Navigation for Vue 3
meta:
- name: description
  content: Accessible tab navigation with automatic and manual activation modes. WAI-ARIA compliant compound component with roving tabindex and keyboard navigation.
- name: keywords
  content: tabs, tab panel, navigation, Vue 3, headless, accessibility, WAI-ARIA, roving tabindex
features:
  category: Component
  label: 'C: Tabs'
  github: /components/Tabs/
  renderless: false
  level: 2
related:
  - /components/disclosure/expansion-panel
  - /components/disclosure/dialog
---

<script setup>
import BasicExample from '@/examples/components/tabs/basic.vue'
import BasicExampleRaw from '@/examples/components/tabs/basic.vue?raw'
</script>

# Tabs

A component for creating accessible tabbed interfaces with proper ARIA support and keyboard navigation.

<DocsPageFeatures :frontmatter />

## Usage

The Tabs component provides a compound pattern for building accessible tab interfaces. It uses the `createStep` composable internally for navigation and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" :code="BasicExampleRaw" peek>
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground no-filename
<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
</script>

<template>
  <Tabs.Root>
    <Tabs.List>
      <Tabs.Item>Tab</Tabs.Item>
    </Tabs.List>

    <Tabs.Panel>Content</Tabs.Panel>
  </Tabs.Root>
</template>
```

<DocsApi />

## Features

### Keyboard Navigation

The component implements full WAI-ARIA keyboard support:

- **Arrow Left/Right** (horizontal) or **Arrow Up/Down** (vertical): Navigate between tabs
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Enter/Space**: Activate tab (in manual mode)

### Activation Modes

Control when tabs activate with the `activation` prop:

- **automatic** (default): Tab activates when focused via arrow keys
- **manual**: Tab only activates on Enter/Space key press

```vue
<template>
  <Tabs.Root activation="manual">
    <!-- Tabs only activate on Enter/Space -->
  </Tabs.Root>
</template>
```

### Orientation

Support for both horizontal and vertical tab layouts:

```vue
<template>
  <Tabs.Root orientation="vertical">
    <!-- Arrow Up/Down for navigation instead of Left/Right -->
  </Tabs.Root>
</template>
```

### Circular Navigation

Control whether navigation wraps around at boundaries:

```vue
<template>
  <Tabs.Root :circular="false">
    <!-- Navigation stops at first/last tab -->
  </Tabs.Root>
</template>
```
