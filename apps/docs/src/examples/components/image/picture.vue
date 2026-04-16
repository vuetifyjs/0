<script setup lang="ts">
  import PictureImage from './PictureImage.vue'
</script>

<template>
  <PictureImage
    alt="Format-negotiated photo"
    :height="300"
    :sources="[
      { srcset: 'https://picsum.photos/seed/picture/400/300.webp', type: 'image/webp' },
    ]"
    src="https://picsum.photos/seed/picture/400/300"
    :width="400"
  />
</template>
