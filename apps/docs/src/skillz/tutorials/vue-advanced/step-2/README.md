---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# shallowRef vs ref

`ref` tracks changes **deeply** — if you have a ref holding an array, Vue watches every element inside it. `shallowRef` only tracks when the `.value` itself is **replaced**, not when its contents mutate.

## Why shallowRef?

For large collections, deep tracking is expensive. With `shallowRef`, you signal changes by replacing the entire value:

```ts
import { shallowRef } from 'vue'

const items = shallowRef([])

// This does NOT trigger reactivity:
items.value.push('new')

// This DOES — replace the whole array:
items.value = [...items.value, 'new']
```

## triggerRef

If you mutate a `shallowRef` in place, you can manually notify Vue:

```ts
import { shallowRef, triggerRef } from 'vue'

items.value.push('new')
triggerRef(items)
```

## Try it

The editor shows a `useList` composable built with `shallowRef`. A render counter shows how many times the component re-renders. Try swapping `shallowRef` for `ref` in `useList.ts` and observe the difference.

> [!TIP] v0 uses `shallowRef` by default for performance. When you see v0 composable source code, you'll find shallowRef everywhere instead of ref.
