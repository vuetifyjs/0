<script lang="ts" setup>
  import { Group } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref(['apple', 'banana'])
</script>

<template>
  <Group.Root v-model="selected">
    <div class="flex flex-col gap-2">
      <Group.Item
        v-for="item in ['apple', 'banana', 'cherry']"
        :key="item"
        :value="item"
      >
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :class="isSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            {{ item }}
          </button>
        </template>
      </Group.Item>
    </div>
  </Group.Root>

  <p class="mt-4">Selected: {{ selected.join(', ') }}</p>
</template>
