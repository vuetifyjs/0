/**
 * @module SplitterRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/splitter
 *
 * @remarks
 * Root component for splitter layouts. Provides context to child
 * SplitterPanel and SplitterHandle components. Manages panel sizes
 * and coordinates resize operations between adjacent panels.
 *
 * @todo v2: SplitterGrid / corner handle support — a cross-root coordinator
 * (possibly a `useLayout` plugin) that links horizontal and vertical roots,
 * enabling a single drag handle at the intersection to resize panels on both
 * axes simultaneously.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { createSelection } from '#v0/composables/createSelection'

  // Utilities
  import { clamp, isNull, isNullOrUndefined, isUndefined } from '#v0/utilities'
  import { shallowRef, toRef, toValue, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { RegistryContext } from '#v0/composables/createRegistry'
  import type { SelectionContext, SelectionTicket, SelectionTicketInput } from '#v0/composables/createSelection'
  import type { Ref } from 'vue'

  export type SplitterOrientation = 'horizontal' | 'vertical'

  export interface SplitterPanelInput extends SelectionTicketInput {
    size: number
    minSize: number
    maxSize: number
    collapsible: boolean
    collapsedSize: number
    defaultSize: number
  }

  export type SplitterPanelTicket = SelectionTicket<SplitterPanelInput>

  export interface SplitterContext {
    orientation: Readonly<Ref<SplitterOrientation>>
    disabled: Readonly<Ref<boolean>>
    panels: SelectionContext<SplitterPanelInput>
    handles: RegistryContext
    dragging: Readonly<Ref<boolean>>
    draggingHandle: Readonly<Ref<number | null>>
    rootEl: Readonly<Ref<HTMLElement | null>>
    panel: (index: number) => SplitterPanelTicket | undefined
    resize: (index: number, delta: number, options?: { emit?: boolean }) => void
    onStartDrag: (index: number) => void
    onEndDrag: () => void
    collapse: (index: number, neighborIndex?: number) => void
    expand: (index: number, neighborIndex?: number) => void
    distribute: (sizes: number[]) => void
  }

  export interface SplitterRootExpose {
    distribute: (sizes: number[]) => void
    dragging: Readonly<Ref<boolean>>
  }

  export interface SplitterRootProps extends AtomProps {
    orientation?: SplitterOrientation
    disabled?: boolean
  }

  export interface SplitterRootSlotProps {
    orientation: SplitterOrientation
    isDisabled: boolean
    sizes: number[]
    isDragging: boolean
    distribute: (sizes: number[]) => void
    attrs: {
      'style'?: Record<string, string>
      'data-orientation': SplitterOrientation
      'data-dragging': true | undefined
    }
  }

  export const [useSplitterRoot, provideSplitterRoot] = createContext<SplitterContext>('v0:splitter')
</script>

<script setup lang="ts">
  defineOptions({ name: 'SplitterRoot', inheritAttrs: false })

  const attrs = useAttrs()

  const emit = defineEmits<{
    layout: [sizes: number[]]
  }>()

  defineSlots<{
    default: (props: SplitterRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    orientation = 'horizontal',
    disabled = false,
  } = defineProps<SplitterRootProps>()

  const rootAtom = useTemplateRef<AtomExpose>('root')
  // Vue auto-unwraps exposed refs when accessed via template ref,
  // but TypeScript doesn't reflect this - cast corrects the type
  const rootEl = toRef(() => (rootAtom.value?.element as HTMLElement | null | undefined) ?? null)
  const draggingHandle = shallowRef<number | null>(null)
  const dragging = toRef(() => !isNull(draggingHandle.value))
  const expandAccum = new Map<string | number, number>()
  const EXPAND_THRESHOLD = 10

  const panels = createSelection<SplitterPanelInput>({
    multiple: true,
    enroll: true,
    reactive: true,
  })

  const handles = createRegistry()

  // Auto-redistribute when panels are added or removed
  // flush: 'post' batches synchronous registrations so this fires once per render cycle
  watch(() => panels.collection.size, (size, prev) => {
    const values = panels.values()
    if (values.length === 0) return
    const total = values.reduce((sum, t) => sum + t.size, 0)
    if (total === 0 || total === 100) return

    // Panel added — use defaults so new panel gets its requested size
    // Panel removed (or initial mount when prev is undefined) — preserve current sizes
    const sizes = !isUndefined(prev) && size > prev
      ? values.map(t => t.defaultSize)
      : values.map(t => t.size)

    distribute(sizes)
  }, { flush: 'post' })

  function panel (index: number) {
    const id = panels.lookup(index)
    return isNullOrUndefined(id) ? undefined : panels.get(id)
  }

  function effectiveMin (ticket: SplitterPanelTicket) {
    if (!ticket.collapsible) return ticket.minSize
    if (!toValue(ticket.isSelected)) return ticket.collapsedSize
    // During drag, a freshly-expanded panel may still be below minSize.
    // Allow it to track the cursor smoothly instead of snapping.
    if (dragging.value && ticket.size < ticket.minSize) return ticket.collapsedSize
    return ticket.minSize
  }

  function resize (index: number, delta: number, options?: { emit?: boolean }) {
    const before = panel(index)
    const after = panel(index + 1)
    if (!before || !after) return

    const total = before.size + after.size
    const min1 = effectiveMin(before)
    const min2 = effectiveMin(after)
    const lower = Math.max(min1, total - after.maxSize)
    const upper = Math.min(before.maxSize, total - min2)

    let size = clamp(before.size + delta, lower, upper)

    // Collapse snap: dragging a collapsible panel below minSize snaps to collapsedSize
    const beforeCollapsed = !toValue(before.isSelected)
    if (before.collapsible && !beforeCollapsed && size <= before.minSize && delta < 0) {
      size = before.collapsedSize
      before.unselect()
      expandAccum.set(before.id, 0)
    } else if (before.collapsible && beforeCollapsed && delta > 0) {
      const accum = (expandAccum.get(before.id) ?? 0) + delta
      expandAccum.set(before.id, accum)
      if (accum >= EXPAND_THRESHOLD) {
        size = clamp(accum, before.collapsedSize, before.maxSize)
        before.select()
        expandAccum.delete(before.id)
      } else {
        size = before.collapsedSize
      }
    }

    const afterSize = total - size
    const afterCollapsed = !toValue(after.isSelected)
    if (after.collapsible && !afterCollapsed && afterSize <= after.minSize && delta > 0) {
      size = total - after.collapsedSize
      after.unselect()
      expandAccum.set(after.id, 0)
    } else if (after.collapsible && afterCollapsed && delta < 0) {
      const accum = (expandAccum.get(after.id) ?? 0) + Math.abs(delta)
      expandAccum.set(after.id, accum)
      if (accum >= EXPAND_THRESHOLD) {
        size = total - clamp(accum, after.collapsedSize, after.maxSize)
        after.select()
        expandAccum.delete(after.id)
      } else {
        size = total - after.collapsedSize
      }
    }

    before.size = size
    after.size = total - size

    if (options?.emit) emitLayout()
  }

  function collapse (index: number, neighborIndex?: number) {
    const ticket = panel(index)
    if (!ticket?.collapsible || !toValue(ticket.isSelected)) return

    const neighbor = panel(neighborIndex ?? (index > 0 ? index - 1 : index + 1))
    if (!neighbor) return

    const diff = ticket.size - ticket.collapsedSize
    const absorbed = Math.min(diff, neighbor.maxSize - neighbor.size)
    neighbor.size += absorbed
    ticket.size = ticket.collapsedSize

    // Cascade remaining size to other panels
    let remaining = diff - absorbed
    if (remaining > 0) {
      for (const p of panels.values()) {
        if (p.id === ticket.id || p.id === neighbor.id || remaining <= 0) continue
        const room = p.maxSize - p.size
        const take = Math.min(remaining, room)
        p.size += take
        remaining -= take
      }
    }

    if (remaining > 0) {
      ticket.size += remaining
    }

    if (ticket.size <= ticket.collapsedSize) {
      ticket.unselect()
    }

    emitLayout()
  }

  function expand (index: number, neighborIndex?: number) {
    const ticket = panel(index)
    if (!ticket?.collapsible || toValue(ticket.isSelected)) return

    const neighbor = panel(neighborIndex ?? (index > 0 ? index - 1 : index + 1))
    if (!neighbor) return

    const target = Math.min(ticket.defaultSize, ticket.maxSize)
    const diff = target - ticket.collapsedSize
    const available = neighbor.size - neighbor.minSize
    const take = Math.min(diff, available)

    // Don't expand if we can't reach minSize
    if (ticket.collapsedSize + take < ticket.minSize) return

    neighbor.size -= take
    ticket.size = ticket.collapsedSize + take
    ticket.select()

    emitLayout()
  }

  function distribute (incoming: number[]) {
    const values = panels.values()
    if (incoming.length !== values.length) return

    for (const [index, ticket] of values.entries()) {
      const value = incoming[index]!
      const min = ticket.collapsible && value <= ticket.collapsedSize
        ? ticket.collapsedSize
        : ticket.minSize
      ticket.size = clamp(value, min, ticket.maxSize)
    }

    // Correct remainder so sizes sum to 100
    let remainder = 100 - values.reduce((sum, t) => sum + t.size, 0)
    for (const ticket of values) {
      if (remainder === 0) break
      const min = ticket.collapsible && ticket.size <= ticket.collapsedSize
        ? ticket.collapsedSize
        : ticket.minSize
      const room = remainder > 0
        ? ticket.maxSize - ticket.size
        : ticket.size - min
      const adjust = remainder > 0
        ? Math.min(remainder, room)
        : Math.max(remainder, -room)
      ticket.size += adjust
      remainder -= adjust
    }

    for (const ticket of values) {
      if (!ticket.collapsible) continue
      const collapsed = !toValue(ticket.isSelected)
      if (!collapsed && ticket.size <= ticket.collapsedSize) ticket.unselect()
      else if (collapsed && ticket.size > ticket.collapsedSize) ticket.select()
    }

    emit('layout', values.map(t => t.size))
  }

  function onStartDrag (index: number) {
    draggingHandle.value = index
  }

  function onEndDrag () {
    draggingHandle.value = null
    expandAccum.clear()
    emitLayout()
  }

  function emitLayout () {
    emit('layout', panels.values().map(t => t.size))
  }

  provideSplitterRoot({
    orientation: toRef(() => orientation),
    disabled: toRef(() => disabled),
    panels,
    handles,
    dragging,
    draggingHandle,
    rootEl,
    panel,
    resize,
    onStartDrag,
    onEndDrag,
    collapse,
    expand,
    distribute,
  })

  defineExpose<SplitterRootExpose>({ distribute, dragging })

  const slotProps = toRef((): SplitterRootSlotProps => ({
    orientation,
    isDisabled: disabled,
    sizes: panels.values().map(t => t.size),
    isDragging: dragging.value,
    distribute,
    attrs: {
      'data-orientation': orientation,
      'data-dragging': dragging.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    ref="root"
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style, {
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    }]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
