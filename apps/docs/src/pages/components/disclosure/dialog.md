---
title: Dialog - Modal dialog component for Vue 3
meta:
- name: description
  content: Build modal dialogs using the native HTML dialog element. Focus trapping, backdrop, escape key, and full ARIA support built-in.
- name: keywords
  content: dialog, modal, overlay, Vue 3, headless, accessibility, ARIA, focus trap
features:
  category: Component
  label: 'E: Dialog'
  github: /components/Dialog/
  renderless: false
  level: 2
related:
  - /components/disclosure/popover
  - /components/disclosure/expansion-panel
---

<script setup>
  import BasicExample from '@/examples/components/dialog/basic.vue'
  import BasicExampleRaw from '@/examples/components/dialog/basic.vue?raw'
</script>

# Dialog

A headless modal dialog component using the native HTML dialog element.

<DocsPageFeatures :frontmatter />

## Usage

The Dialog component leverages the native `showModal()` API for proper modal behavior including focus trapping, backdrop rendering, and escape key handling. It provides v-model support for open/closed state management.

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Dialog } from '@vuetify/v0'
</script>

<template>
  <Dialog.Root>
    <Dialog.Activator />

    <Dialog.Content>
      <Dialog.Title />

      <Dialog.Description />

      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Root>
</template>
```

<DocsApi />
