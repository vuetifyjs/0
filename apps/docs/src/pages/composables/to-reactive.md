# toReactive

A utility that converts a `ref` of an object, `Map`, or `Set` into a reactive object, maintaining reactivity for complex objects.
import { ref } from 'vue'
import { toReactive } from 'v0'

const map = ref(new Map([['a', ref(1)]]))
const reactiveMap = toReactive(map)

console.log(reactiveMap.get('a')) // 1

reactiveMap.set('a', 2)
console.log(map.value.get('a').value) // 2
```

### With a Set

```typescript
import { ref } from 'vue'
import { toReactive } from 'v0'

const set = ref(new Set([ref(1)]))
const reactiveSet = toReactive(set)

console.log(reactiveSet.has(1)) // true
```

## API

### `toReactive(objectRef)`

- **`objectRef`**: `MaybeRef<T>` - A `ref` or a plain object, `Map`, or `Set`.

Returns a reactive proxy of the input.

## How it works

`toReactive` creates a proxy around the provided `ref`'s value. This proxy intercepts property access and mutations, ensuring that nested `ref`s are automatically unwrapped and that changes are propagated back to the original `ref`. For `Map` and `Set` collections, it provides proxy wrappers that maintain their standard functionality while handling reactivity.
