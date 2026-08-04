<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmKanban,
    EmKanbanColumn,
    EmTag,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { EmKanbanMovePayload, EmKanbanTone } from '@paper/emerald'

  type Priority = 'Blocker' | 'Normal' | 'Later'

  interface CardValue {
    ref: string
    title: string
    priority: Priority
    assignee: string
    due: string
  }

  interface Column {
    title: string
    note: string
    tone: EmKanbanTone
    cards: { value: CardValue }[]
  }

  const columns: Column[] = [
    {
      title: 'Triage',
      note: 'Needs an owner',
      tone: 'alert',
      cards: [
        { value: { ref: 'V0-741', title: 'Tooltip forwards the activator element type', priority: 'Normal', assignee: 'TR', due: 'Aug 11' } },
        { value: { ref: 'V0-756', title: 'createTokens drops dot-path aliases', priority: 'Blocker', assignee: 'PN', due: 'Aug 08' } },
        { value: { ref: 'DOC-88', title: 'Markdown layer eats inline code fences', priority: 'Later', assignee: 'YT', due: 'Aug 19' } },
      ],
    },
    {
      title: 'Building',
      note: 'In the branch',
      tone: 'info',
      cards: [
        { value: { ref: 'EM-204', title: 'Dark elevation rim replaces the drop shadow', priority: 'Blocker', assignee: 'KB', due: 'Aug 07' } },
        { value: { ref: 'V0-729', title: 'Combobox live region debounces on refilter', priority: 'Normal', assignee: 'HS', due: 'Aug 12' } },
        { value: { ref: 'NUX-31', title: 'Prefix useId and useHydration in the module', priority: 'Normal', assignee: 'OH', due: 'Aug 14' } },
      ],
    },
    {
      title: 'In review',
      note: 'Waiting on a pass',
      tone: 'secondary',
      cards: [
        { value: { ref: 'V0-762', title: 'Kanban drop indicator uses zone geometry', priority: 'Normal', assignee: 'DF', due: 'Aug 06' } },
        { value: { ref: 'V0-698', title: 'Splitter panel keeps order across remounts', priority: 'Later', assignee: 'PN', due: 'Aug 15' } },
      ],
    },
    {
      title: 'Shipped',
      note: 'Merged to master',
      tone: 'primary',
      cards: [
        { value: { ref: 'V0-420', title: 'Vapor harness runs in CI', priority: 'Blocker', assignee: 'DF', due: 'Jul 29' } },
        { value: { ref: 'V0-540', title: 'Registry version signal documented', priority: 'Normal', assignee: 'MV', due: 'Jul 24' } },
        { value: { ref: 'PLY-67', title: 'Playground pins TypeScript to 5.x', priority: 'Normal', assignee: 'YT', due: 'Jul 22' } },
      ],
    },
  ]

  const board = useTemplateRef('board')

  const total = shallowRef(columns.reduce((sum, column) => sum + column.cards.length, 0))
  const last = shallowRef('')

  // New work enters the board through the intake column; everything after that is
  // a drag away.
  function onAdd () {
    const [intake] = board.value?.kanban.columns.values() ?? []

    if (!intake) return

    intake.items.register({
      value: { ref: 'NEW', title: 'Untitled work item', priority: 'Normal', assignee: '—', due: 'TBD' } satisfies CardValue,
    })

    total.value++
  }

  function onMove (payload: EmKanbanMovePayload) {
    const column = board.value?.kanban.columns.get(payload.to)

    last.value = `${column?.value?.title ?? 'Board'}, position ${payload.toIndex + 1}`
  }

  const priorityVariant = { Blocker: 'danger', Normal: 'info', Later: 'neutral' } as const
</script>

<template>
  <EmeraldShell>
    <div class="adm-kanban">
      <header class="adm-kanban__header">
        <div>
          <h1 class="adm-kanban__title">Component board</h1>
          <p class="adm-kanban__subtitle">Everything moving through the v1.2 train. Drag a card to change its state or its order.</p>
        </div>

        <div class="adm-kanban__actions">
          <div class="adm-kanban__meta">
            <span class="adm-kanban__meta-count">{{ total }}</span>
            <span class="adm-kanban__meta-label">work items</span>
            <span v-if="last" class="adm-kanban__meta-last">Last move: {{ last }}</span>
          </div>

          <EmButton
            aria-label="Add a card to the intake column"
            class="adm-kanban__add"
            variant="tertiary"
            @click="onAdd"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="16"
            ><path d="M12 5v14M5 12h14" /></svg>
            Add card
          </EmButton>
        </div>
      </header>

      <EmKanban ref="board" label="Component board" @move="onMove">
        <EmKanbanColumn
          v-for="column in columns"
          :key="column.title"
          v-slot="{ card }"
          :cards="column.cards"
          :note="column.note"
          :title="column.title"
          :tone="column.tone"
        >
          <p class="adm-kanban__card-title">{{ card.value?.title }}</p>

          <div class="adm-kanban__card-meta">
            <span class="adm-kanban__card-ref">{{ card.value?.ref }}</span>

            <span class="adm-kanban__card-due">
              <svg
                aria-hidden="true"
                fill="none"
                height="12"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="12"
              ><path d="M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
              {{ card.value?.due }}
            </span>
          </div>

          <div class="adm-kanban__card-foot">
            <EmAvatar size="sm"><EmAvatarFallback>{{ card.value?.assignee }}</EmAvatarFallback></EmAvatar>
            <EmTag :variant="priorityVariant[card.value?.priority ?? 'Normal']">{{ card.value?.priority }}</EmTag>
          </div>
        </EmKanbanColumn>
      </EmKanban>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-kanban {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
    height: calc(100vh - 140px);
    min-height: 560px;
  }

  .adm-kanban__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-kanban__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-kanban__subtitle {
    margin: 0.25rem 0 0;
    max-width: 62ch;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-kanban__actions {
    flex: none;
    display: flex;
    align-items: stretch;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-kanban__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-l, 10px);
    background: var(--emerald-background, #fefefe);
  }

  .adm-kanban__meta-count {
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
    line-height: 1.1;
  }

  .adm-kanban__meta-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .adm-kanban__meta-last {
    margin-top: 2px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .adm-kanban__add {
    align-self: center;
    gap: var(--emerald-spacing-2xs, 4px);
  }

  /* Title leads, the reference leads with the priority pill. */
  .adm-kanban__card-title {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
    line-height: 1.4;
  }

  .adm-kanban__card-meta {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-kanban__card-ref {
    flex: 1;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    letter-spacing: 0.02em;
  }

  .adm-kanban__card-due {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  /* Assignee left, priority right — the pill moves off the card's top edge. */
  .adm-kanban__card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    padding-top: var(--emerald-spacing-xs, 8px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  @media (max-width: 720px) {
    .adm-kanban__header {
      flex-direction: column;
      align-items: stretch;
    }

    .adm-kanban__actions {
      justify-content: space-between;
    }

    .adm-kanban__meta {
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-start;
      gap: var(--emerald-spacing-xs, 8px);
    }
  }
</style>
