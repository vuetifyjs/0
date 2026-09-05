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

  /* The board scrolls horizontally by design, but overlay scrollbars leave no
     signal that columns extend past the example edge. Fade the clipped edge;
     the fade tracks scroll position and vanishes at the reached edge, and an
     inactive timeline (board fits) keeps the no-fade base values. Example
     styles are document-global, so this rides the dedicated class shared by
     the kanban examples. */
  @property --kanban-fade-start {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  @property --kanban-fade-end {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  @supports (animation-timeline: scroll(self x)) {
    .emerald-docs-kanban {
      mask-image: linear-gradient(to right, transparent 0, black var(--kanban-fade-start), black calc(100% - var(--kanban-fade-end)), transparent 100%);
      -webkit-mask-image: linear-gradient(to right, transparent 0, black var(--kanban-fade-start), black calc(100% - var(--kanban-fade-end)), transparent 100%);
      animation: emerald-docs-kanban-fade linear both;
      animation-timeline: scroll(self x);
    }

    [dir='rtl'] .emerald-docs-kanban {
      mask-image: linear-gradient(to left, transparent 0, black var(--kanban-fade-start), black calc(100% - var(--kanban-fade-end)), transparent 100%);
      -webkit-mask-image: linear-gradient(to left, transparent 0, black var(--kanban-fade-start), black calc(100% - var(--kanban-fade-end)), transparent 100%);
    }
  }

  @keyframes emerald-docs-kanban-fade {
    0% {
      --kanban-fade-start: 0px;
      --kanban-fade-end: 2.5rem;
    }

    100% {
      --kanban-fade-start: 2.5rem;
      --kanban-fade-end: 0px;
    }
  }
</style>
