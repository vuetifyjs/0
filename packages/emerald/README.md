# @paper/emerald

Emerald design system — Wave 1–2 preview.

Figma-sourced tokens + thin Vue wrappers over `@vuetify/v0` compounds.

## Install (workspace)

```ts
import { createApp } from 'vue'
import { createEmeraldPlugin, EmButton } from '@paper/emerald'
import '@paper/emerald/theme.css' // tokens (zero-config; baked onto :root + [data-theme=emerald])
import '@paper/emerald/style.css' // component CSS (required for Em* styling)

const app = createApp(App)
// Optional for runtime theme switch / CSP nonces when theme.css is already imported.
// Pass { theme: false } if the host already installs createThemePlugin.
app.use(createEmeraldPlugin())
```

## Components

**Wave 1:** `EmButton` · `EmTextField` · `EmCheckbox` · `EmSwitch` · `EmDialog*` · `EmSelect*`

**Wave 2:** `EmAlert*` · `EmCard*` · `EmTag` · `EmAvatar*` · `EmTabs*` · `EmPagination*` · `EmSlider`

See [SPEC.md](./SPEC.md). Kitchen sink: `dev` → `/emerald`.

## Build

```bash
pnpm --filter @paper/emerald build   # tsdown + theme.css bake
pnpm --filter @paper/emerald typecheck
```
