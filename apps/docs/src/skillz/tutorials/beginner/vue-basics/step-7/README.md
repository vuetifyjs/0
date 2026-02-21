---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Two-way binding

The card displays data, but there's no way to edit it. Vue's [`v-model`](https://vuejs.org/guide/essentials/forms.html) directive creates a **two-way binding** between form inputs and reactive state.

## v-model

`v-model` is syntactic sugar for binding `:value` and listening for `@input` events:

```vue
<template>
  <input v-model="name">
  <p>{{ name }}</p>
</template>
```

Type in the input, and the displayed name updates instantly — including the computed initials in the avatar.

## Modifiers

- **`.trim`** — automatically trims whitespace
- **`.number`** — casts the value to a number
- **`.lazy`** — syncs on `change` instead of `input`

```vue
<template>
  <input v-model.trim="name">
</template>
```

## Select elements

`v-model` works on `<select>` too. The bound ref updates to match the selected `<option>` value:

```vue
<template>
  <select v-model="status">
    <option value="available">Available</option>
    <option value="busy">Busy</option>
  </select>
</template>
```

> [!TRY] Add `.trim` to the name and role inputs. Add a bio `<textarea>` with `v-model` in the edit form.

## What's next

You've built a fully interactive contact card using Vue's core features — refs, events, computed properties, conditionals, lists, and two-way binding. These are the same building blocks that power every v0 composable.

> [!TIP] v0's `useProxyModel` extends this exact `v-model` concept, making it work seamlessly between parent and child components.
