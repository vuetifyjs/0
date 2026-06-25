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

::: gn-example
/components/expansion-panel/basic
:::

## Anatomy

```vue Anatomy no-filename
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

## Examples

::: gn-example
/components/expansion-panel/useFaq.ts 1
/components/expansion-panel/FaqAccordion.vue 2
/components/expansion-panel/faq-accordion.vue 3

### Product FAQ accordion

This FAQ widget renders an accordion from a plain data array, mapping each entry to an `ExpansionPanel.Root` keyed by its question id. The `ExpansionPanel.Group` defaults to single-open mode, so opening one answer collapses the previous one — its `v-model` holds the id of the open panel, or `undefined` when every panel is closed. The composable seeds that model with the first question's id, so the accordion shows one answer on mount instead of opening empty.

Each `ExpansionPanel.Header` renders a heading that wraps the `ExpansionPanel.Activator` button — the WAI-ARIA accordion shape that lets screen-reader users jump between questions by heading. The chevron is an `ExpansionPanel.Cue`, which emits `data-state="open"` and `data-state="closed"` on its element; the example rotates it with the `data-[state=open]:rotate-180` utility, no JavaScript class toggling. `ExpansionPanel.Content` shows and hides with the native `hidden` attribute, keeping the markup accessible and the example free of custom CSS.

Reach for single-open mode when answers are long and you want the reader focused on one at a time; add `multiple` to `ExpansionPanel.Group` — and switch the model to an array — when panels are short and comparing them side by side matters. The Group is built on [createSelection](/composables/selection/create-selection), so the same mandatory and enroll options apply. For a single standalone disclosure with no sibling coordination, prefer [Collapsible](/components/disclosure/collapsible).

| File | Role |
|------|------|
| `useFaq.ts` | FAQ data array, the single-open model seeded to the first question, and a collapse helper |
| `FaqAccordion.vue` | Renders the ExpansionPanel compound — Group, Header, Activator, animated Cue, and Content |
| `faq-accordion.vue` | Wires the composable to the accordion and adds the status line and collapse control |
:::

<DocsApi />
