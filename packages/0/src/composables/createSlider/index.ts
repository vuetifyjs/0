/**
 * @module createSlider
 *
 * @remarks
 * Composable for managing slider state: value math, step snapping,
 * percentage conversion, and multi-thumb value operations.
 *
 * Extends createModel for useProxyModel compatibility:
 * - createRegistry → createModel → createSlider (ticket-per-thumb)
 *
 * Each thumb is a model ticket with a `shallowRef<number>` value.
 * Values are derived from ordered tickets, not a standalone ref.
 *
 * Designed for single-thumb, range, and multi-thumb sliders.
 * Also reusable for color picker tracks, media scrubbers,
 * gradient editors, and other 1D value-on-track controls.
 */

// Composables
import { createModel } from '#v0/composables/createModel'

// Utilities
import { clamp } from '#v0/utilities'
import { computed, isRef, shallowRef, toRef, toValue } from 'vue'

// Types
import type { ModelContext, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { ID } from '#v0/types'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export interface SliderTicketInput extends ModelTicketInput<ShallowRef<number>> {
  value: ShallowRef<number>
}

export interface SliderOptions {
  /** Minimum value (default: 0) */
  min?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Step increment (default: 1) */
  step?: number
  /** Whether the slider is disabled */
  disabled?: MaybeRefOrGetter<boolean>
  /** Whether the slider is readonly (focusable but not editable) */
  readonly?: MaybeRefOrGetter<boolean>
  /** Slider orientation */
  orientation?: MaybeRefOrGetter<'horizontal' | 'vertical'>
  /** Flip the percent axis */
  inverted?: MaybeRefOrGetter<boolean>
  /** Minimum steps required between adjacent thumbs (default: 0) */
  minStepsBetweenThumbs?: number
  /** Allow thumbs to pass through each other (default: false) */
  crossover?: boolean
  /** Range mode — expects two thumbs (default: false) */
  range?: boolean
}

export interface SliderContext extends Omit<
  ModelContext<SliderTicketInput, ModelTicket<SliderTicketInput>>,
  'values' | 'selectedValues' | 'apply' | 'disabled'
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

/**
 * Creates slider state with value math, step snapping, and multi-thumb support.
 *
 * Extends createModel for useProxyModel compatibility. Each thumb is a model
 * ticket with a shallowRef<number> value. Values are derived from the ordered
 * tickets, enabling proper registration/unregistration lifecycle.
 *
 * @param options Slider configuration.
 * @returns Slider context with values, math functions, and thumb operations.
 *
 * @example
 * ```ts
 * const slider = createSlider({ min: 0, max: 100, step: 5 })
 * const ticket = slider.registerThumb(50)
 * slider.stepUp(0)       // values: [55]
 * slider.percent(50)     // 50
 * ```
 */
export function createSlider (options: SliderOptions = {}): SliderContext {
  const {
    min = 0,
    max = 100,
    step = 1,
    disabled: disabledProp = false,
    readonly: readonlyProp = false,
    orientation: orientationProp = 'horizontal',
    inverted: invertedProp = false,
    minStepsBetweenThumbs = 0,
    crossover = false,
    range = false,
  } = options

  const model = createModel<SliderTicketInput, ModelTicket<SliderTicketInput>>({
    disabled: disabledProp,
    enroll: false,
  })

  const disabled = toRef(() => toValue(disabledProp))
  const readonly = toRef(() => toValue(readonlyProp))
  const orientation = toRef(() => toValue(orientationProp))
  const inverted = toRef(() => toValue(invertedProp))

  const extent = max - min

  let pending: number[] | null = null

  const thumbs = computed(() =>
    Array.from(model.selectedItems.value).toSorted((a, b) => a.index - b.index),
  )

  const values = computed(() => thumbs.value.map(t => toValue(t.value)))
  const selectedValues = computed(() => values.value)

  function snap (value: number): number {
    if (step <= 0) return clamp(value, min, max)
    const clamped = clamp(value, min, max)
    const steps = Math.round((clamped - min) / step)
    return clamp(min + steps * step, min, max)
  }

  function percent (value: number): number {
    if (extent === 0) return 0
    const p = ((value - min) / extent) * 100
    return inverted.value ? 100 - p : p
  }

  function fromPercent (p: number): number {
    const adjusted = inverted.value ? 100 - p : p
    return snap(min + (adjusted / 100) * extent)
  }

  function registerThumb (initialValue?: number): ModelTicket<SliderTicketInput> {
    const thumbIndex = thumbs.value.length
    const pendingValue = pending?.[thumbIndex]
    const val = pendingValue === undefined ? snap(initialValue ?? min) : snap(pendingValue)

    const ticket = model.register({
      value: shallowRef(val),
    })

    // Manually select — model uses single-value select(), we need all thumbs selected
    model.selectedIds.add(ticket.id)

    // Clear pending once all expected values consumed
    if (pending && thumbs.value.length >= pending.length) {
      pending = null
    }

    return ticket
  }

  function unregisterThumb (id: ID): void {
    model.unregister(id)
  }

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

  function stepUp (index: number, multiplier = 1): void {
    setValue(index, (values.value[index] ?? min) + step * multiplier)
  }

  function stepDown (index: number, multiplier = 1): void {
    setValue(index, (values.value[index] ?? min) - step * multiplier)
  }

  function setToMin (index: number): void {
    setValue(index, min)
  }

  function setToMax (index: number): void {
    setValue(index, max)
  }

  return {
    ...model,
    values,
    selectedValues,
    apply,
    range,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    crossover,
    disabled,
    readonly,
    orientation,
    inverted,
    registerThumb,
    unregisterThumb,
    snap,
    percent,
    fromPercent,
    setValue,
    stepUp,
    stepDown,
    setToMin,
    setToMax,
    get size () {
      return model.size
    },
  }
}
