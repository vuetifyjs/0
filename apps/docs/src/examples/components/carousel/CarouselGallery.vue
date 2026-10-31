<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'
  import { mdiChevronLeft, mdiChevronRight, mdiPlay, mdiStop } from '@mdi/js'
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
    class="flex flex-col"
  >
    <div class="flex items-center justify-between mt-3 order-3">
      <button
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant"
        type="button"
        @click="isAutoplay ? stop() : play()"
      >
        <svg class="size-4" viewBox="0 0 24 24"><path :d="isAutoplay ? mdiStop : mdiPlay" fill="currentColor" /></svg>
        {{ isAutoplay ? 'Stop' : 'Play' }}
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

    <div class="relative order-1">
      <Carousel.Viewport class="rounded-xl gap-4 px-12 cursor-grab data-[dragging]:cursor-grabbing">
        <Carousel.Item
          v-for="photo in photos"
          :key="photo.id"
          class="relative flex flex-col justify-end h-56 overflow-hidden rounded-xl p-4 text-white font-medium flex-[0_0_100%] transition-opacity opacity-40 data-[active]:opacity-100"
          :value="photo.id"
        >
          <img
            :alt="photo.title"
            class="absolute inset-0 size-full object-cover pointer-events-none"
            draggable="false"
            :src="photo.src"
          >

          <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          <span class="relative text-lg font-semibold">{{ photo.title }}</span>
          <span class="relative text-sm text-white/80">{{ photo.location }}</span>
        </Carousel.Item>
      </Carousel.Viewport>

      <Carousel.Previous class="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-surface/80 text-on-surface shadow hover:bg-surface">
        <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
      </Carousel.Previous>

      <Carousel.Next class="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-full bg-surface/80 text-on-surface shadow hover:bg-surface">
        <svg class="size-5" viewBox="0 0 24 24"><path :d="mdiChevronRight" fill="currentColor" /></svg>
      </Carousel.Next>
    </div>

    <div class="mt-3 h-1 rounded-full bg-surface-variant overflow-hidden order-2">
      <Carousel.Progress class="block h-full bg-primary transition-[width] duration-100 ease-linear data-[state=idle]:opacity-0" />
    </div>
  </Carousel.Root>
</template>
