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
import { isArray, isFunction, isNull, isUndefined, useId } from '#v0/utilities'
import { computed, effectScope, onScopeDispose, onWatcherCleanup, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type {
  RegistryContext,
  RegistryTicket,
  RegistryTicketInput,
} from '#v0/composables/createRegistry'
import type { Extensible, ID } from '#v0/types'
import type { DragDropAdapterContext, DragDropAdapterEmit, DragDropAdapterInterface } from './adapters'
import type { EffectScope, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

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
 * so consumers can render a between-children indicator against the resolved
 * child rect.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 * const zone = dnd.zones.register({ el, accept: ['card'], orientation: 'vertical' })
 *
 * const indicator = zone.indicator.value
 * if (indicator) {
 *   const y = indicator.edge === 'before'
 *     ? indicator.rect.top
 *     : indicator.rect.bottom
 *   const x = indicator.rect.left
 *   const width = indicator.rect.width
 *   // Render a 2px bar at (x, y) with `width` to mark drop slot `indicator.index`.
 * }
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
 * Active drag state. Distributive over `Z` so that narrowing `drag.type` also
 * narrows `drag.value` when `Z` is a discriminated union.
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
export type ActiveDrag<Z extends DragType = DragType> = Z extends DragType
  ? {
      id: ID
      type: Z['type']
      value: Z['value']
      origin: { x: number, y: number }
      current: { x: number, y: number }
      delta: { x: number, y: number }
      over: ID | null
      willAccept: boolean
      via: Extensible<'pointer' | 'keyboard'>
    }
  : never

/**
 * Input shape for a draggable. Distributive over `Z` so unions narrow.
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
export type DraggableTicketInput<Z extends DragType = DragType> = Z extends DragType
  ? RegistryTicketInput & {
    type: Z['type']
    value: Z['value']
    el: MaybeRefOrGetter<HTMLElement | null>
    disabled?: MaybeRefOrGetter<boolean>
    onBeforeStart?: (drag: ActiveDrag<Z>) => boolean | void
    onMove?: (drag: ActiveDrag<Z>) => void
    onCancel?: (drag: ActiveDrag<Z>, reason: 'cancel' | 'reject') => void
  }
  : never

/**
 * Output shape for a draggable. Non-distributive — `Z` resolves once at the
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
export interface DraggableTicket<Z extends DragType = DragType> extends RegistryTicket {
  type: Z['type']
  value: Z['value']
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
export interface DropZoneTicketInput<Z extends DragType = DragType>
  extends RegistryTicketInput {
  el: MaybeRefOrGetter<HTMLElement | null>
  accept?: Z['type'][] | ((drag: ActiveDrag<Z>) => boolean)
  orientation?: Orientation
  disabled?: MaybeRefOrGetter<boolean>
  onEnter?: (drag: ActiveDrag<Z>) => void
  onLeave?: (drag: ActiveDrag<Z>) => void
  onBeforeDrop?: (drag: ActiveDrag<Z>, position: DropPosition) => boolean | void
  onDrop?: (drag: ActiveDrag<Z>, position: DropPosition) => void
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
export type DragDropPlugin<Z extends DragType = DragType> = (
  context: DragDropContext<Z>,
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
export interface DragDropOptions<Z extends DragType = DragType> {
  adapters?: DragDropAdapterInterface<Z>[]
  plugins?: DragDropPlugin<Z>[]
  onBeforeStart?: (drag: ActiveDrag<Z>) => boolean | void
  onMove?: (drag: ActiveDrag<Z>) => void
  onBeforeDrop?: (drag: ActiveDrag<Z>, position: DropPosition) => boolean | void
  onDrop?: (drag: ActiveDrag<Z>, position: DropPosition) => void
  onCancel?: (drag: ActiveDrag<Z>, reason: 'cancel' | 'reject') => void
}

/**
 * Registry context for draggable tickets, returned as `dnd.draggables`
 * from {@link useDragDrop}.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * const ticket = dnd.draggables.register({ el, type: 'card', value: card })
 * ```
 */
export interface DraggablesContext<Z extends DragType = DragType>
  extends Omit<RegistryContext<DraggableTicketInput<Z>, DraggableTicketInput<Z> & DraggableTicket<Z>>, 'register'> {
  register: (registration: DraggableTicketInput<Z>) => DraggableTicket<Z>
}

/**
 * Registry context for drop zones, returned as `dnd.zones`
 * from {@link useDragDrop}.
 *
 * @example
 * ```ts
 * import { useDragDrop } from '@vuetify/v0'
 *
 * const dnd = useDragDrop<{ type: 'card', value: Card }>()
 *
 * const zone = dnd.zones.register({ el, accept: ['card'] })
 * ```
 */
export interface ZonesContext<Z extends DragType = DragType>
  extends Omit<RegistryContext<DropZoneTicketInput<Z>, DropZoneTicketInput<Z> & DropZoneTicket>, 'register'> {
  register: (registration: DropZoneTicketInput<Z>) => DropZoneTicket
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
export interface DragDropContext<Z extends DragType = DragType> {
  draggables: DraggablesContext<Z>
  zones: ZonesContext<Z>
  active: Readonly<ShallowRef<ActiveDrag<Z> | null>>
  isDragging: Readonly<Ref<boolean>>
  cancel: () => void
}

function accepts<Z extends DragType> (
  accept: DropZoneTicketInput<Z>['accept'],
  drag: ActiveDrag<Z> | null,
): boolean {
  if (!drag) return false
  if (!accept) return true
  if (isArray(accept)) return accept.includes(drag.type as Z['type'])
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
 * @returns A `DragDropContext<Z>` exposing `draggables` / `zones` registries,
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
export function useDragDrop<Z extends DragType = DragType> (
  options: DragDropOptions<Z> = {},
): DragDropContext<Z> {
  const { plugins = [] } = options
  const logger = useLogger()

  const _draggables = createRegistry<
    DraggableTicketInput<Z>,
    DraggableTicketInput<Z> & DraggableTicket<Z>
  >({ events: true })

  const _zones = createRegistry<
    DropZoneTicketInput<Z>,
    DropZoneTicketInput<Z> & DropZoneTicket
  >({ events: true })

  const active = shallowRef<ActiveDrag<Z> | null>(null)
  const isDragging = toRef(() => !isNull(active.value))

  const book = new Map<ID, EffectScope>()
  const nodes = new Map<HTMLElement, ID>()

  function next<F extends (...args: never[]) => unknown> (
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

  const draggables: DraggablesContext<Z> = {
    ..._draggables,
    register (registration: DraggableTicketInput<Z>): DraggableTicket<Z> {
      const id = registration.id ?? useId()
      const el = toRef(() => toValue(registration.el))
      const dragging = toRef(() => active.value?.id === id)

      const input = {
        ...registration,
        id,
        el,
        isDragging: dragging,
      } as unknown as Partial<DraggableTicketInput<Z> & RegistryTicket>

      return _draggables.register(input) as DraggableTicket<Z>
    },
  }

  const zones: ZonesContext<Z> = {
    ..._zones,
    register (registration: DropZoneTicketInput<Z>): DropZoneTicket {
      const id = registration.id ?? useId()
      const el = toRef(() => toValue(registration.el))
      const isOver = toRef(() => active.value?.over === id)
      const willAccept = toRef(() => accepts(registration.accept, active.value))

      const rects = shallowRef<DOMRect[]>([])

      function refresh (): void {
        const zoneEl = el.value
        rects.value = zoneEl
          ? Array.from(zoneEl.children).map(child => child.getBoundingClientRect())
          : []
      }

      const scope = effectScope()
      book.set(id, scope)
      scope.run(() => {
        watch(el, refresh, { immediate: true, flush: 'post' })
        useResizeObserver(el, refresh)
        useMutationObserver(el, refresh, { childList: true })

        watch(el, current => {
          if (!current) return
          nodes.set(current, id)
          onWatcherCleanup(() => nodes.delete(current))
        }, { immediate: true })
      })

      function onUnregister (ticket: { id: ID }): void {
        if (ticket.id === id) {
          scope.stop()
          book.delete(id)
          _zones.off('unregister:ticket', onUnregister)
        }
      }
      _zones.on('unregister:ticket', onUnregister)

      const indicator = computed<DropIndicator | null>(() => {
        if (!registration.orientation || !isOver.value || !active.value) return null
        return resolveDropPosition(active.value.current, rects.value, registration.orientation)
      })

      const input = {
        ...registration,
        id,
        el,
        isOver,
        willAccept,
        indicator,
      } as unknown as Partial<DropZoneTicketInput<Z> & RegistryTicket>

      return _zones.register(input) as DropZoneTicket
    },
  }

  function at (point: { x: number, y: number }): ID | null {
    if (!IN_BROWSER) return null
    let element: Element | null = document.elementFromPoint(point.x, point.y)
    while (element) {
      const id = nodes.get(element as HTMLElement)
      if (!isUndefined(id)) {
        const zone = _zones.get(id)
        if (zone && !toValue(zone.disabled)) return id
      }
      element = element.parentElement
    }
    return null
  }

  function position (zoneId: ID, drag: ActiveDrag<Z>): DropPosition {
    const zone = _zones.get(zoneId)
    const out: DropPosition = { pointer: drag.current }
    if (zone?.orientation) {
      const resolved = zone.indicator?.value ?? null
      if (resolved) {
        out.index = resolved.index
        out.indicator = resolved
      } else {
        // Empty zone — index 0 lets consumers splice without a fallback.
        out.index = 0
      }
    }
    return out
  }

  function bail (drag: ActiveDrag<Z>, reason: 'cancel' | 'reject' = 'cancel'): void {
    try {
      if (!isNull(drag.over)) next(_zones.get(drag.over)?.onLeave, drag)
      next(_draggables.get(drag.id)?.onCancel, drag, reason)
      next(options.onCancel, drag, reason)
    } finally {
      active.value = null
    }
  }

  function onStart (
    source: DraggableTicket<Z>,
    origin: { x: number, y: number },
    via: Extensible<'pointer' | 'keyboard'>,
  ): void {
    if (toValue(_draggables.get(source.id)?.disabled)) return

    const draft: ActiveDrag<Z> = {
      id: source.id,
      type: source.type,
      value: source.value,
      origin,
      current: origin,
      delta: { x: 0, y: 0 },
      over: null,
      willAccept: false,
      via,
    } as ActiveDrag<Z>

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
    const draft: ActiveDrag<Z> = {
      ...active.value,
      current: point,
      delta: { x: point.x - active.value.origin.x, y: point.y - active.value.origin.y },
      over,
      willAccept: !isNull(over) && accepts(_zones.get(over)?.accept, active.value),
    } as ActiveDrag<Z>

    const previous = active.value.over
    active.value = draft

    if (previous !== over) {
      if (!isNull(previous)) next(_zones.get(previous)?.onLeave, draft)
      if (!isNull(over)) next(_zones.get(over)?.onEnter, draft)
    }

    next(_draggables.get(draft.id)?.onMove, draft)
    next(options.onMove, draft)
  }

  function onDrop (): void {
    if (!active.value) return
    const drag = active.value
    const zoneId = drag.over

    if (isNull(zoneId)) {
      bail(drag)
      return
    }

    const dropAt = position(zoneId, drag)
    const zone = _zones.get(zoneId)

    function vetoed (fn: ((drag: ActiveDrag<Z>, position: DropPosition) => boolean | void) | undefined): boolean {
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
      next(zone?.onDrop, drag, dropAt)
      next(options.onDrop, drag, dropAt)
    } finally {
      active.value = null
    }
  }

  function cancel (): void {
    if (!active.value) return
    bail(active.value)
  }

  const context: DragDropContext<Z> = {
    draggables,
    zones,
    active: shallowReadonly(active) as Readonly<ShallowRef<ActiveDrag<Z> | null>>,
    isDragging,
    cancel,
  }

  const disposers: (() => void)[] = []

  const adapters = options.adapters ?? [new PointerAdapter<Z>(), new KeyboardAdapter<Z>()]

  const emit: DragDropAdapterEmit<Z> = {
    start: (source, origin, via) => onStart(source, origin, via),
    move: point => onMove(point),
    drop: () => onDrop(),
    cancel: () => cancel(),
  }

  const adapterContext: DragDropAdapterContext<Z> = { ...context, emit }

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
      // Keep the drag alive; the next move resolves a new over.
      active.value = { ...active.value, over: null, willAccept: false } as ActiveDrag<Z>
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
    for (const scope of book.values()) scope.stop()
    book.clear()
    nodes.clear()
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
  }, true)

  return context
}
