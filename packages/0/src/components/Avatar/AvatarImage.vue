/**
 * @module AvatarImage
 *
 * @see https://0.vuetifyjs.com/components/semantic/avatar
 *
 * @remarks
 * Image component that registers with the Avatar context and manages loading state
 * via useImage. Automatically shows when loaded and hides on error. Supports
 * priority ordering so higher-priority images are displayed when multiple are
 * available.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAvatarRoot } from './AvatarRoot.vue'

  // Composables
  import { useImage } from '#v0/composables/useImage'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ImageStatus } from '#v0/composables/useImage'

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
    /** Current loading status */
    status: ImageStatus
    /** Whether the image has loaded successfully */
    isLoaded: boolean
    /** Whether the image failed to load */
    isError: boolean
    /** Reset the image and re-attempt loading */
    retry: () => void
    /** Attributes to bind to the image element */
    attrs: {
      role: 'img'
      src?: string
      onLoad: (e: Event) => void
      onError: (e: Event) => void
    }
  }
</script>

<script setup lang="ts">
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
    src,
    priority = 0,
    namespace = 'v0:avatar',
  } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

  const context = useAvatarRoot(namespace)

  const image = useImage({ src: toRef(() => src) })

  const ticket = context.register({
    priority,
    type: 'image',
    disabled: true,
  })

  function onLoad (e: Event) {
    image.onLoad(e)
    emit('load', e)
  }

  function onError (e: Event) {
    image.onError(e)
    emit('error', e)
  }

  watch(image.isLoaded, isLoaded => {
    if (isLoaded) {
      ticket.disabled = false
      ticket.select()
    }
  })

  watch(image.isError, isError => {
    if (isError) {
      ticket.disabled = true
      const first = context.seek('first')
      if (first) context.select(first.id)
    }
  })

  onBeforeUnmount(() => {
    context.unregister(ticket.id)
  })

  const slotProps = toRef((): AvatarImageSlotProps => ({
    isSelected: ticket.isSelected.value,
    status: image.status.value,
    isLoaded: image.isLoaded.value,
    isError: image.isError.value,
    retry: image.retry,
    attrs: {
      role: 'img',
      src: image.source.value,
      onLoad,
      onError,
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
