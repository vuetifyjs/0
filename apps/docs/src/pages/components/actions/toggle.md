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

::: gn-example
/components/toggle/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
</script>

<template>
  <Toggle.Root>
    <Toggle.Indicator />
  </Toggle.Root>

  <Toggle.Group>
    <Toggle.Root />
  </Toggle.Group>
</template>
```

## Examples

::: gn-example
/components/toggle/useEditorFormat.ts 1
/components/toggle/FormatToolbar.vue 2
/components/toggle/format-toolbar.vue 3

### Formatting toolbar

This editor toolbar combines both group modes in one surface. The bold/italic/underline marks use a `Toggle.Group` with `multiple`, so any combination can be active at once and its `v-model` is an array of pressed values. Text alignment uses a second `Toggle.Group` without `multiple` but with `mandatory`, so exactly one of left/center/right is always selected and its `v-model` is a single string. A live preview paragraph reflects every choice in real time.

Internally `multiple` switches the group to [createGroup](/composables/selection/create-group) (array model) while the plain group uses [createSingle](/composables/selection/create-single) (single model); `mandatory` makes clicking the active alignment a no-op instead of clearing it, so the preview is never left unaligned. Each `Toggle.Root` carries a `value` selection key, and its pressed state surfaces as `data-state="on"` — the styling here is pure CSS via the `data-[state=on]:` variant, no slot props required. The composable owns the `marks` array and `align` string plus the tool metadata, the reusable component renders the two groups, and the entry composes the preview and a clear action.

Reach for `multiple` when choices are independent and additive, and for `mandatory` single-select when an unselected state is meaningless. Toggle is UI state, not form data — it has no `name` prop and no hidden input, so for values you intend to submit use [Checkbox](/components/forms/checkbox) instead.

| File | Role |
|------|------|
| `useEditorFormat.ts` | Owns the marks/align state, tool metadata, and derived preview classes and summary |
| `FormatToolbar.vue` | Renders the multiple marks group and the mandatory alignment group |
| `format-toolbar.vue` | Wires the composable to the toolbar and renders the live preview |
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
