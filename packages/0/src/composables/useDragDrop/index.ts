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

// Internals
import { resolveDropPosition } from './indicator'

// Re-exports
export type { ResolvedPosition } from './indicator'
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
    attrs: Readonly<Ref<Record<string, unknown>>>
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
  attrs: Readonly<Ref<Record<string, unknown>>>
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

function willZoneAccept<K extends DragType> (
  accept: DropZoneTicketInput<K>['accept'],
  drag: ActiveDrag<K> | null,
): boolean {
  if (!drag) return false
  if (!accept) return true
  if (isArray(accept)) return (accept as string[]).includes(drag.type)
  return Boolean(accept(drag))
}

export function useDragDrop<K extends DragType = DragType> (
  options: DragDropOptions<K> = {},
): DragDropContext<K> {
  const { plugins = [] } = options

  const baseDraggables = createRegistry<DraggableTicketInput<K>, DraggableTicket<K>>({
    events: true,
  })

  const baseZones = createRegistry<DropZoneTicketInput<K>, DropZoneTicket>({
    events: true,
  })

  const active = shallowRef<ActiveDrag<K> | null>(null)
  const isDragging = toRef(() => !isNull(active.value))

  function registerDraggable (input: DraggableTicketInput<K>): DraggableTicket<K> {
    const id = input.id ?? useId()
    const el = toRef(() => toValue(input.el))
    const dragging = toRef(() => active.value?.id === id)
    const attrs = toRef(() => {
      const out: Record<string, unknown> = {
        'data-draggable': '',
        'aria-roledescription': 'draggable',
      }
      if (dragging.value) out['data-dragging'] = ''
      if (toValue(input.disabled) !== true) out.style = { touchAction: 'none' }
      return out
    })

    // Distributive types collapse to opaque conditionals when K is generic,
    // so cast through unknown — runtime shape is correct.
    const decorated = {
      ...input,
      id,
      el,
      isDragging: dragging,
      attrs,
    } as unknown as Partial<DraggableTicketInput<K> & DraggableTicket<K>>

    return baseDraggables.register(decorated) as DraggableTicket<K>
  }

  const draggables: DraggablesContext<K> = {
    ...baseDraggables,
    register: registerDraggable,
  }

  function registerZone (input: DropZoneTicketInput<K>): DropZoneTicket {
    const id = input.id ?? useId()
    const el = toRef(() => toValue(input.el))
    const isOver = toRef(() => active.value?.over === id)
    const willAccept = toRef(() => willZoneAccept(input.accept, active.value))
    // computed (not toRef) — caches getBoundingClientRect calls so each
    // active.value read isn't O(N children).
    const indicator = computed<DropIndicator | null>(() => {
      if (!input.orientation || !isOver.value || !active.value) return null
      const zoneEl = el.value
      if (!zoneEl) return null
      const childRects = Array.from(zoneEl.children).map(child => child.getBoundingClientRect())
      return resolveDropPosition(active.value.current, childRects, input.orientation)
    })
    const attrs = toRef(() => {
      const out: Record<string, unknown> = { 'data-dropzone': '' }
      if (isOver.value) out['data-over'] = ''
      if (isOver.value && willAccept.value) out['data-accepts'] = ''
      return out
    })

    const decorated = {
      ...input,
      id,
      el,
      isOver,
      willAccept,
      indicator,
      attrs,
    } as Partial<DropZoneTicketInput<K> & DropZoneTicket>

    return baseZones.register(decorated) as DropZoneTicket
  }

  const zones: ZonesContext<K> = {
    ...baseZones,
    register: registerZone,
  }

  function findZone (point: { x: number, y: number }): ID | null {
    if (!IN_BROWSER) return null
    let element: Element | null = document.elementFromPoint(point.x, point.y)
    while (element) {
      for (const zone of baseZones.values()) {
        if (zone.el.value === element) return zone.id
      }
      element = element.parentElement
    }
    return null
  }

  // .get() returns the output type; spread keeps input hooks at runtime, cast to read them.
  function getDraggable (id: ID): (DraggableTicketInput<K> & DraggableTicket<K>) | undefined {
    return baseDraggables.get(id) as (DraggableTicketInput<K> & DraggableTicket<K>) | undefined
  }

  function getZone (id: ID): (DropZoneTicketInput<K> & DropZoneTicket) | undefined {
    return baseZones.get(id) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined
  }

  function dropPositionFor (zoneId: ID, drag: ActiveDrag<K>): DropPosition {
    const zone = getZone(zoneId)
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

  function cancelDrag (drag: ActiveDrag<K>, reason: 'cancel' | 'reject' = 'cancel'): void {
    if (!isNull(drag.over)) getZone(drag.over)?.onLeave?.(drag)

    getDraggable(drag.id)?.onCancel?.(drag, reason)
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

    if (getDraggable(source.id)?.onBeforeStart?.(draft) === false) return
    if (options.onBeforeStart?.(draft) === false) return

    active.value = draft
  }

  function onMove (point: { x: number, y: number }): void {
    if (!active.value) return

    const overZoneId = findZone(point)
    const next: ActiveDrag<K> = {
      ...active.value,
      current: point,
      delta: { x: point.x - active.value.origin.x, y: point.y - active.value.origin.y },
      over: overZoneId,
      willAccept: !isNull(overZoneId) && willZoneAccept(getZone(overZoneId)?.accept, active.value),
    } as ActiveDrag<K>

    const previousOver = active.value.over
    active.value = next

    if (previousOver !== overZoneId) {
      if (!isNull(previousOver)) getZone(previousOver)?.onLeave?.(next)
      if (!isNull(overZoneId)) getZone(overZoneId)?.onEnter?.(next)
    }

    getDraggable(next.id)?.onMove?.(next)
    options.onMove?.(next)
  }

  function onDrop (): void {
    if (!active.value) return
    const drag = active.value
    const zoneId = drag.over

    // Drop with no over-zone fires the cancel chain so onCancel rollback fires.
    if (isNull(zoneId)) {
      cancelDrag(drag)
      return
    }

    const position = dropPositionFor(zoneId, drag)
    const zone = getZone(zoneId)

    const zoneVeto = zone?.onBeforeDrop?.(drag, position) === false
    const globalVeto = options.onBeforeDrop?.(drag, position) === false

    if (zoneVeto || globalVeto) {
      cancelDrag(drag, 'reject')
      return
    }

    zone?.onDrop?.(drag, position)
    options.onDrop?.(drag, position)

    active.value = null
  }

  function cancel (): void {
    if (!active.value) return
    cancelDrag(active.value)
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
    baseDraggables.dispose()
    baseZones.dispose()
    active.value = null
  })

  return context
}
