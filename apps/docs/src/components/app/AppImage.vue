<script setup lang="ts">
  // Framework
  import { Image } from '@vuetify/v0'

  const { src, alt, caption } = defineProps<{
    src: string
    alt: string
    caption?: string
  }>()
</script>

<template>
  <figure class="my-4">
    <Image.Root
      :lazy="true"
      root-margin="200px"
      :src
    >
      <Image.Placeholder>
        <div class="bg-surface-variant animate-pulse w-full rounded-lg" style="min-height: 12rem" />
      </Image.Placeholder>

      <Image.Img
        :alt
        class="rounded-lg w-full block"
      />

      <Image.Fallback v-slot="{ retry }">
        <div class="bg-surface-variant text-on-surface-variant flex flex-col items-center justify-center gap-2 rounded-lg w-full p-6" style="min-height: 12rem">
          <span class="text-sm">Failed to load image</span>

          <button
            class="text-xs bg-surface text-on-surface rounded px-3 py-1 hover:bg-surface-tint"
            type="button"
            @click="retry"
          >
            Retry
          </button>
        </div>
      </Image.Fallback>
    </Image.Root>

    <figcaption
      v-if="caption"
      class="text-sm text-on-surface-variant mt-2 text-center"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
