<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <span class="text-sm font-medium text-on-surface">Disabled</span>

      <Slider.Root class="relative flex items-center w-full h-5 opacity-50" disabled :model-value="[40]">
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2" />
      </Slider.Root>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-sm font-medium text-on-surface">Readonly</span>

      <Slider.Root class="relative flex items-center w-full h-5" :model-value="[60]" readonly>
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
      </Slider.Root>
    </div>
  </div>
</template>
