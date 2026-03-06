---
title: createModel - Value Store for Vue 3
meta:
- name: description
  content: Value store layer that extends createRegistry with a reactive Set of selected IDs, disabled guards, and an apply bridge for useProxyModel sync.
- name: keywords
  content: createModel, value store, model, composable, Vue 3, state management, disabled, reactive
features:
  category: Composable
  label: 'E: createModel'
  github: /composables/createModel/
  level: 2
related:
  - /composables/registration/create-registry
  - /composables/selection/create-selection
  - /components/providers/selection
---

# createModel

A composable that extends `createRegistry` with value storage — a reactive Set of selected IDs, disabled guards, and an `apply` bridge for syncing with `useProxyModel`.

<DocsPageFeatures :frontmatter />

## Usage

`createModel` is a value store layer — think of it as a creative way to store a single value, more like `defineModel` than `createSelection`. It adds value tracking and disabled guards on top of the registry's collection management.

Selection-specific concepts like `mandatory`, `multiple`, and `enroll` belong in `createSelection`.

```ts
import { createModel } from '@vuetify/v0'

const model = createModel()

model.register({ id: 'a', value: 'Apple' })
model.register({ id: 'b', value: 'Banana' })

model.select('a')

console.log(model.selectedIds) // Set(1) { 'a' }
console.log(model.selectedValues.value) // Set(1) { 'Apple' }
console.log(model.selected('a')) // true
```

## Architecture

`createModel` sits between `createRegistry` and the higher-level selection composables:

```mermaid "Model Hierarchy"
flowchart TD
  createRegistry --> createModel
  createModel --> createSelection
  createModel --> createSlider
  createSelection --> createSingle
  createSelection --> createGroup
  createSingle --> createStep
```

## Single-Value Semantics

`createModel` always operates in single-value mode. Calling `select` clears any previous selection before adding the new one:

```ts
const model = createModel()

model.register({ id: 'a', value: 'Apple' })
model.register({ id: 'b', value: 'Banana' })

model.select('a')
console.log(model.selectedIds) // Set(1) { 'a' }

model.select('b') // clears 'a', adds 'b'
console.log(model.selectedIds) // Set(1) { 'b' }
```

For multi-select, mandatory enforcement, and other selection patterns, use `createSelection`.

## Disabled Guards

Both the model instance and individual tickets support disabled state. Selection operations are silently skipped when disabled:

```ts
// Instance-level disabled
const model = createModel({ disabled: true })
model.register({ id: 'a', value: 'Apple' })
model.select('a') // no-op

// Ticket-level disabled
const model2 = createModel()
model2.register({ id: 'b', value: 'Banana', disabled: true })
model2.select('b') // no-op
```

## The Apply Bridge

`apply` syncs external values (from `useProxyModel`) into the model's `selectedIds`. It resolves the first value to an ID using the registry's `browse` method:

```ts
const model = createModel()

model.register({ id: 'a', value: 'Apple' })
model.register({ id: 'b', value: 'Banana' })

// Sync external value into the model
model.apply(['Apple'])

console.log(model.selectedIds) // Set(1) { 'a' }
```

## Reactivity

Value state is **always reactive**. Collection methods follow the base `createRegistry` pattern.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `selectedIds` | <AppSuccessIcon /> | `shallowReactive(Set)` — always reactive |
| `selectedItems` | <AppSuccessIcon /> | Computed from `selectedIds` |
| `selectedValues` | <AppSuccessIcon /> | Computed from `selectedItems` |
| ticket `isSelected` | <AppSuccessIcon /> | Computed from `selectedIds` |

> [!TIP] Value vs Collection
> Most UI patterns only need **value reactivity** (which is always on). You rarely need the collection itself to be reactive.

## Examples

::: example
/composables/create-model/model.ts
/composables/create-model/ColorProvider.vue
/composables/create-model/ColorConsumer.vue
/composables/create-model/colors.vue

### Color Palette Selector

This example demonstrates `createModel` as a single-value store. Each color is a registered ticket with a hex value. Purple is disabled and cannot be selected. Clicking a color selects it (replacing the previous selection).

**File breakdown:**

| File | Role |
|------|------|
| `model.ts` | Creates the model instance, registers color tickets, and exports the context tuple |
| `ColorProvider.vue` | Calls `createColorModel()` and provides the context, rendering only a slot |
| `ColorConsumer.vue` | Consumes the context via `useColors()` to render clickable swatches with reactive selected state |
| `colors.vue` | Entry point that composes Provider around Consumer |

**Key patterns:**

- Provider components are invisible wrappers that render only `<slot />`
- Consumers import only from `model.ts`, never from the Provider
- `toggle(id)` handles both select and unselect in one call
- Disabled tickets are visually dimmed and non-interactive

:::

<DocsApi />
