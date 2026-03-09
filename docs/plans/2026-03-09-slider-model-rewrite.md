# createSlider Model Rewrite — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `createSlider` to use `createModel` as its proper baseline — each thumb becomes a model ticket with a `ref(number)` value, eliminating the standalone `values` ref.

**Architecture:** `createSlider` calls `createModel()` (enroll defaults true). Each `SliderThumb` self-registers via `model.register()`, receiving a ticket whose value is a `shallowRef<number>`. A `values` computed derives the ordered array from `selectedItems`. The `apply` bridge snaps/constrains incoming values and writes to ticket refs. A pending-values pattern handles the timing gap where `useProxyModel` fires before thumbs mount.

**Tech Stack:** Vue 3 (ref, computed, shallowRef, shallowReactive, toValue), `createModel` from `#v0/composables/createModel`, `clamp` from `#v0/utilities`

**Design doc:** `docs/plans/2026-03-09-slider-model-rewrite-design.md`

---

## Task 1: Rewrite createSlider composable

**Files:**
- Modify: `packages/0/src/composables/createSlider/index.ts`

### Step 1: Write the new SliderContext interface

Replace the current interface that Omits model properties with one that properly extends ModelContext. Key changes:
- `values` becomes `ComputedRef<number[]>` (was `Ref<number[]>`)
- Add `registerThumb` and `unregisterThumb` (moved from SliderRoot)
- Keep `selectedValues` override as `ComputedRef<number[]>` (array, not Set — preserves duplicates for range sliders where both thumbs could be at same value)
- Remove `multiple` from interface (SliderRoot passes `{ multiple: true }` to useProxyModel directly)
- Keep all math functions unchanged

```ts
import type { ModelContext, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { ID } from '#v0/types'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export interface SliderTicketInput extends ModelTicketInput<ShallowRef<number>> {
  value: ShallowRef<number>
}

export interface SliderContext extends Omit<
  ModelContext<SliderTicketInput, ModelTicket<SliderTicketInput>>,
  'selectedValues' | 'apply' | 'disabled'
> {
  /** Ordered thumb values derived from model tickets */
  values: ComputedRef<number[]>
  /** Array of values for useProxyModel compatibility (not a Set — preserves duplicates) */
  selectedValues: ComputedRef<number[]>
  /** Apply external values — snaps, constrains, writes to ticket refs */
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  /** Whether disabled */
  disabled: Ref<boolean>
  /** Whether readonly */
  readonly: Ref<boolean>
  /** Orientation */
  orientation: Ref<'horizontal' | 'vertical'>
  /** Whether inverted */
  inverted: Ref<boolean>
  /** Minimum value */
  readonly min: number
  /** Maximum value */
  readonly max: number
  /** Step increment */
  readonly step: number
  /** Minimum steps between thumbs */
  readonly minStepsBetweenThumbs: number
  /** Whether thumbs can cross */
  readonly crossover: boolean
  /** Whether this is a range slider */
  readonly range: boolean
  /** Register a thumb, returns its ticket */
  registerThumb: (initialValue?: number) => ModelTicket<SliderTicketInput>
  /** Unregister a thumb by ticket ID */
  unregisterThumb: (id: ID) => void
  /** Round value to nearest step, clamped to min/max */
  snap: (value: number) => number
  /** Convert value to 0-100 percentage (respects inverted) */
  percent: (value: number) => number
  /** Convert 0-100 percentage to snapped value (respects inverted) */
  fromPercent: (percent: number) => number
  /** Set value at thumb index with constraints */
  setValue: (index: number, value: number) => void
  /** Increment thumb value by step x multiplier */
  stepUp: (index: number, multiplier?: number) => void
  /** Decrement thumb value by step x multiplier */
  stepDown: (index: number, multiplier?: number) => void
  /** Set thumb to minimum value */
  setToMin: (index: number) => void
  /** Set thumb to maximum value */
  setToMax: (index: number) => void
}
```

### Step 2: Implement the new createSlider function

Replace the function body. Key implementation details:

**Model creation:**
```ts
const model = createModel<SliderTicketInput, ModelTicket<SliderTicketInput>>({
  disabled: disabledProp,
})
```

`enroll: true` is the default — thumbs auto-select on register.

**Pending values pattern** (solves timing: useProxyModel fires `apply()` before thumbs mount):
```ts
let pending: number[] | null = null
```

**Ordered thumbs computed:**
```ts
const thumbs = computed(() =>
  Array.from(model.selectedItems.value).sort((a, b) => a.index - b.index)
)
```

