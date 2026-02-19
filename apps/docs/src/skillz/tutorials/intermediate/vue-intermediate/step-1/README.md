---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Watching for Changes

Vue's `watch()` function lets you run code **whenever reactive data changes**. It's perfect for side effects like updating a badge count, logging, or syncing with an external system.

## Basic watch

```vue
<script setup>
  import { ref, watch } from 'vue'

  const count = ref(0)

  watch(count, (newVal, oldVal) => {
    console.log(`Changed from ${oldVal} to ${newVal}`)
  })
</script>
```

The callback fires every time `count` changes.

## Immediate watch

By default, `watch` only fires on **changes**. Pass `{ immediate: true }` to also run the callback right away with the current value:

```vue
<script setup>
  watch(count, (val) => {
    document.title = `(${val}) Notifications`
  }, { immediate: true })
</script>
```

## watchEffect

`watchEffect` automatically tracks **every** reactive dependency used inside it — no need to specify a source:

```vue
<script setup>
  import { watchEffect } from 'vue'

  watchEffect(() => {
    console.log(`Count is now ${count.value}`)
  })
</script>
```

## Try it

The notification feed tracks an unread count. Try adding a notification and watch the badge update. Then add a `watchEffect` that logs the current unread count to the debug panel.
