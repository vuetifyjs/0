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
 * Creates a step selection context for managing collections where users can navigate through items sequentially.
 * This function extends the single selection functionality with stepping navigation.
 *
 * @param options Optional configuration for step behavior.
 * @template Z The type of items managed by the step selection.
 * @template E The type of the step selection context.
 * @returns The step selection context object.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-step
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
 * Creates a step selection registry context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the step selection registry context
 * @param options Optional configuration for step selection behavior.
 * @template Z The structure of the registry step selection items.
 * @template E The available methods for the step's context.
 * @returns A tuple containing the inject function, provide function, and the step selection context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-step
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
