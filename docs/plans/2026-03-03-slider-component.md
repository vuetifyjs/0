# Slider Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a headless Slider component with single and range mode, full keyboard/pointer interaction, and ARIA compliance.

**Architecture:** Standalone `createSlider` composable for value math + compound component (Root, Track, Range, Thumb, HiddenInput). No registry/selection dependency — slider manages a plain `number[]` directly.

**Tech Stack:** Vue 3 composition API, TypeScript, Vitest + happy-dom, `#v0/` path alias

**Design doc:** `docs/plans/2026-03-03-slider-component-design.md`

---

## Team Assignments

| Role | Tasks | Notes |
|------|-------|-------|
| **dev** | Tasks 1–7 | Sequential — composable first, then components |
| **qa** | Task 8 | After Task 7 — integration tests, typecheck, lint |
| **docs** | Task 9 | After Task 7 — doc page + playground |

---

## Task 1: createSlider composable — tests

**Files:**
- Create: `packages/0/src/composables/createSlider/index.test.ts`

**Step 1: Write failing tests for value math**

```ts
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { createSlider } from './index'

describe('createSlider', () => {
  describe('snap', () => {
    it('rounds to nearest step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10 })
      expect(slider.snap(13)).toBe(10)
      expect(slider.snap(17)).toBe(20)
      expect(slider.snap(15)).toBe(20) // round half up
    })

    it('handles decimal steps', () => {
      const slider = createSlider({ min: 0, max: 1, step: 0.1 })
      expect(slider.snap(0.34)).toBeCloseTo(0.3)
      expect(slider.snap(0.36)).toBeCloseTo(0.4)
    })

    it('clamps to min/max', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1 })
      expect(slider.snap(-10)).toBe(0)
      expect(slider.snap(110)).toBe(100)
    })
  })

  describe('percent', () => {
    it('converts value to percentage', () => {
      const slider = createSlider({ min: 0, max: 100 })
      expect(slider.percent(0)).toBe(0)
      expect(slider.percent(50)).toBe(50)
      expect(slider.percent(100)).toBe(100)
    })

    it('handles custom min/max', () => {
      const slider = createSlider({ min: 20, max: 80 })
      expect(slider.percent(20)).toBe(0)
      expect(slider.percent(50)).toBe(50)
      expect(slider.percent(80)).toBe(100)
    })
  })

  describe('fromPercent', () => {
    it('converts percentage to snapped value', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10 })
      expect(slider.fromPercent(0)).toBe(0)
      expect(slider.fromPercent(50)).toBe(50)
      expect(slider.fromPercent(33)).toBe(30)
    })
  })

  describe('setValue', () => {
    it('sets value at index', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1 })
      slider.values.value = [50]
      slider.setValue(0, 75)
      expect(slider.values.value).toEqual([75])
    })

    it('clamps value to min/max', () => {
      const slider = createSlider({ min: 0, max: 100 })
      slider.values.value = [50]
      slider.setValue(0, 150)
      expect(slider.values.value).toEqual([100])
    })

    it('enforces minStepsBetweenThumbs', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      slider.values.value = [30, 70]
      slider.setValue(0, 65) // would be too close to thumb 1 at 70
      expect(slider.values.value[0]).toBe(60) // clamped to 70 - 10
    })

    it('snaps to step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 5 })
      slider.values.value = [50]
      slider.setValue(0, 53)
      expect(slider.values.value).toEqual([55])
    })
  })

  describe('stepUp / stepDown', () => {
    it('increments by one step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 5 })
      slider.values.value = [50]
      slider.stepUp(0)
      expect(slider.values.value).toEqual([55])
    })

    it('decrements by one step', () => {
      const slider = createSlider({ min: 0, max: 100, step: 5 })
      slider.values.value = [50]
      slider.stepDown(0)
      expect(slider.values.value).toEqual([45])
    })

    it('supports multiplier', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1 })
      slider.values.value = [50]
      slider.stepUp(0, 10)
      expect(slider.values.value).toEqual([60])
    })

    it('clamps at boundaries', () => {
      const slider = createSlider({ min: 0, max: 100, step: 10 })
      slider.values.value = [100]
      slider.stepUp(0)
      expect(slider.values.value).toEqual([100])
    })
  })

  describe('setToMin / setToMax', () => {
    it('sets to min', () => {
      const slider = createSlider({ min: 10, max: 90 })
      slider.values.value = [50]
      slider.setToMin(0)
      expect(slider.values.value).toEqual([10])
    })

    it('sets to max', () => {
      const slider = createSlider({ min: 10, max: 90 })
      slider.values.value = [50]
      slider.setToMax(0)
      expect(slider.values.value).toEqual([90])
    })
  })

  describe('defaults', () => {
    it('uses min=0, max=100, step=1', () => {
      const slider = createSlider()
      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.step).toBe(1)
    })
  })

  describe('inverted', () => {
    it('flips percent calculation', () => {
      const slider = createSlider({ min: 0, max: 100, inverted: true })
      expect(slider.percent(25)).toBe(75)
      expect(slider.percent(0)).toBe(100)
      expect(slider.percent(100)).toBe(0)
    })

    it('flips fromPercent', () => {
      const slider = createSlider({ min: 0, max: 100, step: 1, inverted: true })
      expect(slider.fromPercent(75)).toBe(25)
    })
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run packages/0/src/composables/createSlider/index.test.ts`
Expected: FAIL — module `./index` not found

