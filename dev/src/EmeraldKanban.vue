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
  import { shallowRef, toRef } from 'vue'

  // Types
  import type {
    ID,
    KanbanColumnTicket,
    KanbanColumnTicketInput,
    SortableTicketInput,
  } from '@vuetify/v0'
  import type { ComponentPublicInstance, ShallowRef } from 'vue'

  type Priority = 'Blocker' | 'Normal' | 'Later'

  interface CardValue {
    ref: string
    title: string
    priority: Priority
    assignee: string
    due: string
  }

  type CardTicket = SortableTicketInput<CardValue>
  type ColumnTicket = KanbanColumnTicketInput<CardTicket, { title: string, tone: string, note: string }>

  const kanban = createKanban<CardTicket, ColumnTicket>()

  const columns = kanban.columns.onboard([
    { value: { title: 'Triage', tone: 'triage', note: 'Needs an owner' } },
    { value: { title: 'Building', tone: 'building', note: 'In the branch' } },
    { value: { title: 'In review', tone: 'review', note: 'Waiting on a pass' } },
    { value: { title: 'Shipped', tone: 'shipped', note: 'Merged to master' } },
  ])

  const seedCards: CardValue[][] = [
    [
      { ref: 'V0-741', title: 'Tooltip forwards the activator element type', priority: 'Normal', assignee: 'TR', due: 'Aug 11' },
      { ref: 'V0-756', title: 'createTokens drops dot-path aliases', priority: 'Blocker', assignee: 'PN', due: 'Aug 08' },
      { ref: 'DOC-88', title: 'Markdown layer eats inline code fences', priority: 'Later', assignee: 'YT', due: 'Aug 19' },
    ],
    [
      { ref: 'EM-204', title: 'Dark elevation rim replaces the drop shadow', priority: 'Blocker', assignee: 'KB', due: 'Aug 07' },
      { ref: 'V0-729', title: 'Combobox live region debounces on refilter', priority: 'Normal', assignee: 'HS', due: 'Aug 12' },
      { ref: 'NUX-31', title: 'Prefix useId and useHydration in the module', priority: 'Normal', assignee: 'OH', due: 'Aug 14' },
    ],
    [
      { ref: 'V0-762', title: 'Kanban drop indicator uses zone geometry', priority: 'Normal', assignee: 'DF', due: 'Aug 06' },
      { ref: 'V0-698', title: 'Splitter panel keeps order across remounts', priority: 'Later', assignee: 'PN', due: 'Aug 15' },
    ],
    [
      { ref: 'V0-420', title: 'Vapor harness runs in CI', priority: 'Blocker', assignee: 'DF', due: 'Jul 29' },
      { ref: 'V0-540', title: 'Registry version signal documented', priority: 'Normal', assignee: 'MV', due: 'Jul 24' },
      { ref: 'PLY-67', title: 'Playground pins TypeScript to 5.x', priority: 'Normal', assignee: 'YT', due: 'Jul 22' },
    ],
  ]

  for (const [index, column] of columns.entries()) {
    column.items.onboard((seedCards[index] ?? []).map(value => ({ value })))
  }

  const columnsProxy = useProxyRegistry(kanban.columns)
  const itemsProxies = new Map(columns.map(column => [column.id, useProxyRegistry(column.items)]))

  const total = toRef(() => columns.reduce((sum, column) => sum + (itemsProxies.get(column.id)?.size ?? 0), 0))

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
      value: card.value ?? { ref: '—', title: '', priority: 'Normal', assignee: '', due: '' },
    })
  }

  const zones = new Map<ID, ReturnType<typeof dnd.zones.register>>()

  for (const column of columns) {
    zones.set(column.id, dnd.zones.register({
      id: column.id,
      el: columnEls.get(column.id)!,
      accept: ['card'],
      orientation: 'vertical',
      onDrop: (drag, position) => {
        kanban.transfer(drag.id, column.id, position.index ?? column.items.size)
      },
    }))

    for (const card of column.items.values()) registerCard(card)
  }

  /** Viewport-anchored bar marking the slot the card will land in. */
  const indicator = toRef(() => {
    const over = dnd.active.value?.over
    const mark = over ? zones.get(over)?.indicator.value : null
    if (!mark) return null
    const { edge, rect } = mark
    return {
      left: `${rect.left}px`,
      top: `${edge === 'before' ? rect.top : rect.bottom}px`,
      width: `${rect.width}px`,
    }
  })

  function onAddCard (column: KanbanColumnTicket<CardTicket, ColumnTicket>) {
    const card = column.items.register({ value: { ref: 'NEW', title: 'Untitled work item', priority: 'Normal', assignee: '—', due: 'TBD' } })
    registerCard(card)
  }

  const priorityVariant = { Blocker: 'danger', Normal: 'info', Later: 'neutral' } as const
