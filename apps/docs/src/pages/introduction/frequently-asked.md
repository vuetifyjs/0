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

<script setup>
import FaqList from '@/components/docs/FaqList.vue'

const faqs = [
  {
    id: 'what-is',
    question: 'What is Vuetify0?',
    answer: 'Vuetify0 is a collection of headless UI primitives and composables for Vue 3. It provides unstyled, logic-focused components that handle accessibility, keyboard navigation, and state management while giving you complete control over styling.'
  },
  {
    id: 'difference',
    question: 'How is Vuetify0 different from Vuetify?',
    answer: 'Vuetify is a full-featured Material Design component framework with opinionated styling, theming, and a complete design system. Vuetify0 is headless - components have no built-in styles. You bring your own CSS using Tailwind, UnoCSS, or plain CSS. Think of Vuetify0 as the foundation layer that Vuetify and other component libraries could be built on top of.'
  },
  {
    id: 'need-vuetify',
    question: 'Do I need Vuetify to use Vuetify0?',
    answer: 'No. Vuetify0 is a standalone package with no dependency on Vuetify. You can use it in any Vue 3 project.'
  },
  {
    id: 'styling',
    question: 'What styling approach should I use?',
    answer: 'Vuetify0 is style-agnostic. Use Tailwind CSS, UnoCSS, plain CSS, or any CSS-in-JS solution. All documentation examples use Tailwind-compatible utility classes that work in both Tailwind and UnoCSS.'
  },
  {
    id: 'composables',
    question: 'Why use composables instead of components?',
    answer: 'Components are great for common UI patterns, but composables give you more flexibility. You can build custom components, combine behaviors, control the entire DOM structure, and import only the logic you need for smaller bundles.'
  },
  {
    id: 'accessibility',
    question: 'Is Vuetify0 accessible?',
    answer: 'Yes. Components include proper ARIA attributes, keyboard navigation, and focus management following WAI-ARIA patterns. The headless approach means you are responsible for visual styling, but the accessibility logic is built-in.'
  },
  {
    id: 'ssr',
    question: 'Does Vuetify0 support SSR?',
    answer: 'Yes. All composables and components are SSR-safe. Use the IN_BROWSER constant for browser-only code, and the useHydration composable for hydration-aware rendering.'
  },
  {
    id: 'browsers',
    question: 'What browsers are supported?',
    answer: 'Vuetify0 supports all modern browsers (Chrome, Firefox, Safari, Edge). There is no IE11 support. Some features like the Popover component use newer APIs that may have limited browser support.'
  },
  {
    id: 'nuxt',
    question: 'Can I use Vuetify0 with Nuxt?',
    answer: 'Yes. Install the package and import components/composables as needed. No special Nuxt module is required, though one may be provided in the future.'
  },
  {
    id: 'contribute',
    question: 'How do I contribute?',
    answer: 'See the <a href="/introduction/contributing">Contributing</a> page for guidelines. The project is open source at <a href="https://github.com/vuetifyjs/0">github.com/vuetifyjs/0</a>.'
  },
  {
    id: 'help',
    question: 'Where can I get help?',
    answer: '<a href="https://github.com/vuetifyjs/0/issues">GitHub Issues</a> for bug reports and feature requests, or the <a href="https://community.vuetifyjs.com">Vuetify Discord</a> community for real-time chat and questions.'
  }
]
</script>

# Frequently Asked

Common questions and answers about Vuetify0.

<DocsPageFeatures :frontmatter />

Have a question that isn't answered here? Try [Ask AI](/guide/using-the-docs#ask-ai) for instant answers, join our [Discord community](https://community.vuetifyjs.com), or open an [issue on GitHub](https://github.com/vuetifyjs/0/issues).

<FaqList :items="faqs" />

