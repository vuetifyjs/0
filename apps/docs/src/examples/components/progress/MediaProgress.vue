<script setup lang="ts">
  import { Progress } from '@vuetify/v0'

  const { buffer = 0 } = defineProps<{
    buffer?: number
  }>()

  const model = defineModel<number>({ default: 0 })
</script>

<template>
  <Progress.Root v-model="model">
    <Progress.Track class="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
      <Progress.Buffer
        class="absolute inset-y-0 left-0 rounded-full bg-neutral-300 dark:bg-neutral-600 transition-all"
        :value="buffer"
      />

      <Progress.Fill class="absolute inset-y-0 left-0 rounded-full bg-red-500 transition-all" />
    </Progress.Track>
  </Progress.Root>
</template>
