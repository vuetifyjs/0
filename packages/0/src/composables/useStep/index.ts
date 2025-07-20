// Composables
import { useSingle } from '../useSingle'
import { toSingleton } from '../toSingleton'

// Utilities
import { toRef } from 'vue'

// Types
import type { SingleContext, SingleOptions, SingleTicket } from '../useSingle'
import type { App, Ref } from 'vue'

export type StepTicket = SingleTicket

export type StepOptions = SingleOptions

export type StepContext = SingleContext & {
  selectedIndex: Ref<number>
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}

/**
 * Creates a step registrar for managing step selections within a specific namespace.
 * This function provides a way to navigate through steps in sequence with utility methods
 * for moving forward, backward, and jumping to specific steps.
 *
 * @param namespace The namespace for the step context.
 * @param options Optional configuration for the step behavior.
 * @template Z The type of the step tickets managed by the registrar.
 * @template E The type of the step context.
 * @returns A tuple containing the inject function, provide function, and the step context.
 */
export function useStep<
  Z extends StepTicket,
  E extends StepContext,
> (
  namespace: string,
  options?: StepOptions,
) {
  const [
    useGroupContext,
    provideGroupContext,
    registrar,
  ] = useSingle<Z, E>(namespace, options)

  const selectedIndex = toRef(() => registrar.selectedItem.value?.index ?? -1)

  function getIdByIndex (index: number) {
    for (const [id, item] of registrar.tickets) {
      if (item.index === index) return id
    }
    return undefined
  }

  function first () {
    if (registrar.tickets.size === 0) return

    const firstId = getIdByIndex(0)
    if (firstId === undefined) return

    registrar.selectedIds.clear()
    registrar.selectedIds.add(firstId)
  }

  function last () {
    if (registrar.tickets.size === 0) return

    const lastIndex = registrar.tickets.size - 1
    const lastId = getIdByIndex(lastIndex)
    if (lastId === undefined) return

    registrar.selectedIds.clear()
    registrar.selectedIds.add(lastId)
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
    const length = registrar.tickets.size
    if (!length) return

    const direction = Math.sign(count || 1)
    let hops = 0
    let index = wrapped(length, selectedIndex.value + count)
    let id = getIdByIndex(index)

    while (id !== undefined && registrar.tickets.get(id)?.disabled && hops < length) {
      index = wrapped(length, index + direction)
      id = getIdByIndex(index)
      hops++
    }

    if (id === undefined || hops === length) return

    registrar.selectedIds.clear()
    registrar.selectedIds.add(id)
  }

  const context = {
    ...registrar,
    selectedIndex,
    first,
    last,
    next,
    prev,
    step,
  } as E

  return toSingleton(
    useGroupContext,
    (model?: Ref<unknown | unknown[]>, _context: E = context, app?: App): E => {
      provideGroupContext(model, _context, app)

      return _context
    },
    context,
  )
}
