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
  - /composables/selection/create-selection
  - /components/disclosure/popover
---

# ExpansionPanel

A component for creating accordion-style expansion panels with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The ExpansionPanel component provides a wrapper and item pattern for managing expansion state in accordion-style interfaces. It uses the `createSelection` composable internally and provides full v-model support with automatic state synchronization.

::: example
/components/expansion-panel/basic

### Accordion Panels

Multiple expandable panels with accordion behavior and a multi-expand mode that allows several panels open at once.

:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Group>
    <ExpansionPanel.Root>
      <ExpansionPanel.Activator>
        <ExpansionPanel.Cue />
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content />
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>
</template>
```

For instances where you need to wrap the activator in a heading element **(h3)** for semantic purposes and WAI-ARIA, use the [ExpansionPanel.Header](#expansionpanelheader) component:

```vue AnatomyWithHeader playground
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Group>
    <ExpansionPanel.Root>
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator>
          <ExpansionPanel.Cue />
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content />
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>
</template>
```

<DocsApi />
