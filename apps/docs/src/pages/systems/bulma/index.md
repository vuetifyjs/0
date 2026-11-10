---
title: Bulma - Vue Behavior for Bulma's Markup
meta:
- name: description
  content: Bulma ships zero JavaScript by design. @paper/bulma is that JavaScript. Real Bulma markup and classes, styled by your own bulma.css, driven by Vuetify0.
- name: keywords
  content: bulma, vue, bulma vue components, compat design system, headless, vuetify0, paper
features:
  category: Guide
  label: 'Bulma'
  level: 2
  order: 0
related:
  - /systems/bulma/conformance
  - /systems/bulma/modal
  - /systems/bulma/dropdown
---

# Bulma

<DocsPageFeatures :frontmatter />

`@paper/bulma` is the JavaScript Bulma does not ship. Components render Bulma's markup and classes against the `bulma.css` you load. [Vuetify0](/) supplies open, close, focus, and keyboard behavior.

<DocsSystemActivator palette="bulma" />

> [!NOTE]
> Reference: [Bulma documentation](https://bulma.io/documentation/). Class names and visual variants. This package is the JavaScript.

::: ds-example no-resize
/systems/bulma/overview
:::

## Installation

::: code-group no-filename

```bash pnpm
pnpm add @paper/bulma bulma
```

```bash npm
npm install @paper/bulma bulma
```

```bash yarn
yarn add @paper/bulma bulma
```

```bash bun
bun add @paper/bulma bulma
```

:::

Bulma itself is an optional peer dependency. Load it from npm, from Sass, or from a CDN. The package never imports it, and it ships no plugin and no CSS.

```ts main.ts
import { createApp } from 'vue'
import App from './App.vue'

import 'bulma/css/bulma.min.css'

createApp(App).mount('#app')
```

Import a component and use it:

```vue collapse
<script setup lang="ts">
  import { BuModal } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="button is-primary" type="button" @click="open = true">
    Open modal
  </button>

  <BuModal v-model="open">
    <BuModal.Content>
      <div class="box">Your content</div>
    </BuModal.Content>

    <BuModal.Close />
  </BuModal>
</template>
```

Bulma 1.0 or newer is required. The version pin and the markup diff are on the [conformance](/systems/bulma/conformance) page.

## Components

Every component below is exported from `@paper/bulma` and has its own page.

| Component | What it wraps | Page |
|-----------|---------------|------|
| `BuBreadcrumb` | Bulma markup | [Breadcrumb](/systems/bulma/breadcrumb) |
| `BuCheckbox` | v0 `createInput` | [Checkbox](/systems/bulma/checkbox) |
| `BuControl` | Bulma markup | [Field](/systems/bulma/field) |
| `BuDropdown` | v0 `useClickOutside` | [Dropdown](/systems/bulma/dropdown) |
| `BuField` | Bulma markup | [Field](/systems/bulma/field) |
| `BuFile` | v0 `createInput` | [File](/systems/bulma/file) |
| `BuHelp` | Bulma markup | [Field](/systems/bulma/field) |
| `BuInput` | v0 `Input` | [Input](/systems/bulma/input) |
| `BuLabel` | Bulma markup | [Field](/systems/bulma/field) |
| `BuMenu` | v0 `Single` | [Menu](/systems/bulma/menu) |
| `BuMessage` | v0 `Presence` | [Message](/systems/bulma/message) |
| `BuModal` | v0 `Dialog` | [Modal](/systems/bulma/modal) |
| `BuNavbar` | boolean open state | [Navbar](/systems/bulma/navbar) |
| `BuNotification` | v0 `Presence` | [Notification](/systems/bulma/notification) |
| `BuNumberField` | v0 `NumberField` | [Number field](/systems/bulma/number-field) |
| `BuPagination` | v0 `Pagination` | [Pagination](/systems/bulma/pagination) |
| `BuPanel` | v0 `Selection` | [Panel](/systems/bulma/panel) |
| `BuRadio` | v0 `createInput` | [Radio](/systems/bulma/radio) |
| `BuSelect` | v0 `createInput` | [Select](/systems/bulma/select) |
| `BuTabs` | v0 `Tabs` | [Tabs](/systems/bulma/tabs) |
| `BuTextarea` | v0 `Input` | [Textarea](/systems/bulma/textarea) |

There are no named slots. Each region is its own component. Pass `namespace` only when two of the same compound are nested.
