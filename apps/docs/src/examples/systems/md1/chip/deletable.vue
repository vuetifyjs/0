<script setup lang="ts">
  import { Md1Button, Md1Chip } from '@paper/md1'

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
  <div class="md1-docs-stack">
    <div class="md1-docs-row">
      <Md1Chip
        v-for="filter in filters"
        :key="filter"
        deletable
        @delete="onDelete(filter)"
      >
        {{ filter }}
      </Md1Chip>

      <span v-if="filters.length === 0" class="md1-docs-note" role="status">No filters</span>
    </div>

    <Md1Button :disabled="filters.length === INITIAL.length" @click="onReset">Reset</Md1Button>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
