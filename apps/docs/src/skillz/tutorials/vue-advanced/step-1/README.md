---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# Your first composable

A **composable** is a function that uses Vue's reactivity to encapsulate and reuse stateful logic. By convention, composable names start with `use`.

## The use* pattern

```ts
import { ref } from 'vue'

export function useCounter () {
  const count = ref(0)

  function increment () { count.value++ }
  function decrement () { count.value-- }
  function reset () { count.value = 0 }

  return { count, increment, decrement, reset }
}
```

Each call creates **independent state** — two components using `useCounter()` each get their own `count`. This is the foundation of composable architecture.

## Try it

The editor shows two independent counter instances side-by-side. Try adding a `max` option so the counter stops incrementing at a limit:

```ts
export function useCounter (max = Infinity) {
  // ...
  function increment () {
    if (count.value < max) count.value++
  }
}
```

> [!TIP] Every v0 composable follows this exact pattern — a function that returns reactive state and methods. `createSelection`, `createSingle`, `createStep` all work just like your `useCounter`.
