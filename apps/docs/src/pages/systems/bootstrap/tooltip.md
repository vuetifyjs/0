---
title: BTooltip - Bootstrap 6 Tooltip for Vue
meta:
- name: description
  content: Bootstrap 6's tooltip markup with Vuetify0 behavior — hover, focus, delay, and Escape, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 tooltip, vue tooltip, hover, focus, placement, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BTooltip'
  level: 2
  renderless: false
  group: overlay
related:
  - /systems/bootstrap
  - /systems/bootstrap/menu
  - /systems/bootstrap/toast
  - /composables/system/use-popover
  - /composables/system/use-delay
---

# BTooltip

A tip on a button or a link. It stays open while the pointer is on the trigger or the tip, and Escape closes it.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/tooltip/"
  title="Tooltips"
/>

## Usage

`v-model` owns `.show`. The trigger is the default slot. Bind `attrs` on that control so it is described by the tip while the tip is open.

::: ds-example
/systems/bootstrap/tooltip/basic
:::

### The markup Bootstrap documents

The HTML tab is the tip the v6 plugin generates. `bs-tooltip-auto` and `data-bs-placement` are how the arrow stylesheet finds its side. The Vue tab is the component that renders the same tree. `data-bs-toggle` is the bundle's behavior. This package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<div class="tooltip bs-tooltip-auto show" role="tooltip" data-bs-placement="top">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Tooltip on top
  </div>
</div>
```

```vue Vue collapse
<template>
  <BTooltip text="Tooltip on top" v-slot="{ attrs }">
    <button class="btn-solid theme-primary" type="button" v-bind="attrs">
      Tooltip on top
    </button>
  </BTooltip>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BTooltip } from '@paper/bootstrap'
</script>

<template>
  <BTooltip>
    <button />
  </BTooltip>
</template>
```

## Composed on v0

Position comes from [usePopover](/composables/system/use-popover). The default adapter writes CSS anchor positioning onto the tip (`position: fixed`, `position-area`). The tip does not use the native `popover` attribute, which would put it in the top layer and fight `.tooltip { display: block }`.

`placement` defaults to `top`. The same token is `data-bs-placement`. Show and hide wait on [useDelay](/composables/system/use-delay). The default wait is 0, so they happen in the same turn.

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

## Examples

::: ds-example
/systems/bootstrap/tooltip/placement

### Placement

`placement` is the side the tip sits on. `top`, `right`, `bottom`, and `left` center it on that side of the trigger. Adding `-start` or `-end` shares one edge with the trigger instead of centering on it. The same token is written to `data-bs-placement`, and that is the hook the arrow stylesheet uses to pick an edge.

Pick a side below. The tip stays open, so the move is the thing you see. These are the physical sides. Logical `start` / `end`, and a placement that changes at a breakpoint, are not part of this component.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Adds `.show` on `.tooltip`. |
| `text` | `string` | `''` | Tip text. An empty title does not open. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'`, plus `-start` and `-end` | `'top'` | Where the tip sits, and the `data-bs-placement` hook. |
| `trigger` | `'hover focus' \| 'hover' \| 'focus' \| 'click'` | `'hover focus'` | What opens the tip. |
| `delay` | `number \| { show?: number, hide?: number }` | `0` | Milliseconds before show and hide. |
| `instant` | `boolean` | `false` | Adds `.tooltip-instant`. Skips the opacity transition. |

The `content` slot replaces `text` when the body is markup you write yourself. The title string is never parsed as HTML.

## Accessibility

The tip is `role="tooltip"`. While it is open, the trigger's `aria-describedby` points at it, when the trigger binds `attrs`. Hover and focus both open it, so a keyboard user reaches the same tip. The pointer can move onto the tip without dismissing it. Escape closes it and is consumed, so a dialog behind it stays open. The rest of the page stays usable.

A `disabled` control does not fire pointer events. Give that control `pointer-events: none` so the wrapper receives the hover.
