/**
 * @module ImageFallback
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * Fallback content shown when the image fails to load. Exposes a `retry`
 * function via slot props so consumers can build retry UI.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useImageRoot } from './ImageRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ImageFallbackProps extends AtomProps {
    /** Namespace for retrieving the Image context. */
    namespace?: string
  }

  export interface ImageFallbackSlotProps {
    /** Reset the image and re-attempt loading. */
    retry: () => void
    /** Attributes to bind to the fallback element. */
    attrs: {
      'role': 'img'
      'data-state': 'error'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ImageFallback' })

  defineSlots<{
    default: (props: ImageFallbackSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:image',
  } = defineProps<ImageFallbackProps>()

  const context = useImageRoot(namespace)

  const slotProps = toRef((): ImageFallbackSlotProps => ({
    retry: context.retry,
    attrs: {
      'role': 'img',
      'data-state': 'error',
    },
  }))
</script>

<template>
  <Atom
    v-if="context.isError.value"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
