/**
 * @module useStep
 *
 * @remarks
 * Navigation composable that extends useSingle with first/last/next/prev/step methods.
 *
 * Key features:
 * - Configurable circular or bounded navigation
 * - Automatic disabled item skipping
 * - Arbitrary step counts (positive/negative)
 * - Perfect for wizards, carousels, pagination, onboarding flows
 *
 * Inheritance chain: useRegistry → useSelection → useSingle → useStep
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSingle } from '#v0/composables/useSingle'

// Utilities
import { toValue } from 'vue'
import { isUndefined } from '#v0/utilities'

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

export interface StepOptions extends SingleOptions {
  /**
   * Enable circular navigation (wrapping at boundaries).
   * - true: Navigation wraps around (carousel behavior)
   * - false: Navigation stops at boundaries (pagination behavior)
   * @default false
   */
  circular?: boolean
}

export interface StepContextOptions extends SingleContextOptions {
  /**
   * Enable circular navigation (wrapping at boundaries).
   * - true: Navigation wraps around (carousel behavior)
   * - false: Navigation stops at boundaries (pagination behavior)
   * @default false
   */
  circular?: boolean
}

/**
 * Creates a new step instance with navigation through items.
 *
 * Extends `createSingle` with `first()`, `last()`, `next()`, `prev()`, and `step(count)` methods
 * for sequential navigation. Supports both circular (wrapping) and bounded (stopping at edges) modes.
 *
 * @param options The options for the step instance.
 * @template Z The type of the step ticket.
 * @template E The type of the step context.
 * @returns A new step instance with navigation methods.
 *
 * @remarks
 * **Key Features:**
 * - **Configurable Navigation**: `circular: true` for wrapping, `false` for bounded (default: false)
 * - **Disabled Item Skipping**: Automatically skips disabled items during navigation
 * - **Bidirectional**: Forward (`next`, positive `step`) and backward (`prev`, negative `step`)
 * - **Safe Edge Cases**: Handles empty registries and all-disabled scenarios gracefully
 *
 * **Navigation Methods:**
 * - `first()`: Select first non-disabled item
 * - `last()`: Select last non-disabled item
 * - `next()`: Move to next item (wraps if circular, stops at end if bounded)
 * - `prev()`: Move to previous item (wraps if circular, stops at start if bounded)
 * - `step(count)`: Move by `count` positions (negative for backward)
 *
 * **Circular Mode (`circular: true`):**
 * - Uses modulo arithmetic for wrapping: `((index % length) + length) % length`
 * - Works correctly with negative indexes and large step counts
 * - Perfect for carousels, theme switchers, infinite scrolling
 *
 * **Bounded Mode (`circular: false`, default):**
 * - Navigation stops at boundaries (no wrapping)
 * - `next()` on last item does nothing
 * - `prev()` on first item does nothing
 * - Perfect for pagination, wizards with explicit completion, forms
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
 * // Bounded navigation (default) - for pagination
 * const pagination = createStep({ circular: false })
 * pagination.onboard([
 *   { id: 'page-1', value: 1 },
 *   { id: 'page-2', value: 2 },
 *   { id: 'page-3', value: 3 },
 * ])
 * pagination.first() // Select page 1
 * pagination.prev() // Does nothing (already at first)
 * pagination.next() // Select page 2
 *
 * // Circular navigation - for carousels
 * const carousel = createStep({ circular: true })
 * carousel.onboard([
 *   { id: 'slide-1', value: 'First' },
 *   { id: 'slide-2', value: 'Second' },
 *   { id: 'slide-3', value: 'Third' },
 * ])
 * carousel.first()
 * carousel.prev() // Wraps to 'slide-3'
 * carousel.next() // Wraps to 'slide-1'
 * ```
 */
export function createStep<
  Z extends StepTicket = StepTicket,
  E extends StepContext<Z> = StepContext<Z>,
> (_options: StepOptions = {}): E {
  const { circular = false, ...options } = _options
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

    const currentIndex = registry.selectedIndex.value
    const direction = Math.sign(count || 1)
    let hops = 0
    let index = circular
      ? wrapped(length, currentIndex + count)
      : currentIndex + count

    if (!circular && (index < 0 || index >= length)) return

    let id = registry.lookup(index)

    while (!isUndefined(id) && toValue(registry.get(id)?.disabled) && hops < length) {
      index = circular
        ? wrapped(length, index + direction)
        : index + direction

      if (!circular && (index < 0 || index >= length)) return

      id = registry.lookup(index)
      hops++
    }

    if (isUndefined(id) || hops === length) return

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
