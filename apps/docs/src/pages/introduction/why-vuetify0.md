---
title: Why v0 - The Meta-Framework for Building UI Libraries
meta:
  - name: description
    content: v0 is a meta-framework for building UI libraries. Headless composables, AI-native docs, interactive playground, and a decade of Vuetify battle-testing.
  - name: keywords
    content: vuetify0, meta-framework, headless ui, composables, vue, design system, ai documentation, mcp
features:
  order: 1.5
  level: 1
related:
  - /introduction/getting-started
  - /introduction/frequently-asked
  - /guide/fundamentals/composables
  - /guide/tooling/vuetify-mcp
  - /guide/tooling/vuetify-cli
logo: vzero
---

# Why v0

The meta-framework for building UI libraries.

<DocsPageFeatures :frontmatter />

v0 provides headless composables, unstyled components, and reactive primitives — the foundation layer that UI frameworks are built on. **46 components, 63+ composables** — all unstyled, all accessible, built on standard Vue SFCs using the latest macros (`defineModel`, `defineSlots`, generics). No custom compiler, no proprietary patterns. Use it to build a full design system shared across projects, or import a single composable to solve one problem in your app. v0 scales to your ambition.

From the creators of [Vuetify](https://vuetifyjs.com) — **41K+ GitHub stars**, **4M+ monthly downloads**, a decade of production use. Vuetify itself is being rebuilt on v0.

## Composable-First Architecture

**Pure logic. Zero opinions. Your markup.**

### Logic Without Components

Most headless libraries give you components. v0 gives you **composables that optionally have components**. Use the logic without any rendering layer:

```ts
import { createSelection } from '@vuetify/v0'

// Pure logic - no components needed
const selection = createSelection({ multiple: true })

// Register items
const items = selection.onboard([
  { id: 'item-1', value: 'Item 1' },
  { id: 'item-2', value: 'Item 2' },
])

// Then select
selection.select('item-1')
selection.select('item-2')

console.log([...selection.selectedIds]) // ['item-1', 'item-2']
console.log(selection.selected('item-1')) // true
console.log(items[0].isSelected.value) // true
```

The same selection logic powers chips, listboxes, tabs, or whatever you build. That's what a meta-framework does.

You can also use v0 composables inside an existing Vuetify application:

```vue collapse
<script setup lang="ts">
  import { VBtn, VCard } from 'vuetify/components'
  import { createSelection } from '@vuetify/v0'

  const selection = createSelection({ multiple: true })

  const items = selection.onboard([
    { id: 1, value: 'Option A' },
    { id: 2, value: 'Option B' },
    { id: 3, value: 'Option C' },
  ])
</script>

<template>
  <VCard title="Select Options">
    <div class="d-flex ga-2 pa-4">
      <VBtn
        v-for="item in items"
        :key="item.id"
        :color="item.isSelected.value ? 'primary' : undefined"
        :variant="item.isSelected.value ? 'flat' : 'outlined'"
        @click="item.toggle()"
      >
        {{ item.value }}
      </VBtn>
    </div>
  </VCard>
</template>
```

### The Trinity Pattern

v0's [Trinity pattern](/guide/fundamentals/core#the-trinity-pattern) provides three layers that work together:

1. **Context** — Dependency injection via `provide`/`inject`
2. **Composable** — Reactive logic you can use anywhere
3. **Component** — Optional rendering layer with slot props

Use as many layers as you need. The same selection logic works whether you're building a chip group, a listbox, tabs, or your own custom component — without wrappers or adapters.

### Composing Primitives

The real power isn't any single composable — it's what you build when you combine them.

A `Cmd+K` command palette is just four v0 primitives working together:

```ts
// ~100 lines. No third-party command palette library needed.
// Dialog.Root wraps the palette (omitted for brevity)
import { createFilter, useHotkey, useVirtualFocus } from '@vuetify/v0'

// Open on Cmd+K
useHotkey('meta+k', () => open.value = true)

// Filter items as the user types
const filter = createFilter({ keys: ['label', 'description'] })
const { items: results } = filter.apply(query, commands)

// Keyboard navigation through results
const { highlightedId, next, prev } = useVirtualFocus(
  () => results.value.map(item => ({ id: item.id })),
  { control: inputRef },
)
```

That's what a meta-framework does — composable primitives that combine cleanly, without fighting each other.

### Adapter-Based Plugins

v0 defines contracts, not implementations. Plugins use adapters — swap the underlying library without changing a line of consumer code. Your components never know the difference.

Built-in adapters ship for the most common integrations:

| Plugin | Adapter | Integration |
|--------|---------|-------------|
| `useLogger` | `PinoLoggerAdapter` | [Pino](https://getpino.io) structured logging |
| `useLogger` | `ConsolaLoggerAdapter` | [Consola](https://github.com/unjs/consola) universal logging |
| `useLocale` | `VueI18nLocaleAdapter` | [Vue I18n](https://vue-i18n.intlify.dev) internationalization |
| `useFeatures` | `LaunchDarklyFeatureAdapter` | [LaunchDarkly](https://launchdarkly.com) feature flags |
| `useFeatures` | `FlagsmithFeatureAdapter` | [Flagsmith](https://flagsmith.com) feature flags |
| `useFeatures` | `PostHogFeatureAdapter` | [PostHog](https://posthog.com) feature flags and analytics |
| `useNotifications` | `createKnockAdapter` | [Knock](https://knock.app) notification feeds |
| `useNotifications` | `createNovuAdapter` | [Novu](https://novu.co) notification infrastructure |

Don't have a built-in? Implement the adapter interface in ~10 lines and swap it in. No changes to your application code.

### Performance by Design

**Fast by default, not fixed after the fact.**

Performance at the foundation layer compounds for everything built on top. Every composable is independently importable and tree-shakeable — only what you use ships. Zero runtime CSS. Published [benchmarks](/guide/fundamentals/benchmarks) back the claims.

Lazy rendering is built in: [`usePresence`](/composables/system/use-presence) delays mounting until needed, [`useLazy`](/composables/system/use-lazy) defers content until it enters the viewport. Performance is a feature, not an afterthought.

### Progressive Enhancement

**Features that grow with your stack.**

v0 features automatically upgrade when plugins are present. No wiring. No configuration. They just get better.

- **Pagination + Locale:** Uses a default label string out of the box. Add `useLocale`, define your pagination label, and the component picks it up automatically.
- **Logger:** `console.log` by default. Add the logger plugin and you get colored output and visual formatting — no code changes.
- **Breakpoints:** Add `useBreakpoints` and composables can consume it for responsive behavior — available throughout the system with zero configuration.

> [!TIP]
> This is the difference between a library and a meta-framework. Libraries make you wire everything. v0 features are aware of each other.

## AI-Native Ecosystem

**Your AI already knows v0.**

v0 was built in the AI era. Not retrofitted — designed from day one to be consumed by both humans and machines.

### MCP Server

First-class [Model Context Protocol server](/guide/tooling/vuetify-mcp) for Claude, Cursor, and other AI assistants. Structured access to v0's full API — accurate, versioned, complete. No hallucinations, no outdated docs. See the full [AI Tools guide](/guide/tooling/ai-tools) for setup and usage.

### Ask AI — Built Into Every Page

A context-aware AI assistant embedded in the documentation. It has access to the current page, the full docs, examples, API specs, and benchmarks. Not a chatbot bolted on — part of the documentation architecture.

### Personalized Documentation

`vuetify-cli analyze` scans your project, finds which v0 features you actually use, and generates a personalized docs URL filtered to your stack. Share it with your team for focused onboarding.

### AI-Friendly Exports

`llms.txt`, `llms-full.txt`, and `SKILL.md` — structured exports designed for LLM consumption. Your AI tools get first-class data, not HTML scraping.

## Developer Experience

**Documentation that adapts to you.**

The docs aren't a reference manual. They're a living environment designed to meet you where you are and grow with you.

### Skill-Based Content Filtering

Set your skill level — Beginner, Intermediate, or Advanced. The entire documentation adapts: navigation, page visibility, content depth. It persists across sessions and grows with you as you level up.

### Interactive Playground

Every example runs live in the browser. Edit code, see results instantly, and share your experiments with a single link. [Vuetify Play](/playground) for full experiments, Vuetify Bin for shareable snippets — integrated into every docs page.

### Examples as Lessons

Examples aren't throwaway demos. Each one teaches a concept — multi-file, ordered, with descriptions explaining *why*, not just *what*. Open any example in the playground to experiment further.

> [!TOUR] using-the-docs

## A Decade of Battle-Testing

**Built on what works.**

While v0 is new, its patterns are not. Registration, selection, theming, forms — Vuetify has used some form of these approaches since its founding. Every version refined them. v0 is the extraction and formalization of a decade of production-tested architecture.

### The Platform Behind v0

- **41K+ GitHub stars**, **4M+ monthly downloads**, **324K+ dependent projects**
- **10+ years** of continuous development
- Weekly release cadence maintained consistently
- Thousands of issues dispositioned, thousands of PRs merged, tens of thousands of commits
- Enterprise adoption across industries

### Community

Active Discord. Weekly releases. Responsive maintainers. The kind of support that comes from 10 years of earning trust — not a weekend project that might go quiet.

### Vuetify Convergence

Vuetify0 is already being merged into Vuetify's next major release. The first PR has landed. Investing in v0 now means your foundation aligns with where the entire Vuetify ecosystem is actively heading.

### Road to v1

**Alpha (April 7, 2026) → Beta (June 2026) → v1.0 (July 2026)** — [see the full roadmap](/roadmap).

What comes after v1: **Vuetify Paper** — a styled layer built on v0 that provides opinionated design system primitives. Emerald and Onyx are the first design systems. Build on v0 today; Paper gives you a head start on the styled layer when you're ready.

### For Your Leadership

Need to justify the choice to management? Here's what matters to them:

- **Proven track record:** 10+ years, 41K+ stars, 324K+ dependents — not a gamble
- **Active development:** Weekly releases, thousands of PRs merged, public roadmap
- **Ecosystem convergence:** v0 is already being merged into Vuetify's next major release
- **Enterprise adoption:** Production use across industries
- **Community health:** Active Discord, dedicated maintainer team, massive documentation investment
- **Enterprise support:** [Dedicated support options available](https://vuetifyjs.com/introduction/enterprise-support/) for teams that need SLA guarantees

## Professional Tooling

**From scaffold to ship.**

| | Tool | Description |
|:-:|------|-------------|
| <AppIcon icon="vuetify-create" :size="20" /> | **[create-vuetify0](https://www.npmjs.com/package/create-vuetify0)** <AppIcon icon="open-in-new" :size="14" /> | One command, project scaffolded with v0 pre-configured |
| <AppIcon icon="vuetify-cli" :size="20" /> | **[Vuetify CLI](/guide/tooling/vuetify-cli)** | Analyze usage, generate components, debug issues |
| <AppIcon icon="vuetify-mcp" :size="20" /> | **[Vuetify MCP](/guide/tooling/vuetify-mcp)** | AI-native API access for Claude, Cursor, and other assistants |
| <AppIcon icon="vuetify-play" :size="20" /> | **[Vuetify Play](/playground)** | Browser IDE for experimenting with v0 in real-time |
| <AppIcon icon="vuetify-bin" :size="20" /> | **[Vuetify Bin](https://bin.vuetifyjs.com)** <AppIcon icon="open-in-new" :size="14" /> | Share runnable code snippets with a link |

## Learn by Doing

**Level up with Vuetify0 Skillz.**

The documentation isn't just reference — it's a training ground. Vuetify0 Skillz offers interactive challenges designed to build real proficiency.

**Available now:**

- Interactive challenges organized by topic
- Three learning tracks: Fundamentals, Features, Integration
- Progress tracking that persists across sessions
- Prerequisite chains — unlock skills as you advance

**Coming soon:**

- Tests and challenges to prove mastery
- Skill-based progression that improves how you work with v0 and with AI tools

## Beyond a Component Library

Headless component libraries solve one problem well: unstyled UI primitives. v0 solves the layer beneath — the composable architecture, plugin system, and developer ecosystem that UI libraries are built on.

| Capability | Typical Headless Library | v0 Meta-Framework |
|------------|:--:|:--:|
| Use without components | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Adapter-based plugins | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Progressive enhancement | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Published benchmarks | Rare | <AppIcon icon="success" class="text-success" /> |
| AI-native docs (MCP, Ask AI) | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Personalized documentation | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Skill-based content filtering | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Interactive learning platform | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| Browser playground | Some | <AppIcon icon="success" class="text-success" /> |
| CLI tooling | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |
| 10+ years ecosystem | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> |

Need a full styled framework today? [Vuetify 4](https://vuetifyjs.com) has 80+ Material Design components ready to go. Need headless components that v0 doesn't have yet? Other options exist. v0 complements all of them — it's the foundation layer, not a replacement.

## Get Started

Ready to build? Pick your path:

```sh
pnpm add @vuetify/v0
```

- **[Install v0](/introduction/getting-started)** and start building
- **[Explore the playground](/playground)** and experiment live
- **[Browse composables](/guide/fundamentals/composables)** to see what's available

> [!ASKAI] What v0 composables should I start with?
