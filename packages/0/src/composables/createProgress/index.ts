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

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createRegistry } from '#v0/composables/createRegistry'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { clamp, isNullOrUndefined, useId } from '#v0/utilities'
import { computed, shallowRef, toRef } from 'vue'

// Types
import type { RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref, ShallowRef } from 'vue'

export interface ProgressTicketInput extends RegistryTicketInput<ShallowRef<number>> {}

export type ProgressTicket = RegistryTicket<ShallowRef<number>> & {
  percent: ComputedRef<number>
}

export interface ProgressContext {
  min: number
  max: number
  segments: Ref<readonly ProgressTicket[]>
  total: Ref<number>
  percent: Ref<number>
  isIndeterminate: Ref<boolean>
  register: (input?: { value?: number }) => ProgressTicket
  unregister: (id: ID) => void
}

export interface ProgressOptions {
  value?: number
  min?: number
  max?: number
}

export interface ProgressContextOptions extends ProgressOptions {
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
 * const segment = progress.register({ value: 50 })
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
  const range = _max - _min

  const registry = createRegistry<ProgressTicket>({ reactive: true })

  function register (input?: { value?: number }): ProgressTicket {
    const id = useId()
    const value = shallowRef(input?.value ?? 0)

    const percent = computed(() => {
      if (range === 0) return 0
      return (value.value / range) * 100
    })

    const ticket = {
      id,
      value,
      percent,
    }

    const registered = registry.register(ticket as unknown as Partial<ProgressTicket>)
    registered.value = value
    registered.percent = percent

    return registered
  }

  const segments = toRef(() => registry.values())

  const total = toRef(() => {
    const values = registry.values()
    if (values.length === 0 && _hasInitialValue) {
      return clamp(_value!, _min, _max)
    }

    let sum = 0
    for (const segment of values) {
      sum += segment.value.value
    }

    return clamp(sum, _min, _max)
  })

  const percent = toRef(() => {
    if (range === 0) return 0
    return ((total.value - _min) / range) * 100
  })

  const isIndeterminate = toRef(() => {
    if (_hasInitialValue) return false
    const values = registry.values()
    if (values.length === 0) return true
    for (const seg of values) {
      if (seg.value.value > 0) return false
    }
    return true
  })

  return {
    ...registry,
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
  } as unknown as P
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
 * const segment = progress.register({ value: 25 })
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
