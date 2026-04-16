<script setup lang="ts">
  import { Image } from '@vuetify/v0'
</script>

<template>
  <div class="h-100 overflow-auto border border-divider rounded p-4">
    <p class="text-sm text-on-surface-variant mb-4">
      Scroll to bring the image into view — it will only start loading then.
    </p>

    <div class="h-100 flex items-center justify-center text-on-surface-variant">
      Scroll down ↓
    </div>

    <Image.Root
      class="w-100 h-75 bg-surface-tint rounded overflow-hidden relative mx-auto"
      lazy
      root-margin="100px"
      src="https://picsum.photos/seed/observer/400/300"
    >
      <Image.Img
        alt="Observer-driven photo"
        class="w-full h-full object-cover transition-opacity duration-500"
        height="300"
        width="400"
      />

      <Image.Placeholder class="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm">
        Waiting to enter viewport...
      </Image.Placeholder>
    </Image.Root>

    <div class="h-100" />
  </div>
</template>
