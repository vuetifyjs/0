/**
 * @module KanbanList
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * The drop zone for one column's items. Must be the direct parent of the
 * column's Kanban.Item elements — pointer drops resolve their index against
 * this element's children. Renders `role="list"`.
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
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { KanbanDrag, KanbanOrientation } from './KanbanRoot.vue'

  export interface KanbanListProps extends AtomProps {
    /** Namespace for context injection from Kanban.Root */
    namespace?: string
  }

  export interface KanbanListSlotProps {
    /** Whether a pointer drag is over this list */
    isOver: boolean
    /** Whether the column is disabled */
    isDisabled: boolean
    /** Whether a picked-up item would drop into this list */
    isTarget: boolean
    /** Attributes to bind to the list element */
    attrs: {
      'role': 'list'
      'data-over': true | undefined
      'data-target': true | undefined
      'data-disabled': true | undefined
      'data-orientation': KanbanOrientation
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'KanbanList', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: KanbanListSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:kanban',
  } = defineProps<KanbanListProps>()

  const root = useKanbanRoot(namespace)
  const column = useKanbanColumn(namespace)

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  function onDrop (drag: KanbanDrag['value'], index: number | undefined) {
    const at = root.locate(drag.value)
    if (!at) return

    let target = index ?? column.ticket.items.size

    // The index resolves against children that still include the dragged
    // item, while a same-column move removes before inserting.
    if (at.column.id === column.ticket.id && at.ticket.index < target) target -= 1

    root.place(drag.value, column.ticket.id, target, drag.label)
  }

  const zone = root.dnd.zones.register({
    el: () => el.value as HTMLElement | null,
    accept: ['item'],
    orientation: column.orientation.value,
    disabled: column.isDisabled,
    onDrop: (drag, position) => onDrop(drag.value, position.index),
  })

  onBeforeUnmount(() => {
    zone.unregister()
  })

  const isTarget = toRef(() => root.preview.value?.column === column.ticket.id)

  const slotProps = toRef((): KanbanListSlotProps => ({
    isOver: zone.isOver.value && zone.willAccept.value,
    isDisabled: column.isDisabled.value,
    isTarget: isTarget.value,
    attrs: {
      'role': 'list',
      'data-over': (zone.isOver.value && zone.willAccept.value) || undefined,
      'data-target': isTarget.value || undefined,
      'data-disabled': column.isDisabled.value || undefined,
      'data-orientation': column.orientation.value,
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
