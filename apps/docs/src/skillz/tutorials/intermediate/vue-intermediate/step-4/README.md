---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Lifecycle Hooks

Vue components go through a lifecycle: creation, mounting, updating, and unmounting. **Lifecycle hooks** let you run code at specific stages.

## onMounted

Runs after the component's DOM is ready. Perfect for fetching data or setting up timers:

```vue
<script setup>
  import { ref, onMounted } from 'vue'

  const data = ref(null)

  onMounted(async () => {
    data.value = await fetchData()
  })
</script>
```

## onUnmounted

Runs when the component is removed from the DOM. Use it to clean up timers, listeners, or subscriptions:

```vue
<script setup>
  import { onMounted, onUnmounted } from 'vue'

  let interval

  onMounted(() => {
    interval = setInterval(() => {
      // update "time ago" display
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })
</script>
```

Always clean up what you create — leaked timers cause memory issues and unexpected behavior.

## Try it

Notifications load after a brief delay to simulate a network request, showing a loading skeleton. Each notification displays a "time ago" label that updates every second. Try adding an `onBeforeUnmount` log to the debug panel.
