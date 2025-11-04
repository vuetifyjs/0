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
            :style="{
              backgroundColor: isSelected ? 'var(--v0-surface-tint)' : 'var(--v0-surface)',
              borderColor: isSelected ? 'var(--v0-primary)' : 'var(--v0-divider)'
            }"
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