---

## Task 2: createSlider composable — implementation

**Files:**
- Create: `packages/0/src/composables/createSlider/index.ts`
- Modify: `packages/0/src/composables/index.ts`

**Step 1: Implement createSlider**

```ts
/**
 * @module createSlider
 *
 * @remarks
 * Composable for managing slider state: value math, step snapping,
 * percentage conversion, and multi-thumb value operations.
 *
 * Designed for single-thumb, range, and multi-thumb sliders.
 * Also reusable for color picker tracks, media scrubbers,
 * gradient editors, and other 1D value-on-track controls.
 */

// Utilities
import { clamp } from '#v0/utilities'
import { ref, toRef, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface SliderOptions {
  /** Minimum value (default: 0) */
  min?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Step increment (default: 1) */
  step?: number
  /** Whether the slider is disabled */
  disabled?: MaybeRefOrGetter<boolean>
  /** Slider orientation */
  orientation?: MaybeRefOrGetter<'horizontal' | 'vertical'>
  /** Flip the percent axis */
  inverted?: MaybeRefOrGetter<boolean>
  /** Minimum steps required between adjacent thumbs (default: 0) */
  minStepsBetweenThumbs?: number
}

export interface SliderContext {
  /** All thumb values */
  values: Ref<number[]>
  /** Minimum value */
  readonly min: number
  /** Maximum value */
  readonly max: number
  /** Step increment */
  readonly step: number
  /** Minimum steps between thumbs */
  readonly minStepsBetweenThumbs: number
  /** Whether disabled */
  disabled: Ref<boolean>
  /** Orientation */
  orientation: Ref<'horizontal' | 'vertical'>
  /** Whether inverted */
  inverted: Ref<boolean>
  /** Round value to nearest step, clamped to min/max */
  snap: (value: number) => number
  /** Convert value to 0–100 percentage (respects inverted) */
  percent: (value: number) => number
  /** Convert 0–100 percentage to snapped value (respects inverted) */
  fromPercent: (percent: number) => number
  /** Set value at thumb index with constraints */
  setValue: (index: number, value: number) => void
  /** Increment thumb value by step × multiplier */
  stepUp: (index: number, multiplier?: number) => void
  /** Decrement thumb value by step × multiplier */
  stepDown: (index: number, multiplier?: number) => void
  /** Set thumb to minimum value */
  setToMin: (index: number) => void
  /** Set thumb to maximum value */
  setToMax: (index: number) => void
}

/**
 * Creates slider state with value math, step snapping, and multi-thumb support.
 *
 * @param options Slider configuration.
 * @returns Slider context with values, math functions, and thumb operations.
 *
 * @example
 * ```ts
 * const slider = createSlider({ min: 0, max: 100, step: 5 })
 * slider.values.value = [50]
 * slider.stepUp(0)     // [55]
 * slider.percent(50)   // 50
 * ```
 */
export function createSlider (options: SliderOptions = {}): SliderContext {
  const {
    min = 0,
    max = 100,
    step = 1,
    disabled: disabledProp = false,
    orientation: orientationProp = 'horizontal',
    inverted: invertedProp = false,
    minStepsBetweenThumbs = 0,
  } = options

  const values = ref<number[]>([])
  const disabled = toRef(() => toValue(disabledProp))
  const orientation = toRef(() => toValue(orientationProp))
  const inverted = toRef(() => toValue(invertedProp))

  const range = max - min

  function snap (value: number): number {
    const clamped = clamp(value, min, max)
    const steps = Math.round((clamped - min) / step)
    return clamp(min + steps * step, min, max)
  }

  function percent (value: number): number {
    if (range === 0) return 0
    const p = ((value - min) / range) * 100
    return inverted.value ? 100 - p : p
  }

  function fromPercent (p: number): number {
    const adjusted = inverted.value ? 100 - p : p
    return snap(min + (adjusted / 100) * range)
  }

  function setValue (index: number, value: number): void {
    const snapped = snap(value)
    const next = [...values.value]

    // Enforce minimum distance between adjacent thumbs
    const gap = minStepsBetweenThumbs * step
    let constrained = snapped

    if (index > 0 && next[index - 1] !== undefined) {
      constrained = Math.max(constrained, next[index - 1] + gap)
    }
    if (index < next.length - 1 && next[index + 1] !== undefined) {
      constrained = Math.min(constrained, next[index + 1] - gap)
    }

    constrained = clamp(constrained, min, max)
    next[index] = constrained
    values.value = next
  }

  function stepUp (index: number, multiplier = 1): void {
    setValue(index, values.value[index] + step * multiplier)
  }

  function stepDown (index: number, multiplier = 1): void {
    setValue(index, values.value[index] - step * multiplier)
  }

  function setToMin (index: number): void {
    setValue(index, min)
  }

  function setToMax (index: number): void {
    setValue(index, max)
  }

  return {
    values,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    disabled,
    orientation,
    inverted,
    snap,
    percent,
    fromPercent,
    setValue,
    stepUp,
    stepDown,
    setToMin,
    setToMax,
  }
}
```

