<template>
  <VAtom
    ref="atomRef"
    :as="as"
    :as-child="asChild"
    class="v-avatar-image"
    :src="src"
    :style="imageStyle"
  >
    <slot />
  </VAtom>
</template>

<script setup lang="ts">
  import { computed, inject, nextTick, ref, toRef, watch } from 'vue'
  import { useImageLoad } from '../../composables/useImageLoad'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'
  import { AvatarContext } from './VAvatarRoot.vue'

  export interface VAvatarImageProps extends VAtomProps {
    /**
     * The image source URL.
     * @default undefined
     */
    src?: string
  }

  const {
    src,
    as = 'img',
  } = defineProps<VAvatarImageProps>()

  const context = inject(AvatarContext)!
  const atomRef = ref()

  const imageRef = ref<HTMLImageElement | null>(null)
  const { status, setupImageListeners } = useImageLoad(toRef(() => src), imageRef)

  // Sync local image loading status with context
  watch(status, newStatus => {
    context.setImageLoadingStatus(newStatus)
  }, { immediate: true })

  const shouldShow = toRef(() => context.imageLoadingStatus.value === 'loaded')

  const imageStyle = computed(() => {
    return {
      display: shouldShow.value ? 'block' : 'none',
    }
  })

  // Connect the imageRef to the actual DOM element after render
  watch(atomRef, async newAtomRef => {
    if (newAtomRef) {
      await nextTick()
      // Get the actual DOM element from VAtom
      const element = newAtomRef.$el || newAtomRef
      if (element && element.tagName === 'IMG') {
        imageRef.value = element as HTMLImageElement
        setupImageListeners()
      }
    }
  })
</script>
