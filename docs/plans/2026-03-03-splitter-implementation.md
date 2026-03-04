# Splitter Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a minimal headless Splitter compound component (Root/Panel/Handle) for resizable panel layouts.

**Architecture:** Compound component pattern matching Tabs/Dialog. Root provides context via `createContext`, panels register on mount and get sizes from a shared reactive array, Handle does pointer-captured drag with RAF batching and WAI-ARIA separator keyboard support.

**Tech Stack:** Vue 3 SFCs, `createContext` for DI, `Atom` for polymorphic rendering, `clamp` utility, `useEventListener` for document-level listeners, `useToggleScope` for conditional effects.

**Design doc:** `docs/plans/2026-03-03-splitter-design.md`

---

### Task 1: SplitterRoot — context and layout

**Files:**
- Create: `packages/0/src/components/Splitter/SplitterRoot.vue`

**Step 1: Create SplitterRoot.vue**

The root component:
- Creates context with `createContext<SplitterContext>('v0:splitter')`
- Manages a reactive `sizes: number[]` array and `panels: SplitterPanelState[]` registry
- Provides `register`/`unregister` functions for panels
- Provides `registerHandle` for handles to discover their adjacent panel indices
- Renders a flex container with direction based on orientation

```vue
/**
 * @module SplitterRoot
 *
 * @remarks
 * Root component for splitter layouts. Provides context to child
 * SplitterPanel and SplitterHandle components. Manages panel sizes
 * and coordinates resize operations between adjacent panels.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { clamp } from '#v0/utilities'

  // Types
  import type { Ref } from 'vue'

  export type SplitterOrientation = 'horizontal' | 'vertical'

  export interface SplitterPanelState {
    minSize: number
    maxSize: number
  }

  export interface SplitterContext {
    orientation: Ref<SplitterOrientation>
    disabled: Ref<boolean>
    sizes: Ref<number[]>
    dragging: Ref<boolean>
    rootEl: Ref<HTMLElement | null>
    register: (panel: SplitterPanelState, defaultSize: number) => number
    unregister: (index: number) => void
    registerHandle: () => number
    resize: (handleIndex: number, delta: number) => void
  }

  export interface SplitterRootProps {
    orientation?: SplitterOrientation
    disabled?: boolean
  }

  export interface SplitterRootSlotProps {
    orientation: SplitterOrientation
    isDisabled: boolean
    sizes: number[]
    isDragging: boolean
    attrs: {
      'data-orientation': SplitterOrientation
      'data-dragging': true | undefined
    }
  }

  export const [useSplitterRoot, provideSplitterRoot] = createContext<SplitterContext>('v0:splitter')
</script>

<script setup lang="ts">
  import { ref, toRef, useTemplateRef } from 'vue'

  defineOptions({ name: 'SplitterRoot' })

  defineSlots<{
    default: (props: SplitterRootSlotProps) => any
  }>()

  const {
    orientation = 'horizontal',
    disabled = false,
  } = defineProps<SplitterRootProps>()

  const rootEl = useTemplateRef<HTMLElement>('root')
  const sizes = ref<number[]>([])
  const panels = ref<SplitterPanelState[]>([])
  const dragging = ref(false)

  let panelCount = 0
  let handleCount = 0

  function register (panel: SplitterPanelState, defaultSize: number) {
    const index = panelCount++
    panels.value.push(panel)
    sizes.value.push(defaultSize)
    return index
  }

  function unregister (index: number) {
    panels.value.splice(index, 1)
    sizes.value.splice(index, 1)
    panelCount--
  }

  function registerHandle () {
    return handleCount++
  }

  function resize (handleIndex: number, delta: number) {
    const before = handleIndex
    const after = handleIndex + 1

    if (before < 0 || after >= sizes.value.length) return

    const panel1 = panels.value[before]
    const panel2 = panels.value[after]
    const size1 = sizes.value[before]
    const size2 = sizes.value[after]
    const total = size1 + size2

    const newSize1 = clamp(size1 + delta, panel1.minSize, Math.min(panel1.maxSize, total - panel2.minSize))
    const newSize2 = total - newSize1

    if (newSize2 < panel2.minSize || newSize2 > panel2.maxSize) return

    sizes.value[before] = newSize1
    sizes.value[after] = newSize2
  }

  const context: SplitterContext = {
    orientation: toRef(() => orientation),
    disabled: toRef(() => disabled),
    sizes,
    dragging,
    rootEl,
    register,
    unregister,
    registerHandle,
    resize,
  }

  provideSplitterRoot(context)

  const slotProps = toRef((): SplitterRootSlotProps => ({
    orientation,
    isDisabled: disabled,
    sizes: sizes.value,
    isDragging: dragging.value,
    attrs: {
      'data-orientation': orientation,
      'data-dragging': dragging.value || undefined,
    },
  }))
</script>

<template>
  <div
    ref="root"
    :style="{
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    }"
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
```

