---
title: toReactive - Unwrap Refs to Reactive Proxies
meta:
- name: description
  content: Convert MaybeRef objects to reactive proxies in Vue 3. Automatically unwraps refs for objects, Maps, and Sets while eliminating .value syntax for cleaner code.
- name: keywords
  content: toReactive, transformer, reactive, ref, proxy, unwrap, Vue 3, MaybeRef
features:
  category: Transformer
  label: 'E: toReactive'
  github: /composables/toReactive/
  level: 2
related:
  - /composables/transformers/to-array
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

## Architecture

`toReactive` creates a Proxy that unwraps ref values:

```mermaid "Reactive Proxy Flow"
flowchart LR
  MaybeRef --> Proxy
  Proxy -- get --> toValue
  Proxy -- set --> ref.value
  toValue --> unwrapped[plain value]
```

## Reactivity

`toReactive` converts a `MaybeRef` into a **fully reactive proxy** with automatic ref unwrapping. This is the primary way to eliminate `.value` syntax.

| Behavior | Reactive | Notes |
| - | :-: | - |
| Object access | <AppSuccessIcon /> | Properties are reactive, refs auto-unwrapped |
| Map operations | <AppSuccessIcon /> | `get`/`set`/`entries` unwrap ref values |
| Set operations | <AppSuccessIcon /> | Iteration unwraps ref values |
| Array access | <AppSuccessIcon /> | Index access unwraps nested refs |

> [!TIP] When to use
> Use `toReactive` when you want to:
- Eliminate `.value` in templates
- Pass reactive state to non-Vue code expecting plain objects
- Create reactive proxies over ref-wrapped collections

<DocsApi />
