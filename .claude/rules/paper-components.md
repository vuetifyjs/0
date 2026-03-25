---
paths: packages/emerald/**
---

# Paper Design System Components

Rules for building components in Paper design systems (Emerald, Onyx, etc.).

## Architecture

```
Emerald / Onyx / etc. (styled design system — scoped to its own spec)
    ↓
Paper (styling primitives — V0Paper, useColor, useTheme, useContrast, etc.)
    ↓
v0 (headless logic & accessibility — zero styling)
```

Each design system is a **complete framework for a single design language**, not a theme. It only ships styles and functionality defined in its own spec. No universal framework sprawl.

## Contract

### Must

- **Root components use `V0Paper`** as their base element — unless the component doesn't need Paper's styling surface (e.g., layout primitives like EmDivider), in which case `Atom` directly is fine.
- **Sub-components use `V0Paper` selectively** — only when the design spec requires independent styling control (own color, spacing, elevation). Otherwise, use raw v0 primitives or plain elements styled via parent's CSS scope.
- **Only wrap v0 sub-components the DS customizes.** Unwrapped v0 sub-components are imported directly by the consumer. Adding a wrapper later is additive, not breaking.
- **Props → utility classes → CSS.** Props are the developer-facing API; they resolve to utility classes under the hood. This is better than raw class usage: typed, discoverable, IDE-friendly.
- **Don't mix prop and class for the same concern.** `border="md"` and `class="rounded-md"` is fine (different concerns). `border="md"` and `class="border-lg"` is not.
- **Data attribute classes for state-driven styling.** Use `data-[disabled]:`, `data-[state=x]:` etc. as the primary approach for styling component states. Scoped slot variables remain available for logic, not styling.
- **Each component ships its own prop defaults.** No global token layer at the DS level. Variations are supported on a design-by-design basis.
- **Named slots become components.** Only the default slot exists. If something would be a named slot, it becomes a sub-component.
- **Explicitly re-expose v-model and events.** DS components declare their own `defineModel` / `defineEmits` and wire them to the underlying v0 primitive. No transparent `$attrs` forwarding — the DS controls its API surface.

### May

- Create DS-specific sub-components not in v0 (e.g., `EmButtonLoader`, `EmButtonPrepend`) when the design spec calls for it
- Add wrapper sub-components for v0 primitives later — this is additive and non-breaking
- Paper may grow shared composed components (e.g., a preconfigured Popover-based menu) when a pattern proves universal across DSes — rare and organic, not planned upfront

### Must Not

- **Add logic that v0 doesn't provide.** If the DS needs new behavior, that belongs in v0.
- **Require a plugin install to function.** DS components work standalone.
- **Cover design patterns outside the DS's own spec.** Emerald ships what Emerald's spec defines. Nothing more.

## Component Structure

```vue
<!-- EmButton.vue -->
<script lang="ts">
  import { V0Paper, type V0PaperProps } from '@vuetify/paper'

  export interface EmButtonProps extends V0PaperProps {
    disabled?: boolean
    loading?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButton' })

  const {
    disabled = false,
    loading = false,
    // TODO: Phase 0 will establish how styling props (color, border, etc.)
    // resolve to utility classes. V0PaperProps composables will be reworked
    // to output classes instead of inline styles.
    ...paperProps
  } = defineProps<EmButtonProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="button"
    class="emerald-button"
    :disabled
    :data-disabled="disabled || undefined"
    :data-loading="loading || undefined"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
/* Structural CSS only — layout, positioning */
/* Utility classes handle color, spacing, borders, etc. */
</style>
```

Components that don't need Paper's styling surface use `Atom` directly:

```vue
<!-- EmDivider.vue -->
<script lang="ts">
  import { Atom, type AtomProps } from '@vuetify/v0'
  export interface EmDividerProps extends AtomProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDivider' })
</script>

<template>
  <Atom as="hr" class="emerald-divider" role="separator" />
</template>
```

## Styling Chain

1. User passes prop: `border="md"`
2. Prop resolves to utility class: `.border-md`
3. Utility class (UnoCSS) applies the style
4. State styling via data attributes: `data-[disabled]:opacity-50`

Scoped `<style>` is only for structural CSS that utility classes can't express (layout, positioning, custom animations).

## Build Pipeline

### Phase 0: Reference Components (one-time)

Build 3 reference components to establish conventions:

1. **EmButton** — simple root + DS sub-components, props → utility classes, data attribute states
2. **EmTextField** — complex sub-component tree, mix of V0Paper and raw v0, form integration, validation states
3. **EmDialog** — behavioral/compound component, v0 Dialog primitives, scrim/backdrop

### Phase 1: Spec Generation

1. Receive design input (Figma screenshots, color palette, component list — flexible)
2. Agent drafts component spec:
   - Sub-components: which exist, which are DS-specific, which are raw v0 pass-throughs
   - Props per sub-component with defaults
   - Data attributes and state-driven styling
   - Which sub-components use `V0Paper` vs raw elements
   - Visual reference notes mapped to utility classes
3. Human reviews and approves the spec

### Phase 2: Implementation

1. Agent implements with high autonomy using: approved spec, reference components as examples, this contract as guardrails
2. Root wraps `V0Paper`, props resolve to utility classes
3. Scoped `<style>` only for structural CSS
4. Exports only sub-components the DS customizes

### Phase 3: Review

1. Human reviews implementation against spec and design input
2. Deviations are either fixed or fed back into the spec

## Barrel Export Pattern

Same as v0 — never use `export *` for Vue components:

```ts
// GOOD
export type { EmButtonProps } from './EmButton.vue'
export { default as EmButton } from './EmButton.vue'
```
