<script setup lang="ts">
  import { computed, nextTick, ref, toRef, watch } from 'vue'
  import { useContextConsumer } from '../../composables/useContext'
  import { useImageLoad } from '../../composables/useImageLoad'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'
  import { AvatarContext } from './VAvatarRoot.vue'

  export interface VAvatarImageProps extends VAtomProps {
    src?: string
  }

  const props = defineProps<VAvatarImageProps>()

  const context = useContextConsumer(AvatarContext)
  const atomRef = ref()

  const srcRef = toRef(props, 'src')
  const imageRef = ref<HTMLImageElement | null>(null)
  const { status, setupImageListeners } = useImageLoad(srcRef, imageRef)

  // Sync local image loading status with context
  watch(status, newStatus => {
    context.setImageLoadingStatus(newStatus)
  }, { immediate: true })

  const shouldShow = computed(() => {
    return context.imageLoadingStatus.value === 'loaded'
  })

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

<template>
  <VAtom
    ref="atomRef"
    :as="props.as || 'img'"
    :as-child="props.asChild"
    class="v-avatar-image"
    :src="props.src"
    :style="imageStyle"
  >
    <slot />
  </VAtom>
</template>
