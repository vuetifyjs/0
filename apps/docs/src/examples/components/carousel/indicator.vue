<script setup lang="ts">
  import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
  import { Carousel } from '@vuetify/v0'
</script>

<template>
  <Carousel.Root>
    <div class="relative">
      <Carousel.Viewport class="rounded-lg overflow-hidden gap-4 scrollbar-hide cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none">
        <Carousel.Item
          v-for="i in 5"
          :key="i"
          class="flex items-center justify-center h-48 rounded-lg text-lg font-medium bg-surface-variant text-on-surface-variant w-full shrink-0"
          :value="i"
        >
          Slide {{ i }}
        </Carousel.Item>
      </Carousel.Viewport>

      <Carousel.Previous class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/80 hover:bg-surface disabled:opacity-0 transition-opacity">
        <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
      </Carousel.Previous>

      <Carousel.Next class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/80 hover:bg-surface disabled:opacity-0 transition-opacity">
        <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronRight" fill="currentColor" /></svg>
      </Carousel.Next>
    </div>

    <Carousel.Indicator v-slot="{ items }" class="flex gap-1.5 justify-center mt-3">
      <button
        v-for="item in items"
        :key="item.index"
        v-bind="item.attrs"
        class="size-2 rounded-full bg-surface-variant transition-colors data-[selected]:bg-primary"
      />
    </Carousel.Indicator>
  </Carousel.Root>
</template>
