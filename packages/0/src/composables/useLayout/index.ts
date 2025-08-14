// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createContext } from '#v0/factories/createContext'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed, shallowReactive, shallowRef, onUnmounted, onMounted, getCurrentInstance, ref, watch } from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals.ts'

// Types
import type { Ref, ComputedRef, ShallowReactive, ShallowRef, App } from 'vue'
import type { GroupContext, GroupOptions, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export type ExposedElement = {
  element: HTMLElement | null
}

export interface LayoutTicket extends GroupTicket {
  order: number
  position: LayoutLocation
  value: number
  element?: Ref<ExposedElement | null>
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

  const sizes = shallowReactive(new Map<ID, number>())
  const height = shallowRef(0)
  const width = shallowRef(0)

  const bounds = {
    top: ref(0),
    bottom: ref(0),
    left: ref(0),
    right: ref(0),
  }

  const main = {
    x: computed(() => bounds.left.value),
    y: computed(() => bounds.top.value),
    width: computed(() => width.value - bounds.left.value - bounds.right.value),
    height: computed(() => height.value - bounds.top.value - bounds.bottom.value),
  }

  watch(sizes, () => {
    for (const position of ['top', 'bottom', 'left', 'right']) {
      sum(position as LayoutLocation)
    }
  })

  function sum (position: LayoutLocation): void {
    debugger
    let total = 0
    for (const item of registry.values()) {
      if (item.position === position && item.isActive.value) {
        total += sizes.get(item.id) ?? item.value ?? 0
      }
    }
    bounds[position].value = total
  }

  function register (registrantion: Partial<Z>): Z {
    const valueToCheck = ['top', 'bottom'].includes(registrantion.position!) ? 'offsetHeight' : 'offsetWidth'
    const value = computed(() => {
      return registrantion.element?.value?.element?.[valueToCheck] ?? registrantion.value
    })

    const item: Partial<Z> = {
      ...registrantion,
      order: registrantion.order ?? 0,
      value: value.value,
    }
    const ticket = registry.register(item)
    sizes.set(ticket.id, ticket.value)

    return ticket
  }

  function resize () {
    if (el?.value) {
      const rect = el.value.getBoundingClientRect()
      width.value = rect.width
      height.value = rect.height
      return
    }
    width.value = window.innerWidth
    height.value = window.innerHeight
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
      } else {
        window.removeEventListener('resize', resize)
      }
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
    resize,
  } as E
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
