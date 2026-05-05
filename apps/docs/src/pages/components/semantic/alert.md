---
title: Alert - Inline Status Banner Component
meta:
- name: description
  content: Headless inline alert component with role="alert" for status messages, warnings, and dismissible banners. Composable sub-components for icon, title, description, and dismiss action.
- name: keywords
  content: alert, banner, notification, status, warning, error, success, info, dismissible, Vue 3, headless, accessible, WAI-ARIA
features:
  category: Component
  label: 'C: Alert'
  github: /components/Alert/
  renderless: false
  level: 2
related:
  - /components/semantic/snackbar
  - /components/disclosure/alert-dialog
  - /components/semantic/progress
---

# Alert

Inline status banner for persistent, non-interrupting feedback — errors, warnings, and contextual notices.

<DocsPageFeatures :frontmatter />

## Usage

Alert renders with `role="alert"` so screen readers announce the content automatically when the component enters the DOM. Use it for feedback that belongs inline with page content and does not require user acknowledgement.

::: example
/components/alert/basic

### Informational and warning banners

Static alerts with icon, title, and description — the most common pattern for system notices, in-form error summaries, and section-level warnings.

| Sub-component | Role |
|---|---|
| `Alert.Root` | Container; carries `role="alert"` and ARIA ID links |
| `Alert.Icon` | Decorative icon wrapper; `aria-hidden="true"` by default |
| `Alert.Title` | Heading with auto-generated ID for `aria-labelledby` |
| `Alert.Description` | Body text with auto-generated ID for `aria-describedby` |

:::

## Anatomy

```vue Anatomy playground collapse
<script setup lang="ts">
  import { Alert } from '@vuetify/v0'
</script>

<template>
  <Alert.Root>
    <Alert.Icon />
    <Alert.Title />
    <Alert.Description />
    <Alert.Action />
  </Alert.Root>
</template>
```

## Examples

::: example
/components/alert/dismissible

### Dismissible alerts

Alerts can be made dismissible by adding `Alert.Action` and binding `v-model` on `Alert.Root`. When the action is clicked, `dismiss()` is called internally and `v-model` is set to `false`.

Use `v-if` on `Alert.Root` to remove the element from the DOM after dismissal — `role="alert"` elements should not stay in the DOM silently, because some screen readers re-announce live regions when page state changes.

```vue
<template>
  <Alert.Root v-if="visible" v-model="visible">
    ...
    <Alert.Action>✕</Alert.Action>
  </Alert.Root>
</template>
```

You can also react to the model externally — for example, to persist the dismissed state across sessions:

```ts
const dismissed = useStorage('alert-dismissed', false)
```

```vue
<template>
  <Alert.Root v-if="!dismissed" v-model:model-value="isDismissed => dismissed = isDismissed">
    ...
  </Alert.Root>
</template>
```

| File | Role |
|---|---|
| `dismissible.vue` | Two dismissible alerts with v-model binding and a reset button |

:::

## Alert vs Snackbar vs AlertDialog

| | Alert | Snackbar | AlertDialog |
|---|---|---|---|
| **Position** | Inline, in document flow | Floating overlay | Modal overlay |
| **Auto-dismiss** | No | Yes (configurable) | No |
| **Interrupts focus** | No | No | Yes — focus moves to dialog |
| **ARIA** | `role="alert"` | `role="status"` / `role="alert"` | `role="alertdialog"` |
| **Use case** | Persistent page-level notices | Transient confirmations | Requires explicit acknowledgement |

> [!TIP]
> Alerts present in the DOM **before** page load are not announced by most screen readers — the live region only fires on mutation. Dynamically insert the alert (via `v-if`) after user action or data load to guarantee announcement.

> [!WARNING]
> Do not auto-dismiss alerts. The WAI-ARIA spec notes that alerts that disappear automatically violate WCAG 2.0 criterion 2.2.3 (No Timing). If you need ephemeral, auto-dismissing feedback, use [Snackbar](/components/semantic/snackbar) instead.

## Accessibility

### ARIA roles and attributes

| Attribute | Element | Value | Purpose |
|---|---|---|---|
| `role` | `Alert.Root` | `"alert"` | Declares a live region with `aria-live="assertive"` implicit semantics |
| `aria-labelledby` | `Alert.Root` | `{id}-title` | Links root to `Alert.Title` for accessible name |
| `aria-describedby` | `Alert.Root` | `{id}-description` | Links root to `Alert.Description` for supplementary text |
| `id` | `Alert.Title` | `{id}-title` | Target for `aria-labelledby` |
| `id` | `Alert.Description` | `{id}-description` | Target for `aria-describedby` |
| `aria-hidden` | `Alert.Icon` | `"true"` | Hides decorative icon from screen reader tree |
| `type` | `Alert.Action` | `"button"` | Prevents accidental form submission |
| `aria-label` | `Alert.Action` | locale `Alert.dismiss` | Accessible name for icon-only dismiss buttons |

### Screen reader behavior

`role="alert"` has implicit `aria-live="assertive"` and `aria-atomic="true"` in all major browsers. When an alert enters or changes in the DOM, the entire alert content is announced immediately, interrupting any in-progress announcements.

For non-urgent status messages (e.g. "saved successfully"), prefer [Snackbar](/components/semantic/snackbar) which uses `aria-live="polite"` and does not interrupt.

### Icon accessibility

`Alert.Icon` renders `aria-hidden="true"` by default. If your icon communicates meaning beyond what the text already conveys (e.g. an icon that is the *only* indicator of severity), remove `aria-hidden` and provide a visible or screen-reader-only label instead:

```vue
<template>
  <!-- Icon carries unique meaning — expose it -->
  <Alert.Icon :aria-hidden="false" aria-label="Error">
    <ErrorIcon />
  </Alert.Icon>
</template>
```

<DocsApi />
