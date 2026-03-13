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
