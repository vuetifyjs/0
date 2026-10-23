<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
    <img alt="Vuetify Zero Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@paper/md1"><img src="https://img.shields.io/npm/v/%40paper%2Fmd1.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@paper/md1"><img src="https://img.shields.io/npm/dm/%40paper%2Fmd1.svg" alt="Downloads"></a>
  <br>
  <a href="https://github.com/vuetifyjs/0/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/%40paper%2Fmd1.svg" alt="License"></a>
  <a href="https://discord.gg/vuetify"><img src="https://img.shields.io/discord/1513968811047522396?logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord"></a>
</p>

# @paper/md1

Material Design 1 design system (the 2014 to 2017 guidelines, codename
"Quantum Paper") on **@vuetify/v0**.

The complete, exclusive implementation of one closed specification: the MD1
palette, type scale, elevation and motion as tokens, and thin `Md1*` wrappers
that **compose** v0 compounds. Behavior stays headless in v0; Material Design 1 only
paints.

## Why Material Design 1

| | |
|---|---|
| **v0** | Headless OS: state, accessibility, compounds |
| **Material Design 1** | Design system: tokens, CSS, `Md1*` chrome |

Material Design 1 proves the Paper design-system contract against a spec Google can no
longer move. Full contract: [SPEC.md](./SPEC.md); the family rules:
[DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

## Install

```bash
pnpm add @paper/md1
```

```ts
import { createApp } from 'vue'
import { createMd1Plugin, Md1Button } from '@paper/md1'
import '@paper/md1/theme.css' // design tokens (--md1-*, kit --v0-* aliases)
import '@paper/md1/style.css' // Md1* component CSS, type and elevation utilities

const app = createApp(App)
app.use(createMd1Plugin()) // adapter, default themes, icons, reduced motion
```

That is the whole install. Do **not** construct `Md1StyleSheetAdapter`
yourself unless the host already runs `createThemePlugin` and you pass
`{ theme: false }`.

Two themes ship: `md1-light` (default) and `md1-dark`. The plugin follows
the OS color scheme until you call `useTheme().select('md1-dark')`. On the
CSS-only path (`theme.css` alone, no plugin) set `data-theme="md1-dark"` on
any subtree; every `--md1-*` color flips and light stays the `:root` default.

### Plugin options

| Option | Type | Default | What it does |
|---|---|---|---|
| `theme` | `ThemePluginOptions \| false` | Material Design 1 defaults | Merged over the defaults (`md1-light` / `md1-dark`, the adapter, `system` following the OS). `false` when the host installs `createThemePlugin` itself and registers `Md1StyleSheetAdapter` plus `md1Colors` / `md1DarkColors` |
| `icons` | `Md1IconsPluginOptions \| false` | installed | Forwarded to `createMd1IconsPlugin`; `{ icons: { ... } }` overrides or extends roles. `false` skips the install; `Md1Icon` falls back to the built-in set. Skipping does not shrink the bundle (the glyph map survives tree-shaking, ruling 6) |
| `reducedMotion` | `ReducedMotionPluginOptions \| false` | installed | Forwarded to v0's `createReducedMotionPlugin`; `Md1Ripple` reads `useReducedMotion().isReduced`. `false` when the host installs the plugin itself. The stylesheets stay gated on `prefers-reduced-motion` either way |

Another hue pair, derived from the palette the way the color page derives the
default (500 / 700 / 100 for the primary, A200 / A100 for the accent):

```ts
import { createMd1Plugin, md1HueTheme } from '@paper/md1'

const teal = md1HueTheme('teal', 'amber')

app.use(createMd1Plugin({
  theme: {
    themes: {
      'md1-light': { colors: teal.light },
      'md1-dark': { colors: teal.dark, dark: true },
    },
  },
}))
```

## Tokens

Every design value is a `--md1-*` custom property; components read them with
the spec literal as the fallback, so they render the default look even before
the plugin or `theme.css` is wired.

| Family | Tokens | Where |
|---|---|---|
| Palette | `--md1-<hue>-<shade>` for the 19 hues (50 to 900, A100 to A700 where they exist), `--md1-black`, `--md1-white`: 256 values from `@vuetify/v0/palettes/md1` and the color page | `:root` |
| Roles | `--md1-primary`, `-primary-dark`, `-primary-light`, `-accent`, `-accent-light`, `-accent-control`, `-on-primary`, `-on-accent`, `-error`, `-app-bar`, `-background`, `-surface` | per theme |
| Ink and state | `--md1-text-primary` / `-secondary` / `-disabled` / `-hint`, `-divider`, `-icon-active` / `-inactive` / `-focused`, `-focus`, `-pressed`, `-hover`, `-button-disabled`, `-button-disabled-text`, `-scrim`, `-scrim-sheet`, `-snackbar`, `-tooltip`, `-chip`, `-grid-list-bar`, `-selection` | per theme |
| Typography | `--md1-font-family`, `--md1-font-weight-*`, and `--md1-type-<style>-size` / `-weight` / `-leading` / `-tracking` / `-transform` for the 13 styles (`display-4` to `menu`) | `:root`; desktop sizes under `(pointer: fine)`, dense and tall script scales under `:lang()` |
| Elevation | `--md1-elevation-0` to `-24`, composed from `--md1-shadow-umbra` / `-penumbra` / `-ambient` | per theme (so a theme can retune them) |
| Motion | `--md1-easing-standard` / `-decelerate` / `-accelerate` / `-sharp`, `--md1-duration-enter` / `-leave` / `-standard` / `-complex`, `--md1-stagger`, `--md1-ripple-duration` | `:root`; tablet and desktop durations by media query |
| Layout | `--md1-spacing-1` to `-5`, `--md1-keyline-margin`, `-keyline-content`, `-increment`, `-touch-target`, `-radius`, `-radius-box`, `-icon-size`, `-icon-size-dense`, `-avatar-size` | `:root`; tablet keylines from 600 px |

Every per-theme color also ships as `--md1-<key>-channels: r g b` for
alpha composition (`rgb(var(--md1-primary-channels) / 12%)`). Breakpoints
cannot be custom properties: `md1Breakpoints` is the JS map of the spec's
named widths with the 16 px desktop reduction applied. The whole dictionary is
exported as `md1DesignSystem`.

`style.css` also ships two utility families for compositions outside the
component set: `md1-type-<style>` (the 13 type styles with their ink tier,
desktop and script switches built in) and `md1-elevation-<n>` (0 to 24).

### The v0 bridge

The adapter mirrors the color roles kits read onto `--v0-*` on both theme
blocks (`--v0-primary`, `--v0-surface`, `--v0-on-surface`, `--v0-surface-tint`,
`--v0-background`, `--v0-divider`, `--v0-border`, `--v0-pre`, `--v0-accent`,
`--v0-error`, and the kit severities `--v0-info` / `--v0-success` /
`--v0-warning` with their `on-*`), so Genesis docs chrome hosted on a Material Design 1
page inherits the theme. Pass `{ v0Aliases: false }` to
`Md1StyleSheetAdapter` to turn the bridge off.

## Icons

Glyphs are Material Icons at the pinned commit (filled, 24 x 24 grid), drawn
through `Md1Icon` by **role** (`close`, `check`, `menu`, `arrow-back`, ...).
Override or extend roles through the plugin:

```ts
app.use(createMd1Plugin({
  icons: {
    icons: { search: ['M15.5 14h-.79l-.28-.27 ...'] }, // one 24 x 24 path per entry
    aliases: { find: 'search' },
  },
}))
```

Directional roles mirror under `dir="rtl"`.

The glyphs in @paper/md1 are Material Icons, Copyright Google LLC,
https://github.com/google/material-design-icons, used under the
Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0).

