---
title: Alert - Inline Status Messages
meta:
- name: description
  content: Headless compound component for inline status messages with ARIA live-region semantics. Use Alert.Root with role="alert" for urgent messages or role="status" for informational ones.
- name: keywords
  content: alert, status, notification, live region, aria, headless, compound component, accessibility
features:
  category: Component
  label: 'C: Alert'
  github: /components/Alert/
  renderless: false
  level: 2
related:
  - /components/semantic/snackbar
  - /components/disclosure/alert-dialog
  - /composables/plugins/use-notifications
---

# Alert

Headless compound component for inline status messages. Renders a live region that screen readers announce automatically when content appears or changes.

<DocsPageFeatures :frontmatter />

## Usage

::: gn-example
/components/alert/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Alert } from '@vuetify/v0'
</script>

<template>
  <Alert.Root>
    <Alert.Title />

    <Alert.Description />
  </Alert.Root>
</template>
```

## Accessibility

`Alert.Root` is a live region. It emits `role`, `aria-live`, and `aria-atomic="true"` so assistive tech announces the whole message when the region is inserted or updated.

| Role | `aria-live` | When |
| --- | --- | --- |
| `alert` (default) | `assertive` | Errors, session expiry — interrupts immediately |
| `status` | `polite` | Confirmations and info — waits for idle |

Mount `Alert.Root` when the message appears (`v-if`). Do not leave an empty region in the tree and flip it with `v-show` — live regions announce on insertion; `v-show` only toggles `display` and often produces no announcement.

Do not statically mount `role="alert"` as page chrome. An assertive region present at load interrupts the screen reader's first pass of the page. A polite `role="status"` may stay mounted as chrome; insert assertive alerts on demand.

<DocsApi />
