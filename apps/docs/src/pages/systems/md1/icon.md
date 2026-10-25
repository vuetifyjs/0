---
title: Md1Icon - Material Design 1 Icon for Vue
meta:
- name: description
  content: The Material Design 1 system icons by role name. 87 filled Material Icons glyphs answer to 114 names through a Vuetify0 token registry, at 24 dp or 20 dp dense, decorative unless labelled, and mirrored in RTL where the glyph points.
- name: keywords
  content: md1 icon, material design 1 icons, material icons vue, system icons, icon roles, rtl icons, createTokens, vuetify0 icons, paper md1
features:
  category: Component
  label: 'C: Md1Icon'
  level: 2
  renderless: false
  group: foundation
  order: 1
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/icon-toggle
  - /composables/registration/create-tokens
---

# Md1Icon

<DocsPageFeatures :frontmatter />

The Material Design 1 system icon: ask for a role, such as `menu` or `search`, and get the filled Material Icons glyph on the 24 dp grid. Every Material Design 1 component that draws a mark draws it through this one.

> [!NOTE]
> Reference: [Icons, Material Design 1 guidelines](https://m1.material.io/style/icons.html), the archived page Material Design 1 is pinned to, with [Bidirectionality](https://m1.material.io/usability/bidirectionality.html) for the RTL rules. Grid, sizes, ink and mirroring. This page is the Vue.

## Usage

`Md1Icon` is a shell component: `name` is a role, `size` picks the 24 dp or the 20 dp dense form, and `label` turns a decorative glyph into an announced image. The glyph draws in `currentColor`, so the colour, and with it the ink tier, comes from where you put it.

87 drawings answer to 114 names. 27 names are aliases: `clear` draws `close`, and `calendar` draws `event`.

::: ds-example
/systems/md1/icon/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'
</script>

<template>
  <Md1Icon name="menu" />
</template>
```

## Composed on Vuetify0

There is no v0 icon component; `Md1Icon` is built on a Vuetify0 composable instead. The registry is a [createTokens](/composables/registration/create-tokens) instance, and alias resolution is `createTokens`' own. An alias is stored as the literal reference `{close}` and dereferenced when it is read, so `clear` and `close` are two entries over one array of path data, and overriding `close` moves both.

The registry is installed by a [createPluginContext](/composables/foundation/create-plugin) trinity: `createMd1IconsContext`, `createMd1IconsPlugin` and `useMd1Icons`, under the `md1:icons` key. `createMd1Plugin` composes the icons plugin for you. The trinity carries a fallback, so `Md1Icon` draws the built-in set in an app with no Material Design 1 plugin installed at all; that set is built once on first use and shared. The `namespace` prop exists for the remaining case, a subtree given its own registry under a key of its own.

What `Md1Icon` adds is the renderer: one `<svg viewBox="0 0 24 24" fill="currentColor">` with a `<path>` per string of the glyph, the `data-size` attribute that sets the box through `--md1-icon-size`, the `data-mirror` attribute that flips directional roles under `[dir="rtl"]`, and the `aria-hidden` or `role="img"` pair. A role that resolves to nothing renders nothing and logs the name in development.

## Examples

::: ds-example
/systems/md1/icon/gallery

### Every role

The whole set, iterated from `md1Icons`, the map the registry is built from and exported from the package root, with the aliases that reach each drawing listed under its name from `md1IconAliases`. The gallery cannot drift from the artwork, because it is the artwork.

Roles are named for what the glyph is, not for the screen that first needed it. The 27 aliases come from three vocabularies: Material Design 1's own words (`clear`, `done`, `calendar`, `clock`, `nearby`), the role names the Paper design systems share (`chevron-down`, `plus`, `eye`, `kebab`), and Material Icons source names whose upstream path data is identical to a shipped role (`launch`, `get-app`, `mode-edit`). Either name is valid at the call site.

The artwork is the `materialicons` filled 24 px set at commit `49d4db35`, each path byte-equal to its upstream `d` attribute. Two glyphs were redrawn upstream after the Material Design 1 era, `settings` and `account-circle`; Material Design 1 ships the current drawings, and `spec/icons.md` keeps both strings from tag `3.0.2`, the last release of the period artwork, for anyone who wants it back through the plugin.
:::

::: ds-example
/systems/md1/icon/sizes

### Sizes

The guidelines define two system icon sizes. `m`, the default, is the 24 dp icon: a 20 dp live area inside 4 dp of padding. `s` is the 20 dp form the guidelines allow when mouse and keyboard are the primary input: the same artwork scaled down, a 16 dp live area inside 2 dp of padding. There is no third size; Vuetify's small, medium and large scale is not Material Design 1.

The touch target is not the icon's. A 24 dp icon sits in a 48 dp target and a 20 dp icon in a 40 dp one, and the host control provides it; the dashed squares in the example stand in for that host.

`size` sets `data-size`, and `data-size` sets `--md1-icon-size` on the icon at zero specificity. A host rule that sets the property on the icon itself, such as `.my-host .md1-icon { --md1-icon-size: 18px; }`, outranks the prop; that is how a Material Design 1 component retunes the glyph it embeds without a prop of its own. Setting the property on the host element alone changes nothing, because the icon's own declaration beats the inherited value.
:::

::: ds-example
/systems/md1/icon/grid

### Grid and keylines

The system icon grid, drawn over the real glyphs at 800% and beside them at 100%. Every icon is designed in a 24 x 24 dp trim area; its content stays inside the 20 x 20 dp live area, with 2 dp of padding on each side that a glyph may enter only when it needs the extra weight. The guidelines call that padding 4 dp, the total across the area.[^icon-padding] Switch on Dense to see the 20 dp form: a 16 x 16 dp live area inside the same 2 dp padding, the artwork scaled rather than redrawn.

The keylines are the four core shapes that keep the set proportional, a square of 18 dp, a circle of 20 dp, and 16 x 20 dp and 20 x 16 dp rectangles, plus the diagonals and centre lines that place strokes. The row underneath matches a glyph to each shape: a check box fills the square, the account glyph the circle, the lock the vertical rectangle and the envelope the horizontal one. On the dense grid the keylines are scaled with the live area; the guidelines draw no dense keylines.[^icon-dense-keylines]
:::

::: ds-example
/systems/md1/icon/ink

### Ink

The glyph draws at full `currentColor`; the opacity tier is the host's decision, made by state. The guidelines give three: an active focused icon is 87% black on light backgrounds, an active unfocused one 54%, an inactive one 38%. On dark backgrounds the same table gives 100%, 70% and 50% white, while the page's colour section and the colour page give an active icon 100% white. Material Design 1's dark theme follows the colour section: 100% white for focused and active, 50% for inactive.[^icon-dark-active]

Material Design 1 publishes them as `--md1-icon-focused`, `--md1-icon-active` and `--md1-icon-inactive`, and switches them with the theme. Set `color` on the element around the icon, as the example does, rather than an opacity on the icon itself: an opacity would also fade a coloured glyph, such as an error mark, that should stay at full strength.
:::

::: ds-example
/systems/md1/icon/labelled

### Decorative or labelled

With no `label`, the icon renders `aria-hidden="true"` and no role. That is the common case: an icon beside its own text, as next to Projects above, or inside a labelled button repeats information the reader already has.

With `label`, the icon becomes `role="img"` with that string as its accessible name. Use it when the icon is the whole message. In the example, the check and the error mark beside each backup are the only thing that says whether it succeeded, so each carries a label: Synced, Sync failed.

An icon-only button names the button, not the glyph: pass `ariaLabel` to `Md1Button` and leave the icon decorative.
:::

::: ds-example
/systems/md1/icon/rtl

### RTL mirroring

The bidirectionality page mirrors icons that communicate direction and leaves the rest alone. 11 roles flip under `[dir="rtl"]`: `arrow-back`, `arrow-forward`, `arrow-right`, `chevron-left`, `chevron-right`, `first-page`, `last-page`, `send`, `sort`, `open-in-new` and `label`. Aliases follow the role they resolve to, so `keyboard-arrow-left` and `launch` flip too.

The rest stay put, each for a reason the page states. Clocks turn clockwise in every language, so `schedule` and `history` do not flip; media controls point the way the media plays, so `play-arrow` does not; the search handle is held in the right hand, so `search` does not; slashes are left as they are, so `visibility-off` does not.

`help` and `help-outline` are the conditional roles. A question mark mirrors in Arabic and Farsi but not in Hebrew, so it flips under `dir="rtl"` unless the element sits in `lang="he"`. The second and third rows of the example show the difference. Read the rows from their start edge: the RTL rows also run right to left, so `arrow-back` is the rightmost glyph and points right, toward the start of the line.

The flip is a `transform: scaleX(-1)` keyed off any `[dir="rtl"]` ancestor, the mechanism Google documents for Material Icons on the web. It needs no plugin, and a `dir="rtl"` subtree inside a left-to-right page mirrors on its own. The reverse does not hold: an icon inside a `dir="ltr"` island of a right-to-left page still flips, because the rule matches any right-to-left ancestor.
:::

::: ds-example
/systems/md1/icon/custom

### A custom collection

The set is closed on purpose: it holds the glyphs Material Design 1's own components need. Anything else is yours to add through the plugin. `icons` merges glyphs over the built-in set, where an existing key replaces its artwork and a new key extends the vocabulary. `aliases` adds `role -> target` references, and a bare target is wrapped for you. `mirrors` adds RTL rulings to the mirror table: `true` flips a glyph that communicates direction under `dir="rtl"`, `'conditional'` flips it everywhere but Hebrew, and `false` takes a built-in role out.

```ts main.ts
import { createMd1Plugin } from '@paper/md1'

app.use(createMd1Plugin({
  icons: {
    icons: { print: ['M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z'] },
    aliases: { printer: 'print' },
  },
}))
```

`createMd1IconsPlugin` takes the same options on its own. The example cannot install a plugin, so it provides the same registry to its own subtree with `createMd1IconsContext`, and everything inside it resolves against that: `Md1Button icon="print"` draws the new glyph through its own `Md1Icon`. Replacing a role the same way restyles every Material Design 1 component that draws it, which is why no component inlines its own artwork.

A glyph is an array of path `d` strings drawn into the 24 x 24 viewBox with `fill="currentColor"` and no stroke. Material Icons filled artwork drops in as is; stroked artwork will render as solid shapes.
:::

### Licence

The glyphs are [Material Icons](https://github.com/google/material-design-icons), Copyright Google LLC, used under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0). Path data comes from the `materialicons` filled 24 px sources at commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4`; the 24 x 24 background rectangle is removed from each file and no glyph geometry is changed. Icons are renamed to Material Design 1 role names, and `spec/icons.md` lists the Material Icons source name of every role. Google does not endorse this package.

The package ships the notice and the full licence text as `LICENSE-ICONS`. `@paper/md1` itself is MIT. Glyphs you add through the plugin carry their own licence.

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Icon.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Md1IconName` | | **Required.** The role to draw, canonical or alias. Any string also type-checks, so a role registered through the plugin works |
| `label` | `string` | | Accessible name. Set it only when the icon is the whole message; it turns the icon from `aria-hidden` into `role="img"` |
| `size` | `'m' \| 's'` | `'m'` | `m` is the 24 dp system icon; `s` is the 20 dp dense form for mouse and keyboard layouts |
| `namespace` | `string` | | The registry to resolve against. Only needed when a subtree was given its own set under a key other than `md1:icons` |

There are no slots.

### Data attributes

| Attribute | Values | Set when |
|-----------|--------|----------|
| `data-size` | `m`, `s` | Always; selects the 24 dp or 20 dp box |
| `data-mirror` | `true`, `conditional` | The resolved role flips in RTL; `conditional` is `help` and `help-outline`, which stay put under `:lang(he)` |

### Exports

| Export | What it is |
|--------|------------|
| `md1Icons` | The 84 canonical glyphs, role to path data |
| `md1IconAliases` | The 27 aliases, role to `{target}` reference |
| `md1IconMirrors` | The 13 roles that flip in RTL, `true` or `'conditional'` |
| `createMd1IconsPlugin` | Installs the registry on an app; takes `icons`, `aliases`, `mirrors` and `namespace` |
| `createMd1IconsContext` | The same registry as a context trinity, for a subtree |
| `useMd1Icons` | Reads the registry in scope, or the built-in set when none is installed |
| `createMd1Icons` | Builds a bare registry from the same options, with no context or plugin around it |
| `MD1_ICONS_NAMESPACE` | `'md1:icons'`, the key the plugin and `useMd1Icons` default to |

## Accessibility

The component has one accessibility contract, and it is the `label` prop.

| `label` | Rendered attributes | Reads as |
|---------|---------------------|----------|
| absent | `aria-hidden="true"` | Nothing; skipped |
| set | `role="img"`, `aria-label` | An image with that name |

An empty string counts as absent: `label=""` renders `aria-hidden="true"`.

Never label an icon inside an interactive element. The element takes the name, `ariaLabel` on an icon-only `Md1Button` or the text of a link; a labelled icon inside it makes the name read twice. Never let a coloured glyph carry state on its own either. A red error mark says nothing to a screen reader, or to a reader who cannot tell the red apart: label it, or put the state in text beside it.

The icon is not focusable and has no keyboard behaviour. Its touch target, 48 dp around a 24 dp icon and 40 dp around a 20 dp one, belongs to the control that hosts it.

[^icon-padding]: Our call: the page says 4 dp of padding around a 20 dp live area in a 24 dp trim, which only adds up as 2 dp per side.

[^icon-dense-keylines]: Our call: the page draws no dense keylines, so the example scales the standard ones by 16/20.

[^icon-dark-active]: Our call: the table's 70% is the dark secondary-text tier, so it is read as a transcription slip. Vuetify 1.5.24 also draws an active dark icon at 100% white (stylus/settings/_theme.styl:136).
