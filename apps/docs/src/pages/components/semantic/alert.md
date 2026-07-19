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

## API

### Alert.Root

The root live-region container. Defaults to `role="alert"` (assertive — AT reads it immediately). Use `role="status"` for polite, non-urgent messages.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `role` | `'alert' \| 'status'` | `'alert'` | ARIA live-region role |
| `as` | `string \| Component` | `'div'` | Root element |

### Alert.Title

Heading element for the alert. Renders as `<h5>` by default.

### Alert.Description

Description paragraph for the alert. Renders as `<p>` by default.
