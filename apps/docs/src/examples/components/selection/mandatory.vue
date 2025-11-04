<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref(['option1'])
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
            :class="isSelected ? 'bg-surfaceTint border-primary' : 'bg-surface border-divider'"
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
