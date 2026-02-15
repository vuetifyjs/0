---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Event handling

Vue uses `@` (shorthand for `v-on`) to listen for DOM events. This is how you'll wire up user interactions to v0 state changes.

```vue
<template>
  <button @click="count++">
    Clicked {{ count }} times
  </button>
</template>
```

You can use inline expressions or call a function:

```vue
<script setup>
  import { ref } from 'vue'

  const count = ref(0)

  function increment() {
    count.value++
  }
</script>
```

Notice that inside `<script setup>`, you access the ref with `.value`. Vue only auto-unwraps refs in templates.

## Try it

Click the button in the preview. Then try adding a **Reset** button that sets `count.value = 0`.