**Step 2: Register in composables barrel**

Add to `packages/0/src/composables/index.ts`:

```ts
export * from './createSlider'
```

**Step 3: Run tests to verify they pass**

Run: `pnpm vitest run packages/0/src/composables/createSlider/index.test.ts`
Expected: ALL PASS

**Step 4: Commit**

```bash
git add packages/0/src/composables/createSlider/index.ts packages/0/src/composables/createSlider/index.test.ts packages/0/src/composables/index.ts
git commit -m "feat(createSlider): add slider composable with value math and multi-thumb support"
```

---

## Task 3: SliderRoot component

**Files:**
- Create: `packages/0/src/components/Slider/SliderRoot.vue`

**Reference:** Follow `CheckboxRoot.vue` pattern — script block for types/context export, script setup for logic.

**Step 1: Create SliderRoot**

```vue
/**
 * @module SliderRoot
 *
 * @remarks
 * Root component for sliders. Creates slider context, provides it to
 * child components (Track, Range, Thumb, HiddenInput), and bridges v-model.
 *
 * Value is always `number[]`: single thumb = `[50]`, range = `[25, 75]`.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SliderContext } from '#v0/composables/createSlider'
  import type { MaybeRef, Ref } from 'vue'

  export interface SliderRootContext extends SliderContext {
    /** Unique identifier */
    readonly id: string
    /** Form field name */
    readonly name?: string
    /** Form association */
    readonly form?: string
    /** Register a thumb, returns its index */
    registerThumb: () => number
    /** Unregister a thumb by index */
    unregisterThumb: (index: number) => void
    /** Track which thumb is currently being dragged */
    dragging: Ref<number | null>
  }

  export interface SliderRootProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Minimum value (default: 0) */
    min?: number
    /** Maximum value (default: 100) */
    max?: number
    /** Step increment (default: 1) */
    step?: number
    /** Disables the slider */
    disabled?: MaybeRef<boolean>
    /** Slider orientation */
    orientation?: 'horizontal' | 'vertical'
    /** Flip the percent axis */
    inverted?: boolean
    /** Minimum steps between adjacent thumbs (default: 0) */
    minStepsBetweenThumbs?: number
    /** Form field name — triggers hidden inputs */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Namespace for context provision */
    namespace?: string
  }

  export interface SliderRootSlotProps {
    /** Unique identifier */
    id: string
    /** All current values */
    values: number[]
    /** Minimum value */
    min: number
    /** Maximum value */
    max: number
    /** Whether the slider is disabled */
    isDisabled: boolean
    /** Slider orientation */
    orientation: 'horizontal' | 'vertical'
    /** Pre-computed attributes for binding */
    attrs: {
      'data-disabled': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
    }
  }

  export const [useSliderRoot, provideSliderRoot] = createContext<SliderRootContext>()
</script>

<script setup lang="ts">
  // Composables
  import { createSlider } from '#v0/composables/createSlider'

  // Components
  import SliderHiddenInput from './SliderHiddenInput.vue'

  // Utilities
  import { shallowRef, toRef, toValue, useAttrs, useId, watch } from 'vue'

  defineOptions({ name: 'SliderRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SliderRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: number[]]
    'valueCommit': [value: number[]]
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = 'horizontal',
    inverted = false,
    minStepsBetweenThumbs = 0,
    name,
    form,
    namespace = 'v0:slider:root',
  } = defineProps<SliderRootProps>()

  const model = defineModel<number[]>({ default: () => [] })

  const slider = createSlider({
    min,
    max,
    step,
    disabled,
    orientation,
    inverted,
    minStepsBetweenThumbs,
  })

  // Sync model → slider values
  watch(model, v => {
    slider.values.value = [...v]
  }, { immediate: true })

  // Sync slider values → model
  watch(slider.values, v => {
    model.value = [...v]
  })

  // Thumb registration
  let thumbCount = 0
  function registerThumb (): number {
    return thumbCount++
  }
  function unregisterThumb (_index: number): void {
    // Thumbs are indexed by mount order; no reindexing needed
  }

  const dragging = shallowRef<number | null>(null)

  const context: SliderRootContext = {
    ...slider,
    id,
    name,
    form,
    registerThumb,
    unregisterThumb,
    dragging,
  }

  provideSliderRoot(namespace, context)

  const isDisabled = toRef(() => toValue(disabled))

  const slotProps = toRef((): SliderRootSlotProps => ({
    id,
    values: slider.values.value,
    min,
    max,
    isDisabled: isDisabled.value,
    orientation: toValue(slider.orientation),
    attrs: {
      'data-disabled': isDisabled.value ? true : undefined,
      'data-orientation': toValue(slider.orientation),
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

  <template v-if="name">
    <SliderHiddenInput
      v-for="(_, index) in slider.values.value"
      :key="index"
      :index="index"
    />
  </template>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Slider/SliderRoot.vue
git commit -m "feat(Slider): add SliderRoot component with context provision"
```

