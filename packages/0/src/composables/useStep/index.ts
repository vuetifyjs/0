/**
 * @module useStep
 *
 * @remarks
 * Navigation composable that extends useSingle with first/last/next/prev/step methods.
 *
 * Key features:
 * - Circular navigation (wraps around at boundaries)
 * - Automatic disabled item skipping
 * - Arbitrary step counts (positive/negative)
 * - Perfect for wizards, carousels, onboarding flows
 *
 * Inheritance chain: useRegistry → useSelection → useSingle → useStep
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSingle } from '#v0/composables/useSingle'

// Types
import type { App } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { SingleContext, SingleContextOptions, SingleOptions, SingleTicket } from '#v0/composables/useSingle'

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

export interface StepContextOptions extends SingleContextOptions {}

/**
 * Creates a new step instance with circular navigation through items.
 *
 * Extends `createSingle` with `first()`, `last()`, `next()`, `prev()`, and `step(count)` methods
 * for sequential navigation. Automatically wraps around at boundaries (circular navigation).
 *
 * @param options The options for the step instance.
 * @template Z The type of the step ticket.
 * @template E The type of the step context.
 * @returns A new step instance with navigation methods.
 *
 * @remarks
 * **Key Features:**
 * - **Circular Navigation**: Wrapping at start/end boundaries
 * - **Disabled Item Skipping**: Automatically skips disabled items during navigation
 * - **Bidirectional**: Forward (`next`, positive `step`) and backward (`prev`, negative `step`)
 * - **Safe Edge Cases**: Handles empty registries and all-disabled scenarios gracefully
 *
 * **Navigation Methods:**
 * - `first()`: Select first non-disabled item
 * - `last()`: Select last non-disabled item
 * - `next()`: Move to next item (wraps to first)
 * - `prev()`: Move to previous item (wraps to last)
 * - `step(count)`: Move by `count` positions (negative for backward)
 *
 * **Wrapping Behavior:**
 * - Uses modulo arithmetic for circular wrapping: `((index % length) + length) % length`
 * - Works correctly with negative indexes and large step counts
 * - Continues searching if landing on disabled items (up to registry length iterations)
 * - Returns early if all items are disabled to prevent infinite loops
 *
 * **Inheritance Chain:**
 * `useRegistry` → `createSelection` → `createSingle` → `createStep`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-step
 *
 * @example
 * ```ts
 * import { createStep } from '@vuetify/v0'
 *
 * const wizard = createStep({ mandatory: true })
 *
 * wizard.onboard([
 *   { id: 'account', value: 'Account Info' },
 *   { id: 'payment', value: 'Payment Details' },
 *   { id: 'review', value: 'Review', disabled: true },
 *   { id: 'confirm', value: 'Confirmation' },
 * ])
 *
 * wizard.first() // Select 'account'
 * console.log(wizard.selectedId.value) // 'account'
 *
 * wizard.next() // Move to 'payment'
 * wizard.next() // Skip disabled 'review', move to 'confirm'
 * wizard.next() // Wrap around to 'account'
 *
 * wizard.step(-2) // Go back 2 steps (wraps correctly)
 * ```
 */
export function createStep<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (options?: StepOptions): E {
  const registry = createSingle<Z, E>(options)

  function first () {
    const ticket = registry.seek('first')
    if (ticket) registry.select(ticket.id)
  }

  function last () {
    const ticket = registry.seek('last')
    if (ticket) registry.select(ticket.id)
  }

  function next () {
    step(1)
  }

  function prev () {
    step(-1)
  }

  function wrapped (length: number, index: number) {
    return ((index % length) + length) % length
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
    get size () {
      return registry.size
    },
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
> (_options: StepContextOptions): ContextTrinity<E> {
  const { namespace, ...options } = _options
  const [useStepContext, _provideStepContext] = createContext<E>(namespace)
  const context = createStep<Z, E>(options)

  function provideStepContext (_context: E = context, app?: App): E {
    return _provideStepContext(_context, app)
  }

  return createTrinity<E>(useStepContext, provideStepContext, context)
}

/**
 * Returns the current step instance.
 *
 * @param namespace The namespace for the step context. Defaults to `'v0:step'`.
 * @returns The current step instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-step
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useStep } from '@vuetify/v0'
 *
 *   const wizard = useStep()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Current step: {{ wizard.selectedIndex }}</p>
 *     <button @click="wizard.next()">Next</button>
 *   </div>
 * </template>
 * ```
 */
export function useStep<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (namespace = 'v0:step'): E {
  return useContext<E>(namespace)
}
