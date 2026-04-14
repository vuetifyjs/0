<script setup lang="ts">
  import { Carousel, Switch } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Carousel.Root v-slot="{ isAutoplay, play, stop }" :autoplay="3000" circular>
      <Carousel.Viewport class="rounded-lg overflow-hidden">
        <Carousel.Item
          v-for="i in 5"
          :key="i"
          class="flex items-center justify-center h-48 rounded-lg text-lg font-medium bg-surface-variant text-on-surface-variant w-full shrink-0"
          :value="i"
        >
          Slide {{ i }}
        </Carousel.Item>
      </Carousel.Viewport>

      <div class="flex items-center justify-center gap-2">
        <Carousel.Previous class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant disabled:opacity-40">
          Previous
        </Carousel.Previous>

        <Carousel.Next class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant disabled:opacity-40">
          Next
        </Carousel.Next>
      </div>

      <label class="flex items-center justify-center gap-2 cursor-pointer">
        <Switch.Root
          class="inline-flex items-center border-none bg-transparent p-0 outline-none"
          :model-value="isAutoplay"
          @update:model-value="$event ? play() : stop()"
        >
          <Switch.Track
            class="relative inline-flex items-center w-11 h-6 rounded-full bg-surface-variant transition-colors data-[state=checked]:bg-primary"
          >
            <Switch.Thumb
              class="![visibility:visible] block size-4 rounded-full bg-white shadow-sm transition-transform translate-x-1 data-[state=checked]:translate-x-6"
            />
          </Switch.Track>
        </Switch.Root>

        <span class="text-sm">Autoplay</span>
      </label>
    </Carousel.Root>
  </div>
</template>
