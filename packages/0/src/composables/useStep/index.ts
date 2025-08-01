// Factories
import { createTrinity } from '#v0/factories/createTrinity'
import { useContext } from '#v0/factories/createContext'

// Composables
import { createSingleContext } from '#v0/composables/useSingle'

// Types
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

export function createStepContext<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (
  namespace = 'v0:step',
  options?: StepOptions,
): ContextTrinity<E> {
  const [useStepContext, provideStepContext, registry] = createSingleContext<Z, E>(namespace, options)

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

  return createTrinity<E>(useStepContext, provideStepContext, context)
}

export function useStep (namespace = 'v0:step'): StepContext<StepTicket> {
  return useContext<StepContext<StepTicket>>(namespace)()
}
