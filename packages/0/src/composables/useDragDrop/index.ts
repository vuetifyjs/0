/**
 * @module useDragDrop
 *
 * @see https://0.vuetifyjs.com/composables/system/use-drag-drop
 *
 * @remarks
 * Headless drag-and-drop primitive. Owns two registries (draggables and zones)
 * plus the active-drag state. Pointer and keyboard adapters ship by default;
 * lifecycle hooks and a plugin array provide extension points.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop()
 * ```
 */

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Adapters
import { KeyboardAdapter } from './adapters/keyboard'
import { PointerAdapter } from './adapters/pointer'

// Utilities
import { isArray, isFunction, isNull, useId } from '#v0/utilities'
import { computed, onScopeDispose, shallowRef, toRef, toValue } from 'vue'

// Types
import type {
  RegistryContext,
  RegistryTicket,
  RegistryTicketInput,
} from '#v0/composables/createRegistry'
import type { Extensible, ID } from '#v0/types'
import type { DragDropAdapterContext, DragDropAdapterEmit, DragDropAdapterInterface } from './adapters/adapter'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Re-exports
export { DragDropAdapter } from './adapters/adapter'
export type { DragDropAdapterContext, DragDropAdapterEmit, DragDropAdapterInterface } from './adapters/adapter'
export { PointerAdapter } from './adapters/pointer'
export { KeyboardAdapter } from './adapters/keyboard'
export type { PointerAdapterOptions } from './adapters/pointer'
export type { KeyboardAdapterOptions } from './adapters/keyboard'

export type Orientation = 'vertical' | 'horizontal'

export interface DragType {
  type: string
  value: unknown
}

export interface DropIndicator {
  index: number
  edge: 'before' | 'after'
  rect: DOMRect
}

export interface DropPosition {
  pointer: { x: number, y: number }
  index?: number
  indicator?: DropIndicator
}

interface ResolvedPosition {
  index: number
  edge: 'before' | 'after'
  rect: DOMRect
}

/**
 * Active drag state. Distributive over `K` so that narrowing `drag.type` also
 * narrows `drag.value` when `K` is a discriminated union.
 */
export type ActiveDrag<K extends DragType = DragType> = K extends DragType
  ? {
      id: ID
      type: K['type']
      value: K['value']
      origin: { x: number, y: number }
      current: { x: number, y: number }
      delta: { x: number, y: number }
      over: ID | null
      willAccept: boolean
      via: Extensible<'pointer' | 'keyboard'>
    }
  : never

/**
 * Input shape for a draggable. Distributive over `K` so unions narrow.
 */
export type DraggableTicketInput<K extends DragType = DragType> = K extends DragType
  ? RegistryTicketInput & {
    type: K['type']
    value: K['value']
    el: MaybeRefOrGetter<HTMLElement | null>
    disabled?: MaybeRefOrGetter<boolean>
    onBeforeStart?: (drag: ActiveDrag<K>) => boolean | void
    onMove?: (drag: ActiveDrag<K>) => void
    onCancel?: (drag: ActiveDrag<K>, reason: 'cancel' | 'reject') => void
  }
  : never

/**
 * Output shape for a draggable. Distributive over `K`.
 */
export type DraggableTicket<K extends DragType = DragType> = K extends DragType
  ? RegistryTicket & {
    type: K['type']
    value: K['value']
    el: Readonly<Ref<HTMLElement | null>>
    isDragging: Readonly<Ref<boolean>>
  }
  : never

export interface DropZoneTicketInput<K extends DragType = DragType>
  extends RegistryTicketInput {
  el: MaybeRefOrGetter<HTMLElement | null>
  accept?: K['type'][] | ((drag: ActiveDrag<K>) => boolean)
  orientation?: Orientation
  disabled?: MaybeRefOrGetter<boolean>
  onEnter?: (drag: ActiveDrag<K>) => void
  onLeave?: (drag: ActiveDrag<K>) => void
  onBeforeDrop?: (drag: ActiveDrag<K>, position: DropPosition) => boolean | void
  onDrop?: (drag: ActiveDrag<K>, position: DropPosition) => void
}

export interface DropZoneTicket extends RegistryTicket {
  el: Readonly<Ref<HTMLElement | null>>
  isOver: Readonly<Ref<boolean>>
  willAccept: Readonly<Ref<boolean>>
  indicator: Readonly<Ref<DropIndicator | null>>
}

export type DragDropPlugin<K extends DragType = DragType> = (
  context: DragDropContext<K>,
) => (() => void) | void

export interface DragDropOptions<K extends DragType = DragType> {
  adapters?: DragDropAdapterInterface<K>[]
  plugins?: DragDropPlugin<K>[]
  onBeforeStart?: (drag: ActiveDrag<K>) => boolean | void
  onMove?: (drag: ActiveDrag<K>) => void
  onBeforeDrop?: (drag: ActiveDrag<K>, position: DropPosition) => boolean | void
  onDrop?: (drag: ActiveDrag<K>, position: DropPosition) => void
  onCancel?: (drag: ActiveDrag<K>, reason: 'cancel' | 'reject') => void
}

