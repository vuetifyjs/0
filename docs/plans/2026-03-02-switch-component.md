# Switch Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a headless Switch compound component for `@vuetify/v0` with `role="switch"`, grouping, tri-state, Thumb/Track sub-components.

**Architecture:** Mirrors Checkbox compound component pattern — separate SFCs with shared `createGroup` composable. Two independent contexts (`SwitchRootContext`, `SwitchGroupContext`) via `createContext`. Dual-mode Root (standalone boolean v-model or group member via try/catch inject).

**Tech Stack:** Vue 3 SFCs, TypeScript, `#v0/composables` (createContext, createGroup, useProxyModel), Atom component, Vitest + @vue/test-utils.

**Design doc:** `docs/plans/2026-03-02-switch-component-design.md`

---

### Task 1: SwitchRoot — Types and Context

**Files:**
- Create: `packages/0/src/components/Switch/SwitchRoot.vue`

**Reference:** `packages/0/src/components/Checkbox/CheckboxRoot.vue` — follow exactly, changing `checkbox` → `switch` in roles, namespaces, and names.

**Step 1: Create SwitchRoot.vue with types and context**

Write the first `<script lang="ts">` block only (types + context export). This establishes the contract for all other sub-components.

```vue
/**
 * @module SwitchRoot
 *
 * @remarks
 * Root component for individual switches with dual-mode support:
 * - **Standalone mode**: Uses v-model for boolean state
 * - **Group mode**: Registers with parent Switch.Group for multi-selection
 *
 * Automatically detects parent group context and adapts behavior accordingly.
 * Provides switch context to child Switch.Thumb and Switch.Track components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  /** Visual state of the switch for styling purposes */
  export type SwitchState = 'checked' | 'unchecked' | 'indeterminate'

  export interface SwitchRootContext<V = unknown> {
    readonly id: ID
    readonly label?: string
    readonly value: V | undefined
    readonly name?: string
    readonly form?: string
    isChecked: Readonly<Ref<boolean>>
    isMixed: Readonly<Ref<boolean>>
    isDisabled: Readonly<Ref<boolean>>
    select: () => void
    unselect: () => void
    toggle: () => void
    mix: () => void
    unmix: () => void
  }

  export interface SwitchRootProps<V = unknown> extends AtomProps {
    id?: ID
    label?: string
    value?: V
    name?: string
    form?: string
    disabled?: MaybeRef<boolean>
    indeterminate?: MaybeRef<boolean>
    namespace?: string
    groupNamespace?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
    ariaInvalid?: boolean
  }

  export interface SwitchRootSlotProps<V = unknown> {
    id: ID
    label?: string
    value: V | undefined
    isChecked: boolean
    isMixed: boolean
    isDisabled: boolean
    select: () => void
    unselect: () => void
    toggle: () => void
    mix: () => void
    unmix: () => void
    attrs: {
      'type': 'button' | undefined
      'role': 'switch'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-invalid': boolean | undefined
      'tabindex': 0 | undefined
      'data-state': SwitchState
      'data-disabled': true | undefined
    }
  }

  export const [useSwitchRoot, provideSwitchRoot] = createContext<SwitchRootContext<unknown>>()
</script>
```

