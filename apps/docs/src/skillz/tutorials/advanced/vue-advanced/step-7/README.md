---
hideFiles: false
hideTabs: false
hideBreadcrumbs: false
---
# Putting it together

Time to compose everything into a real feature: a **searchable, selectable, filterable list**. This combines composables (`useList`, `useFilter`) with a headless component (`SelectableList`) and scoped slots.

## Composing composables

Composables shine when combined. Each handles one concern:

```ts
const { items, add, remove } = useList(initialData)
const { filtered, query } = useFilter(items, ['name', 'role'])
```

Feed `filtered` into `SelectableList` and you have a fully interactive, searchable, selectable list — with each piece independently testable and reusable.

## The architecture

```
useList          → manages the raw collection
useFilter        → filters items by search query
SelectableList   → handles selection + renders via slots
App.vue          → composes everything together
```

## Try it

The editor shows the full composition. Try adding keyboard navigation — use `ArrowUp`/`ArrowDown` to move through filtered items, and `Enter` to select.

## What's next

You've built composables, used generics, scoped slots, and composed them into a real feature. These are the exact patterns v0 uses internally. Head to the **v0 Basics** tutorial to see how v0's built-in composables handle all of this for you.
