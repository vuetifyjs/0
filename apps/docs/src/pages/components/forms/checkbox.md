---
title: Checkbox - Accessible Checkbox Controls
meta:
- name: description
  content: Headless checkbox component with dual-mode support. Standalone boolean v-model or group multi-selection with tri-state, batch operations, and full ARIA compliance.
- name: keywords
  content: checkbox, toggle, form control, multi-select, tri-state, indeterminate, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'E: Checkbox'
  github: /components/Checkbox/
related:
  - /composables/selection/use-group
  - /components/providers/group
---

<script setup>
import BasicExample from '@/examples/components/checkbox/basic.vue'
import BasicExampleRaw from '@/examples/components/checkbox/basic.vue?raw'
import GroupExample from '@/examples/components/checkbox/group.vue'
import GroupExampleRaw from '@/examples/components/checkbox/group.vue?raw'
</script>

# Checkbox

A headless checkbox component with dual-mode support: standalone boolean binding or group multi-selection with tri-state.

<DocsPageFeatures :frontmatter />

## Usage

The Checkbox component supports two modes:

- **Standalone mode**: Use `v-model` on `Checkbox.Root` for simple boolean state
- **Group mode**: Wrap in `Checkbox.Group` for multi-selection with array v-model

<DocsExample file="basic.vue" title="Standalone Checkbox" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'
</script>

<template>
  <!-- Standalone -->
  <Checkbox.Root>
    <Checkbox.Indicator />
  </Checkbox.Root>

  <!-- Group -->
  <Checkbox.Group>
    <Checkbox.Root>
      <Checkbox.Indicator />
    </Checkbox.Root>

    <Checkbox.Root>
      <Checkbox.Indicator />
    </Checkbox.Root>
  </Checkbox.Group>

  <!-- With form submission -->
  <Checkbox.Root>
    <Checkbox.Indicator />

    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
```

## Group Mode

Wrap checkboxes in `Checkbox.Group` for multi-selection with array-based v-model:

<DocsExample file="group.vue" title="Checkbox Group" :code="GroupExampleRaw">
  <GroupExample />
</DocsExample>

## Accessibility

The Checkbox.Root component renders as a button and handles all ARIA attributes automatically:

- `role="checkbox"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when checkbox is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space and Enter keys toggle the checkbox

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Checkbox.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom checkbox visual -->
    </div>
  </Checkbox.Root>
</template>
```

<DocsApi />
