<script setup lang="ts">
  import { EmKanban, EmKanbanColumn } from '@paper/emerald'

  const columns = [
    {
      title: 'Todo',
      cards: [
        { value: 'Invoice #1842' },
        { value: 'Design review' },
        { value: 'Launch checklist' },
      ],
    },
    {
      title: 'Doing',
      cards: [
        { value: 'Onboarding emails' },
      ],
    },
    {
      title: 'Done',
      cards: [
        { value: 'Pricing page' },
        { value: 'Brand refresh' },
      ],
    },
  ]
</script>

<template>
  <EmKanban label="Release board">
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
</template>

<style>
  .emerald-docs-card {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: 1.4;
  }
</style>
