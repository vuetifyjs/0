---
title: Vapor - Vue Vapor Mode Compatibility
features:
  order: 4
  level: 3
meta:
  - name: description
    content: How Vuetify0 works under Vue Vapor mode, the compiler-optimized runtime without a virtual DOM. Covers composables, component interop, what is verified, and current caveats.
  - name: keywords
    content: vuetify0, vue vapor, vapor mode, vue 3.6, virtual dom, fine-grained reactivity, vaporInteropPlugin
related:
  - /guide/fundamentals/reactivity
  - /guide/fundamentals/building-frameworks
  - /composables/foundation/create-context
---

# Vapor

[Vue Vapor mode](https://github.com/vuejs/core/releases/tag/v3.6.0-beta.1) is Vue's compiler-optimized runtime that ships without the virtual DOM, compiling templates to direct DOM operations. v0 is built to keep working under Vapor.

<DocsPageFeatures :frontmatter />

> [!IMPORTANT]
> Vapor mode ships in **Vue 3.6**, which is still in beta. This page describes a **forward-compatibility target**, not a stable guarantee. v0 itself is published against Vue `>=3.5`; the Vapor support below is verified on a pinned Vue 3.6 beta and exercised by a dedicated test suite, but treat it as experimental until Vue 3.6 is stable.

## Why v0 is a good fit for Vapor

Vapor leans harder on fine-grained reactivity and removes the virtual DOM. v0's design already points that way:

- **Composables are logic, not markup.** Selection state, registries, validation, and the rest are plain reactive primitives (`shallowRef`, `toRef`, `computed`). They have no dependency on the virtual DOM, so they run unchanged inside a Vapor component's `setup`.
- **Components keep templates conventional.** v0's compound components are authored as ordinary SFCs — no `h()` tricks, no hand-rolled `render()`, no vnode metaprogramming — which is exactly what compiles cleanly under Vapor or renders through interop.

This is a standing design rule, not an afterthought: every new v0 abstraction is checked against "does this depend on the virtual DOM?" before it lands.

## What is verified today

v0 ships an isolated Vapor test suite (`tests/vapor`, run with `pnpm test:vapor`) that mounts real Vapor components against a pinned Vue 3.6 beta[^beta-pin] and asserts:

| Area | What it proves |
| - | - |
| Instance detection | `getCurrentInstance()` is `null` in a Vapor component, yet v0 still resolves the active instance[^instance-shim] — so composables that depend on component context keep working. |
| Composables | `createSelection` registers items, updates reactive state, and drives Vapor DOM updates from inside a Vapor `setup`. |
| Component interop | A classic (vdom) v0 component renders inside a Vapor app through `vaporInteropPlugin`, including slot content forwarded from a Vapor parent[^interop-slots]. |

[^beta-pin]: Pinned to `vue@3.6.0-beta.15` — the newest 3.6 beta old enough to clear the workspace's install-age policy. The Vapor surface the suite touches (the `vapor` SFC attribute, `createVaporApp`, `vaporInteropPlugin`) has been stable across the beta line; bump the pin as 3.6 nears release.
[^instance-shim]: Vapor exposes the active instance on Vue 3.6's `currentInstance` export; `getCurrentInstance()` returns `null` inside a Vapor component by design ([vuejs/core discussion #13629](https://github.com/orgs/vuejs/discussions/13629)). v0 reads `currentInstance` when present and falls back to `getCurrentInstance()` on Vue 3.5 — see `utilities/instance.ts`.
[^interop-slots]: Interop is directional. A vdom component rendering inside a Vapor parent (the tested path) works; passing Vapor slots *into* a vdom component needs `renderSlot` rather than `slots.default()`, per [Vue's Vapor notes](https://github.com/vuejs/core/releases/tag/v3.6.0-beta.1). Keep a region in one rendering mode where you can.

## Using composables under Vapor

Composables need no special handling — call them inside a `<script setup vapor>` component the same way you would in a classic one:

```vue
<script setup vapor lang="ts">
  import { createSelection } from '@vuetify/v0'

  const selection = createSelection()
  const a = selection.register({ value: 'a' })
  const b = selection.register({ value: 'b' })
</script>

<template>
  <button :data-selected="a.isSelected.value" @click="a.toggle()">A</button>
  <button :data-selected="b.isSelected.value" @click="b.toggle()">B</button>
</template>
```

### The `getCurrentInstance()` caveat

Vapor intentionally makes `getCurrentInstance()` return `null` inside a component. Libraries that call it directly to detect component context can break — v0 does not. Internally v0 reads Vue 3.6's `currentInstance` export when it is available and falls back to `getCurrentInstance()` on older Vue, so instance-aware helpers like `useId()` continue to resolve correctly under Vapor. If you write your own instance-aware logic, prefer the same pattern over a bare `getCurrentInstance()` call.

## Using components under Vapor

v0's components are classic (vdom) SFCs. To render them from a Vapor-root app, install `vaporInteropPlugin` so the two runtimes can nest:

```ts main.ts
import { createVaporApp, vaporInteropPlugin } from 'vue'
import App from './App.vue' // <script setup vapor>

createVaporApp(App)
  .use(vaporInteropPlugin)
  .mount('#app')
```

The same plugin enables the reverse — dropping a Vapor component into an existing vdom app for incremental adoption:

```ts main.ts
import { createApp, vaporInteropPlugin } from 'vue'
import App from './App.vue'

createApp(App)
  .use(vaporInteropPlugin)
  .mount('#app')
```

## Current limitations

- **Vue 3.6 is beta.** The runtime, the `vapor` SFC attribute, and `vaporInteropPlugin` are stabilizing; APIs can still shift before release.
- **Coverage is representative, not exhaustive.** The suite proves the instance-context substrate, a registry composable, and component interop. It does not yet mount every component under Vapor.
- **Interop has rough edges.** Vapor↔vdom interop still has edge cases, so keep a given region in one rendering mode where you can.

## Verifying it yourself

The Vapor suite is intentionally kept out of the default test run (it depends on a beta Vue). Run it directly:

```bash
pnpm test:vapor
```

See `tests/vapor/README.md` in the repository for the toolchain setup and the beta-specific configuration notes.
