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

Single ships no roles, keyboard handling, or focus management — it is a pure selection-state provider, so both `Single.Root` and `Single.Item` are renderless. That is why the segment binds the item's slot `attrs` directly onto its own `<button>`: `attrs` carries the `onClick` toggle plus the `data-selected` / `aria-selected` state. Styling keys off `data-selected` (the active label darkens) and a sliding indicator is positioned with a `translateX` derived from the selected index — the example owns its own semantics and visuals on top of the provider's state.

Reach for Single when you are building an exclusive-choice control you want to style yourself — segmented toggles, theme pickers, view switchers. If you need an accessible, form-ready radio group with `role="radiogroup"`, arrow-key navigation, and a hidden input, use [Radio](/components/forms/radio) instead; for multi-select, use [Selection](/components/providers/selection). The underlying logic is [createSingle](/composables/selection/create-single).

| File | Role |
|------|------|
| `usePlanPricing.ts` | Owns the selected period and derives the per-month price, billed amount, and savings |
| `BillingToggle.vue` | Renders the Single segmented control with a sliding data-selected indicator |
| `billing-toggle.vue` | Wires the composable to the toggle and renders the live price card |
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
