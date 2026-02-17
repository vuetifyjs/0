---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Responding to clicks

A contact card isn't useful if you can't interact with it. Vue handles DOM events with the [`@` shorthand](https://vuejs.org/guide/essentials/event-handling.html) (short for `v-on:`).

## Event handling

Use `@click` to call a function when an element is clicked:

```vue
<template>
  <button @click="toggle">Follow</button>
</template>
```

The handler is a regular function declaration in `<script setup>`:

```vue
<script setup lang="ts">
  function toggle () {
    active.value = !active.value
  }
</script>
```

## Dynamic classes

Use [`:class`](https://vuejs.org/guide/essentials/class-and-style.html) (short for `v-bind:class`) to apply classes conditionally:

```vue
<template>
  <button
    :class="active ? 'bg-surface-tint' : 'bg-primary'"
    @click="toggle"
  >
    {{ active ? 'Following' : 'Follow' }}
  </button>
</template>
```

> [!TRY] Add a `count` ref that tracks how many times the button has been toggled. Increment it inside `toggle` and display it somewhere on the card.
