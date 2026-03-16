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

The `useRtl` composable provides reactive RTL (right-to-left) direction management. It manages a boolean direction state and sets the `dir` attribute on a target element via the adapter pattern. Independent from `useLocale` — direction is a layout concern, not a content concern.

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

## Adapter

The default `Vuetify0RtlAdapter` sets the `dir` attribute on the target element (defaults to `document.documentElement`). This enables native browser RTL support including CSS logical properties and the `:dir()` pseudo-class.

```ts
// Custom target element
app.use(createRtlPlugin({ target: '#app' }))

// Disable dir attribute management
app.use(createRtlPlugin({ target: null }))
```

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

For cases logical properties can't handle (like `translate-x`), use `ltr:` and `rtl:` variants:

```html
<!-- Mobile drawer: slides from start edge -->
<nav class="ltr:-translate-x-full rtl:translate-x-full md:ltr:translate-x-0 md:rtl:translate-x-0">
  ...
</nav>
```

### Symmetric Shorthand

When both sides use the same value, use `inset-x-*` instead of `left-* right-*`:

```html
<!-- Before -->
<div class="fixed left-0 right-0 top-0">...</div>

<!-- After -->
<div class="fixed inset-x-0 top-0">...</div>
```

## Subtree Overrides

Use `createRtlContext` to scope direction to a subtree:

```ts
import { createRtlContext } from '@vuetify/v0'

// Create a scoped RTL context
const [useLocalRtl, provideLocalRtl] = createRtlContext({ default: true })
```

> [!TIP]
> Direction is independent from locale. To connect them (e.g., Arabic → RTL), use a custom adapter that watches `useLocale().selectedId` and sets `isRtl` based on a language→direction mapping.

<DocsApi />
