// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed, shallowReactive, shallowRef, type ComputedRef, type Ref } from 'vue'

// Types
import type { BaseGroupContext, GroupTicket } from '#v0/composables/useGroup'
import type { ContextTrinity } from '#v0/factories/createTrinity'
import type { RegistryContext } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export type LayoutTicket = GroupTicket & {
  order: number
  position: LayoutLocation
  size: number
}

export type BaseLayoutContext<Z extends LayoutTicket = LayoutTicket> = BaseGroupContext<Z> & {
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
  register: (registrant: Partial<Z>, id?: ID) => Z
}

export type LayoutContext = RegistryContext<LayoutTicket> & BaseLayoutContext

export function useLayout<
  Z extends LayoutTicket = LayoutTicket,
  E extends LayoutContext = LayoutContext,
> (namespace: string): ContextTrinity<E> {
  const [useLayoutContext, provideLayoutContext, registry] = useGroup<Z, E>(namespace, {
    mandatory: 'eager',
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

  // function register (registrant: Partial<Z>, id?: ID): Z {
  //   const ticket = registry.register(registrant, id) as unknown as Z

  //   return ticket
  // }

  const context = {
    ...registry,
    // register,
    bounds,
    main,
    sizes,
    height,
    width,
  } as unknown as E

  return createTrinity<E>(useLayoutContext, provideLayoutContext, context)
}
