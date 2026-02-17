---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# Sharing State

Props work great for parent-child communication, but what about deeply nested components? Passing props through every layer is called **prop drilling** — and it gets tedious fast.

## provide / inject

`provide` makes a value available to **all descendants**, no matter how deep. `inject` retrieves it:

```vue
<!-- Parent -->
<script setup>
  import { provide, ref } from 'vue'

  const theme = ref({ compact: false, accent: 'blue' })
  provide('theme', theme)
</script>
```

```vue
<!-- Any descendant -->
<script setup>
  import { inject } from 'vue'

  const theme = inject('theme')
</script>
```

## Reactivity

When you provide a `ref`, injecting components **automatically react** to changes. This is what makes provide/inject powerful for shared UI state like themes, locales, or configuration.

## Default values

If no ancestor provides the key, `inject` returns `undefined` unless you pass a default:

```vue
<script setup>
  const theme = inject('theme', { compact: false, accent: 'info' })
</script>
```

## Try it

The App provides a notification theme (compact mode and accent color). Toggle the settings and watch how `NotificationItem` and `NotificationCard` react — without any props being passed through the tree. Try adding a `showTimestamps` boolean to the provided theme.

> [!TIP] This is exactly how v0 works internally. `createContext` is a type-safe wrapper around provide/inject that ensures components can share state without prop drilling.
