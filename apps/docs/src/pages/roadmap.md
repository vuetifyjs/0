---
title: Roadmap - Vuetify0 Development Timeline
meta:
  - name: description
    content: Track upcoming features, releases, milestones, and maturity status for @vuetify/v0 headless UI library. v0 enters alpha on April 7, 2026.
  - name: keywords
    content: vuetify0, roadmap, alpha, timeline, milestones, releases, features, maturity, stability, Vue 3, v0, headless ui
features:
  level: 1
  emphasized: true
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

> [!INFO] Want to help shape the future of this project? [Become a Founder Supporter](mailto:john@vuetifyjs.com?subject=Founder%20Supporter%20Inquiry) and gain a guiding voice in what we build next.

## Alpha

**Launching April 7, 2026.** A headless UI framework for Vue 3 — composables and components that handle the logic so you can own the design. No opinions on styling. No markup you can't change. Just primitives that work.

We're opening v0 for feedback, bug reports, and contributions. Your input shapes what gets locked in for v1.

### Road to v1

<DocsTimeline :milestones="[
  { id: 'alpha', label: 'Alpha', date: 'April 7, 2026', description: 'Open for feedback, bug reports, and contributions. APIs mostly stable, may evolve.', active: true },
  { id: 'beta', label: 'Beta', date: 'May 2026', description: 'API freeze. Focus shifts to stability, documentation, and edge cases.' },
  { id: 'v1', label: 'v1.0', date: 'July 2026', description: 'Milestone-driven. Ships when the milestones are met.' },
]" />

### What alpha means

This isn't a proof of concept. v0 is feature-complete enough to build with and evaluate seriously.

- **APIs are mostly stable.** They may evolve based on community feedback, but the foundation is solid.
- **v0 is being built directly into Vuetify.** The composables and patterns here are the same ones powering Vuetify's next generation. This isn't a side project — it's the core.
- **Your feedback matters now.** Alpha is when design decisions are still open. Once we hit beta, APIs freeze. If something feels wrong, this is the time to say so.

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

### Get involved

**Report a bug or request a feature** — [Open an issue](https://github.com/vuetifyjs/0/issues) on GitHub.

**Ask a question or join the conversation** — Find us on [Discord](https://community.vuetifyjs.com).

**Contribute code** — PRs are welcome. See the [contributing guide](/introduction/contributing) for how to get started.

## Maturity Matrix

<DocsMaturity />

## FAQ

::: faq
??? What is v0?

v0 is a headless UI framework for Vue 3. It provides composables and renderless components that handle behavior, state, and accessibility — without any styling opinions. You bring the design; v0 handles the logic.

??? How is v0 related to Vuetify?

v0 is the foundation layer being built directly into Vuetify's next generation. The composables and patterns in v0 are the same ones that will power Vuetify's styled components. You can use v0 standalone or alongside Vuetify.

??? Can I use v0 in production?

Yes, with the understanding that APIs may evolve during alpha. The core is solid and is already being used to build Vuetify itself. If you're comfortable with occasional minor adjustments as things stabilize, v0 is ready to build with.

??? Will APIs break during alpha?

APIs are mostly stable. Breaking changes are possible but will be documented in release notes. The goal of alpha is to gather feedback before locking APIs at beta.

??? What styling framework should I use with v0?

v0 is style-agnostic — use UnoCSS, Tailwind, plain CSS, CSS Modules, or whatever fits your project. The docs and examples use UnoCSS. The theme plugin exposes CSS custom properties that you can map to any framework's color system.

??? Does v0 support SSR and Nuxt?

Yes. All composables and components are SSR-safe. Nuxt integration is documented in the [getting started guide](/introduction/getting-started).

??? What's the difference between stable, preview, and draft?

**Stable** means battle-tested with no planned breaking changes. **Preview** means feature-complete and documented, but the API may evolve in minor releases. **Draft** means experimental and subject to major changes. See the maturity matrix above for a full breakdown.

??? How do I report a bug?

[Open an issue](https://github.com/vuetifyjs/0/issues) on GitHub. Include a reproduction if possible — the [playground](https://v0play.vuetifyjs.com) is a good way to create one.

??? How can I contribute?

See the [contributing guide](/introduction/contributing). PRs are welcome for bug fixes, new features, documentation, and examples.

??? Where can I get help?

Join the [Discord](https://community.vuetifyjs.com) community. You can also use the AI assistant built into the docs — look for the Ask AI button on any page.
:::

> [!DISCORD]
