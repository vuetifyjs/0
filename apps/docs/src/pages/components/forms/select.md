---
title: Select - Accessible Dropdown Select for Vue 3
meta:
- name: description
  content: Headless dropdown select component with single and multi-selection, virtual focus keyboard navigation, native popover positioning, and full ARIA compliance.
- name: keywords
  content: select, dropdown, combobox, listbox, form control, Vue 3, headless, accessibility, ARIA
features:
  category: Component
  label: 'C: Select'
  github: /components/Select/
  level: 2
  renderless: false
related:
  - /composables/selection/create-selection
  - /composables/selection/create-group
  - /composables/system/use-virtual-focus
  - /components/disclosure/popover
---

# Select

Headless dropdown select with single and multi-selection, keyboard navigation, and native popover positioning.

<DocsPageFeatures :frontmatter />

## Usage

The Select component provides a compound pattern for building accessible dropdown selects. It supports `v-model` for both single values and arrays (multi-select mode).

::: gn-example
/components/select/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Select } from '@vuetify/v0'
</script>

<template>
  <Select.Root>
    <Select.Activator>
      <Select.Value />
      <Select.Placeholder />
      <Select.Cue />
    </Select.Activator>

    <Select.Content>
      <Select.Item />
    </Select.Content>
  </Select.Root>
</template>
```

## Architecture

The Root creates selection, virtual focus, and popover contexts. The Activator serves as the combobox trigger with keyboard event handling. Content renders via the native popover API with CSS anchor positioning. Each Item registers with the selection context and provides data attributes for styling.

```mermaid "Select Architecture"
flowchart TD
  CreateSelection["createSelection"]
  UseVirtualFocus["useVirtualFocus"]
  UsePopover["usePopover"]
  Root["Select.Root"]:::primary
  Activator["Select.Activator"]
  Value["Select.Value"]
  Placeholder["Select.Placeholder"]
  Cue["Select.Cue"]
  Content["Select.Content"]
  Item["Select.Item"]

  CreateSelection --> Root
  UseVirtualFocus --> Root
  UsePopover --> Root
  Root --> Activator
  Root --> Content
  Activator --> Value
  Activator --> Placeholder
  Activator --> Cue
  Content --> Item
```

## Examples

::: gn-example
/components/select/useTagFilter.ts 1
/components/select/TagFilter.vue 2
/components/select/tag-filter.vue 3

### Multi-Select Tag Filter

This example wires a multi-select dropdown to a live list. Adding `multiple` to `Select.Root` switches the `v-model` binding from a single value to an array, and the dropdown stays open after each pick so the user can stack several tags in one pass. The selected tags surface as chips inside the `Select.Activator` via the `selectedValues` slot prop on `Select.Value`, and those same tags drive a reactive filter over the article list below — pick a tag and the list narrows, remove it and the list widens again. When no article carries every active tag, an empty state explains how to recover.

The interesting detail is the relationship between `Select.Item`'s `id` and `value` props. The `id` is the registry key used for virtual focus and ARIA wiring; the `value` is what syncs to `v-model`. Here both are the tag string, which keeps the model array identical to the chip labels and to the filter predicate — no lookup table needed. Filtering, the tag universe, and the AND-match predicate all live in the `useTagFilter` composable, so the markup component stays declarative. The `name` prop on `Select.Root` auto-renders a hidden input per selected value, making the filter submittable inside a real form without ever placing a hidden-input sub-component by hand.

Reach for this pattern whenever a field accepts several independent choices that shape what's shown elsewhere — tag pickers, faceted search, permission editors. For single-choice fields drop `multiple` and bind a scalar; for free-text entry that creates new options on the fly, prefer [Combobox](/components/forms/combobox) instead. The selection logic underneath comes from [createSelection](/composables/selection/create-selection); the dropdown positioning from [Popover](/components/disclosure/popover).

| File | Role |
|------|------|
| `useTagFilter.ts` | Owns the article corpus, derives the tag universe, and computes the AND-matched results from the active tags |
| `TagFilter.vue` | Renders the multi-select Select compound, surfacing chips in the activator and binding the tag array via `defineModel` |
| `tag-filter.vue` | Wires the composable to the component and renders the filtered article list with its empty state |
:::

## Recipes

### Form Submission

Set `name` on Root to auto-render hidden inputs for form submission — one per selected value in multi-select mode:

```vue
<template>
  <Select.Root v-model="value" name="color">
    <!-- ... -->
  </Select.Root>