**Step 2: Verify no lint/type errors**

Run: `pnpm typecheck`

**Step 3: Commit**

```
feat(Splitter): add SplitterRoot component with context
```

---

### Task 2: SplitterPanel — size-driven flex panel

**Files:**
- Create: `packages/0/src/components/Splitter/SplitterPanel.vue`

**Step 1: Create SplitterPanel.vue**

The panel component:
- Registers with root context on setup, providing minSize/maxSize/defaultSize
- Gets its index from registration order
- Reads its current size from `context.sizes[index]`
- Renders a `<div>` with `flex: 0 0 {size}%` and `overflow: hidden`
- Exposes `size` in slot props

```vue
/**
 * @module SplitterPanel
 *
 * @remarks
 * Resizable panel within a splitter layout. Registers with the parent
 * SplitterRoot and receives its size from the shared sizes array.
 * Sized via flex-basis percentage.
 */

<script lang="ts">
  import { useSplitterRoot } from './SplitterRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SplitterPanelProps extends AtomProps {
    defaultSize: number
    minSize?: number
    maxSize?: number
  }

  export interface SplitterPanelSlotProps {
    size: number
    attrs: {
      'data-orientation': string
      'data-panel-index': number
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { onUnmounted, toRef, useAttrs } from 'vue'

  defineOptions({ name: 'SplitterPanel', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SplitterPanelSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    defaultSize,
    minSize = 0,
    maxSize = 100,
  } = defineProps<SplitterPanelProps>()

  const splitter = useSplitterRoot()

  const index = splitter.register({ minSize, maxSize }, defaultSize)

  onUnmounted(() => {
    splitter.unregister(index)
  })

  const size = toRef(() => splitter.sizes.value[index] ?? defaultSize)

  const slotProps = toRef((): SplitterPanelSlotProps => ({
    size: size.value,
    attrs: {
      'data-orientation': splitter.orientation.value,
      'data-panel-index': index,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    :style="{
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: `${size}%`,
      overflow: 'hidden',
    }"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Verify no lint/type errors**

Run: `pnpm typecheck`

**Step 3: Commit**

```
feat(Splitter): add SplitterPanel component
```

---

### Task 3: SplitterHandle — drag and keyboard resize

**Files:**
- Create: `packages/0/src/components/Splitter/SplitterHandle.vue`

**Step 1: Create SplitterHandle.vue**

The handle component:
- Registers with root to get its handle index (maps to panels: handle 0 sits between panel 0 and panel 1)
- Pointer handling: `pointerdown` → capture, RAF-batched `pointermove`, `pointerup` release
- Delta calculation: `(currentPos - startPos) / rootSize * 100` to get percent delta
- Keyboard: ArrowLeft/ArrowRight (horizontal) or ArrowUp/ArrowDown (vertical) ± step, Home/End for min/max
- ARIA: `role="separator"`, `tabindex="0"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`
- Data attributes: `data-state` (drag/hover/inactive), `data-orientation`, `data-disabled`

```vue
/**
 * @module SplitterHandle
 *
 * @remarks
 * Draggable resize handle between two splitter panels. Implements the
 * WAI-ARIA window splitter pattern with pointer drag and keyboard support.
 */

