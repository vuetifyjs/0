---
title: Otp - One-Time Password Input
meta:
- name: description
  content: Headless one-time-password and verification-code boxes with auto-advance, paste distribution, pattern-gated entry, and an observational complete event for Vue 3.
- name: keywords
  content: otp, one-time password, verification code, pin input, Vue 3, headless, accessible
features:
  category: Component
  label: 'C: Otp'
  github: /components/Otp/
  renderless: false
  level: 2
related:
  - /composables/forms/create-otp
  - /components/forms/input
---

# Otp

Headless one-time-password and verification-code boxes with auto-advance, paste distribution, and an observational complete event.

<DocsPageFeatures :frontmatter />

## Usage

Otp renders a group of single-character boxes. Items expose fill state via data attributes for CSS-only styling.

::: gn-example
/components/otp/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Otp } from '@vuetify/v0'
</script>

<template>
  <Otp.Root>
    <Otp.Item />

    <Otp.HiddenInput />
  </Otp.Root>
</template>
```

## Examples

::: gn-example
/components/otp/useTwoFactor.ts 1
/components/otp/TwoFactorForm.vue 2
/components/otp/two-factor.vue 3

### Two-factor sign-in form

A second-factor step that posts the code through a real `<form>` the moment the last box fills. Setting `name="code"` on `Otp.Root` auto-renders `Otp.HiddenInput`, so the joined value travels with the form like any native field — the summary panel reads it back with `new FormData(form)` to prove what the browser would send. There is no submit button: `@complete` calls `requestSubmit()`, which runs the [Form](/components/forms/form) submit pipeline (including any registered field validation) before the `@submit` handler fires.

Form runs in `renderless` mode so the example owns the `<form>` element and can hand it to `FormData`; Form's `@submit` resolves after its async validation pass, by which point the hidden input carries the full code.

Reach for this shape when the code is the whole step and nothing else needs confirming. If the server can reject the code and the field must clear and lock while the request is in flight, build on [createOtp](/composables/forms/create-otp) and its decisional `onComplete` instead — `@complete` is observational and cannot veto a value. Related: [Input](/components/forms/input), [Form](/components/forms/form).

| File | Role |
|------|------|
| `useTwoFactor.ts` | Owns the code, the submitted payload, and reset |
| `TwoFactorForm.vue` | Renders Otp inside a Form and auto-submits on `@complete` |
| `two-factor.vue` | Wires the composable to the form and shows the posted payload |
:::

## Recipes

### Completion

`@complete` fires when the joined value becomes a new complete string. It is observational — return values are ignored, same as Form `@submit` and Portal `@close`. For reject-and-retry (clear on invalid code, lock while a request is in flight), use [createOtp](/composables/forms/create-otp) and its `onComplete` option.

```vue
<script setup lang="ts">
  import { Otp } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const code = shallowRef('')

  function verify (value: string) {
    void fetch('/verify', { method: 'POST', body: value })
  }
</script>

<template>
  <Otp.Root
    v-slot="{ items }"
    v-model="code"
    :length="6"
    @complete="verify"
  >
    <Otp.Item
      v-for="item in items"
      :key="item.index"
      :index="item.index"
    />
  </Otp.Root>
</template>
```

## Accessibility

Otp.Root is a `role="group"` with a locale-driven default accessible name. Each Item is a single-character text input with `autocomplete="one-time-code"` so password managers and SMS autofill can target the field.

### Keyboard

| Key | Action |
|-----|--------|
| Character | Writes the character if it matches `pattern` at `min(focused index, current length)` on the compact string and advances. A keystroke in a later empty box lands in the first empty slot, not the focused box |
| Backspace (empty box) | Clears the previous box and moves focus back |
| Backspace (filled box) | Truncates the compact value from this index onward — this box and every box after it clear |
| ArrowLeft / ArrowRight | Move focus to the previous / next box (RTL-aware) |
| Home / End | Move focus to the first / last box |
| Paste | Distributes clipboard text from `min(focused index, current length)` on the compact string. A paste into a later empty box fills from the first empty slot, not the focused box |

### ARIA

**Root:**

| Attribute | Value |
|-----------|-------|
| `role` | `group` |
| `aria-label` | Locale default, or `ariaLabel` when `ariaLabelledby` is unset |
| `aria-labelledby` | When `ariaLabelledby` is set (replaces `aria-label`) |
| `aria-describedby` | When `ariaDescribedby` is set |
| `aria-disabled` | `true` when disabled |

**Item:**

| Attribute | Value |
|-----------|-------|
| `aria-label` | Locale default, e.g. "Digit 1 of 6" |
| `aria-describedby` | Same id as Root when `ariaDescribedby` is set |
| `autocomplete` | `one-time-code` |
| `inputmode` | `numeric` when `pattern` is `'numeric'`, otherwise `text` |

### Data Attributes

**Root:**

| Attribute | Description |
|-----------|-------------|
| `data-disabled` | Present when disabled |
| `data-readonly` | Present when readonly |
| `data-complete` | Present when the value is complete and pattern-valid |

**Item:**

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-state` | `filled` \| `empty` | Whether this box has a character |
| `data-disabled` | present/absent | Inherited from root |
| `data-readonly` | present/absent | Inherited from root |

## FAQ

::: faq

??? How do I render N boxes?

Bind `length` on Root and v-for the slot `items` array — same pattern as Rating. Do not write the number twice.

```vue
<template>
  <Otp.Root v-slot="{ items }" v-model="code" :length="length">
    <Otp.Item
      v-for="item in items"
      :key="item.index"
      :index="item.index"
    />
  </Otp.Root>
</template>
```

??? How do I reject an invalid code?

`@complete` does not reject — Vue events are observational. Pass `onComplete` to [createOtp](/composables/forms/create-otp) and return or resolve `false`. That path clears the value, sets `input.errors`, and locks mutations while an async check is in flight.

??? How does form submission work?

Set the `name` prop on Root. A hidden input is auto-rendered with the current joined value:

```vue
<template>
  <Otp.Root v-slot="{ items }" v-model="code" name="verification-code" :length="6">
    <Otp.Item
      v-for="item in items"
      :key="item.index"
      :index="item.index"
    />
  </Otp.Root>
</template>
```

Place `Otp.HiddenInput` yourself only when you need to control where the hidden field sits in the form.

??? How do I change which characters are accepted?

Pass `pattern` on Root. Presets are `'numeric'` (default), `'alphanumeric'`, and `'alphabetic'`; a custom `RegExp` is tested per character. `inputmode` follows the preset — `numeric` for `'numeric'`, `text` otherwise.

```vue
<template>
  <Otp.Root v-slot="{ items }" v-model="code" pattern="alphanumeric" :length="8">
    <Otp.Item
      v-for="item in items"
      :key="item.index"
      :index="item.index"
    />
  </Otp.Root>
</template>
```

:::

<DocsApi />
