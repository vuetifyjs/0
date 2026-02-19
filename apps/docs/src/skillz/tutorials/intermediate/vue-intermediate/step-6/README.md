---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# Emitting Events

Props flow **down** from parent to child. Events flow **up** from child to parent. Use `defineEmits` to declare the events your component can emit.

## defineEmits

```vue
<script setup>
  const emit = defineEmits(['dismiss', 'mark-read'])

  function handleDismiss () {
    emit('dismiss')
  }
</script>
```

The parent listens with `@`:

```vue
<template>
  <NotificationItem
    @dismiss="removeNotification(n.id)"
    @mark-read="markAsRead(n.id)"
  />
</template>
```

## Payload

You can pass data with the event:

```vue
<script setup>
  const emit = defineEmits(['dismiss'])

  emit('dismiss', { id: 42, reason: 'user action' })
</script>
```

## Try it

Each notification now has "Dismiss" and "Mark read" buttons. The child emits events, and the parent handles the state changes. Try adding a `@pin` emit that toggles a pinned state on the notification.
