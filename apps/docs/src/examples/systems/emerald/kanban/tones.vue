<script setup lang="ts">
  import { EmKanban, EmKanbanColumn } from '@paper/emerald'

  import type { EmKanbanTone } from '@paper/emerald'

  const columns: { title: string, note: string, tone: EmKanbanTone, cards: { value: string }[] }[] = [
    {
      title: 'Triage',
      note: 'Needs an owner',
      tone: 'alert',
      cards: [
        { value: 'Invoice #1842' },
        { value: 'Renewal reminder' },
      ],
    },
    {
      title: 'Building',
      note: 'In the branch',
      tone: 'info',
      cards: [
        { value: 'Launch checklist' },
      ],
    },
    {
      title: 'In review',
      note: 'Waiting on a pass',
      tone: 'secondary',
      cards: [
        { value: 'Design review' },
      ],
    },
    {
      title: 'Shipped',
      note: 'Merged to master',
      tone: 'primary',
      cards: [
        { value: 'Pricing page' },
        { value: 'Welcome emails' },
      ],
    },
  ]
</script>

<template>
  <EmKanban class="emerald-docs-kanban" label="Component board">
    <EmKanbanColumn
      v-for="column in columns"
      :key="column.title"
      v-slot="{ card }"
      :cards="column.cards"
      :note="column.note"
      :title="column.title"
      :tone="column.tone"
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
