---
title: EmAvatar - Emerald Avatar for Vue
meta:
- name: description
  content: Emerald's avatar — a circular identity mark in three sizes that shows an image when it loads and initials when it does not. Composed on Vuetify0's headless Avatar.
- name: keywords
  content: emerald avatar, vue avatar, avatar fallback, user avatar vue, vuetify0 avatar, paper emerald
features:
  category: Component
  label: 'C: EmAvatar'
  level: 1
  renderless: false
  order: 8
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/semantic/avatar
---

# EmAvatar

<DocsPageFeatures :frontmatter />

A circular identity mark in three sizes — a photo when it loads, initials when it does not. The swap is automatic and the circle never changes size while it happens.

## Usage

The canonical avatar is a pair: an `EmAvatarImage` with the photo and an `EmAvatarFallback` with the person's initials. The fallback is what shows while the image is still loading and what stays if the load fails, so the pairing costs nothing when the network behaves and saves the layout when it does not.

The fallback also stands alone. An avatar with no image at all — initials on the neutral background — is a complete, intentional variant, not a degraded one. It is the right choice when there is no photo to show.

::: ds-example
/systems/emerald/avatar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback, EmAvatarImage } from '@paper/emerald'
</script>

<template>
  <EmAvatar>
    <EmAvatarImage />

    <EmAvatarFallback />
  </EmAvatar>
</template>
```

## Composed on v0

The three parts render v0's [Avatar](/components/semantic/avatar) compound — `Avatar.Root`, `Avatar.Image` and `Avatar.Fallback` — and all of the image-versus-fallback logic lives there, not in Emerald.

`Avatar.Root` runs a single-select registry that arbitrates which layer is visible: exactly one part shows at any moment. `Avatar.Image` registers itself as unavailable, tracks its load through v0's [useImage](/composables/system/use-image), and only becomes eligible once the file has actually arrived; if the load errors it withdraws again. `Avatar.Fallback` registers as always available, which is why it is what you see before the image resolves and after it fails. The image element stays mounted while hidden — it is concealed rather than destroyed — so its load state survives and the swap is a paint, not a re-fetch.

Emerald's contribution is entirely skin: the circle, the shadow, the neutral background and text tokens, the three diameters keyed off the `data-size` attribute the root carries, and `object-fit: cover` so any aspect ratio fills the circle. v0's compound also ships `Avatar.Group` and `Avatar.Indicator`; Emerald does not wrap those parts today.

## Examples

::: ds-example
/systems/emerald/avatar/sizes

### Sizes

`size` sets the diameter and the fallback's type step together: `sm` is 32px on `b3`, `md` is 40px on `b2`, and `lg` is 48px on `b1`. Because the text scales with the circle, two-letter initials sit correctly at every size without any per-size styling from you.

Pick by the density of the surface, the same rule as [EmButton](/systems/emerald/button). `md` is the default and fits most rows and headers; `sm` belongs in dense surfaces like table cells and comment threads; `lg` is for the places one person is the subject — a profile card, an account menu. The image variant and the initials variant use the same scale, so a list that mixes both stays aligned.
:::

::: ds-example
/systems/emerald/avatar/fallback

### Fallbacks and initials

The first avatar here points at an image that will never load. Nothing in your code has to notice: the fallback was already showing while the load was pending, and when the request fails it simply stays. There is no error state to handle and no flash of an empty circle — the failure path and the loading path look identical.

The other two show the fallback used deliberately. Initials are the usual content, but the slot takes anything short — an overflow count like `+4` is a common idiom at the end of a row of avatars. Keep it to two or three characters; the circle does not grow to fit, and anything longer is clipped by the rounded bounds.
:::

## Props

### EmAvatar

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Diameter and fallback type step |
| `value` | `unknown` | — | Identifier forwarded to the v0 root. Only meaningful inside a v0 `Avatar.Group` |
| `namespace` | `string` | — | Context key the root provides to its parts. Only needed when nesting avatars |

The default slot takes the parts.

### EmAvatarImage

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | **Required.** Image URL |
| `alt` | `string` | — | Alternative text for the rendered img element |
| `namespace` | `string` | — | Which avatar root to register with. Only needed when nesting |

No slots. v0's per-image `priority` ordering for multiple sources is not surfaced by this part.

### EmAvatarFallback

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `namespace` | `string` | — | Which avatar root to register with. Only needed when nesting |

The default slot is the fallback content — initials, or any short string.

## Accessibility

An avatar is not interactive. The root renders a plain container with no role, so there is nothing to focus and nothing announced for the frame itself; what assistive technology encounters is whichever layer is currently visible.

### The image and its alt

`EmAvatarImage` renders a real `<img>` and passes your `alt` straight through. When the avatar is the only thing identifying the person — an avatar with no name beside it — the alt should carry the name. When the name is already adjacent text, as in a list row, pass `alt=""` so nothing new is announced; the rendered element carries an explicit `role="img"`, so an empty alt blanks its name rather than removing it from the accessibility tree, and a photo that must be skipped entirely takes `aria-hidden="true"` on the part — attributes fall through to the img. Omitting `alt` entirely is the one wrong option: the attribute is then absent and a screen reader may fall back to reading the file URL.

While the image is loading it is hidden with `display: none`, so assistive technology only ever encounters one layer at a time — the fallback until the load settles, the image after.

### The fallback is plain text

`EmAvatarFallback` renders its content as ordinary text, and a screen reader reads it as-is — "SC" is announced as the letters, with no expansion to the name. That is fine when the name is nearby and redundant announcement is the concern; if the initials duplicate an adjacent name, place `aria-hidden="true"` on the part — attributes fall through to the rendered element.

### When the avatar is a control

Nothing in the component makes it clickable. If a design calls for an avatar that opens a menu or a profile, wrap it in a real control — an [EmButton](/systems/emerald/button) or a link — and put the accessible name on that control. The image's alt does not name the wrapping control; label the control itself.
