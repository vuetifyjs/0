<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref(['apple'])
</script>

<template>
  <Selection.Root v-model="selected" multiple>
    <div class="flex flex-col gap-1">
      <Selection.Item v-for="item in ['apple', 'banana', 'cherry']" :key="item" :value="item">
        <template #default="{ isSelected, toggle }">
          <button
            class="px-2 py-1 border rounded text-sm"
            :class="isSelected ? 'bg-surfaceTint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            {{ item }}
          </button>
        </template>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-2 text-sm">Selected: {{ selected.join(', ') }}</p>
</template>
