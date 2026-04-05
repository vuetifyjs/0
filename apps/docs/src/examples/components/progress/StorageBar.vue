<script setup lang="ts">
  import { Progress } from '@vuetify/v0'

  const { categories } = defineProps<{
    categories: { name: string, value: number, color: string }[]
  }>()

  const model = defineModel<number[]>({ default: () => [] })
</script>

<template>
  <Progress.Root v-model="model" :max="128">
    <div class="flex items-center justify-between mb-1">
      <Progress.Label class="text-sm font-medium">Storage</Progress.Label>

      <Progress.Value v-slot="{ total }">
        <span class="text-sm text-neutral-500">{{ total }} of 128 GB</span>
      </Progress.Value>
    </div>

    <Progress.Track class="relative flex h-3 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
      <Progress.Fill
        v-for="cat in categories"
        :key="cat.name"
        class="h-full transition-all"
        :class="cat.color"
        :value="cat.value"
      />
    </Progress.Track>
  </Progress.Root>
</template>
