// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useSingle } from '#v0/composables/useSingle'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { SingleContext, SingleOptions, SingleTicket } from '#v0/composables/useSingle'

export interface StepTicket extends SingleTicket {}

export interface StepContext<Z extends StepTicket> extends SingleContext<Z> {
  /** Select the first Ticket in the collection */
  first: () => void
  /** Select the last Ticket in the collection */
  last: () => void
  /** Select the next Ticket based on current index */
  next: () => void
  /** Select the previous Ticket based on current index */
  prev: () => void
  /** Step through the collection by a given count */
  step: (count: number) => void
}

export interface StepOptions extends SingleOptions {}

/**
 * Creates a new step instance.
 *
 * @param options The options for the step instance.
 * @template Z The type of the step ticket.
 * @template E The type of the step context.
 * @returns A new step instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-step
 *
 * @example
 * ```ts
 * import { useStep } from '@vuetify/v0'
 *
 * const stepper = useStep()
 *
 * stepper.onboard([
 *   { id: 'step-1', value: 'Account Info' },
 *   { id: 'step-2', value: 'Payment' },
 *   { id: 'step-3', value: 'Confirmation' },
 * ])
 *
 * stepper.first()
 * stepper.next() // Move to step-2
 *
 * console.log(stepper.selectedIndex.value) // 1
 * ```
 */
export function useStep<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (options?: StepOptions): E {
  const registry = useSingle<Z, E>(options)

  function first () {
    if (registry.size === 0) return

    registry.selectedIds.clear()
    registry.select(registry.lookup(0)!)
  }

  function last () {
    const size = registry.size
    if (size === 0) return

    registry.selectedIds.clear()
    registry.select(registry.lookup(size - 1)!)
  }

  function next () {
    step(1)
  }

  function prev () {
    step(-1)
  }

  function wrapped (length: number, index: number) {
    return (index + length) % length
  }

  function step (count = 1) {
    const length = registry.size
    if (!length) return

    const direction = Math.sign(count || 1)
    let hops = 0
    let index = wrapped(length, registry.selectedIndex.value + count)
    let id = registry.lookup(index)

    while (id !== undefined && registry.get(id)?.disabled && hops < length) {
      index = wrapped(length, index + direction)
      id = registry.lookup(index)
      hops++
    }

    if (id === undefined || hops === length) return

    registry.selectedIds.clear()
    registry.select(id)
  }

  return {
    ...registry,
    first,
    last,
    next,
    prev,
    step,
  } as E
}

/**
 * Creates a new step context.
 *
 * @param namespace The namespace for the step context.
 * @param options The options for the step context.
 * @template Z The type of the step ticket.
 * @template E The type of the step context.
 * @returns A new step context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-step
 *
 * @example
 * ```ts
 * import { createStepContext } from '@vuetify/v0'
 *
 * export const [useWizard, provideWizard, wizard] = createStepContext('wizard')
 *
 * // In a parent component:
 * provideWizard()
 *
 * // In a child component:
 * const wizard = useWizard()
 * wizard.next() // Progress to next step
 * ```
 */
export function createStepContext<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (
  namespace: string,
  options?: StepOptions,
): ContextTrinity<E> {
  const [useStepContext, _provideStepContext] = createContext<E>(namespace)
  const context = useStep<Z, E>(options)

  function provideStepContext (_context: E = context, app?: any): E {
    return _provideStepContext(_context, app)
  }

  return createTrinity<E>(useStepContext, provideStepContext, context)
}
