---
title: toArray - Normalize Values to Array for Vue 3
meta:
- name: description
  content: Convert any value to an array in TypeScript/Vue. Handles null/undefined gracefully, preserves existing arrays, and ensures type-safe consistent output for Vue 3.
- name: keywords
  content: toArray, transformer, utility, array conversion, normalize, TypeScript, Vue 3
features:
  category: Transformer
  label: 'E: toArray'
  github: /composables/toArray/
related:
  - /composables/transformers/to-reactive
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

## Architecture

`toArray` is a pure transformation utility:

```mermaid
flowchart LR
  input[any value] --> check{is array?}
  check -- yes --> output[return as-is]
  check -- no --> wrap[wrap in array]
  wrap --> output
```

<DocsApi />
