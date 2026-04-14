---
paths: packages/0/src/components/**
---

# Components Architecture

All components follow the **compound component pattern** in `packages/0/src/components/`.

## Directory Structure (92% compound)

```
ComponentName/
├── ComponentNameRoot.vue      # Required: creates context, provides to children
├── ComponentNameItem.vue      # Sub-component consuming context
├── ComponentNameActivator.vue # Sub-component (optional)
├── ComponentNameContent.vue   # Sub-component (optional)
├── index.ts                   # Barrel exports (required)
├── index.test.ts              # Tests (required)
└── types.ts                   # Shared types (only if needed across sub-components)
```

**Exceptions**: Form, Portal, Presence, Scrim are single-file components (no sub-components).

## Script Structure (92% dual-script)

**Standard**: Dual-script with imports/types in regular script, logic in setup:

```vue
<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables'

  // Utilities
  import { useId } from '#v0/utilities'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComponentRootProps extends AtomProps {
    namespace?: string
    disabled?: boolean
  }

  export interface ComponentRootSlotProps {
    isDisabled: boolean
    attrs: {
      'role': string
      'aria-disabled': true | undefined
      'data-disabled': true | undefined
    }
  }

  export const [useComponentRoot, provideComponentRoot] = createContext<ComponentContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComponentRoot' })

  const {
    as = 'div',
    namespace = 'v0:component',
    disabled = false,
  } = defineProps<ComponentRootProps>()

  // ... composition logic
</script>

<template>
  <Atom :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**With generics**: `<script lang="ts" setup generic="T = unknown">`

### Rules
- `defineOptions({ name: '...' })` — **always required** (100%)
- **ALL imports go in `<script lang="ts">`, NEVER in `<script setup>`** — this includes Vue imports (`ref`, `toRef`, `watch`, etc.), composable imports, and utility imports. `<script setup>` must contain zero import statements.
- Props interface and slot props interface exported from regular script
- Context `[useX, provideX]` exported from regular script
- Cleanup: use `onBeforeUnmount` for unregistration, not `onUnmounted`

## Context Provision Pattern

```ts
// Root creates and provides
export const [useComponentRoot, provideComponentRoot] = createContext<Type>()

// Sub-components consume
const context = useComponentRoot(namespace)
```

**Naming convention**: Use `useComponentRoot` / `provideComponentRoot` for Root-level context.

**Dual context**: Button, Radio, Toggle provide both Root and Group contexts (for standalone vs grouped usage).

## Props Pattern (100% enforced)

```ts
export interface ComponentRootProps extends AtomProps {
  namespace?: string    // Always present on Root + sub-components
  disabled?: boolean    // Always present on interactive Root
  id?: string           // Auto-generated via useId() if not provided
}

// Defaults in destructuring, never in interface
const {
  as = 'div',
  namespace = 'v0:component',
  disabled = false,
} = defineProps<ComponentRootProps>()
```

**Never** re-declare inherited AtomProps (`as`, `renderless`).

## Slot Props Pattern (100% enforced)

```ts
export interface ComponentRootSlotProps {
  // Boolean state: always `is<State>`
  isDisabled: boolean
  isSelected: boolean
  isOpen: boolean

  // Attrs object: ARIA + data + handlers
  attrs: {
    'role': string
    'aria-disabled': true | undefined
    'aria-selected': boolean
    'data-disabled': true | undefined
    'data-state': 'checked' | 'unchecked' | undefined
    'onClick': () => void
    'onKeydown': (e: KeyboardEvent) => void
  }
}

// Always computed via toRef
const slotProps = toRef((): ComponentRootSlotProps => ({
  isDisabled: isDisabled.value,
  attrs: { ... },
}))
```

**Template**: Always `<slot v-bind="slotProps" />`

## Data Attribute Pattern (100% enforced)

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-state` | Visual state for CSS | Semantic strings: `checked`, `unchecked`, `indeterminate`, `open`, `closed`, `valid`, `invalid`, `dragging`, `idle` |
| `data-disabled` | Disabled styling | `true \| undefined` |
| `data-selected` | Selected styling | `true \| undefined` |
| `data-open` | Open/expanded | `true \| undefined` |
| `data-orientation` | Layout direction | `'horizontal' \| 'vertical'` |

**Rule**: Always `true | undefined` (not `true | false`). Undefined removes the attribute from DOM.

## ARIA Pattern (100% WAI-ARIA compliant)

Every interactive component must have:
1. Correct `role` attribute
2. Relevant `aria-*` state attributes
3. `aria-disabled` when disabled — always include as `boolean`, not `true | undefined`
4. Keyboard event handlers
5. All user-facing strings (`aria-label`, etc.) must use `useLocale()` and `locale.t()` — never hardcode English. Tests assert `toBeDefined()` for locale strings, not exact values.

## Disabled Pattern (100% enforced)

All interactive components implement three-pronged approach:
1. `aria-disabled` — assistive technology
2. `data-disabled` — CSS styling target
3. `tabindex` management — prevent focus when appropriate

## Hidden Input Pattern

Components with `name` prop render `<ComponentHiddenInput>`:
- Always `inert` and `tabindex="-1"`
- Synced with parent state
- JSON serialization for complex values
- Used by: Checkbox, Switch, Radio, Button, Progress, Slider, Rating

## Focus Management (3 strategies)

| Strategy | When | Components |
|----------|------|-----------|
| Static tabindex | Single focusable element | Most components |
| Roving tabindex (`useRovingFocus`) | Group keyboard navigation | Radio, Tabs, Treeview, Splitter |
| Virtual focus (`useVirtualFocus`) | Large lists, aria-activedescendant | Combobox, Select |

## Keyboard Navigation Pattern (100% enforced)

```ts
function onKeydown(e: KeyboardEvent) {
  if (isDisabled.value) return       // Always check first
  if (e.key === 'Enter') {
    e.preventDefault()                // Always prevent default
    action()                          // Then perform action
  }
}
```

## Model Bridging Pattern

```ts
// In Root component
const model = defineModel<T | T[]>()
const [, , context] = createFooContext(options)
useProxyModel(context, model, { multiple })
```

`defineEmits('update:model-value')` is redundant alongside `defineModel`, but **include it anyway** — vue-devtools requires the explicit emit declaration for event tracking.

## Barrel Export Pattern (100% enforced)

**NEVER** `export *` from Vue files — breaks Volar slot type inference.

```ts
// Named exports for tree-shaking
export type { ComponentRootProps, ComponentRootSlotProps } from './ComponentRoot.vue'
export { default as ComponentRoot } from './ComponentRoot.vue'
export { useComponentRoot, provideComponentRoot } from './ComponentRoot.vue'

// Object compound export for dot notation
import ComponentRoot from './ComponentRoot.vue'
import ComponentItem from './ComponentItem.vue'
export const Component = { Root: ComponentRoot, Item: ComponentItem }
```

## Template Pattern (100% enforced)

- Root element is always `<Atom :as :renderless>`
- Slot props via `<slot v-bind="slotProps" />`
- Hidden inputs conditionally rendered: `<ComponentHiddenInput v-if="name" />`
- `v-if` for structural conditionals, never `v-show` (except Combobox filtered items)

## Slot Attrs Double-Fire Hazard

Slot `attrs` objects include `onClick` and other event handlers. These are already bound to the outer `<Atom>` wrapper via `mergeProps`. Consumers must **only** spread slot `attrs` onto their own element when using `renderless` mode. In non-renderless mode (default), spreading `attrs` onto a child element causes handlers to fire twice — once on the child, then again on the Atom wrapper via event bubbling. When writing examples for new components, never `v-bind="attrs"` on children inside a non-renderless component.
