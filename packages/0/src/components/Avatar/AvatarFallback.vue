/**
 * @module AvatarFallback
 *
 * @remarks
 * Fallback content component shown when no images are loaded. Registers with
 * the lowest implicit priority so it only displays when all images fail.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarFallbackProps extends AtomProps {
    /** Namespace for retrieving avatar context */
    namespace?: string
  }

  export interface AvatarFallbackSlotProps {
    /** Whether this fallback is currently visible */
    isSelected: boolean
  }
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useAvatarRoot } from './AvatarRoot.vue'

  // Utilities
  import { onUnmounted, toRef } from 'vue'

  defineOptions({ name: 'AvatarFallback' })

  defineSlots<{
    default: (props: AvatarFallbackSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:avatar',
  } = defineProps<AvatarFallbackProps>()

  const context = useAvatarRoot(namespace)

  const ticket = context.register({ type: 'fallback' })

  const slotProps = toRef((): AvatarFallbackSlotProps => ({
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
