// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useSingle } from '#v0/composables/useSingle'

// Types
import type { BaseSingleContext, SingleOptions, SingleTicket } from '#v0/composables/useSingle'
import type { RegistryContext } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/factories/createTrinity'

export type StepTicket = SingleTicket

export type BaseStepContext<Z extends StepTicket = StepTicket> = BaseSingleContext<Z> & {
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}

export type StepContext = RegistryContext<StepTicket> & BaseStepContext

export type StepOptions = SingleOptions

/**
 * Creates a step registry for managing step navigation within a specific namespace.
 * This function provides sequential navigation through steps with utility methods
 * for moving forward, backward, jumping to specific positions, and wrapping around disabled items.
 *
 * @param namespace The namespace for the step context.
 * @param options Optional configuration for the step behavior.
 * @template Z The type of the step items managed by the registry.
 * @template E The type of the step context.
 * @returns A tuple containing the inject function, provide function, and the step context.
 */
export function useStep<
  Z extends StepTicket = StepTicket,
  E extends StepContext = StepContext,
> (
  namespace: string,
  options?: StepOptions,
): ContextTrinity<E> {
  const [useStepContext, provideStepContext, registry] = useSingle<Z, E>(namespace, options)

  function first () {
    if (registry.collection.size === 0) return

    const first = registry.lookup(0)
    if (first === undefined) return

    registry.selectedIds.clear()
    registry.select(first)
  }

  function last () {
    if (registry.collection.size === 0) return

    const last = registry.lookup(registry.collection.size - 1)
    if (last === undefined) return

    registry.selectedIds.clear()
    registry.selectedIds.add(last)
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
    const length = registry.collection.size
    if (!length) return

    const direction = Math.sign(count || 1)
    let hops = 0
    let index = wrapped(length, registry.selectedIndex.value + count)
    let id = registry.lookup(index)

    while (id !== undefined && registry.find(id)?.disabled && hops < length) {
      index = wrapped(length, index + direction)
      id = registry.lookup(index)
      hops++
    }

    if (id === undefined || hops === length) return

    registry.selectedIds.clear()
    registry.select(id)
  }

  return createTrinity<E>(useStepContext, provideStepContext, {
    ...registry,
    first,
    last,
    next,
    prev,
    step,
  } as unknown as E)
}
