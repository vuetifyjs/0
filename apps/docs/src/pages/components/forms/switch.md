---
title: Switch - Accessible Toggle Controls
meta:
- name: description
  content: Headless switch component with dual-mode support. Standalone boolean v-model or group multi-selection with tri-state, batch operations, and full ARIA compliance.
- name: keywords
  content: switch, toggle, form control, multi-select, tri-state, indeterminate, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Switch'
  level: 2
  github: /components/Switch/
  renderless: false
related:
  - /composables/selection/create-group
  - /components/providers/group
---

# Switch

A headless switch component with dual-mode support: standalone boolean binding or group multi-selection with tri-state.

<DocsPageFeatures :frontmatter />

## Usage

The Switch component supports two modes:

- **Standalone mode**: Use `v-model` on `Switch.Root` for simple boolean state
- **Group mode**: Wrap in `Switch.Group` for multi-selection with array v-model

::: example
/components/switch/basic

### Basic Switch

A standalone boolean switch with label and slide animation.

:::

## Anatomy

```vue Anatomy playground collapse no-filename
<script setup lang="ts">
  import { Switch } from '@vuetify/v0'
</script>

<template>
  <!-- Standalone -->
  <Switch.Root>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Root>

  <!-- Group -->
  <Switch.Group>
    <Switch.Root>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>

    <Switch.Root>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>
  </Switch.Group>

  <!-- Group with Select All -->
  <Switch.Group>
    <Switch.SelectAll>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.SelectAll>

    <Switch.Root>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>
  </Switch.Group>

  <!-- With form submission -->
  <Switch.Root>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>

    <Switch.HiddenInput />
  </Switch.Root>
</template>
```

## Accessibility

The Switch.Root component renders as a button and handles all ARIA attributes automatically:

- `role="switch"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when switch is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space key toggles the switch

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Switch.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom switch visual -->
    </div>
  </Switch.Root>
</template>
```

## Recipes

### Group Mode

Wrap switches in `Switch.Group` for multi-selection with array-based v-model:

::: example
/components/switch/group

### Switch Group

Multi-select switch group managing an array of connectivity options (WiFi, Bluetooth, Location).

:::

### Form Integration

When the `name` prop is provided on `Switch.Root`, a hidden native checkbox is automatically rendered for form submission:

```vue
<template>
  <!-- Auto-renders hidden input for form submission -->
  <Switch.Root name="notifications" value="on">
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Root>
</template>
```

For custom form integration, use `Switch.HiddenInput` explicitly:

```vue
<template>
  <Switch.Root>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>

    <Switch.HiddenInput name="custom" value="override" />
  </Switch.Root>
</template>
```

### Indeterminate State

Use `Switch.SelectAll` within a group for "select all" patterns. It automatically reflects the group's aggregate state and toggles all items on click:

::: example
/components/switch/indeterminate

### Select-All Switch

A "select all" switch with indeterminate state over nested permission toggles.

:::

The `SelectAll` component:
- Binds to the group's `isAllSelected` and `isMixed` state
- Calls `toggleAll` on click
- Does NOT register as a group item
- Sets `aria-checked="mixed"` and `data-state="indeterminate"` when partially selected

### Styling with Data Attributes

Switch components expose `data-state` attributes for CSS styling:

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-state` | `checked`, `unchecked`, `indeterminate` | Root, Track, Thumb |
| `data-disabled` | `true` | Root |

```vue
<template>
  <Switch.Root class="...">
    <Switch.Track class="bg-gray-300 data-[state=checked]:bg-primary">
      <Switch.Thumb class="translate-x-0.5 data-[state=checked]:translate-x-5.5" />
    </Switch.Track>
  </Switch.Root>
</template>
```

<DocsApi />
