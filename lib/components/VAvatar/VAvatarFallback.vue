<script setup lang="ts">
  import { computed } from 'vue'
  import { useContextConsumer } from '../../composables/useContext'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'
  import { AvatarContext } from './VAvatarRoot.vue'

  export interface VAvatarFallbackProps extends VAtomProps {}

  const props = withDefaults(defineProps<VAvatarFallbackProps>(), {})

  const context = useContextConsumer(AvatarContext)

  const canRender = computed(() => {
    // Show fallback when image is loading or failed to load
    return context.imageLoadingStatus.value !== 'loaded'
  })
</script>

<template>
  <VAtom
    v-if="canRender"
    :as="props.as || 'span'"
    :as-child="props.asChild"
    class="v-avatar-fallback"
  >
    <slot />
  </VAtom>
</template>
