/**
 * @module createRating
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-rating
 *
 * @remarks
 * Lightweight rating composable for bounded discrete values.
 *
 * Key features:
 * - No registry overhead — just a bounded number
 * - Direct ref support for v-model compatibility
 * - Navigation methods: next, prev, first, last, select
 * - Computed items with full/half/empty state
 * - Half-step support for 0.5 increments
 * - Trinity pattern for dependency injection
 *
 * Unlike registry-based composables, rating tracks a single number
 * within a range with computed item states, making it efficient
 * for any star/icon rating use case.
 */

import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { clamp } from '#v0/utilities'
import { computed, isRef, shallowRef, toRef, toValue } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, MaybeRefOrGetter, Ref, ShallowRef, WritableComputedRef } from 'vue'

export type RatingItemState = 'full' | 'half' | 'empty'

export interface RatingItemDescriptor {
  /** 1-based position */
  value: number
  /** Derived visual state */
  state: RatingItemState
}

export interface RatingContext {
  /** Current rating, clamped to 0–size */
  value: WritableComputedRef<number>
  /** Total items */
  size: number
  /** Whether half-steps are enabled */
  half: boolean
  /** Array of items with computed state */
  items: ComputedRef<RatingItemDescriptor[]>
  /** Whether value is at minimum (0) */
  isFirst: Readonly<Ref<boolean>>
  /** Whether value is at maximum (size) */
  isLast: Readonly<Ref<boolean>>
  /** Set rating to specific value */
  select: (value: number) => void
  /** Increment by step (1 or 0.5) */
  next: () => void
  /** Decrement by step (1 or 0.5) */
  prev: () => void
  /** Set to 0 */
  first: () => void
  /** Set to size */
  last: () => void
}

export interface RatingOptions {
  /** Initial value or ref for v-model. @default 0 */
  value?: number | ShallowRef<number>
  /** Total items. @default 5 */
  size?: MaybeRefOrGetter<number>
  /** Enable 0.5 step increments. @default false */
  half?: MaybeRefOrGetter<boolean>
}

export interface RatingContextOptions extends RatingOptions {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a rating instance.
 *
 * @param options The options for the rating instance.
 * @returns A rating context with navigation methods.
 *
 * @example
 * ```ts
 * import { createRating } from '@vuetify/v0'
 *
 * // Basic usage
 * const rating = createRating()
 * rating.select(3)
 * rating.items.value // [{ value: 1, state: 'full' }, ...]
 *
 * // With v-model (pass a ref)
 * const value = shallowRef(0)
 * const rating = createRating({ value })
 * ```
 */
export function createRating<
  R extends RatingContext = RatingContext,
> (_options: RatingOptions = {}): R {
  const {
    value: _value = 0,
    size: _size = 5,
    half: _half = false,
  } = _options

  const _raw = isRef(_value) ? _value : shallowRef(_value)

  const value = computed({
    get: () => clamp(_raw.value, 0, toValue(_size)),
    set: (v: number) => {
      _raw.value = clamp(v, 0, toValue(_size))
    },
  })

  const step = toRef(() => toValue(_half) ? 0.5 : 1)

  const isFirst = toRef(() => value.value <= 0)
  const isLast = toRef(() => value.value >= toValue(_size))

  function select (v: number) {
    value.value = v
  }

  function next () {
    if (value.value < toValue(_size)) {
      value.value = Math.min(value.value + step.value, toValue(_size))
    }
  }

  function prev () {
    if (value.value > 0) {
      value.value = Math.max(value.value - step.value, 0)
    }
  }

  function first () {
    value.value = 0
  }

  function last () {
    value.value = toValue(_size)
  }

  function getState (item: number, current: number): RatingItemState {
    if (item <= Math.floor(current)) return 'full'
    if (item === Math.ceil(current) && current !== Math.floor(current)) return 'half'
    return 'empty'
  }

  const items = computed<RatingItemDescriptor[]>(() => {
    const size = toValue(_size)
    const current = value.value
    const result: RatingItemDescriptor[] = []

    for (let i = 1; i <= size; i++) {
      result.push({
        value: i,
        state: getState(i, current),
      })
    }

    return result
  })

  return {
    value,
    items,
    isFirst,
    isLast,
    select,
    next,
    prev,
    first,
    last,
    get size () {
      return toValue(_size)
    },
    get half () {
      return toValue(_half)
    },
  } as R
}

/**
 * Creates a rating context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [useRating, provideRating, defaultContext]
 *
 * @example
 * ```ts
 * const [useRating, provideRatingContext] = createRatingContext({ size: 5 })
 *
 * // Parent component
 * provideRatingContext()
 *
 * // Child component
 * const rating = useRating()
 * rating.select(4)
 * ```
 */
export function createRatingContext<
  R extends RatingContext = RatingContext,
> (_options: RatingContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:rating', ...options } = _options
  const [useRatingContext, _provideRatingContext] = createContext<R>(namespace)
  const context = createRating<R>(options)

  function provideRatingContext (_context: R = context, app?: App): R {
    return _provideRatingContext(_context, app)
  }

  return createTrinity<R>(useRatingContext, provideRatingContext, context)
}

/**
 * Returns the current rating instance from context.
 *
 * @param namespace The namespace. @default 'v0:rating'
 * @returns The rating context.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useRating } from '@vuetify/v0'
 *
 *   const rating = useRating()
 * </script>
 *
 * <template>
 *   <button @click="rating.prev()" :disabled="rating.isFirst.value">-</button>
 *   <span>{{ rating.value.value }} / {{ rating.size }}</span>
 *   <button @click="rating.next()" :disabled="rating.isLast.value">+</button>
 * </template>
 * ```
 */
export function useRating<
  R extends RatingContext = RatingContext,
> (namespace = 'v0:rating'): R {
  return useContext<R>(namespace)
}
