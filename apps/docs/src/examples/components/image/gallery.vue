<script setup lang="ts">
  import GalleryImage from './GalleryImage.vue'
  import { shallowRef } from 'vue'

  const photos = [
    { id: 1, src: 'https://picsum.photos/seed/gallery-1/600/450', alt: 'Photo 1' },
    { id: 2, src: 'https://picsum.photos/seed/gallery-2/600/450', alt: 'Photo 2' },
    { id: 3, src: 'https://picsum.photos/seed/gallery-3/600/450', alt: 'Photo 3' },
    { id: 4, src: 'https://picsum.photos/seed/gallery-4/600/450', alt: 'Photo 4' },
  ]

  const index = shallowRef(0)
  function current () {
    return photos[index.value]!
  }

  function onNext () {
    index.value = (index.value + 1) % photos.length
  }

  function onPrev () {
    index.value = (index.value - 1 + photos.length) % photos.length
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
    <GalleryImage :alt="current().alt" :src="current().src" />

    <div class="flex items-center gap-4">
      <button
        class="px-3 py-1 bg-primary text-on-primary rounded text-sm"
        @click="onPrev"
      >
        Previous
      </button>

      <span class="text-sm text-on-surface-variant">
        {{ index + 1 }} / {{ photos.length }}
      </span>

      <button
        class="px-3 py-1 bg-primary text-on-primary rounded text-sm"
        @click="onNext"
      >
        Next
      </button>
    </div>

    <p class="text-xs text-on-surface-variant text-center max-w-md">
      The previous photo stays on screen while the next loads — no flash to the placeholder between navigations.
    </p>
  </div>
</template>
