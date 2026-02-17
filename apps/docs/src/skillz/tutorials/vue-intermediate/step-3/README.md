---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Grabbing DOM Elements

Sometimes you need direct access to a DOM element — for scrolling, measuring, or focusing. Vue's `useTemplateRef()` gives you a reactive reference to an element in your template.

## useTemplateRef

```vue
<script setup>
  import { useTemplateRef } from 'vue'

  const listEl = useTemplateRef('list')

  function scrollToBottom () {
    listEl.value.scrollTop = listEl.value.scrollHeight
  }
</script>

<template>
  <div ref="list" style="overflow: auto; max-height: 200px">
    <!-- items -->
  </div>
</template>
```

The string you pass to `useTemplateRef()` must match the `ref` attribute in the template.

## Timing

Template refs are `null` until the component mounts. Always check before accessing:

```vue
<script setup>
  import { watch } from 'vue'

  watch(listEl, (el) => {
    if (el) el.focus()
  })
</script>
```

## Try it

New notifications auto-scroll the list to the bottom. Try adding several notifications and then use the "Scroll to top" button to jump back up.
