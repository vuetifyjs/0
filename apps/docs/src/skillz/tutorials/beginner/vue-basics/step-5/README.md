---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Show and hide

The contact card is getting crowded. Let's collapse it so it only shows the header by default, and expands to reveal details when clicked.

## Conditional rendering

[`v-if`](https://vuejs.org/guide/essentials/conditional.html) adds or **removes** elements from the DOM entirely. `v-else` provides the fallback:

```vue
<template>
  <div v-if="open">
    <!-- Full details -->
  </div>

  <p v-else>Click to expand</p>
</template>
```

When `open` is `false`, the details block doesn't exist in the DOM at all.

## v-show

There's also `v-show`, which toggles CSS `display` instead of adding/removing from the DOM. Use `v-show` when you toggle something frequently:

```vue
<template>
  <p v-show="email">{{ email }}</p>
</template>
```

The element is always in the DOM — it's just hidden with `display: none`.

> [!TRY] Try changing `v-if="open"` to `v-show="open"` and inspect the DOM in your browser's dev tools. You'll see the element is always present — just hidden. Then try clearing the email ref to an empty string and add `v-show="email"` to hide the empty email line.
