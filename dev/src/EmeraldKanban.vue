<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmTag,
  } from '@paper/emerald'

  // Framework
  import { createKanban, useDragDrop, useProxyRegistry } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  // Types
  import type {
    ID,
    KanbanColumnTicket,
    KanbanColumnTicketInput,
    SortableTicketInput,
  } from '@vuetify/v0'
  import type { ComponentPublicInstance, ShallowRef } from 'vue'

  interface CardValue {
    title: string
    priority: 'High' | 'Medium' | 'Low'
    assignee: string
    due: string
  }

  type CardTicket = SortableTicketInput<CardValue>
  type ColumnTicket = KanbanColumnTicketInput<CardTicket, { title: string }>

  const kanban = createKanban<CardTicket, ColumnTicket>()

  const columns = kanban.columns.onboard([
    { value: { title: 'Backlog' } },
    { value: { title: 'In Progress' } },
    { value: { title: 'Review' } },
    { value: { title: 'Done' } },
  ])

  const seedCards: CardValue[][] = [
    [
      { title: 'AI Dashboard Research', priority: 'High', assignee: 'AC', due: 'Jul 05' },
      { title: 'Create Landing Page Wireframes', priority: 'Medium', assignee: 'BT', due: 'Jul 08' },
      { title: 'User Interview Analysis', priority: 'Low', assignee: 'DK', due: 'Jul 12' },
    ],
    [
      { title: 'Build Authentication Flow', priority: 'High', assignee: 'EM', due: 'Jul 15' },
      { title: 'Dark Mode Implementation', priority: 'Medium', assignee: 'FR', due: 'Jul 18' },
      { title: 'Mobile Responsive Layout', priority: 'High', assignee: 'GH', due: 'Jul 20' },
    ],
    [
      { title: 'Analytics Charts', priority: 'Medium', assignee: 'JL', due: 'Jul 22' },
      { title: 'Notification System', priority: 'High', assignee: 'KP', due: 'Jul 23' },
    ],
    [
      { title: 'Project Kickoff Deck', priority: 'High', assignee: 'MN', due: 'Jun 28' },
      { title: 'Design System Audit', priority: 'Medium', assignee: 'OP', due: 'Jun 30' },
      { title: 'Data Migration Script', priority: 'High', assignee: 'QR', due: 'Jul 02' },
    ],
  ]

  for (const [index, column] of columns.entries()) {
    column.items.onboard((seedCards[index] ?? []).map(value => ({ value })))
  }

  const columnsProxy = useProxyRegistry(kanban.columns)
  const itemsProxies = new Map(columns.map(column => [column.id, useProxyRegistry(column.items)]))

  const dnd = useDragDrop<{ type: 'card', value: CardValue }>()

  // useDragDrop's zone/draggable `el` must be a real ref — it's watched internally
  // to detect when the DOM node mounts. A plain Map lookup (even behind a getter)
  // has no reactive dependency, so that watch fires once pre-mount with `null` and
  // never re-runs once the template ref actually attaches the element.
  const columnEls = new Map<ID, ShallowRef<HTMLElement | null>>(columns.map(column => [column.id, shallowRef(null)]))
  const cardEls = new Map<ID, ShallowRef<HTMLElement | null>>()

  function setColumnEl (id: ID, el: Element | ComponentPublicInstance | null) {
    const ref = columnEls.get(id)
    if (ref) ref.value = (el as HTMLElement) ?? null
  }

  function setCardEl (id: ID, el: Element | ComponentPublicInstance | null) {
    const ref = cardEls.get(id)
    if (ref) ref.value = (el as HTMLElement) ?? null
  }

  function registerCard (card: { id: ID, value?: CardValue }) {
    const el = cardEls.get(card.id) ?? shallowRef<HTMLElement | null>(null)
    cardEls.set(card.id, el)
    dnd.draggables.register({
      id: card.id,
      el,
      type: 'card',
      value: card.value ?? { title: '', priority: 'Medium', assignee: '', due: '' },
    })
  }

  for (const column of columns) {
    dnd.zones.register({
      id: column.id,
      el: columnEls.get(column.id)!,
      accept: ['card'],
      orientation: 'vertical',
      onDrop: (drag, position) => {
        kanban.transfer(drag.id, column.id, position.index ?? column.items.size)
      },
    })

    for (const card of column.items.values()) registerCard(card)
  }

  function onAddCard (column: KanbanColumnTicket<CardTicket, ColumnTicket>) {
    const card = column.items.register({ value: { title: 'New task', priority: 'Medium', assignee: '—', due: 'TBD' } })
    registerCard(card)
  }

  const priorityVariant = { High: 'danger', Medium: 'info', Low: 'neutral' } as const
