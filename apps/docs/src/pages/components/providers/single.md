---
title: Single - Headless Single-Selection Provider for Vue 3
meta:
- name: description
  content: Headless single-selection state for Vue 3 — build tabs, segmented controls, theme pickers, and radio-style choice groups. Selecting an item auto-deselects the previous one.
- name: keywords
  content: single, single-select, exclusive selection, tabs, segmented control, theme picker, radio group, Vue 3, headless
features:
  category: Component
  label: 'C: Single'
  github: /components/Single/
  renderless: true
  level: 2
related:
  - /components/forms/radio
  - /composables/selection/create-single
  - /components/providers/selection
---

# Single

A headless provider for exclusive single-selection — selecting an item automatically deselects the previously selected one. Drives tabs, segmented controls, theme pickers, and other exclusive-choice UIs.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Single is a headless single-selection *state provider* — it tracks the selected item but ships no `role`, keyboard navigation, or focus management. For an accessible radio group with `role="radio"` and arrow-key navigation, use [Radio](/components/forms/radio), which is built on the same single-selection logic.

## Usage

The Single component is a specialization of Selection that enforces single-selection behavior. When an item is selected, any previously selected item is automatically deselected.

::: example
/components/single/basic

### Single-Select Group

Three size options that behave as an exclusive choice — selecting one deselects the rest. Each item binds its slot `attrs`, so selection state drives styling through the `data-selected` attribute.

:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Single } from '@vuetify/v0'
</script>

<template>
  <Single.Root>
    <Single.Item value="option-1" v-slot="{ attrs }">
      <button v-bind="attrs">Option 1</button>
    </Single.Item>

    <Single.Item value="option-2" v-slot="{ attrs }">
      <button v-bind="attrs">Option 2</button>
    </Single.Item>
  </Single.Root>
</template>
```

## Examples

::: example
/components/single/mandatory

### Mandatory Selection

Use `mandatory` to prevent deselecting the active item — once something is selected, clicking it again is a no-op, so at least one item always stays selected. `mandatory="force"` goes further: it auto-selects the first non-disabled item on mount and enforces the no-deselect rule.

In this example the first option is disabled, so `mandatory="force"` skips it and selects the second item on mount.

:::

## Accessibility

Single is a headless **state provider**, not a complete interactive widget. It manages which item is selected and exposes that state on each item's slot `attrs`; it does not ship a role, keyboard navigation, or focus management.

- `Single.Root` exposes `aria-multiselectable="false"`.
- `Single.Item` exposes `aria-selected` and `aria-disabled`, plus `data-selected` and `data-disabled` for styling.

This is listbox/tab-style selection state. For an accessible radio group — `role="radiogroup"`, `role="radio"`, arrow-key navigation, and roving `tabindex` — use [Radio](/components/forms/radio), which composes the same single-selection logic. When you bind `attrs` to your own element, you are responsible for supplying the appropriate `role` and keyboard handlers for the pattern you are building.

## FAQ

::: faq

??? How is Single different from Radio?

`Single` is a headless single-selection state provider — it tracks the selected item and exposes selection state, but ships no `role`, keyboard navigation, or focus management. `Radio` is a complete, accessible radio group built on the same logic, adding `role="radiogroup"` / `role="radio"`, arrow-key navigation, roving `tabindex`, and native form integration. Reach for `Radio` when you want radio buttons; reach for `Single` when you are building your own exclusive-choice UI — tabs, segmented controls, theme pickers — and will supply your own semantics.

??? How is Single different from Selection?

`Single` enforces exactly one selected item — selecting a new item automatically deselects the previous one — and exposes singular computed state (`selectedId`, `selectedValue`, `selectedItem`, `selectedIndex`). `Selection` is the multi-select parent: its model holds an array of values. Use `Single` for exclusive choice, `Selection` for multi-choice.

??? What is the difference between enroll and mandatory?

Neither controls registration — every `Single.Item` registers with its `Single.Root` automatically on mount. Both options only affect which item starts (or stays) *selected*:

- `enroll` selects each item as it registers. Despite the name it registers nothing — registration is automatic. Because Single keeps only one item selected, each registration replaces the previous, so the most recently registered non-disabled item wins (the last item in a static list). The user can still deselect it.
- `mandatory` prevents deselecting the active item once one is selected (no auto-select on mount).
- `mandatory="force"` auto-selects the *first* non-disabled item on mount and prevents deselection.

To preselect a specific item, initialize the `v-model` with its value.

:::

<DocsApi />