Leave the second `<script setup>` and `<template>` empty for now — they come in the next step.

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchRoot.vue
git commit -m "feat(Switch): add SwitchRoot types and context"
```

---

### Task 2: SwitchGroup

**Files:**
- Create: `packages/0/src/components/Switch/SwitchGroup.vue`

**Reference:** `packages/0/src/components/Checkbox/CheckboxGroup.vue` — follow exactly, changing namespaces and component name.

**Step 1: Create SwitchGroup.vue**

```vue
/**
 * @module SwitchGroup
 *
 * @remarks
 * Group component for managing multiple switches with tri-state support.
 * Provides group context to child Switch.Root components. Supports batch
 * operations (selectAll, unselectAll, toggleAll) and mixed/indeterminate states.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
  import type { ID } from '#v0/types'

  export interface SwitchGroupProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    label?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
  }

  export interface SwitchGroupSlotProps {
    isDisabled: boolean
    isNoneSelected: boolean
    isAllSelected: boolean
    isMixed: boolean
    select: (id: ID | ID[]) => void
    unselect: (id: ID | ID[]) => void
    toggle: (id: ID | ID[]) => void
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
    }
  }

  export const [useSwitchGroup, provideSwitchGroup] = createContext<GroupContext<GroupTicket>>()
</script>

<script setup lang="ts" generic="T = unknown">
  // Composables
  import { createGroup } from '#v0/composables/createGroup'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SwitchGroup' })

  defineSlots<{
    default: (props: SwitchGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:switch:group',
    ariaLabelledby,
    ariaDescribedby,
    disabled = false,
    enroll = false,
    mandatory = false,
    label,
  } = defineProps<SwitchGroupProps>()

  const model = defineModel<T | T[]>()

  const group = createGroup({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(group, model, { multiple: true })

  provideSwitchGroup(namespace, group)

  const slotProps = toRef((): SwitchGroupSlotProps => ({
    isDisabled: toValue(group.disabled),
    isNoneSelected: group.isNoneSelected.value,
    isAllSelected: group.isAllSelected.value,
    isMixed: group.isMixed.value,
    select: group.select,
    unselect: group.unselect,
    toggle: group.toggle,
    selectAll: group.selectAll,
    unselectAll: group.unselectAll,
    toggleAll: group.toggleAll,
    attrs: {
      'role': 'group',
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchGroup.vue
git commit -m "feat(Switch): add SwitchGroup component"
```

---

### Task 3: SwitchRoot — Implementation

**Files:**
- Modify: `packages/0/src/components/Switch/SwitchRoot.vue` (add setup script + template)

**Reference:** `packages/0/src/components/Checkbox/CheckboxRoot.vue:126-314`

**Step 1: Add the setup script and template to SwitchRoot.vue**

Add the second `<script setup>` block and `<template>`. Identical logic to CheckboxRoot but imports `useSwitchGroup` and `SwitchHiddenInput`, sets `role: 'switch'` instead of `role: 'checkbox'`, and uses `v0:switch:*` namespaces.

Key differences from CheckboxRoot:
- `role: 'switch'` in attrs (not `'checkbox'`)
- Imports from `./SwitchGroup.vue` and `./SwitchHiddenInput.vue`
- Default namespaces: `v0:switch:root`, `v0:switch:group`
- Uses `provideSwitchRoot` (not `provideCheckboxRoot`)

```vue
<script setup lang="ts" generic="V = unknown">
  // Components
  import { useSwitchGroup } from './SwitchGroup.vue'
  import SwitchHiddenInput from './SwitchHiddenInput.vue'

  // Utilities
  import { onUnmounted, toRef, toValue, useAttrs, useId } from 'vue'

  // Types
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'

  defineOptions({ name: 'SwitchRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SwitchRootSlotProps<V>) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'button',
    renderless,
    id = useId(),
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    label,
    value,
    name,
    form,
    disabled = false,
    indeterminate = false,
    namespace = 'v0:switch:root',
    groupNamespace = 'v0:switch:group',
  } = defineProps<SwitchRootProps<V>>()

  let group: GroupContext<GroupTicket> | null = null
  try {
    group = useSwitchGroup(groupNamespace)
  } catch {
    // No group context, standalone mode
  }

  const model = defineModel<boolean>()

  const ticket = group?.register({ id, value, disabled, indeterminate })

  const isChecked = toRef(() => ticket
    ? toValue(ticket.isSelected)
    : model.value ?? false,
  )

  const isMixed = toRef(() => ticket
    ? toValue(ticket.isMixed)
    : toValue(indeterminate) ?? false,
  )

  const isDisabled = toRef(() => group && ticket
    ? toValue(ticket.disabled) || toValue(group.disabled)
    : toValue(disabled) ?? false,
  )

  const dataState = toRef(() => isMixed.value
    ? 'indeterminate'
    : (isChecked.value ? 'checked' : 'unchecked'),
  )

  function toggle () {
    if (isDisabled.value) return
    if (ticket) {
      ticket.toggle()
    } else {
      model.value = !model.value
    }
  }

  function select () {
    if (isDisabled.value) return
    if (ticket) {
      ticket.select()
    } else {
      model.value = true
    }
  }

  function unselect () {
    if (isDisabled.value) return
    if (ticket) {
      ticket.unselect()
    } else {
      model.value = false
    }
  }

  function mix () {
    if (isDisabled.value || !ticket) return
    ticket.mix()
  }

  function unmix () {
    if (isDisabled.value || !ticket) return
    ticket.unmix()
  }

  function onClick () {
    toggle()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key !== ' ') return
    e.preventDefault()
    toggle()
  }

  onUnmounted(() => {
    if (!ticket || !group) return
    group.unregister(ticket.id)
  })

  const context: SwitchRootContext<V> = {
    id,
    label,
    value,
    name,
    form,
    isChecked,
    isMixed,
    isDisabled,
    select,
    unselect,
    toggle,
    mix,
    unmix,
  }

  provideSwitchRoot(namespace, context)

  const slotProps = toRef((): SwitchRootSlotProps<V> => ({
    id,
    label,
    value,
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    select,
    unselect,
    toggle,
    mix,
    unmix,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': 'switch',
      'aria-checked': isMixed.value ? 'mixed' : isChecked.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'aria-invalid': ariaInvalid || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>

  <SwitchHiddenInput v-if="name" />
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchRoot.vue
git commit -m "feat(Switch): implement SwitchRoot setup and template"
```

---

### Task 4: SwitchThumb

**Files:**
- Create: `packages/0/src/components/Switch/SwitchThumb.vue`

**Reference:** `packages/0/src/components/Checkbox/CheckboxIndicator.vue` — same visibility logic, different name.

**Step 1: Create SwitchThumb.vue**

```vue
/**
 * @module SwitchThumb
 *
 * @remarks
 * Sliding knob indicator for switches. Must be used within a
 * Switch.Root component which provides the switch state.
 * Renders as a span by default and only displays when checked or indeterminate.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchState } from './SwitchRoot.vue'

  export interface SwitchThumbProps extends AtomProps {
    namespace?: string
  }

  export interface SwitchThumbSlotProps {
    isChecked: boolean
    isMixed: boolean
    attrs: {
      'data-state': SwitchState
      'style': { visibility: 'visible' | 'hidden' }
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SwitchThumb' })

  defineSlots<{
    default: (props: SwitchThumbSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:switch:root',
  } = defineProps<SwitchThumbProps>()

  const root = useSwitchRoot(namespace)

  const isChecked = toRef(() => toValue(root.isChecked))
  const isMixed = toRef(() => toValue(root.isMixed))
  const isVisible = toRef(() => isChecked.value || isMixed.value)
  const dataState = toRef((): SwitchState => isMixed.value
    ? 'indeterminate'
    : (isChecked.value ? 'checked' : 'unchecked'),
  )

  const slotProps = toRef((): SwitchThumbSlotProps => ({
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    attrs: {
      'data-state': dataState.value,
      'style': { visibility: isVisible.value ? 'visible' : 'hidden' },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchThumb.vue
git commit -m "feat(Switch): add SwitchThumb component"
```

---

### Task 5: SwitchTrack

**Files:**
- Create: `packages/0/src/components/Switch/SwitchTrack.vue`

**Step 1: Create SwitchTrack.vue**

Track is always visible (no visibility toggling). It's a mounting point with `data-state` for CSS styling.

```vue
/**
 * @module SwitchTrack
 *
 * @remarks
 * Track/rail component for switches. Always visible, provides data-state
 * attribute for CSS styling. Must be used within a Switch.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchState } from './SwitchRoot.vue'

  export interface SwitchTrackProps extends AtomProps {
    namespace?: string
  }

  export interface SwitchTrackSlotProps {
    isChecked: boolean
    isMixed: boolean
    attrs: {
      'data-state': SwitchState
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SwitchTrack' })

  defineSlots<{
    default: (props: SwitchTrackSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:switch:root',
  } = defineProps<SwitchTrackProps>()

  const root = useSwitchRoot(namespace)

  const isChecked = toRef(() => toValue(root.isChecked))
  const isMixed = toRef(() => toValue(root.isMixed))
  const dataState = toRef((): SwitchState => isMixed.value
    ? 'indeterminate'
    : (isChecked.value ? 'checked' : 'unchecked'),
  )

  const slotProps = toRef((): SwitchTrackSlotProps => ({
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    attrs: {
      'data-state': dataState.value,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchTrack.vue
git commit -m "feat(Switch): add SwitchTrack component"
```

---

### Task 6: SwitchHiddenInput

**Files:**
- Create: `packages/0/src/components/Switch/SwitchHiddenInput.vue`

**Reference:** `packages/0/src/components/Checkbox/CheckboxHiddenInput.vue` — identical logic, imports from Switch context.

**Step 1: Create SwitchHiddenInput.vue**

```vue
/**
 * @module SwitchHiddenInput
 *
 * @remarks
 * Hidden native checkbox for form submission. Must be used within a
 * Switch.Root component. Auto-rendered by Root when `name` prop is provided,
 * or can be placed explicitly for custom form integration.
 */

