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
  <div class="flex flex-col gap-4 w-full max-w-4xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
          Image.Img
        </span>
        <GalleryImage :alt="current().alt" mode="img" :src="current().src" />
        <p class="text-xs text-on-surface-variant">
          Flashes the placeholder between photos.
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
          Image.Swap
        </span>
        <GalleryImage :alt="current().alt" mode="swap" :src="current().src" />
        <p class="text-xs text-on-surface-variant">
          Keeps the previous photo visible, then crossfades.
        </p>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4">
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
  </div>
</template>
