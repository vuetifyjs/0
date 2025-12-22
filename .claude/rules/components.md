---
paths: packages/0/src/components/**
---

# Components Architecture

All components follow the **compound component pattern** in `packages/0/src/components/`.

## Pattern Overview

- **Compound**: Root + sub-components (e.g., `SelectionRoot`, `SelectionItem`)
- **Context-driven**: Root creates/provides, items consume
- **Generic v-model**: `<script setup generic="T">` for type-safe binding
- **ProxyModel**: `useProxyModel` bridges selection ↔ v-model
- **Devtools**: Include `defineEmits` alongside `defineModel`

```vue
<SelectionRoot v-model="selected" multiple>
  <SelectionItem value="a">Option A</SelectionItem>
  <SelectionItem value="b">Option B</SelectionItem>
</SelectionRoot>
```

## Component List

| Component | Description | Sub-components |
|-----------|-------------|----------------|
| **Atom** | Polymorphic foundation. `as` prop for element type. | — |
| **Avatar** | Image with fallback | Root, Image, Fallback |
| **ExpansionPanel** | Accordion/collapsible | Root, Item, Header, Activator, Content |
| **Group** | Multi-selection + tri-state | Root, Item |
| **Pagination** | Page navigation with ellipsis | Root, Item, First, Prev, Next, Last, Ellipsis, Status |
| **Popover** | Toggle/visibility | Root, Anchor, Content |
| **Selection** | Generic single/multi via `multiple` prop | Root, Item |
| **Single** | Single-selection specialization | Root, Item |
| **Step** | Stepper navigation | Root, Item |

## Context Provision Pattern

```ts
// In Root component
const [, provideSelectionControl, context] = createSelectionContext({
  mandatory,
  multiple: false,
  enroll
})
provideSelectionControl(context)

// Connect to v-model
useProxyModel(context, model, { multiple })
```

## Guidelines

- **Headless first**: Logic/accessibility, not styling
- **Slot-driven**: Comprehensive slot APIs
- **Single-layer**: No internal component composition
- **CSS variables**: `--v0-*` prefix only
- **No global state**: Local or context-based only

## Barrel Export Pattern

**NEVER use `export *` for Vue components** - breaks Volar slot type inference:

```ts
// BAD
export * from './SelectionRoot.vue'

// GOOD
export type { SelectionRootProps, SelectionRootSlotProps } from './SelectionRoot.vue'
export { default as SelectionRoot } from './SelectionRoot.vue'
```
