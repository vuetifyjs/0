<script lang="ts" setup>
  import { Single } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref('medium')
</script>

<template>
  <Single.Root v-model="selected">
    <div class="flex flex-col gap-2">
      <Single.Item v-for="size in ['small', 'medium', 'large']" :key="size" :value="size">
        <template #default="{ isSelected, toggle }">
          <button
            class="px-3 py-1.5 border rounded text-left text-sm"
            :style="{
              backgroundColor: isSelected ? 'var(--v0-surface-tint)' : 'var(--v0-surface)',
              borderColor: isSelected ? 'var(--v0-primary)' : 'var(--v0-divider)'
            }"
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