---

## Task 4: SliderTrack component

**Files:**
- Create: `packages/0/src/components/Slider/SliderTrack.vue`

**Step 1: Create SliderTrack**

The track handles click-to-position. On pointerdown, it calculates the value from pointer position relative to track bounds, finds the nearest thumb, snaps it, and begins a drag.

```vue
/**
 * @module SliderTrack
 *
 * @remarks
 * Track element for sliders. Handles click-to-position interaction:
 * on pointerdown, calculates value from pointer position, snaps nearest
 * thumb to that value, and initiates drag.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSliderRoot } from './SliderRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SliderTrackProps extends AtomProps {
    /** Namespace for connecting to parent Slider.Root */
    namespace?: string
  }

  export interface SliderTrackSlotProps {
    /** Pre-computed attributes */
    attrs: {
      'data-disabled': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { IN_BROWSER } from '#v0/constants/globals'
  import { useEventListener } from '#v0/composables/useEventListener'
  import { toRef, toValue, useTemplateRef } from 'vue'

  defineOptions({ name: 'SliderTrack', inheritAttrs: false })

  defineSlots<{
    default: (props: SliderTrackSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:slider:root',
  } = defineProps<SliderTrackProps>()

  const root = useSliderRoot(namespace)
  const trackRef = useTemplateRef<HTMLElement>('track')

  function getPercent (e: PointerEvent): number {
    const el = trackRef.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const isVertical = toValue(root.orientation) === 'vertical'

    if (isVertical) {
      // Bottom = 0%, Top = 100%
      return ((rect.bottom - e.clientY) / rect.height) * 100
    }
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  function nearest (value: number): number {
    let closest = 0
    let distance = Infinity
    for (let i = 0; i < root.values.value.length; i++) {
      const d = Math.abs(root.values.value[i] - value)
      if (d < distance) {
        distance = d
        closest = i
      }
    }
    return closest
  }

  function onPointerDown (e: PointerEvent) {
    if (toValue(root.disabled)) return
    if (e.button !== 0) return
    e.preventDefault()

    const percent = getPercent(e)
    const value = root.fromPercent(percent)
    const index = nearest(value)

    root.setValue(index, value)
    root.dragging.value = index

    if (IN_BROWSER) {
      function onPointerMove (e: PointerEvent) {
        const percent = getPercent(e)
        root.setValue(root.dragging.value!, root.fromPercent(percent))
      }

      function onPointerUp () {
        root.dragging.value = null
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerup', onPointerUp)
      }

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }
  }

  const slotProps = toRef((): SliderTrackSlotProps => ({
    attrs: {
      'data-disabled': toValue(root.disabled) ? true : undefined,
      'data-orientation': toValue(root.orientation),
    },
  }))
</script>

<template>
  <Atom
    ref="track"
    v-bind="slotProps.attrs"
    :as
    :renderless
    @pointerdown="onPointerDown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Slider/SliderTrack.vue
git commit -m "feat(Slider): add SliderTrack with click-to-position and drag"
```

