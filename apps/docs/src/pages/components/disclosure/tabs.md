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
  - /composables/selection/create-step
  - /components/disclosure/expansion-panel
  - /components/disclosure/dialog
---

# Tabs

A component for creating accessible tabbed interfaces with proper ARIA support and keyboard navigation.

<DocsPageFeatures :frontmatter />

## Usage

The Tabs component provides a compound pattern for building accessible tab interfaces. It uses the `createStep` composable internally for navigation and provides full v-model support with automatic state synchronization.

::: example
/components/tabs/basic

### Tab Navigation

Profile, password, and billing tabs with content switching via v-model binding.

:::

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

## Features

### Keyboard Navigation

The component implements full WAI-ARIA keyboard support. Keyboard behavior depends on the activation mode:

| Key | Automatic | Manual |
| - | - | - |
| Arrow Left/Right (horizontal) | Moves focus **and** activates tab | Moves focus only |
| Arrow Up/Down (vertical) | Moves focus **and** activates tab | Moves focus only |
| Home | Focuses **and** activates first tab | Focuses first tab only |
| End | Focuses **and** activates last tab | Focuses last tab only |
| Enter/Space | — | Activates the focused tab |

### Activation Modes

Control when tabs activate with the `activation` prop:

- **automatic** (default): Arrow keys move focus and activate the tab simultaneously
- **manual**: Arrow keys move focus without activating — the user must press Enter or Space to confirm their selection

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

### Auto-Enrollment

Set `enroll` to auto-select the first registered tab. Useful when tabs are rendered dynamically and the initial selection should track whichever tab mounts first:

```vue
<template>
  <Tabs.Root enroll>
    <!-- First tab to register is automatically selected -->
    <Tabs.Tab v-for="tab in dynamicTabs" :key="tab.id" :value="tab.id">
      {{ tab.label }}
    </Tabs.Tab>
  </Tabs.Root>
</template>
```

<DocsApi />
