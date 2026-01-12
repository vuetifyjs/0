---
title: Step - Wizard and Stepper Navigation for Vue 3
meta:
- name: description
  content: Navigate multi-step processes with first, last, next, and prev methods. Build form wizards and steppers with automatic disabled item skipping for Vue 3.
- name: keywords
  content: step, wizard, stepper, multi-step form, navigation, carousel, Vue 3, headless
features:
  category: Component
  label: 'E: Step'
  github: /components/Step/
  renderless: true
  level: 2
related:
  - /composables/selection/create-step
  - /components/providers/single
---

<script setup>
import BasicExample from '@/examples/components/step/basic.vue'
import BasicExampleRaw from '@/examples/components/step/basic.vue?raw'
</script>

# Step

A headless component for navigation through multi-step processes like wizards and forms.

<DocsPageFeatures :frontmatter />

## Usage

The Step component extends Single with navigation methods for moving through a sequence of items. It provides methods for first, last, next, previous, and step-by-count navigation with automatic disabled item skipping.

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Step } from '@vuetify/v0'
</script>

<template>
  <Step.Root>
    <Step.Item value="step-1" />

    <Step.Item value="step-2" />
  </Step.Root>
</template>
```

<DocsApi />
