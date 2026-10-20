# Authoring a Compound Component

How to build a new headless compound component on top of v0 primitives.

## Pattern overview

Every v0 compound component follows the same four-part structure:

1. **`createContext`** — establishes the type-safe DI contract between Root and sub-components
2. **Root component** — holds composable state, provides context
3. **Sub-components** — consume context, register themselves on mount
4. **Lifecycle contract** — `register()` in setup, `unregister()` in `onBeforeUnmount`

---

## Complete example — Accordion

An accordion with single-open behavior built on `createSingle`.

### 1. Define the context

```ts
// AccordionRoot.vue — script lang="ts" (top of dual-script SFC)
import { createContext } from '@vuetify/v0'
import type { SingleContext } from '@vuetify/v0'

export interface AccordionContext {
  single: SingleContext
}

// [useAccordionRoot, provideAccordionRoot] — the DI pair
export const [useAccordionRoot, provideAccordionRoot] =
  createContext<AccordionContext>('v0:accordion')
```

Key rules:
- Key must contain `:` — `v0:accordion`, not `accordion` (§9.3)
- Use `createContext`, never raw `provide`/`inject` (§6.5)
- Export the `use*` function so sub-components can import it

---

### 2. Root component

```vue
<!-- AccordionRoot.vue -->
<script lang="ts">
import { createContext } from '@vuetify/v0'
import type { SingleContext } from '@vuetify/v0'

export interface AccordionContext {
  single: SingleContext
}

export const [useAccordionRoot, provideAccordionRoot] =
  createContext<AccordionContext>('v0:accordion')
</script>

<script setup lang="ts">
import { createSingle } from '@vuetify/v0'

const { mandatory = false } = defineProps<{
  mandatory?: boolean | 'force'
}>()

const single = createSingle({ mandatory: () => mandatory })

// Provide state to all descendants
provideAccordionRoot({ single })
</script>

<template>
  <div role="region">
    <slot />
  </div>
</template>
```

---

### 3. Item sub-component (trigger + registration)

```vue
<!-- AccordionItem.vue -->
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useAccordionRoot } from './AccordionRoot.vue'

const { id, value } = defineProps<{
  id: string
  value: string
}>()

// Consume parent context — throws a descriptive error if used outside Root
const { single } = useAccordionRoot()

// Register in setup, not onMounted — so sibling index is correct before DOM paint (§6.8)
const ticket = single.register({ id, value })

// onBeforeUnmount, not onUnmounted — context is still reachable here (§7.3)
onBeforeUnmount(() => single.unregister(ticket.id))
</script>

<template>
  <div>
    <button
      :id="`accordion-trigger-${id}`"
      :aria-expanded="single.selected(id)"
      :aria-controls="`accordion-panel-${id}`"
      :data-state="single.selected(id) ? 'open' : 'closed'"
      @click="single.toggle(id)"
    >
      <slot name="trigger" />
    </button>

    <div
      v-if="single.selected(id)"
      :id="`accordion-panel-${id}`"
      role="region"
      :aria-labelledby="`accordion-trigger-${id}`"
    >
      <slot />
    </div>
  </div>
</template>
```

---

### 4. Consumer usage

```vue
<template>
  <AccordionRoot mandatory>
    <AccordionItem id="section-1" value="Section 1">
      <template #trigger>Section 1</template>
      Content for section 1
    </AccordionItem>

    <AccordionItem id="section-2" value="Section 2">
      <template #trigger>Section 2</template>
      Content for section 2
    </AccordionItem>
  </AccordionRoot>
</template>
```

---

## Using `useProxyRegistry` for reactive child lists

When the Root needs to react to which children are registered (e.g. to render a list of tabs from registered items), use `useProxyRegistry`:

```vue
<!-- TabsRoot.vue (setup script) -->
<script setup lang="ts">
import { createSingle, useProxyRegistry } from '@vuetify/v0'

const single = createSingle({ mandatory: 'force', events: true })

// Reactive view of the registry. `events: true` belongs on the registry.
const proxy = useProxyRegistry(single)
</script>

<template>
  <!-- Renders a tab strip from registered items -->
  <div role="tablist">
    <button
      v-for="item in proxy.values"
      :key="item.id"
      :data-selected="single.selected(item.id) || undefined"
      @click="single.select(item.id)"
    >
      {{ item.value }}
    </button>
  </div>

  <slot />
</template>
```

---

## `v-show` vs `v-if` for registered children

Sub-components that register tickets must stay mounted while logically hidden. Use `v-show`, not `v-if`, when a registered child needs to be visually hidden but remain in the registry. `v-if` triggers `onBeforeUnmount`, deregisters the ticket, and causes state thrash when the child reappears.

```vue
<!-- Wrong — unmounting loses the ticket -->
<AccordionPanel v-if="isOpen" />

<!-- Right — ticket survives the visibility flip -->
<AccordionPanel v-show="isOpen" />
```

Exception: use `v-if` when the child is structurally absent (never mounted yet, destroyed permanently). Use `v-show` when it toggles between visible and hidden. See §10.11.

---

## Forwarding reactive props into composables

When passing a component prop into a composable option, always wrap it as a getter — never pass the destructured value directly:

```ts
const { gap } = defineProps<{ gap?: number }>()

// Wrong — captures gap at setup time, prop changes never propagate
createOverflow({ gap })

// Right — getter re-reads the prop on every recompute
createOverflow({ gap: () => gap })
```

This applies to any composable option typed as `MaybeRefOrGetter<T>`. See §4.3.
