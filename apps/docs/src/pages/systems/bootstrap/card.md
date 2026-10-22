---
title: BCard - Bootstrap 6 card for Vue
meta:
- name: description
  content: Bootstrap 6 card markup for Vue. A section.card with header, body, title, subtitle, and text. Styled by your CSS.
- name: keywords
  content: bootstrap 6 card, vue card, card-body, card-title, paper bootstrap
features:
  category: Component
  label: 'C: BCard'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/list-group
  - /systems/bootstrap/avatar
---

# BCard

A card. The root is a `section`. Header, body, title, subtitle, and text are parts.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Cards on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/card/). Classes and visual variants. This page is the markup.

## Usage

`subtle` adds `.card-subtle`. `translucent` adds `.card-translucent`. There is no footer part. Write a `div.card-footer` in the slot when you need one. The class is in the pin's CSS.

::: ds-example
/systems/bootstrap/card/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<section class="card">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <p class="card-text">Some quick example text.</p>
  </div>
</section>
```

```vue Vue collapse
<template>
  <BCard>
    <BCard.Body>
      <BCard.Title>Card title</BCard.Title>
      <BCard.Text>Some quick example text.</BCard.Text>
    </BCard.Body>
  </BCard>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCard } from '@paper/bootstrap'
</script>

<template>
  <BCard>
    <BCard.Header>Featured</BCard.Header>

    <BCard.Body>
      <BCard.Title>Card title</BCard.Title>

      <BCard.Subtitle>Subtitle</BCard.Subtitle>

      <BCard.Text>Some quick example text.</BCard.Text>
    </BCard.Body>
  </BCard>
</template>
```

## Composed on v0

There is no card in v0. Each part is the element Bootstrap names. `BCard.Title` defaults to `h4`. Pass `as` when the heading level should change.

## Examples

::: ds-example
/systems/bootstrap/card/variants

### Subtle, translucent, and a footer

`subtle` adds `card-subtle`. `theme-primary` on the card is what the header fill reads. `translucent` mixes the card background with whatever is behind it. The footer is a `div.card-footer` in the slot. `as="h3"` changes the title.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `string` | `'section'` | Host element. |
| `subtle` | `boolean` | `false` | Adds `.card-subtle`. |
| `translucent` | `boolean` | `false` | Adds `.card-translucent`. |

`BCard.Title` takes `as` (default `h4`). Header, body, subtitle, and text have no props.

## Accessibility

Use a real heading in `BCard.Title` so the card has a name in the heading list. A card that is only a link should put the link around the title, not around the whole section.
