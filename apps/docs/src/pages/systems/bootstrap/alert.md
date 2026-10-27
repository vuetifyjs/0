---
title: BAlert - Bootstrap 6 alert for Vue
meta:
- name: description
  content: Bootstrap 6 alert for Vue. v-model shows the alert. Closing adds .hiding, then the node leaves after the fade. Styled by your CSS.
- name: keywords
  content: bootstrap 6 alert, vue alert, alert hiding, btn-close, paper bootstrap
features:
  category: Component
  label: 'C: BAlert'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/close
  - /systems/bootstrap/toast
---

# BAlert

A status message you can dismiss. `v-model` shows it. Closing fades, then the element leaves.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/alert/"
  title="Alerts"
/>

## Usage

The default alert is a `div.alert` and a paragraph. Leave `theme` off for the neutral alert.

::: ds-example
/systems/bootstrap/alert/basic
:::

## Examples

::: ds-example
/systems/bootstrap/alert/dismiss

### Dismiss

Set the model to `false` to close. The root gains `.hiding` and unmounts after 150ms, which is the pin's `--bs-alert-transition-duration`. Put a [BClose](/systems/bootstrap/close) in the slot and point its click at the model. The close button does not dismiss on its own.
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<div class="alert theme-warning" role="alert">
  <p>A simple alert. Check it out.</p>
</div>
```

```vue Vue collapse
<template>
  <BAlert v-model="open" class="d-flex align-items-center" theme="warning">
    <p class="mb-0">A simple alert. Check it out.</p>
    <BClose class="ms-auto" @click="open = false" />
  </BAlert>
</template>
```

:::

`theme` adds `theme-{theme}`. `instant` adds `.alert-instant` and unmounts in the same turn. Reduced motion does the same. Do not also wrap the alert in `v-if`. That removes the node before `.hiding` can fade.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BAlert } from '@paper/bootstrap'
</script>

<template>
  <BAlert>
    <p>A simple alert. Check it out.</p>
  </BAlert>
</template>
```

## Composed on v0

The root is [Alert](/components/semantic/alert), renderless, so `role`, `aria-live`, and `aria-atomic` sit on `div.alert`. Showing and hiding go through [usePresence](/composables/system/use-presence). The fade is [useTimer](/composables/system/use-timer) at 150ms, then presence unmounts. Reduced motion is [useMediaQuery](/composables/system/use-media-query) and skips the wait, same as `instant`. Opening again during the fade cancels the leave.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `true` | `true` shows the alert. `false` starts the close. |
| `theme` | `string` | | Adds `theme-{theme}`. |
| `instant` | `boolean` | `false` | Adds `.alert-instant` and unmounts immediately. |

## Accessibility

The root is a live region: `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`. The dismiss control is a separate [BClose](/systems/bootstrap/close), so its name stays "Close". There is no `data-bs-dismiss`.
