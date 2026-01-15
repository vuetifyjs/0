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

Vuetify0 is a collection of headless UI primitives and composables for Vue 3. It provides unstyled, logic-focused components that handle accessibility, keyboard navigation, and state management while giving you complete control over styling.

??? How is Vuetify0 different from Vuetify?

Vuetify is a full-featured Material Design component framework with opinionated styling, theming, and a complete design system. Vuetify0 is headless - components have no built-in styles. You bring your own CSS using Tailwind, UnoCSS, or plain CSS. Think of Vuetify0 as the foundation layer that Vuetify and other component libraries could be built on top of.

??? Do I need Vuetify to use Vuetify0?

No. Vuetify0 is a standalone package with no dependency on Vuetify. You can use it in any Vue 3 project.

??? What styling approach should I use?

Vuetify0 is style-agnostic. Use Tailwind CSS, UnoCSS, plain CSS, or any CSS-in-JS solution. All documentation examples use Tailwind-compatible utility classes that work in both Tailwind and UnoCSS.

??? Why use composables instead of components?

Components are great for common UI patterns, but composables give you more flexibility. You can build custom components, combine behaviors, control the entire DOM structure, and import only the logic you need for smaller bundles.

??? Is Vuetify0 accessible?

Yes. Components include proper ARIA attributes, keyboard navigation, and focus management following WAI-ARIA patterns. The headless approach means you are responsible for visual styling, but the accessibility logic is built-in.

??? Does Vuetify0 support SSR?

Yes. All composables and components are SSR-safe. Use the `IN_BROWSER` constant for browser-only code, and the `useHydration` composable for hydration-aware rendering.

??? What browsers are supported?

Vuetify0 supports all modern browsers (Chrome, Firefox, Safari, Edge). There is no IE11 support. Some features like the Popover component use newer APIs that may have limited browser support.

??? Can I use Vuetify0 with Nuxt?

Yes. Install the package and import components/composables as needed. No special Nuxt module is required, though one may be provided in the future.

??? How do I contribute?

See the [Contributing](/introduction/contributing) page for guidelines. The project is open source at [github.com/vuetifyjs/0](https://github.com/vuetifyjs/0).

??? Where can I get help?

[GitHub Issues](https://github.com/vuetifyjs/0/issues) for bug reports and feature requests, or the [Vuetify Discord](https://community.vuetifyjs.com) community for real-time chat and questions.
:::
