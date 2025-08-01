// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed, shallowReactive, shallowRef, type ComputedRef, type Ref, type Reactive } from 'vue'

// Types
import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
import type { ContextTrinity } from '#v0/factories/createTrinity'
import type { ID } from '#v0/types'
import { genId } from '#v0/utilities'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export interface LayoutTicket extends GroupTicket {
  order: number
  position: LayoutLocation
  size: number
}

export interface BaseLayoutContext<Z extends LayoutTicket> extends GroupContext<Z> {
  bounds: {
    top: ComputedRef<number>
    bottom: ComputedRef<number>
    left: ComputedRef<number>
    right: ComputedRef<number>
  }
  main: {
    x: ComputedRef<number>
    y: ComputedRef<number>
    width: ComputedRef<number>
    height: ComputedRef<number>
  }
  sizes: Map<ID, number>
  height: Ref<number>
  width: Ref<number>
}

export type LayoutContext<Z extends LayoutTicket> = BaseLayoutContext<Z>

export function useLayout<
  Z extends LayoutTicket = LayoutTicket,
  E extends BaseLayoutContext<Z> = LayoutContext<Z>,
> (namespace: string): ContextTrinity<E> {
  const [useLayoutContext, provideLayoutContext, registry] = useGroup<Z, E>(namespace, {
    mandatory: 'force',
  })

  const sizes = shallowReactive(new Map<ID, number>())
  const height = shallowRef(0)
  const width = shallowRef(0)

  const bounds = {
    top: computed(() => sum('top')),
    bottom: computed(() => sum('bottom')),
    left: computed(() => sum('left')),
    right: computed(() => sum('right')),
  }

  const main = {
    x: computed(() => bounds.left.value),
    y: computed(() => bounds.top.value),
    width: computed(() => width.value - bounds.left.value - bounds.right.value),
    height: computed(() => height.value - bounds.top.value - bounds.bottom.value),
  }

  function sum (position: LayoutLocation): number {
    let total = 0
    for (const item of registry.collection.values()) {
      if (item.position === position) {
        total += sizes.get(item.id) ?? item.size ?? 0
      }
    }
    return total
  }

  function register (registrant: Partial<Z>): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      position: registrant.position,
      size: registrant.size,
      order: registrant.order ?? 0,
      ...registrant,
      id,
    }

    const ticket = registry.register(item) as Reactive<Z>

    return ticket
  }

  const context = {
    ...registry,
    register,
    bounds,
    main,
    sizes,
    height,
    width,
  } as unknown as E

  return createTrinity<E>(useLayoutContext, provideLayoutContext, context)
}
