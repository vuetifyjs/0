<script setup lang="ts">
  import { EmKanban, EmKanbanColumn } from '@paper/emerald'

  import { shallowRef, useTemplateRef } from 'vue'

  import type { EmKanbanMovePayload } from '@paper/emerald'

  const columns = [
    {
      title: 'Backlog',
      cards: [
        { value: 'Audit the focus ring tokens' },
        { value: 'Split the icon sprite' },
      ],
    },
    {
      title: 'This week',
      cards: [
        { value: 'Ship the tag variants' },
      ],
    },
    {
      title: 'Done',
      cards: [
        { value: 'Rename the spacing scale' },
      ],
    },
  ]

  const board = useTemplateRef('board')
  const last = shallowRef('')

  function onMove (payload: EmKanbanMovePayload) {
    const column = board.value?.kanban.columns.get(payload.to)

    last.value = `${column?.value?.title ?? 'the board'}, position ${payload.toIndex + 1}`
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmKanban ref="board" label="Weekly board" @move="onMove">
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

    <p class="emerald-docs-note">
      Last move: <code>{{ last || 'none yet' }}</code>
    </p>
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

  .emerald-docs-note {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant);
  }
</style>
