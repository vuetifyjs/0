// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Types
import type { BaseSingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ContextTrinity } from '#v0/factories/createTrinity'
import type { RegistryContext } from '#v0/composables/useRegistry'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export type LayoutTicket = SingleTicket & {
  order: number
  position: LayoutLocation
}

export type BaseLayoutContext<Z extends LayoutTicket = LayoutTicket> = BaseSingleContext<Z> & {

}

export type LayoutContext = RegistryContext<LayoutTicket> & BaseLayoutContext

export function useLayout<
  Z extends LayoutTicket = LayoutTicket,
  E extends LayoutContext = LayoutContext,
> (namespace: string): ContextTrinity<E> {}
