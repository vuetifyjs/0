---
title: toElement - Resolve Element References for Vue 3
meta:
- name: description
  content: Resolve refs, getters, raw DOM elements, or Vue component instances to a plain DOM Element. Handles cross-version Vue Ref compatibility with structural typing.
- name: keywords
  content: toElement, transformer, element ref, DOM, component instance, resolve, TypeScript, Vue 3
features:
  category: Transformer
  label: 'E: toElement'
  github: /composables/toElement/
  level: 2
related:
  - /composables/transformers/to-array
  - /composables/transformers/to-reactive
---

# toElement

Resolves various element reference types to a plain DOM Element. Accepts refs, getters, raw DOM elements, or Vue component instances and normalizes them to a single `Element | undefined`.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse no-filename
import { toElement } from '@vuetify/v0'
import { useTemplateRef } from 'vue'

const el = useTemplateRef<HTMLDivElement>('target')

const element = toElement(el) // HTMLDivElement | undefined
```

## Architecture

`toElement` resolves multiple input shapes to a DOM element:

```mermaid "Element Resolution"
flowchart LR
  input[MaybeElementRef] --> type{input type?}
  type -- function --> call["call()"]
  type -- "{ value }" --> unwrap[".value"]
  type -- Element --> pass[pass-through]
  type -- "null/undefined" --> undef[undefined]
  call --> resolve{is Element?}
  unwrap --> resolve
  pass --> resolve
  resolve -- yes --> output[Element]
  resolve -- "$el" --> extract[".$el"]
  resolve -- no --> undef
  extract --> output
```

## Reactivity

`toElement` is a **pure transformer function**. It does not track reactivity or return reactive values.

> [!TIP] Use inside computed for reactivity
> Wrap in `computed()` if you need reactive element resolution:
```ts
const resolved = computed(() => toElement(targetRef))
```

## Supported Input Types

| Input | Result |
| - | - |
| `Ref<HTMLElement>` | Unwrapped element |
| `ShallowRef<Element>` | Unwrapped element |
| `() => HTMLElement` | Called, returns element |
| `HTMLElement` / `SVGElement` | Pass-through |
| `ComponentPublicInstance` | Extracts `$el` |
| `null` / `undefined` | Returns `undefined` |

> [!TIP] Structural typing
> Uses `{ readonly value: T }` instead of Vue's nominal `Ref<T>` to avoid type mismatches across Vue versions.

<DocsApi />
