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
| **Checkbox** | Standalone or group checkbox with tri-state | Root, Group, SelectAll, Indicator, HiddenInput |
| **Dialog** | Modal overlay with focus trapping | Root, Activator, Content, Title, Description, Close |
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

## Props Inheritance

When extending `AtomProps`, don't re-declare inherited props (`as`, `renderless`):

```ts
// BAD - redundant declarations
export interface MyProps extends AtomProps {
  as?: AtomProps['as']      // Already inherited
  renderless?: boolean      // Already inherited
  myProp: string
}

// GOOD - only add new props
export interface MyProps extends AtomProps {
  myProp: string
}

// GOOD - use type alias if no new props
export type MyProps = AtomProps
```

Runtime defaults (e.g., `as = 'span'` instead of `'div'`) are set in `defineProps` destructuring, not the interface.

## Barrel Export Pattern

**NEVER use `export *` for Vue components** - breaks Volar slot type inference:

```ts
// BAD
export * from './SelectionRoot.vue'

// GOOD
export type { SelectionRootProps, SelectionRootSlotProps } from './SelectionRoot.vue'
export { default as SelectionRoot } from './SelectionRoot.vue'
```

## Z-Index and Layering

When implementing z-index or layering changes:

1. **Verify stacking context** by testing visually in browser
2. **Overlays must appear above content** they're meant to cover, not behind
3. **Check parent stacking contexts** — a high z-index inside a low context won't escape
4. **Document z-index values** used in component comments

**Common issues:**
- Scrim appearing over dialog content instead of behind
- Popovers clipped by overflow:hidden parents
- Multiple overlays fighting for top layer

**Verification checklist for overlay components:**
- [ ] Overlay covers intended content
- [ ] Scrim appears behind modal content
- [ ] Focus trap works correctly
- [ ] Escape key dismisses in correct order
- [ ] Nested overlays stack correctly
