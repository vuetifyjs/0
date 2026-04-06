/**
 * @module createProgress
 *
 * @see https://0.vuetifyjs.com/composables/semantic/create-progress
 *
 * @remarks
 * Progress composable built on createModel for segment tracking.
 *
 * Each segment is a model ticket with a ShallowRef<number> value.
 * All segments stay selected (multiple: true, enroll: true) so
 * selectedValues always reflects the full set of segment values.
 * Compatible with useProxyModel for v-model bridging.
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createModel } from '#v0/composables/createModel'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { clamp, isNullOrUndefined, isUndefined } from '#v0/utilities'
import { computed, isRef, shallowRef, toRef, toValue } from 'vue'

// Types
import type { ModelContext, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, Ref, ShallowRef } from 'vue'

export type ProgressTicketInput = ModelTicketInput<ShallowRef<number>>
export type ProgressTicket = ModelTicket<ProgressTicketInput>

export interface ProgressOptions {
  value?: number
  min?: number
  max?: number
}

export interface ProgressContext extends ModelContext<ProgressTicketInput, ProgressTicket> {
  readonly min: number
  readonly max: number
  segments: ComputedRef<ProgressTicket[]>
  total: Readonly<Ref<number>>
  percent: Readonly<Ref<number>>
  isIndeterminate: Readonly<Ref<boolean>>
  fromValue: (value: number) => number
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
export function createProgress (options: ProgressOptions = {}): ProgressContext {
  const {
    value: _value,
    min = 0,
    max = 100,
  } = options

  const _hasInitialValue = !isNullOrUndefined(_value)
  const extent = max - min

  const model = createModel<ProgressTicketInput, ProgressTicket>({
    multiple: true,
    events: true,
  })

  let pending: number[] | null = null

  const segments = computed(() =>
    Array.from(model.selectedItems.value).toSorted((a, b) => a.index - b.index),
  )

  const total = toRef(() => {
    const segs = segments.value

    if (segs.length === 0 && _hasInitialValue) {
      return clamp(_value!, min, max)
    }

    let sum = 0
    for (const seg of segs) {
      sum += toValue(seg.value) ?? 0
    }
    return clamp(sum, min, max)
  })

  const percent = toRef(() => {
    if (extent === 0) return 0
    return ((total.value - min) / extent) * 100
  })

  const isIndeterminate = toRef(() => {
    if (_hasInitialValue) return false
    const segs = segments.value
    if (segs.length === 0) return true
    for (const seg of segs) {
      if ((toValue(seg.value) ?? 0) > 0) return false
    }
    return true
  })

  function fromValue (value: number): number {
    if (extent === 0) return 0
    return (clamp(value, 0, extent) / extent) * 100
  }

  function register (registration: Partial<ProgressTicketInput> = {}): ProgressTicket {
    const index = segments.value.length
    const pendingValue = pending?.[index]
    const val = isUndefined(pendingValue) ? 0 : pendingValue

    const ticket = model.register({
      ...registration,
      value: registration.value ?? shallowRef(val),
    })

    if (!model.selectedIds.has(ticket.id)) {
      model.selectedIds.add(ticket.id)
    }

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
    total,
    percent,
    isIndeterminate,
    fromValue,
    register,
    apply,
    min,
    max,
  } as unknown as ProgressContext
}

/**
 * Creates a progress context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [useProgress, provideProgress, defaultContext]
 */
export function createProgressContext (_options: ProgressContextOptions = {}): ContextTrinity<ProgressContext> {
  const { namespace = 'v0:progress', ...options } = _options
  const [use, _provide] = createContext<ProgressContext>(namespace)
  const context = createProgress(options)

  function provide (_context: ProgressContext = context, app?: App): ProgressContext {
    return _provide(_context, app)
  }

  return createTrinity<ProgressContext>(use, provide, context)
}

/**
 * Returns the current progress instance from context.
 *
 * @param namespace The namespace. @default 'v0:progress'
 * @returns The progress context.
 */
export function useProgress (namespace = 'v0:progress'): ProgressContext {
  return useContext<ProgressContext>(namespace)
}
