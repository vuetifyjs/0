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

::: gn-example
/components/step/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Step } from '@vuetify/v0'
</script>

<template>
  <Step.Root>
    <Step.Item />
  </Step.Root>
</template>
```

## Recipes

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

## Accessibility

Step is a headless **state provider**, not a complete interactive widget. It tracks the active item and exposes sequential navigation methods (`first`, `last`, `next`, `prev`, `step`) plus per-item state on each slot's `attrs`; it ships pointer activation (a click handler) but no `role`, keyboard navigation, or focus management.

- `Step.Root` exposes `aria-multiselectable="false"` — single-selection.
- `Step.Item` exposes `aria-selected` and `aria-disabled`, plus `data-selected` and `data-disabled` for styling.

This is single-selection navigation state. For a fully accessible tabbed stepper — `role="tablist"` / `role="tab"`, arrow-key navigation, and roving `tabindex` — use [Tabs](/components/disclosure/tabs), which composes the same step logic. When you bind `attrs` to your own element, you are responsible for wiring the navigation methods to keyboard handlers and supplying the roles the pattern requires.

## FAQ

::: faq

??? What's the difference between Step and [Single](/components/providers/single)?

Step extends Single, adding navigation methods (`first`, `last`, `next`, `prev`, `step`) for moving through an ordered sequence. Use Step for wizards and steppers; use Single when you only need single-selection without traversal.

??? How do I skip a step conditionally?

Mark the `Step.Item` as `:disabled` — `next`, `prev`, and `step` automatically skip disabled items, so you can hide steps based on form state.

??? Can I jump more than one step at a time?

Yes. `step(n)` moves by count — `step(2)` advances two steps and `step(-1)` goes back one, skipping any disabled items along the way.

:::

<DocsApi />
