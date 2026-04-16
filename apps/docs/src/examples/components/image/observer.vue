<script setup lang="ts">
  import BlurUpImage from './BlurUpImage.vue'

  const photos = [
    {
      id: 1,
      src: 'https://picsum.photos/seed/blur-1/400/300',
      placeholder: 'https://picsum.photos/seed/blur-1/20/15',
      alt: 'Photo 1',
    },
    {
      id: 2,
      src: 'https://picsum.photos/seed/blur-2/400/300',
      placeholder: 'https://picsum.photos/seed/blur-2/20/15',
      alt: 'Photo 2',
    },
    {
      id: 3,
      src: 'https://picsum.photos/seed/blur-3/400/300',
      placeholder: 'https://picsum.photos/seed/blur-3/20/15',
      alt: 'Photo 3',
    },
  ]
</script>

<template>
  <div class="h-100 overflow-auto border border-divider rounded p-4">
    <p class="text-sm text-on-surface-variant mb-4">
      A low-quality placeholder shows first; the full image fades in once it
      loads. Scroll to trigger the next image.
    </p>

    <div class="flex flex-col gap-100">
      <BlurUpImage
        v-for="photo in photos"
        :key="photo.id"
        :alt="photo.alt"
        :placeholder="photo.placeholder"
        :src="photo.src"
      />
    </div>
  </div>
</template>
