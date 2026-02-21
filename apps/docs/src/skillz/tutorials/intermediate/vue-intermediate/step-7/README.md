---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# Slots for Flexibility

Props pass **data** to a child. Slots pass **template content**. This lets the parent control what renders inside a child component while the child controls the layout.

## Default slot

```vue
<!-- NotificationCard.vue -->
<template>
  <div class="card">
    <slot>No content provided</slot>
  </div>
</template>
```

The text inside `<slot>` is **fallback content** — it renders when the parent doesn't provide anything.

## Named slots

Components can have multiple slots. Use `name` to distinguish them:

```vue
<!-- NotificationCard.vue -->
<template>
  <div class="card">
    <slot />
    <div class="actions">
      <slot name="actions">
        <button>Default action</button>
      </slot>
    </div>
  </div>
</template>
```

The parent targets named slots with `#slotName`:

```vue
<template>
  <NotificationCard>
    <p>Notification text</p>

    <template #actions>
      <button>Custom action</button>
    </template>
  </NotificationCard>
</template>
```

## Try it

`NotificationCard` wraps each notification with a card layout and an `#actions` slot. Try adding a `#header` slot with a fallback that shows the notification type.

> [!TIP] Slots are v0's primary rendering API. Every headless component exposes slot props that let you control the visual output while v0 handles the behavior.
