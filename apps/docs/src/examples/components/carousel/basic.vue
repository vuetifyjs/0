<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Carousel.Root circular>
      <Carousel.Viewport class="rounded-lg overflow-hidden">
        <Carousel.Slide
          v-for="i in 5"
          :key="i"
          v-slot="{ isSelected }"
          class="flex items-center justify-center h-48 rounded-lg text-lg font-medium"
          :class="isSelected ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
          :value="i"
        >
          Slide {{ i }}
        </Carousel.Slide>
      </Carousel.Viewport>

      <div class="flex items-center justify-center gap-2">
        <Carousel.Previous
          v-slot="{ attrs }"
          class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant disabled:opacity-40"
        >
          <span v-bind="attrs">Previous</span>
        </Carousel.Previous>

        <Carousel.Next
          v-slot="{ attrs }"
          class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant disabled:opacity-40"
        >
          <span v-bind="attrs">Next</span>
        </Carousel.Next>
      </div>
    </Carousel.Root>
  </div>
</template>
