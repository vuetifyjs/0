/**
 * @module ImagePlaceholder
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * Placeholder content shown while the image is `idle` or `loading`. Hidden
 * once the image has loaded or errored. Marked `aria-hidden` since it is
 * purely decorative.
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
  import type { ImageStatus } from '#v0/composables/useImage'

  export interface ImagePlaceholderProps extends AtomProps {
    /** Namespace for retrieving the Image context. */
    namespace?: string
  }

  export interface ImagePlaceholderSlotProps {
    /** Current loading status. */
    status: ImageStatus
    /** Attributes to bind to the placeholder element. */
    attrs: {
      'aria-hidden': true
      'data-state': ImageStatus
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ImagePlaceholder' })

  defineSlots<{
    default: (props: ImagePlaceholderSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:image',
  } = defineProps<ImagePlaceholderProps>()

  const context = useImageRoot(namespace)

  const isVisible = toRef(() => context.isIdle.value || context.isLoading.value)

  const slotProps = toRef((): ImagePlaceholderSlotProps => ({
    status: context.status.value,
    attrs: {
      'aria-hidden': true,
      'data-state': context.status.value,
    },
  }))
</script>

<template>
  <Atom
    v-if="isVisible"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