Path data was taken from the "materialicons" (filled) 24px SVG sources at
commit 49d4db35df873165d6bd6ba09b063c7dafbac2f4. Modifications: the 24x24 background
rectangle was removed from each file and the remaining <path d> strings were
stored as data; no glyph geometry was changed. Icons are renamed to Material Design 1
role names; the Material Icons source name of every glyph is listed in
packages/md1/spec/icons.md. Google does not endorse this package.

The full license text ships with the package as
[LICENSE-ICONS](./LICENSE-ICONS); the Vue package itself is MIT.

## Consumer rules (short)

- No named slots on `Md1*`: props plus the default slot, or compound parts
  (`Md1Dialog.Title`, `Md1List.Item`)
- API is the spec's vocabulary (`dense`, `raised`, `mini`), never Vuetify's
  (`density`, `ripple`, `to`)
- Every interactive component hosts an `Md1Ripple`; there is no prop to remove it
- Dark surfaces are scoped with v0's `<Theme theme="md1-dark">`

## Escape hatch

A piece MD1 does not contain is yours to compose: a v0 primitive plus the
`--md1-*` tokens, the `md1-type-*` and `md1-elevation-*` classes and
`Md1Ripple`. That composition is unsupported as a Material Design 1 component; the holes
are listed under "Known limitations" in [SPEC.md](./SPEC.md).

## Pinned spec

Material Design, 2014 to 2017 guidelines, Wayback snapshot 2018-12-25 of
`material.io/archive/guidelines` (mirror: `m1.material.io`). Vuetify 1.5.24 is
a numeric cross-check only. The research notes under [spec/](./spec) carry
every value with its source and confidence.

## Build

```bash
pnpm build:0                            # once: the theme bake reads the md1 palette through @vuetify/v0's build output
pnpm --filter @paper/md1 build      # tsdown (dist/index.mjs, dist/style.css) + theme.css bake
pnpm --filter @paper/md1 typecheck
pnpm --filter @paper/md1 test:browser
```