**Values and selectedValues:**
```ts
const values = computed(() => thumbs.value.map(t => toValue(t.value)))
const selectedValues = computed(() => values.value)
```

**registerThumb** — consumes pending values:
```ts
function registerThumb (initialValue?: number): ModelTicket<SliderTicketInput> {
  const thumbIndex = thumbs.value.length
  const pendingValue = pending?.[thumbIndex]
  const val = pendingValue !== undefined ? snap(pendingValue) : snap(initialValue ?? min)

  const ticket = model.register({
    value: shallowRef(val),
  })

  // Clear pending once all expected values consumed
  if (pending && thumbs.value.length >= pending.length) {
    pending = null
  }

  return ticket
}
```

**unregisterThumb:**
```ts
function unregisterThumb (id: ID): void {
  model.unregister(id)
}
```

**apply** — snap/constrain, write to ticket refs, store pending if no thumbs:
```ts
function apply (incoming: unknown[], _options?: { multiple?: boolean }): void {
  const snapped = incoming.map(v => snap(Number(v)))

  if (thumbs.value.length === 0) {
    pending = snapped
    return
  }

  for (let index = 0; index < snapped.length; index++) {
    const ticket = thumbs.value[index]
    if (!ticket || !isRef(ticket.value)) continue

    let constrained = snapped[index]!

    if (!crossover) {
      const gap = minStepsBetweenThumbs * step
      const prev = index > 0 ? snapped[index - 1] : undefined
      const following = index < snapped.length - 1 ? snapped[index + 1] : undefined

      if (prev !== undefined) constrained = Math.max(constrained, prev + gap)
      if (following !== undefined) constrained = Math.min(constrained, following - gap)
    }

    ticket.value.value = clamp(constrained, min, max)
  }
}
```

**setValue** — writes directly to the ticket's ref:
```ts
function setValue (index: number, value: number): void {
  if (readonly.value) return
  const snapped = snap(value)
  const current = values.value

  let constrained = snapped

  if (!crossover) {
    const gap = minStepsBetweenThumbs * step
    const prev = current[index - 1]
    const following = current[index + 1]

    if (index > 0 && prev !== undefined) {
      constrained = Math.max(constrained, prev + gap)
    }
    if (index < current.length - 1 && following !== undefined) {
      constrained = Math.min(constrained, following - gap)
    }
  }

  constrained = clamp(constrained, min, max)
  const ticket = thumbs.value[index]
  if (ticket && isRef(ticket.value)) {
    ticket.value.value = constrained
  }
}
```

**Math functions** (`snap`, `percent`, `fromPercent`, `stepUp`, `stepDown`, `setToMin`, `setToMax`) — unchanged from current implementation except `stepUp`/`stepDown` read from `values.value` (same API).

**Return object:**
```ts
return {
  ...model,
  values,
  selectedValues,
  apply,
  range,
  min, max, step,
  minStepsBetweenThumbs, crossover,
  disabled, readonly, orientation, inverted,
  registerThumb, unregisterThumb,
  snap, percent, fromPercent,
  setValue, stepUp, stepDown, setToMin, setToMax,
  get size () { return model.size },
}
```

### Step 3: Add `range` to SliderOptions

```ts
export interface SliderOptions {
  // ... existing options ...
  /** Range mode — expects two thumbs (default: false) */
  range?: boolean
}
```

Destructure with default:
```ts
const { range = false, ...rest } = options
```

### Step 4: Run tests to check current state

Run: `pnpm vitest run packages/0/src/composables/createSlider/index.test.ts`

Expected: Tests will fail because they write to `values.value` directly, which is now a computed (read-only).

### Step 5: Commit

```bash
git add packages/0/src/composables/createSlider/index.ts
git commit -m "feat(createSlider): rewrite to use createModel as baseline

Each thumb is a model ticket with a shallowRef<number> value.
values computed derives ordered array from selectedItems.
apply snaps/constrains and writes to ticket refs.
Pending values pattern handles useProxyModel timing.

BREAKING CHANGE: values is now ComputedRef (read-only), not Ref.
Use registerThumb() + setValue() instead of direct assignment."
```

---

## Task 2: Update createSlider unit tests

**Files:**
- Modify: `packages/0/src/composables/createSlider/index.test.ts`

### Step 1: Rewrite tests that write to `values.value` directly

