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
import SelectAllExample from '@/examples/components/checkbox/select-all.vue'
import SelectAllExampleRaw from '@/examples/components/checkbox/select-all.vue?raw'
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
  <Checkbox.Root v-model="checked">
    <Checkbox.Indicator />
  </Checkbox.Root>

  <!-- Group -->
  <Checkbox.Group v-model="selected">
    <Checkbox.Root value="a">
      <Checkbox.Indicator />
    </Checkbox.Root>

    <Checkbox.Root value="b">
      <Checkbox.Indicator />
    </Checkbox.Root>
  </Checkbox.Group>
</template>
```

## Group Mode

Wrap checkboxes in `Checkbox.Group` for multi-selection with array-based v-model:

<DocsExample file="group.vue" title="Checkbox Group" :code="GroupExampleRaw">
  <GroupExample />
</DocsExample>

## Select All Pattern

The Group component exposes helpers for implementing "select all" patterns:

- **`isNoneSelected`**: True when no items are selected
- **`isAllSelected`**: True when all selectable items are selected
- **`isMixed`**: True when some but not all are selected (indeterminate state)
- **`selectAll`**: Selects all non-disabled items
- **`unselectAll`**: Unselects all items
- **`toggleAll`**: Toggles between all selected and none

<DocsExample file="select-all.vue" title="Select All" :code="SelectAllExampleRaw">
  <SelectAllExample />
</DocsExample>

## Accessibility

The Checkbox.Indicator component handles all ARIA attributes automatically:

- `role="checkbox"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when checkbox is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space key toggles the checkbox

The `attrs` slot prop contains all required attributes for custom implementations:

```vue
<Checkbox.Indicator v-slot="{ attrs }">
  <div v-bind="attrs">
    <!-- Custom checkbox visual -->
  </div>
</Checkbox.Indicator>
```

<DocsApi />
