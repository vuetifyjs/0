<template>
  <VAtom
    v-if="canRender"
    :as="as || 'span'"
    :as-child="asChild"
    class="v-avatar-fallback"
  >
    <slot />
  </VAtom>
</template>

<script setup lang="ts">
  import { inject, toRef } from 'vue'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'
  import { AvatarContext } from './VAvatarRoot.vue'

  export interface VAvatarFallbackProps extends VAtomProps {}

  defineProps<VAvatarFallbackProps>()

  const context = inject(AvatarContext)!

  const canRender = toRef(() => context.imageLoadingStatus.value !== 'loaded')
</script>
