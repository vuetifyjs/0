/**
 * @module OverflowTypes
 *
 * @see https://0.vuetifyjs.com/components/semantic/overflow
 *
 * Shared types for Overflow components.
 */

// Types
import type { OverflowContext } from '#v0/composables/createOverflow'
import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export type OverflowPriority = 'start' | 'end'

export interface OverflowTicketInput extends RegistryTicketInput {
  /** Skip this item from capacity calculation; always rendered visibly */
  disabled?: MaybeRefOrGetter<boolean>
}

export interface OverflowTicket extends RegistryTicket {
  /** Whether this item is excluded from capacity math */
  disabled: Readonly<Ref<boolean>>
}

export interface OverflowRootContext {
  /** Overflow composable for width tracking and capacity */
  overflow: OverflowContext
  /** Registry of child Items */
  registry: RegistryContext<OverflowTicketInput, OverflowTicket>
  /** Side that keeps items when overflow occurs */
  priority: Readonly<Ref<OverflowPriority>>
  /** Whether truncation is disabled (everything renders) */
  disabled: Readonly<Ref<boolean>>
  /** Width of the indicator element (reserved from available space) */
  indicatorWidth: ShallowRef<number>
  /** Whether items currently overflow */
  isOverflowing: Readonly<Ref<boolean>>
  /** Compute visibility for a given index */
  isVisible: (index: number) => boolean
}
