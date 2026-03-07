/**
 * @module SplitterRoot
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
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { clamp, isNullOrUndefined } from '#v0/utilities'

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
    orientation: Ref<SplitterOrientation>
    disabled: Ref<boolean>
    panels: SelectionContext<SplitterPanelInput>
    handles: RegistryContext
    dragging: Ref<boolean>
    draggingHandle: Ref<number | null>
    rootEl: Ref<HTMLElement | null>
    panel: (index: number) => SplitterPanelTicket | undefined
    resize: (index: number, delta: number) => void
    onResizeEnd: () => void
    collapse: (index: number) => void
    expand: (index: number) => void
    distribute: (sizes: number[]) => void
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
    attrs: {
      'data-orientation': SplitterOrientation
      'data-dragging': true | undefined
    }
  }

  export const [useSplitterRoot, provideSplitterRoot] = createContext<SplitterContext>('v0:splitter')
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createRegistry } from '#v0/composables/createRegistry'
  import { createSelection } from '#v0/composables/createSelection'

  // Utilities
  import { shallowRef, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

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
  const dragging = toRef(() => draggingHandle.value !== null)

  const panels = createSelection<SplitterPanelInput>({
    multiple: true,
    enroll: true,
    reactive: true,
  })

  const handles = createRegistry()

  function panel (index: number) {
    const id = panels.lookup(index)
    return isNullOrUndefined(id) ? undefined : panels.get(id)
  }

  function effectiveMin (ticket: SplitterPanelTicket) {
    return ticket.collapsible && !toValue(ticket.isSelected)
      ? ticket.collapsedSize
      : ticket.minSize
  }

  function resize (index: number, delta: number) {
    const before = panel(index)
    const after = panel(index + 1)
    if (!before || !after) return

    const total = before.size + after.size
    const min1 = effectiveMin(before)
    const min2 = effectiveMin(after)
    const lower = Math.max(min1, total - after.maxSize)
    const upper = Math.min(before.maxSize, total - min2)

    const size = clamp(before.size + delta, lower, upper)
    before.size = size
    after.size = total - size
  }

  function collapse (index: number) {
    const ticket = panel(index)
    if (!ticket?.collapsible || !toValue(ticket.isSelected)) return

    const neighbor = panel(index > 0 ? index - 1 : index + 1)
    if (!neighbor) return

    const diff = ticket.size - ticket.collapsedSize
    neighbor.size += diff
    ticket.size = ticket.collapsedSize
    ticket.unselect()
  }

  function expand (index: number) {
    const ticket = panel(index)
    if (!ticket?.collapsible || toValue(ticket.isSelected)) return

    const neighbor = panel(index > 0 ? index - 1 : index + 1)
    if (!neighbor) return

    const target = Math.min(ticket.defaultSize, ticket.maxSize)
    const diff = target - ticket.collapsedSize
    const available = neighbor.size - neighbor.minSize
    const take = Math.min(diff, available)

    neighbor.size -= take
    ticket.size = ticket.collapsedSize + take
    ticket.select()
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

    emit('layout', values.map(t => t.size))
  }

  function onResizeEnd () {
    emit('layout', panels.values().map(t => t.size))
  }

  const context: SplitterContext = {
    orientation: toRef(() => orientation),
    disabled: toRef(() => disabled),
    panels,
    handles,
    dragging,
    draggingHandle,
    rootEl,
    panel,
    resize,
    onResizeEnd,
    collapse,
    expand,
    distribute,
  }

  provideSplitterRoot(context)

  defineExpose({ distribute })

  const slotProps = toRef((): SplitterRootSlotProps => ({
    orientation,
    isDisabled: disabled,
    sizes: panels.values().map(t => t.size),
    isDragging: dragging.value,
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
    :style="{
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    }"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
