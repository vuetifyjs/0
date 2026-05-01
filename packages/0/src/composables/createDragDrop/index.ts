/**
 * @module createDragDrop
 *
 * @see https://0.vuetifyjs.com/composables/system/create-drag-drop
 *
 * @remarks
 * Headless drag-and-drop primitive. Owns two registries (draggables and zones)
 * plus the active-drag state. Pointer and keyboard transports ship by default;
 * lifecycle hooks and a plugin array provide extension points.
 *
 * @example
 * ```ts
 * import { createDragDrop } from '@vuetify/v0'
 *
 * // Auto-provides into the current setup() scope.
 * const dnd = createDragDrop()
 * ```
 */

// Composables
import { createContext } from '#v0/composables/createContext'
import { createRegistry } from '#v0/composables/createRegistry'

// Adapters
import { keyboardTransport } from './adapters/keyboard'
import { pointerTransport } from './adapters/pointer'

// Utilities
import { isArray, isFunction, useId } from '#v0/utilities'
import { computed, hasInjectionContext, onScopeDispose, shallowRef, toRef, toValue } from 'vue'

// Types
import type {
  RegistryContext,
  RegistryTicket,
  RegistryTicketInput,
} from '#v0/composables/createRegistry'
import type { Extensible, ID } from '#v0/types'
import type { DragDropTransport, TransportEmit } from './adapters/adapter'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

import { resolveDropPosition } from './indicator'

// Re-exports
export type { ResolvedPosition } from './indicator'
export type { DragDropTransport, TransportEmit } from './adapters/adapter'
export { pointerTransport } from './adapters/pointer'
export { keyboardTransport } from './adapters/keyboard'
export type { PointerTransportOptions } from './adapters/pointer'
export type { KeyboardTransportOptions } from './adapters/keyboard'

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
    onCancel?: (drag: ActiveDrag<K>) => void
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
  ctx: DragDropContext<K>,
) => (() => void) | void

