<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
    <img alt="Vuetify Zero Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@paper/quantum"><img src="https://img.shields.io/npm/v/%40paper%2Fquantum.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@paper/quantum"><img src="https://img.shields.io/npm/dm/%40paper%2Fquantum.svg" alt="Downloads"></a>
  <br>
  <a href="https://github.com/vuetifyjs/0/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/%40paper%2Fquantum.svg" alt="License"></a>
  <a href="https://discord.gg/vuetify"><img src="https://img.shields.io/discord/1513968811047522396?logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord"></a>
</p>

# @paper/quantum

Quantum design system: Material Design 1 (the 2014 to 2017 guidelines, codename
"Quantum Paper") on **@vuetify/v0**.

The complete, exclusive implementation of one closed specification: the MD1
palette, type scale, elevation and motion as tokens, and thin `Qu*` wrappers
that **compose** v0 compounds. Behavior stays headless in v0; Quantum only
paints.

## Why Quantum

| | |
|---|---|
| **v0** | Headless OS: state, accessibility, compounds |
| **Quantum** | Design system: tokens, CSS, `Qu*` chrome |

Quantum proves the Paper design-system contract against a spec Google can no
longer move. Full contract: [SPEC.md](./SPEC.md); the family rules:
[DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

## Install

```bash
pnpm add @paper/quantum
```

```ts
import { createApp } from 'vue'
import { createQuantumPlugin, QuButton } from '@paper/quantum'
import '@paper/quantum/theme.css' // design tokens (--quantum-*, kit --v0-* aliases)
import '@paper/quantum/style.css' // Qu* component CSS, type and elevation utilities

const app = createApp(App)
app.use(createQuantumPlugin()) // adapter, default themes, icons, reduced motion
```

That is the whole install. Do **not** construct `QuantumStyleSheetAdapter`
yourself unless the host already runs `createThemePlugin` and you pass
`{ theme: false }`.

Two themes ship: `quantum-light` (default) and `quantum-dark`. The plugin follows
the OS color scheme until you call `useTheme().select('quantum-dark')`. On the
CSS-only path (`theme.css` alone, no plugin) set `data-theme="quantum-dark"` on
any subtree; every `--quantum-*` color flips and light stays the `:root` default.

### Plugin options

| Option | Type | Default | What it does |
|---|---|---|---|
| `theme` | `ThemePluginOptions \| false` | Quantum defaults | Merged over the defaults (`quantum-light` / `quantum-dark`, the adapter, `system` following the OS). `false` when the host installs `createThemePlugin` itself and registers `QuantumStyleSheetAdapter` plus `quantumColors` / `quantumDarkColors` |
| `icons` | `QuantumIconsPluginOptions \| false` | installed | Forwarded to `createQuantumIconsPlugin`; `{ icons: { ... } }` overrides or extends roles. `false` skips the install; `QuIcon` falls back to the built-in set. Skipping does not shrink the bundle (the glyph map survives tree-shaking, ruling 6) |
| `reducedMotion` | `ReducedMotionPluginOptions \| false` | installed | Forwarded to v0's `createReducedMotionPlugin`; `QuRipple` reads `useReducedMotion().isReduced`. `false` when the host installs the plugin itself. The stylesheets stay gated on `prefers-reduced-motion` either way |

Another hue pair, derived from the palette the way the color page derives the
default (500 / 700 / 100 for the primary, A200 / A100 for the accent):

```ts
import { createQuantumPlugin, quantumHueTheme } from '@paper/quantum'

const teal = quantumHueTheme('teal', 'amber')

app.use(createQuantumPlugin({
  theme: {
    themes: {
      'quantum-light': { colors: teal.light },
      'quantum-dark': { colors: teal.dark, dark: true },
    },
  },
}))
```

## Tokens

Every design value is a `--quantum-*` custom property; components read them with
the spec literal as the fallback, so they render the default look even before
the plugin or `theme.css` is wired.

| Family | Tokens | Where |
|---|---|---|
| Palette | `--quantum-<hue>-<shade>` for the 19 hues (50 to 900, A100 to A700 where they exist), `--quantum-black`, `--quantum-white`: 256 values from `@vuetify/v0/palettes/md1` and the color page | `:root` |
| Roles | `--quantum-primary`, `-primary-dark`, `-primary-light`, `-accent`, `-accent-light`, `-accent-control`, `-on-primary`, `-on-accent`, `-error`, `-app-bar`, `-background`, `-surface` | per theme |
| Ink and state | `--quantum-text-primary` / `-secondary` / `-disabled` / `-hint`, `-divider`, `-icon-active` / `-inactive` / `-focused`, `-focus`, `-pressed`, `-hover`, `-button-disabled`, `-button-disabled-text`, `-scrim`, `-scrim-sheet`, `-snackbar`, `-tooltip`, `-chip`, `-grid-list-bar`, `-selection` | per theme |
| Typography | `--quantum-font-family`, `--quantum-font-weight-*`, and `--quantum-type-<style>-size` / `-weight` / `-leading` / `-tracking` / `-transform` for the 13 styles (`display-4` to `menu`) | `:root`; desktop sizes under `(pointer: fine)`, dense and tall script scales under `:lang()` |
| Elevation | `--quantum-elevation-0` to `-24`, composed from `--quantum-shadow-umbra` / `-penumbra` / `-ambient` | per theme (so a theme can retune them) |
| Motion | `--quantum-easing-standard` / `-decelerate` / `-accelerate` / `-sharp`, `--quantum-duration-enter` / `-leave` / `-standard` / `-complex`, `--quantum-stagger`, `--quantum-ripple-duration` | `:root`; tablet and desktop durations by media query |
| Layout | `--quantum-spacing-1` to `-5`, `--quantum-keyline-margin`, `-keyline-content`, `-increment`, `-touch-target`, `-radius`, `-radius-box`, `-icon-size`, `-icon-size-dense`, `-avatar-size` | `:root`; tablet keylines from 600 px |

Every per-theme color also ships as `--quantum-<key>-channels: r g b` for
alpha composition (`rgb(var(--quantum-primary-channels) / 12%)`). Breakpoints
cannot be custom properties: `quantumBreakpoints` is the JS map of the spec's
named widths with the 16 px desktop reduction applied. The whole dictionary is
exported as `quantumDesignSystem`.

`style.css` also ships two utility families for compositions outside the
component set: `quantum-type-<style>` (the 13 type styles with their ink tier,
desktop and script switches built in) and `quantum-elevation-<n>` (0 to 24).

### The v0 bridge

The adapter mirrors the color roles kits read onto `--v0-*` on both theme
blocks (`--v0-primary`, `--v0-surface`, `--v0-on-surface`, `--v0-surface-tint`,
`--v0-background`, `--v0-divider`, `--v0-border`, `--v0-pre`, `--v0-accent`,
`--v0-error`, and the kit severities `--v0-info` / `--v0-success` /
`--v0-warning` with their `on-*`), so Genesis docs chrome hosted on a Quantum
page inherits the theme. Pass `{ v0Aliases: false }` to
`QuantumStyleSheetAdapter` to turn the bridge off.

## Icons

Glyphs are Material Icons at the pinned commit (filled, 24 x 24 grid), drawn
through `QuIcon` by **role** (`close`, `check`, `menu`, `arrow-back`, ...).
Override or extend roles through the plugin:

```ts
app.use(createQuantumPlugin({
  icons: {
    icons: { search: ['M15.5 14h-.79l-.28-.27 ...'] }, // one 24 x 24 path per entry
    aliases: { find: 'search' },
  },
}))
```

Directional roles mirror under `dir="rtl"`.

The glyphs in @paper/quantum are Material Icons, Copyright Google LLC,
https://github.com/google/material-design-icons, used under the
Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0).

