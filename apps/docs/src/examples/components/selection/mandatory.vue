<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string[]>([])
</script>

<template>
  <Selection.Root v-model="selected" mandatory multiple>
    <div class="flex flex-col gap-2">
      <Selection.Item
        v-for="i in 3"
        :key="i"
        :value="`option${i}`"
      >
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :class="isSelected ? 'bg-surface-tint border-primary' : 'bg-surface border-divider'"
            @click="toggle"
          >
            Option {{ i }}
          </button>
        </template>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-4 text-sm text-secondary">Selected: {{ selected.join(', ') }} (try to deselect all)</p>
</template>
