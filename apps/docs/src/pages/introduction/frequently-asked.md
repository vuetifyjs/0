---
title: Vuetify0 FAQ - Headless UI Questions and Answers
meta:
  - name: description
    content: Find answers to common questions about Vuetify0 headless UI. Learn about accessibility, SSR support, styling approaches, and differences from Vuetify.
  - name: keywords
    content: vuetify0, faq, frequently asked questions, Vue 3, headless ui, accessibility, SSR
features:
  order: 2
  level: 1
related:
  - /introduction/getting-started
  - /guide
---

# Frequently Asked

Common questions and answers about Vuetify0.

<DocsPageFeatures :frontmatter />

Have a question that isn't answered here? Try [Ask AI](/guide/using-the-docs#ask-ai) for instant answers, join our [Discord community](https://community.vuetifyjs.com), or open an [issue on GitHub](https://github.com/vuetifyjs/0/issues).

::: faq
??? What is Vuetify0?

Vuetify0 is a collection of headless UI primitives and composables for Vue 3. It provides unstyled, logic-focused building blocks that handle accessibility, keyboard navigation, and state management while giving you complete control over styling. The library includes 35+ composables covering everything from selection patterns to form validation, plus ready-to-use headless components like Dialog, Tabs, and ExpansionPanel. Get started instantly with `pnpm create vuetify0`.

??? How is Vuetify0 different from Vuetify?

Vuetify is a full-featured Material Design component framework with opinionated styling, theming, and a complete design system. Vuetify0 is headless - components have no built-in styles. You bring your own CSS using Tailwind, UnoCSS, or plain CSS. Think of Vuetify0 as the foundation layer that Vuetify and other component libraries could be built on top of.

??? Do I need Vuetify to use Vuetify0?

No. Vuetify0 is a standalone package with no dependency on Vuetify. You can use it in any Vue 3 project.

??? What styling approach should I use?

Vuetify0 is style-agnostic - use whatever CSS approach you prefer. We recommend [UnoCSS](https://unocss.dev) for its speed and flexibility, but Tailwind CSS v4, plain CSS, CSS Modules, and CSS-in-JS solutions all work well. The theme plugin exposes CSS custom properties (`--v0-primary`, `--v0-surface`, etc.) that you can map to your framework's color system. All documentation examples use Tailwind-compatible utility classes.

??? Why use composables instead of components?

Components are great for common UI patterns, but composables give you more flexibility. You can build custom components, combine behaviors, control the entire DOM structure, and import only the logic you need for smaller bundles.

??? Is Vuetify0 accessible?

Yes. Components and composables implement WAI-ARIA patterns including proper ARIA attributes, roles, and states. Keyboard navigation is built-in - arrow keys for selection, Enter/Space for activation, Escape for dismissal. Focus management handles trapping focus in modals, restoring focus on close, and roving tabindex for composite widgets. The headless approach means you control the visual styling, but the accessibility logic is built-in.

??? Does Vuetify0 support SSR?

Yes. All composables and components are SSR-safe and work with Nuxt, Vite SSR, and other server-rendering solutions. Use the `IN_BROWSER` constant to guard browser-only code, and the `useHydration` composable for hydration-aware rendering that prevents mismatches. Observer composables (`useResizeObserver`, `useIntersectionObserver`, etc.) automatically skip initialization on the server.

??? What browsers are supported?

Vuetify0 targets modern evergreen browsers: Chrome 52+, Firefox 52+, Safari 10.1+, and Edge 79+. No IE11 support. Some cutting-edge features like CSS Anchor Positioning (Chrome/Edge 125+) and the native Popover API (Chrome 114+, Firefox 125+, Safari 17+) have more limited support but degrade gracefully. See [Browser Support](/introduction/browser-support) for detailed compatibility tables.

??? Can I use Vuetify0 with Nuxt?

Yes. Create a Nuxt plugin that registers v0 plugins, add `@vuetify/v0` to `build.transpile` in your Nuxt config, and you're ready to go. Components and composables can be imported directly or configured for auto-imports. See [Getting Started](/introduction/getting-started#nuxt-3) for setup instructions and the [Nuxt Guide](/guide/integration/nuxt) for advanced configuration.

??? What version of Vue is required?

Vue 3.5.0 or higher. Vuetify0 uses modern Vue features like `useId()` and improved reactivity that require Vue 3.5+. Node 22+ is recommended for development.

??? Is Vuetify0 tree-shakeable?

Yes. Import only what you need and unused code is eliminated during bundling. Components and composables are individually exportable (`@vuetify/v0/components`, `@vuetify/v0/composables`), and the library has no side effects that prevent tree-shaking.

??? Does Vuetify0 support TypeScript?

Yes. The library is written in TypeScript with full type definitions. Generic components preserve type inference, composables return properly typed refs and functions, and the plugin system is fully typed. No `@types` packages needed.

??? What are plugins in Vuetify0?

Plugins provide app-wide functionality that composables can access via Vue's provide/inject. Core plugins include `createThemePlugin` (theming with CSS variables), `createLocalePlugin` (i18n), `createStoragePlugin` (persistent state), and `createLoggerPlugin` (debug logging). Additional plugins cover breakpoints, hydration, and permissions. Each plugin is optional - install only what you need.

??? How do I get started quickly?

The fastest way is with the CLI: `pnpm create vuetify0`. This scaffolds a complete project with UnoCSS, theming, and example components pre-configured. For existing projects, install `@vuetify/v0` and start importing components and composables directly. See [Getting Started](/introduction/getting-started) for full instructions.

??? How do I contribute?

See the [Contributing](/introduction/contributing) page for guidelines. The project is open source at [github.com/vuetifyjs/0](https://github.com/vuetifyjs/0).

??? Where can I get help?

[GitHub Issues](https://github.com/vuetifyjs/0/issues) for bug reports and feature requests, or the [Vuetify Discord](https://community.vuetifyjs.com) community for real-time chat and questions.
:::
