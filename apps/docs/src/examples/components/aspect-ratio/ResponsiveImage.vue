<script setup lang="ts">
  import { AspectRatio, Image } from '@vuetify/v0'

  defineProps<{
    src: string
    alt: string
    ratio: number | string
  }>()
</script>

<template>
  <AspectRatio
    class="w-full bg-surface-tint rounded overflow-hidden relative"
    :ratio
  >
    <Image.Root :src>
      <Image.Img
        :alt
        class="w-full h-full object-cover"
      />

      <Image.Placeholder class="absolute inset-0 flex items-center justify-center">
        <div class="w-full h-full bg-surface-tint animate-pulse" />
      </Image.Placeholder>

      <Image.Fallback class="absolute inset-0 flex items-center justify-center bg-error-container text-on-error-container text-sm">
        Failed to load
      </Image.Fallback>
    </Image.Root>
  </AspectRatio>
</template>
