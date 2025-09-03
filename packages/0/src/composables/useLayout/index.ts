// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createContext, useContext } from '#v0/factories/createContext'
import { createTrinity } from '#v0/factories/createTrinity'

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
import type { ContextTrinity } from '#v0/factories'

export type LayoutLocation = 'top' | 'bottom' | 'left' | 'right'

export interface LayoutTicket extends GroupTicket {
  order: number
  position: LayoutLocation
  value: number
  size: ComputedRef<number>
  element?: ShallowRef<HTMLElement | null>
  cumulative: ComputedRef<{
    top: number
    bottom: number
    left: number
    right: number
    height: number
    width: number
  }>
  x: ComputedRef<number>
  y: ComputedRef<number>
  width: ComputedRef<number>
  height: ComputedRef<number>
  rect: {
    x: ComputedRef<number>
    y: ComputedRef<number>
    width: ComputedRef<number>
    height: ComputedRef<number>
  }
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

/**
 * Creates a layout registry for managing layout selections
 *
 * @param _options
 * @returns
 */
export function createLayout<
  Z extends LayoutTicket = LayoutTicket,
  E extends LayoutContext<Z> = LayoutContext<Z>,
> (
  namespace = 'v0:layout',
  _options: LayoutOptions = {},
): ContextTrinity<E> {
  const {
    enroll = true,
    events = true,
    el = null,
    ...options
  } = _options

  const [useLayoutContext, _provideLayoutContext] = createContext<E>(namespace)
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

  function sum (position: LayoutLocation) {
    let total = 0
    for (const item of registry.values()) {
      if (item.position === position && item.isActive.value) {
        const value = item.size ?? item.value
        total += unref(value) ?? 0
      }
    }
    return total
  }

  const opposites: Record<LayoutLocation, LayoutLocation> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }

  function register (registrant: Partial<Z>): Z {
    const valueProp = isVertical(registrant.position!) ? 'offsetHeight' : 'offsetWidth'
    const size = computed(() => {
      const el = registrant.element?.value

      // Check is ref is wrapped by defineExpose, pull first available HTMLElement
      if (el && typeof el === 'object') {
        for (const key in el) {
          const candidate = unref((el as any)[key])
          if (candidate instanceof HTMLElement) {
            return candidate[valueProp as keyof HTMLElement] ?? registrant.value ?? 0
          }
        }
      }

      const direct = unref(registrant.element)
      if (direct instanceof HTMLElement) {
        return direct[valueProp as keyof HTMLElement] ?? registrant.value ?? 0
      }

      return registrant.value ?? 0
    })

    const ticket = registry.register({
      ...registrant,
      position: registrant.position!,
      order: registrant.order ?? 0,
      size,
    }) as Z

    const cumulative = computed(() => {
      const offsets = { left: 0, right: 0, top: 0, bottom: 0 }
      for (const current of registry.values()) {
        if (!current.isActive.value) continue
        if (current.index >= ticket.index && (ticket.position !== opposites[current.position])) break
        offsets[current.position] += unref(current.size) ?? unref(current.value)
      }

      return {
        ...offsets,
        height: offsets.top + offsets.bottom,
        width: offsets.left + offsets.right,
      }
    })
    const height = computed(() => isVertical(ticket.position) ? unref(ticket.size ?? ticket.value) : bottom.value - top.value - cumulative.value.height)
    const width = computed(() => isVertical(ticket.position) ? right.value - left.value - cumulative.value.width : unref(ticket.size ?? ticket.value))
    const x = computed(() => (
      ticket.position === 'left'
        ? left.value + cumulative.value.left
        : (
            ticket.position === 'right'
              ? right.value - width.value - cumulative.value.right
              : left.value + cumulative.value.left
          )
    ))
    const y = computed(() => (
      ticket.position === 'top'
        ? top.value + cumulative.value.top
        : (
            ticket.position === 'bottom'
              ? bottom.value - height.value - cumulative.value.bottom
              : top.value + cumulative.value.top
          )
    ))

    Object.assign(ticket, {
      cumulative,
      x,
      y,
      width,
      height,
      rect: { x, y, width, height },
    })

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

  const context = {
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

  function provideLayoutContext (_context: E = context, app?: App): E {
    return _provideLayoutContext(_context, app)
  }

  return createTrinity<E>(useLayoutContext, provideLayoutContext, context)
}

/**
 * Simple hook to access the layout context.
 *
 * @returns The layout context containing current layout state and utilities.
 */
export function useLayout (): LayoutContext<LayoutTicket> {
  return useContext<LayoutContext<LayoutTicket>>('v0:layout')()
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

export function createLayoutPlugin<
  Z extends LayoutTicket = LayoutTicket,
  E extends LayoutContext<Z> = LayoutContext<Z>,
> (options: LayoutOptions = {}) {
  const [, provideLayoutContext, layoutContext] = createLayout<Z, E>('v0:layout', options)

  return createPlugin({
    namespace: 'v0:layout',
    provide: (app: App) => {
      provideLayoutContext(layoutContext, app)
    },
    setup: (app: App) => {
      app.mixin({
        mounted () {
          layoutContext.resize()
        },
      })
    },
  })
}