Every test that does `slider.values.value = [50]` must change to register a thumb first, then use `setValue` or `apply`.

Helper pattern for tests:
```ts
function setup (options?: SliderOptions) {
  const slider = createSlider(options)
  return {
    slider,
    addThumb (value?: number) {
      return slider.registerThumb(value)
    },
  }
}
```

**Updated test file:**

```ts
import { describe, expect, it } from 'vitest'

import { createSlider } from './index'

import type { SliderOptions } from './index'

function setup (options?: SliderOptions) {
  const slider = createSlider(options)
  return {
    slider,
    addThumb (value?: number) {
      return slider.registerThumb(value)
    },
  }
}

describe('createSlider', () => {
  describe('snap', () => {
    it('rounds to nearest step', () => {
      const { slider } = setup({ min: 0, max: 100, step: 10 })
      expect(slider.snap(13)).toBe(10)
      expect(slider.snap(17)).toBe(20)
      expect(slider.snap(15)).toBe(20)
    })

    it('handles decimal steps', () => {
      const { slider } = setup({ min: 0, max: 1, step: 0.1 })
      expect(slider.snap(0.34)).toBeCloseTo(0.3)
      expect(slider.snap(0.36)).toBeCloseTo(0.4)
    })

    it('clamps to min/max', () => {
      const { slider } = setup({ min: 0, max: 100, step: 1 })
      expect(slider.snap(-10)).toBe(0)
      expect(slider.snap(110)).toBe(100)
    })
  })

  describe('percent', () => {
    it('converts value to percentage', () => {
      const { slider } = setup({ min: 0, max: 100 })
      expect(slider.percent(0)).toBe(0)
      expect(slider.percent(50)).toBe(50)
      expect(slider.percent(100)).toBe(100)
    })

    it('handles custom min/max', () => {
      const { slider } = setup({ min: 20, max: 80 })
      expect(slider.percent(20)).toBe(0)
      expect(slider.percent(50)).toBe(50)
      expect(slider.percent(80)).toBe(100)
    })
  })

  describe('fromPercent', () => {
    it('converts percentage to snapped value', () => {
      const { slider } = setup({ min: 0, max: 100, step: 10 })
      expect(slider.fromPercent(0)).toBe(0)
      expect(slider.fromPercent(50)).toBe(50)
      expect(slider.fromPercent(33)).toBe(30)
    })
  })

  describe('setValue', () => {
    it('sets value at index', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1 })
      addThumb(50)
      slider.setValue(0, 75)
      expect(slider.values.value).toEqual([75])
    })

    it('clamps value to min/max', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100 })
      addThumb(50)
      slider.setValue(0, 150)
      expect(slider.values.value).toEqual([100])
    })

    it('enforces minStepsBetweenThumbs', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1, minStepsBetweenThumbs: 10 })
      addThumb(30)
      addThumb(70)
      slider.setValue(0, 65)
      expect(slider.values.value[0]).toBe(60)
    })

    it('snaps to step', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 5 })
      addThumb(50)
      slider.setValue(0, 53)
      expect(slider.values.value).toEqual([55])
    })
  })

  describe('stepUp / stepDown', () => {
    it('increments by one step', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 5 })
      addThumb(50)
      slider.stepUp(0)
      expect(slider.values.value).toEqual([55])
    })

    it('decrements by one step', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 5 })
      addThumb(50)
      slider.stepDown(0)
      expect(slider.values.value).toEqual([45])
    })

    it('supports multiplier', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 1 })
      addThumb(50)
      slider.stepUp(0, 10)
      expect(slider.values.value).toEqual([60])
    })

    it('clamps at boundaries', () => {
      const { slider, addThumb } = setup({ min: 0, max: 100, step: 10 })
      addThumb(100)
      slider.stepUp(0)
      expect(slider.values.value).toEqual([100])
    })
  })

  describe('setToMin / setToMax', () => {
    it('sets to min', () => {
      const { slider, addThumb } = setup({ min: 10, max: 90 })
      addThumb(50)
      slider.setToMin(0)
      expect(slider.values.value).toEqual([10])
    })

    it('sets to max', () => {
      const { slider, addThumb } = setup({ min: 10, max: 90 })
      addThumb(50)
      slider.setToMax(0)
      expect(slider.values.value).toEqual([90])
    })
  })

  describe('defaults', () => {
    it('uses min=0, max=100, step=1', () => {
      const { slider } = setup()
      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.step).toBe(1)
    })
  })

  describe('inverted', () => {
    it('flips percent calculation', () => {
      const { slider } = setup({ min: 0, max: 100, inverted: true })
      expect(slider.percent(25)).toBe(75)
      expect(slider.percent(0)).toBe(100)
      expect(slider.percent(100)).toBe(0)
    })

    it('flips fromPercent', () => {
      const { slider } = setup({ min: 0, max: 100, step: 1, inverted: true })
      expect(slider.fromPercent(75)).toBe(25)
    })
  })

  describe('registerThumb', () => {
    it('registers a thumb with initial value', () => {
      const { slider, addThumb } = setup()
      addThumb(50)
      expect(slider.values.value).toEqual([50])
    })

    it('defaults to min when no initial value', () => {
      const { slider, addThumb } = setup({ min: 10 })
      addThumb()
      expect(slider.values.value).toEqual([10])
    })

    it('registers multiple thumbs in order', () => {
      const { slider, addThumb } = setup()
      addThumb(25)
      addThumb(75)
      expect(slider.values.value).toEqual([25, 75])
    })
  })

  describe('unregisterThumb', () => {
    it('removes a thumb', () => {
      const { slider, addThumb } = setup()
      const ticket = addThumb(50)
      addThumb(75)
      slider.unregisterThumb(ticket.id)
      expect(slider.values.value).toEqual([75])
    })
  })

  describe('apply', () => {
    it('writes to existing thumb refs', () => {
      const { slider, addThumb } = setup()
      addThumb(0)
      addThumb(0)
      slider.apply([25, 75])
      expect(slider.values.value).toEqual([25, 75])
    })

    it('stores pending when no thumbs registered', () => {
      const { slider, addThumb } = setup()
      slider.apply([25, 75])
      addThumb()
      expect(slider.values.value).toEqual([25])
      addThumb()
      expect(slider.values.value).toEqual([25, 75])
    })

    it('snaps incoming values', () => {
      const { slider, addThumb } = setup({ step: 10 })
      addThumb(0)
      slider.apply([33])
      expect(slider.values.value).toEqual([30])
    })
  })
})
```

