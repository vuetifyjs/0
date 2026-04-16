<script setup lang="ts">
  import { Image } from '@vuetify/v0'
</script>

<template>
  <div class="flex items-center justify-center">
    <Image.Root
      class="w-100 h-75 bg-surface-tint rounded overflow-hidden relative"
      src="https://picsum.photos/seed/v0-image/400/300"
    >
      <Image.Img
        alt="Random photo"
        class="w-full h-full object-cover"
        height="300"
        loading="lazy"
        width="400"
      />

      <Image.Placeholder class="absolute inset-0 flex items-center justify-center">
        <div class="w-full h-full bg-surface-tint animate-pulse" />
      </Image.Placeholder>

      <Image.Fallback class="absolute inset-0 flex items-center justify-center bg-error-container text-on-error-container text-sm">
        Image failed to load
      </Image.Fallback>
    </Image.Root>
  </div>
</template>
