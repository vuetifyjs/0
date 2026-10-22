---
title: BToast - Bootstrap 6 Toast for Vue
meta:
- name: description
  content: Bootstrap 6's toast markup with Vuetify0 behavior — show, autohide, hover pause, and an optional stack, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 toast, vue toast, autohide, snackbar, notification, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BToast'
  level: 2
  renderless: false
  group: overlay
related:
  - /systems/bootstrap
  - /systems/bootstrap/dialog
  - /systems/bootstrap/menu
  - /systems/bootstrap/tooltip
  - /composables/system/use-timer
---

# BToast

A `.toast` that opens with `v-model`. It hides itself after a delay, and that delay restarts while the pointer or focus is on it.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Toasts on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/toasts/). Classes and visual variants. This page is Vue.

## Usage

`v-model` owns `.show`. The header is ordinary markup. The body and the close button are parts.

::: ds-example
/systems/bootstrap/toast/basic
:::

### The markup Bootstrap documents

The HTML tab is the toast from the v6 docs, without `data-bs-dismiss`. That attribute is the bundle's behavior. This package does not emit it. The Vue tab is the component that renders the same tree.

::: code-group no-filename

```html Bootstrap collapse
<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <strong class="me-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div>
```

```vue Vue collapse
<template>
  <BToast v-model="open">
    <div class="toast-header">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <BToast.Close />
    </div>

    <BToast.Body>Hello, world! This is a toast message.</BToast.Body>
  </BToast>
</template>
```

:::

### Stack

`BToast.Queue` is a `.toast-container`. `push` adds a toast. With no slot, the queue renders a body and a close button for each one. A slot receives `items` and `push` when the markup needs to be yours. A single toast does not need the queue, and nothing here requires a plugin.

```vue collapse
<script setup lang="ts">
  import { BToast } from '@paper/bootstrap'

  import { useTemplateRef } from 'vue'

  const queue = useTemplateRef('queue')

  function onSave () {
    queue.value?.push('Saved')
  }
</script>

<template>
  <button class="btn-solid theme-primary" type="button" @click="onSave">
    Save
  </button>

  <BToast.Queue ref="queue" />
</template>
```

Place the container with Bootstrap's own utilities (`position-fixed bottom-0 end-0 p-3`) when it should sit on the viewport.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BToast } from '@paper/bootstrap'
</script>

<template>
  <BToast>
    <BToast.Body />

    <BToast.Close />
  </BToast>
</template>
```

## Composed on v0

Each toast schedules its own hide with [useTimer](/composables/system/use-timer). The delay is 5 seconds. Pointer enter and focus inside clear it. Leaving starts the full delay again.

[createQueue](/composables/registration/create-queue) holds the stack. Bootstrap shows every toast at once, so those tickets do not use the queue's serial timer. Each toast still hides on its own. The node stays mounted through the 0.15s fade, then leaves.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Adds `.show` on `.toast`. |
| `autohide` | `boolean` | `true` | Hide the toast after `delay`. |
| `delay` | `number` | `5000` | Milliseconds before an open toast hides. |
| `instant` | `boolean` | `false` | Adds `.toast-instant`. Skips the opacity transition. |

| Part | Renders | Notes |
|------|---------|-------|
| `BToastBody` | `div.toast-body` | Message content |
| `BToastClose` | `button.btn-close` | Sets the model to `false` |
| `BToastQueue` | `div.toast-container` | `push(message)` adds a toast. Optional. |

`BToast.Queue` takes the same `autohide` and `delay`. `push` accepts `{ autohide, delay }` for one toast.

## Accessibility

The toast is `role="alert"` with `aria-live="assertive"` and `aria-atomic="true"`. The close button's name comes from the locale, and falls back to Close. Hovering the toast or moving focus inside it holds the hide. The rest of the page stays usable.
