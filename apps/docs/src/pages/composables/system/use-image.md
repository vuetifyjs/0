---
title: useImage - Image Loading State Composable for Vue 3
meta:
- name: description
  content: Reactive image loading state machine with idle, loading, loaded, and error states. Supports deferred loading via an eager gate and retry semantics.
- name: keywords
  content: useImage, image loading, lazy loading, intersection observer, Vue 3, composable, state machine, retry
features:
  category: Composable
  label: 'E: useImage'
  github: /composables/useImage/
  level: 2
related:
  - /composables/system/use-intersection-observer
  - /composables/system/use-lazy
  - /components/semantic/image
  - /components/semantic/avatar
---

# useImage

Tracks image loading state as a reactive state machine with idle, loading, loaded, and error states.

<DocsPageFeatures :frontmatter />

## Usage

The `useImage` composable owns the loading lifecycle for a single image source.
Bind the returned `source`, `onLoad`, and `onError` to a plain image element.

```ts collapse no-filename
import { toRef } from 'vue'
import { useImage } from '@vuetify/v0'

const props = defineProps<{ src: string }>()

const { source, isLoaded, isError, onLoad, onError, retry } = useImage({
  src: toRef(() => props.src),
})

// In template:
// <img :src="source" @load="onLoad" @error="onError" />
```

## Architecture

```mermaid "useImage state machine"
stateDiagram-v2
  [*] --> idle: eager = false
  [*] --> loading: eager = true
  idle --> loading: eager flips true
  loading --> loaded: onLoad
  loading --> error: onError
  loaded --> loading: src changes
  error --> loading: retry / src changes
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `status` | <AppSuccessIcon /> | Readonly ShallowRef of `'idle' \| 'loading' \| 'loaded' \| 'error'` |
| `isIdle` / `isLoading` / `isLoaded` / `isError` | <AppSuccessIcon /> | Readonly boolean refs derived from `status` |
| `source` | <AppSuccessIcon /> | Gated `src` — `undefined` while idle, otherwise the current source |
| `onLoad` / `onError` | <AppErrorIcon /> | Bind to image `load` / `error` events |
| `retry` | <AppErrorIcon /> | Reset back to `loading` and re-attempt |

## Examples

::: example
/composables/use-image/basic

### Basic state tracking

A plain image element wired up with `useImage`. Status updates as the image loads, errors, or is replaced with a new source.

:::

::: example
/composables/use-image/lazy

### Composed with useIntersectionObserver

Pair `useImage` with `useIntersectionObserver` for viewport-driven lazy loading. The `eager` gate withholds the source until the target intersects.

:::

::: example
/composables/use-image/retry

### Retry on error

When the image errors, `retry()` resets the status back to `loading` so the browser re-attempts the request.

:::

## FAQ

::: faq

??? Why is the option called `eager` instead of `lazy`?

`eager` is a reactive gate that mirrors the semantics of HTML's `loading="eager"` attribute — when `eager` is `true`, the image starts loading. When `false`, the source is withheld and status stays `idle`. Using `eager` lets you write expressive bindings like `eager: isIntersecting`.

??? Does `useImage` use IntersectionObserver internally?

No. `useImage` is the state machine; viewport detection is a separate concern. Compose it with `useIntersectionObserver` (or any other reactive gate) by passing the result to the `eager` option.

??? What about native `loading="lazy"`?

Native browser-level lazy loading is a separate mechanism. The browser still fires `load` and `error` events, so `useImage` works correctly with or without it. Reach for the `eager` gate only when you need to control exactly when the source is set.

??? What happens when `src` changes?

Status resets to `loading` (or `idle` if `eager` is `false`) and the source updates. Already-loaded or errored states do not persist across source changes.

??? Why does `source` return `undefined` while idle?

So you can bind it directly to an `<img>` element without the browser starting a request. The browser ignores `<img>` elements without a `src`, which is exactly what you want during the deferred phase.

:::

<DocsApi />