### Step 2: Run tests

Run: `pnpm vitest run packages/0/src/composables/createSlider/index.test.ts`

Expected: All pass.

### Step 3: Commit

```bash
git add packages/0/src/composables/createSlider/index.test.ts
git commit -m "feat(createSlider): update tests for model-based rewrite

Tests now register thumbs via registerThumb() instead of writing
to values.value directly. Added tests for registerThumb,
unregisterThumb, apply, and pending values."
```

---

## Task 3: Update SliderRoot

**Files:**
- Modify: `packages/0/src/components/Slider/SliderRoot.vue`

### Step 1: Remove index recycling

Delete the `active` Set, `registerThumb`, and `unregisterThumb` functions from SliderRoot (lines 157-166). These now live in `createSlider`.

### Step 2: Update SliderRootContext interface

Remove `registerThumb: () => number` and `unregisterThumb: (index: number) => void`. The slider context already provides these. `SliderRootContext` extends `SliderContext` which now includes them.

```ts
export interface SliderRootContext extends SliderContext {
  /** Unique identifier */
  readonly id: string
  /** Form field name */
  readonly name?: string
  /** Form association */
  readonly form?: string
  /** Track which thumb is currently being dragged */
  dragging: Ref<number | null>
  /** Track element ref for percent calculation */
  trackElement: Ref<HTMLElement | null>
  /** Start a drag interaction for a thumb */
  startDrag: (index: number, event: PointerEvent, thumbEl?: HTMLElement) => void
}
```

### Step 3: Update context object

Remove `registerThumb` and `unregisterThumb` from the context object — they're already spread from `slider`:

```ts
const context: SliderRootContext = {
  ...slider,
  id,
  name,
  form,
  dragging,
  trackElement,
  startDrag,
}
```

### Step 4: Remove `{ multiple: true }` from the slider spread, pass to useProxyModel

The slider no longer has `multiple`. Pass it via options:

```ts
useProxyModel(slider, model, { multiple: true })
```

This is already the current code — no change needed here. Just verify `slider` no longer spreads a `multiple` property.

### Step 5: Commit

```bash
git add packages/0/src/components/Slider/SliderRoot.vue
git commit -m "feat(Slider): delegate thumb registration to createSlider

Remove index recycling from SliderRoot — createSlider now owns
registerThumb/unregisterThumb. SliderRootContext simplified."
```

---

## Task 4: Update SliderThumb

