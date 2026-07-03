<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'
  import { mdiChevronLeft, mdiChevronRight, mdiPause, mdiPlay } from '@mdi/js'
  import type { Photo } from './useGallery'

  const { photos, interval } = defineProps<{
    photos: Photo[]
    interval: number
  }>()

  const active = defineModel<number>('active', { default: 1 })
</script>

<template>
  <Carousel.Root
    v-slot="{ isAutoplay, play, stop }"
    v-model="active"
    :autoplay="interval"
    circular
  >
    <div class="relative">
      <Carousel.Viewport class="rounded-xl gap-4 px-12 cursor-grab data-[dragging]:cursor-grabbing">
        <Carousel.Item
          v-for="photo in photos"
          :key="photo.id"
          class="flex flex-col justify-end h-56 rounded-xl p-4 text-white font-medium flex-[0_0_100%] transition-opacity opacity-40 data-[active]:opacity-100"
          :class="photo.color"
          :value="photo.id"
        >
          <span class="text-lg font-semibold">{{ photo.title }}</span>
          <span class="text-sm text-white/80">{{ photo.location }}</span>
        </Carousel.Item>
      </Carousel.Viewport>

      <Carousel.Previous class="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-surface/80 text-on-surface shadow hover:bg-surface">
        <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
      </Carousel.Previous>

      <Carousel.Next class="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-surface/80 text-on-surface shadow hover:bg-surface">
        <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronRight" fill="currentColor" /></svg>
      </Carousel.Next>
    </div>

    <div class="mt-3 h-1 rounded-full bg-surface-variant overflow-hidden">
      <Carousel.Progress class="block h-full bg-primary transition-[width] duration-100 ease-linear data-[state=idle]:opacity-0" />
    </div>

    <div class="flex items-center justify-between mt-3">
      <button
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant"
        type="button"
        @click="isAutoplay ? stop() : play()"
      >
        <svg class="size-4" viewBox="0 0 24 24"><path :d="isAutoplay ? mdiPause : mdiPlay" fill="currentColor" /></svg>
        {{ isAutoplay ? 'Pause' : 'Play' }}
      </button>

      <Carousel.Indicator v-slot="{ items }" class="flex items-center gap-1.5">
        <button
          v-for="item in items"
          :key="item.index"
          v-bind="item.attrs"
          class="size-2 rounded-full bg-surface-variant transition-all data-[selected]:w-5 data-[selected]:bg-primary"
        />
      </Carousel.Indicator>
    </div>
  </Carousel.Root>
</template>
