---
title: Types - TypeScript Utility Types for Vue 3
meta:
- name: description
  content: Public TypeScript types exported by Vuetify0. ID, Activation, DeepPartial, Extensible, MaybeArray, and more for type-safe headless UI development.
- name: keywords
  content: types, TypeScript, ID, Activation, DeepPartial, Extensible, MaybeArray, Vue 3
features:
  order: 5
  level: 2
related:
  - /guide/features/utilities
  - /composables
---

# Types

Shared TypeScript types used across the library and available for your own code.

<DocsPageFeatures :frontmatter />

```ts
import type { ID } from '@vuetify/v0'
import type { Activation, DeepPartial, Extensible, MaybeArray } from '@vuetify/v0/types'
```

## ID

Identifier type used throughout the registry system. All tickets, items, and registrable entities use this for their `id` property.

```ts
type ID = string | number
```

```ts
const id: ID = 'item-1'  // string
const id: ID = 42         // number
```

## Activation

Keyboard activation mode for navigable components.

```ts
type Activation = 'automatic' | 'manual'
```

- **automatic** — selection follows focus. Arrow keys select immediately. This is the WAI-ARIA standard for radio groups.
- **manual** — arrow keys move focus only. Enter or Space is required to select. Use for toolbars or when deliberate selection is preferred.

```vue
<template>
  <Radio.Group v-model="selected" activation="manual">
    <Radio.Root value="a">Option A</Radio.Root>
  </Radio.Group>
</template>
```

## DeepPartial

Recursively makes all properties of `T` optional. Used by `mergeDeep` to type partial source objects.

```ts
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T
```

```ts
type User = { name: string; address: { city: string } }
type PartialUser = DeepPartial<User>
// { name?: string; address?: { city?: string } }
```

## Extensible

Preserves string literal autocomplete while allowing arbitrary strings. TypeScript normally collapses `'a' | 'b' | string` into just `string`, losing IDE autocomplete. This type uses the `string & {}` trick to prevent that collapse.

```ts
type Extensible<T extends string> = T | (string & {})
```

Use for extensible APIs where you want autocomplete for known values but still accept custom strings — event names, theme tokens, CSS classes, etc.

```ts
type Color = 'red' | 'blue' | 'green'

// WITHOUT Extensible — autocomplete lost
type BadColor = Color | string  // collapses to just `string`

// WITH Extensible — autocomplete preserved
type GoodColor = Extensible<Color>

function setColor(c: GoodColor) {}
setColor('red')     // autocomplete suggests 'red' | 'blue' | 'green'
setColor('purple')  // also OK — custom value accepted
```

## MaybeArray

Union type that accepts either a single value or an array. Use for APIs that accept both forms.

```ts
type MaybeArray<T> = T | T[]
```

```ts
function process(input: MaybeArray<string>) { ... }
process('single')        // OK
process(['a', 'b', 'c']) // OK
```

## DOMElement

Valid element types for Vue's `h()` render function. Includes HTML tag names, component definitions, and functional components. Used by the `Atom` component for polymorphic rendering.

```ts
type DOMElement = Parameters<typeof h>[0]
```

## UnknownObject

Object with string keys and unknown values for generic record handling. Requires type narrowing at the use site, which catches more bugs at compile time than `Record<string, any>`.

```ts
type UnknownObject = Record<string, unknown>
```

## V0ErrorDetails

Discriminated union of structured details attached to every v0-thrown error. Each arm pairs a stable `code` with the domain context for that code — consumed by the `V0Error` constructor and narrowed by `isV0Error(err, code)` (both from `@vuetify/v0`, see [Utilities](/guide/features/utilities#errors)).

```ts
type V0ErrorDetails =
  | { code: 'V0_CONTEXT_MISSING', key: string | symbol }
  | { code: 'V0_PLUGIN_MISSING', plugin: string }
  | { code: 'V0_PALETTE_INVALID_SEED', palette: 'material' | 'leonardo' | 'ant', seed: string }
  | { code: 'V0_PALETTE_UNKNOWN_VARIANT', palette: 'material', variant: string }
  | { code: 'V0_ADAPTER_INSTANCE_MISSING', adapter: string }
  | { code: 'V0_THEME_INVALID_PREFIX', prefix: string }
```

## V0ErrorCode

Union of every error code thrown by v0. Convenience alias for the discriminant field of `V0ErrorDetails`.

```ts
type V0ErrorCode = V0ErrorDetails['code']
```

```ts
import { isV0Error, V0Error } from '@vuetify/v0'

try {
  throw new V0Error('Context not found.', { code: 'V0_CONTEXT_MISSING', key: 'v0:theme' })
} catch (err) {
  if (isV0Error(err, 'V0_CONTEXT_MISSING')) {
    console.log(err.key) // typed as string | symbol, not string | symbol | undefined
  }
}
```