<script lang="ts">
  import { useSplitterRoot } from './SplitterRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SplitterHandleProps extends AtomProps {
    disabled?: boolean
  }

  export type SplitterHandleState = 'drag' | 'hover' | 'inactive'

  export interface SplitterHandleSlotProps {
    isDragging: boolean
    isDisabled: boolean
    state: SplitterHandleState
    attrs: {
      'role': 'separator'
      'tabindex': 0 | -1
      'aria-valuenow': number
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-orientation': string
      'aria-disabled': boolean | undefined
      'data-state': SplitterHandleState
      'data-orientation': string
      'data-disabled': true | undefined
      'onPointerdown': (e: PointerEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { shallowRef, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'SplitterHandle', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SplitterHandleSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    disabled = false,
  } = defineProps<SplitterHandleProps>()

  const KEYBOARD_STEP = 10

  const splitter = useSplitterRoot()
  const handleIndex = splitter.registerHandle()

  const hovering = shallowRef(false)
  const startPosition = shallowRef(0)
  let rafId = 0
  let latestPos = 0

  const isDisabled = toRef(() => disabled || toValue(splitter.disabled))
  const isHorizontal = toRef(() => splitter.orientation.value === 'horizontal')

  const state = toRef((): SplitterHandleState => {
    if (splitter.dragging.value) return 'drag'
    if (hovering.value) return 'hover'
    return 'inactive'
  })

  // aria-valuenow: size of the panel before this handle (0-100)
  const valuenow = toRef(() => splitter.sizes.value[handleIndex] ?? 0)
  const valuemin = toRef(() => 0)
  const valuemax = toRef(() => {
    const before = splitter.sizes.value[handleIndex] ?? 0
    const after = splitter.sizes.value[handleIndex + 1] ?? 0
    return before + after
  })

  function onPointerDown (e: PointerEvent) {
    if (isDisabled.value) return

    const target = e.target as Element
    target.setPointerCapture(e.pointerId)
    startPosition.value = isHorizontal.value ? e.clientX : e.clientY
    document.documentElement.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
    splitter.dragging.value = true
  }

  useToggleScope(() => splitter.dragging.value, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      latestPos = isHorizontal.value ? e.clientX : e.clientY
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const root = splitter.rootEl.value
        if (!root) return

        const rootSize = isHorizontal.value ? root.offsetWidth : root.offsetHeight
        const delta = ((latestPos - startPosition.value) / rootSize) * 100
        startPosition.value = latestPos

        splitter.resize(handleIndex, delta)
        rafId = 0
      })
    })

    useDocumentEventListener('pointerup', () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      document.documentElement.style.cursor = ''
      splitter.dragging.value = false
    })
  })

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value) return

    const forward = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
    const backward = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'

    if (e.key === forward) {
      e.preventDefault()
      splitter.resize(handleIndex, KEYBOARD_STEP)
    } else if (e.key === backward) {
      e.preventDefault()
      splitter.resize(handleIndex, -KEYBOARD_STEP)
    } else if (e.key === 'Home') {
      e.preventDefault()
      splitter.resize(handleIndex, -100)
    } else if (e.key === 'End') {
      e.preventDefault()
      splitter.resize(handleIndex, 100)
    }
  }

  const slotProps = toRef((): SplitterHandleSlotProps => ({
    isDragging: splitter.dragging.value,
    isDisabled: isDisabled.value,
    state: state.value,
    attrs: {
      'role': 'separator',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': valuenow.value,
      'aria-valuemin': valuemin.value,
      'aria-valuemax': valuemax.value,
      'aria-orientation': splitter.orientation.value,
      'aria-disabled': isDisabled.value || undefined,
      'data-state': state.value,
      'data-orientation': splitter.orientation.value,
      'data-disabled': isDisabled.value || undefined,
      'onPointerdown': onPointerDown,
      'onPointerenter': () => { hovering.value = true },
      'onPointerleave': () => { hovering.value = false },
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Verify no lint/type errors**

Run: `pnpm typecheck`

**Step 3: Commit**

```
feat(Splitter): add SplitterHandle with drag and keyboard support
```

---

### Task 4: Barrel exports

**Files:**
- Create: `packages/0/src/components/Splitter/index.ts`
- Modify: `packages/0/src/components/index.ts`

**Step 1: Create barrel export**

Follow the Tabs pattern exactly. Named exports for individual components + types, compound object for `Splitter.Root` / `Splitter.Panel` / `Splitter.Handle`.

```ts
export { provideSplitterRoot, useSplitterRoot } from './SplitterRoot.vue'
export { default as SplitterRoot } from './SplitterRoot.vue'
export { default as SplitterPanel } from './SplitterPanel.vue'
export { default as SplitterHandle } from './SplitterHandle.vue'

export type { SplitterContext, SplitterOrientation, SplitterRootProps, SplitterRootSlotProps } from './SplitterRoot.vue'
export type { SplitterPanelProps, SplitterPanelSlotProps } from './SplitterPanel.vue'
export type { SplitterHandleProps, SplitterHandleSlotProps, SplitterHandleState } from './SplitterHandle.vue'

// Components
import Handle from './SplitterHandle.vue'
import Panel from './SplitterPanel.vue'
import Root from './SplitterRoot.vue'

/**
 * Splitter component with sub-components for building resizable panel layouts.
 *
 * @see https://0.vuetifyjs.com/components/splitter
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Splitter } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Splitter.Root orientation="horizontal">
 *     <Splitter.Panel :default-size="60" :min-size="20">
 *       Left content
 *     </Splitter.Panel>
 *
 *     <Splitter.Handle />
 *
 *     <Splitter.Panel :default-size="40" :min-size="20">
 *       Right content
 *     </Splitter.Panel>
 *   </Splitter.Root>
 * </template>
 * ```
 */
export const Splitter = {
  /**
   * Root component that provides splitter context and flex layout.
   *
   * @see https://0.vuetifyjs.com/components/splitter
   */
  Root,
  /**
   * Resizable panel within a splitter layout.
   *
   * @see https://0.vuetifyjs.com/components/splitter#splitterpanel
   */
  Panel,
  /**
   * Draggable resize handle between two panels.
   *
   * @see https://0.vuetifyjs.com/components/splitter#splitterhandle
   */
  Handle,
}
```

**Step 2: Add Splitter to components barrel**

In `packages/0/src/components/index.ts`, add `export * from './Splitter'` in alphabetical order (after `Selection`).

**Step 3: Verify**

Run: `pnpm typecheck`

**Step 4: Commit**

```
feat(Splitter): add barrel exports
```

---

### Task 5: Validate — lint, typecheck, tests

**Step 1: Run full validation**

Run: `pnpm validate`

All lint, typecheck, and existing tests must pass. The Splitter has no tests yet (tests not requested).

**Step 2: Fix any issues found**

Address lint or type errors if any.

**Step 3: Commit fixes if needed**

```
fix(Splitter): address lint/type issues
```

---

### Task 6: Playground smoke test

**Files:**
- Modify: playground component (exact file TBD — check playground structure)

**Step 1: Add a minimal splitter example to the playground**

Create a simple horizontal splitter with two panels to visually verify drag behavior works.

**Step 2: Run `pnpm dev` and test in browser**

Verify:
- [ ] Two panels render side by side
- [ ] Handle is visible and draggable
- [ ] Dragging resizes panels proportionally
- [ ] Min/max constraints are respected
- [ ] Arrow keys resize in correct direction
- [ ] Home/End go to min/max
- [ ] Cursor shows col-resize during drag

**Step 3: Remove playground test code or keep as example**

**Step 4: Commit if keeping**

```
chore: add splitter playground example
```
