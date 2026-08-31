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