export type DraggablesContext<K extends DragType = DragType> =
  Omit<RegistryContext<DraggableTicketInput<K>, DraggableTicket<K>>, 'register'> & {
    register: (input: DraggableTicketInput<K>) => DraggableTicket<K>
  }

export type ZonesContext<K extends DragType = DragType> =
  Omit<RegistryContext<DropZoneTicketInput<K>, DropZoneTicket>, 'register'> & {
    register: (input: DropZoneTicketInput<K>) => DropZoneTicket
  }

export interface DragDropContext<K extends DragType = DragType> {
  draggables: DraggablesContext<K>
  zones: ZonesContext<K>
  active: Readonly<ShallowRef<ActiveDrag<K> | null>>
  isDragging: Readonly<Ref<boolean>>
  cancel: () => void
}

function accepts<K extends DragType> (
  accept: DropZoneTicketInput<K>['accept'],
  drag: ActiveDrag<K> | null,
): boolean {
  if (!drag) return false
  if (!accept) return true
  if (isArray(accept)) return (accept as string[]).includes(drag.type)
  return Boolean(accept(drag))
}

/**
 * Pure math for resolving where in an oriented zone a pointer would drop.
 * Internal — consumers rely on the `position.index` / `position.indicator`
 * fields delivered to `onDrop`.
 */
function resolveDropPosition (
  point: { x: number, y: number },
  rects: readonly DOMRect[],
  orientation: Orientation,
): ResolvedPosition | null {
  if (rects.length === 0) return null

  const axis = orientation === 'vertical' ? 'y' : 'x'
  const start = orientation === 'vertical' ? 'top' : 'left'
  const end = orientation === 'vertical' ? 'bottom' : 'right'

  const coord = point[axis]

  if (coord < rects[0][start]) {
    return { index: 0, edge: 'before', rect: rects[0] }
  }

  const last = rects.at(-1)!
  if (coord > last[end]) {
    return { index: rects.length, edge: 'after', rect: last }
  }

  for (const [i, r] of rects.entries()) {
    if (coord >= r[start] && coord <= r[end]) {
      const mid = r[start] + (r[end] - r[start]) / 2
      if (coord < mid) {
        return { index: i, edge: 'before', rect: r }
      }
      return { index: i + 1, edge: 'after', rect: r }
    }
  }

  return { index: rects.length, edge: 'after', rect: last }
}

