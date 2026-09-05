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

[Vue Vapor mode](https://github.com/vuejs/core/releases/tag/v3.6.0-rc.1) is Vue's compiler-optimized runtime that ships without the virtual DOM, compiling templates to direct DOM operations. Vuetify0 is built to keep working under Vapor.

<DocsPageFeatures :frontmatter />

> [!IMPORTANT]
> Vapor mode ships in **Vue 3.6**, now in release-candidate phase with Vapor feature-complete. This page describes a **forward-compatibility target**, not a stable guarantee. Vuetify0 itself is published against Vue `>=3.5`; the Vapor support below is verified on a pinned Vue 3.6 release candidate and exercised by a dedicated test suite, but treat it as pre-release until Vue 3.6 is stable.

## Why Vuetify0 is a good fit for Vapor

Vapor leans harder on fine-grained reactivity and removes the virtual DOM. v0's design already points that way:

- **Composables are logic, not markup.** Selection state, registries, validation, and the rest are plain reactive primitives (`shallowRef`, `toRef`, `computed`). They have no dependency on the virtual DOM, so they run unchanged inside a Vapor component's `setup`.
- **Components keep templates conventional.** v0's compound components are authored as ordinary SFCs — no `h()` tricks, no hand-rolled `render()`, no vnode metaprogramming — which is exactly what compiles cleanly under Vapor or renders through interop.

This is a standing design rule, not an afterthought: every new v0 abstraction is checked against "does this depend on the virtual DOM?" before it lands.

## What is verified today

Vuetify0 ships an isolated Vapor test suite (`tests/vapor`, run with `pnpm test:vapor`) that mounts real Vapor components against a pinned Vue 3.6 release candidate[^rc-pin] and asserts:

| Area | What it proves |
| - | - |
| Instance detection | `getCurrentInstance()` is `null` in a Vapor component, yet v0 still resolves the active instance[^instance-shim] — so composables that depend on component context keep working. |
| Composables | `createSelection` registers items, updates reactive state, and drives Vapor DOM updates from inside a Vapor `setup`. |
| Component interop | A classic (vdom) Vuetify0 component renders inside a Vapor app through `vaporInteropPlugin`, including slot content forwarded from a Vapor parent[^interop-slots]. |

[^rc-pin]: Pinned to `vue@3.6.0-rc.2`. The Vapor surface the suite touches (the `vapor` SFC attribute, `createVaporApp`, `vaporInteropPlugin`) has been stable across the beta and RC lines; the pin moves to `3.6.0` when stable ships.
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

Vapor intentionally makes `getCurrentInstance()` return `null` inside a component. Libraries that call it directly to detect component context can break — Vuetify0 does not. Internally v0 reads Vue 3.6's `currentInstance` export when it is available and falls back to `getCurrentInstance()` on older Vue, so instance-aware helpers like `useId()` continue to resolve correctly under Vapor. If you write your own instance-aware logic, prefer the same pattern over a bare `getCurrentInstance()` call.

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

### The interop boundary rule

Every classic component instantiated directly from a Vapor-compiled template is its own interop crossing, and the plugin's overhead scales with the **number of crossings** — not with what the components do. Compound components multiply crossings: each `Checkbox.Root` and `Checkbox.Indicator` written inline in a Vapor `v-for` crosses separately, so a list of 200 checkboxes is roughly 400 crossings.

Put the Vapor↔vdom boundary **above** the repeated region, never inside it — this is Vue's own interop guidance[^vapor-regions]. One classic wrapper component turns N crossings into one:

```vue Costly.vue
<script setup vapor lang="ts">
  // Every Root and Indicator in the loop is its own crossing
  import { Checkbox } from '@vuetify/v0'

  const { items } = defineProps<{ items: { id: string, label: string }[] }>()
</script>

<template>
  <label v-for="item in items" :key="item.id">
    <Checkbox.Root>
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Root>
    {{ item.label }}
  </label>
</template>
```

```vue Cheap.vue
<script setup vapor lang="ts">
  // One crossing: the classic (vdom) wrapper owns the loop
  import Checklist from './Checklist.vue'

  const { items } = defineProps<{ items: { id: string, label: string }[] }>()
</script>

<template>
  <Checklist :items="items" />
</template>
```

Measured on Vue `3.6.0-rc.2` with the repository's gated interop bench (200 compound checkboxes): inline composition costs +44% mount time and +12% retained heap over a classic root; the same tree behind a single classic wrapper is within noise. A production Vue SPA (11k tests) independently measured the same shape in real Chromium at 1x and 4x CPU throttle: +66–78% mount and +49% heap inline, all collapsing to noise — update operations and heap included — with one wrapper.

> [!WARNING]
> Inline composition is the natural way to author this, and nothing warns you when the boundary sits inside the loop — the subtree just mounts slower. Audit Vapor templates for Vuetify0 components inside `v-for` blocks.

The wrapper is a parity workaround, not a win: everything inside the boundary still renders classic, so it never sees Vapor's cheaper updates. Vapor-native v0 builds are the actual fix; until then, keep regions in one rendering mode.

[^vapor-regions]: Vue's [3.6 release notes](https://github.com/vuejs/core/releases/tag/v3.6.0-rc.1) recommend "having distinct regions in an app where one rendering mode or the other is used, and avoiding mixed nesting as much as possible." The crossing-count math above is why: the recommendation is a performance boundary, not just a compatibility hedge. See the [Vue Vapor mode notes](https://github.com/vuejs/core/releases/tag/v3.6.0-beta.1) for the full interop contract.

## Current limitations

- **Vue 3.6 is a release candidate.** Vapor is feature-complete as of rc.1; APIs are unlikely to shift, but nothing is guaranteed until 3.6.0 ships.
- **Coverage is representative, not exhaustive.** The suite proves the instance-context substrate, a registry composable, and component interop. It does not yet mount every component under Vapor.
- **Interop has rough edges.** Vapor↔vdom interop still has edge cases, so keep a given region in one rendering mode where you can — and mind the [boundary rule](#the-interop-boundary-rule) when mixing.

## Verifying it yourself

The Vapor suite is intentionally kept out of the default test run (it depends on a pre-release Vue). Run it directly:

```bash
pnpm test:vapor
```

See `tests/vapor/README.md` in the repository for the toolchain setup and the pre-release configuration notes.
