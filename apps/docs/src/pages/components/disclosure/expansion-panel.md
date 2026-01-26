---
title: ExpansionPanel - Accessible Accordion for Vue 3
meta:
- name: description
  content: Accessible accordion and expansion panels with single or multi-expand modes. WAI-ARIA compliant compound component with Header, Activator, and Content slots.
- name: keywords
  content: expansion panel, accordion, collapsible, Vue 3, headless, accessibility, WAI-ARIA, disclosure
features:
  category: Component
  label: 'C: ExpansionPanel'
  github: /components/ExpansionPanel/
  renderless: false
  level: 2
related:
  - /components/disclosure/popover
---

<script setup>
import BasicExample from '@/examples/components/expansion-panel/basic.vue'
import BasicExampleRaw from '@/examples/components/expansion-panel/basic.vue?raw'
</script>

# ExpansionPanel

A component for creating accordion-style expansion panels with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The ExpansionPanel component provides a wrapper and item pattern for managing expansion state in accordion-style interfaces. It uses the `createSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" :code="BasicExampleRaw" peek>
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Root>
    <ExpansionPanel.Item>
      <ExpansionPanel.Activator />

      <ExpansionPanel.Content />
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

For instances where you need to wrap the activator in a heading element **(h3)** for semantic purposes and WAI-ARIA, use the [ExpansionPanel.Header](#expansionpanelheader) component:

```vue AnatomyWithHeader playground
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Root>
    <ExpansionPanel.Item>
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator />
      </ExpansionPanel.Header>

      <ExpansionPanel.Content />
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

<DocsApi />
