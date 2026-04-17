<script setup lang="ts">
  import { Image } from '@vuetify/v0'

  defineProps<{
    src: string
    sources: { srcset: string, type: string }[]
    alt: string
    width: number
    height: number
  }>()
</script>

<template>
  <Image.Root
    renderless
    :src
  >
    <picture class="block w-full aspect-4/3 bg-surface-tint rounded overflow-hidden relative">
      <source
        v-for="source in sources"
        :key="source.type"
        :srcset="source.srcset"
        :type="source.type"
      >

      <Image.Img
        v-slot="{ attrs }"
        :alt
        :height
        renderless
        :width
      >
        <img
          v-bind="attrs"
          :alt="attrs.alt"
          class="w-full h-full object-cover"
        >
      </Image.Img>

      <Image.Placeholder class="absolute inset-0 flex items-center justify-center bg-surface-tint">
        <span class="text-on-surface-variant text-sm">Loading...</span>
      </Image.Placeholder>

      <Image.Fallback class="absolute inset-0 flex items-center justify-center bg-error-container text-on-error-container text-sm">
        Image failed to load
      </Image.Fallback>
    </picture>
  </Image.Root>
</template>