</script>

<template>
  <EmeraldShell>
    <div class="adm-kanban" data-theme="emerald">
      <header class="adm-kanban__header">
        <div>
          <h1 class="adm-kanban__title">Component board</h1>
          <p class="adm-kanban__subtitle">Everything moving through the v1.2 train. Drag a card to change its state or its order.</p>
        </div>

        <div class="adm-kanban__meta">
          <span class="adm-kanban__meta-count">{{ total }}</span>
          <span class="adm-kanban__meta-label">work items</span>
        </div>
      </header>

      <div class="adm-kanban__board">
        <section
          v-for="column in columnsProxy.values"
          :key="column.id"
          class="adm-kanban__column"
          :data-tone="column.value?.tone"
        >
          <header class="adm-kanban__column-head">
            <div class="adm-kanban__column-heading">
              <h2>{{ column.value?.title }}<span class="adm-kanban__column-count">{{ itemsProxies.get(column.id)?.size ?? 0 }}</span></h2>
              <p>{{ column.value?.note }}</p>
            </div>

            <!-- Add lives in the column header, not as a trailing row under the stack. -->
            <EmButton
              :aria-label="`Add a card to ${column.value?.title}`"
              class="adm-kanban__add"
              variant="tertiary"
              @click="onAddCard(column)"
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
            </EmButton>
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
            </article>
          </div>
        </section>
      </div>

      <span v-if="indicator" aria-hidden="true" class="adm-kanban__indicator" :style="indicator" />
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

  .adm-kanban__meta {
    flex: none;
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

  .adm-kanban__board {
    display: flex;
    flex: 1;
    gap: var(--emerald-spacing-m, 16px);
    min-height: 0;
    overflow-x: auto;
    padding-bottom: var(--emerald-spacing-xs, 8px);
  }

  /* Columns sit on the page background with a tinted top rule instead of a
     filled tray. */
  .adm-kanban__column {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 288px;
    min-height: 0;
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px) var(--emerald-spacing-xs, 8px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-top: 3px solid var(--emerald-neutral-600, #939dac);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-kanban__column[data-tone='triage'] { border-top-color: var(--emerald-alert-600, #d9af00); }
  .adm-kanban__column[data-tone='building'] { border-top-color: var(--emerald-info-500, #3a70e2); }
  .adm-kanban__column[data-tone='review'] { border-top-color: var(--emerald-secondary-600, #00b4dc); }
  .adm-kanban__column[data-tone='shipped'] { border-top-color: var(--emerald-primary-600, #1fae60); }

  .adm-kanban__column-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    padding: 0 4px var(--emerald-spacing-s, 12px);
  }

  .adm-kanban__column-heading h2 {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-kanban__column-heading p {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .adm-kanban__column-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 18px;
    padding: 0 6px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
  }

  .adm-kanban__add {
    flex: none;
    padding: 4px;
  }

  .adm-kanban__cards {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    flex: 1;
    min-height: 80px;
    padding: 4px;
    border: 1px dashed transparent;
    border-radius: var(--emerald-radius-m, 8px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .adm-kanban__cards[data-drop-over] {
    border-color: var(--emerald-primary-500, #26c26d);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-kanban__indicator {
    position: fixed;
    z-index: 2;
    height: 2px;
    margin-top: -1px;
    border-radius: 999px;
    background: var(--emerald-primary-600, #1fae60);
    pointer-events: none;
  }

  /* Title leads, the reference leads with the priority pill. */
  .adm-kanban__card {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .adm-kanban__card:hover {
    border-color: var(--emerald-neutral-500, #a3afbe);
  }

  .adm-kanban__card[data-dragging] {
    opacity: 0.4;
  }

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

    .adm-kanban__meta {
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-start;
      gap: var(--emerald-spacing-xs, 8px);
    }

    .adm-kanban__column {
      width: 264px;
    }
  }
</style>
