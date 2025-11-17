<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref([])
</script>

<template>
  <Selection.Root v-model="selected" multiple>
    <div class="flex flex-col gap-2">
      <Selection.Item value="option1">
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :class="isSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            Option 1
          </button>
        </template>
      </Selection.Item>

      <Selection.Item :disabled="true" value="option2">
        <template #default="{ disabled }">
          <button
            class="px-3 py-1.5 border border-divider rounded text-left text-sm opacity-50 bg-surface-tint"
            :disabled="disabled"
          >
            Option 2 (disabled)
          </button>
        </template>
      </Selection.Item>

      <Selection.Item value="option3">
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :class="isSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            Option 3
          </button>
        </template>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-4">Selected: {{ selected.join(', ') || 'none' }}</p>
</template>
