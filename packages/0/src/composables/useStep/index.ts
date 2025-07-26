// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useSingle } from '#v0/composables/useSingle'

// Types
import type { BaseSingleContext, SingleOptions, SingleTicket } from '#v0/composables/useSingle'
import type { RegistryContext } from '#v0/composables/useRegistry'
import type { Reactive } from 'vue'
import type { ID } from '#v0/types'

export type StepTicket = SingleTicket

export type BaseStepContext = BaseSingleContext & {
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
  register: (item?: Partial<StepTicket>, id?: ID) => Reactive<StepTicket>
  selectedItem: Reactive<StepTicket | undefined>
}

export type StepContext = RegistryContext<StepTicket> & BaseStepContext

export type StepOptions = SingleOptions

/**
 * Creates a step registry for managing step selections within a specific namespace.
 * This function provides a way to navigate through steps in sequence with utility methods
 * for moving forward, backward, and jumping to specific steps.
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
) {
  const [useGroupContext, provideGroupContext, registry] = useSingle<Z, E>(namespace, options)

  function first () {
    if (registry.collection.size === 0) return

    const firstId = registry.lookup(0)
    if (firstId === undefined) return

    registry.selectedIds.clear()
    registry.selectedIds.add(firstId)
  }

  function last () {
    if (registry.collection.size === 0) return

    const lastIndex = registry.collection.size - 1
    const lastId = registry.lookup(lastIndex)
    if (lastId === undefined) return

    registry.selectedIds.clear()
    registry.selectedIds.add(lastId)
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

    while (id !== undefined && registry.collection.get(id)?.disabled && hops < length) {
      index = wrapped(length, index + direction)
      id = registry.lookup(index)
      hops++
    }

    if (id === undefined || hops === length) return

    registry.selectedIds.clear()
    registry.selectedIds.add(id)
  }

  return createTrinity<E>(useGroupContext, provideGroupContext, {
    ...registry,
    first,
    last,
    next,
    prev,
    step,
  } as E)
}
