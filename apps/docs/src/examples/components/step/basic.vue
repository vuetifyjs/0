<script lang="ts" setup>
  import { Step } from '@vuetify/v0'
  import { ref } from 'vue'

  const current = ref('step1')
</script>

<template>
  <Step.Root v-model="current">
    <template #default="{ next, prev }">
      <Step.Item v-for="i in 3" :key="i" :value="`step${i}`">
        <template #default="{ isSelected }">
          <div v-if="isSelected" class="p-6 border rounded mb-4" style="border-color: var(--v0-divider);">
            <h3 class="text-lg font-semibold mb-2">Step {{ i }}</h3>
            <p style="color: var(--v0-secondary);">Content for step {{ i }}</p>
          </div>
        </template>
      </Step.Item>

      <div class="flex gap-2">
        <button class="px-4 py-1 border rounded" style="border-color: var(--v0-divider);" @click="prev">Previous</button>
        <button class="px-4 py-1 rounded" style="background-color: var(--v0-primary); color: var(--v0-on-primary);" @click="next">Next</button>
      </div>
    </template>
  </Step.Root>
</template>
