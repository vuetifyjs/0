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
import { useLogger } from '#v0/composables/useLogger'
import { useMutationObserver } from '#v0/composables/useMutationObserver'
import { useResizeObserver } from '#v0/composables/useResizeObserver'

// Adapters
import { KeyboardAdapter, PointerAdapter } from './adapters'

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
import type { DragDropAdapterContext, DragDropAdapterEmit, DragDropAdapterInterface } from './adapters'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Exports
export { DragDropAdapter, KeyboardAdapter, PointerAdapter } from './adapters'
export type {
  DragDropAdapterContext,
  DragDropAdapterEmit,
  DragDropAdapterInterface,
  KeyboardAdapterOptions,
  PointerAdapterOptions,
} from './adapters'

/**
 * Layout axis a drop zone resolves indices along.
 */
export type Orientation = 'vertical' | 'horizontal'

/**
 * Discriminated payload describing what is being dragged. Consumers extend
 * this with concrete `type` literals plus a matching `value`.
 */
export interface DragType {
  type: string
  value: unknown
}

/**
 * Resolved drop slot inside an oriented zone. Surfaced via {@link DropPosition}
 * so consumers can render a between-children indicator.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: string }>()
 * const zone = dnd.zones.register({ el, accept: ['card'], orientation: 'vertical' })
 *
 * zone.indicator.value // DropIndicator | null
 * ```
 */
export interface DropIndicator {
  index: number
  edge: 'before' | 'after'
  rect: DOMRect
}

/**
 * Position passed to drop hooks. `index` and `indicator` are populated for
 * oriented zones; unoriented zones receive only the pointer location.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * dnd.zones.register({
 *   el,
 *   accept: ['card'],
 *   orientation: 'vertical',
 *   onDrop: (drag, position) => {
 *     const target = position.index ?? items.length
 *     items.splice(target, 0, drag.value)
 *   },
 * })
 * ```
 */
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
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * type Cards = { type: 'card', value: Card } | { type: 'column', value: Column }
 *
 * const dnd = useDragDrop<Cards>()
 *
 * dnd.zones.register({
 *   el,
 *   onEnter: drag => {
 *     if (drag.type === 'card') drag.value.title // narrowed to Card
 *   },
 * })
 * ```
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
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * dnd.draggables.register({
 *   el: cardRef,
 *   type: 'card',
 *   value: card,
 *   onBeforeStart: drag => !drag.value.locked,
 * })
 * ```
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
 * Output shape for a draggable. Non-distributive — `K` resolves once at the
 * registration site.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * const ticket = dnd.draggables.register({ el, type: 'card', value: card })
 *
 * ticket.isDragging.value // boolean
 * ticket.value           // Card
 * ```
 */
export interface DraggableTicket<K extends DragType = DragType> extends RegistryTicket {
  type: K['type']
  value: K['value']
  el: Readonly<Ref<HTMLElement | null>>
  isDragging: Readonly<Ref<boolean>>
}

/**
 * Input shape for a drop zone.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * dnd.zones.register({
 *   el: listRef,
 *   accept: ['card'],
 *   orientation: 'vertical',
 *   onDrop: (drag, position) => items.splice(position.index ?? 0, 0, drag.value),
 * })
 * ```
 */
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

/**
 * Output shape for a drop zone.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * const zone = dnd.zones.register({ el, accept: ['card'] })
 *
 * zone.isOver.value      // boolean
 * zone.willAccept.value  // boolean
 * zone.indicator.value   // DropIndicator | null
 * ```
 */
export interface DropZoneTicket extends RegistryTicket {
  el: Readonly<Ref<HTMLElement | null>>
  isOver: Readonly<Ref<boolean>>
  willAccept: Readonly<Ref<boolean>>
  indicator: Readonly<Ref<DropIndicator | null>>
}

/**
 * Plugin signature. Receives the public context, optionally returns a
 * disposer that runs on scope teardown.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 * import type { DragDropPlugin } from '@vuetify/v0'
 *
 * const logDrops: DragDropPlugin = context => {
 *   const off = context.zones.on('register:ticket', ticket => console.log('zone', ticket.id))
 *   return () => off()
 * }
 *
 * const dnd = useDragDrop({ plugins: [logDrops] })
 * ```
 */
export type DragDropPlugin<K extends DragType = DragType> = (
  context: DragDropContext<K>,
) => (() => void) | void

