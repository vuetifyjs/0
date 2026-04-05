<script setup lang="ts">
  import { Progress, Slider } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const value = shallowRef(65)
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <Progress.Root v-model="value">
      <Progress.Label class="text-sm font-medium">Loading...</Progress.Label>

      <Progress.Track class="relative h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <Progress.Fill class="h-full rounded-full bg-primary" />
      </Progress.Track>

      <Progress.Value class="text-sm text-neutral-500" />
    </Progress.Root>

    <Slider.Root v-model="value" class="relative flex items-center w-full h-5">
      <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
        <Slider.Range class="absolute h-full rounded-full bg-primary" />
      </Slider.Track>

      <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
    </Slider.Root>
  </div>
</template>
