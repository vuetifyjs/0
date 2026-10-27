---
title: BAvatar - Bootstrap 6 Avatar for Vue
meta:
- name: description
  content: Bootstrap 6 avatar markup for Vue. An image or initials, an optional status dot, a subtle treatment, and the xs, sm, lg, and xl sizes.
- name: keywords
  content: bootstrap 6 avatar, vue avatar, avatar-status, avatar-subtle, status-online, paper bootstrap
features:
  category: Component
  label: 'C: BAvatar'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/placeholder
  - /systems/bootstrap/list-group
---

# BAvatar

An avatar image or initials, with an optional status dot.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/avatar/"
  title="Avatars"
/>

## Usage

With `src`, the component is `span.avatar` around `img.avatar-img`. Without `src`, the default slot is the initials. `status` adds `span.avatar-status` and one of `status-online`, `status-away`, `status-busy`, or `status-offline`. `subtle` adds `avatar-subtle`. `size` is `xs`, `sm`, `lg`, or `xl`.

::: ds-example
/systems/bootstrap/avatar/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview. The Vue tab is the component that renders the same tree. Theme color stays a class on the component.

::: code-group no-filename

```html Bootstrap collapse
<span class="avatar">
  <img class="avatar-img" src="https://github.com/mdo.png" alt="mdo">
  <span class="avatar-status status-online" role="img" aria-label="Online"></span>
</span>
```

```vue Vue collapse
<template>
  <BAvatar src="https://github.com/mdo.png" alt="mdo" status="online" />
  <BAvatar>AB</BAvatar>
  <BAvatar class="theme-primary" subtle>CD</BAvatar>
</template>
```

:::

The pin names `avatar-stack` and never shows that wrapper, so this component has no stack part.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BAvatar } from '@paper/bootstrap'
</script>

<template>
  <BAvatar />
</template>
```

## Composed on v0

This is markup. The host is `span.avatar`. An image renders immediately. The slot renders only when `src` is empty.

v0 [Avatar](/components/semantic/avatar) is a different tree. Its image stays hidden until [useImage](/composables/system/use-image) loads, and the fallback replaces a failed image. The pin does neither. The status dot is not `Avatar.Indicator`. That part is the group's overflow count.

The status name is [useLocale](/composables/plugins/use-locale): `Avatar.status.online`, `Avatar.status.away`, `Avatar.status.busy`, or `Avatar.status.offline`. The English words are the fallback.

## Examples

::: ds-example
/systems/bootstrap/avatar/sizes

### Sizes and status

`xs`, `sm`, `lg`, and `xl` add `avatar-xs`, `avatar-sm`, `avatar-lg`, and `avatar-xl`. The middle image has no size class. The second row is `online`, `away`, `busy`, and `offline`. Each dot is `role="img"` with that name.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | | Renders `img.avatar-img`. Empty leaves the slot. |
| `alt` | `string` | `''` | Alt text on that image. |
| `size` | `'xs' \| 'sm' \| 'lg' \| 'xl'` | | Adds `avatar-xs`, `avatar-sm`, `avatar-lg`, or `avatar-xl`. |
| `status` | `'online' \| 'away' \| 'busy' \| 'offline'` | | Adds `span.avatar-status` and `status-{status}`. |
| `subtle` | `boolean` | `false` | Adds `avatar-subtle`. |

## Accessibility

The image name is `alt`. Leave it empty when the initials or nearby text already name the person. The status dot is `role="img"` and its name is the locale string, or Online, Away, Busy, or Offline. Initials in the slot are text. There is no stack and no `data-bs-toggle`.
