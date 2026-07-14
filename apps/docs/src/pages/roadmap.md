---
title: Roadmap - Vuetify0 Development Timeline
meta:
  - name: description
    content: Track upcoming features, releases, milestones, and maturity status for @vuetify/v0 headless UI library. v0 is a release candidate on the road to v1.0.
  - name: keywords
    content: vuetify0, roadmap, release candidate, rc, beta, alpha, timeline, milestones, releases, features, maturity, stability, Vue 3, v0, headless ui
features:
  level: 1
related:
  - /releases
  - /introduction/getting-started
  - /introduction/contributing
---

# Roadmap

Track the development of @vuetify/v0. Milestones are organized by time horizon:

- **Now** — Actively in development, due within 30 days
- **Next** — Planned for the near future, due within 90 days
- **Later** — On the radar, no immediate timeline
- **Completed** — Released milestones

<DocsRoadmap />

## Release Candidate

**Now a release candidate.** A headless UI framework for Vue 3 — composables and components that handle the logic so you can own the design. No opinions on styling. No markup you can't change. Just primitives that work.

Alpha opened on April 7, 2026 for feedback; beta hardened the APIs. The release candidate locks the v1 stable set — what remains is final validation, documentation, and bug fixes before v1.0.

### Road to v1

<DocsTimeline :milestones="[
  { id: 'alpha', label: 'Alpha', date: 'April 7, 2026', description: 'Opened for feedback, bug reports, and contributions. APIs mostly stable, may evolve.' },
  { id: 'beta', label: 'Beta', date: 'June 2, 2026', description: 'API freeze. Focus shifts to stability, documentation, and edge cases.' },
  { id: 'rc', label: 'RC', date: 'July 2, 2026', description: 'Release candidate for final testing and documentation. No new features.', active: true },
  { id: 'v1', label: 'v1.0', date: 'Q3 2026', description: 'Milestone-driven. Ships when the milestones are met.' },
]" />

### What RC means

This isn't a proof of concept. v0 is feature-complete for v1 and ready to build with.

- **The stable set is locked.** 16 composables and 17 utilities are now marked stable — breaking changes require a major version. See the [maturity matrix](#maturity-matrix) below for the full breakdown.
- **v0 is being built directly into Vuetify.** The composables and patterns here are the same ones powering Vuetify's next generation. This isn't a side project — it's the core.
- **This is the final validation window.** No new features land before v1.0 — every regression, gap, or rough edge you report gets priority. If something feels wrong, say so now.

### Try v0

Whether you want to explore in the browser, scaffold a project, or integrate with your AI workflow — there's a path for you.

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
  <DocsCard to="/introduction/getting-started" hoverable>
    <div class="flex items-center gap-3 mb-2">
      <img src="https://cdn.vuetifyjs.com/docs/images/one/logos/vzero.svg" alt="" class="w-8 h-8">
      <div class="text-lg font-semibold">Get Started</div>
    </div>
    <div class="text-sm text-on-surface-variant">Install v0 and start building. Supports Vue, Nuxt, and multiple styling options.</div>
  </DocsCard>
  <DocsCard href="https://v0play.vuetifyjs.com" hoverable>
    <div class="flex items-center gap-3 mb-2">
      <img src="https://cdn.vuetifyjs.com/docs/images/one/logos/vplay.svg" alt="" class="w-8 h-8">
      <div class="text-lg font-semibold">Playground</div>
    </div>
    <div class="text-sm text-on-surface-variant">Try v0 in your browser. No setup required.</div>
  </DocsCard>
  <DocsCard to="/guide/tooling/vuetify-mcp" hoverable>
    <div class="flex items-center gap-3 mb-2">
      <img src="https://cdn.vuetifyjs.com/docs/images/one/logos/vmcp.svg" alt="" class="w-8 h-8">
      <div class="text-lg font-semibold">MCP</div>
    </div>
    <div class="text-sm text-on-surface-variant">AI-assisted development. Connect v0 docs to your editor.</div>
  </DocsCard>
  <DocsCard to="/guide/tooling/vuetify-cli" hoverable>
    <div class="flex items-center gap-3 mb-2">
      <img src="https://cdn.vuetifyjs.com/docs/images/one/logos/vcli.svg" alt="" class="w-8 h-8">
      <div class="text-lg font-semibold">CLI</div>
    </div>
    <div class="text-sm text-on-surface-variant">Scaffold a project, add composables, and analyze your setup.</div>
  </DocsCard>
</div>

> [!TIP]
> Want a complete working reference? [DevKey](/guide/integration/devkey) is the example project that ships with v0 — a full Vue 3 + Vite + UnoCSS app built on `@vuetify/v0`. Clone it, or run `pnpm create vuetify0` to scaffold your own copy.

### Get involved

**Report a bug or request a feature** — [Open an issue](https://github.com/vuetifyjs/0/issues) on GitHub.

**Ask a question or join the conversation** — Find us on [Discord](https://discord.gg/vuetify).

**Contribute code** — PRs are welcome. See the [contributing guide](/introduction/contributing) for how to get started.

## Maturity Matrix

<DocsMaturity />

### Graduation Criteria

Every feature climbs the same track. Its level tells you what you can rely on today; the gate between levels is exactly what it takes to move up.

<DocsGraduation />

## FAQ

::: faq
??? What is v0?

v0 is a headless UI framework for Vue 3. It provides composables and renderless components that handle behavior, state, and accessibility — without any styling opinions. You bring the design; v0 handles the logic.

??? How is v0 related to Vuetify?

v0 is the foundation layer being built directly into Vuetify's next generation. The composables and patterns in v0 are the same ones that will power Vuetify's styled components. You can use v0 standalone or alongside Vuetify.

??? Can I use v0 in production?

Yes. The v1 stable set is locked, and the release candidate is the build we intend to ship as v1.0. The core is solid and is already being used to build Vuetify itself. Preview APIs may still see minor, documented adjustments.

??? Will APIs break before v1?

The stable set is locked — breaking changes to it now require a major version. Preview features may still evolve in minor releases, with every change documented in release notes. Alpha gathered the feedback; beta locked things down; RC is the final validation pass.

??? What styling framework should I use with v0?

v0 is style-agnostic — use UnoCSS, Tailwind, plain CSS, CSS Modules, or whatever fits your project. The docs and examples use UnoCSS. The theme plugin exposes CSS custom properties that you can map to any framework's color system.

??? Does v0 support SSR and Nuxt?

Yes. All composables and components are SSR-safe. Nuxt integration is documented in the [getting started guide](/introduction/getting-started).

??? What's the difference between stable, preview, and draft?

**Stable** means battle-tested with no planned breaking changes. **Preview** means feature-complete and documented, but the API may evolve in minor releases. **Draft** means experimental and subject to major changes. See the [graduation criteria](#graduation-criteria) above for the full ladder and what it takes to move between levels.

??? How do I report a bug?

[Open an issue](https://github.com/vuetifyjs/0/issues) on GitHub. Include a reproduction if possible — the [playground](https://v0play.vuetifyjs.com) is a good way to create one.

??? How can I contribute?

See the [contributing guide](/introduction/contributing). PRs are welcome for bug fixes, new features, documentation, and examples.

??? Where can I get help?

Join the [Discord](https://discord.gg/vuetify) community. You can also use the AI assistant built into the docs — look for the Ask AI button on any page.
:::

::: sponsor
:::
