<script setup lang="ts">
  import { Image } from '@vuetify/v0'

  defineProps<{
    src: string
    alt: string
  }>()
</script>

<template>
  <Image.Root
    class="w-full aspect-4/3 bg-surface-tint rounded overflow-hidden relative"
    :src
  >
    <Image.Presence
      :alt
      class="w-full h-full"
      img-class="w-full h-full object-cover duration-500"
    />

    <Image.Placeholder class="absolute inset-0 flex items-center justify-center">
      <div class="w-full h-full bg-surface-tint animate-pulse" />
    </Image.Placeholder>

    <Image.Fallback class="absolute inset-0 flex items-center justify-center bg-error-container text-on-error-container text-sm">
      Failed to load
    </Image.Fallback>
  </Image.Root>
</template>
