---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# Scoped slots

Scoped slots let a child component **pass data back to the parent's template**. The child controls the logic; the parent controls the rendering.

## Slot props

```vue
<!-- Child: SelectableList.vue -->
<template>
  <li v-for="item in items" :key="item.id">
    <slot :item="item" :is-selected="isSelected(item)" :select="() => select(item)" />
  </li>
</template>
```

```vue
<!-- Parent: App.vue -->
<SelectableList :items="users" v-model="selected">
  <template #default="{ item, isSelected, select }">
    <button @click="select" :class="{ active: isSelected }">
      {{ item.name }}
    </button>
  </template>
</SelectableList>
```

The parent receives `item`, `isSelected`, and `select` as slot props — full control over how each item looks, while the component manages selection state.

## The headless pattern

This is the **headless component** pattern: provide behavior through slot props, leave rendering to the consumer. Two different parents can render the same data completely differently.

## Try it

The editor shows `SelectableList` exposing scoped slots. The App renders two different presentations from the same component. Try adding an `#empty` slot that receives `{ query }` as a prop.

> [!TIP] This IS the headless component pattern. v0's components like `Selection.Root` and `Tabs.Panel` expose slot props that give you full control over rendering.
