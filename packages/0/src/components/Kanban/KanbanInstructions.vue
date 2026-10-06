/**
 * @module KanbanInstructions
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * Keyboard instructions for the board. Every Kanban.Item references this
 * element through `aria-describedby` while it is mounted, so screen readers
 * read how to move an item when it takes focus. Usually visually hidden.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useKanbanRoot } from './KanbanRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface KanbanInstructionsProps extends AtomProps {
    /** Element id. Auto-generated when omitted. */
    id?: string
    /** Namespace for context injection from Kanban.Root */
    namespace?: string
  }

  export interface KanbanInstructionsSlotProps {
    /** Localized instruction text */
    text: string
    /** Attributes to bind to the instructions element */
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'KanbanInstructions', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default?: (props: KanbanInstructionsSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    namespace = 'v0:kanban',
  } = defineProps<KanbanInstructionsProps>()

  const root = useKanbanRoot(namespace)
  const locale = useLocale()

  root.instructions.value = id

  onBeforeUnmount(() => {
    if (root.instructions.value === id) root.instructions.value = undefined
  })

  const slotProps = toRef((): KanbanInstructionsSlotProps => ({
    text: locale.ti('Kanban.instructions')
      ?? 'Press Space or Enter to pick up an item. Use the arrow keys to choose where it goes, Space or Enter to drop it, and Escape to cancel.',
    attrs: { id },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps">{{ slotProps.text }}</slot>
  </Atom>
</template>
