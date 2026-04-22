<script setup lang="ts">
  import LazyImage from './LazyImage.vue'

  const photos = [
    { id: 1, src: 'https://picsum.photos/seed/lazy-1/400/300', alt: 'Photo 1' },
    { id: 2, src: 'https://picsum.photos/seed/lazy-2/400/300', alt: 'Photo 2' },
    { id: 3, src: 'https://picsum.photos/seed/lazy-3/400/300', alt: 'Photo 3' },
    { id: 4, src: 'https://picsum.photos/seed/lazy-4/400/300', alt: 'Photo 4' },
  ]
</script>

<template>
  <div class="h-100 overflow-auto border border-divider rounded p-4">
    <p class="text-sm text-on-surface-variant mb-4">
      Scroll to load each image as it enters the viewport.
    </p>

    <div class="flex flex-col gap-100">
      <LazyImage
        v-for="photo in photos"
        :key="photo.id"
        :alt="photo.alt"
        :src="photo.src"
      />
    </div>
  </div>
</template>
