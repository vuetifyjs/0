---
title: Radio - Accessible Radio Button Controls
meta:
- name: description
  content: Headless radio button component for Vue 3 single-selection groups. Features keyboard navigation, roving tabindex, and complete ARIA compliance.
- name: keywords
  content: radio, radio button, form control, single-select, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'E: Radio'
  level: 2
  github: /components/Radio/
related:
  - /composables/selection/use-single
  - /components/providers/single
  - /components/forms/checkbox
---

<script setup>
import GroupExample from '@/examples/components/radio/group.vue'
import GroupExampleRaw from '@/examples/components/radio/group.vue?raw'
import MandatoryExample from '@/examples/components/radio/mandatory.vue'
import MandatoryExampleRaw from '@/examples/components/radio/mandatory.vue?raw'
</script>

# Radio

A headless radio button component for single-selection groups with keyboard navigation and roving tabindex.

<DocsPageFeatures :frontmatter />

## Usage

Radio buttons must be used within a `Radio.Group`. Use `v-model` on the group to bind the selected value:

<DocsExample file="group.vue" :code="GroupExampleRaw">
  <GroupExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Radio } from '@vuetify/v0'
</script>

<template>
  <Radio.Group>
    <Radio.Root>
      <Radio.Indicator />
    </Radio.Root>

    <Radio.Root>
      <Radio.Indicator />
    </Radio.Root>
  </Radio.Group>

  <!-- With form submission -->
  <Radio.Group>
    <Radio.Root>
      <Radio.Indicator />

      <Radio.HiddenInput />
    </Radio.Root>

    <Radio.Root>
      <Radio.Indicator />

      <Radio.HiddenInput />
    </Radio.Root>
  </Radio.Group>
</template>
```

## Auto-Select First Option

Radio groups are inherently mandatory—once a selection is made, it can only be changed, not cleared. Use `mandatory="force"` to automatically select the first non-disabled option on mount:

<DocsExample file="mandatory.vue" :code="MandatoryExampleRaw">
  <MandatoryExample />
</DocsExample>

## Accessibility

The Radio components handle all ARIA attributes automatically:

- `role="radiogroup"` on the Group
- `role="radio"` on each Root
- `aria-checked` reflects checked state
- `aria-disabled` when radio is disabled
- `aria-required` for form validation (set on Group)
- `aria-label` from the `label` prop
- Roving `tabindex` - only the selected radio (or first if none) is tabbable
- Space key selects the focused radio
- Arrow keys navigate between radios

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Radio.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom radio visual -->
    </div>
  </Radio.Root>
</template>
```

## Keyboard Navigation

Arrow keys provide circular navigation within a radio group:

| Key | Action |
|-----|--------|
| `Space` | Select focused radio |
| `ArrowUp` / `ArrowLeft` | Move to previous radio |
| `ArrowDown` / `ArrowRight` | Move to next radio |

Navigation automatically skips disabled items and wraps around.

## Form Integration

Set the `name` prop on `Radio.Group` to enable form submission for all radios in the group:

```vue
<template>
  <Radio.Group v-model="selected" name="size">
    <Radio.Root value="small">
      <Radio.Indicator />
      Small
    </Radio.Root>

    <Radio.Root value="large">
      <Radio.Indicator />
      Large
    </Radio.Root>
  </Radio.Group>
</template>
```

Each `Radio.Root` automatically renders a hidden native radio input with the shared `name` and its own `value`.

For custom form integration, use `Radio.HiddenInput` explicitly:

```vue
<template>
  <Radio.Group>
    <Radio.Root value="a">
      <Radio.Indicator />

      <Radio.HiddenInput name="custom" value="override" />
    </Radio.Root>
  </Radio.Group>
</template>
```

<DocsApi />
