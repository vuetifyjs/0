/**
 * @module LazyPlaceholder
 *
 * @remarks
 * Placeholder component shown before content intersects the viewport.
 * Registers with the Lazy context and displays when content is not yet loaded.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface LazyPlaceholderProps extends AtomProps {
    /** Namespace for retrieving lazy context */
    namespace?: string
  }

  export interface LazyPlaceholderSlotProps {
    /** Whether this placeholder is currently visible */
    isSelected: boolean
  }
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '#v0/components/Atom'
  // Composables
  import { useLazyRoot } from './LazyRoot.vue'

  // Utilities
  import { onUnmounted, toRef } from 'vue'

  defineOptions({ name: 'LazyPlaceholder' })

  defineSlots<{
    default: (props: LazyPlaceholderSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:lazy',
  } = defineProps<LazyPlaceholderProps>()

  const context = useLazyRoot(namespace)

  const ticket = context.register({ type: 'placeholder' })

  const slotProps = toRef((): LazyPlaceholderSlotProps => ({
    isSelected: ticket.isSelected.value,
  }))

  onUnmounted(() => context.unregister(ticket.id))
</script>

<template>
  <Atom
    v-if="ticket.isSelected.value"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
