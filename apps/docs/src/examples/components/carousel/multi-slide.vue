<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'

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
  <Carousel.Root circular :gap="12" :per-view="3">
    <Carousel.Viewport class="rounded-lg">
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
  </Carousel.Root>
</template>
