---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Deep Watchers

When watching **objects or arrays**, Vue needs to know whether to track nested changes. A deep watcher observes every property at every depth.

## Deep option

```vue
<script setup>
  import { ref, watch } from 'vue'

  const user = ref({ name: 'Alice', settings: { theme: 'dark' } })

  watch(user, (val) => {
    console.log('User changed:', val.settings.theme)
  }, { deep: true })
</script>
```

Without `{ deep: true }`, mutating `user.value.settings.theme` would **not** trigger the watcher.

## Cleanup with onCleanup

Watchers can set up side effects like timers. Use the `onCleanup` callback to tear them down before the next run:

```vue
<script setup>
  watch(source, (val, oldVal, onCleanup) => {
    const timer = setTimeout(() => {
      // do something after delay
    }, 3000)

    onCleanup(() => clearTimeout(timer))
  })
</script>
```

This prevents stale timers from piling up when the source changes rapidly.

## Try it

Notifications auto-dismiss after 3 seconds unless you mark them as read first. The deep watcher tracks read-status changes. Try clicking "Mark all read" before the timer expires.