/**
 * Options accepted by {@link useDragDrop}.
 *
 * @example
 * ```ts
 * import { useDragDrop, PointerAdapter } from '@vuetify/v0'
 *
 * const dnd = useDragDrop({
 *   adapters: [new PointerAdapter()],
 *   onDrop: (drag, position) => console.log('drop', drag, position),
 * })
 * ```
 */
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
  Omit<RegistryContext<DraggableTicketInput<K>, DraggableTicketInput<K> & DraggableTicket<K>>, 'register'> & {
    register: (registration: DraggableTicketInput<K>) => DraggableTicket<K>
  }

export type ZonesContext<K extends DragType = DragType> =
  Omit<RegistryContext<DropZoneTicketInput<K>, DropZoneTicketInput<K> & DropZoneTicket>, 'register'> & {
    register: (registration: DropZoneTicketInput<K>) => DropZoneTicket
  }

/**
 * Public context returned by {@link useDragDrop}.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * dnd.active.value     // ActiveDrag<{ type: 'card', value: Card }> | null
 * dnd.isDragging.value // boolean
 * dnd.cancel()         // programmatic cancel
 * ```
 */
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

  for (const [index, rect] of rects.entries()) {
    if (coord >= rect[start] && coord <= rect[end]) {
      const mid = rect[start] + (rect[end] - rect[start]) / 2
      if (coord < mid) {
        return { index, edge: 'before', rect }
      }
      return { index: index + 1, edge: 'after', rect }
    }
  }

  return { index: rects.length, edge: 'after', rect: last }
}

/**
 * Create a headless drag-and-drop context.
 *
 * @param options - Adapters, plugins, and lifecycle hooks. All optional.
 * @returns A `DragDropContext<K>` exposing `draggables` / `zones` registries,
 *   the `active` drag, the `isDragging` boolean, and a programmatic `cancel()`.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-drag-drop
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 * import { useTemplateRef } from 'vue'
 *
 * const dnd = useDragDrop<{ type: 'card', value: string }>()
 *
 * const draggable = useTemplateRef<HTMLElement>('draggable')
 * const dropzone = useTemplateRef<HTMLElement>('dropzone')
 *
 * dnd.draggables.register({ el: draggable, type: 'card', value: 'card-1' })
 * dnd.zones.register({
 *   el: dropzone,
 *   accept: ['card'],
 *   onDrop: (drag, position) => console.log(drag.value, position.index),
 * })
 * ```
 */
