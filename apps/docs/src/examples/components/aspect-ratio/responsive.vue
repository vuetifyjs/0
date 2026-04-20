<script setup lang="ts">
  import ResponsiveImage from './ResponsiveImage.vue'
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <ResponsiveImage
      alt="Landscape photo"
      :ratio="16 / 9"
      src="https://picsum.photos/seed/ar-1/800/450"
    />
    <ResponsiveImage
      alt="Square photo"
      :ratio="1"
      src="https://picsum.photos/seed/ar-2/400/400"
    />
  </div>
</template>
