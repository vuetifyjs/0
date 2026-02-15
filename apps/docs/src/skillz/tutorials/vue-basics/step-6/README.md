---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# List rendering

`v-for` renders a list of items from an array. v0 composables like `createSelection` and `createStep` work with arrays of items, so you'll use this pattern often.

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </ul>
</template>
```

The `:key` binding gives Vue a **stable identity** for each element so it can efficiently update the DOM when the list changes. Always provide a unique key.

## Reactivity

Since `items` is reactive, pushing to or splicing from the array automatically updates the rendered list:

```js
items.value.push({ id: 3, text: 'New item' })
```

## Try it

Type in the input and click **Add** to add items. Try implementing a remove button on each item.
