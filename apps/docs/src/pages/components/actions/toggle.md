---
title: Toggle - Pressable On/Off Button
meta:
- name: description
  content: Headless toggle button with standalone boolean v-model or group selection. Single and multi-select modes with ARIA pressed state and data attributes.
- name: keywords
  content: toggle, toggle button, toggle group, on off, pressed, selection, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Toggle'
  level: 2
  github: /components/Toggle/
  renderless: false
related:
  - /composables/selection/create-single
  - /composables/selection/create-group
  - /components/forms/checkbox
  - /components/actions/button
---

# Toggle

A headless toggle button with dual-mode support: standalone boolean binding or group selection with single and multi-select.

<DocsPageFeatures :frontmatter />

## Usage

The Toggle component supports two modes:

- **Standalone mode**: Use `v-model` on `Toggle.Root` for simple boolean on/off state
- **Group mode**: Wrap in `Toggle.Group` for single or multi-select with value-based selection

::: example
/components/toggle/basic
:::

## Anatomy

```vue Anatomy playground collapse no-filename
<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
</script>

<template>
  <!-- Standalone -->
  <Toggle.Root>
    <Toggle.Indicator />
  </Toggle.Root>

  <!-- Group (single select) -->
  <Toggle.Group>
    <Toggle.Root>
      <Toggle.Indicator />
    </Toggle.Root>

    <Toggle.Root>
      <Toggle.Indicator />
    </Toggle.Root>

    <Toggle.Root>
      <Toggle.Indicator />
    </Toggle.Root>
  </Toggle.Group>

  <!-- Group (multi select) -->
  <Toggle.Group multiple>
    <Toggle.Root>
      <Toggle.Indicator />
    </Toggle.Root>

    <Toggle.Root>
      <Toggle.Indicator />
    </Toggle.Root>

    <Toggle.Root>
      <Toggle.Indicator />
    </Toggle.Root>
  </Toggle.Group>
</template>
```

## Examples

### Toolbar

Use `Toggle.Group` with `multiple` to build a formatting toolbar. Each toggle operates independently — any combination can be active.

::: example
/components/toggle/toolbar
:::

### View Switcher

Use `Toggle.Group` with `mandatory` for mutually exclusive options like layout switchers. The `mandatory` prop prevents deselecting all items.

::: example
/components/toggle/view-switcher
:::

## Accessibility

Toggle renders as a native `<button>` element with proper ARIA attributes:

| Attribute | Value | Description |
|-----------|-------|-------------|
| `aria-pressed` | `true` / `false` | Reflects the pressed state |
| `aria-disabled` | `true` / absent | Present when disabled |

### Group ARIA

| Attribute | Value | Description |
|-----------|-------|-------------|
| `role` | `group` | Identifies the toggle group |
| `aria-orientation` | `horizontal` / `vertical` | Layout direction |
| `aria-disabled` | `true` / absent | Present when group is disabled |

### Keyboard

| Key | Action |
|-----|--------|
| `Space` | Toggle pressed state |
| `Enter` | Toggle pressed state (native button behavior) |

### Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-state` | `on` / `off` | CSS styling hook for pressed state |
| `data-disabled` | present / absent | CSS styling hook for disabled state |
| `data-orientation` | `horizontal` / `vertical` | Group orientation (on group element) |

::: faq

??? What is the difference between Toggle and Checkbox?

Toggle is not a form control. It has no `name` prop, no hidden input, and no form submission integration. Use Toggle for UI state (bold/italic toolbar, view switchers) and Checkbox for form data that needs to be submitted.

??? Can I use Toggle.Root without Toggle.Group?

Yes. Standalone Toggle.Root manages a boolean `v-model` and works independently. Toggle.Group is only needed when you want selection coordination across multiple toggles.

??? Why is there no roving focus in Toggle.Group?

Roving focus is a separate concern. Toggle.Group manages selection state. Focus management can be layered on top with a separate composable when needed.

:::

<DocsApi />