---

## Task 5: SliderRange component

**Files:**
- Create: `packages/0/src/components/Slider/SliderRange.vue`

**Step 1: Create SliderRange**

The filled region between min and the thumb (single), or between two thumbs (range). Positioned via CSS custom properties.

```vue
/**
 * @module SliderRange
 *
 * @remarks
 * Filled region of the slider track. For single thumb, spans from
 * track start to thumb position. For range (two thumbs), spans
 * between the two thumb positions.
 *
 * Exposes `start` and `end` percentages as slot props and CSS custom
 * properties `--v0-slider-range-start` and `--v0-slider-range-size`
 * for positioning.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSliderRoot } from './SliderRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SliderRangeProps extends AtomProps {
    /** Namespace for connecting to parent Slider.Root */
    namespace?: string
  }

  export interface SliderRangeSlotProps {
    /** Start percentage (0–100) */
    start: number
    /** End percentage (0–100) */
    end: number
    /** Pre-computed attributes and style */
    attrs: {
      'data-disabled': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SliderRange', inheritAttrs: false })

  defineSlots<{
    default: (props: SliderRangeSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:slider:root',
  } = defineProps<SliderRangeProps>()

  const root = useSliderRoot(namespace)

  const start = toRef(() => {
    const values = root.values.value
    if (values.length === 0) return 0
    if (values.length === 1) return 0
    return root.percent(Math.min(...values))
  })

  const end = toRef(() => {
    const values = root.values.value
    if (values.length === 0) return 0
    if (values.length === 1) return root.percent(values[0])
    return root.percent(Math.max(...values))
  })

  const isVertical = toRef(() => toValue(root.orientation) === 'vertical')

  const slotProps = toRef((): SliderRangeSlotProps => ({
    start: start.value,
    end: end.value,
    attrs: {
      'data-disabled': toValue(root.disabled) ? true : undefined,
      'data-orientation': toValue(root.orientation),
      'style': {
        [isVertical.value ? 'bottom' : 'left']: `${start.value}%`,
        [isVertical.value ? 'height' : 'width']: `${end.value - start.value}%`,
        '--v0-slider-range-start': `${start.value}%`,
        '--v0-slider-range-size': `${end.value - start.value}%`,
      },
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
git add packages/0/src/components/Slider/SliderRange.vue
git commit -m "feat(Slider): add SliderRange with CSS custom property positioning"
```

---

## Task 6: SliderThumb component

**Files:**
- Create: `packages/0/src/components/Slider/SliderThumb.vue`

**Step 1: Create SliderThumb**

Draggable handle with keyboard navigation and full ARIA. Auto-indexes by registering with Root on mount.

