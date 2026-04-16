/* eslint-disable vuejs-accessibility/alt-text */
<script setup lang="ts">
  import { useImage, useIntersectionObserver } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const target = shallowRef<HTMLElement>()

  const { isIntersecting } = useIntersectionObserver(target, () => {}, {
    once: true,
    rootMargin: '0px',
  })

  const { source, isLoaded, status, onLoad, onError } = useImage({
    src: 'https://picsum.photos/seed/lazy/400/300',
    eager: isIntersecting,
  })
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-on-surface-variant">
      Scroll the image into view to start loading.
    </p>

    <div class="h-100 overflow-auto border border-divider rounded p-4">
      <div class="h-100 flex items-center justify-center text-on-surface-variant">
        Scroll down ↓
      </div>

      <div ref="target" class="w-100 h-75 bg-surface-tint rounded overflow-hidden flex items-center justify-center mx-auto">
        <img
          v-show="isLoaded"
          alt="Lazy-loaded photo"
          class="w-full h-full object-cover"
          :src="source"
          @error="onError"
          @load="onLoad"
        >
        <span v-if="!isLoaded" class="text-on-surface-variant text-sm">
          {{ status }}
        </span>
      </div>

      <div class="h-100" />
    </div>
  </div>
</template>
