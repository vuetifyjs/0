---
title: useRtl - RTL Direction Support for Vue 3
meta:
- name: description
  content: RTL composable for managing text direction. Reactive isRtl boolean, dir attribute management, subtree overrides, and adapter pattern for framework integration.
- name: keywords
  content: useRtl, RTL, right-to-left, direction, composable, Vue 3, accessibility, i18n
features:
  category: Plugin
  label: 'E: useRtl'
  github: /composables/useRtl/
  level: 2
related:
  - /composables/plugins/use-locale
  - /guide/features/accessibility
---

# useRtl

Right-to-left text direction management with reactive state and subtree overrides.

<DocsPageFeatures :frontmatter />

## Installation

Install the RTL plugin in your app's entry point:

```ts main.ts
import { createApp } from 'vue'
import { createRtlPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(createRtlPlugin())

app.mount('#app')
```

### With Options

```ts main.ts
app.use(
  createRtlPlugin({
    default: true, // Start in RTL mode
  })
)
```

## Usage

```ts collapse
import { useRtl } from '@vuetify/v0'

const rtl = useRtl()

// Read direction
rtl.isRtl.value // false (LTR by default)

// Toggle direction
rtl.toggle() // Now true (RTL)

// Direct assignment
rtl.isRtl.value = false // Back to LTR
```

## Reactivity

| Property | Type | Description |
| - | - | - |
| `isRtl` | `Ref<boolean>` | Writable ref — `true` for RTL, `false` for LTR |
| `toggle` | `() => void` | Flips the current direction |

## Adapters

Adapters let you swap the underlying `dir` attribute management without changing your application code.

| Adapter | Import | Description |
|---------|--------|-------------|
| `Vuetify0RtlAdapter` | `@vuetify/v0` | Sets `dir` on target element (default) |

The default adapter sets the `dir` attribute on the target element (defaults to `document.documentElement`), enabling native browser RTL support including CSS logical properties and the `:dir()` pseudo-class.

```ts
// Custom target element
app.use(createRtlPlugin({ target: '#app' }))

// Disable dir attribute management
app.use(createRtlPlugin({ target: null }))
```

### Custom Adapters

Implement `RtlAdapter` to control how RTL direction is applied to the DOM:

```ts
import type { RtlAdapter } from '@vuetify/v0'

class CustomRtlAdapter implements RtlAdapter {
  setup (app, context, target) {
    // context.isRtl — reactive ref, write to it to change direction
    // context.toggle — flips isRtl
    watchEffect(() => {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (el) el.setAttribute('dir', context.isRtl.value ? 'rtl' : 'ltr')
    })
  }
}

app.use(createRtlPlugin({ adapter: new CustomRtlAdapter() }))
```

```ts
interface RtlAdapter {
  setup: (app: App, context: { isRtl: Ref<boolean>; toggle: () => void }, target?: string | HTMLElement | null) => void
}
```

## Standalone Usage

Use `createRtl` to create a raw RTL context without the plugin system — useful for testing or embedding in other composables:

```ts
import { createRtl } from '@vuetify/v0'

const rtl = createRtl({ default: true }) // starts in RTL
rtl.isRtl.value  // true
rtl.toggle()
rtl.isRtl.value  // false
```

`createRtl` accepts `default?: boolean` (initial direction) and returns `{ isRtl: ShallowRef<boolean>, toggle: () => void }`. No `app` is required.

## Styling

The `dir` attribute set by the adapter enables three approaches to direction-aware styling with utility classes:

### Logical Properties (preferred)

CSS logical properties automatically flip based on `dir`. Use these by default:

```html
<!-- Physical (breaks in RTL) -->
<div class="ml-4 pr-2 left-0 border-l-2">...</div>

<!-- Logical (works in both directions) -->
<div class="ms-4 pe-2 start-0 border-s-2">...</div>
```

| Physical | Logical | CSS Property |
| - | - | - |
| `ml-*` / `mr-*` | `ms-*` / `me-*` | `margin-inline-start` / `end` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` | `padding-inline-start` / `end` |
| `left-*` / `right-*` | `start-*` / `end-*` | `inset-inline-start` / `end` |
| `border-l-*` / `border-r-*` | `border-s-*` / `border-e-*` | `border-inline-start` / `end` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` | `border-start-*-radius` / `end` |
| `text-left` / `text-right` | `text-start` / `text-end` | `text-align` |

> [!TIP]
> The utility class names above use UnoCSS `presetWind4` / Tailwind v4 syntax. Exact class names may vary depending on your CSS framework or preset — the underlying CSS logical properties are the same.

### Direction Variants

For cases logical properties can't handle (like `translate-x`), use the bare class as the LTR default and the `rtl:` variant as the override:

```html
<!-- Mobile drawer: slides from start edge -->
<nav class="-translate-x-full rtl:translate-x-full md:translate-x-0">
  ...
</nav>
```

> [!TIP]
> Avoid the `ltr:` variant — it only applies when an ancestor has an explicit `dir="ltr"` attribute, not as the default. Use the bare utility class for LTR behavior and `rtl:` for the RTL override.

### Symmetric Shorthand

When both sides use the same value, use `inset-x-*` instead of `left-* right-*`:

```html
<!-- Before -->
<div class="fixed left-0 right-0 top-0">...</div>

<!-- After -->
<div class="fixed inset-x-0 top-0">...</div>
```

## Subtree Overrides

Use `createRtlContext` to scope direction to a subtree — isolated from the app-level direction:

```ts
import { createRtlContext } from '@vuetify/v0'

export const [useLocalRtl, provideLocalRtl, localRtl] =
  createRtlContext({ default: true })
```

```vue collapse no-filename ParentComponent
<script setup lang="ts">
  import { provideLocalRtl } from './rtl-context'

  // Provide to all descendants
  provideLocalRtl()
</script>

<template>
  <slot />
</template>
```

```vue collapse no-filename ChildComponent
<script setup lang="ts">
  import { useLocalRtl } from './rtl-context'

  const rtl = useLocalRtl()
  // rtl.isRtl.value  → true (isolated from app-level direction)
  // rtl.toggle()     → scoped toggle, doesn't affect the rest of the app
</script>
```

> [!TIP]
> Direction is independent from locale. To connect them (e.g., Arabic → RTL), use a custom adapter that watches `useLocale().selectedId` and sets `isRtl` based on a language→direction mapping.

## Examples

::: example
/composables/use-rtl/direction-toggle

### Direction Toggle

Live RTL/LTR switcher showing `isRtl` toggling the `dir` attribute and text-alignment classes in real time.

:::

<DocsApi />
