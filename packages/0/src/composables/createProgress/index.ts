/**
 * @module createProgress
 *
 * @see https://0.vuetifyjs.com/composables/semantic/create-progress
 *
 * @remarks
 * Progress composable built on createModel for segment tracking.
 *
 * Key features:
 * - Model-based segment registration (extends createModel)
 * - Computed total and percent from registered segments
 * - Value-driven indeterminate mode
 * - Compatible with useProxyModel for v-model bridging
 * - Trinity pattern for dependency injection
 *
 * Each segment is a model ticket with a ShallowRef<number> value.
 * All segments stay selected (multiple: true, enroll: true) so
 * selectedValues always reflects the full set of segment values.
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createModel } from '#v0/composables/createModel'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { clamp, isNullOrUndefined, isUndefined } from '#v0/utilities'
import { computed, isRef, shallowRef, toRef, toValue } from 'vue'

// Types
import type { ModelContext, ModelOptions, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, ShallowRef } from 'vue'

export interface ProgressTicketInput extends ModelTicketInput<ShallowRef<number>> {}

export type ProgressTicket = ModelTicket<ProgressTicketInput> & {
  percent: ComputedRef<number>
}

export interface ProgressContext extends Omit<
  ModelContext<ProgressTicketInput, ProgressTicket>,
  'selectedValues' | 'apply' | 'register'
> {
  readonly min: number
  readonly max: number
  segments: ComputedRef<ProgressTicket[]>
  selectedValues: ComputedRef<number[]>
  total: ComputedRef<number>
  percent: ComputedRef<number>
  isIndeterminate: ComputedRef<boolean>
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  register: (input?: { value?: number }) => ProgressTicket
}

export interface ProgressOptions extends ModelOptions {
  value?: number
  min?: number
  max?: number
}

export interface ProgressContextOptions extends ProgressOptions {
  namespace?: string
}

/**
 * Creates a progress instance with model-based segment tracking.
 *
 * @param options The options for the progress instance.
 * @returns A progress context with segment registration.
 *
 * @example
 * ```ts
 * import { createProgress } from '@vuetify/v0'
 *
 * const progress = createProgress({ max: 100 })
 * const segment = progress.register({ value: 50 })
 * progress.percent.value // 50
 * ```
 */
export function createProgress<
  P extends ProgressContext = ProgressContext,
> (_options: ProgressOptions = {}): P {
  const {
    value: _value,
    min = 0,
    max = 100,
    ...options
  } = _options

  const _hasInitialValue = !isNullOrUndefined(_value)
  const extent = max - min

  const model = createModel<ProgressTicketInput, ProgressTicket>({
    ...options,
    multiple: true,
    events: true,
  })

  let pending: number[] | null = null

  const segments = computed(() =>
    Array.from(model.selectedItems.value).toSorted((a, b) => a.index - b.index),
  )

  const selectedValues = computed(() => segments.value.map(t => toValue(t.value)))

  const total = toRef(() => {
    const values = selectedValues.value

    if (values.length === 0 && _hasInitialValue) {
      return clamp(_value!, min, max)
    }

    let sum = 0
    for (const v of values) {
      sum += v ?? 0
    }
    return clamp(sum, min, max)
  })

  const percent = toRef(() => {
    if (extent === 0) return 0
    return ((total.value - min) / extent) * 100
  })

  const isIndeterminate = toRef(() => {
    if (_hasInitialValue) return false
    const values = selectedValues.value
    if (values.length === 0) return true
    for (const v of values) {
      if ((v ?? 0) > 0) return false
    }
    return true
  })

  function register (input?: { value?: number }): ProgressTicket {
    const initialValue = input?.value
    const index = segments.value.length
    const pendingValue = pending?.[index]
    const val = isUndefined(pendingValue) ? (initialValue ?? 0) : pendingValue

    const ticket = model.register({
      value: shallowRef(val),
    })

    if (!model.selectedIds.has(ticket.id)) {
      model.selectedIds.add(ticket.id)
    }

    ticket.percent = computed(() => {
      if (extent === 0) return 0
      return (clamp(toValue(ticket.value) as number, 0, extent) / extent) * 100
    })

    if (pending && segments.value.length >= pending.length) {
      pending = null
    }

    return ticket
  }

  function apply (incoming: unknown[], _options?: { multiple?: boolean }): void {
    const clamped = incoming.map(v => clamp(Number(v), min, max))

    if (segments.value.length === 0) {
      pending = clamped
      return
    }

    for (const [index, element] of clamped.entries()) {
      const ticket = segments.value[index]
      if (!ticket || !isRef(ticket.value)) continue
      ticket.value.value = element!
    }
  }

  return {
    ...model,
    segments,
    selectedValues,
    total,
    percent,
    isIndeterminate,
    register,
    apply,
    get min () {
      return min
    },
    get max () {
      return max
    },
  } as unknown as P
}

/**
 * Creates a progress context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [useProgress, provideProgress, defaultContext]
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
 */
export function useProgress<
  P extends ProgressContext = ProgressContext,
> (namespace = 'v0:progress'): P {
  return useContext<P>(namespace)
}