</script>

<template>
  <EmeraldShell>
    <div class="adm-kanban" data-theme="emerald">
      <header class="adm-kanban__header">
        <h1 class="adm-kanban__title">Kanban</h1>
        <p class="adm-kanban__subtitle">Drag cards between columns or drop them to reorder.</p>
      </header>

      <div class="adm-kanban__board">
        <section v-for="column in columnsProxy.values" :key="column.id" class="adm-kanban__column">
          <header class="adm-kanban__column-head">
            <h2>{{ column.value?.title }}</h2>
            <span class="adm-kanban__column-count">{{ itemsProxies.get(column.id)?.size ?? 0 }}</span>
          </header>

          <div
            :ref="el => setColumnEl(column.id, el)"
            class="adm-kanban__cards"
            :data-drop-over="dnd.active.value?.over === column.id || undefined"
          >
            <article
              v-for="card in itemsProxies.get(column.id)?.values"
              :key="card.id"
              :ref="el => setCardEl(card.id, el)"
              class="adm-kanban__card"
              :data-dragging="dnd.active.value?.id === card.id || undefined"
            >
              <div class="adm-kanban__card-top">
                <EmTag :variant="priorityVariant[card.value?.priority ?? 'Medium']">{{ card.value?.priority }}</EmTag>
              </div>

              <p class="adm-kanban__card-title">{{ card.value?.title }}</p>

              <div class="adm-kanban__card-foot">
                <EmAvatar size="sm"><EmAvatarFallback>{{ card.value?.assignee }}</EmAvatarFallback></EmAvatar>

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
            </article>

            <EmButton class="adm-kanban__add" variant="tertiary" @click="onAddCard(column)">
              <svg
                aria-hidden="true"
                fill="none"
                height="14"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="14"
              ><path d="M12 5v14M5 12h14" /></svg>
              Add New Item
            </EmButton>
          </div>
        </section>
      </div>
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

  .adm-kanban__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-kanban__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-kanban__board {
    display: flex;
    flex: 1;
    gap: var(--emerald-spacing-m, 16px);
    min-height: 0;
    overflow-x: auto;
    padding-bottom: var(--emerald-spacing-xs, 8px);
  }

  .adm-kanban__column {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 280px;
    min-height: 0;
  }

  .adm-kanban__column-head {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    padding: 0 4px var(--emerald-spacing-s, 12px);
  }

  .adm-kanban__column-head h2 {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-kanban__column-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
  }

  .adm-kanban__cards {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    flex: 1;
    min-height: 80px;
    padding: var(--emerald-spacing-xs, 8px);
    border: 1px dashed transparent;
    border-radius: var(--emerald-radius-m, 8px);
    overflow-y: auto;
  }

  .adm-kanban__cards[data-drop-over] {
    border-color: var(--emerald-primary-500, #26c26d);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-kanban__card {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .adm-kanban__card[data-dragging] {
    opacity: 0.4;
  }

  .adm-kanban__card-top {
    display: flex;
  }

  .adm-kanban__card-title {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-kanban__card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-kanban__card-due {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-kanban__add {
    justify-content: flex-start;
    width: 100%;
  }
</style>
