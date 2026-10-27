---
title: BOtp - Bootstrap 6 OTP input for Vue
meta:
- name: description
  content: Bootstrap 6 OTP markup with Vuetify0 boxes — a joined string, auto-advance, and paste across otp-input fields, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 otp, vue otp input, verification code, one time password, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BOtp'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /components/forms/otp
  - /composables/forms/create-otp
---

# BOtp

A row of single-character boxes for a verification code. `v-model` is the joined string.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/otp-input/"
  title="OTP"
/>

## Usage

`length` defaults to 6. Each box is one character. Typing, arrows, Backspace, and paste move across the row. The example uses `sm`. The default slot is the large size, and six of those run past a 390px frame.

::: ds-example
/systems/bootstrap/otp/basic
:::

### The markup Bootstrap documents

The HTML tab is one input. The v6 plugin splits it into boxes. The Vue tab renders those boxes. `data-bs-otp` is the bundle's behavior. This package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<div class="otp">
  <input type="text" class="otp-input" maxlength="6" aria-label="Verification code">
</div>
```

```vue Vue collapse
<template>
  <BOtp v-model="code" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BOtp } from '@paper/bootstrap'
</script>

<template>
  <BOtp />
</template>
```

## Composed on v0

The root is [Otp](/components/forms/otp) `Otp.Root`. Each box is `Otp.Item` with `otp-input` and `otp-slot`, inside `otp-slots`. Value, focus, and paste live in [createOtp](/composables/forms/create-otp). `name` is that root's hidden input.

`connected` adds `otp-connected` on the root. The pin joins `.otp-slot` boxes and drops the gap on `.otp-slots`. `size` sets `--bs-otp-size` through `otp-sm` or `otp-lg`. `state` adds `is-valid` or `is-invalid`, which the pin paints on `.otp-slot`. `.otp-slots` sets `pointer-events: none` so the plugin's decorative slots ignore clicks. Each box adds `pe-auto` because the box is the input. `otp-rendered` is not added. That rule hides `.otp-input`.

## Examples

::: ds-example
/systems/bootstrap/otp/connected

### Connected

`connected` joins the boxes into one control. The value is still one string, and `length` is still the number of boxes.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | Joined value. |
| `length` | `number` | `6` | Number of boxes. |
| `connected` | `boolean` | `false` | Adds `otp-connected`. |
| `size` | `'sm' \| 'lg'` | | Adds `otp-sm` or `otp-lg`. |
| `state` | `'valid' \| 'invalid'` | | Adds `is-valid` or `is-invalid`. |
| `pattern` | `'numeric' \| 'alphanumeric' \| 'alphabetic' \| RegExp` | `'numeric'` | What a box accepts. |
| `disabled` | `boolean` | `false` | Disables every box. |
| `name` | `string` | | Hidden input name. |

`complete` fires when the value first fills `length`.

## Accessibility

The root is a group. Each box is a text input with a position in the label, one character, and `autocomplete="one-time-code"`. Arrow keys move between boxes. Paste spreads across them from the focused box.
