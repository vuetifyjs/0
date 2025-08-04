// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed, shallowReactive, shallowRef, onUnmounted, onMounted, getCurrentInstance } from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals.ts'

// Types
import type { ComputedRef, ShallowReactive, ShallowRef } from 'vue'
import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export interface LayoutTicket extends GroupTicket {
  order: number
  position: LayoutLocation
  value: number
}

export interface LayoutContext<Z extends LayoutTicket> extends GroupContext<Z> {
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
  sizes: ShallowReactive<Map<ID, number>>
  height: ShallowRef<number>
  width: ShallowRef<number>
}

export function useLayout<
  Z extends LayoutTicket = LayoutTicket,
  E extends LayoutContext<Z> = LayoutContext<Z>,
> (): E {
  const registry = useGroup<Z, E>()

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
        total += sizes.get(item.id) ?? item.value ?? 0
      }
    }
    return total
  }

  function register (registrant: Partial<Z>): Z {
    const item: Partial<Z> = {
      position: registrant.position,
      order: registrant.order ?? 0,
      ...registrant,
    }

    const ticket = registry.register(item)

    sizes.set(ticket.id, ticket.value)

    return ticket
  }

  if (IN_BROWSER && getCurrentInstance()) {
    function resize () {
      height.value = window.innerHeight
      width.value = window.innerWidth
    }

    onMounted(() => {
      resize()
      window.addEventListener('resize', resize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resize)
    })
  }

  registry.on('unregister', (item: Z) => {
    sizes.delete(item.id)
  })

  return {
    ...registry,
    register,
    bounds,
    main,
    sizes,
    height,
    width,
  } as E
}
