---
title: BScrollSpy - Bootstrap 6 Scrollspy for Vue
meta:
- name: description
  content: Bootstrap 6 scrollspy for Vue. The link whose section is in view gets the active class. Smooth scrolling stays off unless you set the prop.
- name: keywords
  content: bootstrap 6 scrollspy, vue scrollspy, active section, nav link, intersection, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BScrollSpy'
  level: 2
  renderless: false
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/navbar
  - /composables/system/use-intersection-observer
---

# BScrollSpy

A scroll container and a set of links. The link for the section in view gets the active class.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/scrollspy/"
  title="Scrollspy"
/>

## Usage

`v-model` is the id of the section in view. The first section starts active. Links and sections pair by that id. `smooth` defaults to false. The root is this element, unless you pass a different scroll container.

The preview is 16rem tall. The pin uses `vh-100`, and this frame's height is the example, so that class does not settle here.

::: ds-example
/systems/bootstrap/scrollspy/basic
:::

### The markup Bootstrap documents

The HTML tab is a nav plus the sections it tracks. The Vue tab is the same tree. `data-bs-spy` and `data-bs-target` are the bundle's behavior. This package does not emit them.

::: code-group no-filename

```html Bootstrap collapse
<div class="vh-100 overflow-auto" tabindex="0">
  <nav class="nav nav-pills mb-3">
    <a class="nav-link active" href="#one">First</a>
    <a class="nav-link" href="#two">Second</a>
  </nav>
  <div id="one" class="min-vh-100">
    <h4>First heading</h4>
    <p class="mb-3">This is some placeholder content for the scrollspy page.</p>
  </div>
  <div id="two" class="min-vh-100">
    <h4>Second heading</h4>
    <p class="mb-3">This is some placeholder content for the scrollspy page.</p>
  </div>
</div>
```

```vue Vue collapse
<template>
  <BScrollSpy class="vh-100 overflow-auto" tabindex="0">
    <nav class="nav nav-pills mb-3">
      <BScrollSpy.Link id="one">First</BScrollSpy.Link>
      <BScrollSpy.Link id="two">Second</BScrollSpy.Link>
    </nav>

    <BScrollSpy.Section id="one" class="min-vh-100">
      <h4>First heading</h4>
      <p class="mb-3">This is some placeholder content for the scrollspy page.</p>
    </BScrollSpy.Section>

    <BScrollSpy.Section id="two" class="min-vh-100">
      <h4>Second heading</h4>
      <p class="mb-3">This is some placeholder content for the scrollspy page.</p>
    </BScrollSpy.Section>
  </BScrollSpy>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BScrollSpy } from '@paper/bootstrap'
</script>

<template>
  <BScrollSpy>
    <BScrollSpy.Link />

    <BScrollSpy.Section />
  </BScrollSpy>
</template>
```

## Composed on v0

Each section is observed with [useIntersectionObserver](/composables/system/use-intersection-observer). The observer root is the scroll container you pass, or this component's element. The section with the greatest intersection ratio wins, and its link gets `active`.

Links and sections both `register({ id, el })`. An anchor is the link. Anything else is the section. `smooth` makes the link click call `scrollIntoView({ behavior: 'smooth' })` on that section. Left off, the click is a normal hash link.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | — | Id of the section in view. |
| `root` | `HTMLElement \| null` | this element | Scroll container the sections are measured against. |
| `smooth` | `boolean` | `false` | Smooth-scroll the matching section on link click. |
| `id` | `string` | — | On a link and on a section. The pair key. |
| `href` | `string` | `'#' + id` | On a link. |

Put `nav`, `nav-pills`, or `list-group` on the consumer's nav. This component only adds `nav-link` and `active`.

## Accessibility

The link is an anchor, so it is in the tab order and exposes its name. `active` is the visual hook from the pin; the href still points at the section id. With `smooth` off, activation is the browser's hash jump. With `smooth` on, the click is prevented and the section is scrolled into view. Give the scroll container `tabindex="0"` when it is not the page, so a keyboard user can scroll it.
