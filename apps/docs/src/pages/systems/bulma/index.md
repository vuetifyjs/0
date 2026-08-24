---
title: Bulma - Vue Behavior for Bulma's Markup
meta:
- name: description
  content: Bulma ships zero JavaScript by design. @paper/bulma is that JavaScript — real Bulma markup and classes, styled by your own bulma.css, driven by Vuetify0.
- name: keywords
  content: bulma, vue, bulma vue components, compat design system, headless, vuetify0, paper
features:
  category: Guide
  label: 'Bulma'
  level: 2
  order: 0
related:
  - /systems/bulma/breadcrumb
  - /systems/bulma/checkbox
  - /systems/bulma/dropdown
  - /systems/bulma/field
  - /systems/bulma/file
  - /systems/bulma/input
  - /systems/bulma/menu
  - /systems/bulma/message
  - /systems/bulma/modal
  - /systems/bulma/navbar
  - /systems/bulma/notification
  - /systems/bulma/number-field
  - /systems/bulma/pagination
  - /systems/bulma/panel
  - /systems/bulma/radio
  - /systems/bulma/select
  - /systems/bulma/tabs
  - /systems/bulma/textarea
---

# Bulma

Bulma tells you to bring your own JavaScript. This package is that JavaScript.

<DocsPageFeatures :frontmatter />

Bulma is a CSS framework — it ships the `.modal`, `.dropdown` and `.navbar` styles and stops there, leaving every open, close, dismiss and keyboard interaction to you. `@paper/bulma` fills that gap: each component renders the markup Bulma documents, against the `bulma.css` you already load, with [Vuetify0](/) supplying behavior, focus management and accessibility.

Nothing about your stylesheet changes. There is no theme to adopt, no class prefix to learn, and no CSS in the package.

> [!NOTE]
> Reference: [Bulma documentation](https://bulma.io/documentation/) — the class catalog this package implements.

::: ds-example no-resize
/systems/bulma/overview
:::

## Installation

```bash
pnpm add @paper/bulma bulma
```

Bulma itself is an **optional** peer dependency — load it from npm, from Sass, or from a CDN. The package never imports it.

```ts main.ts
import { createApp } from 'vue'
import App from './App.vue'

import 'bulma/css/bulma.min.css'

createApp(App).mount('#app')
```

There is no plugin to install and no provider to mount. Import a component and use it:

```vue collapse
<script setup lang="ts">
  import { BuModal, BuModalClose, BuModalContent } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="button is-primary" type="button" @click="open = true">
    Open modal
  </button>

  <BuModal v-model="open">
    <BuModalContent>
      <div class="box">Your content</div>
    </BuModalContent>

    <BuModalClose />
  </BuModal>
</template>
```

Every region Bulma documents is an express part component — `BuModalContent`, `BuModalHead`, `BuDropdownMenu` — never a named slot. You compose the markup you already know.

> [!NOTE]
> Bulma **1.0+** only. The 0.9.x line predates Bulma's CSS variables and is explicitly unsupported. Latest verified: 1.0.4.

## What conformance means

Every component is diffed against the markup [published on bulma.io](https://bulma.io/documentation/). The fixtures live beside the source in `packages/bulma/harness/fixtures/`, captured verbatim from the documentation, and the conformance suite asserts that the rendered DOM matches — element for element, class for class.

Where the two differ, the difference is deliberate and declared:

| Deviation | Why |
|-----------|-----|
| No owned token namespace | `--bulma-*` belongs to upstream; the package owns no prefix |
| Upstream state classes, unprefixed | `is-active` and `is-hoverable` instead of data-attribute hooks — Bulma's CSS selects on them |
| Native form controls | Bulma styles native `select`, `input[type=checkbox]` and friends; a non-native control gets none of your CSS |
| Added aria | `BuDropdownMenu` emits `role="menu"` only when its items really are menu items[^dropdown-menu]; `BuNotificationDelete` labels its delete button |

## Components

Grouped by Bulma's own taxonomy. Each entry is the component you compose against; its regions ship as parts under it.

| Bulma section | Components |
|---------------|------------|
| Components | [BuBreadcrumb](/systems/bulma/breadcrumb), [BuDropdown](/systems/bulma/dropdown), [BuMenu](/systems/bulma/menu), [BuMessage](/systems/bulma/message), [BuModal](/systems/bulma/modal), [BuNavbar](/systems/bulma/navbar), [BuPagination](/systems/bulma/pagination), [BuPanel](/systems/bulma/panel), [BuTabs](/systems/bulma/tabs) |
| Elements | [BuNotification](/systems/bulma/notification) |
| Form | [BuCheckbox](/systems/bulma/checkbox), [BuControl](/systems/bulma/field), [BuField](/systems/bulma/field), [BuFile](/systems/bulma/file), [BuHelp](/systems/bulma/field), [BuInput](/systems/bulma/input), [BuLabel](/systems/bulma/field), [BuRadio](/systems/bulma/radio), [BuSelect](/systems/bulma/select), [BuTextarea](/systems/bulma/textarea) |
| None — composed | [BuNumberField](/systems/bulma/number-field)[^composed] |

[^composed]: Bulma documents no number input. BuNumberField composes one out of the form parts it does document — attached controls, buttons and an input — so its conformance fixture is self-authored rather than captured, and declares the upstream provenance of every class in it.

[^dropdown-menu]: Both additions fix axe failures in the verbatim documentation markup — the docs' arbitrary-content dropdown promises `role="menu"` without menu items, and its delete button ships unlabeled.