</template>
```

### Mandatory Selection

Use `mandatory` to prevent deselecting the last item, or `mandatory="force"` to auto-select the first item on mount:

```vue
<template>
  <Select.Root v-model="value" mandatory="force">
    <!-- First non-disabled item is selected automatically -->
  </Select.Root>
</template>
```

### Understanding `id` vs `value`

Each `Select.Item` has two key props:

- **`id`** — Internal key for the selection registry. Used for virtual focus, ARIA attributes, and ticket lookup.
- **`value`** — The value synced to `v-model`. This is what `Select.Value`'s `selectedValue` slot prop exposes.

The model always receives the `value` prop, not the `id`. When `id` and `value` differ, use the `selectedValue` slot prop to look up a display label:

```vue
<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const language = shallowRef('en')

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
  ]
</script>

<template>
  <Select.Root v-model="language" mandatory>
    <Select.Activator>
      <Select.Value v-slot="{ selectedValue }">
        {{ languages.find(l => l.id === selectedValue)?.label }}
      </Select.Value>
      <Select.Cue />
    </Select.Activator>

    <Select.Content>
      <Select.Item
        v-for="lang in languages"
        :id="lang.id"
        :key="lang.id"
        :value="lang.id"
      >
        {{ lang.label }}
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>
```

> [!TIP]
> When `id` and `value` are the same (the common case), `Select.Value` displays the model value directly — no lookup needed.

### Pre-Selected Values

Select supports pre-selected values via `v-model` or `:model-value`. The `Select.Value` component shows the model value immediately, even before the dropdown has been opened. `Select.Placeholder` automatically hides when a model value is present:

```vue
<template>
  <!-- "Banana" shows immediately, no dropdown open needed -->
  <Select.Root v-model="fruit" mandatory>
    <Select.Activator>
      <Select.Value v-slot="{ selectedValue }">{{ selectedValue }}</Select.Value>
      <Select.Placeholder>Pick a fruit…</Select.Placeholder>
    </Select.Activator>

    <Select.Content>
      <Select.Item value="Apple">Apple</Select.Item>
      <Select.Item value="Banana">Banana</Select.Item>
    </Select.Content>
  </Select.Root>
</template>
```

### Custom Positioning

Control dropdown placement with CSS anchor positioning props on Content:

```vue
<template>
  <Select.Content position-area="top" position-try="flip-block">
    <!-- Dropdown appears above the activator -->
  </Select.Content>
</template>
```

### Data Attributes

Style interactive states without slot props:

| Attribute | Values | Component |
|-----------|--------|-----------|
| `data-selected` | `true` | Item |
| `data-highlighted` | `""` | Item |
| `data-disabled` | `true` | Item |
| `data-open` | `true` | Activator |
| `data-state` | `"open"` / `"closed"` | Cue |

## Accessibility

The Select implements the [WAI-ARIA Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) pattern with a listbox popup.

### ARIA Attributes

| Attribute | Value | Component |
|-----------|-------|-----------|
| `role` | `combobox` | Activator |
| `role` | `listbox` | Content |
| `role` | `option` | Item |
| `aria-expanded` | `true` / `false` | Activator |
| `aria-haspopup` | `listbox` | Activator |
| `aria-controls` | listbox ID | Activator |
| `aria-selected` | `true` / `false` | Item |
| `aria-disabled` | `true` | Item (when disabled) |
| `aria-multiselectable` | `true` | Content (when multiple) |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open dropdown, or select highlighted item |
| `ArrowDown` | Open dropdown, or move highlight down |
| `ArrowUp` | Open dropdown, or move highlight up |
| `Home` | Move highlight to first item |
| `End` | Move highlight to last item |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

<DocsApi />
