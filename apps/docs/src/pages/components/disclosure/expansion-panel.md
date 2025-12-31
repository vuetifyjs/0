---
title: ExpansionPanel - Accessible Accordion for Vue 3
meta:
- name: description
  content: Accessible accordion and expansion panels with single or multi-expand modes. WAI-ARIA compliant compound component with Header, Activator, and Content slots.
- name: keywords
  content: expansion panel, accordion, collapsible, Vue 3, headless, accessibility, WAI-ARIA, disclosure
features:
  category: Component
  label: 'E: ExpansionPanel'
  github: /components/ExpansionPanel/
  renderless: false
related:
  - /components/disclosure/popover
---

<script setup>
import BasicExample from '@/examples/components/expansion-panel/basic.vue'
import BasicExampleRaw from '@/examples/components/expansion-panel/basic.vue?raw'
import AccordionExample from '@/examples/components/expansion-panel/accordion.vue'
import AccordionExampleRaw from '@/examples/components/expansion-panel/accordion.vue?raw'
import CollapsibleExample from '@/examples/components/expansion-panel/basic.vue'
import CollapsibleExampleRaw from '@/examples/components/expansion-panel/basic.vue?raw'
</script>

# ExpansionPanel

A component for creating accordion-style expansion panels with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The ExpansionPanel component provides a wrapper and item pattern for managing expansion state in accordion-style interfaces. It uses the `useSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" title="Basic ExpansionPanel" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
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

```vue AnatomyWithHeader
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

## Examples

<DocsExample file="collapsible.vue" title="Collapsible (Multi Panel)" :code="CollapsibleExampleRaw">
  <CollapsibleExample />
</DocsExample>

<DocsExample file="accordion.vue" title="Accordion (Single Panel)" :code="AccordionExampleRaw">
  <AccordionExample />
</DocsExample>

