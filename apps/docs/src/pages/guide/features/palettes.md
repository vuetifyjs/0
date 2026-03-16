---
title: Palettes - Pre-built Color Systems and Generators
features:
  order: 2
  level: 2
meta:
  - name: description
    content: Use pre-built color palettes from Material Design, Tailwind, Radix, and Ant Design. Generate complete themes from a single seed color with algorithmic adapters.
  - name: keywords
    content: vuetify0, palettes, color palette, material design, tailwind colors, theme generation, seed color, dynamic color
related:
  - /guide/features/theming
  - /composables/plugins/use-theme
  - /composables/registration/create-tokens
---

<script setup>
  import DocsPaletteExplorer from '@/components/docs/DocsPaletteExplorer.vue'
</script>

# Palettes

v0 ships pre-built color data from popular design systems and generator adapters that create complete themes from a single brand color.

<DocsPageFeatures :frontmatter />

<DocsPaletteExplorer />

## Static Palettes

| Import | Source | Hues | Shades |
| - | - | - | - |
| `@vuetify/v0/palettes/md1` | Material Design 1 | 16 | 50-900, A100-A700 |
| `@vuetify/v0/palettes/md2` | Material Design 2 | 19 | 50-900, A100-A700 |
| `@vuetify/v0/palettes/material` | Material Design 3 | 6 groups | tones 0-100 |
| `@vuetify/v0/palettes/tailwind` | Tailwind CSS | 22 | 50-950 |
| `@vuetify/v0/palettes/radix` | Radix Colors | 31 | 1-12 |
| `@vuetify/v0/palettes/ant` | Ant Design | 12 | 1-10 |

```ts
import { tailwind } from '@vuetify/v0/palettes/tailwind'

app.use(
  createThemePlugin({
    palette: { tw: tailwind },
    themes: {
      light: {
        colors: {
          primary: '{palette.tw.blue.500}',
          secondary: '{palette.tw.slate.600}',
          error: '{palette.tw.red.500}',
        },
      },
    },
  })
)
```

> [!TIP]
> Static palettes are just data — they must be namespaced under a key in the `palette` option.

## Generator Adapters

Generator adapters take a single brand color and produce a complete `palette` + `themes` object ready to pass to `createThemePlugin`. Each adapter wraps a third-party color algorithm.

### Material

Uses Google's `@material/material-color-utilities` to generate tonal palettes following the Material Design 3 color system.

:::: code-group

```bash pnpm
pnpm add @material/material-color-utilities
```

```bash npm
npm install @material/material-color-utilities
```

```bash yarn
yarn add @material/material-color-utilities
```

```bash bun
bun add @material/material-color-utilities
```

::::

```ts
import { material } from '@vuetify/v0/palettes/material/generate'

const { palette, themes } = material('#6750A4')

app.use(createThemePlugin({ palette, themes }))
```

The `variant` option controls how the seed color influences secondary and tertiary roles: `tonalSpot` (default), `vibrant`, `expressive`, `fidelity`, `monochrome`, `neutral`.

### Ant Design

Uses `@ant-design/colors` to generate 10-shade ramps from a seed color.

:::: code-group

```bash pnpm
pnpm add @ant-design/colors
```

```bash npm
npm install @ant-design/colors
```

```bash yarn
yarn add @ant-design/colors
```

```bash bun
bun add @ant-design/colors
```

::::

```ts
import { ant } from '@vuetify/v0/palettes/ant/generate'

const { palette, themes } = ant('#1677ff')

app.use(createThemePlugin({ palette, themes }))
```

### Leonardo

Uses Adobe's `@adobe/leonardo-contrast-colors` to generate perceptually uniform ramps based on target contrast ratios against a background.

:::: code-group

```bash pnpm
pnpm add @adobe/leonardo-contrast-colors
```

```bash npm
npm install @adobe/leonardo-contrast-colors
```

```bash yarn
yarn add @adobe/leonardo-contrast-colors
```

```bash bun
bun add @adobe/leonardo-contrast-colors
```

::::

```ts
import { leonardo } from '@vuetify/v0/palettes/leonardo/generate'

const { palette, themes } = leonardo('#0ea5e9')

app.use(createThemePlugin({ palette, themes }))
```

## Overriding Colors

Use `mergeDeep` to override specific colors from a generated theme:

```ts
import { mergeDeep } from '@vuetify/v0'
import { material } from '@vuetify/v0/palettes/material/generate'

const { palette, themes } = material('#6750A4', { variant: 'vibrant' })

app.use(
  createThemePlugin({
    palette,
    themes: mergeDeep(themes, {
      light: {
        colors: {
          error: '#B00020',
        },
      },
    }),
  })
)
```

## Mixing Palettes

Combine generated palettes with static palette data by spreading them together:

```ts
import { mergeDeep } from '@vuetify/v0'
import { material } from '@vuetify/v0/palettes/material/generate'
import { tailwind } from '@vuetify/v0/palettes/tailwind'

const { palette: generated, themes } = material('#1B6EF3')

app.use(
  createThemePlugin({
    palette: { ...generated, tw: tailwind },
    themes: mergeDeep(themes, {
      light: {
        colors: {
          accent: '{palette.tw.amber.500}',
        },
      },
    }),
  })
)
```

## Custom Adapters

The `PaletteGenerator` type is exported from `@vuetify/v0` for building custom adapters that conform to the same `{ palette, themes }` return shape.
