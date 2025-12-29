---
title: Atom - Polymorphic Foundation Component for Vue 3
meta:
- name: description
  content: Polymorphic foundation component for dynamic element rendering. Render as any HTML element with the 'as' prop and support renderless mode for full flexibility.
- name: keywords
  content: atom, component, renderless, polymorphic, as prop, Vue 3, headless, dynamic element
features:
  category: Component
  label: 'E: Atom'
  github: /components/Atom/
  renderless: false
related:
  - /guide/components
---

<script setup>
import BasicExample from '@/examples/components/atom/basic.vue'
import BasicExampleRaw from '@/examples/components/atom/basic.vue?raw'
</script>

# Atom

The foundational building block for dynamic element rendering with renderless capabilities.

<DocsPageFeatures :frontmatter />

## Usage

The Atom component provides dynamic element rendering and is used as the foundation for all other components in Vuetify0. It supports polymorphic rendering through the `as` prop and can render as any HTML element or Vue component.

<DocsExample file="basic.vue" title="Dynamic Element Rendering" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

<DocsApi />
