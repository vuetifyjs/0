---
title: toReactive
---

# `toReactive`

The `toReactive` composable is a utility that converts a `ref` of an object, `Map`, or `Set` into a reactive object. This is particularly useful when you want to work with a reactive version of a `ref` that contains a complex object, without losing reactivity.

## Usage

The `toReactive` function takes a `ref` or a plain object and returns a reactive proxy.

### With a plain object

```typescript
import { ref } from 'vue'
import { toReactive } from 'v0'

const obj = ref({ a: 1, b: ref(2) })
const reactiveObj = toReactive(obj)

console.log(reactiveObj.a) // 1
console.log(reactiveObj.b) // 2

obj.value.a = 10
console.log(reactiveObj.a) // 10

reactiveObj.b = 20
console.log(obj.value.b) // 20
```

### With a Map

```typescript
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