export function useDragDrop<K extends DragType = DragType> (
  options: DragDropOptions<K> = {},
): DragDropContext<K> {
  const { plugins = [] } = options

  const dragRegistry = createRegistry<DraggableTicketInput<K>, DraggableTicket<K>>({
    events: true,
  })

  const zoneRegistry = createRegistry<DropZoneTicketInput<K>, DropZoneTicket>({
    events: true,
  })

  const active = shallowRef<ActiveDrag<K> | null>(null)
  const isDragging = toRef(() => !isNull(active.value))

  const draggables: DraggablesContext<K> = {
    ...dragRegistry,
    register (input: DraggableTicketInput<K>): DraggableTicket<K> {
      const id = input.id ?? useId()
      const el = toRef(() => toValue(input.el))
      const dragging = toRef(() => active.value?.id === id)

      // Distributive types collapse to opaque conditionals when K is generic,
      // so cast through unknown — runtime shape is correct.
      const decorated = {
        ...input,
        id,
        el,
        isDragging: dragging,
      } as unknown as Partial<DraggableTicketInput<K> & DraggableTicket<K>>

      return dragRegistry.register(decorated) as DraggableTicket<K>
    },
  }

  const zones: ZonesContext<K> = {
    ...zoneRegistry,
    register (input: DropZoneTicketInput<K>): DropZoneTicket {
      const id = input.id ?? useId()
      const el = toRef(() => toValue(input.el))
      const isOver = toRef(() => active.value?.over === id)
      const willAccept = toRef(() => accepts(input.accept, active.value))
      // computed (not toRef) — caches getBoundingClientRect calls so each
      // active.value read isn't O(N children).
      const indicator = computed<DropIndicator | null>(() => {
        if (!input.orientation || !isOver.value || !active.value) return null
        const zoneEl = el.value
        if (!zoneEl) return null
        const childRects = Array.from(zoneEl.children).map(child => child.getBoundingClientRect())
        return resolveDropPosition(active.value.current, childRects, input.orientation)
      })

      const decorated = {
        ...input,
        id,
        el,
        isOver,
        willAccept,
        indicator,
      } as Partial<DropZoneTicketInput<K> & DropZoneTicket>

      return zoneRegistry.register(decorated) as DropZoneTicket
    },
  }

  function at (point: { x: number, y: number }): ID | null {
    if (!IN_BROWSER) return null
    let element: Element | null = document.elementFromPoint(point.x, point.y)
    while (element) {
      for (const zone of zoneRegistry.values()) {
        if (zone.el.value === element) return zone.id
      }
      element = element.parentElement
    }
    return null
  }

  function position (zoneId: ID, drag: ActiveDrag<K>): DropPosition {
    // .get() returns the output type; spread keeps input hooks at runtime, cast to read them.
    const zone = zoneRegistry.get(zoneId) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined
    const out: DropPosition = { pointer: drag.current }
    if (zone?.orientation && zone.el) {
      const zoneEl = toValue(zone.el)
      if (zoneEl) {
        const rects = Array.from(zoneEl.children).map(child => child.getBoundingClientRect())
        const resolved = resolveDropPosition(drag.current, rects, zone.orientation)
        if (resolved) {
          out.index = resolved.index
          out.indicator = resolved
        } else {
          // Empty oriented zone — index 0 with no indicator so consumers can splice without a fallback.
          out.index = 0
        }
      }
    }
    return out
  }

  function bail (drag: ActiveDrag<K>, reason: 'cancel' | 'reject' = 'cancel'): void {
    if (!isNull(drag.over)) {
      (zoneRegistry.get(drag.over) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined)?.onLeave?.(drag)
    }

    ;(dragRegistry.get(drag.id) as (DraggableTicketInput<K> & DraggableTicket<K>) | undefined)?.onCancel?.(drag, reason)
    options.onCancel?.(drag, reason)

    active.value = null
  }

  function onStart (
    source: DraggableTicket<K>,
    origin: { x: number, y: number },
    via: Extensible<'pointer' | 'keyboard'>,
  ): void {
    const draft: ActiveDrag<K> = {
      id: source.id,
      type: source.type,
      value: source.value,
      origin,
      current: origin,
      delta: { x: 0, y: 0 },
      over: null,
      willAccept: false,
      via,
    } as ActiveDrag<K>

    if ((dragRegistry.get(source.id) as (DraggableTicketInput<K> & DraggableTicket<K>) | undefined)?.onBeforeStart?.(draft) === false) return
    if (options.onBeforeStart?.(draft) === false) return

    active.value = draft
  }

  function onMove (point: { x: number, y: number }): void {
    if (!active.value) return

    const over = at(point)
    const next: ActiveDrag<K> = {
      ...active.value,
      current: point,
      delta: { x: point.x - active.value.origin.x, y: point.y - active.value.origin.y },
      over,
      willAccept: !isNull(over) && accepts((zoneRegistry.get(over) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined)?.accept, active.value),
    } as ActiveDrag<K>

    const previous = active.value.over
    active.value = next

    if (previous !== over) {
      if (!isNull(previous)) {
        (zoneRegistry.get(previous) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined)?.onLeave?.(next)
      }
      if (!isNull(over)) {
        (zoneRegistry.get(over) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined)?.onEnter?.(next)
      }
    }

    ;(dragRegistry.get(next.id) as (DraggableTicketInput<K> & DraggableTicket<K>) | undefined)?.onMove?.(next)
    options.onMove?.(next)
  }

  function onDrop (): void {
    if (!active.value) return
    const drag = active.value
    const zoneId = drag.over

    // Drop with no over-zone fires the cancel chain so onCancel rollback fires.
    if (isNull(zoneId)) {
      bail(drag)
      return
    }

    const dropAt = position(zoneId, drag)
    const zone = zoneRegistry.get(zoneId) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined

    const zoneVeto = zone?.onBeforeDrop?.(drag, dropAt) === false
    const globalVeto = options.onBeforeDrop?.(drag, dropAt) === false

    if (zoneVeto || globalVeto) {
      bail(drag, 'reject')
      return
    }

    zone?.onDrop?.(drag, dropAt)
    options.onDrop?.(drag, dropAt)

    active.value = null
  }

  function cancel (): void {
    if (!active.value) return
    bail(active.value)
  }

  // active is structurally identical to ShallowRef<ActiveDrag<K> | null> but
  // distributive conditional types are invariant in unresolved positions.
  const context: DragDropContext<K> = {
    draggables,
    zones,
    active: active as Readonly<ShallowRef<ActiveDrag<K> | null>>,
    isDragging,
    cancel,
  }

  const disposers: (() => void)[] = []

  const adapters = options.adapters ?? [new PointerAdapter<K>(), new KeyboardAdapter<K>()]

  const emit: DragDropAdapterEmit<K> = {
    start: (source, origin, via) => onStart(source, origin, via),
    move: point => onMove(point),
    drop: () => onDrop(),
    cancel: () => cancel(),
  }

  const adapterContext: DragDropAdapterContext<K> = { ...context, emit }

  for (const adapter of adapters) {
    adapter.setup(adapterContext)
    disposers.push(() => adapter.dispose())
  }

  for (const plugin of plugins) {
    const dispose = plugin(context)
    if (isFunction(dispose)) disposers.push(dispose)
  }

  onScopeDispose(() => {
    for (const dispose of disposers) dispose()
    dragRegistry.dispose()
    zoneRegistry.dispose()
    active.value = null
  })

  return context
}
