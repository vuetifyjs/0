<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref('apple')
</script>

<template>
  <Selection.Root v-model="selected">
    <div class="flex flex-col gap-2">
      <Selection.Item
        v-for="item in ['apple', 'banana', 'cherry']"
        :key="item"
        :value="item"
      >
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :class="isSelected ? 'bg-surfaceTint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            {{ item }}
          </button>
        </template>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-4">Selected: {{ selected }}</p>
</template>
