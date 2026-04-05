<script setup lang="ts">
  import { Progress } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const value = shallowRef(65)
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <Progress.Root v-model="value">
      <Progress.Label class="text-sm font-medium">Loading...</Progress.Label>

      <Progress.Track class="relative h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <Progress.Fill class="h-full rounded-full bg-blue-500" />
      </Progress.Track>

      <Progress.Value class="text-sm text-neutral-500" />
    </Progress.Root>

    <input v-model.number="value" max="100" min="0" type="range">
  </div>
</template>
