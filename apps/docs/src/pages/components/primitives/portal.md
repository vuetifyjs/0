---
title: Portal - Teleport Wrapper with Stack Integration
meta:
- name: description
  content: Renderless teleport primitive with automatic z-index stacking. Teleport content to the body or custom targets with SSR support for Vue 3.
- name: keywords
  content: portal, teleport, overlay, z-index, stacking, renderless, Vue 3, headless
features:
  category: Component
  label: 'C: Portal'
  github: /components/Portal/
  renderless: true
  level: 2
related:
  - /components/disclosure/dialog
  - /components/providers/scrim
  - /composables/plugins/use-stack
---

# Portal

Renderless teleport wrapper with automatic z-index stacking.

<DocsPageFeatures :frontmatter />

## Usage

Portal wraps Vue's `<Teleport>` with automatic `useStack` integration. Content is teleported to `body` by default and receives a `zIndex` via slot props for proper overlay ordering.

::: gn-example
/components/portal/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Portal } from '@vuetify/v0'
</script>

<template>
  <Portal />
</template>
```

## Accessibility

Portal is transparent — it adds no DOM elements, ARIA attributes, or keyboard behavior. Accessibility is the responsibility of the content you teleport.

> [!TIP]
> When teleporting interactive content (modals, menus, notifications), ensure it has proper ARIA roles, keyboard handling, and focus management. Portal handles *where* content renders, not *how* it behaves.

### Landmarks

Teleported content lands outside your app's landmark structure — `body` is not inside `<main>`, so audit tools flag the subtree with the axe [region](https://dequeuniversity.com/rules/axe/4.12/region) rule. Give the teleported subtree its own semantics instead of relying on the surrounding page:

- `role="dialog"` — dialogs are exempt from the landmark rule
- `role="status"` or `role="alert"` — toast and notification regions
- `role="region"` plus `aria-label` — arbitrary overlays with no more specific role

```vue
<template>
  <Portal>
    <aside role="region" aria-label="Chat panel">...</aside>
  </Portal>
</template>
```

## FAQ

::: faq
??? When should I use Portal vs native Teleport?

Use Portal when your teleported content needs z-index coordination with other overlays. Portal auto-registers with `useStack` so your content stacks correctly alongside Dialogs, Snackbars, and other overlay components.

If you don't need stacking — for example, teleporting a non-overlay element to a specific container — Vue's native [Teleport](https://vuejs.org/guide/built-ins/teleport) works fine.

??? Does Portal work with SSR?

Yes. Portal relies on Vue's native `<Teleport>` SSR support. Vue renders teleported content into a separate SSR stream and hydrates it correctly on the client.

??? What happens when disabled is true?

Content renders inline at its original position in the DOM tree instead of being teleported. Stack registration stays active, so `zIndex` is still provided via slot props — useful if your inline content still needs to participate in overlay ordering.

??? Do I need useStack installed for Portal to work?

Portal always calls `useStack()`, which provides a singleton fallback if no explicit stack plugin is installed. This matches how Dialog and Snackbar work. You don't need to install anything extra — it works out of the box.
:::

<DocsApi />
