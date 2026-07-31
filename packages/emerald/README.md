# @paper/emerald

Emerald design system — Wave 1–2 preview.

Figma-sourced tokens + thin Vue wrappers over `@vuetify/v0` compounds.

## Install (workspace)

```ts
import { createApp } from 'vue'
import { createEmeraldPlugin, EmButton } from '@paper/emerald'
import '@paper/emerald/theme.css' // design tokens (--emerald-*, kit --v0-* aliases)
import '@paper/emerald/style.css' // Em* component CSS

const app = createApp(App)
app.use(createEmeraldPlugin()) // wires adapter + default emerald theme — no manual adapter setup
```

That is the whole install. Do **not** construct `EmeraldStyleSheetAdapter` yourself unless the host already runs `createThemePlugin` and you pass `{ theme: false }` to opt out of Emerald’s install.

## Components

**Wave 1:** `EmButton` · `EmTextField` · `EmCheckbox` · `EmSwitch` · `EmDialog*` · `EmSelect*`

**Wave 2:** `EmAlert*` · `EmCard*` · `EmTag` · `EmAvatar*` · `EmTabs*` · `EmPagination*` · `EmSlider`

See [SPEC.md](./SPEC.md). Kitchen sink: `dev` → `/emerald`.

## Build

```bash
pnpm --filter @paper/emerald build   # tsdown + theme.css bake
pnpm --filter @paper/emerald typecheck
```
