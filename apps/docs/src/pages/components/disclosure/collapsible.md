---
title: Collapsible - Single Disclosure Toggle for Vue 3
meta:
- name: description
  content: Accessible single-item collapsible disclosure with WAI-ARIA support. Toggle content visibility with keyboard navigation and full slot control.
- name: keywords
  content: collapsible, disclosure, toggle, show hide, Vue 3, headless, accessibility, WAI-ARIA
features:
  category: Component
  label: 'C: Collapsible'
  github: /components/Collapsible/
  renderless: false
  level: 2
related:
  - /components/disclosure/expansion-panel
  - /components/disclosure/dialog
---

# Collapsible

A single-item disclosure toggle for showing and hiding content.

<DocsPageFeatures :frontmatter />

## Usage

The Collapsible component provides a simple open/closed toggle for a single content region. It supports `v-model` for controlled state and exposes `data-state` attributes for CSS-driven styling.

::: gn-example
/components/collapsible/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'
</script>

<template>
  <Collapsible.Root>
    <Collapsible.Activator>
      <Collapsible.Cue />
    </Collapsible.Activator>
    <Collapsible.Content />
  </Collapsible.Root>
</template>
```

## Examples

::: gn-example
/components/collapsible/useFilterPanel.ts 1
/components/collapsible/FilterPanel.vue 2
/components/collapsible/filter-panel.vue 3

### Filters sidebar

A product-filters sidebar built from several independent Collapsible sections — Price, Brand, and Rating — whose open state lives in a single reactive map instead of each section tracking its own boolean. Every section binds `v-model` to `open[section.id]`, so the Expand all and Collapse all buttons flip every section at once by mutating that one object, while a user clicking an individual activator still toggles only that section. This externally-owned open state is the main reason to reach for Collapsible over a self-contained accordion: each instance is independent, and you decide where the state lives and who is allowed to change it.

The `Collapsible.Cue` inside each activator mirrors its Root's `data-state`, so the chevron rotation is pure CSS — `data-[state=open]:rotate-180` — with no slot prop or watcher. The filter controls themselves compose other v0 primitives rather than native inputs: Price and Brand use a [Checkbox](/components/forms/checkbox) group with an array `v-model`, and Rating uses a single-select [Radio](/components/forms/radio) group. All three read and write one shared `filters` object that drives the active-filter count and the summary chips below the panel.

Reach for this pattern whenever sections must be controllable from outside — a clear-filters action, deep-linking a specific section open, or restoring panel state from storage. The trade-off is that you own the coordination logic: nothing stops two sections from being open at once. If you instead want strict "only one section open at a time" accordion behavior, use [ExpansionPanel](/components/disclosure/expansion-panel), which coordinates selection across panels through a shared parent context.

| File | Role |
|------|------|
| `useFilterPanel.ts` | Owns the section open-state map, filter selections, and the derived count, chips, and expand/collapse/clear actions |
| `FilterPanel.vue` | Renders the Collapsible sections with Checkbox and Radio controls plus the expand/collapse header |
| `filter-panel.vue` | Wires the composable to the panel and renders the active-filter summary |
:::

::: gn-example
/components/collapsible/FaqItem.vue 1
/components/collapsible/faq.vue 2

### FAQ

Each FAQ item is an independent `Collapsible.Root` — they share no state, so opening one never collapses another. The example extracts `FaqItem.vue` as a reusable wrapper that accepts a `question` prop and a default slot for the answer, keeping the entry-point file (`faq.vue`) a clean data-driven list.

`Collapsible.Cue` inside the activator automatically mirrors the `data-state` of its parent Root, so the chevron rotation is wired up with a single CSS transition class — no slot prop or manual binding needed.

When you need "only one open at a time" behavior, reach for [ExpansionPanel](/components/disclosure/expansion-panel) instead. It coordinates selection across all panels through a shared parent context, making accordion mode a one-prop change.

| File | Role |
|------|------|
| `FaqItem.vue` | Reusable wrapper around Collapsible with chevron rotation |
| `faq.vue` | Entry point rendering items from data |
:::

## Recipes

### Collapsible vs ExpansionPanel

Both components handle expanding and collapsing content, but they solve different problems:

| | Collapsible | ExpansionPanel |
| - | - | - |
| **Items** | Single | Multiple |
| **State** | Boolean (`open` / `closed`) | Selection set (IDs) |
| **Coordination** | None — each instance is independent | Shared — accordion mode, mandatory, enroll |
| **v-model** | `v-model` (boolean) | `v-model` (ID or ID[]) |
| **Built on** | `createSingle` | `createSelection` |

**Use Collapsible** when you have a single region to show/hide — a details section, a settings panel, a mobile navigation drawer. Each Collapsible is independent.

**Use ExpansionPanel** when you have a list of items where expanding one may collapse another — an FAQ, a settings page with sections, an accordion sidebar.

> [!TIP]
> You can build an FAQ from multiple independent Collapsible instances (see the [FAQ example](#faq) above), but if you need "only one open at a time" behavior, use ExpansionPanel instead — it handles that coordination for you.

## Accessibility

Collapsible follows the [WAI-ARIA Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).

### Keyboard

| Key | Action |
| - | - |
| **Enter** | Toggles the content |
| **Space** | Toggles the content |

### ARIA

| Attribute | Element | Value |
| - | - | - |
| `aria-expanded` | Activator | `true` when open, `false` when closed |
| `aria-controls` | Activator | Points to the content element's `id` |
| `role="region"` | Content | Landmarks the content area |
| `aria-labelledby` | Content | Points back to the activator's `id` |

### Data attributes

All three sub-components expose `data-state="open"` or `data-state="closed"` for CSS-driven styling without JavaScript. The Root and Activator also expose `data-disabled` when the `disabled` prop is set.

::: faq

??? When should I use `data-state` vs slot props for styling?

Prefer `data-state` with CSS selectors (e.g., `data-[state=open]:rotate-180`) for visual changes like icon rotation, background color, and transitions. Use slot props (`v-slot="{ isOpen }"`) when you need conditional rendering or logic that can't be expressed in CSS.

??? Can I nest a Collapsible inside another Collapsible?

Yes. Each Collapsible.Root creates its own independent context via the `namespace` prop. The default namespace is `v0:collapsible`, so nested instances work without collision. Use custom namespaces if you need to access a specific parent from a deeply nested child.

??? How do I animate the content height?

The `data-state` attribute transitions between `"open"` and `"closed"` on the content element. You can use CSS `grid-template-rows` or `max-height` transitions to animate the height change. The content uses the `hidden` attribute when closed, so your animation approach should account for that.

:::

<DocsApi />
