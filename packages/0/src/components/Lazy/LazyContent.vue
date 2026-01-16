/**
 * @module LazyContent
 *
 * @remarks
 * Content component shown after the element intersects the viewport.
 * Registers with the Lazy context and displays when content is loaded.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface LazyContentProps extends AtomProps {
    /** Namespace for retrieving lazy context */
    namespace?: string
  }

  export interface LazyContentSlotProps {
    /** Whether this content is currently visible */
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

  defineOptions({ name: 'LazyContent' })

  defineSlots<{
    default: (props: LazyContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:lazy',
  } = defineProps<LazyContentProps>()

  const context = useLazyRoot(namespace)

  const ticket = context.register({ type: 'content' })

  const slotProps = toRef((): LazyContentSlotProps => ({
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
