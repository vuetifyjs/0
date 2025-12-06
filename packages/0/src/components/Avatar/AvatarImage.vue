/**
 * @module AvatarImage
 *
 * @remarks
 * Image component that registers with the Avatar context and manages loading state.
 * Automatically shows when loaded and hides on error. Supports priority ordering
 * so higher-priority images are displayed when multiple are available.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarImageProps extends AtomProps {
    /** Image source URL */
    src?: string
    /** Priority for display order (higher = more preferred) */
    priority?: number
    /** Namespace for retrieving avatar context */
    namespace?: string
  }

  export interface AvatarImageEmits {
    load: [e: Event]
    error: [e: Event]
  }

  export interface AvatarImageSlotProps {
    /** Whether this image is currently visible */
    isSelected: boolean
    /** Attributes to bind to the image element */
    attrs: {
      role: 'img'
      src?: string
      onLoad: (e: Event) => void
      onError: (e: Event) => void
    }
  }
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useAvatarRoot } from './AvatarRoot.vue'

  // Utilities
  import { onUnmounted, toRef } from 'vue'

  defineOptions({
    name: 'AvatarImage',
    inheritAttrs: false,
  })

  defineSlots<{
    default: (props: AvatarImageSlotProps) => any
  }>()

  const {
    as = 'img',
    renderless,
    priority = 0,
    namespace = 'v0:avatar',
    ...props
  } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

  const context = useAvatarRoot(namespace)

  const ticket = context.register({
    priority,
    type: 'image',
    disabled: true,
  })

  function onLoad (e: Event) {
    ticket.disabled = false
    ticket.select()
    emit('load', e)
  }

  function onError (e: Event) {
    ticket.disabled = true
    const first = context.seek('first')
    if (first) context.select(first.id)
    emit('error', e)
  }

  onUnmounted(() => {
    context.unregister(ticket.id)
  })

  const slotProps = toRef((): AvatarImageSlotProps => ({
    isSelected: ticket.isSelected.value,
    attrs: {
      role: 'img',
      onLoad,
      onError,
      ...props,
    },
  }))
</script>

<template>
  <Atom
    v-show="ticket.isSelected.value"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
