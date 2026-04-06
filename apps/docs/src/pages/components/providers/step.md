---
title: Step - Wizard and Stepper Navigation for Vue 3
meta:
- name: description
  content: Navigate multi-step processes with first, last, next, and prev methods. Build form wizards and steppers with automatic disabled item skipping for Vue 3.
- name: keywords
  content: step, wizard, stepper, multi-step form, navigation, carousel, Vue 3, headless
features:
  category: Component
  label: 'C: Step'
  github: /components/Step/
  renderless: true
  level: 2
related:
  - /composables/selection/create-step
  - /components/providers/single
---

# Step

A headless component for navigation through multi-step processes like wizards and forms.

<DocsPageFeatures :frontmatter />

## Usage

The Step component extends Single with navigation methods for moving through a sequence of items. It provides methods for first, last, next, previous, and step-by-count navigation with automatic disabled item skipping.

::: example
/components/step/basic

### Step Wizard

A 3-step wizard with next/previous navigation buttons and per-step content rendering.

:::

## Features

### Navigation Methods

The default slot exposes navigation methods for moving through steps:

```vue
<template>
  <Step.Root v-model="current">
    <template #default="{ first, last, next, prev, step }">
      <Step.Item value="details">Details</Step.Item>
      <Step.Item value="payment">Payment</Step.Item>
      <Step.Item value="confirm">Confirm</Step.Item>

      <button @click="prev">Back</button>
      <button @click="next">Continue</button>

      <!-- Jump by count: step(2) advances two steps, step(-1) goes back one -->
      <button @click="step(2)">Skip ahead</button>
    </template>
  </Step.Root>
</template>
```

### Disabled Item Skipping

Disabled items are automatically skipped by `next`, `prev`, and `step`. Use this to conditionally hide steps based on form state:

```vue
<template>
  <Step.Root v-model="current">
    <Step.Item value="details">Details</Step.Item>

    <!-- Skipped by next/prev when needsShipping is false -->
    <Step.Item value="shipping" :disabled="!needsShipping">Shipping</Step.Item>

    <Step.Item value="confirm">Confirm</Step.Item>
  </Step.Root>
</template>
```

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
