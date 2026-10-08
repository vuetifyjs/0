---
title: Bootstrap - Vue Behavior for Bootstrap 6 Markup
meta:
- name: description
  content: Keep your Bootstrap 6 CSS. @paper/bootstrap renders the markup Bootstrap documents and drives it with Vuetify0, so you can drop bootstrap.bundle.js.
- name: keywords
  content: bootstrap 6, vue, bootstrap vue, dialog, compat, headless, vuetify0, paper
features:
  category: Guide
  label: 'Bootstrap'
  level: 2
  order: 0
related:
  - /systems/bootstrap/dialog
  - /components/disclosure/dialog
---

# Bootstrap

Keep your Bootstrap 6 CSS. Delete `bootstrap.bundle.js`. These components render the markup getbootstrap.com documents.

<DocsPageFeatures :frontmatter />

Bootstrap 6 ships the `.dialog`, `.menu`, and `.btn-solid` styles, plus a JavaScript bundle that opens them. `@paper/bootstrap` is that behavior, written on [Vuetify0](/), against the classes you already load. Nothing about your stylesheet changes. There is no theme to adopt and no CSS in the package.

> [!NOTE]
> Bootstrap 6 is not on npm yet. The sandbox and the conformance fixtures are pinned to a `v6-dev` commit recorded in the package. Load that CSS, or the release, yourself.

## Installation

```bash
pnpm add @paper/bootstrap
```

Bootstrap itself is an **optional** peer once 6.x is published. Until then, load the pinned stylesheet:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/twbs/bootstrap@f6cc0f2cde9cbf3d73759ada24a39555d2de3a12/dist/css/bootstrap.min.css"
>
```

There is no plugin to install. Import a component and use it:

```vue collapse
<script setup lang="ts">
  import { BDialog } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="btn-solid theme-primary" type="button" @click="open = true">
    Open dialog
  </button>

  <BDialog v-model="open">
    <BDialog.Header>
      <BDialog.Title>Dialog title</BDialog.Title>
      <BDialog.Close />
    </BDialog.Header>

    <BDialog.Body>
      <p>Real Bootstrap markup. Vuetify0 behavior.</p>
    </BDialog.Body>
  </BDialog>
</template>
```

Do not load `bootstrap.bundle.js` next to this package. The two would both try to own the same dialog.
