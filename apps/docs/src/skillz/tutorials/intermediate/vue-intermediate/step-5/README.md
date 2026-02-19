---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# Child Components

As your UI grows, you'll want to break it into **smaller, reusable pieces**. Vue components accept data from their parent through **props** — declared with `defineProps`.

## defineProps

```vue
<script setup>
  const props = defineProps({
    title: String,
    urgent: Boolean,
  })
</script>

<template>
  <div :class="{ 'font-bold': urgent }">
    {{ title }}
  </div>
</template>
```

The parent passes props as attributes:

```vue
<template>
  <NotificationItem title="Build failed" urgent />
</template>
```

## Prop types

Vue validates props at runtime. Common types: `String`, `Number`, `Boolean`, `Array`, `Object`. You can also set defaults and mark props as required:

```vue
<script setup>
  defineProps({
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
  })
</script>
```

## Try it

The notification list is now split into `App.vue` and `NotificationItem.vue`. Check both files in the editor. Try adding a `type` prop to `NotificationItem` that changes the accent color based on the notification type (info, success, warning, error).

> [!TIP] v0 components use props just like this. When you write `<Tabs.Item value="home">`, you're passing a prop to a headless component.
