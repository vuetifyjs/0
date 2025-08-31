// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createContext } from '#v0/factories/createContext'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import {
  computed,
  shallowRef,
  onUnmounted,
  onMounted,
  getCurrentInstance,
  unref,
} from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals.ts'

// Types
import type { ComputedRef, ShallowRef, App } from 'vue'
import type { GroupContext, GroupOptions, GroupTicket } from '#v0/composables/useGroup'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export interface LayoutTicket extends GroupTicket {
  order: number
  position: LayoutLocation
  value: number
  element?: ShallowRef<HTMLElement | null>
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
  height: ShallowRef<number>
  width: ShallowRef<number>
  left: ShallowRef<number>
  right: ShallowRef<number>
  top: ShallowRef<number>
  bottom: ShallowRef<number>
  resize: () => void
}

export interface LayoutOptions extends GroupOptions {
  el?: ShallowRef<HTMLElement | null>
}

function isVertical (position: LayoutLocation) {
  return ['top', 'bottom'].includes(position)
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

  const height = shallowRef(0)
  const width = shallowRef(0)
  const left = shallowRef(0)
  const right = shallowRef(0)
  const top = shallowRef(0)
  const bottom = shallowRef(0)

  const main = {
    x: computed(() => bounds.left.value + left.value),
    y: computed(() => bounds.top.value + top.value),
    width: computed(() => right.value - left.value - bounds.left.value - bounds.right.value),
    height: computed(() => bottom.value - top.value - bounds.top.value - bounds.bottom.value),
  }

  const bounds = {
    top: computed(() => sum('top')),
    bottom: computed(() => sum('bottom')),
    left: computed(() => sum('left')),
    right: computed(() => sum('right')),
  }

  function sum (position: LayoutLocation): number {
    let total = 0
    for (const item of registry.values()) {
      if (item.position === position && item.isActive.value) {
        total += unref(item.value) ?? 0
      }
    }
    return total
  }

  function register (registrant: Partial<Z>): Z {
    const valueToCheck = isVertical(registrant.position!) ? 'offsetHeight' : 'offsetWidth'
    const value = computed(() => registrant.element?.value?.[valueToCheck] ?? registrant.value)

    return registry.register({
      ...registrant,
      position: registrant.position,
      order: registrant.order ?? 0,
      value,
    })
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

  return {
    ...registry,
    register,
    resize,
    bounds,
    main,
    height,
    width,
    left,
    right,
    top,
    bottom,
  } as E
}

export function useLayoutItem<Z extends Partial<LayoutTicket>> (
  options: Z = {} as Z,
  context?: LayoutContext<LayoutTicket> | null,
) {
  const layout = context ?? useLayout()

  const ticket = layout.register(options)
  const value = ticket.value

  const opposites = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }

  function makeCumulativeOffsets (ticket: LayoutTicket) {
    return computed(() => {
      const offsets = { left: 0, right: 0, top: 0, bottom: 0 }

      for (const current of layout.values()) {
        if (!current.isActive.value) continue
        if (current.index >= ticket.index && (ticket.position !== opposites[current.position])) break

        offsets[current.position] += unref(current.value)
      }

      return {
        ...offsets,
        height: offsets.top + offsets.bottom,
        width: offsets.left + offsets.right,
      }
    })
  }

  const cumulative = makeCumulativeOffsets(ticket)

  const height = computed(() => isVertical(ticket.position) ? unref(value) : layout.bottom.value - layout.top.value - cumulative.value.height)
  const width = computed(() => isVertical(ticket.position) ? layout.right.value - layout.left.value - cumulative.value.width : unref(value))
  const x = computed(() => (
    ticket.position === 'left'
      ? layout.left.value + cumulative.value.left
      : layout.right.value - width.value - cumulative.value.right
  ))
  const y = computed(() => (
    ticket.position === 'top'
      ? layout.top.value + cumulative.value.top
      : layout.bottom.value - height.value - cumulative.value.bottom
  ))

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

export function createLayoutPlugin (options: LayoutOptions = {}) {
  const layout = createLayout(options)

  return createPlugin({
    namespace: 'v0:layout',
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
