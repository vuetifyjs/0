<script setup lang="ts">
  import StorageBar from './StorageBar.vue'
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
        <span class="text-sm">{{ cat.name }}</span>

        <input
          v-model.number="categories[index].value"
          class="flex-1"
          max="64"
          min="0"
          type="range"
        >

        <span class="text-sm text-neutral-500 w-12 text-right">{{ cat.value }} GB</span>
      </div>
    </div>
  </div>
</template>
