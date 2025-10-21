---
meta:
  title: toArray
  description: A utility function that converts any value to an array, handling null/undefined values and ensuring consistent array output.
  keywords: toArray, transformer, utility, array conversion
features:
  category: Transformer
  label: 'E: toArray'
  github: /composables/toArray/
---

# toArray

The `toArray` utility function provides a consistent way to convert any value into an array format. It handles edge cases like `null` and `undefined` values, and ensures that the output is always an array.

<DocsPageFeatures :frontmatter />

## Usage

```ts
import { toArray } from '@vuetify/v0'

const value = 'Example Value'
const valueAsArray = toArray(value)

console.log(valueAsArray) // ['Example Value']
```

## API


| Composable | Description |
|---|---|
| [toReactive](/composables/transformers/to-reactive) | Convert MaybeRef to reactive |
| [useEventListener](/composables/system/use-event-listener) | Accepts single or array of events |
### `toArray`

- **Type**

  ```ts
  function toArray<Z> (value: Z | Z[]): Z[]
  ```

- **Details**

  Converts a value to an array. If the value is `null` or `undefined`, returns an empty array. If the value is already an array, returns it as-is. Otherwise, wraps the value in an array.

- **Example**
  ```ts
  toArray('hello') // ['hello']
  toArray([1, 2, 3]) // [1, 2, 3]
  toArray(null) // []
  toArray(undefined) // []
  ```
