// Composables
import { createSingleContext, useSingle } from '#v0/composables/useSingle'

// Types
import type { Ref } from 'vue'
import type { SingleContext, SingleOptions, SingleTicket } from '#v0/composables/useSingle'
import type { ContextTrinity } from '#v0/factories/createTrinity'

export interface StepTicket extends SingleTicket {}

export type StepContext<Z extends StepTicket> = SingleContext<Z> & {
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}

export interface StepOptions extends SingleOptions {}

/**
 * Creates a step selection context for managing collections where users can navigate through items sequentially.
 * This function extends the single selection functionality with stepping navigation.
 *
 * @param model Optional reactive model reference for two-way binding.
 * @param options Optional configuration for step behavior.
 * @param namespace Optional namespace for context sharing.
 * @template Z The type of items managed by the step selection.
 * @template E The type of the step selection context.
 * @returns The step selection context object.
 */
export function useStep<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (
  model?: Ref<unknown>,
  options?: StepOptions,
): E {
  const registry = useSingle<Z, E>(model, options)

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

  const context = {
    ...registry,
    first,
    last,
    next,
    prev,
    step,
  } as unknown as E

  return context
}

/**
 * Creates a step selection context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the step selection context.
 * @param options Optional configuration for step selection behavior.
 * @template Z The type of items managed by the step selection.
 * @template E The type of the step selection context.
 * @returns A tuple containing the inject function, provide function, and the step selection context.
 */
export function createStepContext<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (
  namespace = 'v0:step',
  options?: StepOptions,
): ContextTrinity<E> {
  return createSingleContext<Z, E>(namespace, options)
}
