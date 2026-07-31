---
title: ExpansionPanel - Accessible Accordion for Vue 3
meta:
- name: description
  content: Accessible accordion and expansion panels with single or multi-expand modes. WAI-ARIA compliant compound component with Header, Activator, and Content slots.
- name: keywords
  content: expansion panel, accordion, collapsible, Vue 3, headless, accessibility, WAI-ARIA, disclosure
features:
  category: Component
  label: 'C: ExpansionPanel'
  github: /components/ExpansionPanel/
  renderless: false
  level: 2
related:
  - /composables/selection/create-selection
  - /components/disclosure/popover
---

# ExpansionPanel

A component for creating accordion-style expansion panels with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

Group a set of panels into an accordion where opening one can collapse the others. Bind `v-model` to track which panel is open — or, in `multiple` mode, which panels.

::: gn-example
/components/expansion-panel/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Group>
    <ExpansionPanel.Root>
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator>
          <ExpansionPanel.Cue />
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content />
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>
</template>
```

## Examples

::: gn-example
/components/expansion-panel/useFaq.ts 1
/components/expansion-panel/FaqAccordion.vue 2
/components/expansion-panel/faq-accordion.vue 3

### Product FAQ accordion

This FAQ widget renders an accordion from a plain data array, mapping each entry to an `ExpansionPanel.Root` keyed by its question id. The `ExpansionPanel.Group` defaults to single-open mode, so opening one answer collapses the previous one — its `v-model` holds the id of the open panel, or `undefined` when every panel is closed. The composable seeds that model with the first question's id, so the accordion shows one answer on mount instead of opening empty.

Each `ExpansionPanel.Header` renders a heading that wraps the `ExpansionPanel.Activator` button — the WAI-ARIA accordion shape that lets screen-reader users jump between questions by heading. The chevron is an `ExpansionPanel.Cue`, which emits `data-state="open"` and `data-state="closed"` on its element; the example rotates it with the `data-[state=open]:rotate-180` utility, no JavaScript class toggling. `ExpansionPanel.Content` shows and hides with the native `hidden` attribute, keeping the markup accessible and the example free of custom CSS.

Reach for single-open mode when answers are long and you want the reader focused on one at a time; add `multiple` to `ExpansionPanel.Group` — and switch the model to an array — when panels are short and comparing them side by side matters. The Group is built on [createSelection](/composables/selection/create-selection), so the same mandatory and enroll options apply. For a single standalone disclosure with no sibling coordination, prefer [Collapsible](/components/disclosure/collapsible).

| File | Role |
|------|------|
| `useFaq.ts` | FAQ data array, the single-open model seeded to the first question, and a collapse helper |
| `FaqAccordion.vue` | Renders the ExpansionPanel compound — Group, Header, Activator, animated Cue, and Content |
| `faq-accordion.vue` | Wires the composable to the accordion and adds the status line and collapse control |
:::

## Accessibility

ExpansionPanel follows the [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). `ExpansionPanel.Header` renders a heading (`<h3>` by default) that wraps the `ExpansionPanel.Activator` button, so screen-reader users can move between panels by heading.

### ARIA Attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| `role` | `button` (only when Activator is not a native `<button>`) | Activator |
| `aria-expanded` | `true` / `false` | Activator |
| `aria-controls` | Content region ID | Activator |
| `aria-disabled` | `true` / `false` | Activator |
| `role` | `region` | Content |
| `aria-labelledby` | Activator ID | Content |
| `hidden` | Present when collapsed | Content |
| `aria-hidden` | `true` | Cue |

The Activator and Content IDs are paired: `aria-controls` on the Activator points at the Content, and `aria-labelledby` on the Content points back at the Activator. The Cue chevron is decorative and hidden from assistive technology.

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` | Toggles the focused panel |
| `Space` | Toggles the focused panel |

## FAQ

::: faq

??? How do I allow multiple panels to stay open at once?

By default the Group is single-open. Add `multiple` to `ExpansionPanel.Group` and bind its `v-model` to an array — it's built on [createSelection](/composables/selection/create-selection), so the same `mandatory` and `enroll` options apply.

??? When should I use ExpansionPanel instead of Collapsible?

ExpansionPanel coordinates a set of sibling panels — opening one can collapse the others. For a single standalone disclosure with no sibling coordination, reach for [Collapsible](/components/disclosure/collapsible) instead.

??? How do I rotate the chevron when a panel opens?

`ExpansionPanel.Cue` emits `data-state="open"` / `data-state="closed"` on its element. Style it with a data-attribute utility like `data-[state=open]:rotate-180` — no JavaScript class toggling needed.

:::

<DocsApi />
