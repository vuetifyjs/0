---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# Generics in components

Vue supports **TypeScript generics** in `<script setup>` via the `generic` attribute. This lets you build components that preserve type safety for any data shape.

## Generic script tag

```vue
<script lang="ts" setup generic="T">
  defineProps<{
    items: T[]
    selected?: T
  }>()
</script>
```

When a parent passes `items` as `User[]`, TypeScript infers `T = User` — the `selected` prop is automatically typed as `User | undefined`.

## Why generics?

Without generics, you'd type items as `unknown[]` and lose autocomplete. Generics let the component **adapt to the caller's data type** while keeping full type safety.

## Try it

The editor shows a generic `SelectableList` component. It receives typed items and emits a typed `select` event. Try using it with `{ id: number, name: string }` objects — notice how TypeScript infers the types correctly.
