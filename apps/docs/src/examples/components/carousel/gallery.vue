<script setup lang="ts">
  import Gallery from './Gallery.vue'
  import { useGallery } from './useGallery'

  const { photos, interval, active, current, position } = useGallery()
</script>

<template>
  <div class="flex flex-col gap-4 max-w-md mx-auto">
    <Gallery v-model:active="active" :interval :photos />

    <div class="flex items-center justify-between rounded-lg bg-surface-variant text-on-surface px-4 py-3">
      <div class="flex flex-col">
        <span class="text-sm font-medium">{{ current.title }}</span>
        <span class="text-xs text-on-surface-variant">{{ current.location }}</span>
      </div>

      <span class="text-xs text-on-surface-variant">{{ position }} / {{ photos.length }}</span>
    </div>

    <p class="text-xs text-on-surface-variant">
      Drag, or use the arrows and dots to browse. Press Play to auto-advance — autoplay pauses automatically while you drag.
    </p>
  </div>
</template>
