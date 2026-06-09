---
title: useReducedMotion - Reduced Motion Support for Vue 3
meta:
- name: description
  content: Reduced-motion plugin for respecting or overriding the prefers-reduced-motion media query. Reactive reduced boolean, three-way mode override, and a body data attribute for CSS-only consumers.
- name: keywords
  content: useReducedMotion, prefers-reduced-motion, reduced motion, accessibility, animation, composable, Vue 3, a11y
features:
  category: Plugin
  label: 'E: useReducedMotion'
  github: /composables/useReducedMotion/
  level: 2
related:
  - /composables/system/use-media-query
  - /composables/plugins/use-theme
  - /guide/features/accessibility
---

# useReducedMotion

Respect or override the user's `prefers-reduced-motion` setting, with a reactive flag and a body data attribute for CSS-only consumers.

<DocsPageFeatures :frontmatter />

## Installation

Install the reduced-motion plugin in your app's entry point:

```ts main.ts collapse
import { createApp } from 'vue'
import { createReducedMotionPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createReducedMotionPlugin({ mode: 'system' }))

app.mount('#app')
```

## Usage

```ts collapse
import { useReducedMotion } from '@vuetify/v0'

const motion = useReducedMotion()

// Should motion be minimized right now?
motion.isReduced.value // true | false

// Override at runtime
motion.select('always') // force reduce
motion.select('never') // force full motion
motion.select('system') // follow the OS setting
```

## Modes

The `selectedMode` decides how the OS preference is interpreted.

| Mode | Behavior |
| - | - |
| `system` | Follow `prefers-reduced-motion` (default) |
| `always` | Force `isReduced` to `true`, ignoring the OS |
| `never` | Force `isReduced` to `false`, ignoring the OS |

Need the raw OS preference regardless of `selectedMode`? Call [usePrefersReducedMotion](/composables/system/use-media-query) directly.

### Persisting the override

Pass `persist: true` to remember a user's manual override across reloads. This requires the storage plugin to be installed:

```ts main.ts
import { createStoragePlugin, createReducedMotionPlugin } from '@vuetify/v0'

app.use(createStoragePlugin())
app.use(createReducedMotionPlugin({ persist: true }))
```

## Reactivity

| Property | Reactive | Notes |
| - | :-: | - |
| `selectedMode` | <AppSuccessIcon /> | Active override mode (`'system' \| 'always' \| 'never'`) |
| `isReduced` | <AppSuccessIcon /> | `true` when motion should be minimized, considering `selectedMode` |
| `select(mode)` | <AppErrorIcon /> | Set the active mode |

## Adapters

Adapters control how the reduced-motion state is applied to the DOM. The default writes a body data attribute in the browser and renders the same attribute via [@unhead](https://unhead.unjs.io/) on the server, so SSR/SSG pages carry it in the initial HTML — no motion flash before hydration.

| Adapter | Import | Description |
|---------|--------|-------------|
| `V0ReducedMotionAdapter` | `@vuetify/v0` | Browser: writes `document.body.dataset.reducedMotion`. Server: pushes `bodyAttrs` via `@unhead`. Default. |

### Custom Adapters

Implement `ReducedMotionAdapter` to apply the state your own way. Stash any teardown on `this.dispose` — the plugin registers it on `app.onUnmount`, so it is cleaned up on app unmount:

```ts
import { ReducedMotionAdapter, createReducedMotionPlugin } from '@vuetify/v0'
import type { ReducedMotionAdapterSetupContext } from '@vuetify/v0'
import type { App } from 'vue'
import { watch } from 'vue'

class ClassReducedMotionAdapter extends ReducedMotionAdapter {
  setup (app: App, context: ReducedMotionAdapterSetupContext) {
    function sync (reduced: boolean) {
      document.documentElement.classList.toggle('reduce-motion', reduced)
    }

    sync(context.isReduced.value)
    this.dispose = watch(context.isReduced, sync)
  }
}

app.use(createReducedMotionPlugin({ adapter: new ClassReducedMotionAdapter() }))
```

## Standalone Usage

Use `createReducedMotion` to create a raw context without the plugin system — useful for testing or embedding in another composable. The standalone context does not set the body data attribute:

```ts
import { createReducedMotion } from '@vuetify/v0'

const motion = createReducedMotion({ mode: 'system' })

motion.isReduced.value // tracks the OS setting
motion.select('always')
motion.isReduced.value // true
```

When `useReducedMotion` is called without an installed plugin, it returns a no-op fallback (`isReduced` is `false`, `select` does nothing), so consuming code never throws.

## Styling

When installed, the plugin sets `data-reduced-motion="reduce" | "no-preference"` on `document.body` (and renders it server-side via `@unhead`, so it is present before hydration), so stylesheets can respond without any JavaScript:

```css
[data-reduced-motion="reduce"] * {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

## Examples

::: example
/composables/use-reduced-motion/basic

### Mode switching

Toggle between the three modes and watch `isReduced` flip. The bouncing dot stops the moment motion is reduced — either because the OS reports `prefers-reduced-motion: reduce` in `system` mode, or because `always` forces it. The raw OS readout — pulled from `usePrefersReducedMotion` — shows what the system reports independent of the override, which is what you would surface in a settings panel so users see their system preference versus what the app is applying.

| File | Role |
|------|------|
| `basic.vue` | Mode switcher, reactive `isReduced` chip, and a data-attribute-gated animation |
:::

<DocsApi />
