<script setup lang="ts">
  import { Group } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref(['apple', 'banana'])
</script>

<template>
  <Group.Root
    v-slot="{ isAllSelected, toggleAll, isMixed }"
    v-model="selected"
  >
    <div class="flex flex-col gap-2">
      <button
        class="px-3 py-1.5 border rounded text-left text-sm flex items-center gap-2"
        :class="isAllSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
        @click="toggleAll"
      >
        <input
          :checked="isAllSelected"
          class="pointer-events-none"
          :indeterminate="isMixed"
          type="checkbox"
        >
        Select All
      </button>

      <Group.Item
        v-for="item in ['apple', 'banana', 'cherry']"
        :key="item"
        v-slot="{ isSelected, toggle }"
        :value="item"
      >
        <button
          class="px-3 py-1.5 border rounded text-left text-sm flex items-center gap-2"
          :class="isSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
          @click="toggle"
        >
          <input
            :checked="isSelected"
            class="pointer-events-none"
            type="checkbox"
          >
          {{ item }}
        </button>
      </Group.Item>
    </div>
  </Group.Root>

  <p class="mt-4">Selected: {{ selected.join(', ') }}</p>
</template>
