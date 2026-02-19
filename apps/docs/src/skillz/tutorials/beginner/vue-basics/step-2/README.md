---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Making it dynamic

In step 1, the card was static — values were hardcoded in the HTML. Now we'll make the card **reactive** using Vue's [shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref).

## Refs

A `shallowRef` wraps a value so Vue can **track changes** and update the template automatically:

```vue
<script setup lang="ts">
  import { shallowRef } from 'vue'

  const name = shallowRef('Alex Chen')
</script>
```

In the template, use double curly braces to display a ref's value. Vue automatically unwraps it — you write `{{ name }}`, not `{{ name.value }}`:

```vue
<template>
  <p>{{ name }}</p>
</template>
```

In JavaScript however, you access the value with `.value` — this distinction comes up constantly when working with v0.

## Why shallowRef?

Vue also has `ref()`, which deeply tracks nested objects. For simple values like strings, numbers, and booleans, `shallowRef` is more efficient — it only triggers updates when `.value` is replaced, not when properties inside it change. Since primitives are always replaced, there's no downside.

As your app grows, defaulting to `shallowRef` for primitives avoids unnecessary deep reactivity tracking and keeps things fast.

> [!TRY] Add a `city` ref (e.g., `shallowRef('San Francisco')`) and display it below the email. You'll need to add both the ref in `<script setup>` and a `{{ city }}` expression in the template.
