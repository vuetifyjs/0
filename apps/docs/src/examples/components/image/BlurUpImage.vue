<script setup lang="ts">
  import { Image } from '@vuetify/v0'

  defineProps<{
    src: string
    placeholder: string
    alt: string
  }>()
</script>

<template>
  <Image.Root
    class="w-full aspect-4/3 bg-surface-tint rounded overflow-hidden relative"
    lazy
    root-margin="200px"
    :src
  >
    <Image.Img
      :alt
      class="w-full h-full object-cover opacity-0 transition-opacity duration-500 data-[state=loaded]:opacity-100"
      height="300"
      width="400"
    />

    <Image.Placeholder class="absolute inset-0">
      <img
        :alt
        aria-hidden="true"
        class="w-full h-full object-cover scale-105 blur-xl"
        :src="placeholder"
      >
    </Image.Placeholder>
  </Image.Root>
</template>
