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

The ExpansionPanel component provides a wrapper and item pattern for managing expansion state in accordion-style interfaces. It uses the `createSelection` composable internally and provides full v-model support with automatic state synchronization.

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
/components/expansion-panel/transition

### Animated Transitions

By default, `ExpansionPanel.Content` toggles visibility with the `hidden` attribute — instant, but not animatable. To animate the open and close, add `renderless` to `ExpansionPanel.Content` and render your own element: the slot exposes `isSelected` to drive a `v-if` inside Vue's `<Transition>`, and an `attrs` object you must bind to your replacement element so it keeps the component's accessibility contract (`role="region"`, the `id` targeted by the activator's `aria-controls`, and `aria-labelledby`).

The height animation itself needs no JavaScript measurements. CSS `interpolate-size: allow-keywords` lets `max-height` transition to and from the intrinsic `max-content` keyword, so panels of any content size animate smoothly. Padding lives on an inner wrapper rather than the transitioned element — animating `max-height` on the padded element would make the content jump at the ends of the transition.

Reach for this pattern whenever panel content deserves a smooth reveal — tables, long text, nested forms. If you only need the default show and hide behavior, skip `renderless` entirely; the non-renderless Content keeps its element mounted and is the simpler, more accessible default for static content.

:::

> [!NOTE]
> [interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size) is currently a Chromium-only CSS feature (Chrome and Edge 129+). Other browsers skip the animation and open the panel instantly — the content itself works everywhere.

<DocsApi />
