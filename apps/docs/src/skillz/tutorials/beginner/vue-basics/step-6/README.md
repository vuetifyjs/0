---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Rendering lists

The skills array is in our data, but we're only showing the top skill. Let's render them all as chips using [`v-for`](https://vuejs.org/guide/essentials/list.html).

## v-for

`v-for` iterates over an array and renders an element for each item. Always provide a unique `:key`:

```vue
<template>
  <span
    v-for="item in items"
    :key="item"
  >
    {{ item }}
  </span>
</template>
```

## Keys matter

Vue uses `:key` to track which items changed, were added, or removed. Without keys, Vue reuses elements in place — which causes subtle bugs with stateful content.

## Array reactivity

Vue tracks changes to ref arrays. Methods like `push`, `splice`, and `pop` trigger re-renders automatically:

```vue
<script setup lang="ts">
  function add () {
    skills.value.push('New Skill')
  }
</script>
```

> [!TRY] Add a remove button to each skill chip. You can use `skills.value.splice(index, 1)` to remove an item. Remember that `v-for` also provides the index: `v-for="(item, index) in items"`.
