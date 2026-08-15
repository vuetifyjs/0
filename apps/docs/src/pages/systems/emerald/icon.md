---
title: EmIcon - Emerald Icons for Vue
meta:
- name: description
  content: Emerald's icon set, addressed by role rather than by drawing — 48 glyphs answering to 72 names, resolved through a v0 token registry, decorative by default.
- name: keywords
  content: emerald icon, vue icons, icon roles, design system icons, svg icons vue, createTokens
features:
  category: Component
  label: 'C: EmIcon'
  level: 2
  renderless: false
  order: 6
related:
  - /systems/emerald
  - /systems/emerald/button
  - /composables/registration/create-tokens
---

# EmIcon

<DocsPageFeatures :frontmatter />

Draws a named glyph from Emerald's icon set. Icons are addressed by the role they play, not by the picture they show, and are decorative unless you say otherwise.

## Usage

`name` is a **role**: what the icon is for, not what it depicts. You ask for `settings` and get the sliders drawing; you ask for `mail` and get the envelope. There is no file to import, no icon font to load, and no sprite sheet — the glyph is inline SVG drawn from a registry the plugin installs.

The set is deliberately small. 48 drawings answer to 72 names, because 24 of those names are aliases onto a shared drawing. That is a design decision rather than an economy: `finance` and `payments` point at the same card because they are the same concept in two dashboards, and giving them separate art would make the product look less coherent, not more.

::: ds-example
/systems/emerald/icon/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmIcon } from '@paper/emerald'
</script>

<template>
  <EmIcon name="calendar" />
</template>
```

## Composed on v0

There is no v0 icon component; `EmIcon` is built on a v0 **composable** instead. The registry is a [createTokens](/composables/registration/create-tokens) instance, and resolution is `createTokens`' own alias dereferencing rather than anything Emerald wrote.

That is what makes the alias table free. `createTokens` resolves `{role}` references at read time, so an alias is stored as the literal string `{envelope}` and dereferenced when it is asked for. `mail` and `envelope` are two entries pointing at one array of path data, and adding your own is the same one-line shape.

The plugin is a [createPluginContext](/composables/foundation/create-plugin) trinity — `createEmeraldIconsContext`, `createEmeraldIconsPlugin`, `useEmIcons` — which is why `namespace` exists on the component: a subtree can be given its own registry, and `EmIcon` will resolve against that one instead. It also carries a fallback, so `EmIcon` draws correctly in an app with no Emerald plugin installed at all; the built-in set is built once on first use and shared from then on.

## Examples

::: ds-example
/systems/emerald/icon/sizes

### Sizes

`size` selects a step on the `--emerald-icon-*` scale: `s` is 18px, `m` 20px, `l` 24px, `xl` 32px. The prop sets a `data-size` attribute and the dimension arrives through CSS custom properties, so the icon scales with the token rather than with an inline style you would have to override.

Those rules are wrapped in `:where()`, which gives them zero specificity, and that is a feature. Any single-class rule on a host element outranks the `size` prop — which is exactly how `EmSelect` pins its caret to 16px without passing a prop down through the component. If you need an icon at a size the scale does not have, style the container; you do not need a new token or an inline override.

The glyphs are stroked, not filled, and `stroke-width` is its own custom property, so an icon enlarged past `xl` thins out proportionally instead of turning into a heavy blob.
:::

::: ds-example
/systems/emerald/icon/labelled

### Decorative or labelled

This is the only accessibility decision the component asks you to make, and it turns on the single `label` prop.

With no `label`, the icon renders `aria-hidden="true"` and no role — it is invisible to assistive technology. That is the right default and the common case: an icon beside its own text label, or inside a button that already has a name, is duplicate information, and announcing it makes the control read twice.

With a `label`, the icon becomes `role="img"` with that string as its accessible name, and the `aria-hidden` is dropped. Reach for it only when the icon is carrying meaning nothing else on screen carries — a status glyph in a table cell, a bare trend arrow beside a figure.

The third case in the example is the one that trips people up. For an icon-only button, the name belongs on the **button**, not the icon: the button is what gets focused and activated, so it is the thing that needs a name. Labelling the glyph instead leaves the control anonymous and produces a nested, doubly-announced name — pass `ariaLabel` to `EmButton` and leave the icon decorative.
:::

::: ds-example
/systems/emerald/icon/roles

### The role gallery

Every canonical role in the set, drawn from `emeraldIcons` — the same map the registry is built from, exported from the package root. Iterating it is the honest way to build a picker: the gallery cannot drift from the artwork, because it *is* the artwork.

Note what this list is not. These are the 48 canonical roles only; the 24 aliases resolve into this set and are listed in the table below rather than drawn again here, because a gallery that showed `mail` and `envelope` as separate tiles would imply two drawings where there is one.

If a name does not resolve, `EmIcon` renders nothing at all and logs the unknown role in development. That is deliberate — a placeholder box would ship to production looking like a considered design choice, while an empty space reads as the bug it is.
:::

## Roles

The canonical set, grouped the way the source groups it.

| Group | Roles |
|-------|-------|
| Objects | `layout` `sparkle` `tag` `help` `sliders` `window` `info` `login` `card` `truck` `megaphone` `cart` `envelope` `speech-bubble` `kanban` `calendar` `table` `document` `layers` `book` `receipt` |
| People | `user` `users` |
| Charts | `chart-line` `chart-bar` `activity` `trend-up` `trend-down` |
| Chrome | `moon` `sun` `palette` `menu` `sidebar` `bell` `search` |
| Direction | `chevron-up` `chevron-down` `chevron-left` `chevron-right` `sort` |
| Marks | `check` `minus` `close` `plus` `kebab` `eye` `star` `currency` |

### Aliases

Product vocabulary pointing at the canonical drawings. Both names are equally valid at the call site; prefer whichever reads correctly in the surface you are building.

| Alias | Resolves to | Alias | Resolves to |
|-------|-------------|-------|-------------|
| `about` | `info` | `logistics` | `truck` |
| `analytics` | `chart-bar` | `mail` | `envelope` |
| `campaign` | `megaphone` | `modals` | `window` |
| `chat` | `speech-bubble` | `orders` | `layers` |
| `components` | `layers` | `payments` | `card` |
| `contact` | `speech-bubble` | `pricing` | `tag` |
| `contacts` | `user` | `productivity` | `activity` |
| `dashboard` | `layout` | `sales` | `chart-line` |
| `datatable` | `table` | `settings` | `sliders` |
| `ecommerce` | `cart` | `signin` | `login` |
| `faqs` | `help` | `features` | `sparkle` |
| `finance` | `card` | `forms` | `document` |

### Extending the set

`createEmeraldIconsPlugin` takes both halves. `icons` merges glyphs over the built-in set — an existing key replaces its artwork, a new key extends the vocabulary. `aliases` adds `role → target` references, and a bare target is wrapped for you, so `{ expand: 'chevron-down' }` and `{ expand: '{chevron-down}' }` mean the same thing.

```ts main.ts
import { createEmeraldIconsPlugin } from '@paper/emerald'

