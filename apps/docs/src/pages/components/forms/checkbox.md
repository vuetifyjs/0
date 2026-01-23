---
title: Checkbox - Accessible Checkbox Controls
meta:
- name: description
  content: Headless checkbox component with dual-mode support. Standalone boolean v-model or group multi-selection with tri-state, batch operations, and full ARIA compliance.
- name: keywords
  content: checkbox, toggle, form control, multi-select, tri-state, indeterminate, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Checkbox'
  level: 2
  github: /components/Checkbox/
related:
  - /composables/selection/create-group
  - /components/providers/group
---

<script setup>
import BasicExample from '@/examples/components/checkbox/basic.vue'
import BasicExampleRaw from '@/examples/components/checkbox/basic.vue?raw'
import GroupExample from '@/examples/components/checkbox/group.vue'
import GroupExampleRaw from '@/examples/components/checkbox/group.vue?raw'
import IndeterminateExample from '@/examples/components/checkbox/indeterminate.vue'
import IndeterminateExampleRaw from '@/examples/components/checkbox/indeterminate.vue?raw'
</script>

# Checkbox

A headless checkbox component with dual-mode support: standalone boolean binding or group multi-selection with tri-state.

<DocsPageFeatures :frontmatter />

## Usage

The Checkbox component supports two modes:

- **Standalone mode**: Use `v-model` on `Checkbox.Root` for simple boolean state
- **Group mode**: Wrap in `Checkbox.Group` for multi-selection with array v-model

<DocsExample file="basic.vue" :code="BasicExampleRaw" peek>
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

  <!-- Group with Select All -->
  <Checkbox.Group>
    <Checkbox.SelectAll>
      <Checkbox.Indicator />
    </Checkbox.SelectAll>

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

<DocsExample file="group.vue" :code="GroupExampleRaw" peek>
  <GroupExample />
</DocsExample>

## Accessibility

The Checkbox.Root component renders as a button and handles all ARIA attributes automatically:

- `role="checkbox"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when checkbox is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space key toggles the checkbox (Enter works when rendered as button)

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

## Form Integration

When the `name` prop is provided on `Checkbox.Root`, a hidden native checkbox is automatically rendered for form submission:

```vue
<template>
  <!-- Auto-renders hidden input for form submission -->
  <Checkbox.Root name="agree" value="yes">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
  </Checkbox.Root>
</template>
```

For custom form integration, use `Checkbox.HiddenInput` explicitly:

```vue
<template>
  <Checkbox.Root>
    <Checkbox.Indicator>✓</Checkbox.Indicator>

    <Checkbox.HiddenInput name="custom" value="override" />
  </Checkbox.Root>
</template>
```

## Indeterminate State

Use `Checkbox.SelectAll` within a group for "select all" patterns. It automatically reflects the group's aggregate state and toggles all items on click:

<DocsExample file="indeterminate.vue" :code="IndeterminateExampleRaw" peek>
  <IndeterminateExample />
</DocsExample>

The `SelectAll` component:
- Binds to the group's `isAllSelected` and `isMixed` state
- Calls `toggleAll` on click
- Does NOT register as a group item
- Sets `aria-checked="mixed"` and `data-state="indeterminate"` when partially selected

<DocsApi />
