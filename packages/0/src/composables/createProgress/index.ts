/**
 * @module createProgress
 *
 * @see https://0.vuetifyjs.com/composables/semantic/create-progress
 *
 * @remarks
 * Registry-based progress composable with segment tracking.
 *
 * Key features:
 * - Segment registration for multi-part progress bars
 * - Indeterminate state detection
 * - Clamped total with configurable min/max
 * - Percent computation for each segment and overall
 * - Trinity pattern for dependency injection
 *
 * Each segment tracks its own value and percent contribution,
 * while the root context provides aggregated total and percent.
 */

import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { clamp, isNullOrUndefined, useId } from '#v0/utilities'
import { computed, onScopeDispose, shallowRef, triggerRef } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, ComputedRef, ShallowRef } from 'vue'

export interface ProgressSegment {
  /** Unique segment identifier */
  id: ID
  /** Current segment value */
  value: ShallowRef<number>
  /** Segment's contribution as a percentage of the range */
  percent: ComputedRef<number>
  /** Remove this segment from the registry */
  unregister: () => void
  /** Position among registered segments */
  get index (): number
}

export interface ProgressContext {
  /** Minimum value of the range */
  min: number
  /** Maximum value of the range */
  max: number
  /** Registered segments as a readonly array */
  segments: ComputedRef<ProgressSegment[]>
  /** Sum of all segment values, clamped to [min, max] */
  total: ComputedRef<number>
  /** Overall progress as a percentage of the range */
  percent: ComputedRef<number>
  /** True when progress state cannot be determined */
  isIndeterminate: ComputedRef<boolean>
  /** Register a new segment and return its descriptor */
  register: (initial?: number) => ProgressSegment
}

export interface ProgressOptions {
  /** Initial value when no segments are registered. @default undefined */
  value?: number
  /** Minimum bound. @default 0 */
  min?: number
  /** Maximum bound. @default 100 */
  max?: number
}

export interface ProgressContextOptions extends ProgressOptions {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a progress instance with segment tracking.
 *
 * @param options The options for the progress instance.
 * @returns A progress context with segment registration.
 *
 * @example
 * ```ts
 * import { createProgress } from '@vuetify/v0'
 *
 * // Basic usage with a single segment
 * const progress = createProgress({ max: 100 })
 * const segment = progress.register(50)
 * progress.percent.value // 50
 *
 * // Indeterminate (no value, no segments)
 * const progress = createProgress()
 * progress.isIndeterminate.value // true
 * ```
 */
export function createProgress<
  P extends ProgressContext = ProgressContext,
> (_options: ProgressOptions = {}): P {
  const {
    value: _value,
    min: _min = 0,
    max: _max = 100,
  } = _options

  const _hasInitialValue = !isNullOrUndefined(_value)
  const _segments = shallowRef<Map<ID, ProgressSegment>>(new Map())

  const range = _max - _min

  const segments = computed<ProgressSegment[]>(() => Array.from(_segments.value.values()))

  const total = computed(() => {
    const map = _segments.value
    if (map.size === 0 && _hasInitialValue) {
      return clamp(_value!, _min, _max)
    }

    let sum = 0
    for (const segment of map.values()) {
      sum += segment.value.value
    }

    return clamp(sum, _min, _max)
  })

  const percent = computed(() => {
    if (range === 0) return 0
    return ((total.value - _min) / range) * 100
  })

  const isIndeterminate = computed(() => {
    return _segments.value.size === 0 && !_hasInitialValue
  })

  function register (initial = 0): ProgressSegment {
    const id = useId()
    const value = shallowRef(initial)

    const percent = computed(() => {
      if (range === 0) return 0
      return (value.value / range) * 100
    })

    const segment: ProgressSegment = {
      id,
      get index () {
        const entries = Array.from(_segments.value.keys())
        return entries.indexOf(id)
      },
      value,
      percent,
      unregister () {
        _segments.value.delete(id)
        triggerRef(_segments)
      },
    }

    _segments.value.set(id, segment)
    triggerRef(_segments)

    onScopeDispose(() => {
      segment.unregister()
    })

    return segment
  }

  return {
    segments,
    total,
    percent,
    isIndeterminate,
    register,
    get min () {
      return _min
    },
    get max () {
      return _max
    },
  } as P
}

/**
 * Creates a progress context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [useProgress, provideProgress, defaultContext]
 *
 * @example
 * ```ts
 * const [useProgress, provideProgressContext] = createProgressContext({ max: 100 })
 *
 * // Parent component
 * provideProgressContext()
 *
 * // Child component
 * const progress = useProgress()
 * const segment = progress.register(25)
 * ```
 */
export function createProgressContext<
  P extends ProgressContext = ProgressContext,
> (_options: ProgressContextOptions = {}): ContextTrinity<P> {
  const { namespace = 'v0:progress', ...options } = _options
  const [useProgressContext, _provideProgressContext] = createContext<P>(namespace)
  const context = createProgress<P>(options)

  function provideProgressContext (_context: P = context, app?: App): P {
    return _provideProgressContext(_context, app)
  }

  return createTrinity<P>(useProgressContext, provideProgressContext, context)
}

/**
 * Returns the current progress instance from context.
 *
 * @param namespace The namespace. @default 'v0:progress'
 * @returns The progress context.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useProgress } from '@vuetify/v0'
 *
 *   const progress = useProgress()
 * </script>
 *
 * <template>
 *   <div>{{ progress.percent.value }}%</div>
 * </template>
 * ```
 */
export function useProgress<
  P extends ProgressContext = ProgressContext,
> (namespace = 'v0:progress'): P {
  return useContext<P>(namespace)
}
