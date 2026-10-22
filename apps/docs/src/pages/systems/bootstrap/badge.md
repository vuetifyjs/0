---
title: BBadge - Bootstrap 6 badge for Vue
meta:
- name: description
  content: Bootstrap 6 badge markup for Vue. A span.badge with subtle and outline faces and a theme class. Styled by your CSS.
- name: keywords
  content: bootstrap 6 badge, vue badge, badge-subtle, badge-outline, paper bootstrap
features:
  category: Component
  label: 'C: BBadge'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/button
  - /systems/bootstrap/alert
---

# BBadge

A small label. The default is `span.badge`. Color is a theme class.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Badges on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/badge/). Classes and visual variants. This page is the markup.

## Usage

`variant` adds `badge-subtle` or `badge-outline` on top of `.badge`. There is no pill prop. The pin does not use one.

::: ds-example
/systems/bootstrap/badge/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<span class="badge theme-primary">New</span>
<span class="badge badge-subtle theme-primary">Subtle</span>
```

```vue Vue collapse
<template>
  <BBadge theme="primary">New</BBadge>
  <BBadge theme="primary" variant="subtle">Subtle</BBadge>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BBadge } from '@paper/bootstrap'
</script>

<template>
  <BBadge>New</BBadge>
</template>
```

## Composed on v0

This is markup. The slot is the label. The host is `span` unless `as` is set. A heading keeps the span, and the badge scales with that heading. `as="a"` is the link. `href` and any other attribute fall through. `a.badge` drops the underline. There is no badge primitive in v0.

## Examples

::: ds-example
/systems/bootstrap/badge/headings

### Headings and links

The badge in a heading is still a `span`. The larger type comes from the heading. `as="a"` renders the link. The text is the name.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `string` | `'span'` | Host element. |
| `theme` | `string` | | Adds `theme-{theme}`. |
| `variant` | `'subtle' \| 'outline'` | | Adds `badge-subtle` or `badge-outline`. |

## Accessibility

A badge that is only a count next to other text needs no role. If the badge is the only status, put that status in the slot where a screen reader can read it. `as="a"` is a link, and its text is the name.
