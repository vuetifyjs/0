<script setup lang="ts">
  import { Carousel, Switch } from '@vuetify/v0'

  const items = [
    { id: 1, label: 'Design' },
    { id: 2, label: 'Develop' },
    { id: 3, label: 'Test' },
    { id: 4, label: 'Deploy' },
    { id: 5, label: 'Monitor' },
    { id: 6, label: 'Iterate' },
  ]
</script>

<template>
  <Carousel.Root
    v-slot="{ isAutoplay, play, stop }"
    :autoplay="3000"
    circular
    :gap="12"
    :per-view="3"
  >
    <Carousel.Viewport class="rounded-lg scrollbar-hide cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none">
      <Carousel.Item
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-center h-32 rounded-lg text-sm font-medium bg-surface-variant text-on-surface-variant"
        :value="item.id"
      >
        {{ item.label }}
      </Carousel.Item>
    </Carousel.Viewport>

    <div class="flex items-center justify-center gap-2 mt-3">
      <Carousel.Previous class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant disabled:opacity-40">
        Previous
      </Carousel.Previous>

      <Carousel.Next class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant disabled:opacity-40">
        Next
      </Carousel.Next>
    </div>

    <label class="flex items-center justify-center gap-2 mt-3 cursor-pointer">
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
</template>
