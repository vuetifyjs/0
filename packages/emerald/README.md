# @paper/emerald

Emerald design system — Wave 1.

Figma-sourced tokens + thin Vue wrappers over `@vuetify/v0` compounds.

## Install (workspace)

```ts
import { createApp } from 'vue'
import { createEmeraldPlugin, EmButton } from '@paper/emerald'
import '@paper/emerald/theme.css' // tokens (zero-config; plugin also injects at runtime)
import '@paper/emerald/style.css' // component CSS (required for Em* styling)

const app = createApp(App)
app.use(createEmeraldPlugin()) // optional if theme.css is imported and data-theme is set
```

## Wave 1 components

`EmButton` · `EmTextField` · `EmCheckbox` · `EmSwitch` · `EmDialog*` · `EmSelect*`

See [SPEC.md](./SPEC.md).

## Build

```bash
pnpm --filter @paper/emerald build   # tsdown + theme.css bake
pnpm --filter @paper/emerald typecheck
```
