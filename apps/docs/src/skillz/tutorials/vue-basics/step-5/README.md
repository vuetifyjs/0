---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Conditional rendering

Vue provides directives to **conditionally render** elements. You'll see `v-if` throughout v0 examples to show and hide UI based on composable state.

## v-if / v-else

```vue
<template>
  <p v-if="loggedIn">Welcome back!</p>
  <p v-else>Please log in.</p>
</template>
```

`v-if` completely **adds or removes** the element from the DOM.

## v-show

```vue
<template>
  <p v-show="visible">I'm toggled with CSS</p>
</template>
```

`v-show` always renders the element but toggles `display: none`. Use it when something toggles frequently.

## Rule of thumb

- **`v-if`** — for conditions that rarely change (cheaper initial render)
- **`v-show`** — for things that toggle often (cheaper subsequent toggles)

## Try it

Click the toggle button to switch states. Try changing `v-if` to `v-show` and inspect the DOM to see the difference.
