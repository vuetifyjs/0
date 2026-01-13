<script setup lang="ts">
  import { Single } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string>()
</script>

<template>
  <Single.Root v-model="selected">
    <div class="flex flex-col gap-2">
      <Single.Item v-for="size in ['small', 'medium', 'large']" :key="size" :value="size">
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :class="isSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            {{ size }}
          </button>
        </template>
      </Single.Item>
    </div>
  </Single.Root>

  <p class="mt-4">Selected: {{ selected }}</p>
</template>
