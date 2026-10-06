/**
 * @module KanbanItem
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * One movable item. Identified by `value`, which must match an entry in the
 * parent Kanban.Column's v-model. Pointer-draggable through the board's
 * drag-and-drop context, and keyboard-movable without a pointer: Space or
 * Enter picks it up, arrows move it one slot or one column, Home / End jump to
 * the ends of its column, Space or Enter drops, Escape returns it. Focus
 * follows the item when a move re-renders it in another column.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useKanbanColumn } from './KanbanColumn.vue'
  import { useKanbanRoot } from './KanbanRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { mergeProps, nextTick, onBeforeUnmount, onMounted, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { KanbanDirection } from './KanbanRoot.vue'

  export type KanbanItemState = 'grabbed' | 'dragging' | 'idle'

  export interface KanbanItemProps<T = unknown> extends AtomProps {
    /** The item's value — must be an entry of the parent Column's v-model */
    value: T
    /** Accessible name used in move announcements */
    label?: string
    /** Prevent this item from being moved */
    disabled?: boolean
    /** Namespace for context injection from Kanban.Root */
    namespace?: string
  }

  export interface KanbanItemSlotProps {
    /** 0-based position in the column */
    index: number
    /** Interaction state */
    state: KanbanItemState
    /** Whether the item is picked up by keyboard */
    isGrabbed: boolean
    /** Whether the item is being dragged by pointer */
    isDragging: boolean
    /** Whether the item cannot be moved */
    isDisabled: boolean
    /** Attributes to bind to the item element */
    attrs: {
      'role': 'listitem'
      'tabindex': 0 | -1
      'aria-roledescription': 'draggable item'
      'aria-describedby': string | undefined
      'aria-disabled': boolean
      'aria-posinset': number
      'aria-setsize': number
      'data-state': KanbanItemState
      'data-disabled': true | undefined
      'onKeydown': (e: KeyboardEvent) => void
      'onBlur': (e: FocusEvent) => void
    }
  }
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'KanbanItem', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: KanbanItemSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    value,
    label,
    disabled = false,
    namespace = 'v0:kanban',
  } = defineProps<KanbanItemProps<T>>()

  const root = useKanbanRoot(namespace)
  const column = useKanbanColumn(namespace)

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const index = toRef(() => column.model.value.indexOf(value))
  const isDisabled = toRef(() => disabled || column.isDisabled.value)
  const isGrabbed = toRef(() => root.grabbed.value?.value === value)
  const isDragging = toRef(() => root.dnd.active.value?.value.value === value)

  const state = toRef((): KanbanItemState => {
    if (isGrabbed.value) return 'grabbed'
    if (isDragging.value) return 'dragging'
    return 'idle'
  })

  function focus () {
    if (root.pending.value !== value) return
    root.pending.value = undefined
    ;(el.value as HTMLElement | null)?.focus()
  }

  watch(() => root.pending.value, () => nextTick(focus))

  // Registration lands in onMounted (post-flush) while teardown runs in
  // onBeforeUnmount: a cross-column move remounts the same value under a new
  // column, and sharing a phase would let the old instance's teardown win.
  let draggable: { unregister: () => void } | undefined

  onMounted(() => {
    draggable = root.dnd.draggables.register({
      el: () => el.value as HTMLElement | null,
      type: 'item',
      value: {
        value,
        get label () {
          return label
        },
      },
      disabled: isDisabled,
    })

    focus()
  })

  onBeforeUnmount(() => {
    draggable?.unregister()
  })

  function isRtl () {
    const host = el.value
    return !!host && getComputedStyle(host).direction === 'rtl'
  }

  function toDirection (key: string): KanbanDirection | undefined {
    const vertical = column.orientation.value === 'vertical'
    const back = key === 'ArrowLeft' ? !isRtl() : isRtl()

    switch (key) {
      case 'Home': {
        return 'first'
      }
      case 'End': {
        return 'last'
      }
      case 'ArrowUp': {
        return vertical ? 'up' : 'prev'
      }
      case 'ArrowDown': {
        return vertical ? 'down' : 'next'
      }
      case 'ArrowLeft':
      case 'ArrowRight': {
        if (vertical) return back ? 'prev' : 'next'
        return back ? 'up' : 'down'
      }
    }

    return undefined
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.target !== e.currentTarget) return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (isDisabled.value) return

    const activate = e.key === ' ' || e.key === 'Enter'

    if (!isGrabbed.value) {
      if (!activate) return
      e.preventDefault()
      root.grab(value, label)
      return
    }

    if (activate) {
      e.preventDefault()
      root.drop()
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      root.cancel()
      return
    }

    const direction = toDirection(e.key)
    if (!direction) return

    e.preventDefault()
    root.shift(direction)
  }

  function onBlur () {
    if (!isGrabbed.value) return
    // A move that re-renders the item elsewhere detaches this element first;
    // only a real focus departure drops in place.
    if (!el.value?.isConnected) return
    if (root.pending.value === value) return
    root.drop()
  }

  const slotProps = toRef((): KanbanItemSlotProps => ({
    index: index.value,
    state: state.value,
    isGrabbed: isGrabbed.value,
    isDragging: isDragging.value,
    isDisabled: isDisabled.value,
    attrs: {
      'role': 'listitem',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-roledescription': 'draggable item',
      'aria-describedby': root.instructions.value,
      'aria-disabled': isDisabled.value,
      'aria-posinset': index.value + 1,
      'aria-setsize': column.model.value.length,
      'data-state': state.value,
      'data-disabled': isDisabled.value || undefined,
      'onKeydown': onKeydown,
      'onBlur': onBlur,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    ref="atom"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
