/**
 * @module createSlider
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-slider
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
import { clamp, isObject, isUndefined } from '#v0/utilities'
import { computed, isRef, shallowRef, toRef, toValue } from 'vue'

// Types
import type { ModelContext, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { ID } from '#v0/types'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export interface SliderTicketInput extends ModelTicketInput<ShallowRef<number>> {
  value: ShallowRef<number>
}

/**
 * Configuration options for createSlider.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-slider
 */
export interface SliderOptions {
  /**
   * Minimum value.
   * @default 0
   */
  min?: number
  /**
   * Maximum value.
   * @default 100
   */
  max?: number
  /**
   * Step increment. Values are snapped to the nearest multiple of `step` above `min`.
   *
   * @remarks Use decimal steps for fine-grained control (e.g., `0.1` for a media scrubber).
   * A step of `0` disables snapping — values are only clamped to min/max.
   *
   * @default 1
   */
  step?: number
  /**
   * Whether the slider is disabled.
   *
   * @remarks Accepts a reactive getter or ref. When disabled, all thumb operations (`set`, `up`, `down`) are no-ops.
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Whether the slider is readonly (focusable but not editable).
   *
   * @remarks Thumbs can receive focus for accessibility, but `set`, `up`, `down`, `floor`, and `ceil` are no-ops.
   */
  readonly?: MaybeRefOrGetter<boolean>
  /**
   * Slider orientation.
   *
   * @remarks Affects `fromValue` and `fromPercent` axis mapping in Slider components.
   * When using createSlider standalone, orientation is informational only.
   */
  orientation?: MaybeRefOrGetter<'horizontal' | 'vertical'>
  /**
   * Flip the percent axis.
   *
   * @remarks When `true`, `fromValue(min)` returns `100` and `fromValue(max)` returns `0`.
   * Useful for vertical sliders where the visual bottom is the minimum.
   */
  inverted?: MaybeRefOrGetter<boolean>
  /**
   * Minimum steps required between adjacent thumbs.
   *
   * @remarks Enforced by `set` and `apply`. The gap in value units is `minStepsBetweenThumbs * step`.
   *
   * @default 0
   *
   * @example
   * ```ts
   * const slider = createSlider({ step: 5, minStepsBetweenThumbs: 2 })
   * // Thumbs must be at least 10 units apart (2 × 5)
   * ```
   */
  minStepsBetweenThumbs?: number
  /**
   * Allow thumbs to pass through each other.
   *
   * @remarks When `false` (default), `set` constrains values so thumbs maintain their order.
   * When `true`, thumbs can freely overlap and swap positions.
   *
   * @default false
   */
  crossover?: boolean
  /**
   * Range mode — expects two thumbs.
   *
   * @remarks Informational flag used by Slider components to adjust track/range rendering.
   * Does not enforce the number of registered thumbs.
   *
   * @default false
   */
  range?: boolean
}

/**
 * Context returned by {@link createSlider}.
 *
 * @remarks
 * Extends `createModel` with slider-specific math and thumb operations.
 *
 * **Inheritance chain:**
 * `createRegistry` → `createModel` → `createSlider`
 *
 * **Ticket-per-thumb model:**
 * Each thumb is a model ticket whose value is a `shallowRef<number>`.
 * `values` is derived from the ordered tickets, not a standalone ref.
 * Register/unregister thumbs to add/remove values dynamically.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-slider
 * @see {@link createModel} for the base model API (collection, selectedIds, etc.)
 */
export interface SliderContext extends Omit<
  ModelContext<SliderTicketInput, ModelTicket<SliderTicketInput>>,
  'values' | 'selectedValues' | 'apply' | 'disabled' | 'register'
