<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'
  import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Carousel.Root>
      <Carousel.Viewport class="rounded-lg overflow-hidden gap-4 cursor-grab data-[dragging]:cursor-grabbing">
        <Carousel.Item
          v-for="i in 5"
          :key="i"
          class="flex items-center justify-center h-48 rounded-lg text-lg font-medium bg-surface-variant text-on-surface-variant w-full shrink-0"
          :value="i"
        >
          Slide {{ i }}
        </Carousel.Item>
      </Carousel.Viewport>

      <div class="flex items-center justify-center gap-2 mt-3">
        <Carousel.Previous class="p-2 rounded-full border border-divider hover:bg-surface-variant disabled:opacity-40">
          <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
        </Carousel.Previous>

        <Carousel.Next class="p-2 rounded-full border border-divider hover:bg-surface-variant disabled:opacity-40">
          <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronRight" fill="currentColor" /></svg>
        </Carousel.Next>
      </div>
    </Carousel.Root>
  </div>
</template>
