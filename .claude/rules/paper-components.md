---
paths: packages/emerald/**
---

# Paper Design System Components

Rules for building components in Paper design systems (Emerald, Onyx, etc.).

## Architecture

```
Emerald / Onyx / etc. (styled design system — scoped to its own spec)
    ↓
Paper (styling primitives — V0Paper, composables output utility classes)
    ↓
v0 (headless logic & accessibility — zero styling)
```

Each design system is a **complete framework for a single design language**, not a theme. It only ships styles and functionality defined in its own spec. No universal framework sprawl.

## Contract

### Must

- **Root components use `V0Paper`** as their base element — unless the component doesn't need Paper's styling surface (e.g., layout primitives like EmDivider), in which case `Atom` directly is fine. Exception: renderless v0 roots (like DialogRoot) don't get V0Paper — it goes on the first visible element instead (e.g., EmDialogContent).
- **Sub-components use `V0Paper` selectively** — only when the design spec requires independent styling control (own color, spacing, elevation). Otherwise, use raw v0 primitives or plain elements styled via parent's CSS scope.
- **Only wrap v0 sub-components the DS customizes.** Unwrapped v0 sub-components are imported directly by the consumer. Adding a wrapper later is additive, not breaking.
- **Props → utility classes → CSS.** Props are the developer-facing API; Paper's composables resolve them to utility classes. V0Paper applies these via `:class`.
- **Don't mix prop and class for the same concern.** `border="md"` and `class="rounded-md"` is fine (different concerns). `border="md"` and `class="border-lg"` is not.
- **Data attribute classes for state-driven styling.** Use `data-[disabled]:`, `data-[state=x]:` etc. as the primary approach for styling component states. Scoped slot variables remain available for logic, not styling.
- **Each component ships its own prop defaults.** No global token layer at the DS level. Variations are supported on a design-by-design basis.
- **Named slots become components.** Only the default slot exists. If something would be a named slot, it becomes a sub-component.
- **Explicitly re-expose v-model and events.** DS components declare their own `defineModel` / `defineEmits` and wire them to the underlying v0 primitive. No transparent `$attrs` forwarding — the DS controls its API surface.
- **Forward v0 slot props via default slot.** When wrapping a v0 compound component, pass slot props through: `<template #default="slotProps"><slot v-bind="slotProps" /></template>`.

### May

- Create DS-specific sub-components not in v0 (e.g., `EmButtonLoader`, `EmButtonPrepend`) when the design spec calls for it
- Add wrapper sub-components for v0 primitives later — this is additive and non-breaking
- Paper may grow shared composed components (e.g., a preconfigured Popover-based menu) when a pattern proves universal across DSes — rare and organic, not planned upfront

### Must Not

- **Add logic that v0 doesn't provide.** If the DS needs new behavior, that belongs in v0.
- **Require a plugin install to function.** DS components work standalone.
- **Cover design patterns outside the DS's own spec.** Emerald ships what Emerald's spec defines. Nothing more.

## Component Patterns

### Pattern 1: Root with V0Paper (EmButton)

For components that render a visible root element. V0Paper provides the styling surface, DS-specific props are destructured out, rest spread to V0Paper.

```vue
<script lang="ts">
  import { V0Paper } from '@vuetify/paper'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmButtonProps extends V0PaperProps {
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButton' })

  const {
    disabled = false,
    loading = false,
    type = 'button',
    href,
    ...paperProps
  } = defineProps<EmButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled || loading) return
    emit('click', event)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :as="href ? 'a' : 'button'"
    :href
    :type="href ? undefined : type"
    :disabled="(disabled || loading) || undefined"
    :data-disabled="(disabled || loading) || undefined"
    :data-loading="loading || undefined"
    class="emerald-button"
    @click="onClick"
  >
    <slot />
  </V0Paper>
</template>
```

### Pattern 2: Wrapping v0 compound component (EmTextField)

For components that wrap a v0 compound component. V0Paper wraps the v0 root, DS component re-exposes v-model and key props.

```vue
<script lang="ts">
  import { V0Paper } from '@vuetify/paper'
  import { InputRoot } from '@vuetify/v0'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTextFieldProps extends V0PaperProps {
    disabled?: boolean
    // ... other v0 InputRoot props to re-expose
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextField' })
  const { disabled = false, ...paperProps } = defineProps<EmTextFieldProps>()
  const model = defineModel<string>({ default: '' })
</script>

<template>
  <V0Paper v-bind="paperProps" as="div" class="emerald-text-field">
    <InputRoot v-model="model" :disabled>
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </InputRoot>
  </V0Paper>
</template>
```

### Pattern 3: Renderless v0 root (EmDialog)

For v0 components whose root is renderless (renders no element). No V0Paper on the root — it goes on the first visible sub-component (EmDialogContent).

```vue
<!-- EmDialog.vue — no V0Paper, wraps renderless DialogRoot -->
<script lang="ts">
  import { DialogRoot } from '@vuetify/v0'
  export interface EmDialogProps { id?: string }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialog' })
  const { id } = defineProps<EmDialogProps>()
  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <DialogRoot v-model="model" :id>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </DialogRoot>
</template>
```

```vue
<!-- EmDialogContent.vue — V0Paper here for panel styling -->
<script lang="ts">
  import { V0Paper } from '@vuetify/paper'
  import { DialogContent } from '@vuetify/v0'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmDialogContentProps extends V0PaperProps {
    closeOnClickOutside?: boolean
    blocking?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogContent' })
  const { closeOnClickOutside = true, blocking = false, ...paperProps } = defineProps<EmDialogContentProps>()
</script>

<template>
  <DialogContent :blocking :close-on-click-outside>
    <V0Paper v-bind="paperProps" as="div" class="emerald-dialog__content">
      <slot />
    </V0Paper>
  </DialogContent>
</template>
```

### Pattern 4: Simple sub-components

DS-specific sub-components that are purely layout. No V0Paper, no props, just a styled element.

```vue
<script lang="ts">
  export interface EmButtonPrependProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButtonPrepend' })
</script>

<template>
  <span class="emerald-button__prepend">
    <slot />
  </span>
</template>
```

### Pattern 5: Sub-component wrapping v0 primitive

Thin wrapper that adds an Emerald class to a v0 sub-component. Re-exposes slot props.

```vue
<script lang="ts">
  import { InputError } from '@vuetify/v0'
  export interface EmTextFieldErrorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldError' })
</script>

<template>
  <InputError class="emerald-text-field__error">
    <template #default="{ errors }">
      <slot :errors />
    </template>
  </InputError>
</template>
```

## Styling

- Paper composables output utility class arrays (not inline CSS variables)
- V0Paper collects classes from all composables and applies via `:class`
- Scoped `<style>` is only for structural CSS (layout, positioning, cursor)
- State styling uses data attributes: `data-[disabled]:`, `data-[loading]:`, `data-[state=x]:`
- Class prefix: `emerald-` for all Emerald components

## Naming

- Root: `Em{ComponentName}` (e.g., `EmButton`, `EmDialog`)
- Sub-components: `Em{ComponentName}{SubName}` (e.g., `EmButtonPrepend`, `EmDialogContent`)
- CSS classes: `emerald-{component}` for root, `emerald-{component}__{sub}` for sub-components (BEM-like)

## Barrel Export Pattern

Same as v0 — never use `export *` for Vue components:

```ts
export type { EmButtonProps } from './EmButton.vue'
export { default as EmButton } from './EmButton.vue'
```

## Build Pipeline

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
2. Identify which pattern (1-5 above) applies to each component/sub-component
3. Scoped `<style>` only for structural CSS
4. Exports only sub-components the DS customizes

### Phase 3: Review

1. Human reviews implementation against spec and design input
2. Deviations are either fixed or fed back into the spec