> {
  /**
   * Ordered thumb values derived from model tickets.
   *
   * @remarks Reactive — updates when any thumb's `shallowRef<number>` changes.
   * Order matches ticket registration order (sorted by index).
   *
   * @example
   * ```ts
   * const slider = createSlider()
   * slider.register({ value: 25 })
   * slider.register({ value: 75 })
   * console.log(slider.values.value) // [25, 75]
   * ```
   */
  values: ComputedRef<number[]>
  /**
   * Alias for `values` — provides useProxyModel compatibility.
   *
   * @remarks Returns an array (not a Set) to preserve duplicate values across thumbs.
   *
   * @see {@link values}
   */
  selectedValues: ComputedRef<number[]>
  /**
   * Apply external values — snaps, constrains, and writes to ticket refs.
   *
   * @param values Array of raw values (coerced to numbers).
   * @param options Options object (reserved for useProxyModel compatibility).
   *
   * @remarks
   * If no thumbs are registered yet, values are stored as pending and
   * consumed as thumbs register. Each value is snapped to step and
   * constrained by `minStepsBetweenThumbs`.
   *
   * @example
   * ```ts
   * const slider = createSlider({ step: 10 })
   * slider.register({ value: 0 })
   * slider.register({ value: 0 })
   * slider.apply([33, 67]) // values: [30, 70]
   * ```
   */
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  /** Whether disabled. Reactive ref derived from the `disabled` option. */
  disabled: Readonly<Ref<boolean>>
  /** Whether readonly. Reactive ref derived from the `readonly` option. */
  readonly: Readonly<Ref<boolean>>
  /** Slider orientation. Reactive ref derived from the `orientation` option. */
  orientation: Readonly<Ref<'horizontal' | 'vertical'>>
  /** Whether inverted. Reactive ref derived from the `inverted` option. */
  inverted: Readonly<Ref<boolean>>
  /** Minimum value. */
  readonly min: number
  /** Maximum value. */
  readonly max: number
  /** Step increment. */
  readonly step: number
  /** Minimum steps required between adjacent thumbs. */
  readonly minStepsBetweenThumbs: number
  /** Whether thumbs can cross each other. */
  readonly crossover: boolean
  /** Whether this is a range slider. */
  readonly range: boolean
  /**
   * Register a new thumb and return its ticket.
   *
   * @param input Starting value as a number or `{ value }` object. Defaults to `min`.
   *
   * @remarks
   * The thumb is automatically selected in the model (all thumbs stay selected).
   * If `apply` was called before any thumbs registered, the pending value at this
   * thumb's index is used instead of the provided value.
   *
   * @see {@link unregister}
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 100 })
   * const thumb = slider.register({ value: 50 })
   * console.log(thumb.index) // 0
   * console.log(slider.values.value) // [50]
   * ```
   */
  register: (input?: number | { value: number }) => ModelTicket<SliderTicketInput>
  /**
   * Unregister a thumb by ticket ID.
   *
   * @param id The ticket ID returned from `register()`.
   *
   * @see {@link register}
   *
   * @example
   * ```ts
   * const slider = createSlider()
   * const thumb = slider.register({ value: 50 })
   * slider.unregister(thumb.id) // values: []
   * ```
   */
  unregister: (id: ID) => void
  /**
   * Round a value to the nearest step, clamped to min/max.
   *
   * @param value Raw value to snap.
   * @returns Snapped value.
   *
   * @remarks Pure function — does not modify slider state.
   * When `step` is `0`, only clamps without snapping.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 100, step: 5 })
   * slider.snap(47) // 45
   * slider.snap(48) // 50
   * slider.snap(-5) // 0  (clamped)
   * ```
   */
  snap: (value: number) => number
  /**
   * Convert a value to a 0–100 percentage.
   *
   * @param value The slider value to convert.
   * @returns Percentage between 0 and 100.
   *
   * @remarks Pure function. Respects `inverted` — when inverted,
   * `fromValue(min)` returns `100` and `fromValue(max)` returns `0`.
   *
   * @see {@link fromPercent} for the inverse operation.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 200 })
   * slider.fromValue(100) // 50
   * slider.fromValue(0)   // 0
   * slider.fromValue(200) // 100
   * ```
   */
  fromValue: (value: number) => number
  /**
   * Convert a 0–100 percentage to a snapped value.
   *
   * @param percent Percentage between 0 and 100.
   * @returns Snapped slider value.
   *
   * @remarks Pure function. Respects `inverted`. The returned value
   * is snapped to the nearest step and clamped to min/max.
   *
   * @see {@link fromValue} for the inverse operation.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 100, step: 10 })
   * slider.fromPercent(33) // 30
   * slider.fromPercent(50) // 50
   * ```
   */
  fromPercent: (percent: number) => number
  /**
   * Set the value at a thumb index with step snapping and neighbor constraints.
   *
   * @param index Zero-based thumb index.
   * @param value Raw value to set.
   *
   * @remarks
   * No-op when `readonly` is `true`. The value is snapped to step, clamped to min/max,
   * and constrained by adjacent thumbs when `crossover` is `false`.
   *
   * @see {@link up} and {@link down} for relative adjustments.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 100, step: 5 })
   * slider.register({ value: 50 })
   * slider.set(0, 73) // values: [75] (snapped)
   * ```
   */
  set: (index: number, value: number) => void
  /**
   * Increment a thumb's value by `step × multiplier`.
   *
   * @param index Zero-based thumb index.
   * @param multiplier Number of steps to increment. Defaults to `1`.
   *
   * @see {@link down} for the inverse. {@link set} for absolute positioning.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 100, step: 5 })
   * slider.register({ value: 50 })
   * slider.up(0)     // values: [55]
   * slider.up(0, 3)  // values: [70]
   * ```
   */
  up: (index: number, multiplier?: number) => void
  /**
   * Decrement a thumb's value by `step × multiplier`.
   *
   * @param index Zero-based thumb index.
   * @param multiplier Number of steps to decrement. Defaults to `1`.
   *
   * @see {@link up} for the inverse. {@link set} for absolute positioning.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 0, max: 100, step: 5 })
   * slider.register({ value: 50 })
   * slider.down(0)     // values: [45]
   * slider.down(0, 3)  // values: [30]
   * ```
   */
  down: (index: number, multiplier?: number) => void
  /**
   * Set a thumb to the minimum value.
   *
   * @param index Zero-based thumb index.
   *
   * @see {@link ceil} for the inverse.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 10, max: 90 })
   * slider.register({ value: 50 })
   * slider.floor(0) // values: [10]
   * ```
   */
  floor: (index: number) => void
  /**
   * Set a thumb to the maximum value.
   *
   * @param index Zero-based thumb index.
   *
   * @see {@link floor} for the inverse.
   *
   * @example
   * ```ts
   * const slider = createSlider({ min: 10, max: 90 })
   * slider.register({ value: 50 })
   * slider.ceil(0) // values: [90]
   * ```
   */
  ceil: (index: number) => void
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
 * @see https://0.vuetifyjs.com/composables/forms/create-slider
 * @see {@link createModel} for the base model composable.
 *
 * @example Single thumb
 * ```ts
 * import { createSlider } from '@vuetify/v0'
 *
 * const slider = createSlider({ min: 0, max: 100, step: 5 })
 * const ticket = slider.register({ value: 50 })
 * slider.up(0)           // values: [55]
 * slider.fromValue(50)   // 50
 * ```
 *
 * @example Range slider
 * ```ts
 * import { createSlider } from '@vuetify/v0'
 *
 * const slider = createSlider({ min: 0, max: 100, step: 1, range: true })
 * slider.register({ value: 25 })
 * slider.register({ value: 75 })
 * slider.set(0, 30)      // values: [30, 75]
 * slider.set(1, 60)      // values: [30, 60]
 * ```
 *
 * @example Custom pointer interaction (media scrubber)
 * ```ts
 * import { createSlider } from '@vuetify/v0'
 *
 * const slider = createSlider({ min: 0, max: 217, step: 0.1 })
 * slider.register({ value: 0 })
 *
 * // pointer → fromPercent → set → fromValue → UI
 * const percent = (clientX - rect.left) / rect.width * 100
 * slider.set(0, slider.fromPercent(percent))
 * const position = slider.fromValue(slider.values.value[0])
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
    multiple: true,
    events: true,
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

  function fromValue (value: number): number {
    if (extent === 0) return 0
    const p = ((value - min) / extent) * 100
    return inverted.value ? 100 - p : p
  }

  function fromPercent (p: number): number {
    const adjusted = inverted.value ? 100 - p : p
    return snap(min + (adjusted / 100) * extent)
  }

  function register (input?: number | { value: number }): ModelTicket<SliderTicketInput> {
    const initialValue = isObject(input) ? input.value : input
    const thumbIndex = thumbs.value.length
    const pendingValue = pending?.[thumbIndex]
    const val = isUndefined(pendingValue) ? snap(initialValue ?? min) : snap(pendingValue)

    const ticket = model.register({
      value: shallowRef(val),
    })

    // Ensure thumb is selected even when model is disabled
    // (disabled prevents slider interaction, not thumb visibility)
    if (!model.selectedIds.has(ticket.id)) {
      model.selectedIds.add(ticket.id)
    }

    // Clear pending once all expected values consumed
    if (pending && thumbs.value.length >= pending.length) {
      pending = null
    }

    return ticket
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

        if (!isUndefined(prev)) constrained = Math.max(constrained, prev + gap)
        if (!isUndefined(following)) constrained = Math.min(constrained, following - gap)
      }

      ticket.value.value = clamp(constrained, min, max)
    }
  }

  function set (index: number, value: number): void {
    if (readonly.value) return
    const snapped = snap(value)
    const current = values.value

    let constrained = snapped

    if (!crossover) {
      const gap = minStepsBetweenThumbs * step
      const prev = current[index - 1]
      const following = current[index + 1]

      if (index > 0 && !isUndefined(prev)) {
        constrained = Math.max(constrained, prev + gap)
      }
      if (index < current.length - 1 && !isUndefined(following)) {
        constrained = Math.min(constrained, following - gap)
      }
    }

    constrained = clamp(constrained, min, max)
    const ticket = thumbs.value[index]
    if (ticket && isRef(ticket.value)) {
      ticket.value.value = constrained
    }
  }

  function up (index: number, multiplier = 1): void {
    set(index, (values.value[index] ?? min) + step * multiplier)
  }

  function down (index: number, multiplier = 1): void {
    set(index, (values.value[index] ?? min) - step * multiplier)
  }

  function floor (index: number): void {
    set(index, min)
  }

  function ceil (index: number): void {
    set(index, max)
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
    register,
    snap,
    fromValue,
    fromPercent,
    set,
    up,
    down,
    floor,
    ceil,
    get size () {
      return model.size
    },
  }
}
