---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# The complete panel

You've learned six v0 components: `Single`, `Tabs`, `Checkbox`, `Radio`, `ExpansionPanel`, and `Dialog`. Now let's bring them all together into a polished settings panel with persistent storage.

## Persisting state with createStorage

v0 provides `createStorage` for reactive localStorage that syncs automatically:

```vue
<script setup>
  import { createStorage } from '@vuetify/v0'

  const storage = createStorage()
  const notifications = storage.get('notifications', ['email'])
</script>
```

The returned ref syncs with localStorage on every change. Refresh the page and your settings persist.

## Composing components

The power of headless components shines when you compose them together. Each component handles its own behavior and accessibility — you just arrange them into the layout you want. No fighting with opinionated styling or override hacks.

## Try it

Try changing some settings and refreshing the preview — your choices persist through `createStorage`. You could also add a theme radio using `useTheme` from v0 to toggle between light and dark mode.

## What's next

You've built a fully interactive, accessible settings panel using nothing but headless components and utility classes. Every component handles keyboard navigation, ARIA attributes, and state management. You handled every pixel of the styling.

> [!TIP] Every pixel is yours. Every behavior is v0's. You've just built a complete, accessible settings panel using headless components that adapt to any design system.
