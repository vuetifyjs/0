<script setup lang="ts">
  import { EmKanban, EmKanbanColumn } from '@paper/emerald'

  import type { EmKanbanTone } from '@paper/emerald'

  const columns: { title: string, note: string, tone: EmKanbanTone, cards: { value: string }[] }[] = [
    {
      title: 'Triage',
      note: 'Needs an owner',
      tone: 'alert',
      cards: [
        { value: 'Tooltip forwards the wrong element type' },
        { value: 'Tokens drop dot-path aliases' },
      ],
    },
    {
      title: 'Building',
      note: 'In the branch',
      tone: 'info',
      cards: [
        { value: 'Dark elevation rim replaces the shadow' },
      ],
    },
    {
      title: 'In review',
      note: 'Waiting on a pass',
      tone: 'secondary',
      cards: [
        { value: 'Drop indicator uses zone geometry' },
      ],
    },
    {
      title: 'Shipped',
      note: 'Merged to master',
      tone: 'primary',
      cards: [
        { value: 'Vapor harness runs in CI' },
        { value: 'Registry version signal documented' },
      ],
    },
  ]
</script>

<template>
  <EmKanban label="Component board">
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