Path data was taken from the "materialicons" (filled) 24px SVG sources at
commit 49d4db35df873165d6bd6ba09b063c7dafbac2f4. Modifications: the 24x24 background
rectangle was removed from each file and the remaining <path d> strings were
stored as data; no glyph geometry was changed. Icons are renamed to Quantum
role names; the Material Icons source name of every glyph is listed in
packages/quantum/spec/icons.md. Google does not endorse this package.

The full license text ships with the package as
[LICENSE-ICONS](./LICENSE-ICONS); the Vue package itself is MIT.

## Consumer rules (short)

- No named slots on `Qu*`: props plus the default slot, or compound parts
  (`QuDialog.Title`, `QuList.Item`)
- API is the spec's vocabulary (`dense`, `raised`, `mini`), never Vuetify's
  (`density`, `ripple`, `to`)
- Every interactive component hosts a `QuRipple`; there is no prop to remove it
- Dark surfaces are scoped with v0's `<Theme theme="quantum-dark">`

## Escape hatch

A piece MD1 does not contain is yours to compose: a v0 primitive plus the
`--quantum-*` tokens, the `quantum-type-*` and `quantum-elevation-*` classes and
`QuRipple`. That composition is unsupported as a Quantum component; the holes
are listed under "Known limitations" in [SPEC.md](./SPEC.md).

## Pinned spec

Material Design, 2014 to 2017 guidelines, Wayback snapshot 2018-12-25 of
`material.io/archive/guidelines` (mirror: `m1.material.io`). Vuetify 1.5.24 is
a numeric cross-check only. The research notes under [spec/](./spec) carry
every value with its source and confidence.

## Build

```bash
pnpm build:0                            # once: the theme bake reads the md1 palette through @vuetify/v0's build output
pnpm --filter @paper/quantum build      # tsdown (dist/index.mjs, dist/style.css) + theme.css bake
pnpm --filter @paper/quantum typecheck
pnpm --filter @paper/quantum test:browser
```
