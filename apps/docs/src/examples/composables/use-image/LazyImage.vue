/* eslint-disable vuejs-accessibility/alt-text */
<script setup lang="ts">
  import { toRef } from 'vue'
  import { useLazyImage } from './useLazyImage'

  const props = defineProps<{
    src: string
    alt: string
  }>()

  const { target, source, isLoaded, status, onLoad, onError } = useLazyImage(
    toRef(() => props.src),
  )
</script>

<template>
  <div ref="target" class="w-full aspect-4/3 bg-surface-tint rounded overflow-hidden relative">
    <img
      v-show="isLoaded"
      :alt
      class="w-full h-full object-cover"
      :src="source"
      @error="onError"
      @load="onLoad"
    >

    <span
      v-if="!isLoaded"
      class="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm"
    >
      {{ status }}
    </span>
  </div>
</template>
