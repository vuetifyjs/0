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
import type { ID, Activation, DeepPartial, Extensible, MaybeArray } from '@vuetify/v0'
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

## GenericObject / UnknownObject

Two record types for different safety levels:

```ts
type GenericObject = Record<string, any>
type UnknownObject = Record<string, unknown>
```

Prefer `UnknownObject` — it requires type narrowing and catches more bugs at compile time.