```vue
/**
 * @module SliderThumb
 *
 * @remarks
 * Draggable thumb control for sliders. Auto-registers with parent
 * Slider.Root to get its index. Handles pointer drag and keyboard
 * navigation. Provides full ARIA slider attributes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSliderRoot } from './SliderRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type SliderThumbState = 'dragging' | 'idle'

  export interface SliderThumbProps extends AtomProps {
    /** Namespace for connecting to parent Slider.Root */
    namespace?: string
    /** Accessible label for this thumb */
    ariaLabel?: string
    /** ID of element labelling this thumb */
    ariaLabelledby?: string
    /** Custom aria-valuetext (for formatted display) */
    ariaValuetext?: string
  }

  export interface SliderThumbSlotProps {
    /** Thumb index in parent slider */
    index: number
    /** Current value of this thumb */
    value: number
    /** Current value as percentage (0–100) */
    percent: number
    /** Whether this thumb is being dragged */
    isDragging: boolean
    /** Pre-computed ARIA and data attributes */
    attrs: {
      'role': 'slider'
      'tabindex': 0 | -1
      'aria-valuenow': number
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-valuetext': string | undefined
      'aria-orientation': 'horizontal' | 'vertical'
      'aria-disabled': true | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'data-state': SliderThumbState
      'data-disabled': true | undefined
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { IN_BROWSER } from '#v0/constants/globals'
  import { onUnmounted, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'SliderThumb', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SliderThumbSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:slider:root',
    ariaLabel,
    ariaLabelledby,
    ariaValuetext,
  } = defineProps<SliderThumbProps>()

  const root = useSliderRoot(namespace)

  const index = root.registerThumb()

  onUnmounted(() => {
    root.unregisterThumb(index)
  })

  const value = toRef(() => root.values.value[index] ?? root.min)
  const pct = toRef(() => root.percent(value.value))
  const isDragging = toRef(() => root.dragging.value === index)
  const isDisabled = toRef(() => toValue(root.disabled))
  const isVertical = toRef(() => toValue(root.orientation) === 'vertical')

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value) return

    const isInverted = toValue(root.inverted)

    const actions: Record<string, () => void> = {
      ArrowRight: () => isInverted ? root.stepDown(index) : root.stepUp(index),
      ArrowUp: () => root.stepUp(index),
      ArrowLeft: () => isInverted ? root.stepUp(index) : root.stepDown(index),
      ArrowDown: () => root.stepDown(index),
      PageUp: () => root.stepUp(index, 10),
      PageDown: () => root.stepDown(index, 10),
      Home: () => root.setToMin(index),
      End: () => root.setToMax(index),
    }

    // Shift + Arrow = 10x step
    if (e.shiftKey && e.key.startsWith('Arrow')) {
      e.preventDefault()
      const base = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 'stepUp' : 'stepDown'
      const method = (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && isInverted
        ? (base === 'stepUp' ? 'stepDown' : 'stepUp')
        : base
      root[method](index, 10)
      return
    }

    const action = actions[e.key]
    if (!action) return

    e.preventDefault()
    action()
  }

  const dataState = toRef((): SliderThumbState =>
    isDragging.value ? 'dragging' : 'idle',
  )

  const slotProps = toRef((): SliderThumbSlotProps => ({
    index,
    value: value.value,
    percent: pct.value,
    isDragging: isDragging.value,
    attrs: {
      'role': 'slider',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': value.value,
      'aria-valuemin': root.min,
      'aria-valuemax': root.max,
      'aria-valuetext': ariaValuetext || undefined,
      'aria-orientation': toValue(root.orientation),
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-label': ariaLabel || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
      'style': {
        [isVertical.value ? 'bottom' : 'left']: `${pct.value}%`,
        '--v0-slider-thumb-percent': `${pct.value}%`,
      },
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Commit**

```bash
git add packages/0/src/components/Slider/SliderThumb.vue
git commit -m "feat(Slider): add SliderThumb with keyboard nav and ARIA"
```

---

## Task 7: SliderHiddenInput + barrel exports

**Files:**
- Create: `packages/0/src/components/Slider/SliderHiddenInput.vue`
- Create: `packages/0/src/components/Slider/index.ts`
- Modify: `packages/0/src/components/index.ts`

**Step 1: Create SliderHiddenInput**

Follow `CheckboxHiddenInput.vue` pattern.

```vue
/**
 * @module SliderHiddenInput
 *
 * @remarks
 * Hidden native input for form submission. Renders one input per
 * thumb value. Auto-rendered by Root when `name` prop is provided.
 */