**Files:**
- Modify: `packages/0/src/components/Slider/SliderThumb.vue`

### Step 1: Change registration to use slider's registerThumb

Currently:
```ts
const index = root.registerThumb()
onUnmounted(() => root.unregisterThumb(index))
const value = toRef(() => root.values.value[index] ?? root.min)
```

Replace with:
```ts
const ticket = root.registerThumb()
onUnmounted(() => root.unregisterThumb(ticket.id))

const index = toRef(() => ticket.index)
const value = toRef(() => toValue(ticket.value))
```

### Step 2: Update all `index` references

`index` was a plain `number`, now it's a `Ref<number>`. Update all references:

- Slot props: `index: index.value`
- `root.stepUp(index.value)`, `root.stepDown(index.value)`, etc.
- `root.dragging.value === index.value`
- `root.startDrag(index.value, e, ...)`
- ARIA valuemin/valuemax: `root.values.value[index.value - 1]`, `root.values.value[index.value + 1]`

### Step 3: Update SliderThumbSlotProps

The `index` field type stays `number` (unwrapped in slot props).

### Step 4: Commit

```bash
git add packages/0/src/components/Slider/SliderThumb.vue
git commit -m "feat(Slider): thumb self-registers as model ticket

SliderThumb now calls slider.registerThumb() to get a ticket,
reads value from ticket.value ref. Index derived from ticket.index."
```

---

## Task 5: Update SliderHiddenInput

**Files:**
- Modify: `packages/0/src/components/Slider/SliderHiddenInput.vue`

### Step 1: Verify compatibility

SliderHiddenInput receives `index` as a prop and reads `root.values.value[index]`. Since `values` is still an array (just computed instead of ref), this should work without changes.

Read the file, verify it only reads `root.values.value[index]`, and confirm no changes needed.

### Step 2: Commit (skip if no changes)

---

## Task 6: Verify Track and Range components

**Files:**
- Read: `packages/0/src/components/Slider/SliderTrack.vue`
- Read: `packages/0/src/components/Slider/SliderRange.vue`

### Step 1: Verify SliderTrack

SliderTrack reads `root.values.value` in `nearest()` and calls `root.setValue(index, value)`. Both APIs unchanged. No modifications needed.

### Step 2: Verify SliderRange

SliderRange reads `root.values.value` for range calculations. API unchanged. No modifications needed.

---

## Task 7: Run full test suite

### Step 1: Run composable tests

Run: `pnpm vitest run packages/0/src/composables/createSlider/`

Expected: All pass.

### Step 2: Run component tests

Run: `pnpm vitest run packages/0/src/components/Slider/`

Expected: Some failures possible — component tests mount SliderRoot with `<SliderThumb>` children, which now register differently. The test helper `mountSlider()` may need adjustment if it relies on internal behavior.

### Step 3: Fix any failing component tests

Common failure patterns:
- Tests expecting `slider.values.value` to be writable → use `apply()` instead
- Tests expecting thumb registration timing → may need `await nextTick()`
- v-model sync tests should still pass since useProxyModel → apply → pending → registerThumb flow handles it

### Step 4: Run typecheck

Run: `pnpm typecheck`

Fix any type errors from the interface changes.

### Step 5: Commit fixes

```bash
git add -u
git commit -m "fix(Slider): resolve test and type errors from model rewrite"
```

---

## Task 8: Update barrel exports

**Files:**
- Modify: `packages/0/src/components/Slider/index.ts`

### Step 1: Verify exports

Check that `SliderRootContext` no longer exports removed types. Ensure `SliderContext` exports the new `SliderTicketInput` type if needed by consumers.

### Step 2: Update if needed

The barrel should export:
```ts
export type { SliderContext, SliderOptions, SliderTicketInput } from '#v0/composables/createSlider'
```

### Step 3: Commit

```bash
git add packages/0/src/components/Slider/index.ts
git commit -m "feat(Slider): update barrel exports for model rewrite"
```

---

## Task 9: Final validation

### Step 1: Run full validation

Run: `pnpm validate`

This runs lint + typecheck + tests. Fix any remaining issues.

### Step 2: Manual smoke test (optional)

Run: `pnpm dev`

Open playground, test:
- Single slider: drag, keyboard, v-model sync
- Range slider: two thumbs, constraints, v-model sync
- Disabled/readonly states

### Step 3: Final commit if needed

```bash
git add -u
git commit -m "chore: final cleanup for slider model rewrite"
```
