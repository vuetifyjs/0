// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createContext } from '#v0/factories/createContext'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import {
  computed,
  shallowReactive,
  shallowRef,
  onUnmounted,
  onMounted,
  getCurrentInstance,
  ref,
  unref,
  watchEffect,
} from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals.ts'

// Types
import type { Ref, ComputedRef, ShallowReactive, ShallowRef, App } from 'vue'
import type { GroupContext, GroupOptions, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export interface LayoutTicket extends GroupTicket {
  order: number
  position: LayoutLocation
  value: number
  element?: ShallowRef<HTMLElement | null>
}

export interface LayoutContext<Z extends LayoutTicket> extends GroupContext<Z> {
  bounds: {
    top: Ref<number>
    bottom: Ref<number>
    left: Ref<number>
    right: Ref<number>
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
  left: ShallowRef<number>
  right: ShallowRef<number>
  top: ShallowRef<number>
  bottom: ShallowRef<number>
  resize: () => void
  register: (item?: Partial<Z>) => Z
}

export interface LayoutOptions extends GroupOptions {
  el?: Ref<HTMLElement | null>
}

export interface LayoutPlugin {
  install: (app: App, ...options: any[]) => any
}

export const [useLayoutContext, provideLayout] = createContext<LayoutContext<LayoutTicket>>('v0:layout')

export function useLayout (): LayoutContext<LayoutTicket> {
  return useLayoutContext()
}

export function createLayout<
  Z extends LayoutTicket = LayoutTicket,
  E extends LayoutContext<Z> = LayoutContext<Z>,
> (_options: LayoutOptions = {}): E {
  const {
    enroll = true,
    events = true,
    el = null,
    ...options
  } = _options

  const registry = useGroup<Z, E>({ enroll, events, ...options })

  const sizes = shallowReactive(new Map<ID, Ref<number> | number>())
  const height = shallowRef(0)
  const width = shallowRef(0)
  const left = shallowRef(0)
  const right = shallowRef(0)
  const top = shallowRef(0)
  const bottom = shallowRef(0)

  const bounds = {
    top: ref(0),
    bottom: ref(0),
    left: ref(0),
    right: ref(0),
  }

  const main = {
    x: computed(() => bounds.left.value + left.value),
    y: computed(() => bounds.top.value + top.value),
    width: computed(() => right.value - left.value - bounds.left.value - bounds.right.value),
    height: computed(() => bottom.value - top.value - bounds.top.value - bounds.bottom.value),
  }

  watchEffect(() => {
    for (const position of ['top', 'bottom', 'left', 'right']) {
      sum(position as LayoutLocation)
    }
  })

  function sum (position: LayoutLocation): void {
    let total = 0
    for (const item of registry.values()) {
      if (item.position === position && item.isActive.value) {
        total += unref(sizes.get(item.id)) ?? unref(item.value) ?? 0
      }
    }
    bounds[position].value = total
  }

  function register (registrant: Partial<Z>): Z {
    const valueToCheck = ['top', 'bottom'].includes(registrant.position!) ? 'offsetHeight' : 'offsetWidth'
    const value = computed(() => registrant.element?.value?.[valueToCheck] ?? registrant.value)

    const item: Partial<Z> = {
      ...registrant,
      position: registrant.position,
      order: registrant.order ?? 0,
      value,
    }
    const ticket = registry.register(item)
    sizes.set(ticket.id, ticket.value)

    return ticket
  }

  function resize () {
    if (el?.value) {
      const rect = el.value.getBoundingClientRect()
      left.value = rect.left
      top.value = rect.top
      right.value = rect.left + rect.width
      bottom.value = rect.top + rect.height
      width.value = rect.width
      height.value = rect.height
    } else {
      width.value = window.innerWidth
      height.value = window.innerHeight
      left.value = 0
      top.value = 0
      right.value = window.innerWidth
      bottom.value = window.innerHeight
    }
  }

  let observer: ResizeObserver | null = null

  if (IN_BROWSER && getCurrentInstance()) {
    onMounted(() => {
      if (el?.value) {
        observer = new ResizeObserver(resize)
        observer.observe(el.value)
      } else {
        window.addEventListener('resize', resize)
      }
      resize()
    })

    onUnmounted(() => {
      if (observer && el?.value) {
        observer.unobserve(el.value)
        observer.disconnect()
      }
      window.removeEventListener('resize', resize)
    })
  } else if (window.innerWidth) {
    window.addEventListener('resize', resize)
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
    resize,
    left,
    right,
    top,
    bottom,
  } as E
}

export function useLayoutItem<T extends Partial<LayoutTicket>> (options: T = {} as T, layoutContext?: LayoutContext<LayoutTicket> | null) {
  const layout = layoutContext ?? useLayout()

  const ticket = layout.register({ ...options })
  const value = ticket.value

  function makeCumulativeOffset (positions: string[] | string) {
    const posList = Array.isArray(positions) ? positions : [positions]

    function findOpposite (position: string) {
      switch (position) {
        case 'top': { return 'bottom' }
        case 'bottom': { return 'top' }
        case 'left': { return 'right' }
        case 'right': { return 'left' }
      }
    }

    return computed(() => {
      let offset = 0
      for (const current of layout.values()) {
        if (!posList.includes(current.position)) continue
        if (current.index >= ticket.index && (ticket.position !== findOpposite(current.position))) break

        offset += unref(current.value)
      }
      return offset
    })
  }

  const cumulativeXOffset = makeCumulativeOffset('left')
  const cumulativeRightOffset = makeCumulativeOffset('right')
  const cumulativeYOffset = makeCumulativeOffset('top')
  const cumulativeBottomOffset = makeCumulativeOffset('bottom')
  const cumulativeHeightOffset = makeCumulativeOffset(['top', 'bottom'])
  const cumulativeWidthOffset = makeCumulativeOffset(['left', 'right'])

  const height = computed(() => {
    if (['top', 'bottom'].includes(ticket.position)) {
      return unref(value)
    }
    return layout.bottom.value - layout.top.value - cumulativeHeightOffset.value
  })
  const width = computed(() => {
    if (['left', 'right'].includes(ticket.position)) {
      return unref(value)
    }
    return layout.right.value - layout.left.value - cumulativeWidthOffset.value
  })
  const x = computed(() => {
    if (ticket.position === 'left') return layout.left.value + cumulativeXOffset.value
    if (ticket.position === 'right') return layout.right.value - width.value - cumulativeRightOffset.value
    return layout.right.value - width.value - cumulativeRightOffset.value
  })
  const y = computed(() => {
    if (ticket.position === 'top') return layout.top.value + cumulativeYOffset.value
    if (ticket.position === 'bottom') return layout.bottom.value - height.value - cumulativeBottomOffset.value
    return layout.bottom.value - height.value - cumulativeBottomOffset.value
  },
  )

  console.log(layout.bounds.bottom.value - layout.bounds.top.value)

  const rect = { x, y, width, height }

  return {
    ticket,
    rect,
  }
}

/**
 * Creates a Vue plugin for managing responsive layout with automatic updates.
 * This plugin sets up layout tracking and updates the context when the window
 * is resized, providing reactive layout state throughout the application.
 *
 * @param options Optional configuration for toggling layout items on automatically and
 * allowing events to be called.
 * @returns A Vue plugin object with install method.
 */

export function createLayoutPlugin (options: LayoutOptions = {}): LayoutPlugin {
  const layout = createLayout(options)

  return createPlugin<LayoutPlugin>({ namespace: 'v0:layout',
    provide: (app: App) => {
      provideLayout(layout, app)
    },
    setup: (app: App) => {
      app.mixin({
        mounted () {
          layout.resize()
        },
      })
    },
  })
}
