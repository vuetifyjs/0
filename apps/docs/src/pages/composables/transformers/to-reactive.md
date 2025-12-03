---
title: toReactive Transformer
meta:
- name: description
  content: A utility function that converts MaybeRef objects to reactive proxies,
    providing seamless access to ref values without .value syntax.
- name: keywords
  content: toReactive, transformer, reactive, ref, composable, Vue
features:
  category: Transformer
  label: 'E: toReactive'
  github: /composables/toReactive/
---

# toReactive

The `toReactive` utility function converts a `MaybeRef` object to a reactive proxy, automatically unwrapping ref values. It provides special handling for `Map`, `Set`, and regular objects.

<DocsPageFeatures :frontmatter />

## Usage

```ts
import { ref } from 'vue'
import { toReactive } from '@vuetify/v0'

const state = ref({ name: 'John', age: 30 })
const rstate = toReactive(state)

console.log(rstate.name) // 'John' (no .value needed)
```

## API


| Composable | Description |
|---|---|
| [toArray](/composables/transformers/to-array) | Convert value to array |
| [useProxyModel](/composables/forms/use-proxy-model) | Two-way binding with transformation |
### `toReactive`

- **Type**

  ```ts
  function toReactive<Z extends object> (
    objectRef: MaybeRef<Z>
  ): UnwrapNestedRefs<Z>
  ```

- **Details**

  Converts a `MaybeRef` to a reactive proxy that automatically unwraps ref values. Provides special handling for:
  - **Map**: Unwraps ref values when accessing via `get()`, and updates existing refs when using `set()`
  - **Set**: Unwraps ref values during iteration
  - **Objects/Arrays**: Unwraps nested refs automatically

  **Z** represents the type of the object being converted.
