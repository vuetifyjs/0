---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Form inputs

Vue's `v-model` directive creates **two-way bindings** between form inputs and reactive state. v0's `useProxyModel` builds on this same concept for component props.

```vue
<template>
  <input v-model="message">
  <p>You typed: {{ message }}</p>
</template>
```

`v-model` works on `<input>`, `<textarea>`, `<select>`, and custom components. It's syntactic sugar for binding `:value` and listening for `@input` events.

## Modifiers

- **`.trim`** — automatically trims whitespace
- **`.number`** — casts the value to a number
- **`.lazy`** — syncs on `change` instead of `input`

```vue
<template>
  <input v-model.trim="name">
  <input v-model.number="age" type="number">
</template>
```

## Try it

Try typing, selecting, and toggling — watch how all the values stay in sync in the summary below.

## What's next

Now that you're familiar with Vue's fundamentals, you're ready to explore v0's composables. These building blocks use the same refs, computed properties, and template directives you just practiced — but handle the complex state management for you.
