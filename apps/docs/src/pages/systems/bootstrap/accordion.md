---
title: BAccordion - Bootstrap 6 Accordion for Vue
meta:
- name: description
  content: Bootstrap 6's accordion markup with Vuetify0 behavior — native details, one item open, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 accordion, vue accordion, details, exclusive, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BAccordion'
  level: 2
  renderless: false
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/collapse
  - /composables/foundation/create-context
---

# BAccordion

A stack of sections where one is open at a time. Each section is a native disclosure, so the browser does the toggling.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/accordion/"
  title="Accordion"
/>

## Usage

`open` on an item maps to the native `open` attribute. `exclusive` (the default) gives every item the same `name`, which is how the browser keeps a single item open.

::: ds-example
/systems/bootstrap/accordion/basic
:::

### The markup Bootstrap documents

The HTML tab is two native `details` items. The Vue tab is the same tree. There is no `data-bs-toggle`. The chevron is the SVG from the Bootstrap preview.

::: code-group no-filename

```html Bootstrap collapse
<div class="accordion">
  <details class="accordion-item" name="accordion" open>
    <summary class="accordion-header">
      Accordion Item #1
      <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m2 5 6 6 6-6"/></svg>
    </summary>
    <div class="accordion-body">
      First
    </div>
  </details>
  <details class="accordion-item" name="accordion">
    <summary class="accordion-header">
      Accordion Item #2
      <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m2 5 6 6 6-6"/></svg>
    </summary>
    <div class="accordion-body">
      Second
    </div>
  </details>
</div>
```

```vue Vue collapse
<template>
  <BAccordion>
    <BAccordion.Item open>
      <BAccordion.Header>Accordion Item #1</BAccordion.Header>
      <BAccordion.Body>First</BAccordion.Body>
    </BAccordion.Item>

    <BAccordion.Item>
      <BAccordion.Header>Accordion Item #2</BAccordion.Header>
      <BAccordion.Body>Second</BAccordion.Body>
    </BAccordion.Item>
  </BAccordion>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BAccordion } from '@paper/bootstrap'
</script>

<template>
  <BAccordion>
    <BAccordion.Item>
      <BAccordion.Header />

      <BAccordion.Body />
    </BAccordion.Item>
  </BAccordion>
</template>
```

## Composed on v0

The shared `name` is provided with [createContext](/composables/foundation/create-context). When `exclusive` is on, every item reads that one name and writes it on `details`. The browser, not a click handler, closes the others.

`name` defaults to a generated id. Pass `name` when the group token has to match markup you already wrote. Set `exclusive` to false and the name is omitted, so more than one item can be open.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `exclusive` | `boolean` | `true` | One `name` on every item. |
| `name` | `string` | generated | That shared `name`, when `exclusive` is true. |
| `theme` | `string` | — | Adds `theme-{theme}` on the root. |
| `small` | `boolean` | `false` | Adds `accordion-sm`. |
| `open` (item) | `boolean` | `false` | Native `open` attribute. Not a v-model. |

`accordion-flush` and `accordion-gap` are classes you add yourself. They are not props.

## Accessibility

Each item is a `details` element and each header is a `summary`. The browser supplies the toggle, including Enter and Space on the summary. Do not add a click handler on top of that. The chevron is decorative; the summary text is the name.
