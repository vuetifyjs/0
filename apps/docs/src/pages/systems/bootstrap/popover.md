---
title: BPopover - Bootstrap 6 Popover for Vue
meta:
- name: description
  content: Bootstrap 6's popover markup with Vuetify0 behavior — click, title, delay, and Escape, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 popover, vue popover, click, placement, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BPopover'
  level: 2
  renderless: false
  group: overlay
related:
  - /systems/bootstrap
  - /systems/bootstrap/tooltip
  - /systems/bootstrap/collapse
  - /composables/system/use-popover
  - /composables/system/use-delay
---

# BPopover

A panel anchored to a button. Click toggles it, and Escape closes it.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Popovers on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/popovers/). Classes and visual variants. This page is Vue.

## Usage

`v-model` owns `.show`. The trigger is the default slot. Bind `attrs` on that control so it is described by the popover while the popover is open.

::: ds-example
/systems/bootstrap/popover/basic
:::

### The markup Bootstrap documents

The HTML tab is the popover the v6 plugin generates. `bs-popover-auto` and `data-bs-placement` are how the arrow stylesheet finds its side. The Vue tab is the component that renders the same tree. `data-bs-toggle` is the bundle's behavior. This package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<div class="popover bs-popover-auto show" role="tooltip" data-bs-placement="top">
  <div class="popover-arrow"></div>
  <h3 class="popover-header">Popover title</h3>
  <div class="popover-body">This is the popover content—make it as long as you want.</div>
</div>
```

```vue Vue collapse
<template>
  <BPopover title="Popover title" text="This is the popover content—make it as long as you want." v-slot="{ attrs }">
    <button class="btn-solid theme-primary" type="button" v-bind="attrs">
      Toggle popover
    </button>
  </BPopover>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BPopover } from '@paper/bootstrap'
</script>

<template>
  <BPopover>
    <button />
  </BPopover>
</template>
```

## Composed on v0

Position comes from [usePopover](/composables/system/use-popover). The default adapter writes CSS anchor positioning onto the popover (`position: fixed`, `position-area`). The popover does not use the native `popover` attribute, which would put it in the top layer and fight `.popover { display: block }`.

`placement` defaults to `top`. The same token is `data-bs-placement`. Show and hide wait on [useDelay](/composables/system/use-delay). The default wait is 0, so they happen in the same turn. The gap between the trigger and the popover is a `0.4rem` margin on the popover's side.

### Other browsers

CSS anchor positioning covers current Chrome, Edge, Safari 26, and Firefox. Firefox ESR and Safari before 26 need a positioning engine in the app.

```ts
import { createPopoverPlugin } from '@vuetify/v0'
import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'

app.use(createPopoverPlugin({
  adapter: new FloatingUIPopoverAdapter(),
}))
```

That plugin is an application dependency. This package does not import Floating UI.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Adds `.show` on `.popover`. |
| `title` | `string` | `''` | Header text. An empty title omits the header. |
| `text` | `string` | `''` | Body text. An empty string omits the body unless the content slot is set. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'`, plus `-start` and `-end` | `'top'` | Where the popover sits, and the `data-bs-placement` hook. |
| `trigger` | `'click' \| 'hover' \| 'focus' \| 'hover focus'` | `'click'` | What opens the popover. |
| `delay` | `number \| { show?: number, hide?: number }` | `0` | Milliseconds before show and hide. |
| `instant` | `boolean` | `false` | Adds `.popover-instant`. Skips the opacity transition. |

The `content` slot replaces `text` when the body is markup you write yourself. Title and text are never parsed as HTML. If both strings are empty and the content slot is absent, the popover does not take `.show`.

## Accessibility

The popover is `role="tooltip"`. While it is open, the trigger's `aria-describedby` points at it, when the trigger binds `attrs`. That is the only attribute the slot passes. Click toggles it. Escape closes it and is consumed, so a dialog behind it stays open.
