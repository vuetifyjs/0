<script setup lang="ts">
  import { QuButton, QuChip } from '@paper/quantum'

  import { ref } from 'vue'

  const INITIAL = ['Toronto', 'This week', 'Has attachment', 'Unread']

  const filters = ref([...INITIAL])

  function onDelete (filter: string) {
    filters.value = filters.value.filter(item => item !== filter)
  }

  function onReset () {
    filters.value = [...INITIAL]
  }
</script>

<template>
  <div class="quantum-docs-stack">
    <div class="quantum-docs-row">
      <QuChip
        v-for="filter in filters"
        :key="filter"
        deletable
        @delete="onDelete(filter)"
      >
        {{ filter }}
      </QuChip>

      <span v-if="filters.length === 0" class="quantum-docs-note" role="status">No filters</span>
    </div>

    <QuButton :disabled="filters.length === INITIAL.length" @click="onReset">Reset</QuButton>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
