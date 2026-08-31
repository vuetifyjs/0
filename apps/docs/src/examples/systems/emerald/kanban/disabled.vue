<script setup lang="ts">
  import { EmButton, EmKanban, EmKanbanColumn } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const frozen = shallowRef(false)

  const columns = [
    {
      title: 'Requested',
      cards: [
        { value: 'Export the board as CSV' },
        { value: 'Column-level card limits' },
      ],
    },
    {
      title: 'Planned',
      cards: [
        { value: 'Swimlane grouping' },
      ],
    },
  ]

  function onToggle () {
    frozen.value = !frozen.value
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <div>
      <EmButton variant="secondary" @click="onToggle">
        {{ frozen ? 'Unfreeze the board' : 'Freeze the board' }}
      </EmButton>
    </div>

    <EmKanban class="emerald-docs-kanban" :disabled="frozen" label="Roadmap board">
      <EmKanbanColumn
        v-for="column in columns"
        :key="column.title"
        v-slot="{ card }"
        :cards="column.cards"
        :title="column.title"
      >
        <p class="emerald-docs-card">{{ card.value }}</p>
      </EmKanbanColumn>
    </EmKanban>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-card {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: 1.4;
  }
</style>
