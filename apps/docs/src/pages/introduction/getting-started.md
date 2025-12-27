---
title: Getting Started - Install Vuetify0 Headless UI
meta:
  - name: description
    content: Get started with Vuetify0 headless UI primitives for Vue 3. Install, configure, and build your own design system with unstyled, accessible components.
  - name: keywords
    content: vuetify0, getting started, installation, Vue 3, headless ui, composables, npm, pnpm
related:
  - /guide
  - /composables
  - /components
---

# Get started with Vuetify0

Vuetify0 provides headless UI primitives and composables for Vue 3. Components are unstyled and logic-focused, giving you complete control over styling while handling accessibility, keyboard navigation, and state management.

<DocsPageFeatures :frontmatter />

## Installation

Install `@vuetify/v0` with your preferred package manager:

::: code-group

```bash pnpm
pnpm add @vuetify/v0
```

```bash npm
npm install @vuetify/v0
```

```bash yarn
yarn add @vuetify/v0
```

```bash bun
bun add @vuetify/v0
```

:::

## Requirements

- Vue 3.3.0 or higher
- Node 22+

## Quick Start

Import and use components directly - no plugin installation required:

```vue QuickStart.vue playground
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import { ref } from 'vue'

  const expanded = ref([])
</script>

<template>
  <ExpansionPanel.Root v-model="expanded" multiple>
    <ExpansionPanel.Item value="item-1">
      <ExpansionPanel.Activator>
        Section 1
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content>
        Content for section 1
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

Components are completely unstyled. Add your own classes using Tailwind, UnoCSS, or plain CSS.

## Exposed Exports

The following export paths exist for the Vuetify0 framework:

| Name | Description |
| ---- | ----------- |
| `@vuetify/v0` | Main entry point exposing all components, composables, and utilities. |
| `@vuetify/v0/components` | Components only. |
| `@vuetify/v0/composables` | Composables only. |
| `@vuetify/v0/utilities` | Utilities only. |
| `@vuetify/v0/constants` | Constants only (not included in main entry). |

```ts
// Everything
import { ExpansionPanel, useSelection } from '@vuetify/v0'

// Components only
import { ExpansionPanel, Single, Group } from '@vuetify/v0/components'

// Composables only
import { useSelection, useTheme, useForm } from '@vuetify/v0/composables'

// Utilities only
import { isObject, isString } from '@vuetify/v0/utilities'

// Constants only
import { IN_BROWSER } from '@vuetify/v0/constants'
```

## Next Steps

- [Explore Components](/components/) - See all available components
- [Browse Composables](/composables/) - Dive into the composables API
- [View Examples](https://github.com/vuetifyjs/0/tree/master/playground) - Check out the playground

<DocsRelated :frontmatter />
