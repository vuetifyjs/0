<script setup lang="ts">
  import { Step } from '@vuetify/v0'
  import { ref } from 'vue'

  const current = ref('step1')
</script>

<template>
  <Step.Root v-model="current">
    <template #default="{ next, prev }">
      <Step.Item v-for="i in 3" :key="i" :value="`step${i}`">
        <template #default="{ isSelected }">
          <div v-if="isSelected" class="p-6 border border-divider rounded mb-4">
            <h3 class="text-lg font-semibold mb-2">Step {{ i }}</h3>
            <p class="text-secondary">Content for step {{ i }}</p>
          </div>
        </template>
      </Step.Item>

      <div class="flex gap-2">
        <button class="px-4 py-1 border border-divider rounded" @click="prev">Previous</button>
        <button class="px-4 py-1 rounded bg-primary text-on-primary" @click="next">Next</button>
      </div>
    </template>
  </Step.Root>
</template>
