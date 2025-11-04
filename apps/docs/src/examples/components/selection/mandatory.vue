<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref(['option1'])
</script>

<template>
  <Selection.Root v-model="selected" mandatory multiple>
    <div class="flex flex-col gap-2">
      <Selection.Item v-for="i in 3" :key="i" :value="`option${i}`">
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :style="{
              backgroundColor: isSelected ? 'var(--v0-surface-tint)' : 'var(--v0-surface)',
              borderColor: isSelected ? 'var(--v0-primary)' : 'var(--v0-divider)'
            }"
            @click="toggle"
          >
            Option {{ i }}
          </button>
        </template>
      </Selection.Item>
    </div>
  </Selection.Root>

  <p class="mt-4 text-sm" style="color: var(--v0-secondary);">Selected: {{ selected.join(', ') }} (try to deselect all)</p>
</template>