app.use(createEmeraldIconsPlugin({
  icons: { flame: ['M12 2c3 4 6 6 6 10a6 6 0 0 1-12 0c0-4 3-6 6-10Z'] },
  aliases: { expand: 'chevron-down', trending: 'trend-up' },
}))
```

A glyph is an array of SVG path `d` strings, drawn into a 24×24 viewBox with `fill="none"` and `stroke="currentColor"`. Artwork that assumes a fill will not look right in this set.

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmIcon.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `EmIconName` | — | **Required.** Role to draw, aliases included |
| `label` | `string` | — | Accessible name. Set only when the icon is the whole message; promotes the icon from decorative to `role="img"` |
| `size` | `'s' \| 'm' \| 'l' \| 'xl'` | `'m'` | Step on the `--emerald-icon-*` scale |
| `namespace` | `string` | — | Registry to resolve against. Only needed when a subtree was given its own set |

`EmIconName` accepts any canonical role, any alias, and any string — the last so a set extended at runtime still type-checks. There are no slots.

## Accessibility

The component has exactly one accessibility contract, and it is the `label` prop.

| `label` | Rendered attributes | Reads as |
|---------|--------------------|----------|
| absent | `aria-hidden="true"` | Nothing — skipped entirely |
| set | `role="img"`, `aria-label="…"` | An image with that name |

Decorative is the default because it is the correct answer far more often. An icon that sits beside text, inside a labelled button, or as ornament in a heading adds nothing an assistive-technology user needs, and announcing it makes every one of those surfaces noisier.

Two rules follow from the table:

**Never label an icon inside an interactive element.** The element itself takes the name — `ariaLabel` on `EmButton`, the text content of a link. An icon labelled inside a button produces a control whose name is assembled from both, announced twice.

**Never rely on an icon alone to convey state without a label.** A red glyph meaning "failed" is invisible to a screen reader and to a colorblind reader both. Either label it, or put the state in text nearby and leave the icon decorative.

An empty string is falsy and therefore decorative, not "labelled with nothing" — `label=""` renders `aria-hidden="true"`.
