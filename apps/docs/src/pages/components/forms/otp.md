---
title: Otp - One-Time Password Input
meta:
- name: description
  content: Headless one-time-password and verification-code boxes with auto-advance, paste distribution, pattern-gated entry, and a decisional completion hook for Vue 3.
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

Headless one-time-password and verification-code boxes with auto-advance, paste distribution, and a decisional completion hook.

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

## Recipes

### Verifying the code

`onComplete` fires once when the joined value first reaches `length` with every character passing the pattern. Return or resolve `false` to reject — the value clears and Root surfaces the error via `isError`, `errors`, `aria-invalid`, and `data-error`. The next successful mutation clears the error automatically. While an async check is in flight, `isValidating` is true, mutations no-op, and Root sets `aria-busy`.

```vue
<script setup lang="ts">
  import { Otp } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const code = shallowRef('')
  const statusId = 'otp-status'

  async function verify (value: string) {
    const res = await fetch('/verify', { method: 'POST', body: value })
    return res.ok
  }
</script>

<template>
  <Otp.Root
    v-slot="{ items, isError, errors, isValidating }"
    v-model="code"
    :length="6"
    :aria-describedby="statusId"
    :on-complete="verify"
  >
    <Otp.Item
      v-for="item in items"
      :key="item.index"
      :index="item.index"
    />
    <p
      :id="statusId"
      aria-live="polite"
    >
      <template v-if="isValidating">Verifying…</template>
      <template v-else-if="isError">{{ errors[0] }}</template>
    </p>
  </Otp.Root>
</template>
```

See [createOtp](/composables/forms/create-otp) for the completion edge, lock window, and reject-and-retry contract.

## Accessibility

Otp.Root is a `role="group"` with a locale-driven default accessible name. Each Item is a single-character text input with `autocomplete="one-time-code"` so password managers and SMS autofill can target the field.

### Keyboard

| Key | Action |
|-----|--------|
| Character | Writes the character if it matches `pattern` at `min(focused index, current length)` on the compact string and advances. A keystroke in a later empty box lands in the first empty slot, not the focused box |
| Backspace (empty box) | Clears the previous box and moves focus back |
| Backspace (filled box) | Truncates the compact value from this index onward — this box and every box after it clear |
| ArrowLeft | Move focus to the previous box |
| ArrowRight | Move focus to the next box |
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
| `aria-busy` | `true` while an async `onComplete` is in flight |
| `aria-invalid` | `true` when `onComplete` has rejected (or another error is present) |

**Item:**

| Attribute | Value |
|-----------|-------|
| `aria-label` | Locale default, e.g. "Digit 1 of 6" |
| `aria-invalid` | `true` when `onComplete` has rejected (omitted when valid) |
| `aria-describedby` | Same id as Root when `ariaDescribedby` is set |
| `autocomplete` | `one-time-code` |
| `inputmode` | `numeric` when `pattern` is `'numeric'`, otherwise `text` |
| `maxlength` | `1` |

Slot props `isError` and `errors` expose the same rejection state to the template so you can render a message next to the group.

### Data Attributes

**Root:**

| Attribute | Description |
|-----------|-------------|
| `data-disabled` | Present when disabled |
| `data-readonly` | Present when readonly |
| `data-complete` | Present when the value is complete and pattern-valid |
| `data-error` | Present when an error is surfaced (rejected `onComplete`) |

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

??? What happens when onComplete rejects?

Return or resolve `false` (a thrown error or rejected promise is treated the same). The joined value clears, Root sets `isError` / `errors`, and emits `aria-invalid` plus `data-error`. The next successful mutation clears the error so the user can retry. While an async check is pending, `isValidating` is true and further writes no-op.

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
