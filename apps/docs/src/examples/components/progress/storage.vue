<script setup lang="ts">
  import StorageBar from './StorageBar.vue'
  import { Slider } from '@vuetify/v0'
  import { ref } from 'vue'

  const categories = ref([
    { name: 'Photos', value: 32, color: 'bg-blue-500' },
    { name: 'Apps', value: 24, color: 'bg-purple-500' },
    { name: 'Documents', value: 12, color: 'bg-amber-500' },
    { name: 'System', value: 8, color: 'bg-neutral-400' },
  ])

  const values = ref(categories.value.map(c => c.value))
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <StorageBar v-model="values" :categories />

    <div class="grid grid-cols-2 gap-3">
      <div v-for="(cat, index) in categories" :key="cat.name" class="flex items-center gap-2">
        <span class="size-3 rounded-full" :class="cat.color" />
        <span class="text-sm min-w-18">{{ cat.name }}</span>

        <Slider.Root v-model="categories[index].value" class="relative flex flex-1 items-center h-5" :max="64">
          <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
            <Slider.Range class="absolute h-full rounded-full bg-primary" />
          </Slider.Track>

          <Slider.Thumb class="absolute size-4 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
        </Slider.Root>

        <span class="text-sm text-neutral-500 w-12 text-right">{{ cat.value }} GB</span>
      </div>
    </div>
  </div>
</template>