export function useDragDrop<K extends DragType = DragType> (
  options: DragDropOptions<K> = {},
): DragDropContext<K> {
  const { plugins = [] } = options
  const logger = useLogger()

  const _draggables = createRegistry<
    DraggableTicketInput<K>,
    DraggableTicketInput<K> & DraggableTicket<K>
  >({ events: true })

  const _zones = createRegistry<
    DropZoneTicketInput<K>,
    DropZoneTicketInput<K> & DropZoneTicket
  >({ events: true })

  const active = shallowRef<ActiveDrag<K> | null>(null)
  const isDragging = toRef(() => !isNull(active.value))

  function safeCall<F extends (...args: never[]) => unknown> (
    fn: F | undefined,
    ...args: Parameters<F>
  ): void {
    if (!fn) return
    try {
      fn(...args)
    } catch (error) {
      logger.error('useDragDrop hook threw', error)
    }
  }

  const draggables: DraggablesContext<K> = {
    ..._draggables,
    register (registration: DraggableTicketInput<K>): DraggableTicket<K> {
      const id = registration.id ?? useId()
      const el = toRef(() => toValue(registration.el))
      const dragging = toRef(() => active.value?.id === id)

      // DraggableTicketInput<K> is distributive over K — spread output stays opaque
      // to the type system; cast through unknown.
      const decorated = {
        ...registration,
        id,
        el,
        isDragging: dragging,
      } as unknown as Partial<DraggableTicketInput<K> & DraggableTicket<K>>

      return _draggables.register(decorated) as DraggableTicket<K>
    },
  }

  const zones: ZonesContext<K> = {
    ..._zones,
    register (registration: DropZoneTicketInput<K>): DropZoneTicket {
      const id = registration.id ?? useId()
      const el = toRef(() => toValue(registration.el))
      const isOver = toRef(() => active.value?.over === id)
      const willAccept = toRef(() => accepts(registration.accept, active.value))

      // Cached child rects — refreshed only when the zone resizes or its
      // children change. Pointer moves do an O(N) lookup against the cache
      // instead of triggering layout on every reactive read.
      const rects = shallowRef<DOMRect[]>([])

      function refresh (): void {
        const zoneEl = el.value
        rects.value = zoneEl
          ? Array.from(zoneEl.children).map(child => child.getBoundingClientRect())
          : []
      }

      useResizeObserver(el, refresh)
      useMutationObserver(el, refresh, { childList: true })

      const indicator = computed<DropIndicator | null>(() => {
        if (!registration.orientation || !isOver.value || !active.value) return null
        return resolveDropPosition(active.value.current, rects.value, registration.orientation)
      })

      const decorated = {
        ...registration,
        id,
        el,
        isOver,
        willAccept,
        indicator,
      } as Partial<DropZoneTicketInput<K> & DropZoneTicket>

      return _zones.register(decorated) as DropZoneTicket
    },
  }

  function at (point: { x: number, y: number }): ID | null {
    if (!IN_BROWSER) return null
    let element: Element | null = document.elementFromPoint(point.x, point.y)
    while (element) {
      for (const zone of _zones.values()) {
        if (zone.el.value === element && !toValue(zone.disabled)) return zone.id
      }
      element = element.parentElement
    }
    return null
  }

  function position (zoneId: ID, drag: ActiveDrag<K>): DropPosition {
    const zone = _zones.get(zoneId)
    const out: DropPosition = { pointer: drag.current }
    if (zone?.orientation) {
      const resolved = zone.indicator?.value ?? null
      if (resolved) {
        out.index = resolved.index
        out.indicator = resolved
      } else {
        // Empty oriented zone — index 0 with no indicator so consumers can splice without a fallback.
        out.index = 0
      }
    }
    return out
  }

  function bail (drag: ActiveDrag<K>, reason: 'cancel' | 'reject' = 'cancel'): void {
    try {
      if (!isNull(drag.over)) safeCall(_zones.get(drag.over)?.onLeave, drag)
      safeCall(_draggables.get(drag.id)?.onCancel, drag, reason)
      safeCall(options.onCancel, drag, reason)
    } finally {
      active.value = null
    }
  }

  function onStart (
    source: DraggableTicket<K>,
    origin: { x: number, y: number },
    via: Extensible<'pointer' | 'keyboard'>,
  ): void {
    if (toValue(_draggables.get(source.id)?.disabled) === true) return

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

    try {
      if (_draggables.get(source.id)?.onBeforeStart?.(draft) === false) return
    } catch (error) {
      logger.error('useDragDrop onBeforeStart threw; treating as veto', error)
      return
    }

    try {
      if (options.onBeforeStart?.(draft) === false) return
    } catch (error) {
      logger.error('useDragDrop onBeforeStart threw; treating as veto', error)
      return
    }

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
      willAccept: !isNull(over) && accepts(_zones.get(over)?.accept, active.value),
    } as ActiveDrag<K>

    const previous = active.value.over
    active.value = next

    if (previous !== over) {
      if (!isNull(previous)) safeCall(_zones.get(previous)?.onLeave, next)
      if (!isNull(over)) safeCall(_zones.get(over)?.onEnter, next)
    }

    safeCall(_draggables.get(next.id)?.onMove, next)
    safeCall(options.onMove, next)
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
    const zone = _zones.get(zoneId)

    function vetoed (fn: ((drag: ActiveDrag<K>, position: DropPosition) => boolean | void) | undefined): boolean {
      if (!fn) return false
      try {
        return fn(drag, dropAt) === false
      } catch (error) {
        logger.error('useDragDrop onBeforeDrop threw; treating as veto', error)
        return true
      }
    }

    if (vetoed(zone?.onBeforeDrop) || vetoed(options.onBeforeDrop)) {
      bail(drag, 'reject')
      return
    }

    try {
      safeCall(zone?.onDrop, drag, dropAt)
      safeCall(options.onDrop, drag, dropAt)
    } finally {
      active.value = null
    }
  }

  function cancel (): void {
    if (!active.value) return
    bail(active.value)
  }

  // ActiveDrag<K> distributive; cast on a free K.
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

  _draggables.on('unregister:ticket', ticket => {
    if (active.value?.id === ticket.id) cancel()
  })

  _zones.on('unregister:ticket', ticket => {
    if (active.value?.over === ticket.id) {
      // Zone disappeared mid-drag; clear the over field but keep the drag active.
      // Consumer's onMove will resolve a new over on next move.
      active.value = { ...active.value, over: null, willAccept: false } as ActiveDrag<K>
    }
  })

  onScopeDispose(() => {
    if (!isNull(active.value)) cancel()
    for (const dispose of disposers) {
      try {
        dispose()
      } catch (error) {
        logger.error('useDragDrop disposer threw', error)
      }
    }
    try {
      _draggables.dispose()
    } catch (error) {
      logger.error('useDragDrop draggables dispose threw', error)
    }
    try {
      _zones.dispose()
    } catch (error) {
      logger.error('useDragDrop zones dispose threw', error)
    }
  })

  return context
}
