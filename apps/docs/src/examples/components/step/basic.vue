<script setup lang="ts">
  import { Button, Step } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const current = shallowRef(1)
</script>

<template>
  <Step.Root v-model="current">
    <template #default="{ next, prev }">
      <Step.Item v-for="i in 3" :key="i" :value="i">
        <template #default="{ isSelected }">
          <div v-if="isSelected" class="p-6 border border-divider rounded mb-4">
            <h3 class="text-lg font-semibold mb-2">Step {{ i }}</h3>
            <p class="text-secondary">Content for step {{ i }}</p>
          </div>
        </template>
      </Step.Item>

      <div class="flex gap-2">
        <Button.Root class="px-4 py-1 border border-divider rounded" @click="prev">Previous</Button.Root>
        <Button.Root class="px-4 py-1 rounded bg-primary text-on-primary" @click="next">Next</Button.Root>
      </div>
    </template>
  </Step.Root>
</template>