<script lang="ts">
  export interface SwitchHiddenInputProps {
    namespace?: string
    name?: string
    value?: string
    form?: string
  }

  const visuallyHiddenStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  } as const
</script>

<script setup lang="ts">
  // Components
  import { useSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { isNullOrUndefined, isObject } from '#v0/utilities'
  import { toRef } from 'vue'

  defineOptions({ name: 'SwitchHiddenInput' })

  const {
    namespace = 'v0:switch:root',
    name: nameProp,
    value: valueProp,
    form: formProp,
  } = defineProps<SwitchHiddenInputProps>()

  const root = useSwitchRoot(namespace)

  const name = toRef(() => nameProp ?? root.name)
  const form = toRef(() => formProp ?? root.form)

  const value = toRef(() => {
    const v = valueProp ?? root.value ?? 'on'
    if (isNullOrUndefined(v)) return 'on'
    if (isObject(v)) return JSON.stringify(v)
    return String(v)
  })

  const isChecked = root.isChecked
  const isDisabled = root.isDisabled
</script>

<template>
  <input
    :checked="isChecked"
    :disabled="isDisabled"
    :form="form"
    inert
    :name="name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="checkbox"
    :value="value"
  >
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchHiddenInput.vue
git commit -m "feat(Switch): add SwitchHiddenInput component"
```

---

### Task 7: SwitchSelectAll

**Files:**
- Create: `packages/0/src/components/Switch/SwitchSelectAll.vue`

**Reference:** `packages/0/src/components/Checkbox/CheckboxSelectAll.vue` — same pattern, uses Switch contexts and `role: 'switch'`.

**Step 1: Create SwitchSelectAll.vue**

```vue
/**
 * @module SwitchSelectAll
 *
 * @remarks
 * A "select all" switch that binds to its parent Switch.Group's
 * aggregate state. Automatically reflects isAllSelected/isMixed state
 * and calls toggleAll on click. Does NOT register as a group item.
 *
 * Must be used within a Switch.Group component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchRootContext, SwitchState } from './SwitchRoot.vue'

  export interface SwitchSelectAllProps extends AtomProps {
    label?: string
    disabled?: boolean
    namespace?: string
    groupNamespace?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
  }

  export interface SwitchSelectAllSlotProps {
    label?: string
    isAllSelected: boolean
    isMixed: boolean
    isDisabled: boolean
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
    attrs: {
      'type': 'button' | undefined
      'role': 'switch'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'tabindex': 0 | undefined
      'data-state': SwitchState
      'data-disabled': true | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useSwitchGroup } from './SwitchGroup.vue'
  import { provideSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { toRef, toValue, useAttrs, useId } from 'vue'

  defineOptions({ name: 'SwitchSelectAll', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SwitchSelectAllSlotProps) => any
  }>()

  const props = defineProps<SwitchSelectAllProps>()

  const {
    as = 'button',
    renderless,
    label,
    namespace = 'v0:switch:root',
    groupNamespace = 'v0:switch:group',
  } = props

  const group = useSwitchGroup(groupNamespace)

  const id = useId()

  const isAllSelected = toRef(() => group.isAllSelected.value)
  const isMixed = toRef(() => group.isMixed.value)
  const isDisabled = toRef(() => toValue(props.disabled) || toValue(group.disabled))
  const dataState = toRef((): SwitchState => isMixed.value
    ? 'indeterminate'
    : (isAllSelected.value ? 'checked' : 'unchecked'),
  )

  function onClick () {
    if (isDisabled.value) return
    group.toggleAll()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key !== ' ') return
    e.preventDefault()
    if (isDisabled.value) return
    group.toggleAll()
  }

  const context: SwitchRootContext<void> = {
    id,
    label,
    value: undefined,
    name: undefined,
    form: undefined,
    isChecked: isAllSelected,
    isMixed,
    isDisabled,
    select: group.selectAll,
    unselect: group.unselectAll,
    toggle: group.toggleAll,
    mix: () => {},
    unmix: () => {},
  }

  provideSwitchRoot(namespace, context)

  const slotProps = toRef((): SwitchSelectAllSlotProps => ({
    label,
    isAllSelected: isAllSelected.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    selectAll: group.selectAll,
    unselectAll: group.unselectAll,
    toggleAll: group.toggleAll,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': 'switch',
      'aria-checked': isMixed.value ? 'mixed' : isAllSelected.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'aria-labelledby': props.ariaLabelledby || undefined,
      'aria-describedby': props.ariaDescribedby || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Switch/SwitchSelectAll.vue
git commit -m "feat(Switch): add SwitchSelectAll component"
```

---

### Task 8: Barrel Exports

**Files:**
- Create: `packages/0/src/components/Switch/index.ts`
- Modify: `packages/0/src/components/index.ts` (add Switch export)

**Reference:** `packages/0/src/components/Checkbox/index.ts` — follow same barrel pattern. Never use `export *` for Vue components (breaks Volar slot inference).

**Step 1: Create Switch barrel export**

Create `packages/0/src/components/Switch/index.ts` with named exports for each sub-component, type re-exports, and the `Switch` namespace object.

Follow the Checkbox barrel pattern:
- Named exports: `SwitchRoot`, `SwitchGroup`, etc.
- Context exports: `useSwitchRoot`, `provideSwitchRoot`, `useSwitchGroup`, `provideSwitchGroup`
- Type exports: all Props, SlotProps, Context, State types
- Namespace object: `export const Switch = { Root, Group, Thumb, Track, HiddenInput, SelectAll }`

**Step 2: Add to components barrel**

Add `export * from './Switch'` to `packages/0/src/components/index.ts`.

**Step 3: Commit**

```bash
git add packages/0/src/components/Switch/index.ts packages/0/src/components/index.ts
git commit -m "feat(Switch): add barrel exports"
```

---

### Task 9: Tests — Standalone Mode

**Files:**
- Create: `packages/0/src/components/Switch/index.test.ts`

**Reference:** `packages/0/src/components/Checkbox/index.test.ts` — adapt test helpers and structure.

**Step 1: Write standalone mode tests**

Create test file with helpers (`mountSwitch`, `mountGroup`) and test these scenarios:

1. **Renders with role="switch"** — verify `role` attr is `'switch'` not `'checkbox'`
2. **Standalone v-model** — click toggles boolean model
3. **Slot props** — verify `isChecked`, `isMixed`, `isDisabled`, `toggle`, `select`, `unselect`
4. **ARIA attributes** — `aria-checked` true/false/mixed, `aria-disabled`, `data-state`
5. **Keyboard** — Space key triggers toggle
6. **Disabled** — click and keyboard don't toggle when disabled
7. **Indeterminate** — `aria-checked="mixed"`, `data-state="indeterminate"`
8. **HiddenInput auto-render** — when `name` prop set, hidden input appears
9. **Thumb visibility** — hidden when unchecked, visible when checked/mixed
10. **Track always visible** — Track renders regardless of state, exposes data-state

**Step 2: Run tests to verify they pass**

```bash
pnpm vitest run packages/0/src/components/Switch/index.test.ts
```

**Step 3: Commit**

```bash
git add packages/0/src/components/Switch/index.test.ts
git commit -m "feat(Switch): add standalone mode tests"
```

---

### Task 10: Tests — Group Mode

**Files:**
- Modify: `packages/0/src/components/Switch/index.test.ts`

**Step 1: Add group mode tests**

Test these scenarios:

1. **Group v-model** — toggling switches adds/removes values from array
2. **Group disabled** — disables all children
3. **Individual disabled** — only that switch is disabled
4. **Mandatory** — can't deselect last item
5. **SelectAll** — toggleAll selects/deselects all, reflects mixed state
6. **SelectAll role** — verify SelectAll also has `role="switch"`
7. **Mixed state** — group reports `isMixed` when partially selected
8. **Enroll** — items auto-selected on registration
9. **Unmount cleanup** — unregisters from group on unmount

**Step 2: Run full test suite**

```bash
pnpm vitest run packages/0/src/components/Switch/index.test.ts
```

**Step 3: Commit**

```bash
git add packages/0/src/components/Switch/index.test.ts
git commit -m "feat(Switch): add group mode tests"
```

---

### Task 11: Tests — SSR

**Files:**
- Modify: `packages/0/src/components/Switch/index.test.ts`

**Reference:** Checkbox SSR tests use `renderToString` from `vue/server-renderer` with `createSSRApp`.

**Step 1: Add SSR test**

Verify Switch renders correctly in SSR context — no hydration mismatches, correct HTML output with `role="switch"`.

**Step 2: Run tests**

```bash
pnpm vitest run packages/0/src/components/Switch/index.test.ts
```

**Step 3: Commit**

```bash
git add packages/0/src/components/Switch/index.test.ts
git commit -m "feat(Switch): add SSR tests"
```

---

### Task 12: Verify — Typecheck and Lint

**Step 1: Run typecheck**

```bash
pnpm typecheck
```

Fix any type errors.

**Step 2: Run lint**

```bash
pnpm lint:fix
```

Fix any lint issues.

**Step 3: Run full test suite**

```bash
pnpm test:run
```

Ensure no regressions.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "chore(Switch): fix lint and type issues"
```
