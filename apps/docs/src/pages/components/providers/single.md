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
> Single is a headless single-selection state provider. Item `attrs` include `role="option"`, a tabindex, and Enter/Space. Arrow-key roving and `role="radio"` stay on [Radio](/components/forms/radio), which is built on the same selection logic.

## Usage

The Single component is a specialization of Selection that enforces single-selection behavior. When an item is selected, any previously selected item is automatically deselected.

::: gn-example
/components/single/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Single } from '@vuetify/v0'
</script>

<template>
  <Single.Root>
    <Single.Item />
  </Single.Root>
</template>
```

## Examples

::: gn-example
/components/single/usePlanPricing.ts 1
/components/single/BillingToggle.vue 2
/components/single/billing-toggle.vue 3

### Billing-period segmented control

A Monthly/Yearly segmented control built on `Single.Root` with `mandatory`. Each `Single.Item` is a billing period; selecting one auto-deselects the other, and `mandatory` blocks clicking the active segment off, so a period is always chosen. The selected value flows straight through the Root's `v-model`, and the live price card below it reacts to that one value — switching to Yearly drops the per-month price and reveals the savings badge.

`Single.Root` and `Single.Item` are renderless. The segment binds the item's slot `attrs` onto its own `<button>`: `attrs` already include `role="option"`, a tabindex, Enter/Space, the click handler, and `data-selected` / `aria-selected`. Styling keys off `data-selected` (the active label darkens) and a sliding indicator is positioned with a `translateX` derived from the selected index — the example owns its own semantics and visuals on top of the provider's state.

Reach for Single when you are building an exclusive-choice control you want to style yourself — segmented toggles, theme pickers, view switchers. If you need an accessible, form-ready radio group with `role="radiogroup"`, arrow-key navigation, and a hidden input, use [Radio](/components/forms/radio) instead; for multi-select, use [Selection](/components/providers/selection). The underlying logic is [createSingle](/composables/selection/create-single).

| File | Role |
|------|------|
| `usePlanPricing.ts` | Owns the selected period and derives the per-month price, billed amount, and savings |
| `BillingToggle.vue` | Renders the Single segmented control with a sliding data-selected indicator |
| `billing-toggle.vue` | Wires the composable to the toggle and renders the live price card |
:::

## Accessibility

Single is a headless **state provider**, not a complete listbox. It manages which item is selected. Slot `attrs` already include `role="option"`, a tabindex, and Enter/Space.

- `Single.Root` exposes `aria-multiselectable="false"`.
- `Single.Item` exposes `aria-selected` and `aria-disabled`, plus `data-selected` and `data-disabled` for styling.

This is listbox-style selection state. Binding `attrs` already applies `role="option"` and Enter/Space. Add arrow-key roving yourself if the pattern needs it. For `role="radiogroup"`, `role="radio"`, and arrow keys, use [Radio](/components/forms/radio), which composes the same single-selection logic.

## FAQ

::: faq

??? How is Single different from Radio?

`Single` tracks the selected item and already puts `role="option"`, a tabindex, and Enter/Space on item `attrs`. `Radio` is a complete radio group on the same logic, adding `role="radiogroup"` / `role="radio"`, arrow keys, roving tabindex, and a hidden input. Reach for `Radio` when you want radio buttons; reach for `Single` when you are building your own exclusive-choice UI and will add whatever keys `option` does not cover.

??? How is Single different from Selection?

`Single` enforces exactly one selected item — selecting a new item automatically deselects the previous one — and exposes singular computed state (`selectedId`, `selectedValue`, `selectedItem`, `selectedIndex`). `Selection` is single-select by default. Its model is an array only when `multiple` is set. Use `Single` for exclusive choice, `Selection` with `multiple` for multi-choice.

??? What is the difference between enroll and mandatory?

Neither controls registration — every `Single.Item` registers with its `Single.Root` automatically on mount. Both options only affect which item starts (or stays) *selected*:

- `enroll` selects each item as it registers. Despite the name it registers nothing — registration is automatic. Because Single keeps only one item selected, each registration replaces the previous, so the most recently registered non-disabled item wins (the last item in a static list). The user can still deselect it.
- `mandatory` prevents deselecting the active item once one is selected (no auto-select on mount).
- `mandatory="force"` auto-selects the *first* non-disabled item on mount and prevents deselection.

To preselect a specific item, initialize the `v-model` with its value.

:::

<DocsApi />