<script lang="ts">
  export interface SliderHiddenInputProps {
    /** Namespace for context injection from parent Slider.Root */
    namespace?: string
    /** Thumb index to read value from */
    index?: number
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
  import { useSliderRoot } from './SliderRoot.vue'
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SliderHiddenInput' })

  const {
    namespace = 'v0:slider:root',
    index = 0,
  } = defineProps<SliderHiddenInputProps>()

  const root = useSliderRoot(namespace)

  const value = toRef(() => root.values.value[index] ?? root.min)
  const isDisabled = toRef(() => toValue(root.disabled))
</script>

<template>
  <input
    :disabled="isDisabled"
    :form="root.form"
    inert
    :name="root.name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="hidden"
    :value="value"
  >
</template>
```

**Step 2: Create barrel exports**

Create `packages/0/src/components/Slider/index.ts`:

```ts
export { default as SliderHiddenInput } from './SliderHiddenInput.vue'

export { default as SliderRange } from './SliderRange.vue'

export { default as SliderRoot } from './SliderRoot.vue'
export { provideSliderRoot, useSliderRoot } from './SliderRoot.vue'

export { default as SliderThumb } from './SliderThumb.vue'

export { default as SliderTrack } from './SliderTrack.vue'

export type { SliderHiddenInputProps } from './SliderHiddenInput.vue'
export type { SliderRangeProps, SliderRangeSlotProps } from './SliderRange.vue'
export type { SliderRootContext, SliderRootProps, SliderRootSlotProps } from './SliderRoot.vue'
export type { SliderThumbProps, SliderThumbSlotProps, SliderThumbState } from './SliderThumb.vue'
export type { SliderTrackProps, SliderTrackSlotProps } from './SliderTrack.vue'

// Components
import HiddenInput from './SliderHiddenInput.vue'
import Range from './SliderRange.vue'
import Root from './SliderRoot.vue'
import Thumb from './SliderThumb.vue'
import Track from './SliderTrack.vue'

/**
 * Slider component with sub-components for range input controls.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Slider } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const value = ref([50])
 * </script>
 *
 * <template>
 *   <Slider.Root v-model="value" :min="0" :max="100">
 *     <Slider.Track>
 *       <Slider.Range />
 *     </Slider.Track>
 *     <Slider.Thumb />
 *   </Slider.Root>
 * </template>
 * ```
 */
export const Slider = {
  Root,
  Track,
  Range,
  Thumb,
  HiddenInput,
}
```

**Step 3: Add to components barrel**

Add to `packages/0/src/components/index.ts`:

```ts
export * from './Slider'
```

**Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: No new errors

**Step 5: Commit**

```bash
git add packages/0/src/components/Slider/ packages/0/src/components/index.ts
git commit -m "feat(Slider): add HiddenInput, barrel exports, register component"
```

---

## Task 8: Integration tests (QA)

**Files:**
- Create: `packages/0/src/components/Slider/index.test.ts`

**Step 1: Write integration tests**

Follow `Checkbox/index.test.ts` pattern — mount helpers, slot prop capture, state/ARIA/keyboard assertions.

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

import { Slider } from './index'

// ============================================================================
// Test Helpers
// ============================================================================

interface MountResult {
  wrapper: ReturnType<typeof mount>
  thumbProps: () => any
  wait: () => Promise<void>
}

function mountSlider (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<number[]>>
  thumbCount?: number
} = {}): MountResult {
  const thumbCount = options.thumbCount ?? 1
  let capturedThumbProps: any

  const wrapper = mount(Slider.Root, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as number[]
        },
      }),
      ...options.props,
    },
    slots: {
      default: (rootProps: any) => {
        const children = [
          h(Slider.Track as any, {}, () => h(Slider.Range as any)),
        ]
        for (let i = 0; i < thumbCount; i++) {
          children.push(
            h(Slider.Thumb as any, {}, (props: any) => {
              capturedThumbProps = props
              return h('span', `thumb-${i}`)
            }),
          )
        }
        return children
      },
    },
  })

  return {
    wrapper,
    thumbProps: () => capturedThumbProps,
    wait: () => nextTick(),
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('Slider', () => {
  describe('rendering', () => {
    it('renders root with data attributes', () => {
      const model = ref([50])
      const { wrapper } = mountSlider({ model })
      expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    })

    it('renders disabled state', () => {
      const model = ref([50])
      const { wrapper } = mountSlider({ model, props: { disabled: true } })
      expect(wrapper.attributes('data-disabled')).toBe('true')
    })
  })

  describe('v-model', () => {
    it('syncs model value', async () => {
      const model = ref([50])
      const { wait } = mountSlider({ model })
      await wait()
      expect(model.value).toEqual([50])
    })
  })

  describe('thumb ARIA', () => {
    it('has correct ARIA attributes', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { min: 0, max: 100 },
      })
      await wait()
      const attrs = thumbProps()?.attrs
      expect(attrs?.role).toBe('slider')
      expect(attrs?.['aria-valuenow']).toBe(50)
      expect(attrs?.['aria-valuemin']).toBe(0)
      expect(attrs?.['aria-valuemax']).toBe(100)
      expect(attrs?.tabindex).toBe(0)
    })

    it('sets tabindex -1 when disabled', async () => {
      const model = ref([50])
      const { thumbProps, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      expect(thumbProps()?.attrs?.tabindex).toBe(-1)
    })
  })

  describe('keyboard navigation', () => {
    it('increments on ArrowRight', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 5 },
      })
      await wait()
      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([55])
    })

    it('decrements on ArrowLeft', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 5 },
      })
      await wait()
      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'ArrowLeft' })
      await wait()
      expect(model.value).toEqual([45])
    })

    it('goes to min on Home', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()
      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'Home' })
      await wait()
      expect(model.value).toEqual([0])
    })

    it('goes to max on End', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({ model })
      await wait()
      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'End' })
      await wait()
      expect(model.value).toEqual([100])
    })

    it('jumps 10x on PageUp', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { step: 1 },
      })
      await wait()
      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'PageUp' })
      await wait()
      expect(model.value).toEqual([60])
    })

    it('does not respond when disabled', async () => {
      const model = ref([50])
      const { wrapper, wait } = mountSlider({
        model,
        props: { disabled: true },
      })
      await wait()
      const thumb = wrapper.find('[role="slider"]')
      await thumb.trigger('keydown', { key: 'ArrowRight' })
      await wait()
      expect(model.value).toEqual([50])
    })
  })

  describe('range mode', () => {
    it('renders two thumbs', async () => {
      const model = ref([25, 75])
      const { wrapper, wait } = mountSlider({
        model,
        thumbCount: 2,
      })
      await wait()
      const thumbs = wrapper.findAll('[role="slider"]')
      expect(thumbs).toHaveLength(2)
    })
  })

  describe('orientation', () => {
    it('sets vertical data attribute', () => {
      const model = ref([50])
      const { wrapper } = mountSlider({
        model,
        props: { orientation: 'vertical' },
      })
      expect(wrapper.attributes('data-orientation')).toBe('vertical')
    })
  })
})
```

**Step 2: Run tests**

Run: `pnpm vitest run packages/0/src/components/Slider/index.test.ts`
Expected: ALL PASS

**Step 3: Run full quality checks**

Run: `pnpm lint:fix && pnpm typecheck && pnpm test:run`
Expected: No new failures

**Step 4: Commit**

```bash
git add packages/0/src/components/Slider/index.test.ts
git commit -m "test(Slider): add integration tests for rendering, keyboard, ARIA, range"
```

---

## Task 9: Documentation page (docs)

**Files:**
- Create: `apps/docs/composables/create-slider.md`
- Create: `apps/docs/components/slider.md`

**Step 1: Check existing doc patterns**

Read an existing composable doc page and component doc page from `apps/docs/` for format conventions.

**Step 2: Write composable doc page**

Document `createSlider` with:
- Overview, import, basic usage
- Options table
- Returned context API
- Use cases (slider, range, color picker, scrubber)

**Step 3: Write component doc page**

Document Slider compound component with:
- Overview, import
- Single and range examples with code fences
- Props tables for each sub-component
- Keyboard interaction table
- ARIA reference
- Slot props reference

**Step 4: Add nav entries**

Register both pages in the docs navigation config.

**Step 5: Verify docs build**

Run: `pnpm build:apps`
Expected: No errors

**Step 6: Commit**

```bash
git add apps/docs/
git commit -m "docs(Slider): add composable and component documentation pages"
```

---

## Verification Checklist

After all tasks complete:

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint:fix` has no errors
- [ ] `pnpm test:run` all pass (composable + component tests)
- [ ] `pnpm build:0` builds successfully
- [ ] `pnpm dev` — slider renders in playground
- [ ] Single thumb: keyboard nav works (arrows, Home/End, PageUp/Down)
- [ ] Range: two thumbs move independently, min distance enforced
- [ ] Disabled state: no interaction
- [ ] Vertical orientation: correct axis
- [ ] Hidden inputs render when `name` prop set
- [ ] Screen reader announces slider role and values
