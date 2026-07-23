---
title: Compatibility - Using v0 With Your Stack
features:
  order: 1
  label: 'Compatibility'
  level: 1
meta:
  - name: description
    content: Where you can use Vuetify0. v0 is headless — logic and unstyled primitives, no CSS, no global plugin — so it coexists with component libraries, headless libraries, VueUse, and any Vue framework.
  - name: keywords
    content: vuetify0, compatibility, vueuse, primevue, quasar, element plus, nuxt ui, reka ui, headless ui, vuetify, nuxt, ssr
related:
  - /introduction/getting-started
  - /guide/integration/nuxt
  - /guide/integration/vapor
---

# Compatibility

Almost anywhere you already write Vue. v0 is **headless** — it ships reactive-logic composables and unstyled primitives, no CSS, and requires no global plugin — so it sits in the *behavior* layer of your app and rarely competes with what you already use.

<DocsPageFeatures :frontmatter />

## The one thing that answers most questions

v0 registers nothing globally and paints no pixels. You import what you need (`import { createSelection } from '@vuetify/v0'`) and it tree-shakes. Because it emits no styles and installs no plugin, there is nothing for it to collide with:

- No CSS to clash with your component library's theme or reset.
- No `app.use()` to duplicate or fight another plugin's install.
- No opinion about your styling, router, state manager, or build tool.

So the default answer to "can I use v0 with X?" is **yes**. The rest of this page is the small number of exceptions and the guidance for mixing well.

## Compatibility at a glance

| You already use… | Works with v0? | The one thing to know |
| - | - | - |
| **Vuetify** | Yes — it's the substrate | v0 is the foundation Vuetify is progressively adopting. Let Vuetify own theme, locale, RTL, and display. |
| **PrimeVue** | Yes | Separate plugin, no CSS clash. Use v0 for primitives PrimeVue lacks — don't re-wrap its toast/dialog. |
| **Quasar** | Yes | Quasar ships a global CSS reset that your unstyled v0 elements inherit. Let Quasar own theme/breakpoints/i18n. |
| **Element Plus** | Yes | `el-`-scoped CSS, no broad reset; supports plugin-free auto-import. Let its `ConfigProvider` own locale/RTL. |
| **Nuxt UI** | Yes | Built on Reka UI + Tailwind. A v0 component drops in unstyled — it won't inherit Nuxt UI's Tailwind theme. |
| **VueUse** | Yes — complementary | Overlap is a handful of low-level twins; name collisions are import-scoped only. v0 adds the orchestration tier VueUse doesn't have. |
| **Reka UI / Radix Vue / Headless UI** | Technically yes | Same layer as v0 — don't stack two headless libraries on one widget. |
| **Nuxt / Vite / Astro** | Yes | v0 is SSR-safe out of the box. See [Nuxt](/guide/integration/nuxt). No v0-specific module needed. |

## Styled component libraries

Libraries like **Vuetify**, **PrimeVue**, **Quasar**, **Element Plus**, and **Nuxt UI** render finished, themed UI. v0 renders behavior. They occupy different layers, so they stack: let the styled library paint the pixels, and reach for v0 when you need interaction logic or an orchestration primitive the library doesn't expose — a nested-tree selection model, a shared registry across several of your own components, a stepper, a virtualized list.

The only recurring caveat is **redundancy, not conflict**. Every styled library ships its own services for theme, locale, RTL, breakpoints, and z-index — the same concerns v0's optional plugin composables (`useTheme`, `useRtl`, `useLocale`, `useBreakpoints`, `useStack`) also cover. Don't run both for one concern. Pick a single owner, and in a styled-library app that owner is normally the styled library.

- **Vuetify** — a special case: v0 is Vuetify's own substrate, adopted incrementally through minor releases. In a Vuetify app today, use v0 for headless logic Vuetify doesn't yet surface directly, and let Vuetify own theming and display. Vuetify is not fully reimplemented on v0 — treat v0 as the shared foundation underneath, not a drop-in replacement for Vuetify's components.
- **Quasar** — the one styling gotcha worth naming: Quasar's stylesheet includes a global reset that restyles base elements app-wide. It won't touch v0's logic, but v0's *unstyled* elements will inherit Quasar's base styling. Scope or override where you don't want it.
- **PrimeVue / Element Plus** — component-scoped CSS, no aggressive reset; both support SSR and plugin-free auto-import. Use v0 for what they lack, not to re-solve their built-in toast/dialog/config providers.

## Headless libraries

**Reka UI** (formerly **Radix Vue** — the same project, renamed), and **Headless UI** live at the *same* layer as v0: unstyled, accessibility-focused behavior. You can technically install them alongside v0 — everything is tree-shakeable and nothing collides — but stacking two headless libraries on the *same* widget is redundant, not additive. You'd maintain two accessibility implementations for one concern.

Guidance if you're already invested in one: keep it for the primitives you're happy with, and adopt v0 *above* that layer for the orchestration it adds — selection systems, registries, form and validation coordination, data-table/filter/pagination/virtual pipelines. Don't rebuild working widgets on v0 for its own sake. Note that **Nuxt UI is built on Reka UI**, so "using v0 with Nuxt UI" is already a Reka-based stack — the same answer applies.

## VueUse

Use both — they're complementary. VueUse is a general-purpose reactivity and browser utility belt (`useFetch`, `useClipboard`, `useMouse`, and hundreds more). v0 is a headless UI-component logic layer whose `create*` orchestration primitives (selection, registry, form, combobox, data table) solve a problem VueUse never set out to.

The overlap is shallow and confined to the lowest tier: v0 ships its own `useEventListener`, `useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`, `useMediaQuery`, `useBreakpoints`, `useClickOutside`, `useStorage`, `useRaf`, `useTimer`, and `useHotkey` — because its components need them internally and it avoids a hard dependency on VueUse. Those are the only names that collide, and the collision is **import-scoped only**: alias one side if both land in the same file.

```ts
import { useStorage } from '@vueuse/core'
import { useStorage as useV0Storage } from '@vuetify/v0'
```

The two implementations run side by side without interfering. Same name does not mean same signature, though — v0's versions are tuned for its components and SSR guarantees, so check each library's own types rather than passing one's options to the other.

## Frameworks and SSR

v0 works in any Vue setup with no special integration.

- **Vite** — the default target. Import and go.
- **Nuxt / SSR** — v0 is SSR-safe: browser APIs are gated behind an `IN_BROWSER` guard, persisted state falls back to in-memory on the server, and `useHydration` lets you defer client-only rendering past the first paint. There is no v0-specific Nuxt module, and none is needed. See the [Nuxt guide](/guide/integration/nuxt).
- **Astro** — use v0 inside Vue components rendered as islands; its reactive logic activates wherever the island hydrates (`client:*`).
- **Vapor** — v0 runs under Vue's Vapor mode. See the [Vapor guide](/guide/integration/vapor).

## Three rules for mixing

1. **One owner per concern.** Theme, locale, RTL, breakpoints, z-index — v0 and your styled library both offer these. Choose one source of truth; in a styled-library app it's usually the styled library's.
2. **Same layer, pick one; different layer, stack freely.** v0 + a *styled* library = different layers, combine them. v0 + another *headless* library = same layer, don't double up on a single widget.
3. **SSR: guards prevent crashes, `useHydration` prevents mismatches.** The library keeps the server from throwing on browser APIs; `isHydrated` is what you use to keep your own conditional markup consistent across the server-to-client handoff.
