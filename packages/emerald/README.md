# @paper/emerald

Emerald design system — Wave 1–2 preview.

The first commercial skin on **@vuetify/v0**: Figma tokens + thin Em* wrappers that
**compose** v0 compounds. Emerald exists to show that v0 is easy to adopt and still
feature-rich — behavior stays headless; Emerald only paints.

## Why Emerald

| | |
|---|---|
| **v0** | Headless OS — state, a11y, compounds |
| **Emerald** | Commercial design system — tokens, CSS, Em* chrome |

If you can ship a polished app with two CSS imports and a plugin, the credit goes to
the stack under Em*. Full contract: [SPEC.md](./SPEC.md) (*Purpose — Emerald exists
to sell v0*).

## Install (workspace)

```ts
import { createApp } from 'vue'
import { createEmeraldPlugin, EmButton } from '@paper/emerald'
import '@paper/emerald/theme.css' // design tokens (--emerald-*, kit --v0-* aliases)
import '@paper/emerald/style.css' // Em* component CSS

const app = createApp(App)
app.use(createEmeraldPlugin()) // wires adapter + default emerald theme — no manual adapter setup
```

That is the whole install. Do **not** construct `EmeraldStyleSheetAdapter` yourself
unless the host already runs `createThemePlugin` and you pass `{ theme: false }`.

## Consumer rules (short)

- No named slots on Em* — props + default slot, or multi-file compounds (Dialog/Select/…)
- No Paper / `V0Paper` middle layer
- Shells (Button, Checkbox, TextField, …) for fixed anatomy; compounds for variable trees

## Components

**Wave 1:** `EmButton` · `EmTextField` · `EmCheckbox` · `EmSwitch` · `EmDialog*` · `EmSelect*`

**Wave 2:** `EmAlert*` · `EmCard*` · `EmTag` · `EmAvatar*` · `EmTabs*` · `EmPagination*` · `EmSlider`

Kitchen sink: `dev` → `/emerald`.

## Build

```bash
pnpm --filter @paper/emerald build   # tsdown + theme.css bake
pnpm --filter @paper/emerald typecheck
```