export interface DragDropOptions<K extends DragType = DragType> {
  transports?: DragDropTransport<K>[]
  plugins?: DragDropPlugin<K>[]
  onBeforeStart?: (drag: ActiveDrag<K>) => boolean | void
  onMove?: (drag: ActiveDrag<K>) => void
  onBeforeDrop?: (drag: ActiveDrag<K>, position: DropPosition) => boolean | void
  onDrop?: (drag: ActiveDrag<K>, position: DropPosition) => void
  onCancel?: (drag: ActiveDrag<K>) => void
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

const [useDragDropContext, provideDragDropContext] =
  createContext<DragDropContext>('v0:dragdrop')

/**
 * Inject the nearest `createDragDrop` context.
 *
 * Generic in `K` so consumers can recover the factory's narrowed kinds at the
 * inject boundary; the cast is safe because the underlying registry was
 * created with the same `K`.
 */
export function useDragDrop<K extends DragType = DragType> (): DragDropContext<K> {
  return useDragDropContext() as unknown as DragDropContext<K>
}

function buildDraggableAttrs (isDraggingNow: boolean, disabled: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {
    'data-draggable': '',
    'aria-roledescription': 'draggable',
  }
  if (isDraggingNow) out['data-dragging'] = ''
  if (!disabled) out.style = { touchAction: 'none' }
  return out
}

function buildZoneAttrs (isOverNow: boolean, willAcceptNow: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = { 'data-dropzone': '' }
  if (isOverNow) out['data-over'] = ''
  if (isOverNow && willAcceptNow) out['data-accepts'] = ''
  return out
}

function willZoneAccept<K extends DragType> (
  accept: DropZoneTicketInput<K>['accept'],
  drag: ActiveDrag<K> | null,
): boolean {
  if (!drag) return false
  if (!accept) return true
  if (isArray(accept)) return (accept as string[]).includes(drag.type)
  return accept(drag) === true
}

export function createDragDrop<K extends DragType = DragType> (
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
  const isDragging = toRef(() => active.value !== null)

  function registerDraggable (input: DraggableTicketInput<K>): DraggableTicket<K> {
    const id = input.id ?? useId()
    const elRef = toRef(() => toValue(input.el))
    const isDraggingRef = toRef(() => active.value?.id === id)
    const attrsRef = toRef(() => buildDraggableAttrs(
      isDraggingRef.value,
      toValue(input.disabled) === true,
    ))

    // Distributive types collapse to opaque conditionals when K is generic,
    // so cast through unknown — runtime shape is correct.
    const decorated = {
      ...input,
      id,
      el: elRef,
      isDragging: isDraggingRef,
      attrs: attrsRef,
    } as unknown as Partial<DraggableTicketInput<K> & DraggableTicket<K>>

    return baseDraggables.register(decorated) as DraggableTicket<K>
  }

  const draggables: DraggablesContext<K> = {
    ...baseDraggables,
    register: registerDraggable,
  }

  function registerZone (input: DropZoneTicketInput<K>): DropZoneTicket {
    const id = input.id ?? useId()
    const elRef = toRef(() => toValue(input.el))
    const isOverRef = toRef(() => active.value?.over === id)
    const willAcceptRef = toRef(() => willZoneAccept(input.accept, active.value))
    // computed (not toRef) — caches across reactive reads to avoid layout
    // reflow per access. Each indicator read calls getBoundingClientRect on
    // every child, which is expensive; without caching this is O(N children)
    // per `active.value` reactive read.
    const indicatorRef = computed<DropIndicator | null>(() => {
      if (!input.orientation || !isOverRef.value || !active.value) return null
      const zoneEl = elRef.value
      if (!zoneEl) return null
      const childRects = Array.from(zoneEl.children).map(c => c.getBoundingClientRect())
      return resolveDropPosition(active.value.current, childRects, input.orientation)
    })
    const attrsRef = toRef(() => buildZoneAttrs(isOverRef.value, willAcceptRef.value))

    const decorated = {
      ...input,
      id,
      el: elRef,
      isOver: isOverRef,
      willAccept: willAcceptRef,
      indicator: indicatorRef,
      attrs: attrsRef,
    } as Partial<DropZoneTicketInput<K> & DropZoneTicket>

    return baseZones.register(decorated) as DropZoneTicket
  }

  const zones: ZonesContext<K> = {
    ...baseZones,
    register: registerZone,
  }

  function cancel (): void {
    handleCancel()
  }

  function hitTest (point: { x: number, y: number }): ID | null {
    if (!IN_BROWSER) return null
    let el: Element | null = document.elementFromPoint(point.x, point.y)
    while (el) {
      for (const zone of baseZones.values()) {
        if (zone.el.value === el) return zone.id
      }
      el = el.parentElement
    }
    return null
  }

  // Registry `.get()` returns the output ticket type, but the registered object
  // includes the spread input fields at runtime. Cast to the intersection to access hooks.
  function getDraggableInput (id: ID): (DraggableTicketInput<K> & DraggableTicket<K>) | undefined {
    return baseDraggables.get(id) as (DraggableTicketInput<K> & DraggableTicket<K>) | undefined
  }

  function getZoneInput (id: ID): (DropZoneTicketInput<K> & DropZoneTicket) | undefined {
    return baseZones.get(id) as (DropZoneTicketInput<K> & DropZoneTicket) | undefined
  }

  function willZoneAcceptById (zoneId: ID, drag: ActiveDrag<K>): boolean {
    return willZoneAccept(getZoneInput(zoneId)?.accept, drag)
  }

  function fireZoneHook (
    zoneId: ID,
    hook: 'onEnter' | 'onLeave',
    drag: ActiveDrag<K>,
  ): void {
    getZoneInput(zoneId)?.[hook]?.(drag)
  }

  function computeDropPosition (zoneId: ID, drag: ActiveDrag<K>): DropPosition {
    const zone = getZoneInput(zoneId)
    const out: DropPosition = { pointer: drag.current }
    if (zone?.orientation && zone.el) {
      const zoneEl = toValue(zone.el)
      if (zoneEl) {
        const rects = Array.from(zoneEl.children).map(c => c.getBoundingClientRect())
        const resolved = resolveDropPosition(drag.current, rects, zone.orientation)
        if (resolved) {
          out.index = resolved.index
          out.indicator = resolved
        } else {
          // Oriented zone with no children — only sensible drop position is 0.
          // No indicator (nothing to point at), but the index lets consumers
          // splice the item in without their own fallback.
          out.index = 0
        }
      }
    }
    return out
  }

  function runCancelChain (drag: ActiveDrag<K>): void {
    if (drag.over !== null) fireZoneHook(drag.over, 'onLeave', drag)

    getDraggableInput(drag.id)?.onCancel?.(drag)
    options.onCancel?.(drag)

    active.value = null
  }

  function handleStart (
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

    if (getDraggableInput(source.id)?.onBeforeStart?.(draft) === false) return
    if (options.onBeforeStart?.(draft) === false) return

    active.value = draft
  }

  function handleMove (point: { x: number, y: number }): void {
    if (!active.value) return

    const overZoneId = hitTest(point)
    const next: ActiveDrag<K> = {
      ...active.value,
      current: point,
      delta: { x: point.x - active.value.origin.x, y: point.y - active.value.origin.y },
      over: overZoneId,
      willAccept: overZoneId !== null && willZoneAcceptById(overZoneId, active.value),
    } as ActiveDrag<K>

    const previousOver = active.value.over
    active.value = next

    getDraggableInput(next.id)?.onMove?.(next)
    options.onMove?.(next)

    if (previousOver !== overZoneId) {
      if (previousOver !== null) fireZoneHook(previousOver, 'onLeave', next)
      if (overZoneId !== null) fireZoneHook(overZoneId, 'onEnter', next)
    }
  }

  function handleDrop (): void {
    if (!active.value) return
    const drag = active.value
    const zoneId = drag.over

    // Drop with no over-zone is a cancel — fire the chain instead of clearing
    // active silently. Consumers using `onCancel` for state rollback expect
    // this notification.
    if (zoneId === null) {
      runCancelChain(drag)
      return
    }

    const position = computeDropPosition(zoneId, drag)
    const zone = getZoneInput(zoneId)

    const zoneVeto = zone?.onBeforeDrop?.(drag, position) === false
    const globalVeto = options.onBeforeDrop?.(drag, position) === false

    if (zoneVeto || globalVeto) {
      runCancelChain(drag)
      return
    }

    zone?.onDrop?.(drag, position)
    options.onDrop?.(drag, position)

    active.value = null
  }

  function handleCancel (): void {
    if (!active.value) return
    runCancelChain(active.value)
  }

  // active is structurally identical to ShallowRef<ActiveDrag<K> | null> but
  // distributive conditional types are invariant in unresolved positions.
  const ctx: DragDropContext<K> = {
    draggables,
    zones,
    active: active as Readonly<ShallowRef<ActiveDrag<K> | null>>,
    isDragging,
    cancel,
  }

  if (hasInjectionContext()) {
    provideDragDropContext(ctx as unknown as DragDropContext)
  }

  const disposers: (() => void)[] = []

  const transports = options.transports ?? [pointerTransport<K>(), keyboardTransport<K>()]

  const emit: TransportEmit<K> = {
    start: (source, origin, via) => handleStart(source, origin, via),
    move: point => handleMove(point),
    drop: () => handleDrop(),
    cancel: () => handleCancel(),
  }

  for (const t of transports) {
    t.install(ctx, emit)
    disposers.push(() => t.uninstall())
  }

  for (const plugin of plugins) {
    const dispose = plugin(ctx)
    if (isFunction(dispose)) disposers.push(dispose)
  }

  onScopeDispose(() => {
    for (const dispose of disposers) dispose()
  })

  return ctx
}
