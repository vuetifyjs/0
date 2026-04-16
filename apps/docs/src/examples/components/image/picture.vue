/* eslint-disable vuejs-accessibility/alt-text */
<script setup lang="ts">
  import { Image } from '@vuetify/v0'
</script>

<template>
  <Image.Root
    renderless
    src="https://picsum.photos/seed/picture/400/300"
  >
    <picture class="block w-100 h-75 bg-surface-tint rounded overflow-hidden relative">
      <source srcset="https://picsum.photos/seed/picture/400/300.webp" type="image/webp">

      <Image.Img
        alt="Format-negotiated photo"
        height="300"
        renderless
        width="400"
      >
        <template #default="{ attrs }">
          <img v-bind="attrs" class="w-full h-full object-cover">
        </template>
      </Image.Img>

      <Image.Placeholder class="absolute inset-0 flex items-center justify-center bg-surface-tint">
        <span class="text-on-surface-variant text-sm">Loading...</span>
      </Image.Placeholder>
    </picture>
  </Image.Root>
</template>
